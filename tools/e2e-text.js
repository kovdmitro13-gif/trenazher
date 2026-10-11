// Прогін теми без Python (choice / multi / text): node tools/e2e-text.js chyslivnyk
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const fs=require('fs'); const path=require('path');
const dir=process.argv[2]; const SH=process.env.SHOTS||'shots';
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch()); const log=[];
 for(const scheme of ['light','dark']){
  const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2,colorScheme:scheme,hasTouch:true,isMobile:true});
  const p=await ctx.newPage(); p.on('pageerror',e=>log.push('PAGEERROR '+e.message));
  await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
  await p.goto('file://'+path.resolve(__dirname,'..',dir,'index.html')); fs.mkdirSync(SH,{recursive:true});
  const shot=n=>p.screenshot({path:`${SH}/${dir}-${scheme}-${n}.png`,fullPage:true});
  const ov=async t=>{const o=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth); if(o>0) log.push(`OVERFLOW ${t}: ${o}px`);};
  await shot('00'); await p.fill('#who','Тестовий Учень'); await p.selectOption('#gr','2'); await p.click('text=Почати');
  const steps=await p.evaluate(()=>LESSON.steps.map(s=>({id:s.id,kind:s.kind,answers:s.answers,near:Object.keys(s.near||{}),ok:(s.options||[]).map(o=>!!o.ok)})));
  for(const [i,s] of steps.entries()){ await ov(s.id);
    if(s.kind==='choice'){ const o=await p.$$('.opt'); const k=s.ok.indexOf(true); await o[(k+1)%o.length].click(); if(!(await p.isVisible('.fb.bad'))) log.push(s.id+' wrong not flagged'); await o[k].click(); }
    if(s.kind==='multi'){ const o=await p.$$('.opt'); for(const x of o) await x.click(); await p.click('text=Перевірити'); if(s.ok.includes(false)&&!(await p.isVisible('.fb.bad'))) log.push(s.id+' all-selected passed');
      for(const [j,x] of o.entries()) if(!s.ok[j]) await x.click(); await p.click('text=Перевірити'); }
    if(s.kind==='text'){ for(const n of s.near){ await p.fill('.field input',n); await p.click('text=Перевірити'); const t=await p.innerText('.out'); if(/Перевір відмінок числівника/.test(t)||!/\S/.test(t)) log.push(s.id+' near not matched: '+n); if(await p.evaluate(id=>!!S.done[id],s.id)) log.push(s.id+' near ACCEPTED: '+n); }
      const accepted=await p.evaluate(a=>a.map(x=>[x, x.toUpperCase()+'.', '  '+x.replace(/'/g,'’')+' ']).flat().filter(v=>!LESSON.steps.some(()=>false)).map(v=>normUk(v)),s.answers); 
      const base=await p.evaluate(a=>a.map(x=>normUk(x)),s.answers); if(accepted.some(v=>!base.includes(v))) log.push(s.id+' variant normalisation fails');
      if(scheme==='light'&&i<12) await shot('near-'+s.id);
      await p.fill('.field input',' '+s.answers[0].replace(/'/g,'’').replace(/^./,c=>c.toUpperCase())+'. '); await p.click('text=Перевірити'); }
    if(s.kind==='formula'){ const st=await p.evaluate(i=>{const x=LESSON.steps[i]; return {start:x.start||'',answer:x.answer,near:Object.keys(x.near||{}),fill:x.fill||x.target};},i);
      if(st.start){ await p.click('[data-a=chk]'); if(!(await p.isVisible('.fb.bad'))) log.push(s.id+' start formula passed'); if(scheme==='light') await shot('start-'+s.id); }
      for(const n of st.near){ await p.fill('.field input',n.toLowerCase()); await p.click('[data-a=chk]'); const t=await p.innerText('.out'); if(!/Поки що ні/.test(t)) log.push(s.id+' near not rejected: '+n); if(t.split('\n').filter(x=>x.trim()).length<3) log.push(s.id+' near message missing: '+n); }
      await p.fill('.field input','=ROUND(E6,0)'); await p.click('[data-a=chk]'); if(!/крапка з комою/.test(await p.innerText('.out'))) log.push(s.id+' comma separator message missing');
      await p.fill('.field input','B6+C6'); await p.click('[data-a=chk]'); if(!/починається зі знака/.test(await p.innerText('.out'))) log.push(s.id+' no-equals message missing');
      await p.fill('.field input',' '+st.answer.toLowerCase().replace(/([*+/])/g,' $1 ')); await p.click('[data-a=put]'); await p.click('.mini'); if(scheme==='light'&&['x8','x18'].includes(s.id)) await shot('fx-'+s.id); await p.click('.mini'); await p.click('[data-a=chk]'); }
    await p.waitForTimeout(80);
    const done=await p.evaluate(id=>!!S.done[id]||LESSON.steps.find(x=>x.id===id).kind==='read',s.id); if(!done) log.push('NOT SOLVED '+s.id+' :: '+(await p.innerText('.out')));
    if((process.env.PICK||'0,1,2,10,14,17').split(',').map(Number).includes(i)) await shot(String(i+1).padStart(2,'0')+'-'+s.id);
    await p.click('#next'); }
  await ov('end'); await shot('99-end'); log.push(scheme+' end: '+(await p.innerText('.eyebrow'))+' | '+(await p.innerText('.score')).replace(/\n/g,' '));
  await ctx.close(); }
 await b.close(); console.log(log.join('\n'));
})();

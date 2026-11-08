// Загальний прогін теми: node tools/e2e-gen.js <каталог> [розв'язки.json] — світла й темна тема, 390 px.
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
const dir=process.argv[2]; const SOL=process.argv[3]?JSON.parse(fs.readFileSync(process.argv[3],'utf8')):{};
(async()=>{
 const b=await chromium.launch({executablePath:fs.existsSync('/opt/pw-browsers/chromium-1243/chrome-linux/chrome')?'/opt/pw-browsers/chromium-1243/chrome-linux/chrome':undefined}).catch(()=>chromium.launch());
 const log=[];
 for(const scheme of ['light','dark']){
  const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2,colorScheme:scheme,hasTouch:true,isMobile:true});
  const p=await ctx.newPage();
  p.on('pageerror',e=>log.push('PAGEERROR '+e.message)); p.on('console',m=>{ if(m.type()==='error') log.push('CONSOLE '+m.text()); });
  await p.route('**/*',r=>{ const u=r.request().url();
    if(u.includes('cdn.jsdelivr.net/npm/skulpt')) return r.fulfill({path:path.join('node_modules/skulpt/dist',u.split('/').pop()),contentType:'application/javascript'});
    if(u.startsWith('file:')) return r.continue(); return r.abort(); });
  await p.goto('file://'+path.resolve(dir,'index.html'));
  fs.mkdirSync('shots/'+dir,{recursive:true});
  const shot=n=>p.screenshot({path:`shots/${dir}/${scheme}-${n}.png`,fullPage:true});
  const overflow=async tag=>{ const o=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth); if(o>0) log.push(`OVERFLOW ${tag}: ${o}px`); };
  await p.fill('#who','Тестовий Учень'); await p.selectOption('#kl',await p.evaluate(()=>LESSON.classes[0])); await p.waitForTimeout(100); const og=await p.$$eval('#gr option',os=>os.map(o=>o.value).filter(Boolean)); if(og.length&&!(await p.inputValue('#gr'))) await p.selectOption('#gr',og[0]); await p.click('text=Почати');
  const steps=await p.evaluate(()=>LESSON.steps.map(s=>({id:s.id,kind:s.kind})));
  for(const [i,s] of steps.entries()){
    await overflow(s.id);
    if(s.kind==='read'){ const btns=await p.$$('.work .btn'); for(const x of btns){ await x.click(); await p.waitForTimeout(400);} 
      const cons=await p.$$eval('.con',a=>a.map(c=>c.innerText)); if(cons.length) log.push(`${s.id} run: ${JSON.stringify(cons)}`); }
    if(s.kind==='choice'){ const opts=await p.$$('.opt'); const okIdx=await p.evaluate(i=>LESSON.steps[i].options.findIndex(o=>o.ok),i);
      await opts[(okIdx+1)%opts.length].click(); if(!(await p.isVisible('.fb.bad'))) log.push(s.id+' wrong not flagged'); await opts[okIdx].click(); }
    if(s.kind==='multi'){ const opts=await p.$$('.opt'); const oks=await p.evaluate(i=>LESSON.steps[i].options.map(o=>!!o.ok),i);
      await opts[oks.indexOf(true)].click(); await p.click('button.pri:has-text("Перевірити")'); if(!(await p.isVisible('.fb.bad'))) log.push(s.id+' partial not flagged');
      for(const [k,o] of oks.entries()) if(o&&k!==oks.indexOf(true)) await opts[k].click(); await p.click('button.pri:has-text("Перевірити")'); }
    if(s.kind==='predict'){ const ans=await p.evaluate(i=>variantOf(LESSON.steps[i]).answer,i);
      await p.fill('.field input','999'); await p.click('button.pri:has-text("Перевірити")'); await p.fill('.field input','998'); await p.click('button.pri:has-text("Перевірити")');
      if(!(await p.isVisible('.fb.hint'))) log.push(s.id+' hint not shown after 2 misses');
      await p.fill('.field input',ans.replace(/\n/g,' ')); await p.click('button.pri:has-text("Перевірити")');
      if(!(await p.evaluate(id=>!!S.done[id],s.id))){ log.push(s.id+' single-line input failed for multiline answer — try textarea?'); } }
    if(s.kind==='text'){ const st=await p.evaluate(i=>LESSON.steps[i],i);
      for(const [w] of Object.entries(st.near||{})){ await p.fill('.field input',w); await p.click('button.pri:has-text("Перевірити")'); if(!(await p.isVisible('.fb.bad'))) log.push(s.id+' near not flagged '+w); }
      for(const a of st.answers.slice(1)){ const ok=await p.evaluate(([a,st])=>{const N=normUk; return st.answers.some(x=>N(x)===N(a));},[a,st]); if(!ok) log.push(s.id+' alt answer not normalized '+a); }
      await p.fill('.field input',st.answers[0]); await p.click('button.pri:has-text("Перевірити")'); }
    if(s.kind==='gaps'){ const sol=SOL[s.id]; const g=await p.$$('.gap'); for(const [k,x] of g.entries()) await x.fill((SOL[s.id+'_bad']||[])[k]||'x');
      await p.click('[data-a=chk]'); await p.waitForTimeout(600); if(!(await p.isVisible('.fb.bad'))) log.push(s.id+' bad gaps passed');
      for(const [k,x] of g.entries()) await x.fill(sol[k]); await p.click('[data-a=run]'); await p.waitForTimeout(500); log.push(s.id+' run: '+JSON.stringify(await p.innerText('.con'))); await p.click('[data-a=chk]'); await p.waitForTimeout(800); }
    if(s.kind==='fix'||s.kind==='code'){
      if(s.kind==='fix'){ await p.click('[data-a=chk]'); await p.waitForTimeout(800); if(!(await p.isVisible('.fb.bad'))) log.push(s.id+' orig code passed?!'); }
      if(SOL[s.id+'_bad']){ await p.fill('.ed',SOL[s.id+'_bad']); await p.click('[data-a=chk]'); await p.waitForTimeout(800); log.push(s.id+' bad -> '+(await p.innerText('.out')).replace(/\n/g,' | ').slice(0,200)); }
      await p.fill('.ed',SOL[s.id]); await p.click('[data-a=run]'); await p.waitForTimeout(500); await p.click('[data-a=chk]'); await p.waitForTimeout(1200); }
    await p.waitForTimeout(250);
    const done=await p.evaluate(id=>!!S.done[id]||LESSON.steps.find(x=>x.id===id).kind==='read',s.id); if(!done) log.push('NOT SOLVED '+s.id+' :: '+(await p.innerText('.out')).slice(0,300));
    if(scheme==='light') await shot(String(i+1).padStart(2,'0')+'-'+s.id);
    await p.click('#next');
  }
  await p.waitForTimeout(300); await overflow('end'); await shot('99-end'); log.push(scheme+' end: '+(await p.innerText('.score')).replace(/\n/g,' '));
  await ctx.close();
 }
 await b.close(); console.log(log.join('\n'));
})();

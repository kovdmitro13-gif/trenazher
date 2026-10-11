// Прогін усіх кроків теми на ширині телефона (світла й темна тема). Потрібні playwright і локальна копія skulpt (npm i skulpt@1.2.0).
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const fs=require('fs'); const path=require('path');
const SOL={ s5:`tickets = int(input("Скільки квитків? "))\nprice = 180\nprint("До сплати:", tickets * price, "грн")`,
 s10:`price = float(input("Ціна: ").replace(",", "."))\ntotal = price * 2\nprint("Два квитки:", total, "грн")`,
 s13:`m = int(input("Хвилин: "))\nprint(m // 60, "год", m % 60, "хв")`,
 s15:`row, seat = input("Ряд і місце: ").split()\nprint("Сусіднє місце:", int(seat) + 1)`,
 s16:`n, p = input().split()\nn = int(n)\np = int(p)\nmoney = int(input())\ntotal = n * p\nprint("До сплати:", total, "грн")\nprint("Решта:", money - total, "грн")`};
const BAD={ s13:`print("2 год 28 хв")`, s16:`n, p = input().split()\nprint("До сплати:", n * p, "грн")` };
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
 const log=[];
 for(const scheme of ['light','dark']){
  const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2,colorScheme:scheme,hasTouch:true,isMobile:true});
  const p=await ctx.newPage();
  p.on('pageerror',e=>log.push('PAGEERROR '+e.message)); p.on('console',m=>{ if(m.type()==='error') log.push('CONSOLE '+m.text()); });
  await p.route('**/*',r=>{ const u=r.request().url();
    if(u.includes('cdn.jsdelivr.net/npm/skulpt')) return r.fulfill({path:path.join(process.env.SKULPT_DIST||'node_modules/skulpt/dist',u.split('/').pop()),contentType:'application/javascript'});
    if(u.startsWith('file:')) return r.continue(); return r.abort(); });
  await p.goto('file://'+path.resolve(__dirname,'..','input/index.html'));
  const shot=n=>p.screenshot({path:`${process.env.SHOTS||'shots'}/${scheme}-${n}.png`,fullPage:true});
  fs.mkdirSync(process.env.SHOTS||'shots',{recursive:true});
  const overflow=async tag=>{ const o=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth); if(o>0) log.push(`OVERFLOW ${tag}: ${o}px`); };
  await shot('00-start'); await p.fill('#who','Тест'); await p.click('text=Почати'); 
  if(!(await p.isVisible('#whoErr'))) log.push('name validation missing');
  await p.fill('#who','Тестовий Учень'); await p.click('text=Почати'); if(await p.isVisible('#who')){} else log.push('started without group'); await p.selectOption('#gr','2'); await p.click('text=Почати');
  const steps=await p.evaluate(()=>LESSON.steps.map(s=>({id:s.id,kind:s.kind})));
  for(const [i,s] of steps.entries()){
    await overflow(s.id);
    if(s.kind==='read'){ const btns=await p.$$('.work .btn'); for(const x of btns){ await x.click(); await p.waitForTimeout(150);} 
      const cons=await p.$$eval('.con',a=>a.map(c=>c.innerText)); log.push(`${s.id} run: ${JSON.stringify(cons)}`); }
    if(s.kind==='choice'){ const opts=await p.$$('.opt'); const okIdx=await p.evaluate(i=>LESSON.steps[i].options.findIndex(o=>o.ok),i);
      await opts[(okIdx+1)%opts.length].click(); if(!(await p.isVisible('.fb.bad'))) log.push(s.id+' wrong not flagged'); await opts[okIdx].click(); }
    if(s.kind==='predict'){ const ans=await p.evaluate(i=>variantOf(LESSON.steps[i]).answer,i);
      await p.fill('.field input','999'); await p.click('text=Перевірити'); await p.fill('.field input','998'); await p.click('text=Перевірити');
      if(!(await p.isVisible('.fb.hint'))) log.push(s.id+' hint not shown after 2 misses');
      await p.fill('.field input',ans); await p.click('text=Перевірити'); }
    if(s.kind==='gaps'){ const g=await p.$$('.gap'); await g[0].fill('int'); await g[1].fill('int'); await p.click('[data-a=chk]'); await p.waitForTimeout(200);
      log.push(s.id+' int/int -> '+(await p.innerText('.out')).replace(/\n/g,' | ')); if(scheme==='light') await shot('gaps-fail');
      await g[0].fill('float'); await g[1].fill('float'); await p.click('[data-a=chk]'); await p.waitForTimeout(200); if(await p.evaluate(()=>!!S.done.s6)) log.push('s6 float/float PASSED (bad)'); await g[1].fill('int'); await p.click('[data-a=run]'); await p.waitForTimeout(150); log.push(s.id+' run: '+JSON.stringify(await p.innerText('.con'))); await p.click('[data-a=chk]'); }
    if(s.kind==='fix'||s.kind==='code'){
      if(s.kind==='fix'){ await p.click('[data-a=run]'); await p.waitForTimeout(200); log.push(s.id+' orig run: '+JSON.stringify((await p.innerText('.con')).slice(0,160)));
        await p.click('[data-a=chk]'); await p.waitForTimeout(200); if(!(await p.isVisible('.fb.bad'))) log.push(s.id+' orig code passed?!'); }
      if(BAD[s.id]){ await p.fill('.ed',BAD[s.id]); await p.click('[data-a=chk]'); await p.waitForTimeout(250); log.push(s.id+' bad -> '+(await p.innerText('.out')).replace(/\n/g,' | ')); if(scheme==='light'&&s.id==='s13') await shot('code-fail'); }
      await p.fill('.ed',SOL[s.id]); await p.click('[data-a=run]'); await p.waitForTimeout(150); await p.click('[data-a=chk]'); }
    await p.waitForTimeout(200);
    const done=await p.evaluate(id=>!!S.done[id]||LESSON.steps.find(x=>x.id===id).kind==='read',s.id); if(!done) log.push('NOT SOLVED '+s.id+' :: '+(await p.innerText('.out')));
    if([0,4,6,12].includes(i)) await shot(String(i+1).padStart(2,'0')+'-'+s.id);
    await p.click('#next');
  }
  await p.waitForTimeout(200); await overflow('end'); await shot('99-end'); log.push(scheme+' end: '+(await p.innerText('.eyebrow'))+' | '+(await p.innerText('.score')).replace(/\n/g,' '));
  // infinite loop + reload persistence
  await p.click('.seg >> nth=12'); await p.fill('.ed','while True:\n    pass'); await p.click('[data-a=run]'); await p.waitForTimeout(3800); log.push('loop: '+JSON.stringify(await p.innerText('.con')));
  await p.fill('.ed','x = int(input())\ny = int(input())\nprint(x+y)'); await p.click('[data-a=run]'); await p.waitForTimeout(300); log.push('starved: '+JSON.stringify(await p.innerText('.con')));
  await p.reload(); await p.waitForTimeout(300); log.push('after reload step idx='+await p.evaluate(()=>S.i)+' passed='+await p.evaluate(()=>passed()));
  await ctx.close();
 }
 await b.close(); console.log(log.join('\n'));
})();

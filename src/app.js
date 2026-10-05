/* ============ РУШІЙ ============ */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const el=(html)=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild;};
const isEx=s=>s.kind!=='read';
const KEY='trn:'+LESSON.id;
let S={name:'',klass:'',group:'',i:-1,done:{},tries:{},seen:{},drafts:{},sent:false};
try{const raw=localStorage.getItem(KEY); if(raw) S=Object.assign(S,JSON.parse(raw));}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}};

const KW=/^(?:and|or|not|if|else|elif|for|while|in|import|from|def|return|True|False|None|pass|break|continue)$/;
const BI=/^(?:print|input|int|float|str|type|len|round|bool|abs|min|max)$/;
function hl(src){
  const re=/(#.*$)|(f?"(?:[^"\\\n]|\\.)*"|f?'(?:[^'\\\n]|\\.)*')|([A-Za-z_]\w*)/gm;
  let out='',last=0,m;
  while((m=re.exec(src))){
    out+=esc(src.slice(last,m.index)); const t=esc(m[0]);
    out+= m[1]?`<span class="t-com">${t}</span>` : m[2]?`<span class="t-str">${t}</span>` : KW.test(m[0])?`<span class="t-kw">${t}</span>` : BI.test(m[0])?`<span class="t-fn">${t}</span>` : t;
    last=re.lastIndex;
  }
  return out+esc(src.slice(last));
}
function hash(str){let h=2166136261;for(const ch of str){h^=ch.codePointAt(0);h=Math.imul(h,16777619);}return h>>>0;}
const variantOf=st=>st.variants? st.variants[hash(S.name.trim().toLowerCase()+st.id)%st.variants.length] : st;
const norm=s=>String(s).replace(/\r/g,'').split('\n').map(l=>l.trim().replace(/\s+/g,' ')).filter((l,i,a)=>l!==''||a.slice(i).some(x=>x!=='')).join('\n').trim();

/* ---- запуск Python у браузері ---- */
const NOTES={
  TypeError:'Дія неможлива для таких типів, наприклад рядок + число. Перевір, чи перетворено введене на число.',
  ValueError:'Тип підходить, а вміст ні: рядок не вдається перетворити на число, або частин після split() не стільки, скільки змінних.',
  NameError:'Такого імені Python не знає. Перевір, чи немає одруківки в назві змінної або функції.',
  SyntaxError:'Python не зміг прочитати код. Перевір дужки, лапки й відступи в цьому рядку та в рядку перед ним. Назви змінних пиши латинськими літерами.',
  IndentationError:'Зайвий або пропущений відступ на початку рядка.',
  ZeroDivisionError:'Ділення на нуль.',
  TimeLimitError:'Програма працює надто довго. Схоже, вона не може зупинитися.',
  NoInput:'Програма просить ще одне значення, а в полі введення вони закінчилися. Додай значення з нового рядка.',
  LoadError:'Python ще не завантажився. Перевір інтернет і онови сторінку.'
};
function runPy(code,inputs){
  return new Promise(resolve=>{
    const segs=[]; let printed=''; let k=0, starved=false;
    if(typeof Sk==='undefined'){ resolve({segs,printed,error:{type:'LoadError',msg:'',line:0}}); return; }
    Sk.configure({
      output:s=>{printed+=s; segs.push({k:'out',s});},
      read:f=>{ if(!Sk.builtinFiles||Sk.builtinFiles.files[f]===undefined) throw "File not found: '"+f+"'"; return Sk.builtinFiles.files[f]; },
      inputfun:p=>{ if(p) segs.push({k:'prompt',s:String(p)}); if(k>=inputs.length){ starved=true; throw new Error('no input'); } const v=inputs[k++]; segs.push({k:'in',s:v+'\n'}); return v; },
      inputfunTakesPrompt:true, __future__:Sk.python3, execLimit:3000
    });
    Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<stdin>',false,code,true)).then(
      ()=>resolve({segs,printed,error:null}),
      e=>{
        let type=starved?'NoInput':(e&&e.tp$name)||'Error', line=(e&&e.traceback&&e.traceback[0]&&e.traceback[0].lineno)||0;
        let msg=starved?'':String(e).replace(/ on line \d+$/,'').replace(/^\w+:\s*/,'');
        resolve({segs,printed,error:{type,msg,line}});
      });
  });
}
function showRun(con,res){
  con.hidden=false;
  let h=res.segs.map(g=>`<span class="c-${g.k}">${esc(g.s)}</span>`).join('');
  if(res.error){
    const e=res.error;
    if(h && !/\n<\/span>$/.test(h)) h+='\n';
    if(e.type!=='NoInput'&&e.type!=='LoadError') h+=`<span class="c-err">${esc(e.type)}: ${esc(e.msg)}${e.line?` (рядок ${e.line})`:''}</span>`;
    h+=`<span class="c-note">${esc(NOTES[e.type]||'Програма зупинилася з помилкою. Прочитай її назву і номер рядка.')}</span>`;
  } else if(!res.segs.length){ h='<span class="c-prompt">Програма нічого не вивела.</span>'; }
  con.innerHTML=h;
}
const linesOf=v=>{const a=v.replace(/\r/g,'').split('\n'); while(a.length&&a[a.length-1]==='') a.pop(); return a;};

/* ---- редактор коду ---- */
const KEYS=[['Tab','    '],['(','('],[')',')'],['"','"'],[':',':'],['=','='],[',',','],['.','.'],['_','_'],['[','['],[']',']'],['%','%'],['/','/'],['*','*'],['+','+'],['-','-'],['#','#'],["'","'"]];
function fit(ta,min){ ta.rows=Math.max(min,ta.value.split('\n').length+ (min>2?1:0)); }
function insertAt(ta,text){ const a=ta.selectionStart,b=ta.selectionEnd; ta.value=ta.value.slice(0,a)+text+ta.value.slice(b); ta.selectionStart=ta.selectionEnd=a+text.length; ta.dispatchEvent(new Event('input')); }
function editor(st,idx,run,editable){
  const id=st.id+'-'+idx, dkey=id;
  const start=(editable && S.drafts[dkey]!==undefined)? S.drafts[dkey] : run.code;
  const box=el(`<div class="box">
    <div class="box-h">${esc(run.label||(st.kind==='code'?'Твоя програма':'Програма'))}</div>
    <textarea class="ed" id="ed-${id}" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Код програми" placeholder="# пиши код тут"></textarea>
    <div class="keys" aria-label="Символи для вставки">${KEYS.map(([l,v])=>`<button type="button" data-ins="${esc(v)}" tabindex="-1">${esc(l)}</button>`).join('')}</div>
    <div class="stdin"><label for="in-${id}">Що вводить користувач (кожне значення з нового рядка)</label>
      <textarea id="in-${id}" rows="1" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div>
    <div class="con" hidden></div></div>`);
  const ta=$('.ed',box), inp=$('.stdin textarea',box), con=$('.con',box);
  ta.value=start; inp.value=run.stdin||''; fit(ta,st.kind==='code'?5:2); fit(inp,1);
  ta.addEventListener('input',()=>{fit(ta,st.kind==='code'?5:2); S.drafts[dkey]=ta.value; save();});
  inp.addEventListener('input',()=>fit(inp,1));
  ta.addEventListener('keydown',e=>{ if(e.key==='Tab'&&!e.shiftKey){e.preventDefault(); insertAt(ta,'    ');} });
  $('.keys',box).addEventListener('pointerdown',e=>{ const b=e.target.closest('button'); if(!b) return; e.preventDefault(); ta.focus(); insertAt(ta,b.dataset.ins); });
  return {box,ta,inp,con, code:()=>ta.value, runNow:async()=>{ const r=await runPy(ta.value,linesOf(inp.value)); showRun(con,r); return r; }};
}

/* ---- перевірка тестами ---- */
async function check(code,tests){
  for(let t=0;t<tests.length;t++){
    const r=await runPy(code,tests[t].in);
    const want=norm(tests[t].out).split('\n'), got=norm(r.printed).split('\n');
    const tail=got.slice(-want.length).join('\n');
    if(r.error || tail!==want.join('\n')) return {ok:false,t,test:tests[t],res:r};
  }
  return {ok:true};
}
function failBox(f,code){
  const r=f.res, first=f.t===0;
  let got = r.printed.trim()? esc(r.printed.trim().slice(0,400)) : (r.error?'':'<i>нічого</i>');
  if(r.error) got+=(r.printed.trim()?'\n':'')+esc(r.error.type==='NoInput'?'програма чекає ще одного введення':r.error.type+(r.error.line?` (рядок ${r.error.line})`:''));
  return `<div class="fb bad"><b>${first?'Поки що ні.':'На перших даних працює, на інших ні.'}</b>
    <dl><dt>Введено</dt><dd><pre>${esc(f.test.in.join('\n'))||'—'}</pre></dd>
    ${first?`<dt>Треба</dt><dd><pre>${esc(f.test.out)}</pre></dd>`:''}
    <dt>Вивела</dt><dd><pre>${got}</pre></dd></dl>
    ${first?'':'<span>Перевір, чи програма працює для будь-яких даних, а не лише для прикладу.</span>'}</div>`;
}

/* ---- екрани ---- */
const app=$('#app');
const total=LESSON.steps.filter(isEx).length;
const passed=()=>LESSON.steps.filter(s=>isEx(s)&&S.done[s.id]).length;
const grade=()=>Math.max(1,Math.round(12*passed()/total));

function drawTop(){
  const top=$('#top'); top.hidden=S.i<0;
  if(S.i<0) return;
  const fin=S.i>=LESSON.steps.length, st=LESSON.steps[Math.min(S.i,LESSON.steps.length-1)];
  $('#topSec').innerHTML=fin?'<b>Підсумок</b>':`<b>${esc(LESSON.sections[st.sec])}</b>`;
  $('#topCnt').textContent=`вправ зараховано: ${passed()} з ${total}`;
  const segs=$('#segs'); segs.innerHTML='';
  LESSON.sections.forEach((name,si)=>{
    const g=el(`<div class="seg-group" title="${esc(name)}"></div>`);
    LESSON.steps.forEach((s,idx)=>{ if(s.sec!==si) return;
      const b=el(`<button type="button" class="seg" aria-label="Крок ${idx+1}: ${esc(s.title)}"></button>`);
      if(S.done[s.id]) b.classList.add('done'); else if(S.seen[s.id]) b.classList.add('seen');
      if(idx===S.i) b.classList.add('cur');
      b.addEventListener('click',()=>go(idx)); g.appendChild(b); });
    segs.appendChild(g);
  });
}
function go(i){ S.i=i; save(); render(); window.scrollTo(0,0); }

function render(){
  drawTop();
  if(S.i<0) return renderStart();
  if(S.i>=LESSON.steps.length) return renderEnd();
  renderStep(LESSON.steps[S.i]);
}

function renderStart(){
  app.innerHTML='';
  const v=el(`<section class="step" style="padding-top:28px">
    <span class="eyebrow">${esc(LESSON.subject)} · сюжет «${esc(LESSON.plot)}»</span>
    <h1>${esc(LESSON.title)}</h1>
    <div class="prose"><p>Тут ${LESSON.steps.length} кроків: коротке пояснення, одразу вправа. Вправ ${total}, код запускається просто в телефоні. Часу треба приблизно ${LESSON.minutes} хвилин.</p>
    <p>Спроб скільки завгодно. Можна перерватися і продовжити пізніше з цього ж телефона.</p></div>
    <form class="field" id="startForm"><label for="who">Прізвище та ім'я</label>
      <input type="text" id="who" autocomplete="name" value="${esc(S.name)}" placeholder="Наприклад: Шевченко Тарас">
      <div class="pair">
        <div><label for="kl">Клас</label><select id="kl">${LESSON.classes.map(c=>`<option ${c===(S.klass||LESSON.klass)?'selected':''}>${esc(c)}</option>`).join('')}</select></div>
        <div><label for="gr">Група</label><select id="gr"><option value="">обери</option>${LESSON.groups.map(g=>`<option ${g===S.group?'selected':''}>${esc(g)}</option>`).join('')}</select></div>
      </div>
      <div class="fb bad" id="whoErr" hidden>Впиши прізвище та ім'я і обери групу, щоб учитель бачив, чий це результат.</div>
      <div class="row" style="margin-top:8px"><button class="btn pri" type="submit">Почати</button></div></form>
  </section>`);
  $('#startForm',v).addEventListener('submit',e=>{ e.preventDefault(); const n=$('#who',v).value.trim().replace(/\s+/g,' ');
    const g=$('#gr',v).value; if(n.split(' ').length<2||!g){ $('#whoErr',v).hidden=false; return; } S.name=n; S.klass=$('#kl',v).value; S.group=g; go(0); });
  app.appendChild(v);
}

const KIND={read:'Пояснення',predict:'Що виведе',choice:'Вибери відповідь',fix:'Знайди помилку',gaps:'Встав пропущене',code:'Напиши код'};
function renderStep(st){
  S.seen[st.id]=true; save();
  app.innerHTML='';
  const done=!!S.done[st.id];
  const v=el(`<section class="step" style="padding-top:6px">
    <span class="kind ${done?'ok':''}">${KIND[st.kind]}${done?' · зараховано':''}</span>
    <h2>${esc(st.title)}</h2>
    <div class="prose">${st.body||''}</div>
    <div class="work step"></div>
    <div class="out step"></div>
    <div class="nav"><button class="btn quiet" type="button" id="prev" ${S.i===0?'disabled':''}>Назад</button>
      <button class="btn ${(!isEx(st)||done)?'pri':'quiet'}" type="button" id="next">${(!isEx(st)||done)?(S.i===LESSON.steps.length-1?'До підсумку':'Далі'):'Пропустити'}</button></div>
  </section>`);
  $('#prev',v).addEventListener('click',()=>go(S.i-1));
  $('#next',v).addEventListener('click',()=>go(S.i+1));
  const work=$('.work',v), out=$('.out',v);
  const solved=()=>{ S.done[st.id]=true; save(); drawTop();
    const k=$('.kind',v); k.classList.add('ok'); k.textContent=KIND[st.kind]+' · зараховано';
    const n=$('#next',v); n.className='btn pri'; n.textContent=S.i===LESSON.steps.length-1?'До підсумку':'Далі'; };
  const miss=()=>{ S.tries[st.id]=(S.tries[st.id]||0)+1; save(); };
  const hintHtml=()=> (st.hint && (S.tries[st.id]||0)>=2 && !S.done[st.id])? `<div class="fb hint"><b>Підказка</b><span>${esc(st.hint)}</span></div>`:'';
  const okHtml=()=>`<div class="fb ok"><b>Правильно.</b><span>${st.explain||''}</span></div>`;

  if(st.kind==='read'){
    st.runs.forEach((run,idx)=>{ const ed=editor(st,idx,run,false);
      const b=el('<div class="row"><button class="btn" type="button">Запустити</button></div>');
      $('button',b).addEventListener('click',()=>ed.runNow()); work.append(ed.box,b); });
    if(st.after) out.innerHTML=`<div class="prose">${st.after}</div>`;
  }
  else if(st.kind==='choice'){
    if(st.code) work.appendChild(el(`<div class="box"><pre class="code">${hl(st.code)}</pre></div>`));
    const opts=el('<div class="opts" role="group" aria-label="Варіанти відповіді"></div>');
    st.options.forEach(o=>{ const b=el(`<button type="button" class="opt">${esc(o.t)}</button>`);
      if(done&&o.ok) b.classList.add('right');
      b.addEventListener('click',()=>{ if(S.done[st.id]) return;
        if(o.ok){ S.tries[st.id]=(S.tries[st.id]||0)+1; b.classList.add('right'); out.innerHTML=`<div class="fb ok"><b>Правильно.</b><span>${esc(o.why)}</span></div>`; solved(); }
        else { miss(); b.classList.add('wrong'); out.innerHTML=`<div class="fb bad"><b>Ні.</b><span>${esc(o.why)}</span></div>`; } });
      opts.appendChild(b); });
    work.appendChild(opts);
    if(done) out.innerHTML=`<div class="fb ok"><b>Правильно.</b><span>${esc(st.options.find(o=>o.ok).why)}</span></div>`;
  }
  else if(st.kind==='predict'){
    const va=variantOf(st);
    work.appendChild(el(`<div class="box"><pre class="code">${hl(va.code)}</pre></div>`));
    const f=el(`<form class="field"><label for="ans-${st.id}">Програма виведе</label>
      <input type="text" class="mono" id="ans-${st.id}" autocapitalize="off" autocomplete="off" spellcheck="false" ${done?`value="${esc(va.answer)}"`:''}>
      <div class="row" style="margin-top:6px"><button class="btn pri" type="submit">Перевірити</button></div></form>`);
    f.addEventListener('submit',e=>{ e.preventDefault(); if(S.done[st.id]) return;
      const a=$('input',f).value; if(!a.trim()) return;
      if(norm(a)===norm(va.answer)){ S.tries[st.id]=(S.tries[st.id]||0)+1; out.innerHTML=okHtml(); solved(); }
      else { miss(); out.innerHTML=`<div class="fb bad"><b>Ні.</b><span>Пройди програму рядок за рядком і стеж за типом кожної змінної.</span></div>`+hintHtml(); } });
    work.appendChild(f); if(done) out.innerHTML=okHtml();
  }
  else if(st.kind==='gaps'){
    const parts=st.code.split('____'); const saved=S.drafts[st.id+'-g']||[];
    const pre=el('<pre class="code"></pre>');
    parts.forEach((p,i)=>{ pre.insertAdjacentHTML('beforeend',hl(p)); if(i<parts.length-1) pre.insertAdjacentHTML('beforeend',`<input class="gap" id="gap-${st.id}-${i}" aria-label="Пропуск ${i+1}" autocapitalize="off" autocomplete="off" spellcheck="false" value="${esc(saved[i]||'')}">`); });
    const box=el(`<div class="box"><div class="box-h">Програма з пропусками</div></div>`); box.appendChild(pre);
    box.appendChild(el(`<div class="stdin"><label for="in-${st.id}">Що вводить користувач (кожне значення з нового рядка)</label><textarea id="in-${st.id}" rows="2" spellcheck="false" autocapitalize="off">${esc(st.stdin||'')}</textarea></div>`));
    const con=el('<div class="con" hidden></div>'); box.appendChild(con);
    const gaps=()=>[...pre.querySelectorAll('.gap')].map(g=>g.value.trim());
    const build=()=>{ const g=gaps(); return parts.map((p,i)=>p+(i<g.length?g[i]:'')).join(''); };
    pre.addEventListener('input',()=>{ S.drafts[st.id+'-g']=gaps(); save(); });
    const row=el('<div class="row"><button class="btn" type="button" data-a="run">Запустити</button><button class="btn pri" type="button" data-a="chk">Перевірити</button></div>');
    row.addEventListener('click',async e=>{ const a=e.target.dataset.a; if(!a) return;
      if(gaps().some(g=>!g)){ out.innerHTML='<div class="fb bad"><span>Заповни всі пропуски.</span></div>'; return; }
      if(a==='run'){ showRun(con,await runPy(build(),linesOf($('textarea',box).value))); return; }
      const r=await check(build(),st.tests);
      if(r.ok){ if(!S.done[st.id]) S.tries[st.id]=(S.tries[st.id]||0)+1; out.innerHTML=okHtml(); solved(); } else { miss(); out.innerHTML=failBox(r)+hintHtml(); } });
    work.append(box,row); if(done) out.innerHTML=okHtml();
  }
  else { /* fix, code */
    const ed=editor(st,0,{code:st.code,stdin:st.stdin},true);
    const row=el(`<div class="row"><button class="btn" type="button" data-a="run">Запустити</button><button class="btn pri" type="button" data-a="chk">Перевірити</button>${st.kind==='fix'?'<button class="btn quiet" type="button" data-a="reset">Повернути початковий код</button>':''}</div>`);
    row.addEventListener('click',async e=>{ const a=e.target.dataset.a; if(!a) return;
      if(a==='reset'){ ed.ta.value=st.code; ed.ta.dispatchEvent(new Event('input')); ed.con.hidden=true; return; }
      if(a==='run'){ await ed.runNow(); return; }
      if(!ed.code().trim()){ out.innerHTML='<div class="fb bad"><span>Спочатку напиши програму.</span></div>'; return; }
      const r=await check(ed.code(),st.tests);
      if(r.ok){ if(!S.done[st.id]) S.tries[st.id]=(S.tries[st.id]||0)+1; out.innerHTML=okHtml(); solved(); } else { miss(); out.innerHTML=failBox(r)+hintHtml(); } });
    work.append(ed.box,row); if(done) out.innerHTML=okHtml();
  }
  app.appendChild(v);
}

function renderEnd(){
  app.innerHTML='';
  const rows=LESSON.steps.filter(isEx).map(s=>{ const ok=!!S.done[s.id], n=S.tries[s.id]||0;
    return `<tr><td><span class="${ok?'y':'n'}">${ok?'✓':'—'}</span> ${esc(s.title)} <span class="more">(${KIND[s.kind].toLowerCase()})</span></td><td>${n?('спроб: '+n):'не розпочато'}</td></tr>`; }).join('');
  const now=new Date(), stamp=now.toLocaleDateString('uk-UA')+' '+now.toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'});
  const v=el(`<section class="step" style="padding-top:6px">
    <span class="eyebrow">${esc(S.klass)}, група ${esc(S.group)} · ${esc(LESSON.title)}</span>
    <h1>${esc(S.name)}</h1>
    <div class="score"><div><span class="big">${passed()} з ${total}</span><small>вправ зараховано</small></div>
      <div><span class="big">${grade()}</span><small>орієнтовна оцінка з 12</small></div></div>
    <div id="sendBox"></div>
    <table class="sum"><tbody>${rows}</tbody></table>
    <p class="stamp">Станом на ${esc(stamp)}. Незараховані вправи можна доробити: натисни на сіру смужку вгорі.</p>
    <div class="nav"><button class="btn quiet" type="button" id="back">Назад до вправ</button>
      <button class="btn quiet" type="button" id="reset">Почати спочатку</button></div>
    <div id="resetBox"></div>
  </section>`);
  $('#back',v).addEventListener('click',()=>go(LESSON.steps.length-1));
  $('#reset',v).addEventListener('click',()=>{ const b=$('#resetBox',v);
    b.innerHTML='<div class="fb bad"><span>Увесь прогрес у цій темі буде стерто.</span><div class="row"><button class="btn" type="button" id="yes">Стерти і почати спочатку</button><button class="btn quiet" type="button" id="no">Залишити</button></div></div>';
    $('#no',b).addEventListener('click',()=>b.innerHTML='');
    $('#yes',b).addEventListener('click',()=>{ S={name:S.name,klass:S.klass,group:S.group,i:-1,done:{},tries:{},seen:{},drafts:{},sent:false}; save(); render(); }); });
  const sb=$('#sendBox',v);
  if(!LESSON.submitUrl){ sb.innerHTML='<div class="fb hint"><b>Пробна версія</b><span>Результат учителю не надсилається. Покажи цей екран або зроби знімок.</span></div>'; }
  else {
    const send=()=>{ sb.innerHTML='<div class="fb hint"><span>Надсилаю результат учителю…</span></div>';
      const body=JSON.stringify({lesson:LESSON.id,klass:S.klass,group:S.group,name:S.name,passed:passed(),total,grade:grade(),tries:S.tries,done:Object.keys(S.done),ts:now.toISOString()});
      fetch(LESSON.submitUrl,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body})
       .then(()=>{ S.sent=passed(); save(); sb.innerHTML='<div class="fb ok"><b>Результат надіслано учителю.</b><span>Якщо доробиш вправи, відкрий підсумок ще раз: надішлеться оновлений.</span></div>'; })
       .catch(()=>{ sb.innerHTML='<div class="fb bad"><b>Не вдалося надіслати.</b><span>Перевір інтернет і натисни ще раз.</span><div class="row"><button class="btn" type="button" id="again">Надіслати ще раз</button></div></div>'; $('#again',sb).addEventListener('click',send); }); };
    send();
  }
  app.appendChild(v);
}
render();

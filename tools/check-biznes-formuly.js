// Перевірка теми biznes-formuly без браузера: еталонні формули, початкові (хибні), типові хибні (near), готові числа, альтернативні правильні
const fs=require('fs'), path=require('path'); global.SHEET=require('../src/sheet.js');
const L=new Function(fs.readFileSync(path.join(__dirname,'../src/lesson-biznes-formuly.js'),'utf8')+';return LESSON')();
const same=(a,b)=>(typeof a==='number'&&typeof b==='number'&&Math.abs(a-b)<1e-6)||(typeof a==='string'&&typeof b==='string'&&a===b); let bad=0;
const apply=(st,f,o)=>{ const fill=st.fill||st.target; const c=SHEET.fillFormula(Object.assign({},st.sheet.cells,o||{}),st.target,fill,f); const g=SHEET.evaluator(c); return SHEET.rangeCells(fill).map(a=>g(a)); };
const passes=(st,f)=>{ try{ SHEET.parse(f); }catch(e){ return 'parse:'+e.code; } const w=apply(st,st.answer), g=apply(st,f); if(g.some((x,i)=>!same(x,w[i]))) return 'base'; for(const o of st.alts||[]){ const w2=apply(st,st.answer,o), g2=apply(st,f,o); if(g2.some((x,i)=>!same(x,w2[i]))) return 'alt'; } return 'OK'; };
for(const st of L.steps.filter(s=>s.kind==='formula')){
  const ff=a=>(st.sheet.fmt||{})[a]||(st.sheet.fmt||{})[a.replace(/\d+/,'')]; const cells=SHEET.rangeCells(st.fill||st.target);
  const vals=apply(st,st.answer); console.log(st.id, st.answer.padEnd(34), '→', cells.map((a,i)=>a+'='+SHEET.fmt(vals[i],ff(a))).join(' '));
  if(passes(st,st.answer)!=='OK'){ bad++; console.log('  !! answer fails'); }
  if(vals.some(v=>v instanceof SHEET.FErr)){ bad++; console.log('  !! answer gives error'); }
  for(const o of st.alts||[]){ const w=apply(st,st.answer,o); if(w.every((x,i)=>same(x,vals[i]))){ bad++; console.log('  !! alt changes nothing',JSON.stringify(o)); } }
  if(st.start){ const r=passes(st,st.start); console.log('   start',st.start,'→',r,'|',apply(st,st.start).map((v,i)=>SHEET.fmt(v,ff(cells[i]))).join(' ')); if(r==='OK'){ bad++; console.log('  !! start passes'); } }
  for(const n of Object.keys(st.near||{})){ const r=passes(st,n); if(r==='OK'){ bad++; console.log('  !! near passes',n); } else if(r.startsWith('parse')){ bad++; console.log('  !! near unparsable (never shown)',n,r); } else console.log('   near',n.padEnd(34),'→',r); }
  const v0=vals[0]; const hard=typeof v0==='number'?'='+String(v0).replace('.',','):'="'+v0+'"'; const r=passes(st,hard); if(r==='OK'){ bad++; console.log('  !! hardcoded passes',hard); }
}
const alt={k2:['=D6*(1+B$3)','=D6+D6*$B$3','=(1+$B$3)*D6'],k3:['=-D6+F6'],k5:['=LEFT(UPPER(A6);3)','=upper(left(a6;3))'],k6:['=UPPER(LEFT(A6;3)&"-"&F6)','=UPPER(LEFT(A6;3))&"-"&ROUND(E6;0)'],
  k9:['=len(A6)'],k12:['=COUNTIF(B$4:F$8;A10)','=COUNTIF($B$4:$F$8;$A10)'],k15:['=ABS(C6-B6)/C6','=ABS((B6-C6)/C6)'],k17:['=COUNTIF(F6:F10;"Підтверджено")','=COUNTIF($F$6:$F$10;"підтверджено")'],
  k19:['=SUM(B5:B11)'],k20:['=B14/$E14','=B14/SUM($B$14:$D$14)'],k21:['=SUM(E5:E11)/7','=E12/7'],k22:['=MAX(B5:B11)+0*0']};
for(const [id,fs_] of Object.entries(alt)) for(const f of fs_){ const st=L.steps.find(s=>s.id===id); const r=passes(st,f); console.log('   альтернатива',id,f.padEnd(34),'→',r); if(r!=='OK'&&!(id==='k22'&&f.startsWith('=MAX(B'))&&!(id==='k21'&&f==='=E12/7')){ bad++; } }
// показані таблиці read/choice/text
for(const id of ['k1','k11','k13','k16','k18']){ const st=L.steps.find(s=>s.id===id); const g=SHEET.evaluator(st.sheet.cells); const ff=a=>(st.sheet.fmt||{})[a]||(st.sheet.fmt||{})[a.replace(/\d+/,'')];
  const show=st.sheet.rows.flatMap(r=>st.sheet.cols.split('').map(c=>c+r)).filter(a=>String(st.sheet.cells[a]||'')[0]==='=');
  console.log(id, show.map(a=>a+'='+SHEET.fmt(g(a),ff(a))).join(' ')); if(show.some(a=>g(a) instanceof SHEET.FErr)){ bad++; console.log('  !! error in shown sheet'); } }
const ex=L.steps.filter(s=>s.kind!=='read').length; console.log('steps',L.steps.length,'ex',ex, bad?('PROBLEMS: '+bad):'ALL OK');

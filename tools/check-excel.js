// Перевірка теми excel без браузера: еталонні формули, початкові (хибні) формули, типові хибні варіанти, приховані набори даних
const fs=require('fs'), path=require('path'); global.SHEET=require('../src/sheet.js');
const L=new Function(fs.readFileSync(path.join(__dirname,'../src/lesson-excel.js'),'utf8')+';return LESSON')();
const same=(a,b)=>typeof a==='number'&&typeof b==='number'&&Math.abs(a-b)<1e-6; let bad=0; const out={};
const apply=(st,f,o)=>{ const fill=st.fill||st.target; const c=SHEET.fillFormula(Object.assign({},st.sheet.cells,o||{}),st.target,fill,f); const g=SHEET.evaluator(c); return SHEET.rangeCells(fill).map(a=>g(a)); };
const passes=(st,f)=>{ try{ SHEET.parse(f); }catch(e){ return 'parse:'+e.code; } const w=apply(st,st.answer), g=apply(st,f); if(g.some((x,i)=>!same(x,w[i]))) return 'base'; for(const o of st.alts||[]){ const w2=apply(st,st.answer,o), g2=apply(st,f,o); if(g2.some((x,i)=>!same(x,w2[i]))) return 'alt'; } return 'OK'; };
for(const st of L.steps.filter(s=>s.kind==='formula')){
  const ff=a=>(st.sheet.fmt||{})[a]||(st.sheet.fmt||{})[a.replace(/\d+/,'')]; const cells=SHEET.rangeCells(st.fill||st.target);
  const vals=apply(st,st.answer); out[st.id]=cells.map((a,i)=>a+'='+SHEET.fmt(vals[i],ff(a))).join(' ');
  console.log(st.id, st.answer.padEnd(18), '→', out[st.id]);
  if(passes(st,st.answer)!=='OK'){ bad++; console.log('  !! answer fails'); }
  if(vals.some(v=>typeof v!=='number')){ bad++; console.log('  !! answer gives non-number'); }
  if(st.start){ const r=passes(st,st.start); console.log('   start',st.start,'→',r, '|', apply(st,st.start).map((v,i)=>SHEET.fmt(v,ff(cells[i]))).join(' ')); if(r==='OK'){ bad++; console.log('  !! start passes'); } }
  for(const n of Object.keys(st.near||{})){ const r=passes(st,n); if(r==='OK'){ bad++; console.log('  !! near passes',n); } else console.log('   near',n.padEnd(18),'→',r); }
  // готове число замість формули має впасти на прихованих даних
  const hard='='+String(vals[0]).replace('.',','); const r=passes(st,hard); if(r==='OK'){ bad++; console.log('  !! hardcoded passes',hard); }
}
const alt={x3:['=C6+B6','=SUM(B6:C6)'],x8:['=D6*(1+B$3)','=D6+D6*$B$3','=(1+$B$3)*D6'],x14:['=ROUND(E6;0)','=ROUND(D6*(1+$B$3);0)'],x16:['=SUM(F6:F10)/5','=AVERAGE(F6;F7;F8;F9;F10)'],x18:['=C$3*$B4'],x21:['=B4/B$9','=B4/SUM($B$4:$B$8)'],x22:['=B4+B5+B6+B7+B8'],x23:['=SUM(B4:B8)/5','=B9/5'],x25:['=MEDIAN(B4:B10)']};
for(const [id,fs_] of Object.entries(alt)) for(const f of fs_){ const st=L.steps.find(s=>s.id===id); const r=passes(st,f); console.log('   альтернатива',id,f.padEnd(26),'→',r); if(r!=='OK'){ bad++; } }
// тексти з формулами: звірити зі зсувом
const T=[['x2','=B6+C6',3,0],['x10','=B2*$E$1',4,0],['x11','=B2*$E$1',0,1],['x19','=$B4*C$3',3,2]];
for(const [id,f,dr,dc] of T){ const st=L.steps.find(s=>s.id===id); const g=SHEET.shiftF(f,dr,dc); console.log(id,f,'→',g,st.answers[0]===g?'OK':'!! MISMATCH'); if(st.answers[0]!==g) bad++; for(const n of Object.keys(st.near||{})) if(SHEET.normF(n)===g){ bad++; console.log('!! near equals answer'); } }
// показані таблиці read/choice
for(const id of ['x4','x24']){ const st=L.steps.find(s=>s.id===id); const g=SHEET.evaluator(st.sheet.cells); const ff=a=>(st.sheet.fmt||{})[a]||(st.sheet.fmt||{})[a.replace(/\d+/,'')]; console.log(id, (id==='x4'?['E6','E7','E8','E9','E10']:['B12']).map(a=>a+'='+SHEET.fmt(g(a),ff(a))).join(' ')); }
console.log('steps',L.steps.length,'ex',L.steps.filter(s=>s.kind!=='read').length, bad?('PROBLEMS: '+bad):'ALL OK');

/* ============ СПІЛЬНЕ ДЛЯ САЙТУ Й ПРИЙМАЧА ============
   build.js копіює цей файл у приймач/збирач/ (Apps Script), тож правила тут живуть в одному місці.
   Рішення вчителя 11.10.2026: групи — лише ті, що є в журналі; оцінка враховує спроби. */
const KLASY={'10-Ф':['1','2'],'10-М':['1'],'10-І':['2'],'11-М':['2'],'11-Ф':['1','2']};
const PARALELI=[{name:'10 клас (2 год)',klasy:['10-Ф','10-М']},{name:'10 клас (4 год)',klasy:['10-І']},{name:'11 клас',klasy:['11-М','11-Ф']}];
// Бал за зараховану вправу: з 1-ї спроби 1, з 2-ї 0,75, з 3-ї і далі 0,5. Спроба — кожна перевірка, зарахована теж.
const balVpravy=n=>n<=1?1:n===2?0.75:0.5;
// exIds — id усіх вправ теми, done — id зарахованих, tries — {id: спроб}.
function otsinka(exIds,done,tries){
  let s=0; for(const id of exIds) if(done.indexOf(id)>=0) s+=balVpravy(tries[id]||0);
  return Math.max(1,Math.round(12*s/exIds.length));
}
if(typeof module!=='undefined') module.exports={KLASY,PARALELI,balVpravy,otsinka};

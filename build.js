// Збирає сайт у корінь репозиторію (його віддає GitHub Pages) і однофайлову версію artifact/trenazher.html із src/.
// Заразом генерує файли приймача (../приймач/): спільні правила, дані тем і сторінку вчителя — з того самого масиву LESSONS.
// Запуск: node build.js
const fs=require('fs'), vm=require('vm'); const r=f=>fs.readFileSync('src/'+f,'utf8');
const css=r('app.css'), app=r('app.js'), sheet=r('sheet.js'), spilne=r('spilne.js'), body=r('body.html');
const {KLASY,PARALELI}=require('./src/spilne.js');
const SITE='https://kovdmitro13-gif.github.io/trenazher/';
// Приватна таблиця результатів (Диск kovdmitro13 → «Інформатика»); посилання — лише на закритій сторінці вчителя.
const TABLYTSIA='https://docs.google.com/spreadsheets/d/1kLYTI1X49LhgNpBgddkFEMDfVAd-gz7R-ZhfPEAU3tc/edit';
const FONT='<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=JetBrains+Mono:wght@400;600&family=Unbounded:wght@600&display=swap">';
const SK='<script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js"></script>';
const head=(t,extra)=>`<!doctype html>\n<html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<title>${t}</title>\n${FONT}\n${extra}\n</head>`;
// klass — підпис для головної; класи теми для сторінки вчителя беруться з нього (лише ті, що є в KLASY).
// lessons — урок теми для кожної групи журналу: туди йде оцінка, якщо учень проходив тему не в день уроку (рішення вчителя 11.10.2026).
const LESSONS=[{dir:'input',file:'lesson-input.js',title:'input() і типи даних',klass:'10-І, Python',python:true,
    lessons:{'10-І гр.2':{n:13,date:'2026-09-28'}}},
  {dir:'chyslivnyk',file:'lesson-chyslivnyk.js',title:'Числівник: спіймай помилку ШІ',klass:'11-М, 11-Ф',
    lessons:{}},  // урок не проводився (вчитель, 11.10.2026)
  {dir:'excel',file:'lesson-excel.js',title:'Посилання в Excel і знак $',klass:'10-Ф, 10-М',
    lessons:{'10-Ф гр.1':{n:9,date:'2026-10-05'},'10-Ф гр.2':{n:9,date:'2026-10-05'},'10-М гр.1':{n:9,date:'2026-10-06'}}}];
fs.writeFileSync('app.css',css); fs.writeFileSync('app.js',app); fs.writeFileSync('sheet.js',sheet); fs.writeFileSync('spilne.js',spilne); fs.writeFileSync('.nojekyll','');
for(const L of LESSONS){ fs.mkdirSync(''+L.dir,{recursive:true});
  fs.writeFileSync(`${L.dir}/lesson.js`,r(L.file));
  fs.writeFileSync(`${L.dir}/index.html`,`${head(L.title+' · тренажер','<link rel="stylesheet" href="../app.css">')}\n<body>\n${body}${L.python?SK+'\n':''}<script src="../sheet.js"></script>\n<script src="../spilne.js"></script>\n<script src="lesson.js"></script>\n<script src="../app.js"></script>\n</body></html>\n`); }
fs.writeFileSync('index.html',`${head('Тренажер з інформатики','<link rel="stylesheet" href="app.css">')}\n<body>\n<div class="wrap"><main class="step" style="padding-top:28px">\n<span class="eyebrow">Ліцей № 13 · інформатика</span>\n<h1>Тренажер</h1>\n<div class="prose"><p>Обери тему. Пояснення і вправи відкриваються просто в телефоні.</p></div>\n<div class="opts">${LESSONS.map(L=>`<a class="opt" href="${L.dir}/" style="text-decoration:none;color:inherit;display:block"><b>${L.title}</b><br><span class="more">${L.klass}</span></a>`).join('')}</div>\n</main></div>\n</body></html>\n`);
// однофайлова версія для артефакту
fs.mkdirSync('artifact',{recursive:true}); fs.writeFileSync('artifact/trenazher.html',`<title>Тренажер Python 10-І</title>\n${FONT}\n<style>\n${css}</style>\n\n${body}\n${SK}\n<script>\n${sheet}\n${spilne}\n${r('lesson-input.js')}${app}</script>\n`);

/* ---- приймач: дані тем і сторінка вчителя ---- */
const SHEET=require('./src/sheet.js');
const T={};
for(const L of LESSONS){
  const X=vm.runInNewContext(r(L.file)+';LESSON',{SHEET});
  const ex=X.steps.filter(s=>s.kind!=='read').map(s=>s.id);
  for(const g of Object.keys(L.lessons)) if(!KLASY[g.split(' гр.')[0]]||!KLASY[g.split(' гр.')[0]].includes(g.split(' гр.')[1])) throw new Error(`${L.dir}: групи ${g} немає в KLASY`);
  T[X.id]={title:X.title,dir:L.dir,total:ex.length,ex,classes:X.classes,dlia:L.klass.split(', ').filter(k=>KLASY[k]),lessons:L.lessons};
}
const P='../приймач/';
const GEN='// Згенеровано сайт/build.js — не правити руками.\n';
fs.writeFileSync(P+'збирач/spilne.js',GEN+spilne);
fs.writeFileSync(P+'збирач/teme.js',GEN+'const THEMES='+JSON.stringify(T,null,1)+';\nif(typeof module!==\'undefined\') module.exports={THEMES};\n');
const e=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dm=d=>d.split('-').reverse().slice(0,2).join('.');
const theme=t=>{ const gr=Object.keys(KLASY).filter(k=>t.dlia.includes(k)).flatMap(k=>KLASY[k].map(g=>`${k} гр.${g}`));
  return `<div class="opt" style="display:block"><b>${e(t.title)}</b><br><span class="more">${t.total} вправ</span>
  <ul class="plain">${gr.map(g=>`<li>${e(g)}: ${t.lessons[g]?`урок ${t.lessons[g].n}, ${dm(t.lessons[g].date)}`:'урок не призначено'}</li>`).join('')}</ul>
  <div class="row"><a class="btn" href="${SITE}${t.dir}/" target="_blank" rel="noopener">Тема</a><a class="btn quiet" href="${SITE}qr/${t.dir}.png" target="_blank" rel="noopener">QR-код</a></div></div>`; };
const vchytel=`<!doctype html>\n<html lang="uk"><head><meta charset="utf-8"><base target="_top">\n<title>Тренажер — сторінка вчителя</title>\n${FONT}\n<style>\n${css}\n.plain{margin:6px 0 8px;padding-left:1.2em}.par{margin-top:18px}a.btn{text-decoration:none}</style>\n</head>\n<body>\n<div class="wrap"><main class="step" style="padding-top:28px">
<span class="eyebrow">Ліцей № 13 · інформатика · лише для вчителя</span>\n<h1>Тренажер: теми за класами</h1>
<div class="prose"><p>Результати учнів — у приватній таблиці: <a href="${TABLYTSIA}" target="_blank" rel="noopener">«Тренажер — результати»</a>. Усі теми однією сторінкою: <a href="${SITE}" target="_blank" rel="noopener">${SITE.replace('https://','')}</a> (<a href="${SITE}qr/vsi.png" target="_blank" rel="noopener">QR</a>).</p></div>
${PARALELI.map(p=>{ const ts=Object.values(T).filter(t=>t.dlia.some(k=>p.klasy.includes(k)));
  return `<section class="par"><h2>${e(p.name)}: ${e(p.klasy.join(', '))}</h2>\n<div class="opts">${ts.length?ts.map(theme).join('\n'):'<p class="more">Тем поки немає.</p>'}</div></section>`; }).join('\n')}
</main></div>\n</body></html>\n`;
fs.writeFileSync(P+'сторінка-вчителя/vchytel.html',vchytel);
for(const f of ['index.html','app.css','app.js','input/index.html','input/lesson.js',P+'збирач/teme.js',P+'сторінка-вчителя/vchytel.html']) console.log(f, fs.statSync(''+f).size);

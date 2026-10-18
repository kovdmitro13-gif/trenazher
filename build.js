// Збирає сайт у корінь репозиторію (його віддає GitHub Pages) і однофайлову версію artifact/trenazher.html із src/.
// Заразом генерує файли приймача (../приймач/): спільні правила, дані тем і сторінку вчителя — з того самого масиву LESSONS.
// Запуск: node build.js
const fs=require('fs'), vm=require('vm'); const r=f=>fs.readFileSync('src/'+f,'utf8');
const css=r('app.css'), app=r('app.js'), sheet=r('sheet.js'), spilne=r('spilne.js'), body=r('body.html');
const {KLASY,PARALELI}=require('./src/spilne.js');
const SITE='https://kovdmitro13-gif.github.io/trenazher/';
// Приватне (посилання на таблицю результатів, уроки тем для груп) — у ../приймач/уроки-тем.json: сайт/ публікується весь.
const PRYV=JSON.parse(fs.readFileSync('../приймач/уроки-тем.json','utf8')), TABLYTSIA=PRYV.tablytsia;
const FONT='<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=JetBrains+Mono:wght@400;600&family=Unbounded:wght@600&display=swap">';
const SK='<script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js"></script>';
const head=(t,extra)=>`<!doctype html>\n<html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<title>${t}</title>\n${FONT}\n${extra}\n</head>`;
// klass — підпис для головної; класи теми для сторінки вчителя беруться з нього: через «, », лише ті, що є в KLASY.
const LESSONS=[{dir:'input',file:'lesson-input.js',title:'input() і типи даних',klass:'10-І, Python',python:true},
  {dir:'chyslivnyk',file:'lesson-chyslivnyk.js',title:'Числівник: спіймай помилку ШІ',klass:'11-М, 11-Ф'},
  {dir:'excel',file:'lesson-excel.js',title:'Посилання в Excel і знак $',klass:'10-Ф, 10-М'},
  {dir:'brend',file:'lesson-brend.js',title:'Бренд «Випуск 2027»: мудборд',klass:'11-М, 11-Ф'},
  {dir:'brend-kolir',file:'lesson-brend-kolir.js',title:'Бренд «Випуск 2027»: колір і шрифти',klass:'11-Ф'},
  {dir:'if',file:'lesson-if.js',title:'Розгалуження: if і else',klass:'10-І, Python',python:true},
  {dir:'biznes',file:'lesson-biznes.js',title:'Свій бізнес: текстові функції, логотип, ABS',klass:'10-Ф, 10-М'}];
for(const L of LESSONS){ L.lessons=PRYV.lessons[L.dir]; if(!L.lessons) throw new Error(`${L.dir}: немає уроків теми в приймач/уроки-тем.json`); }
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
// Сторінка вчителя — Google Документ (приватний, Диск kovdmitro13): веб-сторінки Apps Script із входом не відкриваються,
// коли kovdmitro13 у браузері не основний акаунт (11.10.2026). Цей HTML агент завантажує в документ конектором Drive.
const theme=t=>{ const gr=Object.keys(KLASY).filter(k=>t.dlia.includes(k)).flatMap(k=>KLASY[k].map(g=>`${k} гр.${g}`));
  return `<h3>${e(t.title)}</h3>
<p>${t.total} вправ · <a href="${SITE}${t.dir}/">${SITE.replace('https://','')}${t.dir}/</a></p>
<ul>${gr.map(g=>`<li>${e(g)}: ${t.lessons[g]?`урок ${t.lessons[g].n}, ${dm(t.lessons[g].date)}`:'урок не призначено'}</li>`).join('')}</ul>
<p><a href="${SITE}qr/${t.dir}.png"><img src="${SITE}qr/${t.dir}.png" width="240" height="267" alt="QR: ${e(t.title)}"></a><br><a href="${SITE}qr/${t.dir}.png">QR на весь екран</a></p>`; };
const dokument=`<!doctype html>
<html lang="uk"><head><meta charset="utf-8"><title>Тренажер — сторінка вчителя</title></head>
<body>
<h1>Тренажер: теми за класами</h1>
<p>Лише для вчителя. Згенеровано з сайт/build.js — правки руками зітруться під час наступної публікації.</p>
<p>Результати учнів: <a href="${TABLYTSIA}">«Тренажер — результати»</a>. Усі теми: <a href="${SITE}">${SITE.replace('https://','')}</a> (<a href="${SITE}qr/vsi.png">QR</a>). Щоб показати QR класу, відкрийте посилання «QR на весь екран» під картинкою.</p>
<h2>Зміст</h2>
${PARALELI.map(p=>{ const ts=Object.values(T).filter(t=>t.dlia.some(k=>p.klasy.includes(k)));
  return `<p><b>${e(p.name)}: ${e(p.klasy.join(', '))}</b></p>\n<ul>${ts.length?ts.map(t=>`<li><a href="${SITE}${t.dir}/">${e(t.title)}</a> — ${t.total} вправ · <a href="${SITE}qr/${t.dir}.png">QR</a></li>`).join(''):'<li>Тем поки немає.</li>'}</ul>`; }).join('\n')}
${PARALELI.map(p=>{ const ts=Object.values(T).filter(t=>t.dlia.some(k=>p.klasy.includes(k)));
  return `<h2>${e(p.name)}: ${e(p.klasy.join(', '))}</h2>
${ts.length?ts.map(theme).join('\n'):'<p>Тем поки немає.</p>'}`; }).join('\n')}
</body></html>
`;
fs.writeFileSync(P+'сторінка-вчителя.html',dokument);
for(const f of ['index.html','app.css','app.js','input/index.html','input/lesson.js',P+'збирач/teme.js',P+'сторінка-вчителя.html']) console.log(f, fs.statSync(''+f).size);

// Збирає сайт у корінь репозиторію (його віддає GitHub Pages) і однофайлову версію artifact/trenazher.html із src/.
// Запуск: node build.js
const fs=require('fs'); const r=f=>fs.readFileSync('src/'+f,'utf8');
const css=r('app.css'), app=r('app.js'), body=r('body.html');
const FONT='<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=JetBrains+Mono:wght@400;600&family=Unbounded:wght@600&display=swap">';
const SK='<script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js"></script>';
const head=(t,extra)=>`<!doctype html>\n<html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<title>${t}</title>\n${FONT}\n${extra}\n</head>`;
const LESSONS=[{dir:'input',file:'lesson-input.js',title:'input() і типи даних',klass:'10-І, Python'}];
fs.writeFileSync('app.css',css); fs.writeFileSync('app.js',app); fs.writeFileSync('.nojekyll','');
for(const L of LESSONS){ fs.mkdirSync(''+L.dir,{recursive:true});
  fs.writeFileSync(`${L.dir}/lesson.js`,r(L.file));
  fs.writeFileSync(`${L.dir}/index.html`,`${head(L.title+' · тренажер','<link rel="stylesheet" href="../app.css">')}\n<body>\n${body}${SK}\n<script src="lesson.js"></script>\n<script src="../app.js"></script>\n</body></html>\n`); }
fs.writeFileSync('index.html',`${head('Тренажер з інформатики','<link rel="stylesheet" href="app.css">')}\n<body>\n<div class="wrap"><main class="step" style="padding-top:28px">\n<span class="eyebrow">Ліцей № 13 · інформатика</span>\n<h1>Тренажер</h1>\n<div class="prose"><p>Обери тему. Пояснення і вправи відкриваються просто в телефоні.</p></div>\n<div class="opts">${LESSONS.map(L=>`<a class="opt" href="${L.dir}/" style="text-decoration:none;color:inherit;display:block"><b>${L.title}</b><br><span class="more">${L.klass}</span></a>`).join('')}</div>\n</main></div>\n</body></html>\n`);
// однофайлова версія для артефакту
fs.mkdirSync('artifact',{recursive:true}); fs.writeFileSync('artifact/trenazher.html',`<title>Тренажер Python 10-І</title>\n${FONT}\n<style>\n${css}</style>\n\n${body}\n${SK}\n<script>\n${r('lesson-input.js')}${app}</script>\n`);
for(const f of ['index.html','app.css','app.js','input/index.html','input/lesson.js']) console.log(f, fs.statSync(''+f).size);

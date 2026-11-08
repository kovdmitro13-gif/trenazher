/* ============ ТЕМА (дані) ============ */
/* Друга тема 10-І на пару 35-36 — до уроку 36 (практична № 6: elif і match), 10.11.2026.
   Рішення вчителя 08.11.2026: у 10-І на тиждень чотири теми — по одній на урок (33 elif, 34 elif-pr, 35 match, 36 ця).
   Джерело — колода «35-36 урок 10 клас профільний match і Практична № 6 Презентація.pptx» (урок 36) і ключ
   «33-36 урок 10 клас профільний Для вчителя — ключ, оцінювання.md». Усі виводи звірено в CPython 3.13 (08.11.2026).
   Skulpt 1.2.0 не знає match — код із match тут лише читаємо (predict, choice, text); запускаємо лише elif.
   Сюжети інші, ніж у ПР № 6 (квитки, світлофор, відгук, калькулятор) і в темі match (пульт, розклад, кнопки):
   розмір одягу, обмінник, пора доби. */
const DOCS='https://docs.python.org/3/', W3='https://www.w3schools.com/python/';
const more=(...pairs)=>'<p class="more">Докладніше: '+pairs.map(([t,d,w])=>`<code>${t}</code> — <a href="${DOCS+d}" target="_blank" rel="noopener">docs.python.org</a>`+(w?`, <a href="${W3+w}" target="_blank" rel="noopener">W3Schools</a>`:'')).join('; ')+'</p>';
const ROZMIR=s=>`size = "${s}"
match size.upper():
    case "S":
        print("44-46")
    case "M" | "L":
        print("48-52")
    case _:
        print("Немає розміру")`;

const LESSON={
  id:'py10i-pr6-v1', klass:'10-І', subject:'Python',
  classes:['10-І'],
  title:'Практикум № 6: elif чи match', plot:'Розмір, обмінник, пора доби', minutes:25,
  submitUrl:'https://script.google.com/macros/s/AKfycbw7F0TWcmUAq3awyHMpRxZqGfgmc5uSc010xL_q2qdSVxOdtRWagi6mNRyWtGdS6Q/exec',
  missText:'Не збігається. Переглянь пояснення вище ще раз.',
  intro:`<p>Це тема до уроку 36 — практичної № 6 «elif і match». Тема до уроку 35 — «Оператор вибору match».</p>
<p><b>Що робимо на практичній</b> (з презентації):</p>
<ul class="plain"><li>Передбачаємо вивід, переписуємо elif через match.</li>
<li>Виправляємо три помилки в програмі з match.</li>
<li>Пишемо сам калькулятор: match і if усередині case, числа з комою.</li></ul>
<p>Тут інші приклади, ніж у практичній. У телефоні Python не знає match, тож код із match тут читаємо, а запускаємо програми з elif. Тексти помилок тут можуть трохи відрізнятися від IDLE.</p>
<p>Тут 11 кроків і 8 вправ, це займе приблизно 25 хвилин.</p>`,
  sections:['elif чи match','match: читаємо код','Числа з комою','Знайди помилки','Напиши сам'],
  steps:[
  /* ---------- 0. elif чи match ---------- */
  {id:'r1',sec:0,kind:'read',title:'Коли match, а коли elif',
   body:`<ul class="plain"><li><b>match</b> — коли одну змінну порівнюємо з <b>конкретними значеннями</b>: літера розміру, знак дії, назва валюти. <code>case "M" | "L":</code> — «M або L».</li>
<li><b>elif</b> — коли потрібні <b>межі</b>: <code>&gt;</code>, <code>&lt;=</code>, «від 6 до 11».</li>
<li><code>case _:</code> — «усе інше», завжди <b>останнім</b>. Інакше Python не запустить програму: SyntaxError.</li>
<li>Текст з <code>input()</code> чистимо до match: <code>.strip().upper()</code> — без пробілів з боків і великими літерами.</li></ul>`+more(['match і case','tutorial/controlflow.html#match-statements','python_match.asp'])},

  {id:'c1',sec:0,kind:'choice',title:'Що краще через match?',
   body:`<p>Яке з цих завдань природніше розв’язати через <code>match</code>?</p>`,
   options:[
    {t:'Літера розміру S, M чи L → обхват грудей',ok:true,why:'Так. Одна змінна, кілька конкретних значень.'},
    {t:'Вік → категорія квитка (до 7, до 18, від 65)',why:'Тут межі «до» і «від» — це elif.'},
    {t:'Температура → що вдягнути',why:'Тут межі температури — це elif.'},
    {t:'Бал 1-12 → рівень',why:'Тут межі балів — це elif.'}]},

  /* ---------- 1. match: читаємо код ---------- */
  {id:'p1',sec:1,kind:'predict',title:'Який розмір?',
   body:`<p>Що виведе програма? Порахуй у голові.</p>`,
   variants:[{code:ROZMIR('m'),answer:'48-52'},{code:ROZMIR('l'),answer:'48-52'},{code:ROZMIR('xl'),answer:'Немає розміру'},{code:ROZMIR('S '),answer:'Немає розміру'}],
   hint:'upper() робить літери великими, але пробіли лишає. Шукай case з тим самим текстом.',
   explain:'<code>"S "</code> з пробілом після upper() — <code>"S "</code>, а не <code>"S"</code>: спрацює case _. Тому до match пишуть strip().'},

  {id:'t1',sec:1,kind:'text',title:'Запиши case',
   body:`<p>Запиши рядок <code>case</code>, що спрацює для розміру <code>"XS"</code> <b>або</b> <code>"S"</code>.</p>`,
   field:'рядок case',norm:'code',
   answers:['case "XS" | "S":','case "S" | "XS":',"case 'XS' | 'S':","case 'S' | 'XS':"],
   near:{'case "XS" or "S":':'Ні. «Або» в case — знак |, а не or.','case XS | S:':'Ні. Текст у case — у лапках, як у ==.'},
   hint:'case, два значення в лапках через |, двокрапка.',
   explain:'<code>case "XS" | "S":</code> — порядок значень не має значення.'},

  {id:'c2',sec:1,kind:'choice',title:'case _ першим',
   body:`<p>У програмі з розмірами <code>case _:</code> переставили на початок, перед <code>case "S":</code>. Що буде?</p>`,
   options:[
    {t:'SyntaxError ще до запуску',ok:true,why:'Так: «wildcard makes remaining patterns unreachable» — після case _ інші case ніколи б не спрацювали.'},
    {t:'Завжди «Немає розміру»',why:'Ні. Python навіть не запустить таку програму — помилка синтаксису.'},
    {t:'Нічого не зміниться',why:'Ні. case _ може стояти лише останнім.'}]},

  /* ---------- 2. Числа з комою ---------- */
  {id:'r2',sec:2,kind:'read',title:'Числа з комою і round()',
   body:`<ul class="plain"><li>Користувач пише <code>2,5</code>, а Python — <code>2.5</code>. Тому: <code>float(input(…).replace(",", "."))</code>.</li>
<li><code>round(x, 2)</code> — округлити до двох знаків після крапки: <code>round(2 / 3, 2)</code> дає <code>0.67</code>.</li>
<li>Python друкує дробове число з крапкою: <code>2.5</code>, а не <code>2,5</code>.</li></ul>`,
   runs:[{code:`x = float(input("Число: ").replace(",", "."))
print(round(x / 3, 2))`,stdin:'2,5',label:'число 2,5'}],
   after:more(['round()','library/functions.html#round'])},

  {id:'p2',sec:2,kind:'predict',title:'Що надрукує round?',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:'print(round(10 / 4, 1))',answer:'2.5'},{code:'print(round(2 / 3, 2))',answer:'0.67'},{code:'print(round(7 / 3, 2))',answer:'2.33'}],
   hint:'Поділи й залиш потрібну кількість знаків після крапки. Python пише крапку, а не кому.',
   explain:'round округлює за правилами; дробове число Python друкує з крапкою.'},

  /* ---------- 3. Знайди помилки ---------- */
  {id:'f1',sec:3,kind:'fix',title:'Виправ пору доби',
   body:`<p>Година (ціле число 0-23): 6-11 — <code>Ранок</code>, 12-17 — <code>День</code>, 18-22 — <code>Вечір</code>, інакше — <code>Ніч</code>. У програмі три помилки: дві покаже Python, третю — лише запуск на межі.</p>`,
   code:`h = input("Година: ")
if 6 <= h <= 11:
    print("Ранок")
elif 12 < h <= 17
    print("День")
elif 18 <= h <= 22:
    print("Вечір")
else:
    print("Ніч")`,stdin:'12',
   tests:[{in:['6'],out:'Ранок'},{in:['11'],out:'Ранок'},{in:['12'],out:'День'},{in:['17'],out:'День'},{in:['18'],out:'Вечір'},{in:['22'],out:'Вечір'},{in:['23'],out:'Ніч'},{in:['5'],out:'Ніч'}],
   hint:'Двокрапка після умови; int(input(…)); «12-17» — 12 теж входить.',
   explain:'<code>h = int(input(…))</code>, двокрапка після <code>elif</code>, і <code>12 &lt;= h &lt;= 17</code>: з <code>12 &lt; h</code> о 12-й годині виходила «Ніч».'},

  /* ---------- 4. Напиши сам ---------- */
  {id:'k1',sec:4,kind:'code',title:'Напиши сам: обмінник',
   body:`<p>Програма питає суму (можна з комою) і валюту. Валюту чисть: <code>.strip().upper()</code>. Курси вигадані: USD — 41.5, EUR — 48, PLN — 11.25 грн. Вивід: <code>До сплати: … грн</code> із сумою, округленою до 2 знаків (<code>round(…, 2)</code>). Інша валюта — <code>Невідома валюта</code>. Сума 0 або менше — <code>Сума має бути більшою за 0</code> (перевір спершу її).</p>
<p>У телефоні Python не знає match, тож тут — elif. В IDLE на уроці можна через match.</p>`,
   code:``,stdin:'100\nusd',
   tests:[{in:['100','usd'],out:'До сплати: 4150.0 грн'},{in:['2,5','eur '],out:'До сплати: 120.0 грн'},{in:['10','PLN'],out:'До сплати: 112.5 грн'},{in:['1','gbp'],out:'Невідома валюта'},{in:['0','USD'],out:'Сума має бути більшою за 0'}],
   hint:'s = float(input().replace(",", ".")); v = input().strip().upper(); if s <= 0 … elif v == "USD": print("До сплати:", round(s * 41.5, 2), "грн") …',
   explain:'Спершу перевірка суми, потім валюти. print з комами ставить пробіли сам: <code>print("До сплати:", round(s * 41.5, 2), "грн")</code>.'},

  {id:'c3',sec:4,kind:'choice',title:'Без strip()',
   body:`<p>В обміннику забули <code>.strip()</code>, а учень увів валюту <code>eur </code> (з пробілом у кінці). Що виведе програма?</p>`,
   options:[
    {t:'Невідома валюта',ok:true,why:'Так. upper() дає "EUR ", а з пробілом це вже не "EUR".'},
    {t:'До сплати: … грн',why:'Ні. Без strip() пробіл лишається, і "EUR " не дорівнює "EUR".'},
    {t:'ValueError',why:'Ні. Помилки немає — просто жодна умова не збіглася.'}]},

  {id:'z1',sec:4,kind:'read',title:'Підсумок',
   body:`<ul class="plain"><li>match — конкретні значення; elif — межі.</li>
<li><code>case "M" | "L":</code> — «або»; <code>case _:</code> — останнім.</li>
<li>Текст з input() — <code>.strip().upper()</code> (або <code>.lower()</code>), числа з комою — <code>.replace(",", ".")</code>.</li>
<li>Межі перевіряй запусками: сама межа і сусіднє число.</li></ul>
<p>Практичну № 6 здаєш у формі уроку (сторінка «Урок 36»). Результат тренажера вчитель отримає сам.</p>`}
  ]
};

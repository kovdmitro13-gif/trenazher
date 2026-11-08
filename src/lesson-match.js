/* ============ ТЕМА (дані) ============ */
/* Джерело — уроки 35-36 10-І «match і практична № 6» (10.11.2026): презентація, конспект і
   «33-36 урок 10 клас профільний Для вчителя — ключ, оцінювання.md» (каталог 33 - 20261109; задачі — 35 - 20261110).
   Довідка (відкрито 08.11.2026): docs.python.org/3/tutorial/controlflow.html#match-statements, w3schools.com/python/python_match.asp,
   docs.python.org/3/library/stdtypes.html#str.strip, w3schools.com/python/ref_string_strip.asp.
   🟥 Skulpt 1.2.0 не знає match (перевірено 08.11.2026: «SyntaxError: bad input»), тому тут жодного запуску коду з match —
   лише пояснення, передбачення й вибір. Кожну відповідь звірено запуском у CPython 3.13.18 і 3.14.6.
   Сюжети інші, ніж на уроці й у ПР № 6 (день тижня, кав'ярня, музей, світлофор, відгук, калькулятор): пульт, розклад, команди. */
const DOCS='https://docs.python.org/3/', W3='https://www.w3schools.com/python/';
const more=(...pairs)=>'<p class="more">Докладніше: '+pairs.map(([t,d,w])=>`<code>${t}</code> — <a href="${DOCS+d}" target="_blank" rel="noopener">docs.python.org</a>`+(w?`, <a href="${W3+w}" target="_blank" rel="noopener">W3Schools</a>`:'')).join('; ')+'</p>';
const PULT=k=>`k = ${k}
match k:
    case 1:
        print("Мультики")
    case 2:
        print("Новини")
    case _:
        print("Немає каналу")`;
const ROZKLAD=d=>`d = ${d}
match d:
    case 1 | 2 | 3 | 4 | 5:
        print("Навчання")
    case 6 | 7:
        print("Вихідний")`;
const KOMANDA=c=>`c = ${c}.strip().lower()
match c:
    case "старт":
        print("Поїхали")
    case "стоп" | "пауза":
        print("Зупинка")
    case _:
        print("Не знаю команди")`;
const TEXT=d=>`d = ${d}
match d:
    case 3:
        print("Середа")
    case _:
        print("Немає")`;

const LESSON={
  id:'py10i-match-v1', klass:'10-І', subject:'Python',
  classes:['10-І'],
  title:'Оператор вибору match', plot:'Пульт і команди', minutes:25,
  submitUrl:'https://script.google.com/macros/s/AKfycbw7F0TWcmUAq3awyHMpRxZqGfgmc5uSc010xL_q2qdSVxOdtRWagi6mNRyWtGdS6Q/exec',
  missText:'Не збігається. Переглянь пояснення вище ще раз.',
  intro:`<p>Це тема до уроку 35 «match і case» — для тих, у кого урок пропав або хто хоче повторити. Тема до уроку 36 (практична № 6) — «Практикум № 6: elif чи match».</p>
<p><b>Що проходимо на уроці</b> (з презентації):</p>
<ul class="plain"><li>Учора — elif: умови згори вниз, виконується перша True.</li>
<li>Урок 35: match — одна змінна, кілька можливих значень.</li>
<li>Урок 36: практична № 6 — elif і match.</li></ul>
<p>🟥 <b>match з’явився в Python 3.10, а Python цього тренажера старіший і match не знає.</b> Тому тут код не запускається: читаєш, передбачаєш, вибираєш. Кожен приклад запусти потім в IDLE.</p>`,
  sections:['match і case','Кілька значень: |','case _ — «усе інше»','Текст "3" і число 3','Текстові case: strip() і lower()','Підсумок'],
  steps:[
  {id:'r1',sec:0,kind:'read',title:'match і case',
   body:`<p>Коли кожна умова — «змінна дорівнює значенню», є коротший запис, ніж ланцюжок <code>elif</code>:</p>
<ul class="plain"><li><code>match k:</code> — «порівняй k по черзі з тим, що в кожному case»;</li>
<li><code>case 2:</code> — гілка для <code>k == 2</code>. Двокрапка й відступ — як в if;</li>
<li>спрацьовує <b>перший</b> збіг, решта пропускається.</li></ul>
<div class="box"><pre class="code">k = int(input("Кнопка: "))
match k:
    case 1:
        print("Мультики")
    case 2:
        print("Новини")
    case _:
        print("Немає каналу")</pre></div>
<p>Змінну <code>k</code> пишемо один раз — у <code>match</code>, а не в кожній умові.</p>`+more(['match і case','tutorial/controlflow.html#match-statements','python_match.asp'])},

  {id:'p1',sec:0,kind:'predict',title:'Який канал?',
   body:`<p>Що виведе програма? Порахуй у голові.</p>`,
   variants:[{code:PULT(2),answer:'Новини'},{code:PULT(1),answer:'Мультики'},{code:PULT(5),answer:'Немає каналу'}],
   hint:'Шукай case з тим самим числом, що в k. Немає такого — case _.',
   explain:'Виконується перший case, що збігся зі значенням k; якщо жоден — case _.'},

  {id:'c1',sec:0,kind:'choice',title:'Скільки гілок?',
   body:`<p>У match чотири case, і значення змінної збігається з двома з них. Скільки гілок виконається?</p>`,
   options:[
    {t:'Одна — перша, що збіглася',ok:true,why:'Так. Спрацьовує перший збіг, решта пропускається — як в elif.'},
    {t:'Дві',why:'Ні. Після першого збігу match далі не перевіряє.'},
    {t:'Чотири',why:'Ні. Виконується лише гілка першого збігу.'}]},

  {id:'c6',sec:0,kind:'choice',title:'match чи elif?',
   body:`<p>Програма називає рівень заряду: понад 50 — високий, понад 20 — середній, інакше — низький. Що тут природніше?</p>`,
   options:[
    {t:'elif — умови тут межі (> 50), а не окремі значення',ok:true,why:'Так. match порівнює змінну з конкретними значеннями, як ==. Для «більше за» природніше if … elif.'},
    {t:'match — він завжди коротший',why:'Ні. match зручний, коли кожна умова — «дорівнює значенню». Тут умови — «більше за».'},
    {t:'Окремі if',why:'Ні. Потрібен один рівень, а окремі if надрукують кілька.'}]},

  {id:'r2',sec:1,kind:'read',title:'Кілька значень в одному case: |',
   body:`<p><code>case 6 | 7:</code> — одна гілка для кількох значень. Знак <code>|</code> тут означає «або». Це те саме, що в if писати <code>d == 6 or d == 7</code>.</p>
<div class="box"><pre class="code">d = int(input("День (1-7): "))
match d:
    case 1 | 2 | 3 | 4 | 5:
        print("Навчання")
    case 6 | 7:
        print("Вихідний")</pre></div>`},

  {id:'p2',sec:1,kind:'predict',title:'Навчання чи вихідний?',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:ROZKLAD(7),answer:'Вихідний'},{code:ROZKLAD(3),answer:'Навчання'},{code:ROZKLAD(6),answer:'Вихідний'}],
   hint:'Знайди значення d серед чисел через | у кожному case.',
   explain:'| — «або»: case спрацьовує, якщо d дорівнює будь-якому з перелічених чисел.'},

  {id:'t1',sec:1,kind:'text',title:'Запиши case',
   body:`<p>Запиши рядок <code>case</code> для гілки, що має спрацювати, коли змінна дорівнює 6 <b>або</b> 7.</p>`,
   field:'рядок case',
   norm:'code', answers:['case 6 | 7:','case 7 | 6:'],
   near:{'case 6 or 7:':'Ні. У case «або» пишуть знаком |, а не словом or.','case 6, 7:':'Ні. Коми тут не ставлять: кома в case означає інше. Для «або» — знак |.'},
   hint:'case, потім 6, знак «або» у case і 7, двокрапка.',
   explain:'<code>case 6 | 7:</code> — знак <code>|</code> замість or.'},

  {id:'m1',sec:1,kind:'multi',title:'Те саме, що case 6 | 7',
   body:`<p>Познач усі записи, що спрацюють для тих самих d, що й <code>case 6 | 7:</code> у match.</p>`,
   options:[
    {t:'if d == 6 or d == 7:',ok:true,why:'Так. | у case — це «або».'},
    {t:'case 7 | 6:',ok:true,why:'Так. Порядок значень через | не має значення.'},
    {t:'if d == 6 and d == 7:',why:'Ні. Число не може дорівнювати 6 і 7 водночас — умова завжди False.'},
    {t:'case 6 or 7:',why:'Ні. У case «або» пишуть знаком |, слово or тут не годиться.'}],
   hint:'| — «або». Шукай записи з «або».'},

  {id:'r3',sec:2,kind:'read',title:'case _ — «усе інше»',
   body:`<p><code>case _:</code> — гілка для всіх інших значень, як <code>else</code>. Стоїть <b>останньою</b>.</p>
<ul class="plain"><li>Без <code>case _</code>, якщо жоден case не збігся, match <b>нічого не робить</b> — і помилки немає, тож її легко не помітити.</li>
<li><code>case _</code> не останнім — Python не запустить програму: <code>SyntaxError: wildcard makes remaining patterns unreachable</code> («після _ інші варіанти недосяжні»).</li></ul>`},

  {id:'c2',sec:2,kind:'choice',title:'case _ першим',
   body:`<p>Що буде з цією програмою?</p>`,
   code:`k = int(input("Кнопка: "))
match k:
    case _:
        print("Немає каналу")
    case 1:
        print("Мультики")`,
   options:[
    {t:'SyntaxError ще до запуску',ok:true,why:'Так: «wildcard makes remaining patterns unreachable». Після case _ інші case недосяжні.'},
    {t:'Для будь-якої кнопки — «Немає каналу»',why:'Ні. Python таку програму навіть не запустить: case _ має стояти останнім.'},
    {t:'Для 1 — «Мультики»',why:'Ні. Python зупиниться з SyntaxError до запуску.'}]},

  {id:'c3',sec:2,kind:'choice',title:'Без case _',
   body:`<p>У програмі немає <code>case _</code>. Користувач натиснув кнопку 9. Що буде?</p>`,
   code:`k = int(input("Кнопка: "))
match k:
    case 1:
        print("Мультики")
    case 2:
        print("Новини")`,
   options:[
    {t:'Після введення нічого не надрукує, помилки немає',ok:true,why:'Так. Жоден case не збігся — match нічого не робить.'},
    {t:'SyntaxError',why:'Ні. case _ не обов’язковий: програма правильна, просто нічого не друкує для 9.'},
    {t:'Надрукує «Новини» — останній case',why:'Ні. case спрацьовує лише при збігу значення.'}]},

  {id:'r4',sec:3,kind:'read',title:'Текст "3" і число 3',
   body:`<p>Забули <code>int()</code>: <code>d = input(…)</code> дає <b>текст</b> <code>"3"</code>, а <code>case 3</code> — число. <code>"3" == 3</code> — <code>False</code>, тож спрацює <code>case _</code>.</p>
<p>Помилки <b>немає</b>! З <code>&gt;=</code> між текстом і числом був TypeError, а <code>==</code> і <code>case</code> просто кажуть «не дорівнює». Тому таку помилку видно лише за неправильним виводом.</p>`},

  {id:'p4',sec:3,kind:'predict',title:'Текст чи число?',
   body:`<p>Що виведе програма? Подивись уважно на лапки.</p>`,
   variants:[{code:TEXT('"3"'),answer:'Немає'},{code:TEXT('3'),answer:'Середа'},{code:TEXT('"Середа"'),answer:'Немає'}],
   hint:'"3" у лапках — текст. case 3 без лапок — число.',
   explain:'Текст ніколи не дорівнює числу, тому для "3" спрацьовує case _.'},

  {id:'c4',sec:3,kind:'choice',title:'Чому немає TypeError?',
   body:`<p>Чому <code>"3" &gt;= 3</code> дає TypeError, а <code>match</code> з текстом "3" і <code>case 3</code> — ні?</p>`,
   options:[
    {t:'Порівняння «дорівнює» тексту з числом просто дає False',ok:true,why:'Так. Більше-менше між текстом і числом не має сенсу — TypeError; а «дорівнює» — просто False.'},
    {t:'match сам перетворює текст на число',why:'Ні. Нічого не перетворюється — тому й спрацьовує case _.'},
    {t:'У match помилки не показуються',why:'Ні. Синтаксичні помилки match показує, наприклад для case _ не останнім.'}]},

  {id:'r5',sec:4,kind:'read',title:'Текстові case: strip() і lower()',
   body:`<p>У <code>case</code> можна писати текст — у лапках, як у <code>==</code>. Але «Старт», «старт» і «старт&nbsp;» — різні тексти. Тому ввід спершу «чистимо»:</p>
<ul class="plain"><li><code>strip()</code> прибирає пробіли на початку і в кінці тексту: <code>"  старт ".strip()</code> дає <code>"старт"</code>;</li>
<li><code>lower()</code> — малі літери; <code>strip().lower()</code> — спершу пробіли, потім літери.</li></ul>
<div class="box"><pre class="code">c = input().strip().lower()
match c:
    case "старт":
        print("Поїхали")
    case "стоп" | "пауза":
        print("Зупинка")
    case _:
        print("Не знаю команди")</pre></div>`+more(['strip()','library/stdtypes.html#str.strip','ref_string_strip.asp'])},

  {id:'p5',sec:4,kind:'predict',title:'Яка команда?',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:KOMANDA('"  СТАРТ "'),answer:'Поїхали'},{code:KOMANDA('"Пауза"'),answer:'Зупинка'},{code:KOMANDA('"старт!"'),answer:'Не знаю команди'}],
   hint:'Спершу strip() і lower(), потім шукай збіг серед case. Кожен знак тексту має значення.',
   explain:'strip().lower() прибирає пробіли й великі літери, але «!» лишається — тому «старт!» не збігається зі «старт».'},

  {id:'t2',sec:4,kind:'text',title:'Що дасть strip().lower()?',
   body:`<p>Що дасть вираз <code>"  Стоп ".strip().lower()</code>? Запиши текст без лапок.</p>`,
   field:'текст',
   norm:'exact', answers:['стоп'],
   hint:'strip() — без пробілів з боків; lower() — малі літери.',
   explain:'<code>"стоп"</code>: пробіли прибрано, «С» стала «с».'},

  {id:'c5',sec:4,kind:'choice',title:'Забули strip()',
   body:`<p>У програмі з пояснення прибрали <code>.strip()</code>, лишили <code>.lower()</code>. Користувач увів «старт» і випадково пробіл у кінці. Що надрукує програма?</p>`,
   options:[
    {t:'Не знаю команди',ok:true,why:'Так. "старт " з пробілом не дорівнює "старт" — спрацьовує case _.'},
    {t:'Поїхали',why:'Ні. Пробіл — теж символ: без strip() він лишається в тексті.'},
    {t:'SyntaxError',why:'Ні. Програма правильна, просто текст не збігся.'}]},

  {id:'z1',sec:5,kind:'read',title:'Підсумок',
   body:`<ul class="plain"><li><code>match змінна:</code> і <code>case значення:</code> — коли кожна умова «дорівнює значенню».</li>
<li><code>case 6 | 7:</code> — кілька значень в одній гілці.</li>
<li><code>case _:</code> — «усе інше», завжди останнім; без нього match може нічого не зробити.</li>
<li>Текст "3" не дорівнює числу 3: не забувай <code>int()</code>.</li>
<li>Текстове введення очищуй: <code>input().strip().lower()</code>.</li>
<li>Умови «більше-менше» — це if … elif.</li></ul>`}
  ]
};

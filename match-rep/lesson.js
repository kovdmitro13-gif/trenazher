/* ============ ТЕМА (дані) ============ */
/* Джерело — урок 41 10-І «match: повторюємо на нових задачах» (23.11.2026): колода, конспект і
   «41-42 урок 10 клас профільний Для вчителя — ключ, оцінювання.md» (каталог 41 - 20261123).
   🟥 Skulpt 1.2.0 не знає match — тут жодного запуску коду: пояснення, передбачення, вибір. Кожну відповідь звірено
   запуском у CPython 3.10.12 і 3.13.18 (22.11.2026). Сюжети інші, ніж на уроці (кав'ярня, команди, знижка, розмір):
   ліфт ТРЦ, голосовий помічник, доставка, розмір піци. */
const DOCS='https://docs.python.org/3/', W3='https://www.w3schools.com/python/';
const more=(...pairs)=>'<p class="more">Докладніше: '+pairs.map(([t,d,w])=>`<code>${t}</code> — <a href="${DOCS+d}" target="_blank" rel="noopener">docs.python.org</a>`+(w?`, <a href="${W3+w}" target="_blank" rel="noopener">W3Schools</a>`:'')).join('; ')+'</p>';
const LIFT=k=>`p = ${k}
match p:
    case 1:
        print("Продукти")
    case 2 | 3:
        print("Одяг")
    case 4:
        print("Кіно")
    case _:
        print("Такого поверху немає")`;
const POMICH=c=>`c = ${c}.strip().lower()
match c:
    case "світло":
        print("Вмикаю світло")
    case "музика" | "пісня":
        print("Граю музику")
    case _:
        print("Не розумію")`;
const LIFT_TXT=k=>`p = ${k}
match p:
    case 1:
        print("Продукти")
    case _:
        print("Інше")`;
const DOST=(s,v)=>`suma = ${s}
sposib = "${v}"
match sposib:
    case "кур'єр":
        if suma >= 500:
            print("Доставка 0 грн")
        else:
            print("Доставка 80 грн")
    case "пошта":
        print("Доставка 60 грн")
    case _:
        print("Самовивіз")`;

const LESSON={
  id:'py10i-match-rep-v1', klass:'10-І', subject:'Python',
  classes:['10-І'],
  title:'match: повторення на нових задачах', plot:'Ліфт і голосовий помічник', minutes:25,
  submitUrl:'https://script.google.com/macros/s/AKfycbw7F0TWcmUAq3awyHMpRxZqGfgmc5uSc010xL_q2qdSVxOdtRWagi6mNRyWtGdS6Q/exec',
  missText:'Не збігається. Переглянь пояснення вище ще раз.',
  intro:`<p>Це тема до уроку 41 — для тих, у кого урок пропав або хто хоче повторити match. Тема до уроку 42 — «match: знайди помилку, допиши, напиши сам».</p>
<p><b>Що проходимо на уроці</b> (з презентації):</p>
<ul class="plain"><li>Онлайн-уроки 37-40 про match здали не всі — повторюємо.</li>
<li>Урок 41: термінал кав'ярні — повторюємо всі можливості match.</li>
<li>Урок 42: три нові задачі — знайди помилки, допиши, напиши сам.</li></ul>
<p>🟥 <b>match з’явився в Python 3.10, а Python цього тренажера старіший.</b> Тому тут код не запускається: читаєш, передбачаєш, вибираєш. Приклади запусти потім в IDLE.</p>`,
  sections:['match і case: число','Текст: strip() і lower()','Пастка: забули int()','if усередині case','Підсумок'],
  steps:[
  {id:'r1',sec:0,kind:'read',title:'match і case',
   body:`<p><code>match p:</code> — «порівняй p по черзі з тим, що в кожному case». Спрацьовує <b>перший</b> збіг, решта пропускається.</p>
<ul class="plain"><li><code>case 4:</code> — гілка для <code>p == 4</code>. Двокрапка й відступ — як в if.</li>
<li><code>case 2 | 3:</code> — одна гілка для кількох значень: «2 <b>або</b> 3».</li>
<li><code>case _:</code> — «усе інше», як else. Стоїть лише <b>останнім</b>.</li></ul>
<div class="box"><pre class="code">p = int(input("Поверх: "))
match p:
    case 1:
        print("Продукти")
    case 2 | 3:
        print("Одяг")
    case 4:
        print("Кіно")
    case _:
        print("Такого поверху немає")</pre></div>`+more(['match і case','tutorial/controlflow.html#match-statements','python_match.asp'])},
  {id:'p1',sec:0,kind:'predict',title:'Ліфт: який поверх?',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:LIFT(3),answer:'Одяг'},{code:LIFT(2),answer:'Одяг'},{code:LIFT(4),answer:'Кіно'}],
   hint:'Шукай case, у якому є це число. Через | — кілька значень однієї гілки.',
   explain:'Спрацьовує той case, де є значення p. 2 і 3 — одна гілка «Одяг».'},
  {id:'p2',sec:0,kind:'predict',title:'Ліфт: поверху немає',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:LIFT(7),answer:'Такого поверху немає'},{code:LIFT(0),answer:'Такого поверху немає'},{code:LIFT(-1),answer:'Такого поверху немає'}],
   hint:'Жоден case з числом не збігся — що тоді?',
   explain:'Жоден case не збігся — спрацьовує <code>case _</code>.'},
  {id:'c1',sec:0,kind:'choice',title:'Де стоїть case _',
   body:`<p>Учень поставив <code>case _:</code> першим, перед <code>case 1:</code>. Що буде?</p>`,
   options:[{t:'SyntaxError ще до запуску: case _ закриває дорогу всім наступним case',ok:true,why:'Python пише «wildcard makes remaining patterns unreachable». case _ — лише останнім.'},
            {t:'Програма запуститься, але завжди друкуватиме «Такого поверху немає»',ok:false,why:'До запуску не дійде: Python перевіряє це ще перед виконанням і показує SyntaxError.'},
            {t:'Нічого не зміниться: порядок case не важливий',ok:false,why:'Важливий: спрацьовує перший збіг, а case _ збігається з усім.'}]},

  {id:'r2',sec:1,kind:'read',title:'Текст у case: strip() і lower()',
   body:`<p>У case можна писати текст у лапках: <code>case "світло":</code>. Але порівняння точне: <code>"Світло"</code>, <code>" світло"</code> і <code>"світло"</code> — три різні тексти.</p>
<p>Тому перед match текст «чистимо»:</p>
<ul class="plain"><li><code>strip()</code> — прибирає пробіли на початку й у кінці;</li>
<li><code>lower()</code> — робить усі літери малими.</li></ul>
<div class="box"><pre class="code">c = input("Команда: ").strip().lower()
match c:
    case "світло":
        print("Вмикаю світло")
    case "музика" | "пісня":
        print("Граю музику")
    case _:
        print("Не розумію")</pre></div>`+more(['strip()','library/stdtypes.html#str.strip','ref_string_strip.asp'],['lower()','library/stdtypes.html#str.lower','ref_string_lower.asp'])},
  {id:'p3',sec:1,kind:'predict',title:'Помічник: що відповість?',
   body:`<p>Що виведе програма? Зверни увагу на пробіли й великі літери.</p>`,
   variants:[{code:POMICH('"  Світло "'),answer:'Вмикаю світло'},{code:POMICH('"ПІСНЯ"'),answer:'Граю музику'},{code:POMICH('" Музика"'),answer:'Граю музику'}],
   hint:'Спершу strip() і lower(), потім match.',
   explain:'strip() прибрав пробіли, lower() — великі літери. Далі текст збігся з case.'},
  {id:'c2',sec:1,kind:'choice',title:'Без lower()',
   body:`<p>Учень прибрав <code>.lower()</code> і лишив <code>.strip()</code>. Користувач каже <code>"Світло"</code>. Що виведе програма?</p>`,
   options:[{t:'Не розумію',ok:true,why:'"Світло" з великою С не дорівнює "світло" — спрацював case _.'},
            {t:'Вмикаю світло',ok:false,why:'Порівняння точне: велика С — інша літера.'},
            {t:'SyntaxError',ok:false,why:'Код правильний синтаксично, просто текст не збігся.'}]},

  {id:'r3',sec:2,kind:'read',title:'Пастка: input() без int()',
   body:`<p><code>input()</code> завжди дає <b>текст</b>. Без <code>int()</code> змінна містить текст <code>"1"</code>, а в case стоїть число <code>1</code>.</p>
<p>Текст і число просто <b>не рівні</b> — помилки немає, спрацьовує <code>case _</code>. Програма «мовчки» працює неправильно.</p>
<p>Виправити можна двома способами: <code>int(input(...))</code> або писати в case текст: <code>case "1":</code>. Але з <code>case "1":</code> ввід <code>" 1"</code> (з пробілом) уже не збіжеться, а <code>int(" 1")</code> дає 1.</p>`},
  {id:'p4',sec:2,kind:'predict',title:'Текст "1" і число 1',
   body:`<p>Змінна — текст (так дає input без int). Що виведе програма?</p>`,
   variants:[{code:LIFT_TXT('"1"'),answer:'Інше'},{code:LIFT_TXT('"4"'),answer:'Інше'}],
   hint:'Лапки — це текст. У case — число.',
   explain:'Текст "1" не дорівнює числу 1, тому case 1 не спрацював — спрацював case _.'},
  {id:'c3',sec:2,kind:'choice',title:'Чому немає помилки?',
   body:`<p>Чому Python не показав жодної помилки, коли змінна — текст, а в case — число?</p>`,
   options:[{t:'Порівняти текст і число на рівність можна — це просто False',ok:true,why:'== між текстом і числом дає False. Помилка буває при >, <, а не при рівності.'},
            {t:'Python сам перетворив текст на число',ok:false,why:'Не перетворює: "1" лишається текстом.'},
            {t:'Помилка буде, але пізніше',ok:false,why:'Ні: програма закінчиться нормально, лише з неправильним результатом.'}]},

  {id:'r4',sec:3,kind:'read',title:'if усередині case',
   body:`<p>Усередині гілки case можна писати будь-який код, і if теж. Спершу match вибирає гілку, потім if усередині вирішує деталі.</p>
<div class="box"><pre class="code">match sposib:
    case "кур'єр":
        if suma >= 500:
            print("Доставка 0 грн")
        else:
            print("Доставка 80 грн")
    case "пошта":
        print("Доставка 60 грн")
    case _:
        print("Самовивіз")</pre></div>
<p>Межа: <code>&gt;=</code> — «500 і більше», отже рівно 500 — теж безкоштовно.</p>`},
  {id:'p5',sec:3,kind:'predict',title:'Доставка',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:DOST(500,"кур'єр"),answer:'Доставка 0 грн'},{code:DOST(499,"кур'єр"),answer:'Доставка 80 грн'},{code:DOST(1000,'пошта'),answer:'Доставка 60 грн'}],
   hint:'Спершу яка гілка match, потім — if усередині неї.',
   explain:'match вибрав гілку за способом, а if — за сумою: 500 >= 500 — True.'},
  {id:'t1',sec:3,kind:'text',title:'Самовивіз',
   body:`<p>Сума 2000, спосіб <code>"самовивіз"</code>. Що надрукує програма доставки?</p>`,
   answers:['Самовивіз'],field:'Вивід програми',
   hint:'Чи є case "самовивіз"?',explain:'Такого case немає — спрацював case _: «Самовивіз».'},

  {id:'r5',sec:4,kind:'read',title:'Підсумок',
   body:`<ul class="plain"><li><code>match</code> — одна змінна, багато можливих значень; перший збіг виграє.</li>
<li><code>|</code> — кілька значень в одній гілці; <code>case _</code> — останнім.</li>
<li>Текст — спершу <code>strip()</code> і <code>lower()</code>; число з input — <code>int()</code>.</li>
<li>Усередині case можна писати if.</li></ul>`},
  {id:'m1',sec:4,kind:'multi',title:'Що правда про match?',
   body:`<p>Познач усі правильні твердження.</p>`,
   options:[{t:'Спрацьовує перший case, що збігся',ok:true,why:'Решта пропускається.'},
            {t:'case 2 | 3: — гілка для 2 або 3',ok:true,why:'| означає «або».'},
            {t:'case _ можна ставити будь-де',ok:false,why:'Лише останнім — інакше SyntaxError.'},
            {t:'"5" і 5 у case — одне й те саме',ok:false,why:'Текст і число різні.'}]},
  {id:'p6',sec:4,kind:'predict',title:'Квиток у музей',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:`k = "  Учнівський".strip().lower()
match k:
    case "дитячий":
        print("50 грн")
    case "учнівський" | "студентський":
        print("70 грн")
    case _:
        print("100 грн")`,answer:'70 грн'},{code:`k = "Пенсійний".strip().lower()
match k:
    case "дитячий":
        print("50 грн")
    case "учнівський" | "студентський":
        print("70 грн")
    case _:
        print("100 грн")`,answer:'100 грн'}],
   hint:'Після strip().lower() — яке слово лишилось?',
   explain:'"  Учнівський" → "учнівський" — гілка з |. "пенсійний" такого case немає — case _.'}
  ]
};

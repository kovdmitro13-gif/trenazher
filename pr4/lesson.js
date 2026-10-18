/* ============ ТЕМА (дані) ============ */
/* Джерело — уроки 25-26 10-І «Практична № 4: підсумок лінійних алгоритмів» (19.10.2026): презентація, конспект і
   «25-26 урок 10 клас профільний Для вчителя — практична № 4 і повторення.md» у
   ../Навчальні програми/10 клас 4години/2026-2027/Навчальна програма/2. Мова програмування та структури даних (лінійні алгоритми)/25 - 20261019/;
   задачі практичної — каталог «19 - 20261006». Довідка: docs.python.org/3/library/string.html#format-specification-mini-language,
   docs.python.org/3/library/math.html#math.ceil, w3schools.com/python/python_string_formatting.asp, w3schools.com/python/ref_math_ceil.asp
   (відкрито 18.10.2026). Приклади вправ інші, ніж у задачах практичної (там — "12" і 5, високосний рік, рахунок на трьох, трикутник). */
const DOCS='https://docs.python.org/3/', W3='https://www.w3schools.com/python/';
const more=(...pairs)=>'<p class="more">Докладніше: '+pairs.map(([t,d,w])=>`<code>${t}</code> — <a href="${DOCS+d}" target="_blank" rel="noopener">docs.python.org</a>`+(w?`, <a href="${W3+w}" target="_blank" rel="noopener">W3Schools</a>`:'')).join('; ')+'</p>';

const LESSON={
  id:'py10i-pr4-v1', klass:'10-І', subject:'Python',
  classes:['10-І'],
  title:'Практична № 4: підсумок лінійних алгоритмів', plot:'Шкільна поїздка', minutes:40,
  submitUrl:'https://script.google.com/macros/s/AKfycbw7F0TWcmUAq3awyHMpRxZqGfgmc5uSc010xL_q2qdSVxOdtRWagi6mNRyWtGdS6Q/exec',
  missText:'Не збігається. Переглянь пояснення вище ще раз.',
  intro:`<p>Це уроки 25-26 «Практична № 4: підсумок лінійних алгоритмів» — для тих, у кого урок пропав або хто хоче повторити.</p>
<p><b>Що проходимо на уроці</b> (з презентації):</p>
<ul class="plain"><li>Спершу — помилки уроків 17-20, f-рядки й бібліотека math.</li>
<li>Далі — практична № 4: чотири задачі на всю тему.</li>
<li>На практичній ШІ не використовуємо: оцінка — за твоє вміння.</li></ul>
<p>Тут — усе, що треба для практичної: рядки й числа, f-рядки й рівна таблиця, бібліотека math і import, ділення й округлення, bool без if, помилки під час роботи. У кожному розділі спершу пояснення з прикладом, який можна запустити, потім 2–3 вправи. Тексти помилок тут можуть трохи відрізнятися від IDLE — назва помилки та сама.</p>`,
  sections:['Де губили бали','Рядок і число','f-рядки','Рівна таблиця','Бібліотеки: import math','Ділення й округлення','bool без if','Помилки під час роботи','Здача'],
  steps:[
  {id:'r1',sec:0,kind:'read',title:'Де губили бали на уроках 17-20',
   body:`<ul class="plain"><li>Вивід у формі не з запуску: переписано, «як мало бути».</li>
<li><code>int("120.5")</code> — ValueError; <code>float("2,5")</code> — теж: спершу <code>replace</code>.</li>
<li>Тексти порівнюються посимвольно: <code>"9" &lt; "14"</code> — False.</li>
<li><code>round(17 / 5)</code> — 3, а <code>math.ceil(17 / 5)</code> — 4: ceil завжди вгору.</li>
<li>Рівна таблиця — ширина поля у f-рядку, а не пробіли руками.</li>
<li>Корінь із від’ємного — ValueError; рятує <code>max</code>.</li></ul>
<p>Запусти: тексти порівнюються за першим символом, числа — за значенням.</p>`,
   runs:[{code:`print("9" < "14")
print(int("9") < int("14"))`}]},

  {id:'r2',sec:0,kind:'choice',title:'Тексти чи числа',
   body:`<p>Що виведе програма?</p>`,
   code:`print("5" < "40")`,
   options:[
    {t:'False',ok:true,why:'Так. Це тексти: порівнюються перші символи, а "5" іде після "4".'},
    {t:'True',why:'Ні. Так було б для чисел 5 і 40. Тут у лапках — тексти.'},
    {t:'TypeError',why:'Ні. Два тексти порівнювати можна — посимвольно.'}]},

  {id:'t1',sec:1,kind:'read',title:'input() — завжди рядок',
   body:`<p><code>input()</code> повертає рядок. Число з нього робить <code>int()</code> (ціле) або <code>float()</code> (дробове).</p>
<ul class="plain"><li><code>int("120.5")</code> — ValueError: у цілому числі крапки немає.</li>
<li><code>float("2,5")</code> — ValueError: Python пише дробові через крапку. Кому спершу міняємо: <code>.replace(",", ".")</code>.</li></ul>`,
   runs:[{code:`x = input("Вага: ")
kg = float(x.replace(",", "."))
print(kg * 2)`,stdin:'2,5',label:'ввід 2,5'}],
   after:more(['float()','library/functions.html#float','python_casting.asp'])},

  {id:'t2',sec:1,kind:'predict',title:'Що виведе програма?',
   body:`<p>Порахуй у голові, не запускаючи.</p>`,
   variants:[
    {code:`a = "7"
print(a * 3)`,answer:'777'},
    {code:`a = "7"
print(int(a) * 3)`,answer:'21'},
    {code:`a = "7"
print(a == 7)`,answer:'False'}],
   hint:'"7" у лапках — текст. Текст × 3 — повтор. int("7") — уже число.',
   explain:'Рядок, помножений на число, повторюється; int() перетворює на число; рядок "7" не дорівнює числу 7.'},

  {id:'t3',sec:1,kind:'fix',title:'Ціна з комою',
   body:`<p>Літр пального — 60 грн. Програма рахує вартість, але падає, коли ввести <code>12,5</code>. Виправ її: для <code>12,5</code> має вийти <code>750.0</code>.</p>`,
   code:`l = float(input("Літрів: "))
print(l * 60)`,stdin:'12,5',
   tests:[{in:['12,5'],out:'750.0'},{in:['2.5'],out:'150.0'}],
   hint:'Перед float() заміни кому на крапку методом replace.',
   explain:'<code>l = float(input("Літрів: ").replace(",", "."))</code>.'},

  {id:'t4',sec:1,kind:'read',title:'split(): кілька значень в одному рядку',
   body:`<p>Якщо в одному рядку вводять кілька значень через пробіл, <code>split()</code> ріже рядок на частини. Кожна частина — теж рядок: числа з них робимо через <code>int()</code> чи <code>float()</code>.</p>`,
   runs:[{code:`name, km = input().split()
km = float(km.replace(",", "."))
print(name, "проїхав", km * 2)`,stdin:'Олег 3,5',label:'ввід «Олег 3,5»'}],
   after:more(['str.split','library/stdtypes.html#str.split','ref_string_split.asp'])},

  {id:'t5',sec:1,kind:'predict',title:'Що виведе split?',
   body:`<p>Порахуй у голові: що виведе програма?</p>`,
   variants:[
    {code:`a, b = "3 4".split()
print(a + b)`,answer:'34'},
    {code:`a, b = "3 4".split()
print(int(a) + int(b))`,answer:'7'},
    {code:`a, b = "10 2".split()
print(a * 2)`,answer:'1010'}],
   hint:'Після split() частини — рядки. Рядки + склеюються, а не додаються.',
   explain:'"3" + "4" — склеювання: "34". Додати як числа — спершу int().'},

  {id:'g1',sec:2,kind:'read',title:'f-рядок: значення просто в тексті',
   body:`<p><b>f-рядок</b> — рядок з літерою <code>f</code> перед лапками. У фігурних дужках <code>{}</code> пишемо змінну або вираз — Python підставить значення:</p>
<ul class="plain"><li><code>f"{name}, {age} років"</code> — значення змінних;</li>
<li><code>f"Через рік: {age + 1}"</code> — у дужках можна рахувати;</li>
<li>без <code>f</code> дужки лишаються дужками: <code>"{name}"</code> так і надрукується;</li>
<li>після двокрапки — формат: <code>{price:.2f}</code> — два знаки після крапки.</li></ul>
<p>Запусти й зміни значення змінних — подивись, як змінюється рядок.</p>`,
   runs:[{code:`name = "Іра"
age = 15
print(f"{name}, {age} років")
print(f"Через рік: {age + 1}")
print("{name}")`}],
   after:more(['f-рядки','tutorial/inputoutput.html#formatted-string-literals','python_string_formatting.asp'])},

  {id:'g2',sec:2,kind:'predict',title:'Що в дужках?',
   body:`<p>Що виведе програма?</p>`,
   variants:[
    {code:`x = 4
print(f"{x} * 2 = {x * 2}")`,answer:'4 * 2 = 8'},
    {code:`w = "сир"
print(f"{len(w)} літери")`,answer:'3 літери'},
    {code:`x = 4
print("{x} + 1")`,answer:'{x} + 1'}],
   hint:'Що в {} — обчислюється. Немає f перед лапками — нічого не підставляється.',
   explain:'У f-рядку вираз у {} замінюється значенням; без f — це просто текст із дужками.'},

  {id:'g3',sec:2,kind:'fix',title:'Забули f',
   body:`<p>Програма мала привітатися на ім’я, а друкує дужки. Виправ: має вийти <code>Привіт, Оля!</code></p>`,
   code:`n = "Оля"
print("Привіт, {n}!")`,
   tests:[{in:[],out:'Привіт, Оля!'}],
   hint:'Чого бракує перед лапками?',
   explain:'<code>print(f"Привіт, {n}!")</code> — літера f перед лапками.'},

  {id:'g4',sec:2,kind:'code',title:'Напиши сам: через рік',
   body:`<p>Програма питає ім’я, потім вік і друкує один рядок, як у прикладі. Для <code>Олег</code> і <code>15</code>:</p>
<pre class="con">Олег, через рік тобі 16</pre>
<p>Напиши програму з f-рядком, запусти, тоді перевір.</p>`,
   code:``,stdin:'Олег\n15',
   tests:[{in:['Олег','15'],out:'Олег, через рік тобі 16'},{in:['Яна','9'],out:'Яна, через рік тобі 10'}],
   hint:'Два input(); вік перетвори на int. У f-рядку: {name} і {age + 1}.',
   explain:'<code>name = input()</code>, <code>age = int(input())</code>, <code>print(f"{name}, через рік тобі {age + 1}")</code>.'},

  {id:'f1',sec:3,kind:'read',title:'Рівна таблиця у f-рядку',
   body:`<p>У дужках після двокрапки — як показати значення:</p>
<ul class="plain"><li>число — <b>ширина поля</b>: скільки позицій займе значення;</li>
<li><code>&lt;</code> — притиснути ліворуч, <code>&gt;</code> — праворуч, <code>^</code> — по центру;</li>
<li>можна разом із точністю: <code>{fee:&gt;8.2f}</code> — ширина 8, два знаки після крапки.</li></ul>
<p>Ширину дописує Python, а не ти пробілами — тому стовпчики рівні за будь-яких імен і сум.</p>`,
   runs:[{code:`name = "Іра"
fee = 7.5
print(f"|{name:<6}|{fee:>8.2f}|")`}],
   after:more(['формат у f-рядку','library/string.html#format-specification-mini-language','python_string_formatting.asp'])},

  {id:'f2',sec:3,kind:'text',title:'Скільки пробілів?',
   body:`<p>Скільки пробілів Python поставить <b>перед</b> числом у <code>f"{42:&gt;5}"</code>?</p>`,
   field:'пробілів',answers:['3'],
   near:{'5':'Ні. 5 — це вся ширина поля. Саме число займає дві позиції.','2':'Ні. 2 — це скільки позицій займає 42. Решта — пробіли.'},
   hint:'Поле — 5 позицій, число 42 — дві.',
   explain:'5 − 2 = 3 пробіли, число — праворуч: <code>"   42"</code>.'},

  {id:'f3',sec:3,kind:'choice',title:'Що робить {name:<10}',
   body:`<p>Що робить <code>{name:&lt;10}</code> у f-рядку?</p>`,
   options:[
    {t:'Ставить ім’я ліворуч у полі з 10 позицій, решту доповнює пробілами',ok:true,why:'Так. Тому наступний стовпчик починається з того самого місця.'},
    {t:'Обрізає ім’я до 10 літер',why:'Ні. Ширина — це мінімум: довше ім’я Python не обріже.'},
    {t:'Додає 10 пробілів перед іменем',why:'Ні. Пробілів стільки, скільки бракує до 10, і вони після імені.'}]},

  {id:'f4',sec:3,kind:'predict',title:'Два знаки після крапки',
   body:`<p>Що виведе програма?</p>`,
   variants:[
    {code:`print(f"{2:.2f}")`,answer:'2.00'},
    {code:`print(f"{0.5:.2f}")`,answer:'0.50'},
    {code:`print(f"{3.14159:.2f}")`,answer:'3.14'}],
   hint:'.2f — рівно два знаки після крапки: бракує — дописуються нулі.',
   explain:'<code>.2f</code> показує число з двома знаками після крапки.'},

  {id:'f5',sec:3,kind:'predict',title:'sep, end і нулі попереду',
   body:`<p>У <code>print</code> є <code>sep</code> — що ставити між значеннями (звичайно пробіл), і <code>end</code> — що в кінці (звичайно перехід на новий рядок). <code>{n:03d}</code> — ціле число в полі з 3 позицій, порожні місця — нулі. Що виведе програма?</p>`,
   variants:[
    {code:`print(1, 2, sep="+", end="=")`,answer:'1+2='},
    {code:`print("A", "B", "C", sep="")`,answer:'ABC'},
    {code:`print(f"{7:03d}")`,answer:'007'}],
   hint:'sep — між значеннями, end — у кінці; 03 — три позиції, доповнити нулями.',
   explain:'<code>sep="+"</code> ставить плюс між 1 і 2, <code>end="="</code> — знак рівності в кінці замість переходу на новий рядок. <code>{7:03d}</code> дає 007.'},

  {id:'m1',sec:4,kind:'read',title:'Бібліотека (модуль) і import',
   body:`<p><b>Бібліотека (модуль)</b> — готовий набір функцій. Модуль <code>math</code> є в Python, але не підключений одразу: його підключають командою <code>import</code> — один раз, на початку програми.</p>
<p><code>math</code> — математика. Після <code>import math</code> функції пишемо через крапку:</p>
<ul class="plain"><li><code>math.sqrt(x)</code> — корінь, завжди дробове число: <code>math.sqrt(16)</code> → 4.0;</li>
<li><code>math.ceil(x)</code> — округлити <b>вгору</b>: 3.2 → 4;</li>
<li><code>math.floor(x)</code> — округлити <b>вниз</b>: 3.8 → 3;</li>
<li><code>math.pi</code> — число π.</li></ul>`,
   runs:[{code:`import math
print(math.sqrt(16))
print(math.ceil(3.2))
print(math.floor(3.8))
print(math.pi)`}],
   after:more(['import','tutorial/modules.html','python_modules.asp'],['math','library/math.html','module_math.asp'])},

  {id:'m2',sec:4,kind:'read',title:'Три способи підключити',
   body:`<ul class="plain"><li><code>import math</code> → <code>math.sqrt(9)</code>: видно, звідки функція;</li>
<li><code>from math import sqrt, pi</code> → <code>sqrt(9)</code> і <code>pi</code> без «math.»;</li>
<li><code>import math as m</code> → <code>m.sqrt(9)</code>: коротке ім’я модуля.</li></ul>
<p>Забув <code>import</code> — <b>NameError</b>: Python не знає такого імені. Запусти другий приклад — побачиш.</p>`,
   runs:[{code:`from math import sqrt, pi
print(sqrt(9))
print(round(pi, 2))`,label:'from … import'},{code:`print(sqrt(25))`,label:'без import'},{code:`import math as m
print(m.floor(7 / 2))`,label:'import … as'}]},

  {id:'m3',sec:4,kind:'predict',title:'Що виведе math?',
   body:`<p>Порахуй у голові, не запускаючи.</p>`,
   variants:[
    {code:`import math
print(math.floor(7 / 2))`,answer:'3'},
    {code:`import math
print(math.sqrt(49))`,answer:'7.0'},
    {code:`import math
print(math.ceil(-2.5))`,answer:'-2'}],
   hint:'floor — униз, ceil — угору (для від’ємних угору — це ближче до нуля), sqrt — завжди дробове.',
   explain:'floor(3.5) = 3; sqrt(49) = 7.0 — з крапкою; ceil(−2.5) = −2, бо −2 більше за −2.5.'},

  {id:'m4',sec:4,kind:'choice',title:'Без import',
   body:`<p>У програмі один рядок, <code>import</code> немає. Що станеться?</p>`,
   code:`print(math.sqrt(25))`,
   options:[
    {t:'NameError: Python не знає імені math',ok:true,why:'Так. Модуль спершу підключають: import math. Python 3.14 так і підкаже: «Did you forget to import \'math\'?»'},
    {t:'Виведе 5.0',why:'Ні. Без import math Python не знає, що таке math.'},
    {t:'SyntaxError',why:'Ні. Записано правильно — помилка з’являється під час роботи.'}]},

  {id:'m5',sec:4,kind:'fix',title:'Підключили не так',
   body:`<p>Програма падає з NameError. Виправ її, щоб вивела <code>6.0</code>. Підійде будь-який зі способів підключення.</p>`,
   code:`from math import sqrt
print(math.sqrt(36))`,
   tests:[{in:[],out:'6.0'}],
   hint:'from math import sqrt дає sqrt без «math.». Або підключи весь модуль: import math.',
   explain:'Або <code>print(sqrt(36))</code>, або перший рядок <code>import math</code>.'},

  {id:'m6',sec:4,kind:'code',title:'Напиши сам: сторона квадрата',
   body:`<p>Користувач вводить площу квадрата. Програма друкує сторону з одним знаком після крапки. Для <code>20</code>:</p>
<pre class="con">Сторона: 4.5</pre>
<p>Підключи math, напиши програму, запусти, тоді перевір.</p>`,
   code:``,stdin:'20',
   tests:[{in:['20'],out:'Сторона: 4.5'},{in:['9'],out:'Сторона: 3.0'},{in:['2,25'],out:'Сторона: 1.5'}],
   hint:'Площа може бути з комою: replace і float. Сторона — math.sqrt(площа). Формат: {side:.1f}.',
   explain:'<code>import math</code>, <code>s = float(input().replace(",", "."))</code>, <code>side = math.sqrt(s)</code>, <code>print(f"Сторона: {side:.1f}")</code>.'},

  {id:'d1',sec:5,kind:'read',title:'Ділення й округлення',
   body:`<ul class="plain"><li><code>/</code> — звичайне ділення, завжди дробове: <code>17 / 5</code> — 3.4;</li>
<li><code>//</code> — ціла частина: 3; <code>%</code> — остача: 2;</li>
<li><code>round(x)</code> — до найближчого цілого: 3.4 → 3;</li>
<li><code>math.ceil(x)</code> — <b>завжди вгору</b>: 3.4 → 4 (з розділу вище: потрібен <code>import math</code>).</li></ul>
<p>Коли «не вистачить навіть одного місця» — автобуси, коробки, пачки — округлюють угору: <code>math.ceil</code>.</p>`,
   runs:[{code:`import math
print(17 / 5, 17 // 5, 17 % 5)
print(round(17 / 5))
print(math.ceil(17 / 5))`}],
   after:more(['math.ceil','library/math.html#math.ceil','ref_math_ceil.asp'])},

  {id:'d2',sec:5,kind:'text',title:'Скільки мікроавтобусів?',
   body:`<p>На екскурсію їде 41 учень, у мікроавтобусі 10 місць. Скільки мікроавтобусів треба замовити?</p>`,
   field:'мікроавтобусів',answers:['5'],
   near:{'4':'Ні. У чотири влізе лише 40 — один учень лишиться. Це помилка round(41 / 10).','4,1':'Ні. Мікроавтобусів — ціле число. Округли вгору.','4.1':'Ні. Мікроавтобусів — ціле число. Округли вгору.'},
   hint:'41 / 10 = 4.1. Чи вистачить чотирьох?',
   explain:'<code>math.ceil(41 / 10)</code> — 5. <code>round(4.1)</code> дав би 4, і один учень лишився б удома.'},

  {id:'d3',sec:5,kind:'choice',title:'Який вираз',
   body:`<p>26 учнів, у мікроавтобусі 8 місць. Який вираз дає правильну кількість мікроавтобусів?</p>`,
   options:[
    {t:'math.ceil(26 / 8)',ok:true,why:'Так: 3.25 угору — 4.'},
    {t:'round(26 / 8)',why:'Ні. round(3.25) — 3, а у три мікроавтобуси влізе лише 24 учні.'},
    {t:'26 // 8',why:'Ні. Ціла частина — 3, остачу 2 учні загублено.'}]},

  {id:'b1',sec:6,kind:'read',title:'bool без if',
   body:`<p>Відповідь «так/ні» — це вираз типу <code>bool</code>: порівняння, з’єднані <code>and</code>, <code>or</code>, <code>not</code>. «Ділиться на 4» — <code>n % 4 == 0</code>: остача 0.</p>
<p>Правило з винятком перевіряй на «підступних» значеннях — тих, де діє виняток, і на межах. Програма, що правильна для двох прикладів, ще не правильна.</p>`,
   runs:[{code:`n = 36
print(n % 4 == 0 and n % 9 == 0)`}],
   after:more(['and, or, not','library/stdtypes.html#boolean-operations-and-or-not','python_operators_logical.asp'])},

  {id:'b2',sec:6,kind:'predict',title:'True чи False?',
   body:`<p>Що виведе програма?</p>`,
   variants:[
    {code:`n = 15
print(n % 3 == 0 and n % 5 == 0)`,answer:'True'},
    {code:`n = 10
print(n % 3 == 0 or n % 5 == 0)`,answer:'True'},
    {code:`n = 10
print(not n % 5 == 0)`,answer:'False'}],
   hint:'Спершу кожне порівняння окремо, потім and / or / not.',
   explain:'Порахуй остачі: 15 % 3 = 0, 15 % 5 = 0; 10 % 3 = 1, 10 % 5 = 0. Потім and — обидва, or — хоча б одне, not — навпаки.'},

  {id:'b3',sec:6,kind:'choice',title:'Що перевірити',
   body:`<p>Знижка діє, якщо вік менший за 18 або більший за 60:</p>`,
   code:`disc = age < 18 or age > 60`,
   options:[
    {t:'17, 18, 60 і 61 — по обидва боки кожної межі',ok:true,why:'Так. Саме на межі найчастіше плутають < і <=.'},
    {t:'5 і 90',why:'Ні. Вони далеко від меж: помилку з < чи <= такі числа не покажуть.'},
    {t:'Лише 30',why:'Ні. Одне значення перевіряє лише одну гілку.'}]},

  {id:'b4',sec:6,kind:'gaps',title:'Щасливе число',
   body:`<p>Число «щасливе», якщо ділиться на 7, але не ділиться на 2. Заповни пропуск: для 21 має вийти <code>True</code>, для 14 — <code>False</code>.</p>`,
   code:`n = int(input())
lucky = n % 7 == 0 ____ n % 2 != 0
print(lucky)`,stdin:'21',
   tests:[{in:['21'],out:'True'},{in:['14'],out:'False'},{in:['9'],out:'False'}],
   hint:'Мають справдитися обидві умови.',
   explain:'<code>and</code>: і ділиться на 7, і не ділиться на 2.'},

  {id:'e1',sec:7,kind:'read',title:'Помилки під час роботи',
   body:`<p>Синтаксис може бути правильним, а програма все одно впаде — на певних даних:</p>
<ul class="plain"><li><code>int("3.5")</code> — ValueError;</li>
<li><code>math.sqrt(-4)</code> — ValueError: корінь із від’ємного числа не існує.</li></ul>
<p>Від’ємне під коренем рятує <code>max(0, x)</code>: з двох чисел береться більше, тож результат не менший за нуль.</p>`,
   runs:[{code:`import math
x = -4
print(math.sqrt(max(0, x)))`}]},

  {id:'e2',sec:7,kind:'choice',title:'Що дасть max',
   body:`<p>Що поверне <code>max(0, -2.5)</code>?</p>`,
   options:[
    {t:'0',ok:true,why:'Так. З двох чисел max бере більше: 0 > −2.5.'},
    {t:'-2.5',why:'Ні. Це менше з двох чисел — таке дав би min.'},
    {t:'2.5',why:'Ні. max не прибирає мінус — для цього є abs.'}]},

  {id:'e3',sec:7,kind:'choice',title:'Яка помилка',
   body:`<p>Яку помилку покаже Python на рядку <code>n = int("3.5")</code>?</p>`,
   options:[
    {t:'ValueError',ok:true,why:'Так. Рядок "3.5" — не запис цілого числа.'},
    {t:'TypeError',why:'Ні. TypeError — коли змішують типи, наприклад рядок і число в операції.'},
    {t:'SyntaxError',why:'Ні. Записано все правильно — помилка з’явиться лише під час роботи.'}]},

  {id:'z1',sec:8,kind:'read',title:'Як здати практичну',
   body:`<p>Форма та сама, що на уроках 17-20: <a href="https://forms.gle/P8kXDpUutJwtBtUk6" target="_blank" rel="noopener">forms.gle/P8kXDpUutJwtBtUk6</a>. Обери «Уроки 25-26 — практична № 4: bool і тестування». Одна здача за пару. Кожен вивід у формі — копія з Shell після запуску.</p>
<p><b>Чекліст — 12 балів:</b> задача 1 — 2, задача 2 — 3, задача 3 — 3, задача 4 — 4.</p>`},

  {id:'z2',sec:8,kind:'choice',title:'Який варіант обрати',
   body:`<p>Пару 19.10 зроблено. Що обрати у формі?</p>`,
   options:[
    {t:'Уроки 25-26 — практична № 4: bool і тестування',ok:true,why:'Так. Номери — як у журналі.'},
    {t:'Урок 20 — практична: bool і тестування',why:'Ні. Це старий варіант уроку 20; для пари 19.10 у формі є окремий — «Уроки 25-26».'},
    {t:'Урок 19 — «Картка учасника»: bool і виведення',why:'Ні, це урок 19.'}]}
  ]
};

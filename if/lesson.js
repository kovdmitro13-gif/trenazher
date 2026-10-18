/* ============ ТЕМА (дані) ============ */
/* Джерело — уроки 27-28 10-І «Розгалуження: if і else» (20.10.2026, 21-22 за КТП): презентація, конспект і
   «27-28 урок 10 клас профільний Для вчителя — розгалуження, еталони і ключ.md» у
   ../Навчальні програми/10 клас 4години/2026-2027/Навчальна програма/2. Мова програмування та структури даних (лінійні алгоритми)/27 - 20261020/.
   Довідка: docs.python.org/3/tutorial/controlflow.html#if-statements, w3schools.com/python/python_conditions.asp,
   docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not (відкрито 18.10.2026).
   Сюжети вправ інші, ніж у практичній уроку 28 (квиток у кіно, доставка, дні в році): рюкзак, ліфт, парне/непарне. */
const DOCS='https://docs.python.org/3/', W3='https://www.w3schools.com/python/';
const more=(...pairs)=>'<p class="more">Докладніше: '+pairs.map(([t,d,w])=>`<code>${t}</code> — <a href="${DOCS+d}" target="_blank" rel="noopener">docs.python.org</a>`+(w?`, <a href="${W3+w}" target="_blank" rel="noopener">W3Schools</a>`:'')).join('; ')+'</p>';

const LESSON={
  id:'py10i-if-else-v1', klass:'10-І', subject:'Python',
  classes:['10-І'],
  title:'Розгалуження: if і else', plot:'Картка учасника', minutes:30,
  submitUrl:'https://script.google.com/macros/s/AKfycbw7F0TWcmUAq3awyHMpRxZqGfgmc5uSc010xL_q2qdSVxOdtRWagi6mNRyWtGdS6Q/exec',
  missText:'Не збігається. Переглянь пояснення вище ще раз.',
  intro:`<p>Це уроки 27-28 «Розгалуження: if і else» — для тих, у кого урок пропав або хто хоче повторити.</p>
<p><b>Що проходимо на уроці</b> (з презентації):</p>
<ul class="plain"><li>Тема 3 — розгалуження: програма сама вибирає, що робити.</li>
<li>Урок 27: таблиця істинності, if, if … else, «Картка» вирішує.</li>
<li>Урок 28: практична — знайди помилки, допиши, перевір межі.</li></ul>
<p>У кожному розділі спершу пояснення з прикладом, який можна запустити, потім 2–3 вправи. Python працює просто в телефоні. Тексти помилок тут можуть трохи відрізнятися від IDLE — назва помилки та сама.</p>`,
  sections:['Таблиця істинності','Скорочена форма if','Повна форма if … else','Помилки: синтаксис і запуск','Межа: < чи <=','Картка вирішує'],
  steps:[
  {id:'t1',sec:0,kind:'read',title:'Таблиця істинності',
   body:`<p><b>Таблиця істинності</b> — усі можливі значення умов і результат. Для двох умов таких рядків чотири.</p>
<ul class="plain"><li><code>and</code> дає <code>True</code> лише тоді, коли обидві умови <code>True</code>;</li>
<li><code>or</code> дає <code>False</code> лише тоді, коли обидві умови <code>False</code>;</li>
<li><code>not</code> перевертає: <code>not True</code> — <code>False</code>.</li></ul>`,
   runs:[{code:`print(True and False)
print(False or True)
print(not False)`}],
   after:`<p>Запусти й порівняй із правилами вище.</p>`+more(['and, or, not','library/stdtypes.html#boolean-operations-and-or-not','python_operators_logical.asp'])},

  {id:'t2',sec:0,kind:'predict',title:'Що виведе програма?',
   body:`<p>Порахуй у голові, не запускаючи.</p>`,
   variants:[
    {code:`print(False and False)`,answer:'False'},
    {code:`print(True and True)`,answer:'True'},
    {code:`print(False or False)`,answer:'False'}],
   hint:'and — True лише для двох True; or — False лише для двох False.',
   explain:'Перевір рядком таблиці: які значення стоять ліворуч і праворуч від and чи or.'},

  {id:'t3',sec:0,kind:'choice',title:'Коли or дає False?',
   body:`<p>У якому випадку <code>a or b</code> дає <code>False</code>?</p>`,
   options:[
    {t:'Лише коли a і b обидва False',ok:true,why:'Так. Досить однієї True, щоб or дав True.'},
    {t:'Коли хоча б одне False',why:'Ні, це про and: and дає False, коли хоча б одне False.'},
    {t:'Ніколи',why:'Ні. Для двох False or дає False.'}]},

  {id:'i1',sec:1,kind:'read',title:'Скорочена форма if',
   body:`<p><code>if умова:</code> — далі рядки з відступом у 4 пробіли. Умова <code>True</code> — рядки з відступом виконуються; <code>False</code> — пропускаються. Рядок без відступу — уже після <code>if</code>: виконується завжди.</p>
<p>Після умови — двокрапка. В IDLE після Enter відступ з’являється сам.</p>`,
   runs:[{code:`age = int(input("Вік: "))
if age >= 14:
    print("Можна на турнір")
print("Перевірку завершено")`,stdin:'15',label:'вік 15'},{code:`age = int(input("Вік: "))
if age >= 14:
    print("Можна на турнір")
print("Перевірку завершено")`,stdin:'9',label:'вік 9'}],
   after:`<p>Для 15 — два рядки, для 9 — лише «Перевірку завершено».</p>`+more(['if','tutorial/controlflow.html#if-statements','python_conditions.asp'])},

  {id:'i2',sec:1,kind:'predict',title:'Що виведе програма?',
   body:`<p>Що виведе програма? Запиши <b>перший</b> рядок виводу.</p>`,
   variants:[
    {code:`kg = 7
if kg > 5:
    print("Важкий")
print("Готово")`,answer:'Важкий'},
    {code:`kg = 3
if kg > 5:
    print("Важкий")
print("Готово")`,answer:'Готово'},
    {code:`kg = 6
if kg > 6:
    print("Важкий")
print("Готово")`,answer:'Готово'}],
   hint:'Чи правдива умова? Якщо ні — рядок із відступом пропускається, і першим іде «Готово».',
   explain:'Умова True — першим друкується рядок під if. Умова False — він пропускається, а «Готово» без відступу виконується завжди. Зверни увагу: 6 > 6 — False.'},

  {id:'i3',sec:1,kind:'choice',title:'Який рядок виконується завжди?',
   body:`<p>Який рядок виведеться за будь-якого n?</p>`,
   code:`n = int(input())
if n > 0:
    print("додатне")
print("кінець")`,
   options:[
    {t:'кінець',ok:true,why:'Так. Він без відступу — уже не належить до if.'},
    {t:'додатне',why:'Ні. Він під if і виконується лише для n > 0.'},
    {t:'жоден',why:'Ні. «кінець» стоїть після if і виконується завжди.'}]},

  {id:'e1',sec:2,kind:'read',title:'Повна форма if … else',
   body:`<p><code>else:</code> — що робити, коли умова <code>False</code>. Виконується <b>рівно одна</b> гілка: або під <code>if</code>, або під <code>else</code>. <code>else</code> пишемо на тому ж рівні, що й <code>if</code>, теж із двокрапкою.</p>
<p>Знаки порівняння — з уроку 19: <code>&lt;=</code> — «менше або дорівнює». Тому «до 8 <b>включно</b>» — це <code>&lt;= 8</code>: саме 8 теж проходить.</p>`,
   runs:[{code:`n = int(input("Число: "))
if n % 2 == 0:
    print("парне")
else:
    print("непарне")`,stdin:'7'}],
   after:`<p>Скорочена форма — без <code>else</code>: коли умова <code>False</code>, нічого не робимо.</p>`},

  {id:'e1b',sec:2,kind:'predict',title:'Парне чи непарне?',
   body:`<p>Порахуй у голові: що виведе програма з пояснення вище для такого числа?</p>`,
   variants:[
    {code:`n = 10
if n % 2 == 0:
    print("парне")
else:
    print("непарне")`,answer:'парне'},
    {code:`n = 3
if n % 2 == 0:
    print("парне")
else:
    print("непарне")`,answer:'непарне'},
    {code:`n = 0
if n % 2 == 0:
    print("парне")
else:
    print("непарне")`,answer:'парне'}],
   hint:'n % 2 — остача від ділення на 2. Остача 0 — число ділиться на 2.',
   explain:'Остача 0 — умова True, гілка if; інакше — гілка else.'},

  {id:'e2',sec:2,kind:'gaps',title:'Ліфт',
   body:`<p>Ліфт везе до 8 людей включно. Заповни пропуски: для 8 програма має вивести <code>Їдемо</code>, для 9 — <code>Перевантаження</code>.</p>`,
   code:`people = int(input("Людей: "))
if people ____ 8:
    print("Їдемо")
____:
    print("Перевантаження")`,stdin:'8',
   tests:[{in:['8'],out:'Їдемо'},{in:['9'],out:'Перевантаження'},{in:['1'],out:'Їдемо'}],
   hint:'«До 8 включно» — 8 теж можна. Друга гілка — те, що робити інакше.',
   explain:'<code>people &lt;= 8</code> включає саме 8. Друга гілка — <code>else</code>.'},

  {id:'e3',sec:2,kind:'choice',title:'Одна чи дві гілки',
   body:`<p>Чи може за один запуск виконатися і гілка <code>if</code>, і гілка <code>else</code>?</p>`,
   options:[
    {t:'Ні, завжди рівно одна',ok:true,why:'Так. Умова або True (гілка if), або False (гілка else).'},
    {t:'Так, якщо умова складна',why:'Ні. Навіть складна умова дає одне значення — True або False.'},
    {t:'Так, якщо else без відступу',why:'Ні. else завжди без відступу відносно if — і все одно виконується лише одна гілка.'}]},

  {id:'s1',sec:3,kind:'read',title:'Три помилки синтаксису',
   body:`<p>На уроці зробили три типові помилки й подивилися, що каже Python (Python 3.10; в IDLE текст у вікні коротший):</p>
<ul class="plain"><li><code>if age = 14:</code> — <code>SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?</code> Знак <code>=</code> кладе значення, <code>==</code> порівнює.</li>
<li><code>if age >= 14</code> без двокрапки — <code>SyntaxError: expected ':'</code></li>
<li>рядок під <code>if</code> без відступу — <code>IndentationError: expected an indented block after 'if' statement</code></li></ul>
<p>Синтаксичні помилки Python знаходить ще до запуску й показує по одній: виправив — запускай знову.</p>`},

  {id:'s2',sec:3,kind:'fix',title:'Виправ програму',
   body:`<p>У програмі дві помилки синтаксису. Виправ її. Для <code>12</code> має вийти <code>Дюжина</code>, для інших чисел — нічого, крім <code>Кінець</code>.</p>`,
   code:`n = int(input("Число: "))
if n = 12
    print("Дюжина")
print("Кінець")`,stdin:'12',
   tests:[{in:['12'],out:'Дюжина\nКінець'},{in:['5'],out:'Кінець'}],
   hint:'Порівнюють двома знаками рівності. Після умови — двокрапка.',
   explain:'<code>if n == 12:</code> — два знаки = і двокрапка.'},

  {id:'s3',sec:3,kind:'choice',title:'Що означає IndentationError',
   body:`<p>Python написав <code>IndentationError: expected an indented block</code>. Що виправити?</p>`,
   options:[
    {t:'Додати відступ 4 пробіли рядку під if',ok:true,why:'Так. Під if має бути хоча б один рядок із відступом.'},
    {t:'Поставити == замість =',why:'Ні. Про = і == Python каже SyntaxError з підказкою «Maybe you meant ==».'},
    {t:'Додати int() до input()',why:'Ні. Це про тип даних, а не про відступ.'}]},

  {id:'s4',sec:3,kind:'choice',title:'Помилка під час запуску',
   body:`<p>У практичній уроку 28 одна з помилок — не синтаксична: Python бачить її лише тоді, коли програма вже працює. Що станеться, коли в цю програму ввести <code>130</code>?</p>`,
   code:`h = input("Зріст: ")
if h >= 120:
    print("Можна")`,
   options:[
    {t:'TypeError під час роботи: рядок не порівняти з числом',ok:true,why:'Так. input() дає рядок "130", а 120 — число. Синтаксис правильний, тому помилка з’являється лише під час запуску. Ліки — int(input(…)).'},
    {t:'SyntaxError ще до запуску',why:'Ні. Двокрапка, відступ і знак >= на місці — синтаксис правильний.'},
    {t:'Виведе «Можна»',why:'Ні. "130" — це текст, а не число: порівняти його з 120 Python не може.'}]},

  {id:'m1',sec:4,kind:'read',title:'Межа: < чи <=',
   body:`<p>На уроці радили перевіряти <b>межу</b>: якщо в умові «< 14», запусти і 13, і 14. Саме на межі найчастіше помиляються.</p>
<ul class="plain"><li><code>&lt;</code> — строго менше: межове число <b>не</b> входить;</li><li><code>&lt;=</code> — менше або дорівнює: межове число входить.</li></ul>
<p>Слова в умові задачі: «до 5 кг <b>включно</b>» — <code>&lt;= 5</code>; «менше 5 кг» — <code>&lt; 5</code>.</p>
<p>Число може бути з комою (5,1)? Як у темі «input() і типи даних»: <code>float(input().replace(",", "."))</code>.</p>`,
   runs:[{code:`kg = 5
print(kg < 5, kg <= 5)`}]},

  {id:'m1b',sec:4,kind:'text',title:'Який знак?',
   body:`<p>Умова задачі: «атракціон безкоштовний, якщо зріст <b>менше</b> 120 см». Який знак порівняння поставити в <code>if height ___ 120:</code>?</p>`,
   field:'знак',
   answers:['<'],
   near:{'<=':'Ні. «Менше» — строго: 120 не входить. <= означає «менше або дорівнює».','>':'Ні, це «більше».'},
   hint:'Чи входить саме 120 у «менше 120»?',
   explain:'«Менше 120» — <code>&lt;</code>: 119 проходить, 120 — ні.'},

  {id:'m2',sec:4,kind:'code',title:'Напиши сам: рюкзак',
   body:`<p>Рюкзак вагою до 5 кг включно можна взяти в салон, важчий — у багаж. Вага може бути з комою.</p>
<p>Для <code>5</code> програма виводить <code>У салон</code>, для <code>5,1</code> — <code>У багаж</code>. Напиши програму, запусти на своїх даних, тоді перевір.</p>`,
   code:``,stdin:'5',
   tests:[{in:['5'],out:'У салон'},{in:['5,1'],out:'У багаж'},{in:['3.5'],out:'У салон'},{in:['7'],out:'У багаж'}],
   hint:'Прочитай рядок, заміни кому на крапку, перетвори на float. Потім if kg <= 5: … else: …. Назви змінних — латиницею.',
   explain:'<code>kg = float(input().replace(",", "."))</code>, потім <code>if kg &lt;= 5:</code> «У салон», <code>else:</code> «У багаж». Межа 5 входить у салон.'},

  {id:'k1',sec:5,kind:'read',title:'Картка учасника вирішує',
   body:`<p>На уроці «Картка учасника» навчилася вирішувати: повна форма друкує «ДОПУЩЕНО» або «НЕ ДОПУЩЕНО», а три скорочені <code>if</code> друкують лише ті причини, що справдилися.</p>`,
   runs:[{code:`age_ok = False
rating_ok = True
paid = False
if age_ok and rating_ok and paid:
    print("ДОПУЩЕНО")
else:
    print("НЕ ДОПУЩЕНО. Причини:")
if not age_ok:
    print("- вік")
if not rating_ok:
    print("- рейтинг")
if not paid:
    print("- внесок")`}],
   after:`<p>Для Івана (13 років, рейтинг 1500, «ні») на уроці вийшло дві причини: вік і внесок.</p>`},

  {id:'k2',sec:5,kind:'choice',title:'Що виведе фрагмент?',
   body:`<p>Що виведе фрагмент?</p>`,
   code:`age_ok = True
paid = False
if age_ok and paid:
    print("ДОПУЩЕНО")
else:
    print("НІ")
if not paid:
    print("- внесок")`,
   options:[
    {t:'НІ, а під ним «- внесок»',ok:true,why:'Так. True and False — False, тому гілка else. not False — True, тому друкується причина.'},
    {t:'ДОПУЩЕНО',why:'Ні. and дає True лише для двох True, а paid — False.'},
    {t:'Лише НІ',why:'Ні. Скорочений if теж виконується: not paid — True.'}]},

  {id:'k3',sec:5,kind:'read',title:'Підсумок',
   body:`<ul class="plain"><li>and — True лише для двох True; or — False лише для двох False; not перевертає.</li>
<li><code>if умова:</code> + відступ 4 пробіли. Рядок без відступу — після if.</li>
<li><code>else:</code> — друга гілка; виконується рівно одна.</li>
<li><code>=</code> кладе, <code>==</code> порівнює; двокрапка після умови.</li>
<li>Перевіряй межу: &lt; чи &lt;=.</li></ul>`}
  ]
};

/* ============ ТЕМА (дані) ============ */
/* Джерело — урок 43 10-І «Цикл while: скарбничка» (24.11.2026): колода, конспект і «43-44 урок 10 клас профільний
   Для вчителя — ключ, оцінювання.md» (каталог 43 - 20261124). Сюжети інші, ніж на уроці (скарбничка, бабуся, зарядка):
   пробіжка, вік у гру, полив, акваріум. Відповіді звірено в CPython 3.10.12 і 3.13.18 (22.11.2026). */
const DOCS='https://docs.python.org/3/', W3='https://www.w3schools.com/python/';
const more=(...pairs)=>'<p class="more">Докладніше: '+pairs.map(([t,d,w])=>`<code>${t}</code> — <a href="${DOCS+d}" target="_blank" rel="noopener">docs.python.org</a>`+(w?`, <a href="${W3+w}" target="_blank" rel="noopener">W3Schools</a>`:'')).join('; ')+'</p>';
const BIG=`meta = int(input("Ціль, км: "))
den = int(input("Пробігаю за день, км: "))
km = 0
dni = 0
while km < meta:
    km += den
    dni += 1
    print("День", dni, "-", km, "км")
print("Ціль за", dni, "дн.")`;
const PRED=(m,d)=>`meta = ${m}
den = ${d}
km = 0
dni = 0
while km < meta:
    km += den
    dni += 1
print(dni)`;

const LESSON={
  id:'py10i-while-v1', klass:'10-І', subject:'Python',
  classes:['10-І'],
  title:'Цикл while', plot:'Пробіжка й підйом на гору', minutes:30,
  submitUrl:'https://script.google.com/macros/s/AKfycbw7F0TWcmUAq3awyHMpRxZqGfgmc5uSc010xL_q2qdSVxOdtRWagi6mNRyWtGdS6Q/exec',
  missText:'Не збігається. Переглянь пояснення вище ще раз.',
  intro:`<p>Це тема до уроку 43 — для тих, у кого урок пропав. Практика — тема «while: знайди помилку, допиши, напиши сам».</p>
<p><b>Що сьогодні</b> (з презентації):</p>
<ul class="plain"><li>Нове: цикл while — повторювати, поки умова правдива.</li>
<li>Урок 43: скарбничка — скільки тижнів відкладати на ціль.</li>
<li>Урок 44: три задачі — знайди помилки, допиши, напиши сам.</li></ul>`,
  sections:['while: повторюй, поки True','Цикл без кінця','while перевіряє ввід','if усередині while','Напиши сам','Підсумок'],
  steps:[
  {id:'r1',sec:0,kind:'read',title:'Цикл while',
   body:`<p><code>while умова:</code> — «повторюй тіло, поки умова True». Тіло — рядки з відступом під while, як в if.</p>
<ul class="plain"><li>Перед кожним повтором Python знову перевіряє умову.</li>
<li>Умова одразу False — тіло не виконається <b>жодного разу</b>.</li>
<li>У тілі щось має змінюватися, інакше цикл не закінчиться.</li></ul>
<div class="box"><pre class="code">${BIG}</pre></div>
<p>Ціль 10 км, по 3 км на день: 3, 6, 9 — ще менше 10, тому четвертий день: 12. Цикл зупиняється, бо 12 &lt; 10 — False.</p>`+more(['цикл while','reference/compound_stmts.html#the-while-statement','python_while_loops.asp']),
   runs:[{code:BIG,stdin:'10\n3',label:'Запустити: 10 і 3'}]},
  {id:'p1',sec:0,kind:'predict',title:'Скільки днів?',
   body:`<p>Що виведе програма? Порахуй у голові.</p>`,
   variants:[{code:PRED(10,4),answer:'3'},{code:PRED(12,4),answer:'3'},{code:PRED(13,4),answer:'4'}],
   hint:'Додавай den, поки km менше meta. Рахуй повтори.',
   explain:'Цикл іде, поки km < meta. Скільки разів додали den — стільки днів.'},
  {id:'p2',sec:0,kind:'predict',title:'Ціль уже досягнута',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:PRED(0,5),answer:'0'}],
   hint:'Чи правдива умова 0 < 0?',
   explain:'0 < 0 — False одразу, тіло не виконалось жодного разу: 0 днів.'},

  {id:'r2',sec:1,kind:'read',title:'Цикл без кінця',
   body:`<p>Якщо в тілі нічого не змінює умову, вона завжди True — цикл <b>нескінченний</b>:</p>
<div class="box"><pre class="code">km = 0
dni = 0
while km &lt; 10:
    dni += 1
    print("День", dni)</pre></div>
<p>km завжди 0, а 0 &lt; 10 — завжди True. Рядки «День…» сиплються без кінця.</p>
<p><b>Як зупинити в IDLE:</b> у вікні Shell меню <b>Shell → Interrupt Execution</b>.</p>`+more(['IDLE: Interrupt Execution','library/idle.html#shell-menu-shell-window-only'])},
  {id:'c1',sec:1,kind:'choice',title:'Що забули?',
   body:`<p>Чому програма з пояснення не зупиняється?</p>`,
   options:[{t:'У тілі немає km += …, тому km < 10 завжди True',ok:true,why:'Умову треба змінювати в тілі: km += den.'},
            {t:'Бракує else після while',ok:false,why:'else не потрібен; бракує зміни km.'},
            {t:'Треба поставити двокрапку після print',ok:false,why:'Двокрапка — лише після while; проблема в km.'}]},
  {id:'f1',sec:1,kind:'fix',exact:true,title:'Виправ цикл',
   body:`<p>Програма питає початкове число і має друкувати його, збільшуючи щоразу на 5, поки воно не більше 20. Для 5: 5, 10, 15, 20. Зараз вона друкує перше число без кінця. Виправ.</p>`,
   code:`x = int(input("Почати з: "))
while x <= 20:
    print(x)`,stdin:'5',
   tests:[{in:['5'],out:'5\n10\n15\n20'},{in:['12'],out:'12\n17'},{in:['20'],out:'20'}],
   hint:'Після print додай рядок, що збільшує x на 5.',
   explain:'<code>x += 5</code> у тілі циклу: 5, 10, 15, 20; далі 25 &lt;= 20 — False.'},

  {id:'r3',sec:2,kind:'read',title:'while перевіряє ввід',
   body:`<p>Поки число погане — питаємо знову:</p>
<div class="box"><pre class="code">vik = int(input("Вік: "))
while vik &lt; 1 or vik &gt; 120:
    print("Такого віку не буває")
    vik = int(input("Вік: "))
print("Вік прийнято:", vik)</pre></div>
<p>Добре число з першого разу — умова False, тіло не виконується, попереджень немає.</p>`+more(['and, or, not','library/stdtypes.html#boolean-operations-and-or-not','python_operators_logical.asp']),
   runs:[{code:`vik = int(input("Вік: "))
while vik < 1 or vik > 120:
    print("Такого віку не буває")
    vik = int(input("Вік: "))
print("Вік прийнято:", vik)`,stdin:'0\n150\n16',label:'Запустити: 0, 150, 16'}]},
  {id:'c2',sec:2,kind:'choice',title:'Скільки разів спитає?',
   body:`<p>Користувач вводить 200, потім -3, потім 30. Скільки разів програма спитає «Вік:»?</p>`,
   options:[{t:'3',ok:true,why:'200 і -3 погані — двічі «Такого віку не буває» і знову питання; 30 — добре.'},
            {t:'2',ok:false,why:'Перше питання — до циклу, ще два — у циклі.'},
            {t:'1',ok:false,why:'Після поганого числа програма питає знову.'}]},
  {id:'g1',sec:2,kind:'gaps',exact:true,title:'Кількість квитків',
   body:`<p>Квитків можна купити від 1 до 10. Поки число поза межами — «Від 1 до 10» і питати знову. Заповни пропуски.</p>`,
   code:`n = int(input("Квитків: "))
while n < 1 ____ n > 10:
    print("Від 1 до 10")
    n = ____(input("Квитків: "))
print("Куплено:", n)`,stdin:'0\n4',
   tests:[{in:['0','4'],out:'Від 1 до 10\nКуплено: 4'},{in:['3'],out:'Куплено: 3'},{in:['11','10'],out:'Від 1 до 10\nКуплено: 10'}],
   hint:'Число погане, якщо менше 1 АБО більше 10. Новий ввід — теж число.',
   explain:'<code>while n &lt; 1 or n &gt; 10:</code> і <code>n = int(input(…))</code>.'},

  {id:'r4',sec:3,kind:'read',title:'if усередині while',
   body:`<p>У тілі циклу можна писати if. <code>%</code> — остача від ділення: <code>d % 3 == 0</code> правдиве для 3, 6, 9…</p>
<div class="box"><pre class="code">d = 0
voda = 0
while d &lt; 7:
    d += 1
    if d % 3 == 0:
        voda += 2
    else:
        voda += 1
print("Води за тиждень:", voda, "л")</pre></div>
<p>Кожного третього дня полив подвійний.</p>`,
   runs:[{code:`d = 0
voda = 0
while d < 7:
    d += 1
    if d % 3 == 0:
        voda += 2
    else:
        voda += 1
print("Води за тиждень:", voda, "л")`,stdin:'',label:'Запустити'}]},
  {id:'t1',sec:3,kind:'text',title:'Скільки разів подвійний полив?',
   body:`<p>У програмі з пояснення: на які дні з 1-7 спрацює <code>d % 3 == 0</code>? Напиши, скільки таких днів.</p>`,
   answers:['2'],field:'Число',norm:'code',
   hint:'Остача 0 при діленні на 3.',explain:'Дні 3 і 6 — два дні. Тому води 5·1 + 2·2 = 9 л.'},
  {id:'p3',sec:3,kind:'predict',title:'Полив: 10 днів',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:`d = 0
voda = 0
while d < 10:
    d += 1
    if d % 3 == 0:
        voda += 2
    else:
        voda += 1
print(voda)`,answer:'13'}],
   hint:'Дні 3, 6, 9 — по 2, решта 7 днів — по 1.',explain:'3·2 + 7·1 = 13.'},

  {id:'r5',sec:4,kind:'read',title:'Напиши сам: підйом на гору',
   body:`<p>Туристи йдуть на гору: програма питає висоту гори в метрах і скільки метрів піднімаються за годину. Після кожної години друкує <code>Година 1 - 300 м</code> (номер години, дефіс з пробілами і висоту, на якій уже група). Наприкінці — <code>Годин: 4</code>.</p>
<p>Остання година може «перескочити» вершину — це нормально: друкуємо як є.</p>
<p>Будова — як у пробіжці з першого пояснення: <code>while</code>, додати, лічильник, print у тілі, підсумок після циклу.</p>`},
  {id:'k1',sec:4,kind:'code',exact:true,title:'Підйом на гору',
   body:`<p>Напиши програму. Перевірка — три запуски: 1000 і 300; 900 і 300; 200 і 500.</p>`,
   code:`gora = int(input("Висота гори, м: "))
krok = int(input("За годину, м: "))
`,stdin:'1000\n300',
   tests:[{in:['1000','300'],out:'Година 1 - 300 м\nГодина 2 - 600 м\nГодина 3 - 900 м\nГодина 4 - 1200 м\nГодин: 4'},
          {in:['900','300'],out:'Година 1 - 300 м\nГодина 2 - 600 м\nГодина 3 - 900 м\nГодин: 3'},
          {in:['200','500'],out:'Година 1 - 500 м\nГодин: 1'}],
   hint:'h = 0, n = 0; while h < gora: h += krok; n += 1; print("Година", n, "-", h, "м"). Після циклу — print("Годин:", n).',
   explain:'Еталон:<pre class="code">h = 0\nn = 0\nwhile h &lt; gora:\n    h += krok\n    n += 1\n    print("Година", n, "-", h, "м")\nprint("Годин:", n)</pre>'},

  {id:'r6',sec:5,kind:'read',title:'Підсумок',
   body:`<ul class="plain"><li><code>while</code> повторює тіло, поки умова True; умову перевіряє перед кожним повтором.</li>
<li>У тілі має змінюватися те, від чого залежить умова, — інакше цикл без кінця (Shell → Interrupt Execution).</li>
<li>while зручно перевіряє ввід; усередині while можна писати if.</li></ul>`},
  {id:'m1',sec:5,kind:'multi',title:'Що правда про while?',
   body:`<p>Познач усі правильні.</p>`,
   options:[{t:'Умова одразу False — тіло не виконається жодного разу',ok:true,why:'Перевірка — до першого повтору.'},
            {t:'Без зміни змінної умови цикл може не закінчитися',ok:true,why:'Умова лишається True.'},
            {t:'while завжди виконує тіло хоча б раз',ok:false,why:'Ні — якщо умова відразу False.'},
            {t:'Після while двокрапка не потрібна',ok:false,why:'Потрібна, як після if.'}]}
  ]
};

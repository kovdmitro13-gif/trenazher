/* ============ ТЕМА (дані) ============ */
/* Джерело — урок 44 10-І «Задачі на while» (24.11.2026): колода і «43-44 урок 10 клас профільний Для вчителя — ключ,
   оцінювання.md». Ті самі ТИПИ завдань (знайди помилку, заповни пропуски, напиши сам), але інші помилки, інші місця пропусків
   й інша будова, ніж у практичній (після рев'ю 22.11.2026): таблиця множення (межа, старт), подвоєння до ліміту, сума цифр.
   Відповіді звірено в CPython 3.10.12 і 3.13.18 (22.11.2026). */
const DOCS='https://docs.python.org/3/', W3='https://www.w3schools.com/python/';
const more=(...pairs)=>'<p class="more">Докладніше: '+pairs.map(([t,d,w])=>`<code>${t}</code> — <a href="${DOCS+d}" target="_blank" rel="noopener">docs.python.org</a>`+(w?`, <a href="${W3+w}" target="_blank" rel="noopener">W3Schools</a>`:'')).join('; ')+'</p>';
const DV=n=>`n = ${n}
k = 0
while n <= 1000:
    n *= 2
    k += 1
print(k)`;

const LESSON={
  id:'py10i-while-pr-v1', klass:'10-І', subject:'Python',
  classes:['10-І'],
  title:'while: знайди помилку, допиши, напиши сам', plot:'Таблиця множення, подвоєння, сума цифр', minutes:30,
  submitUrl:'https://script.google.com/macros/s/AKfycbw7F0TWcmUAq3awyHMpRxZqGfgmc5uSc010xL_q2qdSVxOdtRWagi6mNRyWtGdS6Q/exec',
  missText:'Не збігається. Переглянь пояснення вище ще раз.',
  intro:`<p>Це тема до уроку 44 — практика на while для тих, у кого урок пропав. Теорія — тема «Цикл while».</p>
<p><b>Як працюємо на уроці 44</b> (з презентації):</p>
<ul class="plain"><li>ШІ не використовуємо: оцінка — за твоє вміння.</li>
<li>Кожен вивід — копія після запуску.</li>
<li>Цикл не зупиняється? У IDLE — Shell → Interrupt Execution.</li>
<li>Задачі: знайди помилки, допиши, напиши сам — від простої до складнішої.</li></ul>`,
  sections:['Знайди помилки','Пропуски ___','Напиши сам: сума цифр','Підсумок'],
  steps:[
  {id:'r1',sec:0,kind:'read',title:'Межі циклу',
   body:`<p>Найчастіші <b>логічні</b> помилки в while — на межах: Python їх не покаже, програма просто друкує не те.</p>
<ul class="plain"><li><b>Не той старт</b>: лічильник почали з 0, а треба з 1 — з’являється зайвий рядок.</li>
<li><b>Не та межа</b>: <code>&lt;</code> замість <code>&lt;=</code> — на один повтор менше.</li>
<li><b>Не та змінна</b> у формулі — числа неправильні.</li></ul>
<div class="box"><pre class="code">n = 4
i = 1
while i &lt;= 3:
    print(n * i)
    i += 1</pre></div>
<p>Вивід: 4, 8, 12 — три рядки, бо i = 1, 2, 3; для i = 4 умова 4 &lt;= 3 — False.</p>`+more(['цикл while','reference/compound_stmts.html#the-while-statement','python_while_loops.asp'])},
  {id:'c1',sec:0,kind:'choice',title:'Межа < замість <=',
   body:`<p>У програмі з пояснення написали <code>while i &lt; 3:</code>. Що виведе?</p>`,
   options:[{t:'4, 8',ok:true,why:'i = 1, 2; для i = 3 умова 3 < 3 — False.'},
            {t:'4, 8, 12',ok:false,why:'Так з <=.'},
            {t:'0, 4, 8',ok:false,why:'Старт i = 1, тому 0 не буде.'}]},
  {id:'p1',sec:0,kind:'predict',title:'Старт з 0',
   body:`<p>Що виведе програма? (Друкується одне число — останній добуток.)</p>`,
   variants:[{code:`n = 5
i = 0
r = 0
while i <= 3:
    r = n * i
    i += 1
print(r)`,answer:'15'},{code:`n = 7
i = 0
r = 0
while i < 2:
    r = n * i
    i += 1
print(r)`,answer:'7'}],
   hint:'Випиши i по черзі; r — добуток для останнього i, що пройшов умову.',
   explain:'Перше: i = 0…3, останній добуток 5·3 = 15. Друге: i = 0, 1 — 7·1 = 7.'},

  {id:'f1',sec:0,kind:'fix',exact:true,title:'Таблиця множення',
   body:`<p>Програма питає число n і має друкувати n·1, n·2, … n·5 — п’ять рядків. Для 3: 3, 6, 9, 12, 15. Тут три логічні помилки. Виправ.</p>`,
   code:`n = int(input("Число: "))
i = 0
while i < 5:
    print(i * i)
    i += 1`,stdin:'3',
   tests:[{in:['3'],out:'3\n6\n9\n12\n15'},{in:['7'],out:'7\n14\n21\n28\n35'}],
   hint:'Старт — з 1; межа — включно з 5; множимо n на i.',
   explain:'<pre class="code">i = 1\nwhile i &lt;= 5:\n    print(n * i)\n    i += 1</pre>'},

  {id:'r2',sec:1,kind:'read',title:'Подвоєння до ліміту',
   body:`<p>Скільки разів треба подвоїти число, щоб воно стало <b>більшим</b> за 1000?</p>
<div class="box"><pre class="code">n = int(input("Число: "))
k = 0
while n &lt;= 1000:
    n *= 2
    k += 1
print(k)</pre></div>
<ul class="plain"><li><code>n *= 2</code> — те саме, що <code>n = n * 2</code>.</li>
<li>Умова <code>&lt;=</code>: рівно 1000 ще не «більше», тому подвоюємо ще раз.</li>
<li>Число вже більше за 1000 — тіло не виконається, k = 0.</li></ul>`},
  {id:'p2',sec:1,kind:'predict',title:'Скільки подвоєнь?',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:DV(100),answer:'4'},{code:DV(1000),answer:'1'},{code:DV(1500),answer:'0'}],
   hint:'Подвоюй, поки число не більше 1000, і рахуй.',
   explain:'100 → 200 → 400 → 800 → 1600: 4 рази. 1000 — ще не більше, тому один раз. 1500 — одразу 0.'},
  {id:'g1',sec:1,kind:'gaps',exact:true,title:'Допиши подвоєння',
   body:`<p>Заповни пропуски так, щоб програма працювала, як у поясненні.</p>`,
   code:`n = int(input("Число: "))
k = 0
while n ____ 1000:
    n ____ 2
    k += 1
print(____)`,stdin:'100',
   tests:[{in:['100'],out:'4'},{in:['1000'],out:'1'},{in:['1500'],out:'0'},{in:['1'],out:'10'}],
   hint:'Порівняння «не більше»; помножити на 2 й записати; надрукувати лічильник.',
   explain:'<code>&lt;=</code>, <code>*=</code>, <code>k</code>.'},
  {id:'c2',sec:1,kind:'choice',title:'< замість <=',
   body:`<p>У подвоєнні написали <code>while n &lt; 1000:</code>. Що виведе програма для 1000?</p>`,
   options:[{t:'0 — бо 1000 < 1000 — False, тіло не виконалось',ok:true,why:'А треба 1: рівно 1000 ще не «більше за 1000».'},
            {t:'1',ok:false,why:'Так з <=.'},
            {t:'Цикл без кінця',ok:false,why:'n не змінюється лише якщо тіло виконується; тут воно не виконалось жодного разу.'}]},

  {id:'r3',sec:2,kind:'read',title:'Цифри числа: % 10 і // 10',
   body:`<ul class="plain"><li><code>n % 10</code> — остання цифра: 1234 % 10 = 4.</li>
<li><code>n // 10</code> — число без останньої цифри: 1234 // 10 = 123.</li></ul>
<p>Поки число більше 0: беремо останню цифру й «відрізаємо» її. Коли цифр не лишилось, n = 0 — цикл стоп.</p>
<div class="box"><pre class="code">n = 352
k = 0
while n &gt; 0:
    n //= 10
    k += 1
print(k)</pre></div>
<p>Ця програма рахує кількість цифр: 352 → 35 → 3 → 0, тобто 3.</p>`+more(['/, // і %','library/stdtypes.html#numeric-types-int-float-complex','python_operators_arithmetic.asp'])},
  {id:'t1',sec:2,kind:'text',title:'Для 0',
   body:`<p>У програмі з пояснення n = 0. Скільки разів виконається тіло циклу?</p>`,
   answers:['0'],field:'Число',norm:'code',
   hint:'Чи правдива умова 0 > 0?',explain:'0 > 0 — False одразу: тіло не виконається, k = 0.'},
  {id:'k1',sec:2,kind:'code',exact:true,title:'Сума цифр',
   body:`<p>Програма питає ціле невід’ємне число і друкує суму його цифр: для 1234 — <code>10</code>, для 505 — <code>10</code>, для 0 — <code>0</code>.</p>`,
   code:`n = int(input("Число: "))
`,stdin:'1234',
   tests:[{in:['1234'],out:'10'},{in:['505'],out:'10'},{in:['9'],out:'9'},{in:['0'],out:'0'}],
   hint:'s = 0; while n > 0: s += n % 10; n //= 10; після циклу print(s).',
   explain:'Еталон:<pre class="code">n = int(input("Число: "))\ns = 0\nwhile n &gt; 0:\n    s += n % 10\n    n //= 10\nprint(s)</pre>'},

  {id:'r4',sec:3,kind:'read',title:'Підсумок',
   body:`<ul class="plain"><li>Логічні помилки while — на межах: старт, <code>&lt;</code> чи <code>&lt;=</code>, не та змінна.</li>
<li><code>*=</code>, <code>//=</code> — скорочені записи «зміни й запиши».</li>
<li><code>% 10</code> і <code>// 10</code> — цифри числа по одній.</li></ul>`},
  {id:'m1',sec:3,kind:'multi',title:'Що Python НЕ покаже сам?',
   body:`<p>Познач помилки, про які Python не повідомить (програма запуститься, але друкує не те).</p>`,
   options:[{t:'< замість <=',ok:true,why:'Логічна помилка — на один повтор менше.'},
            {t:'Старт лічильника з 0 замість 1',ok:true,why:'Зайвий рядок, але без повідомлення.'},
            {t:'Немає двокрапки після while',ok:false,why:'Це SyntaxError — Python покаже одразу.'},
            {t:'print(i * i) замість print(n * i)',ok:true,why:'Програма працює, але числа не ті.'}]}
  ]
};

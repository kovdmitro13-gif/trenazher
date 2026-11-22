/* ============ ТЕМА (дані) ============ */
/* Джерело — урок 42 10-І «Нові задачі на match» (23.11.2026): колода, «41-42 урок 10 клас профільний Для вчителя — ключ,
   оцінювання.md». Ті самі типи завдань (знайди помилку, заповни пропуски, напиши сам), але інші сюжети, ніж у практичній
   (бал → рівень, маршрут, конвертер довжини): смайлик за оцінкою, пора доби, конвертер маси.
   🟥 Skulpt 1.2.0 не знає match — без запуску коду. Відповіді звірено в CPython 3.10.12 і 3.13.18 (22.11.2026). */
const DOCS='https://docs.python.org/3/', W3='https://www.w3schools.com/python/';
const more=(...pairs)=>'<p class="more">Докладніше: '+pairs.map(([t,d,w])=>`<code>${t}</code> — <a href="${DOCS+d}" target="_blank" rel="noopener">docs.python.org</a>`+(w?`, <a href="${W3+w}" target="_blank" rel="noopener">W3Schools</a>`:'')).join('; ')+'</p>';
const ZIRKY=z=>`z = ${z}
match z:
    case 5 | 4:
        print("Чудово")
    case 3:
        print("Нормально")
    case 2 | 1:
        print("Погано")
    case _:
        print("Немає такої оцінки")`;
const DUBL=z=>`z = ${z}
match z:
    case 5 | 4 | 3:
        print("Чудово")
    case 3 | 2 | 1:
        print("Погано")
    case _:
        print("Інше")`;
const MASA=(m,od)=>`m = ${m}
od = "${od}".strip().lower()
match od:
    case "т":
        print(m * 1000, "кг")
    case "кг":
        print(m, "кг")
    case "ц":
        print(m * 100, "кг")
    case _:
        print("Не знаю такої одиниці")`;

const LESSON={
  id:'py10i-match-pr-v1', klass:'10-І', subject:'Python',
  classes:['10-І'],
  title:'match: знайди помилку, допиши, напиши сам', plot:'Відгук у зірках, пора доби, маса', minutes:25,
  submitUrl:'https://script.google.com/macros/s/AKfycbw7F0TWcmUAq3awyHMpRxZqGfgmc5uSc010xL_q2qdSVxOdtRWagi6mNRyWtGdS6Q/exec',
  missText:'Не збігається. Переглянь пояснення вище ще раз.',
  intro:`<p>Це тема до уроку 42 — практика на match для тих, у кого урок пропав. Теорія — тема «match: повторення на нових задачах».</p>
<p><b>Як працюємо на уроці 42</b> (з презентації):</p>
<ul class="plain"><li>ШІ не використовуємо: оцінка — за твоє вміння.</li>
<li>Помилку синтаксису IDLE показує вікном — читай повідомлення.</li>
<li>Задачі: знайди помилки, допиши пропуски, напиши сам — від простої до складнішої.</li></ul>
<p>🟥 Python цього тренажера не знає match, тому тут код не запускається — читаєш і передбачаєш. Розв’язки перевір потім в IDLE.</p>`,
  sections:['Знайди помилку','Пропуски ___','Напиши сам: маса','Підсумок'],
  steps:[
  {id:'r1',sec:0,kind:'read',title:'Три види помилок',
   body:`<p>У програмі з match бувають помилки двох видів:</p>
<ul class="plain"><li><b>Синтаксична</b> — Python не запускає програму взагалі: забута двокрапка після <code>case …</code> (<code>SyntaxError: expected ':'</code>), <code>case _</code> не останнім (повідомлення «wildcard makes remaining patterns unreachable»).</li>
<li>Python показує <b>одну</b> синтаксичну помилку за раз: виправив — запусти знову.</li>
<li><b>Логічна</b> — програма працює, але відповідь неправильна. Python її не покаже. Приклад: одне значення в двох case — спрацює лише перший.</li></ul>
<div class="box"><pre class="code">match z:
    case 5 | 4:
        print("Чудово")
    case 3:
        print("Нормально")
    ...
    case _:
        print("Немає такої оцінки")</pre></div>`+more(['match і case','tutorial/controlflow.html#match-statements','python_match.asp'])},
  {id:'c1',sec:0,kind:'choice',title:'Що скаже Python?',
   body:`<p>У програмі рядок <code>case 2 | 1</code> без двокрапки в кінці. Що станеться?</p>`,
   options:[{t:'SyntaxError: expected \':\' — програма не запуститься',ok:true,why:'Двокрапка після case обов’язкова, як після if.'},
            {t:'Програма запуститься, але гілка 1-2 не спрацює',ok:false,why:'Синтаксичну помилку Python знаходить до запуску.'},
            {t:'Python сам допише двокрапку',ok:false,why:'Не допише — покаже помилку.'}]},
  {id:'p1',sec:0,kind:'predict',title:'Число в двох case',
   body:`<p>3 є в обох case. Що виведе програма?</p>`,
   variants:[{code:DUBL(3),answer:'Чудово'},{code:DUBL(2),answer:'Погано'}],
   hint:'Спрацьовує перший case, що збігся.',
   explain:'3 є вже в першому case — «Чудово». Друга гілка для 3 ніколи не спрацює: це логічна помилка.'},
  {id:'c2',sec:0,kind:'choice',title:'Як виправити дубль?',
   body:`<p>3 зірки мають бути «Нормально»: 5 і 4 — «Чудово», 2 і 1 — «Погано». Як виправити програму з попередньої вправи?</p>`,
   options:[{t:'Прибрати 3 з обох гілок і додати case 3: «Нормально»',ok:true,why:'Кожне число — лише в одному case.'},
            {t:'Поміняти місцями print у двох гілках',ok:false,why:'Тоді 5 і 4 стануть «Погано».'},
            {t:'Додати case _ першим',ok:false,why:'case _ першим — SyntaxError.'}]},

  {id:'r2',sec:1,kind:'read',title:'Як заповнювати пропуски',
   body:`<p>У задачі з пропусками <code>___</code> треба вписати рівно те, чого бракує, — ім’я змінної, число чи слово.</p>
<ul class="plain"><li>Після <code>match</code> — <b>змінна</b>, яку порівнюємо.</li>
<li>У <code>case … | ___:</code> — ще одне <b>значення</b>.</li>
<li>Останній рядок <code>___:</code> перед «усе інше» — це <code>case _</code>.</li></ul>
<div class="box"><pre class="code">h = int(input("Година: "))
match ___:
    case 6 | 7 | 8 | ___:
        print("Ранок")
    case 12 | 13:
        print("Обід")
    ___:
        print("Інший час")</pre></div>
<p>Правило: 6-9 — «Ранок»; 12, 13 — «Обід»; інше — «Інший час».</p>`},
  {id:'t1',sec:1,kind:'text',title:'Перший пропуск',
   body:`<p>Що вписати замість <code>___</code> після <code>match</code>?</p>`,
   answers:['h'],field:'Пропуск',norm:'code',
   hint:'Яку змінну порівнюємо?',explain:'match h: — порівнюємо годину h.'},
  {id:'t2',sec:1,kind:'text',title:'Другий пропуск',
   body:`<p>Що вписати в <code>case 6 | 7 | 8 | ___:</code>?</p>`,
   answers:['9'],field:'Пропуск',norm:'code',
   hint:'Ранок — 6-9. Якого числа бракує?',explain:'Бракує 9: case 6 | 7 | 8 | 9:'},
  {id:'t3',sec:1,kind:'text',title:'Останній пропуск',
   body:`<p>Що вписати замість <code>___</code> у рядку <code>___:</code> перед «Інший час»?</p>`,
   answers:['case _','case _:'],field:'Пропуск',norm:'exact',
   near:{'else':'else в match не пишуть. «Усе інше» — це case _.','else:':'else в match не пишуть. «Усе інше» — це case _.','_':'Бракує слова case.'},
   hint:'«Усе інше» в match.',explain:'case _: — гілка «усе інше», завжди остання.'},

  {id:'r3',sec:2,kind:'read',title:'Напиши сам: конвертер маси',
   body:`<p>Задача: маса і одиниця (<code>т</code>, <code>ц</code> чи <code>кг</code>) → маса в кілограмах.</p>
<ul class="plain"><li>Одиницю спершу «чистимо»: <code>strip().lower()</code>.</li>
<li>т → × 1000; ц (центнер) → × 100; кг → як є; інше — «Не знаю такої одиниці».</li></ul>
<div class="box"><pre class="code">match od:
    case "т":
        print(m * 1000, "кг")
    case "кг":
        print(m, "кг")
    case "ц":
        print(m * 100, "кг")
    case _:
        print("Не знаю такої одиниці")</pre></div>
<p>Число з комою з input читаємо так: <code>float(input(…).replace(",", "."))</code>. <code>float()</code> розуміє лише крапку: без replace текст з комою дає <code>ValueError</code>.</p>`+more(['replace()','library/stdtypes.html#str.replace','ref_string_replace.asp'],['int() і float()','library/functions.html#int','python_casting.asp'])},
  {id:'p2',sec:2,kind:'predict',title:'Скільки кілограмів?',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:MASA(1.5,' Т '),answer:'1500.0 кг'},{code:MASA(2.5,'Ц'),answer:'250.0 кг'},{code:MASA('3.0','КГ'),answer:'3.0 кг'}],
   hint:'Після strip().lower() — яка одиниця? print з комою ставить пробіл.',
   explain:'Одиниця очищена, далі множимо чи ділимо. print(…, "кг") друкує число, пробіл і «кг».'},
  {id:'p3',sec:2,kind:'predict',title:'Невідома одиниця',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:MASA(5,'фунт'),answer:'Не знаю такої одиниці'},{code:MASA(7,'г'),answer:'Не знаю такої одиниці'}],
   hint:'Чи є такий case?',
   explain:'Такого case немає — спрацьовує case _.'},
  {id:'c3',sec:2,kind:'choice',title:'Без replace()',
   body:`<p>Учень написав <code>m = float(input("Маса: "))</code> без replace і ввів <code>1,75</code>. Що буде?</p>`,
   options:[{t:'ValueError: could not convert string to float: \'1,75\'',ok:true,why:'float розуміє лише крапку. replace(",", ".") перетворює кому на крапку.'},
            {t:'m стане 1.75',ok:false,why:'float("1,75") не працює — потрібна крапка.'},
            {t:'m стане 175',ok:false,why:'Кома не прибирається — Python показує помилку.'}]},

  {id:'r4',sec:3,kind:'read',title:'Підсумок',
   body:`<ul class="plain"><li>Синтаксичні помилки Python показує по одній; логічні — ні: перевіряй виводи на всіх межах.</li>
<li>Одне значення — лише в одному case.</li>
<li>Число з комою — float(…replace(",", ".")).</li></ul>`},
  {id:'m1',sec:3,kind:'multi',title:'Що Python покаже сам?',
   body:`<p>Познач помилки, про які Python повідомить сам.</p>`,
   options:[{t:'Немає двокрапки після case',ok:true,why:'SyntaxError: expected \':\'.'},
            {t:'case _ стоїть першим',ok:true,why:'SyntaxError: wildcard makes remaining patterns unreachable.'},
            {t:'Одне число в двох case',ok:false,why:'Це логічна помилка — Python її не бачить.'},
            {t:'Забули lower(), і «КГ» не знаходиться',ok:false,why:'Програма працює, просто йде в case _.'}]},
  {id:'p4',sec:3,kind:'predict',title:'Відгук у зірках',
   body:`<p>Що виведе програма?</p>`,
   variants:[{code:ZIRKY(4),answer:'Чудово'},{code:ZIRKY(3),answer:'Нормально'},{code:ZIRKY(0),answer:'Немає такої оцінки'}],
   hint:'Знайди case, у якому є це число.',explain:'Кожне число — лише в одному case; 0 немає ніде — case _.'}
  ]
};

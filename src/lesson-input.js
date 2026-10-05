/* ============ ТЕМА (дані) ============ */
const DOCS='https://docs.python.org/3/library/', W3='https://www.w3schools.com/python/';
const more=(...pairs)=>'<p class="more">Докладніше: '+pairs.map(([t,d,w])=>`<code>${t}</code> — <a href="${d}" target="_blank" rel="noopener">docs.python.org</a>, <a href="${W3+w}" target="_blank" rel="noopener">W3Schools</a>`).join('; ')+'</p>';

const LESSON={
  id:'py10i-input-types-v1', klass:'10-І', subject:'Python',
  classes:['10-І','10-М','10-Ф','11-М','11-Ф'], groups:['1','2'],
  title:'input() і типи даних', plot:'Похід у кіно', minutes:30,
  submitUrl:'',   // адреса приймача балів (Google Apps Script); порожньо = пробна версія
  sections:['input() і рядки','int() і float()','Помилки типів','Три ділення','split()'],
  steps:[
  {id:'s1',sec:0,kind:'read',title:'input() завжди повертає рядок',
   body:`<p>Каса кінотеатру питає, скільки квитків потрібно. Що б людина не набрала, <code>input()</code> віддає програмі <b>рядок</b> (тип <code>str</code>), навіть коли на вигляд це число.</p>
<p>Як це працює: <code>input("текст")</code> показує текст-підказку, чекає на Enter і повертає набране як рядок. <code>type(x)</code> показує тип значення.</p>`,
   runs:[{code:`tickets = input("Квитків: ")
print(type(tickets))
print(tickets * 3)`,stdin:'2'}],
   after:`<p>Запусти програму. Рядок, помножений на 3, просто повторюється тричі: виходить <code>222</code>, а не 6. Помилки немає, програма рахує не те. Таку помилку видно тільки тоді, коли запускаєш код і дивишся на результат.</p>`+
     more(['input()',DOCS+'functions.html#input','ref_func_input.asp'],['type()',DOCS+'functions.html#type','ref_func_type.asp'])},

  {id:'s2',sec:0,kind:'predict',title:'Що виведе програма?',
   body:`<p>Порахуй у голові, не запускаючи.</p>`,
   variants:[
    {code:`a = input()   # користувач ввів 4
b = input()   # користувач ввів 7
print(a + b)`,answer:'47'},
    {code:`a = input()   # користувач ввів 3
b = input()   # користувач ввів 5
print(a + b)`,answer:'35'},
    {code:`a = input()   # користувач ввів 6
b = input()   # користувач ввів 2
print(a + b)`,answer:'62'}],
   hint:'Якого типу a і b? Що робить + із двома рядками?',
   explain:'<code>a</code> і <code>b</code> — рядки, тому <code>+</code> їх склеює, а не додає.'},

  {id:'s3',sec:0,kind:'choice',title:'Який тип у змінної?',
   body:`<p>Користувач набрав <code>180</code> і натиснув Enter. Який тип має <code>price</code>?</p>`,
   code:`price = input("Ціна квитка: ")`,
   options:[
    {t:'int',why:'Ні. input() не дивиться, що саме набрали: він завжди повертає рядок.'},
    {t:'str',ok:true,why:'Так. У змінній лежить рядок "180", а не число 180.'},
    {t:'float',why:'Ні. Дробове число вийде лише після float(...).'},
    {t:'Залежить від того, що ввели',why:'Ні. Тип не залежить від набраного: це завжди str.'}]},

  {id:'s4',sec:1,kind:'read',title:'int() і float(): з рядка робимо число',
   body:`<p>Щоб рахувати, рядок треба перетворити. <code>int()</code> робить із рядка ціле число, <code>float()</code> — дробове.</p>
<p>Читай зсередини назовні: спочатку <code>input()</code> повертає рядок <code>"3"</code>, потім <code>int()</code> робить із нього число <code>3</code>.</p>`,
   runs:[{code:`tickets = int(input("Квитків: "))
price = 180
total = tickets * price
print("До сплати:", total, "грн")`,stdin:'3'}],
   after:`<p>Що вибрати: кількість штук — <code>int</code>. Гроші, вага, відстань, де буває дробова частина, — <code>float</code>. <code>float("89.5")</code> дає 89.5.</p>`+
     more(['int()',DOCS+'functions.html#int','ref_func_int.asp'],['float()',DOCS+'functions.html#float','ref_func_float.asp'])},

  {id:'s5',sec:1,kind:'fix',title:'Каса рахує не те',
   body:`<p>Програма запускається без помилок, але для 3 квитків замість 540 виводить щось дивне. Запусти, подивись на результат і виправ код.</p>
<p>Правильний результат для 3 квитків: <code>До сплати: 540 грн</code></p>`,
   code:`tickets = input("Квитків: ")
price = 180
total = tickets * price
print("До сплати:", total, "грн")`,stdin:'3',
   tests:[{in:['3'],out:'До сплати: 540 грн'},{in:['5'],out:'До сплати: 900 грн'}],
   hint:'Якого типу tickets? Що робить «рядок * число»?',
   explain:'Рядок, помножений на 180, повторювався 180 разів. Після <code>int(...)</code> множаться вже числа.'},

  {id:'s6',sec:1,kind:'gaps',title:'Попкорн',
   body:`<p>Ціна порції буває дробовою (89.5), кількість порцій завжди ціла. Впиши у пропуски потрібні функції. Для введення <code>89.5</code> і <code>2</code> програма має вивести <code>Порцій: 2</code> і <code>Разом: 179.0 грн</code>.</p>`,
   code:`price = ____(input("Ціна: "))
count = ____(input("Штук: "))
total = price * count
print("Порцій:", count)
print("Разом:", total, "грн")`,stdin:'89.5\n2',
   tests:[{in:['89.5','2'],out:'Порцій: 2\nРазом: 179.0 грн'},{in:['120.5','3'],out:'Порцій: 3\nРазом: 361.5 грн'}],
   hint:'Для якого зі значень можлива дробова частина?',
   explain:'Ціна — <code>float</code>, кількість — <code>int</code>. Добуток float і int — це float, тому на екрані 179.0.'},

  {id:'s7',sec:2,kind:'read',title:'Дві помилки: TypeError і ValueError',
   body:`<p>Коли з типами щось не так, Python зупиняється і називає помилку. Назва підказує, де шукати.</p>
<ul class="plain"><li><b>TypeError</b>: дія неможлива для таких типів. Наприклад, рядок + число.</li>
<li><b>ValueError</b>: тип підходить, а вміст ні. <code>int()</code> приймає рядок, але з <code>"дванадцять"</code> числа не зробить.</li></ul>`,
   runs:[{label:'TypeError',code:`seat = 5
print("Місце " + seat)`,stdin:''},
         {label:'ValueError',code:`price = float(input("Ціна: "))
print(price * 2)`,stdin:'175,5'}],
   after:`<p>Друга програма впала через кому: у нас дробову частину часто пишуть через кому, а Python розуміє тільки крапку. Допомагає метод рядка <code>replace()</code>: він повертає новий рядок, у якому одне замінено на інше. <code>"175,5".replace(",", ".")</code> дає <code>"175.5"</code>.</p>
<p class="more">У тренажері текст після назви помилки трохи інший, ніж в IDLE. Для TypeError і ValueError назва й номер рядка ті самі. Довгі «хвости» дробових чисел в IDLE можуть виглядати інакше.</p>`+
     more(['TypeError',DOCS+'exceptions.html#TypeError','python_ref_exceptions.asp'],['ValueError',DOCS+'exceptions.html#ValueError','python_ref_exceptions.asp'],['replace()',DOCS+'stdtypes.html#str.replace','ref_string_replace.asp'])},

  {id:'s8',sec:2,kind:'choice',title:'Що станеться?',
   body:`<p>Що буде після запуску цього рядка?</p>`,
   code:`print("Квитків: " + 3)`,
   options:[
    {t:'Виведе: Квитків: 3',why:'Ні. Так було б із комою: print("Квитків:", 3). Плюс рядок із числом не склеює.'},
    {t:'TypeError',ok:true,why:'Так. Рядок + число — дія, неможлива для цих типів.'},
    {t:'ValueError',why:'Ні. ValueError буває, коли тип підходить, а вміст ні. Тут не підходять самі типи.'},
    {t:'Виведе: Квитків: 33',why:'Ні. Повторення — це множення рядка на число, а тут плюс.'}]},

  {id:'s9',sec:2,kind:'choice',title:'А тут?',
   body:`<p>Що буде після запуску цього рядка?</p>`,
   code:`n = int("12.5")`,
   options:[
    {t:'n дорівнює 12',why:'Ні. int() сам дробову частину з рядка не відкидає. 12 дасть int(float("12.5")).'},
    {t:'n дорівнює 13',why:'Ні. int() не округлює рядок.'},
    {t:'TypeError',why:'Ні. Тип підходить: int() приймає рядки. Не підходить вміст рядка.'},
    {t:'ValueError',ok:true,why:'Так. Тип підходить (рядок), але "12.5" не є записом цілого числа.'}]},

  {id:'s10',sec:2,kind:'fix',title:'Ціна через кому',
   body:`<p>Касир вводить ціну як звик: <code>175,5</code>. Програма падає. Виправ її так, щоб працювали і кома, і крапка.</p>
<p>Правильний результат для <code>175,5</code>: <code>Два квитки: 351.0 грн</code></p>`,
   code:`price = float(input("Ціна: "))
total = price * 2
print("Два квитки:", total, "грн")`,stdin:'175,5',
   tests:[{in:['175,5'],out:'Два квитки: 351.0 грн'},{in:['80,25'],out:'Два квитки: 160.5 грн'},{in:['99.5'],out:'Два квитки: 199.0 грн'},{in:['200'],out:'Два квитки: 400.0 грн'}],
   hint:'replace() застосовують до рядка, тобто до того, що повернув input(), ще до float().',
   explain:'Порядок такий: <code>input()</code> дає рядок, <code>.replace(",", ".")</code> міняє кому на крапку, <code>float()</code> робить число.'},

  {id:'s11',sec:3,kind:'read',title:'Три ділення: /  //  %',
   body:`<p>Фільм триває 148 хвилин. Скільки це годин і хвилин?</p>`,
   runs:[{code:`minutes = 148
print(minutes / 60)
print(minutes // 60)
print(minutes % 60)`,stdin:''}],
   after:`<ul class="plain"><li><code>/</code> — звичайне ділення, результат завжди <code>float</code>.</li>
<li><code>//</code> — ділення націло: скільки разів 60 вміщується повністю. Тут 2.</li>
<li><code>%</code> — остача: скільки лишилося після цього. Тут 28.</li></ul>
<p>Перевірка: 2 · 60 + 28 = 148.</p>`+
     more(['/ // %',DOCS+'stdtypes.html#numeric-types-int-float-complex','python_operators.asp'])},

  {id:'s12',sec:3,kind:'predict',title:'Що виведе програма?',
   body:`<p>Порахуй у голові. Запиши відповідь так, як її надрукує <code>print</code>.</p>`,
   variants:[
    {code:`minutes = 135
print(minutes // 60, minutes % 60)`,answer:'2 15'},
    {code:`minutes = 200
print(minutes // 60, minutes % 60)`,answer:'3 20'},
    {code:`minutes = 95
print(minutes // 60, minutes % 60)`,answer:'1 35'}],
   hint:'Спочатку: скільки повних разів по 60? Потім: скільки лишилося? print через кому ставить між значеннями пробіл.',
   explain:'Перше число — повні години, друге — хвилини, що лишилися.'},

  {id:'s13',sec:3,kind:'code',title:'Напиши сам: тривалість сеансу',
   body:`<p>Програма читає тривалість фільму у хвилинах (ціле число) і виводить її в годинах і хвилинах точно в такому вигляді:</p>
<p><code>2 год 28 хв</code></p>
<p>Це результат для 148 хвилин. Напиши програму, запусти на своїх даних, тоді перевір.</p>`,
   code:``,stdin:'148',
   tests:[{in:['148'],out:'2 год 28 хв'},{in:['90'],out:'1 год 30 хв'},{in:['45'],out:'0 год 45 хв'},{in:['120'],out:'2 год 0 хв'}],
   hint:'Три кроки: прочитати й перетворити на int; години — це // 60; хвилини — це % 60. Вивести можна так: print(h, "год", m, "хв"). Назви змінних пиши латинськими літерами.',
   explain:'Програма працює для будь-якої кількості хвилин, а не лише для 148: це й перевіряли інші тести.'},

  {id:'s14',sec:4,kind:'read',title:'split(): кілька значень в одному рядку',
   body:`<p>Глядач вводить ряд і місце одним рядком: <code>7 12</code>. Метод <code>split()</code> розрізає рядок за пробілами і повертає частини. Їх можна одразу розкласти по змінних.</p>`,
   runs:[{code:`place = input("Ряд і місце: ")
row, seat = place.split()
print("Ряд:", row)
print("Місце:", seat)
print(type(seat))`,stdin:'7 12'}],
   after:`<p>Два правила. Частин має бути стільки ж, скільки змінних ліворуч, інакше буде ValueError: спробуй ввести лише <code>7</code>. І кожна частина — знову рядок: щоб рахувати, її треба перетворити.</p>`+
     more(['split()',DOCS+'stdtypes.html#str.split','ref_string_split.asp'])},

  {id:'s15',sec:4,kind:'fix',title:'Сусіднє місце',
   body:`<p>Програма має підказати номер сусіднього місця, на одиницю більший. Вона падає. Знайди причину й виправ.</p>
<p>Правильний результат для <code>7 12</code>: <code>Сусіднє місце: 13</code></p>`,
   code:`place = input("Ряд і місце: ")
row, seat = place.split()
print("Сусіднє місце:", seat + 1)`,stdin:'7 12',
   tests:[{in:['7 12'],out:'Сусіднє місце: 13'},{in:['3 9'],out:'Сусіднє місце: 10'}],
   hint:'Прочитай назву помилки. Якого типу seat після split()?',
   explain:'<code>split()</code> повертає рядки. До числа 1 можна додати тільки число, тому потрібен <code>int(seat)</code>.'},

  {id:'s16',sec:4,kind:'code',title:'Напиши сам: каса кінотеатру',
   body:`<p>Перший рядок введення: кількість квитків і ціна одного квитка через пробіл, обидва числа цілі. Другий рядок: скільки гривень дав покупець, теж ціле число.</p>
<p>Для введення <code>3 180</code> і <code>1000</code> програма має вивести рівно два рядки:</p>
<div class="box"><pre class="code">До сплати: 540 грн
Решта: 460 грн</pre></div>`,
   code:``,stdin:'3 180\n1000',
   tests:[{in:['3 180','1000'],out:'До сплати: 540 грн\nРешта: 460 грн'},{in:['2 175','500'],out:'До сплати: 350 грн\nРешта: 150 грн'},{in:['1 220','220'],out:'До сплати: 220 грн\nРешта: 0 грн'}],
   hint:'Перший рядок розріж через split() і перетвори обидві частини на int. Другий input() — гроші покупця. Спочатку порахуй суму, потім решту.',
   explain:'У цій програмі є все з теми: input(), split(), int() і арифметика.'}
  ]
};


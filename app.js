/* ==============================================
   RuRuBurger — app.js
   ============================================== */

/* ══ НАСТРОЙКИ ══════════════════════════════════════════ */
const GOOGLE_SCRIPT_URL = 'СЮДА_ССЫЛКУ_НА_GOOGLE_SCRIPT';
const CONTACTS = {
  phone:'tel:+79181623145',
  whatsapp:'https://wa.me/79181623145',
  telegram:'https://t.me/RuRuBurgerBot',
  max:'https://vk.me/ruruburger',
};
const RESTAURANT_ADDRESS = 'ст. Отрадная, ул. Ленина, 15Б';
const DELIVERY_OPTIONS = [
  {name:'Отрадная',price:200},{name:'Спокойная',price:500},
  {name:'Удобная',price:500},{name:'Попутная',price:500},
];

/* ══ ФОТО ════════════════════════════════════════════════
   Замени '' на URL своей фотографии (квадрат 400×400px)  */
const MENU_PHOTOS = {
  'Двойной Биг Бургер':'','Биг Бургер':'','Двойной Бургер':'','Бургер':'','Чикенбургер':'',
  'Хот-Дог':'','Френч-Дог':'',
  'Картофель Фри':'','Картофель по-деревенски':'','Наггетсы':'','Сырные палочки':'',
  'Крылышки':'','Стрипсы':'','Креветки в панировке':'',
  'Гирос в лепешке':'','Гирос на тарелке':'','Клаб-Сэндвич':'','Тортилья':'',
  'Кесадилья':'','Скипасти':'','Половинка скипасти':'',
  'Молочный коктейль':'','Мохито':'','Лимонад':'','Айс латте':'',
  'Чай':'','Кофе':'','MacCoffee 3 в 1':'',
  'Чизкейк Арахис-карамель':'','Чизкейк Шоколадный':'','Чизкейк Клубничный':'',
  'Блин с начинкой':'','Вафли с мороженым':'','Холодный Бургер':'','Мороженое':'',
  /* Соусы */
  'Кисло-сладкий соус':'','Сырный соус':'','Кетчуп':'','Соус Барбекю':'',
  'Соус 1000 островов':'','Красный соус':'','Белый соус':'',
  /* Напитки (обычные) */
  'Добрый Спрайт':'','Добрый Киви-виноград':'','Добрый Манго-маракуйя':'',
  'Сок Добрый Яблоко':'','Сок Добрый Мультифрукт':'',
  'Сок Ричи Вишня':'','Сок Ричи Апельсин':'',
  'Чай Ричи Лимон':'','Чай Ричи Персик':'','Чай Ричи Зелёный':'',
  'Палпи':'','Вода газированная':'','Вода негазированная':'',
};

/* ══ ФОТО ПО ОБЪЁМУ ══════════════════════════════════════
   Для напитков с вариантами — фото меняется при выборе объёма
   Пример: 'Добрый Кола': {'0.33 л':'url_маленький', '0.5 л':'url_большой'} */
const VARIANT_PHOTOS = {
  'Добрый Кола':  {'0.33 л':'img/napitki/kola033.jpg', '0.5 л':'img/napitki/kola05.jpg'},
  'Добрый Фанта': {'0.33 л':'', '0.5 л':''},
  'Адреналин':    {'0.25 л':'', '0.5 л':''},
};

const CATEGORY_EMOJI = {
  burgers:'🍔',hotdogs:'🌭',snacks:'🍟',fastfood:'🫓',
  sauces:'🥣',drinks:'🥤',hot:'☕',desserts:'🍰',
};

/* ╔══════════════════════════════════════════════════════════╗
   ║  ★  ДОБАВКИ — меняй здесь, изменится везде  ★           ║
   ║                                                          ║
   ║  Отдельные добавки:                                      ║
   ║    TOP_ONION  — маринованный лук  +40₽                   ║
   ║    TOP_PEPPER — халапеньо         +40₽                   ║
   ║    TOP_CHEESE — дополнительный сыр +50₽                  ║
   ║                                                          ║
   ║  Готовые наборы (используй в свойстве toppings блюда):   ║
   ║    TOPS_ALL          — лук + халапеньо + сыр             ║
   ║    TOPS_PEPPER_ONLY  — только халапеньо                  ║
   ║    TOPS_NONE         — без добавок                       ║
   ╚══════════════════════════════════════════════════════════╝ */
const TOP_ONION  = {id:'onion',  label:'Маринованный лук', price:40};
const TOP_PEPPER = {id:'pepper', label:'Халапеньо',        price:40};
const TOP_CHEESE = {id:'cheese', label:'Доп. сыр',         price:50};

const TOPS_ALL         = [TOP_ONION, TOP_PEPPER, TOP_CHEESE];
const TOPS_PEPPER_ONLY = [TOP_PEPPER];
const TOPS_NONE        = [];

// Наборы по умолчанию для категорий
const CATEGORY_TOPS = {
  burgers:  TOPS_ALL,
  hotdogs:  TOPS_ALL,
  fastfood: TOPS_PEPPER_ONLY,
};

/* ══ MENU DATA ═══════════════════════════════════════════════════════════════
   Свойство toppings у блюда переопределяет набор добавок для этого блюда.
   Не указано → берётся CATEGORY_TOPS[category].
   Пример: toppings: TOPS_NONE — совсем без добавок
   ══════════════════════════════════════════════════════════════════════════ */
const menuData = {
  burgers:[
    {name:'Двойной Биг Бургер',desc:'Большая булочка, двойная котлета, сыр, помидор, малосольный огурец',requireVariant:true,variants:[
      {label:'С говядиной',price:490,note:'соус 1000 островов, барбекю'},
      {label:'С курицей',  price:470,note:'кетчуп, майонез, сырный соус'},
    ]},
    {name:'Биг Бургер',desc:'Большая булочка, одна котлета, сыр, помидор, малосольный огурец',requireVariant:true,variants:[
      {label:'С говядиной',price:370,note:'соус 1000 островов, барбекю'},
      {label:'С курицей',  price:360,note:'кетчуп, майонез, сырный соус'},
    ]},
    {name:'Двойной Бургер',desc:'Маленькая булочка, двойная котлета, сыр, помидор, малосольный огурец',requireVariant:true,variants:[
      {label:'С говядиной',price:380,note:'соус 1000 островов, барбекю'},
      {label:'С курицей',  price:360,note:'кетчуп, майонез, сырный соус'},
    ]},
    {name:'Бургер',desc:'Маленькая булочка, одна котлета, сыр, помидор, малосольный огурец',requireVariant:true,variants:[
      {label:'С говядиной',price:260,note:'соус 1000 островов, барбекю'},
      {label:'С курицей',  price:240,note:'кетчуп, майонез, сырный соус'},
    ]},
    {name:'Чикенбургер',desc:'Большая булочка, куриные стрипсы, сыр, помидор, лист салата, кисло-сладкий соус, сырный соус',price:320},
  ],

  hotdogs:[
    {name:'Хот-Дог',desc:'Булочка, колбаска, сыр, карамелизированный лук, кетчуп, майонез, горчичный соус',requireVariant:true,variants:[
      {label:'Говяжий',price:270},{label:'Куриный',price:250},
    ]},
    {name:'Френч-Дог',desc:'Булочка, колбаска, кетчуп, майонез, горчичный соус',requireVariant:true,variants:[
      {label:'Говяжий',price:220},{label:'Куриный',price:190},
    ]},
  ],

  snacks:[
    {name:'Картофель Фри',          desc:'Золотистые хрустящие ломтики',          variants:[{label:'150г',price:170},{label:'300г',price:300}]},
    {name:'Картофель по-деревенски',desc:'Кусочки с кожурой, фирменная приправа', variants:[{label:'150г',price:180},{label:'300г',price:320}]},
    {name:'Наггетсы',               desc:'Сочные куриные наггетсы',               variants:[{label:'3 шт',price:130},{label:'6 шт',price:240},{label:'9 шт',price:330}]},
    {name:'Сырные палочки',         desc:'Хрустящие, тянущийся сыр',              variants:[{label:'3 шт',price:150},{label:'6 шт',price:270},{label:'9 шт',price:360}]},
    {name:'Крылышки',               desc:'Сочные куриные крылышки',               variants:[{label:'3 шт',price:240},{label:'6 шт',price:420},{label:'9 шт',price:560}]},
    {name:'Стрипсы',                desc:'В хрустящей панировке',                 variants:[{label:'3 шт',price:140},{label:'6 шт',price:250},{label:'9 шт',price:340}]},
    {name:'Креветки в панировке',   desc:'Тигровые креветки в хрустящей корочке', variants:[{label:'3 шт',price:170},{label:'6 шт',price:290},{label:'9 шт',price:380}]},
  ],

  fastfood:[
    // toppings — явно указан набор добавок для каждого блюда
    {name:'Гирос в лепешке',desc:'Пита, куриное филе, помидор, картошка фри, маринованный лук',
      requireVariant:true,toppings:TOPS_PEPPER_ONLY,
      variants:[{label:'Белый соус',price:380},{label:'Белый + красный соус',price:380}]},
    {name:'Гирос на тарелке',desc:'Пита, куриное филе, помидор, картошка фри, маринованный лук',
      requireVariant:true,toppings:TOPS_PEPPER_ONLY,
      variants:[{label:'Белый соус',price:380},{label:'Белый + красный соус',price:380}]},
    {name:'Клаб-Сэндвич',   desc:'Тостовый хлеб, куриное филе, яйцо, помидор, салат, бекон, майонез, горчица',
      price:360, toppings:TOPS_NONE},
    {name:'Тортилья',        desc:'Пшеничная лепёшка, куриное филе, свежие овощи, соус',
      price:360, cheeseChoice:true, toppings:TOPS_PEPPER_ONLY},
    {name:'Кесадилья',       desc:'Лепёшка, плавленый сыр, курица, томаты',
      price:320, toppings:TOPS_PEPPER_ONLY},
    {name:'Скипасти',        desc:'Пита, куриное филе, помидор, картофель фри, маринованный лук, белый соус',
      price:620, cheeseChoice:true, toppings:TOPS_PEPPER_ONLY},
    {name:'Половинка скипасти',desc:'Пита, куриное филе, помидор, картофель фри, маринованный лук, белый соус',
      price:340, cheeseChoice:true, toppings:TOPS_PEPPER_ONLY},
  ],

  sauces:[
    // Маринованный лук и Дополнительный сыр убраны отсюда
    {name:'Кисло-сладкий соус', desc:'',variants:[{label:'Маленький',price:40},{label:'Большой',price:50}]},
    {name:'Сырный соус',        desc:'',variants:[{label:'Маленький',price:40},{label:'Большой',price:50}]},
    {name:'Кетчуп',             desc:'',variants:[{label:'Маленький',price:40},{label:'Большой',price:50}]},
    {name:'Соус Барбекю',       desc:'',variants:[{label:'Маленький',price:40},{label:'Большой',price:50}]},
    {name:'Соус 1000 островов', desc:'',variants:[{label:'Маленький',price:40},{label:'Большой',price:50}]},
    {name:'Красный соус',       desc:'',variants:[{label:'Маленький',price:40},{label:'Большой',price:50}]},
    {name:'Белый соус',         desc:'',variants:[{label:'Маленький',price:40},{label:'Большой',price:50}]},
    {name:'Перец халапеньо',    desc:'Добавка, острый', price:40},
  ],

  drinks:[
    // Кола/Фанта/Адреналин — при выборе объёма меняется фото (см. VARIANT_PHOTOS выше)
    {name:'Добрый Кола',  desc:'',variants:[{label:'0.33 л',price:120},{label:'0.5 л',price:130}]},
    {name:'Добрый Фанта', desc:'',variants:[{label:'0.33 л',price:120},{label:'0.5 л',price:130}]},
    {name:'Добрый Спрайт',        desc:'0.33 л',price:120},
    {name:'Добрый Киви-виноград', desc:'0.33 л',price:120},
    {name:'Добрый Манго-маракуйя',desc:'0.5 л', price:130},
    {name:'Адреналин',desc:'Энергетик',variants:[{label:'0.25 л',price:120},{label:'0.5 л',price:160}]},
    {name:'Сок Добрый Яблоко',    desc:'0.3 л',price:100},
    {name:'Сок Добрый Мультифрукт',desc:'0.3 л',price:100},
    {name:'Сок Ричи Вишня',   desc:'0.3 л',price:110},
    {name:'Сок Ричи Апельсин',desc:'0.3 л',price:110},
    {name:'Чай Ричи Лимон', desc:'0.5 л',price:130},
    {name:'Чай Ричи Персик',desc:'0.5 л',price:130},
    {name:'Чай Ричи Зелёный',desc:'0.5 л',price:130},
    {name:'Палпи',desc:'0.5 л, апельсиновый',price:120},
    {name:'Вода газированная',  desc:'0.5 л',price:60},
    {name:'Вода негазированная',desc:'0.5 л',price:60},
    // Только 0.5 л — без выбора объёма
    {name:'Молочный коктейль',desc:'0.5 л',requireVariant:true,variants:[
      {label:'Ванильный',price:250},{label:'Шоколадный',price:250},{label:'Клубничный',price:250},
    ]},
    {name:'Мохито',desc:'0.5 л',requireVariant:true,variants:[
      {label:'Стандартный',price:240},{label:'Клубничный',price:240},
    ]},
    {name:'Лимонад',desc:'0.5 л',requireVariant:true,variants:[
      {label:'Клубника/вишня',    price:240},
      {label:'Грейпфрут/апельсин',price:240},
      {label:'Апельсин/маракуйя', price:240},
    ]},
    {name:'Айс латте',desc:'0.5 л',price:300},
  ],

  hot:[
    {name:'Чай',desc:'',requireVariant:true,variants:[
      {label:'Чёрный',price:50},{label:'Зелёный',price:50},
    ]},
    {name:'Кофе',desc:'',requireVariant:true,variants:[
      {label:'Американо',price:200},{label:'Капучино',price:200},
      {label:'Латте',price:200},{label:'Эспрессо',price:200},
    ]},
    {name:'MacCoffee 3 в 1',desc:'',price:50},
  ],

  desserts:[
    {name:'Чизкейк Арахис-карамель',desc:'Нежный сливочный чизкейк с карамелью и арахисом',price:230},
    {name:'Чизкейк Шоколадный',     desc:'Насыщенный шоколадный чизкейк',                   price:230},
    {name:'Чизкейк Клубничный',     desc:'Чизкейк с ароматной клубникой',                   price:230},
    {name:'Блин с начинкой',desc:'Блин, начинка, банан',requireVariant:true,variants:[
      {label:'Нутелла',price:300},{label:'Сгущенка',price:300},
    ]},
    {name:'Вафли с мороженым',desc:'Вафли, начинка, банан, мороженое',price:260,
      fillingChoice:['Нутелла','Сгущенка'],
      iceCreamFlavor:true,iceFlavors:['Ванильное','Шоколадное','Клубничное'],extraScoopPrice:50},
    {name:'Холодный Бургер',desc:'Булочка, нутелла, банан, мороженое',price:290,
      iceCreamFlavor:true,iceFlavors:['Ванильный','Шоколадный','Клубничный'],noExtraScoop:true},
    {name:'Мороженое',desc:'Порция — 3 шарика, можно разные вкусы. Доп. шарик +50 руб.',price:250,
      iceCream3:true,iceFlavors:['Ванильное','Шоколадное','Клубничное'],extraScoopPrice:50},
  ],
};

/* ══ CART ════════════════════════════════════════════════ */
var cart=[];
function makeKey(n,v,t){return n+'|'+(v||'')+'|'+(t||[]).slice().sort().join(',');}
function cartSum(){return cart.reduce(function(s,i){return s+i.price*i.qty;},0);}

/* ══ CREATE CARD ════════════════════════════════════════ */
var allCards=[];

function createCard(item,category){
  var el=document.createElement('div');
  el.className='menu-card';

  var hasVariants    =!!(item.variants&&item.variants.length>0);
  var isRequired     =!!item.requireVariant;
  var hasCheeseChoice=!!item.cheeseChoice;
  var fillingChoice  =item.fillingChoice||null;
  var hasIceCreamFlav=!!item.iceCreamFlavor;
  var noExtraScoop   =!!item.noExtraScoop;
  var hasIceCream3   =!!item.iceCream3;
  var extraScoopPrice=item.extraScoopPrice||50;
  var iceFlavors     =item.iceFlavors||['Ванильное','Шоколадное','Клубничное'];

  // Determine toppings for this item
  var itemToppings;
  if(item.hasOwnProperty('toppings')){
    itemToppings=item.toppings;
  } else {
    itemToppings=CATEGORY_TOPS[category]||[];
  }
  var hasToppings=itemToppings.length>0;

  // Price display
  var basePrice;
  if(hasVariants){
    var prices=item.variants.map(function(v){return v.price;});
    basePrice=isRequired?Math.min.apply(null,prices):prices[0];
  } else {basePrice=item.price||0;}
  var allSamePrice=hasVariants&&item.variants.every(function(v){return v.price===item.variants[0].price;});
  var priceDisplay=isRequired&&hasVariants
    ?(function(){
        var mn=Math.min.apply(null,item.variants.map(function(v){return v.price;}));
        var mx=Math.max.apply(null,item.variants.map(function(v){return v.price;}));
        return mn===mx?mn+'₽':mn+'–'+mx+'₽';
      })()
    :basePrice+'₽';

  // Photo — если есть VARIANT_PHOTOS, используем фото первого варианта по умолчанию
  var vp0=VARIANT_PHOTOS[item.name];
  var photoUrl=(vp0&&hasVariants&&item.variants[0]&&vp0[item.variants[0].label])
    ?vp0[item.variants[0].label]
    :(MENU_PHOTOS[item.name]||'');
  var emoji=CATEGORY_EMOJI[category]||'🍽️';
  var photoHTML=photoUrl
    ?'<div class="card-photo"><img class="card-photo-img" src="'+photoUrl+'" alt="'+item.name+'" loading="lazy"></div>'
    :'<div class="card-photo"><div class="card-photo-placeholder">'+emoji+'</div></div>';

  // Variant pills
  var varHTML='';
  if(hasVariants){
    var pills=item.variants.map(function(v,i){
      var cls=isRequired?'rc-btn':('rc-btn'+(i===0?' selected':''));
      var tt=v.note?' title="'+v.note+'"':'';
      var priceStr=(isRequired&&allSamePrice)?'':' — '+v.price+'₽';
      return '<button class="'+cls+'" data-price="'+v.price+'" data-label="'+v.label+'"'+tt+'>'+v.label+priceStr+'</button>';
    }).join('');
    varHTML='<div class="required-choice"><div class="rc-label">⚡ Тип начинки</div><div class="rc-pills">'+pills+'</div></div>';
  }

  // Cheese
  var cheeseHTML='';
  if(hasCheeseChoice){
    cheeseHTML='<div class="required-choice"><div class="rc-label">🧀 Выберите сыр</div><div class="rc-pills">'
      +'<button class="rc-btn cheese-btn" data-cheese="Моцарелла">🤍 Моцарелла</button>'
      +'<button class="rc-btn cheese-btn" data-cheese="Чеддер">🧡 Чеддер</button>'
      +'</div></div>';
  }

  // Filling (Нутелла/Сгущенка)
  var fillingHTML='';
  if(fillingChoice){
    var fBtns=fillingChoice.map(function(f){
      return '<button class="rc-btn filling-btn" data-filling="'+f+'">'+f+'</button>';
    }).join('');
    fillingHTML='<div class="required-choice"><div class="rc-label">🥞 Начинка</div><div class="rc-pills">'+fBtns+'</div></div>';
  }

  // Ice cream flavor + extra scoop counters
  var iceCreamFlavorHTML='';
  if(hasIceCreamFlav){
    var fpills=iceFlavors.map(function(f){
      return '<button class="rc-btn ice-flavor-btn" data-flavor="'+f+'">'+f+'</button>';
    }).join('');
    var extraRows=!noExtraScoop?iceFlavors.map(function(f){
      return '<div class="esc-row">'
        +'<span class="esc-name">'+f+'</span>'
        +'<button class="esc-m" data-flavor="'+f+'" style="opacity:0.35">−</button>'
        +'<span class="esc-n" data-flavor="'+f+'">0</span>'
        +'<button class="esc-p" data-flavor="'+f+'">+</button>'
        +'<span class="esc-price" data-flavor="'+f+'">+0₽</span>'
        +'</div>';
    }).join(''):'';
    var extraSection=!noExtraScoop
      ?'<div class="toppings-section"><div class="tp-label">+ Доп. шарик (каждый +'+extraScoopPrice+'₽)</div>'+extraRows+'</div>'
      :'';
    iceCreamFlavorHTML='<div class="required-choice"><div class="rc-label">🍦 Вкус мороженого</div><div class="rc-pills">'+fpills+'</div></div>'+extraSection;
  }

  // Ice cream 3 scoops
  var iceCream3HTML='';
  if(hasIceCream3){
    var rows3=iceFlavors.map(function(f){
      return '<div class="scoop-row" data-flavor="'+f+'">'
        +'<span class="scoop-name">'+f+'</span>'
        +'<div class="scoop-ctrl">'
        +'<button class="scoop-m">−</button>'
        +'<span class="scoop-n">0</span>'
        +'<button class="scoop-p">+</button>'
        +'</div></div>';
    }).join('');
    var extraRows3=iceFlavors.map(function(f){
      return '<button class="rc-btn extra-scoop3-btn" data-flavor="'+f+'">'+f+'</button>';
    }).join('');
    iceCream3HTML='<div class="required-choice icecream3-section">'
      +'<div class="rc-label">🍦 Выберите 3 шарика</div>'
      +'<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">Порция — 3 шарика · Доп. шарик +'+extraScoopPrice+'₽</div>'
      +rows3
      +'<div class="scoop-total-row">Выбрано: <span class="scoop-total-num">0</span> шт. — <span class="scoop-total-price">250₽</span>'
      +' <span class="scoop-hint-min" style="color:#ff6b6b;font-size:11px">(нужно мин. 3)</span></div>'
      +'</div>'
      +'<div class="toppings-section extra-scoop3-section" style="display:none">'
      +'<div class="tp-label">+1 шарик (+'+extraScoopPrice+'₽) — выберите вкус:</div>'
      +'<div class="tp-pills">'+extraRows3+'</div>'
      +'</div>';
  }

  // Toppings (per-item)
  var toppingHTML='';
  if(hasToppings){
    var tpills=itemToppings.map(function(t){
      return '<button class="tp-pill topping-pill" data-id="'+t.id+'" data-price="'+t.price+'">+ '+t.label+' <span>'+t.price+'₽</span></button>';
    }).join('');
    toppingHTML='<div class="toppings-section"><div class="tp-label">Добавки (по желанию)</div><div class="tp-pills">'+tpills+'</div></div>';
  }

  el.innerHTML=photoHTML
    +'<div class="card-body">'
    +'<div class="card-header"><span class="card-name">'+item.name+'</span><span class="card-price">'+priceDisplay+'</span></div>'
    +(item.desc?'<p class="card-desc">'+item.desc+'</p>':'')
    +varHTML+cheeseHTML+fillingHTML+iceCreamFlavorHTML+iceCream3HTML+toppingHTML
    +'<button class="add-btn">+ В корзину</button>'
    +'<div class="card-qty-control">'
    +'<button class="card-qty-btn card-minus">−</button>'
    +'<span class="card-qty-num">1</span>'
    +'<button class="card-qty-btn card-plus">+</button>'
    +'</div></div>';

  // State
  var curPrice    =isRequired?null:basePrice;
  var curVariant  =isRequired?null:(hasVariants?item.variants[0].label:'');
  var curCheese   =null;
  var curFilling  =null;
  var curIceFlavor=null;
  var selTops     =[];
  var scoopCounts ={};
  if(hasIceCream3)iceFlavors.forEach(function(f){scoopCounts[f]=0;});
  var extraScoops={};
  if(hasIceCreamFlav)iceFlavors.forEach(function(f){extraScoops[f]=0;});

  var priceEl=el.querySelector('.card-price');
  var addBtn =el.querySelector('.add-btn');
  var qtyCtrl=el.querySelector('.card-qty-control');
  var qtyNum =el.querySelector('.card-qty-num');

  function totalPrice(){
    var base=curPrice||0;
    var topsSum=selTops.reduce(function(s,t){return s+t.price;},0);
    var extraSum=0;
    if(hasIceCreamFlav)iceFlavors.forEach(function(f){extraSum+=(extraScoops[f]||0)*extraScoopPrice;});
    if(hasIceCream3){var tot3=iceFlavors.reduce(function(s,f){return s+(scoopCounts[f]||0);},0);extraSum=Math.max(0,tot3-3)*extraScoopPrice;}
    return base+topsSum+extraSum;
  }
  function totalScoops3(){return iceFlavors.reduce(function(s,f){return s+(scoopCounts[f]||0);},0);}
  function refreshPrice(){priceEl.textContent=(isRequired&&!curVariant)?priceDisplay:totalPrice()+'₽';}

  function refreshScoop3UI(){
    var tot=totalScoops3();
    var hint=el.querySelector('.scoop-hint-min');
    var tnum=el.querySelector('.scoop-total-num');
    var tprc=el.querySelector('.scoop-total-price');
    if(tnum)tnum.textContent=tot;
    if(hint)hint.style.display=tot>=3?'none':'';
    if(tprc)tprc.textContent=(item.price+Math.max(0,tot-3)*extraScoopPrice)+'₽';
    var extraSec=el.querySelector('.extra-scoop3-section');
    if(extraSec)extraSec.style.display=tot>=3?'':'none';
    refreshPrice();
  }

  function updateExtraUI(f){
    var n=extraScoops[f]||0;
    var numEl =el.querySelector('.esc-n[data-flavor="'+f+'"]');
    var costEl=el.querySelector('.esc-price[data-flavor="'+f+'"]');
    var mBtn  =el.querySelector('.esc-m[data-flavor="'+f+'"]');
    if(numEl) numEl.textContent=n;
    if(costEl)costEl.textContent=n>0?'+'+n*extraScoopPrice+'₽':'+0₽';
    if(mBtn)  mBtn.style.opacity=n>0?'1':'0.35';
  }

  // Variant buttons
  if(hasVariants){
    var vBtns=el.querySelectorAll('.rc-btn:not(.cheese-btn):not(.filling-btn):not(.ice-flavor-btn)');
    vBtns.forEach(function(btn){
      btn.addEventListener('click',function(){
        vBtns.forEach(function(b){b.classList.remove('selected');});
        btn.classList.add('selected');
        curPrice=parseInt(btn.dataset.price);
        curVariant=btn.dataset.label;
        // Update photo on variant change (VARIANT_PHOTOS or MENU_PHOTOS fallback)
        var vp=VARIANT_PHOTOS[item.name];
        var img=el.querySelector('.card-photo-img');
        if(img){
          var newSrc=(vp&&vp[btn.dataset.label])?vp[btn.dataset.label]:(MENU_PHOTOS[item.name]||'');
          if(newSrc)img.src=newSrc;
        }
        refreshPrice();syncCard();
      });
    });
    if(!isRequired){curPrice=item.variants[0].price;curVariant=item.variants[0].label;}
  }
  // Cheese
  if(hasCheeseChoice){
    var cBtns=el.querySelectorAll('.cheese-btn');
    cBtns.forEach(function(btn){
      btn.addEventListener('click',function(){
        cBtns.forEach(function(b){b.classList.remove('selected');});
        btn.classList.add('selected');curCheese=btn.dataset.cheese;syncCard();
      });
    });
  }
  // Filling
  if(fillingChoice){
    var flBtns=el.querySelectorAll('.filling-btn');
    flBtns.forEach(function(btn){
      btn.addEventListener('click',function(){
        flBtns.forEach(function(b){b.classList.remove('selected');});
        btn.classList.add('selected');curFilling=btn.dataset.filling;syncCard();
      });
    });
  }
  // Ice cream flavor
  if(hasIceCreamFlav){
    var ifBtns=el.querySelectorAll('.ice-flavor-btn');
    ifBtns.forEach(function(btn){
      btn.addEventListener('click',function(){
        ifBtns.forEach(function(b){b.classList.remove('selected');});
        btn.classList.add('selected');curIceFlavor=btn.dataset.flavor;curPrice=item.price;refreshPrice();syncCard();
      });
    });
    if(!noExtraScoop){
      el.querySelectorAll('.esc-p').forEach(function(btn){
        btn.addEventListener('click',function(){var f=btn.dataset.flavor;extraScoops[f]=(extraScoops[f]||0)+1;updateExtraUI(f);refreshPrice();syncCard();});
      });
      el.querySelectorAll('.esc-m').forEach(function(btn){
        btn.addEventListener('click',function(){var f=btn.dataset.flavor;if((extraScoops[f]||0)>0){extraScoops[f]--;updateExtraUI(f);refreshPrice();syncCard();}});
      });
    }
  }
  // Ice cream 3
  if(hasIceCream3){
    curPrice=item.price;
    el.querySelectorAll('.scoop-row').forEach(function(row){
      var f=row.dataset.flavor,numEl=row.querySelector('.scoop-n');
      row.querySelector('.scoop-p').addEventListener('click',function(){scoopCounts[f]=(scoopCounts[f]||0)+1;if(numEl)numEl.textContent=scoopCounts[f];refreshScoop3UI();syncCard();});
      row.querySelector('.scoop-m').addEventListener('click',function(){if((scoopCounts[f]||0)>0){scoopCounts[f]--;if(numEl)numEl.textContent=scoopCounts[f];refreshScoop3UI();syncCard();}});
    });
    el.querySelectorAll('.extra-scoop3-btn').forEach(function(btn){
      btn.addEventListener('click',function(){
        var f=btn.dataset.flavor;scoopCounts[f]=(scoopCounts[f]||0)+1;
        var numEl=el.querySelector('.scoop-row[data-flavor="'+f+'"] .scoop-n');
        if(numEl)numEl.textContent=scoopCounts[f];
        refreshScoop3UI();syncCard();
      });
    });
  }
  // Toppings
  if(hasToppings){
    el.querySelectorAll('.topping-pill').forEach(function(pill){
      pill.addEventListener('click',function(){
        pill.classList.toggle('active');
        var id=pill.dataset.id,price=parseInt(pill.dataset.price);
        var tObj=itemToppings.find(function(t){return t.id===id;});
        if(pill.classList.contains('active')){selTops.push({id:id,price:price,label:tObj?tObj.label:id});}
        else{selTops=selTops.filter(function(t){return t.id!==id;});}
        refreshPrice();syncCard();
      });
    });
  }

  function buildLabel(){
    var parts=[];
    if(curVariant)parts.push(curVariant);
    if(curCheese) parts.push('сыр: '+curCheese);
    if(curFilling)parts.push('начинка: '+curFilling);
    if(hasIceCreamFlav&&curIceFlavor){
      parts.push(curIceFlavor);
      iceFlavors.forEach(function(f){if((extraScoops[f]||0)>0)parts.push('+'+extraScoops[f]+' '+f);});
    }
    if(hasIceCream3)iceFlavors.forEach(function(f){if((scoopCounts[f]||0)>0)parts.push(scoopCounts[f]+'x'+f);});
    return parts.join(', ');
  }
  function curKey(){return makeKey(item.name,buildLabel(),selTops.map(function(t){return t.id;}));}
  function getQty(){var k=curKey(),e=cart.find(function(i){return i.key===k;});return e?e.qty:0;}
  function syncCard(){
    var qty=getQty();addBtn.style.display=qty>0?'none':'';
    if(qty>0){qtyCtrl.classList.add('visible');qtyNum.textContent=qty;}else qtyCtrl.classList.remove('visible');
  }

  addBtn.addEventListener('click',function(){
    if(isRequired&&!curVariant){pulse('.rc-btn:not(.cheese-btn):not(.filling-btn):not(.ice-flavor-btn)');showToast('👆 Выберите тип начинки');return;}
    if(hasCheeseChoice&&!curCheese){pulse('.cheese-btn');showToast('🧀 Выберите сыр');return;}
    if(fillingChoice&&!curFilling){pulse('.filling-btn');showToast('🥞 Выберите начинку');return;}
    if(hasIceCreamFlav&&!curIceFlavor){pulse('.ice-flavor-btn');showToast('🍦 Выберите вкус мороженого');return;}
    if(hasIceCream3&&totalScoops3()<3){showToast('🍦 Добавьте минимум 3 шарика');return;}
    addToCart(curKey(),item.name,totalPrice(),buildLabel(),selTops.slice());syncCard();
  });
  function pulse(sel){var bs=el.querySelectorAll(sel);bs.forEach(function(b){b.classList.add('pulse');});setTimeout(function(){bs.forEach(function(b){b.classList.remove('pulse');});},600);}
  el.querySelector('.card-minus').addEventListener('click',function(){changeQtyByKey(curKey(),-1);syncCard();});
  el.querySelector('.card-plus').addEventListener('click', function(){changeQtyByKey(curKey(), 1);syncCard();});
  el._sync=syncCard;
  return el;
}

function renderGrid(id,items,category){
  var el=document.getElementById(id);if(!el)return;
  items.forEach(function(item){var c=createCard(item,category);allCards.push(c);el.appendChild(c);});
}
renderGrid('grid-burgers', menuData.burgers, 'burgers');
renderGrid('grid-hotdogs', menuData.hotdogs, 'hotdogs');
renderGrid('grid-snacks',  menuData.snacks,  'snacks');
renderGrid('grid-fastfood',menuData.fastfood,'fastfood');
renderGrid('grid-sauces',  menuData.sauces,  'sauces');
renderGrid('grid-desserts',menuData.desserts,'desserts');
renderGrid('grid-drinks',  menuData.drinks,  'drinks');
renderGrid('grid-hot',     menuData.hot,     'hot');

/* ══ CART OPS ════════════════════════════════════════════ */
function addToCart(key,name,price,variant,tops){
  var ex=cart.find(function(i){return i.key===key;});
  if(ex){ex.qty++;}else cart.push({key:key,name:name,price:price,variant:variant,tops:tops||[],qty:1});
  renderCart();
  showToast('<span class="gold">+1</span> '+name+(variant?' ('+variant+')':''));
}
function changeQtyByKey(key,delta){
  var idx=cart.findIndex(function(i){return i.key===key;});if(idx===-1)return;
  cart[idx].qty+=delta;if(cart[idx].qty<=0)cart.splice(idx,1);renderCart();
}
function syncAllCards(){allCards.forEach(function(c){if(c._sync)c._sync();});}

function renderCart(){
  var iEl=document.getElementById('cartItems'),bEl=document.getElementById('cartBadge'),
      tEl=document.getElementById('cartTotal'),bar=document.getElementById('bottomBar'),
      bQ=document.getElementById('bottomQty'),bT=document.getElementById('bottomTotal');
  var qty=cart.reduce(function(s,i){return s+i.qty;},0),total=cartSum();
  bEl.textContent=qty;bEl.classList.toggle('visible',qty>0);
  tEl.textContent=total.toLocaleString('ru')+' ₽';
  bQ.textContent=qty;bT.textContent=total.toLocaleString('ru')+' ₽';
  bar.classList.toggle('has-items',qty>0);syncAllCards();
  if(cart.length===0){
    iEl.innerHTML='<div class="cart-empty"><span class="cart-empty-icon">🛒</span><p>Корзина пуста<br><span style="font-size:12px;color:var(--text-muted)">Добавьте что-нибудь вкусное</span></p></div>';
    return;
  }
  iEl.innerHTML=cart.map(function(item,idx){
    var meta=[];if(item.variant)meta.push(item.variant);if(item.tops&&item.tops.length)item.tops.forEach(function(t){meta.push(t.label);});
    return '<div class="cart-item">'
      +'<div class="cart-item-info"><div class="cart-item-name">'+item.name+'</div>'
      +(meta.length?'<div class="cart-item-meta">'+meta.join(' · ')+'</div>':'')+'</div>'
      +'<div class="qty-control">'
      +'<button class="qty-btn delete" data-idx="'+idx+'">−</button>'
      +'<span class="qty-num">'+item.qty+'</span>'
      +'<button class="qty-btn" data-idx="'+idx+'" data-add="1">+</button>'
      +'</div>'
      +'<span class="cart-item-price">'+(item.price*item.qty).toLocaleString('ru')+'₽</span>'
      +'</div>';
  }).join('');
  iEl.querySelectorAll('.qty-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var i=parseInt(btn.dataset.idx);cart[i].qty+=btn.dataset.add?1:-1;
      if(cart[i].qty<=0)cart.splice(i,1);renderCart();
    });
  });
}

/* ══ CART DRAWER ════════════════════════════════════════ */
var cartOverlay=document.getElementById('cartOverlay'),cartDrawer=document.getElementById('cartDrawer');
function openCart(){cartOverlay.classList.add('open');cartDrawer.classList.add('open');document.body.style.overflow='hidden';}
function closeCart(){cartOverlay.classList.remove('open');cartDrawer.classList.remove('open');document.body.style.overflow='';}
document.getElementById('cartToggle').addEventListener('click',openCart);
document.getElementById('cartClose').addEventListener('click',closeCart);
document.getElementById('bottomCartBtn').addEventListener('click',openCart);
cartOverlay.addEventListener('click',closeCart);

/* ══ TABS ════════════════════════════════════════════════ */
var tabs=document.querySelectorAll('.tab'),indicator=document.getElementById('tabIndicator');
function moveIndicator(t){indicator.style.width=t.offsetWidth+'px';indicator.style.height=t.offsetHeight+'px';indicator.style.left=t.offsetLeft+'px';indicator.style.top=t.offsetTop+'px';}
setTimeout(function(){var a=document.querySelector('.tab.active');if(a)moveIndicator(a);},60);
window.addEventListener('resize',function(){var a=document.querySelector('.tab.active');if(a)moveIndicator(a);});
var scrollLock=false;
var panelObserver=new IntersectionObserver(function(entries){
  if(scrollLock)return;
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      var id=entry.target.id.replace('panel-',''),tab=document.querySelector('.tab[data-tab="'+id+'"]');
      if(tab&&!tab.classList.contains('active')){tabs.forEach(function(t){t.classList.remove('active');});tab.classList.add('active');moveIndicator(tab);tab.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}
    }
  });
},{rootMargin:'-35% 0px -55% 0px',threshold:0});
document.querySelectorAll('.menu-panel').forEach(function(p){panelObserver.observe(p);});
tabs.forEach(function(tab){
  tab.addEventListener('click',function(){
    scrollLock=true;tabs.forEach(function(t){t.classList.remove('active');});tab.classList.add('active');moveIndicator(tab);
    tab.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    var panel=document.getElementById('panel-'+tab.dataset.tab);if(panel)panel.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(function(){scrollLock=false;},900);
  });
});

/* ══ DELIVERY ════════════════════════════════════════════ */
var villageSelect=document.getElementById('villageSelect');
DELIVERY_OPTIONS.forEach(function(opt,i){var o=document.createElement('option');o.value=opt.name;o.textContent=opt.name+'  (+'+opt.price+' ₽)';if(i===0)o.selected=true;villageSelect.appendChild(o);});
function getDeliveryFee(){var a=document.querySelector('.toggle-option.active');if(!a||a.dataset.value!=='delivery')return 0;var o=DELIVERY_OPTIONS[villageSelect.selectedIndex];return o?o.price:0;}
function updateDeliveryNote(){var fee=getDeliveryFee(),note=document.getElementById('deliveryPriceNote');note.textContent=fee>0?'Стоимость доставки: '+fee+' ₽':'';refreshModalPreview();}
villageSelect.addEventListener('change',updateDeliveryNote);

/* ══ ORDER MODAL ═════════════════════════════════════════ */
var modalOverlay=document.getElementById('modalOverlay'),deliveryOptions=document.querySelectorAll('.toggle-option'),deliveryBlock=document.getElementById('deliveryBlock');
deliveryOptions.forEach(function(opt){
  opt.addEventListener('click',function(){deliveryOptions.forEach(function(o){o.classList.remove('active');});opt.classList.add('active');deliveryBlock.classList.toggle('visible',opt.dataset.value==='delivery');updateDeliveryNote();});
});
document.getElementById('btnOrder').addEventListener('click',function(){
  if(cart.length===0){showToast('Добавьте товары в корзину');return;}
  refreshModalPreview();modalOverlay.classList.add('open');closeCart();
});
function refreshModalPreview(){
  var fee=getDeliveryFee(),total=cartSum()+fee;
  var lines=cart.map(function(i){
    var meta=[];if(i.variant)meta.push(i.variant);if(i.tops&&i.tops.length)i.tops.forEach(function(t){meta.push(t.label);});
    var mstr=meta.join(', ');
    return i.name+(mstr?' <span style="color:var(--gold);font-size:11px">('+mstr+')</span>':'')+' × '+i.qty+' = '+(i.price*i.qty).toLocaleString('ru')+'₽';
  }).join('<br>');
  if(fee>0)lines+='<br><span style="color:var(--gold)">Доставка: '+fee+' ₽</span>';
  document.getElementById('modalCartPreview').innerHTML=lines;
  document.getElementById('modalTotalLine').innerHTML='Итого: <span>'+total.toLocaleString('ru')+' ₽</span>';
}
function closeModal(){modalOverlay.classList.remove('open');}
document.getElementById('modalClose').addEventListener('click',closeModal);
modalOverlay.addEventListener('click',function(e){if(e.target===modalOverlay)closeModal();});

/* ══ VALIDATE ════════════════════════════════════════════ */
function validateForm(){
  var name=document.getElementById('inputName').value.trim();
  var phone=document.getElementById('inputPhone').value.trim();
  var addrEl=document.getElementById('inputAddress'),addr=addrEl?addrEl.value.trim():'';
  var act=document.querySelector('.toggle-option.active'),type=act?act.dataset.value:'pickup';
  if(!name){document.getElementById('inputName').focus();showToast('Введите ваше имя');return null;}
  if(phone.length<7){document.getElementById('inputPhone').focus();showToast('Введите телефон');return null;}
  if(type==='delivery'&&!addr){if(addrEl)addrEl.focus();showToast('Введите адрес доставки');return null;}
  if(!document.getElementById('consentCheck').checked){
    var row=document.getElementById('consentRow');
    if(row){row.classList.add('consent-shake');setTimeout(function(){row.classList.remove('consent-shake');},600);}
    showToast('☑️ Отметьте согласие на обработку данных');return null;
  }
  return{name:name,phone:phone,addr:addr,type:type};
}
function clearForm(){document.getElementById('inputName').value='';document.getElementById('inputPhone').value='';var a=document.getElementById('inputAddress');if(a)a.value='';}
function clearCart(){cart=[];renderCart();}

/* ══ BUILD ORDER TEXT ════════════════════════════════════ */
function buildOrderText(f){
  var fee=getDeliveryFee(),total=cartSum()+fee;
  var tl={pickup:'Самовывоз',hall:'Питание в зале',delivery:'Доставка'};
  var addrLine=f.type==='delivery'?f.addr+' ('+villageSelect.value+')':RESTAURANT_ADDRESS;
  var sep='------------------------';
  var itemLines=cart.map(function(item,idx){
    var meta=[];if(item.variant)meta.push(item.variant);if(item.tops&&item.tops.length)item.tops.forEach(function(t){meta.push(t.label);});
    return (idx+1)+'. '+item.name+(meta.length?' ('+meta.join(', ')+')':'')+' — '+item.qty+' шт. х '+item.price+' ₽';
  }).join('\n');
  var lines=['🍔 НОВЫЙ ЗАКАЗ RuRuBurger',sep,'👤 Клиент: '+f.name,'📞 Телефон: '+f.phone,'🚗 Способ: '+(tl[f.type]||f.type),'📍 Адрес: '+addrLine,sep,'🧾 СОСТАВ ЗАКАЗА:',itemLines,sep];
  if(fee>0)lines.push('🚚 Доставка: '+fee+' ₽');
  lines.push('💰 ИТОГО К ОПЛАТЕ: '+total.toLocaleString('ru')+' ₽');
  return lines.join('\n');
}

/* ══ GOOGLE SCRIPT SEND ══════════════════════════════════ */
document.getElementById('btnSendScript').addEventListener('click',async function(){
  var f=validateForm();if(!f)return;
  var fee=getDeliveryFee(),total=cartSum()+fee;
  var tl={pickup:'Самовывоз',hall:'Питание в зале',delivery:'Доставка'};
  var addrLine=f.type==='delivery'?f.addr+' ('+villageSelect.value+')':RESTAURANT_ADDRESS;
  var orderList=cart.map(function(i){
    var meta=[];if(i.variant)meta.push(i.variant);if(i.tops&&i.tops.length)i.tops.forEach(function(t){meta.push(t.label);});
    return i.qty+'х '+i.name+(meta.length?' ('+meta.join(', ')+')':'')+' — '+i.price+' ₽';
  }).join('\n');
  if(fee>0)orderList+='\n🚚 Доставка: '+fee+' ₽';
  orderList+='\n\n💰 ИТОГО: '+total.toLocaleString('ru')+' ₽';
  var btn=document.getElementById('btnSendScript');btn.disabled=true;btn.textContent='⏳ Отправляем...';
  try{
    var res=await fetch(GOOGLE_SCRIPT_URL,{method:'POST',body:JSON.stringify({name:f.name,phone:f.phone,address:addrLine,comment:tl[f.type]||f.type,order_list:orderList})});
    var result=await res.json();
    if(result.status==='success'){closeModal();clearForm();clearCart();showSuccessModal(f.name);}
    else throw new Error(result.message);
  }catch(e){console.error(e);showToast('Ошибка. Попробуйте другой способ');}
  finally{btn.disabled=false;btn.textContent='⚡ Авто (рекомендуем)';}
});

/* ══ COPY MODAL ══════════════════════════════════════════ */
var copyModalOverlay=document.getElementById('copyModalOverlay'),copyTargetUrl='';
function openCopyModal(icon,title,url){
  var f=validateForm();if(!f)return;
  document.getElementById('copyIcon').textContent=icon;
  document.getElementById('copyTitle').textContent=title;
  document.getElementById('orderTextarea').value=buildOrderText(f);
  document.getElementById('copySuccess').classList.remove('show');
  copyTargetUrl=url;copyModalOverlay._formData=f;closeModal();copyModalOverlay.classList.add('open');
}
document.getElementById('btnSendWa').addEventListener('click', function(){openCopyModal('📱','Отправить в WhatsApp',CONTACTS.whatsapp);});
document.getElementById('btnSendMax').addEventListener('click',function(){openCopyModal('💬','Отправить в MAX',CONTACTS.max);});
document.getElementById('btnSendTg').addEventListener('click', function(){openCopyModal('✈️','Отправить в Telegram',CONTACTS.telegram);});
document.getElementById('btnCopy').addEventListener('click',async function(){
  var text=document.getElementById('orderTextarea').value;
  try{await navigator.clipboard.writeText(text);}
  catch(e){var ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);}
  var ok=document.getElementById('copySuccess');ok.classList.add('show');setTimeout(function(){ok.classList.remove('show');},2500);
  showToast('📋 Заказ скопирован!');
});
document.getElementById('btnOpenApp').addEventListener('click',function(){
  window.open(copyTargetUrl,'_blank');copyModalOverlay.classList.remove('open');
  var f=copyModalOverlay._formData;if(f){clearForm();clearCart();showSuccessModal(f.name);}
});
document.getElementById('copyModalClose').addEventListener('click',function(){copyModalOverlay.classList.remove('open');});
copyModalOverlay.addEventListener('click',function(e){if(e.target===copyModalOverlay)copyModalOverlay.classList.remove('open');});

/* ══ SUCCESS MODAL ═══════════════════════════════════════ */
var successModalOverlay=document.getElementById('successModalOverlay');
function showSuccessModal(clientName){
  document.getElementById('successOrderSummary').innerHTML='<b style="color:var(--gold)">'+clientName+'</b>, ваш заказ отправлен!';
  document.getElementById('successTg').href=CONTACTS.telegram;
  document.getElementById('successWa').href=CONTACTS.whatsapp;
  document.getElementById('successMax').href=CONTACTS.max;
  successModalOverlay.classList.add('open');showSuccessBanner();
}
document.getElementById('successClose').addEventListener('click',function(){successModalOverlay.classList.remove('open');});
successModalOverlay.addEventListener('click',function(e){if(e.target===successModalOverlay)successModalOverlay.classList.remove('open');});

/* ══ SUPPORT ═════════════════════════════════════════════ */
document.getElementById('supportTg').href=CONTACTS.telegram;
document.getElementById('supportWa').href=CONTACTS.whatsapp;
document.getElementById('supportMax').href=CONTACTS.max;

/* ══ PRIVACY MODAL ═══════════════════════════════════════ */
var privacyOverlay=document.getElementById('privacyModalOverlay');
document.getElementById('consentLink').addEventListener('click',function(e){e.preventDefault();privacyOverlay.classList.add('open');});
document.getElementById('privacyAccept').addEventListener('click',function(){document.getElementById('consentCheck').checked=true;updateConsentState();privacyOverlay.classList.remove('open');});
document.getElementById('privacyClose').addEventListener('click',function(){privacyOverlay.classList.remove('open');});
privacyOverlay.addEventListener('click',function(e){if(e.target===privacyOverlay)privacyOverlay.classList.remove('open');});
function updateConsentState(){var checked=document.getElementById('consentCheck').checked;var row=document.getElementById('consentRow');if(row)row.classList.toggle('consent-active',checked);}
document.getElementById('consentCheck').addEventListener('change',updateConsentState);

/* ══ BANNER + TOAST ══════════════════════════════════════ */
function showSuccessBanner(){var b=document.getElementById('successBanner');b.classList.add('show');setTimeout(function(){b.classList.remove('show');},4000);}
function showToast(msg){
  var c=document.getElementById('toastContainer'),t=document.createElement('div');
  t.className='toast';t.innerHTML=msg;c.appendChild(t);
  setTimeout(function(){t.remove();},2100);
}

renderCart();

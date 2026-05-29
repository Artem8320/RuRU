/* ==============================================
   RuRuBurger — app.js
   ============================================== */

/* ╔══════════════════════════════════════════════╗
   ║    ★  НАСТРОЙКИ — меняй только здесь  ★     ║
   ╚══════════════════════════════════════════════╝ */

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyZcktegKKrcMDP2XrMHm0SkKo2el0yEHUDozDtULKGgKTR7KcdQ2QMc6A_lPh-Dj4CXQ/exec';

const CONTACTS = {
  phone:    'tel:+79181623145',
  whatsapp: 'https://wa.me/79181623145',
  telegram: 'https://t.me/RuRuBurgerBot',
  max:      'https://vk.me/ruruburger',
};

const RESTAURANT_ADDRESS = 'ст. Отрадная, ул. Ленина, 15Б';

const DELIVERY_OPTIONS = [
  { name: 'Отрадная',  price: 200 },
  { name: 'Спокойная', price: 500 },
  { name: 'Удобная',   price: 500 },
  { name: 'Попутная',  price: 500 },
];

/* ╔══════════════════════════════════════════════════════╗
   ║  ★  ФОТО — замени '' на URL своей фотографии  ★     ║
   ║  Рекомендуемый размер: квадрат 400×400 px            ║
   ╚══════════════════════════════════════════════════════╝ */
const MENU_PHOTOS = {
  /* Бургеры */  'Двойной Биг Бургер':'', 'Биг Бургер':'', 'Двойной Бургер':'', 'Бургер':'', 'Чикенбургер':'',
  /* Хот-доги */ 'Хот-Дог':'', 'Френч-Дог':'',
  /* Снеки */    'Картофель Фри':'', 'Картофель по-деревенски':'', 'Наггетсы':'', 'Сырные палочки':'',
                 'Крылышки':'', 'Стрипсы':'', 'Креветки в панировке':'',
  /* Фастфуд */  'Гирос в лепешке':'', 'Клаб-Сэндвич':'', 'Тортилья':'', 'Кесадилья':'',
                 'Скипасти':'', 'Половинка скипасти':'',
  /* Напитки */  'Молочный коктейль':'', 'Мохито':'', 'Лимонад':'', 'Айс латте':'',
  /* Горячие */  'Чай':'', 'Кофе':'', 'MacCoffee 3 в 1':'',
  /* Десерты */  'Чизкейк Арахис-карамель':'', 'Чизкейк Шоколадный':'', 'Чизкейк Клубничный':'',
                 'Блин с начинкой':'', 'Вафли с мороженым':'', 'Холодный Бургер':'', 'Мороженое':'',
};

const CATEGORY_EMOJI = {
  burgers:'🍔', hotdogs:'🌭', snacks:'🍟', fastfood:'🫓',
  sauces:'🥣', drinks:'🥤', hot:'☕', desserts:'🍰',
};

/* ╔══════════════════════════════════════════════╗
   ║  ★  ДОБАВКИ к бургерам/хот-догам/фастфуду   ║
   ╚══════════════════════════════════════════════╝ */
const TOPPINGS = [
  { id:'onion',  label:'Маринованный лук', price:40 },
  { id:'pepper', label:'Халапеньо',        price:40 },
  { id:'cheese', label:'Доп. сыр',         price:50 },
];
const TOPPING_CATEGORIES = ['burgers', 'hotdogs', 'fastfood'];

/* ============================================================
   MENU DATA
   requireVariant:true  — обязательный выбор типа/вкуса
   cheeseChoice:true    — обязательный выбор сыра (Моцарелла/Чеддер)
   iceCreamFlavor:true  — обязательный выбор вкуса + доп.шарики
   iceCream3:true       — выбор 3+ шариков разных вкусов
   ============================================================ */
const menuData = {

  burgers: [
    { name:'Двойной Биг Бургер', desc:'Большая булочка, двойная котлета, сыр, помидор, малосольный огурец', requireVariant:true, variants:[
      { label:'С говядиной', price:490, note:'соус 1000 островов, барбекю' },
      { label:'С курицей',   price:470, note:'кетчуп, майонез, сырный соус' },
    ]},
    { name:'Биг Бургер', desc:'Большая булочка, одна котлета, сыр, помидор, малосольный огурец', requireVariant:true, variants:[
      { label:'С говядиной', price:370, note:'соус 1000 островов, барбекю' },
      { label:'С курицей',   price:360, note:'кетчуп, майонез, сырный соус' },
    ]},
    { name:'Двойной Бургер', desc:'Маленькая булочка, двойная котлета, сыр, помидор, малосольный огурец', requireVariant:true, variants:[
      { label:'С говядиной', price:380, note:'соус 1000 островов, барбекю' },
      { label:'С курицей',   price:360, note:'кетчуп, майонез, сырный соус' },
    ]},
    { name:'Бургер', desc:'Маленькая булочка, одна котлета, сыр, помидор, малосольный огурец', requireVariant:true, variants:[
      { label:'С говядиной', price:260, note:'соус 1000 островов, барбекю' },
      { label:'С курицей',   price:240, note:'кетчуп, майонез, сырный соус' },
    ]},
    { name:'Чикенбургер', desc:'Большая булочка, куриные стрипсы, сыр, помидор, лист салата, кисло-сладкий соус, сырный соус', price:320 },
  ],

  hotdogs: [
    { name:'Хот-Дог', desc:'Булочка, колбаска, сыр, карамелизированный лук, кетчуп, майонез, горчичный соус', requireVariant:true, variants:[
      { label:'Говяжий', price:270 },
      { label:'Куриный', price:250 },
    ]},
    { name:'Френч-Дог', desc:'Булочка, колбаска, кетчуп, майонез, горчичный соус', requireVariant:true, variants:[
      { label:'Говяжий', price:220 },
      { label:'Куриный', price:190 },
    ]},
  ],

  snacks: [
    { name:'Картофель Фри',           desc:'Золотистые хрустящие ломтики',           variants:[{label:'150г',price:170},{label:'300г',price:300}] },
    { name:'Картофель по-деревенски', desc:'Кусочки с кожурой, фирменная приправа',  variants:[{label:'150г',price:180},{label:'300г',price:320}] },
    { name:'Наггетсы',                desc:'Сочные куриные наггетсы',                variants:[{label:'3 шт',price:130},{label:'6 шт',price:240},{label:'9 шт',price:330}] },
    { name:'Сырные палочки',          desc:'Хрустящие, тянущийся сыр',               variants:[{label:'3 шт',price:150},{label:'6 шт',price:270},{label:'9 шт',price:360}] },
    { name:'Крылышки',                desc:'Сочные куриные крылышки',                variants:[{label:'3 шт',price:240},{label:'6 шт',price:420},{label:'9 шт',price:560}] },
    { name:'Стрипсы',                 desc:'В хрустящей панировке',                  variants:[{label:'3 шт',price:140},{label:'6 шт',price:250},{label:'9 шт',price:340}] },
    { name:'Креветки в панировке',    desc:'Тигровые креветки в хрустящей корочке',  variants:[{label:'3 шт',price:170},{label:'6 шт',price:290},{label:'9 шт',price:380}] },
  ],

  fastfood: [
    { name:'Гирос в лепешке', desc:'Пита, куриное филе, помидор, картошка фри, маринованный лук', requireVariant:true, variants:[
      { label:'Белый соус',           price:380 },
      { label:'Белый + красный соус', price:380 },
    ]},
    { name:'Клаб-Сэндвич',    desc:'Тостовый хлеб, куриное филе, яйцо, помидор, салат, бекон, майонез, горчица', price:360 },
    { name:'Тортилья',        desc:'Пшеничная лепёшка, куриное филе, свежие овощи, соус',                         price:360, cheeseChoice:true },
    { name:'Кесадилья',       desc:'Лепёшка, плавленый сыр, курица, томаты',                                      price:320 },
    { name:'Скипасти',        desc:'Пита, куриное филе, помидор, картофель фри, маринованный лук, белый соус',    price:620, cheeseChoice:true },
    { name:'Половинка скипасти', desc:'Пита, куриное филе, помидор, картофель фри, маринованный лук, белый соус', price:340, cheeseChoice:true },
  ],

  sauces: [
    { name:'Кисло-сладкий соус', desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Сырный соус',        desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Кетчуп',             desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Соус Барбекю',       desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Соус 1000 островов', desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Красный соус',       desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Белый соус',         desc:'', variants:[{label:'Маленький',price:40},{label:'Большой',price:50}] },
    { name:'Маринованный лук',   desc:'Добавка к блюду', price:40 },
    { name:'Перец халапеньо',    desc:'Добавка, острый',  price:40 },
    { name:'Дополнительный сыр', desc:'Добавка',          price:50 },
  ],

  drinks: [
    { name:'Добрый Кола',           desc:'', variants:[{label:'0.33 л',price:120},{label:'0.5 л',price:130}] },
    { name:'Добрый Фанта',          desc:'', variants:[{label:'0.33 л',price:120},{label:'0.5 л',price:130}] },
    { name:'Добрый Спрайт',         desc:'0.33 л', price:120 },
    { name:'Добрый Киви-виноград',  desc:'0.33 л', price:120 },
    { name:'Добрый Манго-маракуйя', desc:'0.5 л',  price:130 },
    { name:'Адреналин',             desc:'Энергетик', variants:[{label:'0.25 л',price:120},{label:'0.5 л',price:160}] },
    { name:'Сок Добрый Яблоко',     desc:'0.3 л', price:100 },
    { name:'Сок Добрый Мультифрукт',desc:'0.3 л', price:100 },
    { name:'Сок Ричи Вишня',        desc:'0.3 л', price:110 },
    { name:'Сок Ричи Апельсин',     desc:'0.3 л', price:110 },
    { name:'Чай Ричи Лимон',        desc:'0.5 л', price:130 },
    { name:'Чай Ричи Персик',       desc:'0.5 л', price:130 },
    { name:'Чай Ричи Зелёный',      desc:'0.5 л', price:130 },
    { name:'Палпи',                 desc:'0.5 л, апельсиновый', price:120 },
    { name:'Вода газированная',     desc:'0.5 л', price:60 },
    { name:'Вода негазированная',   desc:'0.5 л', price:60 },
    { name:'Молочный коктейль', desc:'0.4 л', requireVariant:true, variants:[
      { label:'Ванильный',  price:250 },
      { label:'Шоколадный', price:250 },
      { label:'Клубничный', price:250 },
    ]},
    { name:'Мохито', desc:'0.4 л', requireVariant:true, variants:[
      { label:'Стандартный', price:240 },
      { label:'Клубничный',  price:240 },
    ]},
    { name:'Лимонад', desc:'0.4 л', requireVariant:true, variants:[
      { label:'Клубника/вишня',     price:240 },
      { label:'Грейпфрут/апельсин', price:240 },
      { label:'Апельсин/маракуйя',  price:240 },
    ]},
    { name:'Айс латте', desc:'', price:250 },
  ],

  hot: [
    { name:'Чай', desc:'', requireVariant:true, variants:[
      { label:'Чёрный',  price:50 },
      { label:'Зелёный', price:50 },
    ]},
    { name:'Кофе', desc:'', requireVariant:true, variants:[
      { label:'Американо', price:200 },
      { label:'Капучино',  price:200 },
      { label:'Латте',     price:200 },
      { label:'Эспрессо',  price:200 },
    ]},
    { name:'MacCoffee 3 в 1', desc:'', price:50 },
  ],

  desserts: [
    { name:'Чизкейк Арахис-карамель', desc:'Нежный сливочный чизкейк с карамелью и арахисом', price:230 },
    { name:'Чизкейк Шоколадный',      desc:'Насыщенный шоколадный чизкейк',                    price:230 },
    { name:'Чизкейк Клубничный',      desc:'Чизкейк с ароматной клубникой',                    price:230 },
    { name:'Блин с начинкой', desc:'Блин, начинка, банан', requireVariant:true, variants:[
      { label:'Нутелла',  price:300 },
      { label:'Сгущенка', price:300 },
    ]},
    { name:'Вафли с мороженым', desc:'Вафли, нутелла, банан, мороженое', price:260,
      iceCreamFlavor:true,
      iceFlavors:['Ванильное','Шоколадное','Клубничное'],
      extraScoopPrice:50,
    },
    { name:'Холодный Бургер', desc:'Булочка, нутелла, банан, мороженое', price:290,
      iceCreamFlavor:true,
      iceFlavors:['Ванильный','Шоколадный','Клубничный'],
      extraScoopPrice:50,
    },
    { name:'Мороженое', desc:'Порция — 3 шарика, можно разные вкусы', price:250,
      iceCream3:true,
      iceFlavors:['Ванильное','Шоколадное','Клубничное'],
      extraScoopPrice:50,
    },
  ],
};

/* ==============================
   CART STATE
============================== */
var cart = [];

function makeKey(name, variant, toppingIds) {
  return name + '|' + (variant||'') + '|' + (toppingIds||[]).slice().sort().join(',');
}
function cartSum() {
  return cart.reduce(function(s,i){ return s + i.price * i.qty; }, 0);
}

/* ==============================
   BUILD CARD HTML HELPERS
============================== */
function buildPhoto(item, category) {
  var url   = MENU_PHOTOS[item.name] || '';
  var emoji = CATEGORY_EMOJI[category] || '🍽️';
  if (url) return '<div class="card-photo"><img src="'+url+'" alt="'+item.name+'" loading="lazy"></div>';
  return '<div class="card-photo"><div class="card-photo-placeholder">'+emoji+'</div></div>';
}

/* ==============================
   CREATE CARD
============================== */
var allCards = [];

function createCard(item, category) {
  var el = document.createElement('div');
  el.className = 'menu-card';

  var hasVariants      = !!(item.variants && item.variants.length > 0);
  var isRequired       = !!item.requireVariant;
  var hasCheeseChoice  = !!item.cheeseChoice;
  var hasIceCreamFlav  = !!item.iceCreamFlavor;
  var hasIceCream3     = !!item.iceCream3;
  var hasToppings      = TOPPING_CATEGORIES.indexOf(category) !== -1;
  var extraScoopPrice  = item.extraScoopPrice || 50;
  var iceFlavors       = item.iceFlavors || ['Ванильное','Шоколадное','Клубничное'];

  // Base price display
  var basePrice;
  if (hasVariants && !isRequired) basePrice = item.variants[0].price;
  else if (hasVariants && isRequired) basePrice = Math.min.apply(null, item.variants.map(function(v){return v.price;}));
  else basePrice = item.price || 0;

  var priceDisplay;
  if (isRequired && hasVariants) {
    var mn = Math.min.apply(null, item.variants.map(function(v){return v.price;}));
    var mx = Math.max.apply(null, item.variants.map(function(v){return v.price;}));
    priceDisplay = mn===mx ? mn+'₽' : mn+'–'+mx+'₽';
  } else {
    priceDisplay = basePrice+'₽';
  }

  // ── Required variants section ──
  var varHTML = '';
  if (hasVariants) {
    var allSamePrice = item.variants.every(function(v){ return v.price === item.variants[0].price; });
    var pills = item.variants.map(function(v,i){
      var cls = isRequired ? 'rc-btn' : ('rc-btn'+(i===0?' selected':''));
      var tt  = v.note ? (' title="'+v.note+'"') : '';
      var priceStr = (isRequired && allSamePrice) ? '' : (' — '+v.price+'₽');
      return '<button class="'+cls+'" data-price="'+v.price+'" data-label="'+v.label+'"'+tt+'>'+v.label+priceStr+'</button>';
    }).join('');
    var hint = '';
    varHTML = '<div class="required-choice"><div class="rc-label">'+
      (isRequired ? '⚡ Выберите тип' : '📦 Размер / порция')+
      '</div><div class="rc-pills">'+hint+pills+'</div></div>';
  }

  // ── Cheese choice ──
  var cheeseHTML = '';
  if (hasCheeseChoice) {
    cheeseHTML = '<div class="required-choice">'
      +'<div class="rc-label">🧀 Выберите сыр</div>'
      +'<div class="rc-pills">'
      +''
      +'<button class="rc-btn cheese-btn" data-cheese="Моцарелла">🤍 Моцарелла</button>'
      +'<button class="rc-btn cheese-btn" data-cheese="Чеддер">🧡 Чеддер</button>'
      +'</div></div>';
  }

  // ── Ice cream single flavor + extra scoops ──
  var iceCreamFlavorHTML = '';
  if (hasIceCreamFlav) {
    var fpills = iceFlavors.map(function(f){
      return '<button class="rc-btn ice-flavor-btn" data-flavor="'+f+'">'+f+'</button>';
    }).join('');
    var expills = iceFlavors.map(function(f){
      return '<button class="tp-pill extra-scoop-btn" data-flavor="'+f+'">+&nbsp;'+f+' <span>'+extraScoopPrice+'₽</span><em class="ep-count"></em></button>';
    }).join('');
    iceCreamFlavorHTML = '<div class="required-choice">'
      +'<div class="rc-label">🍦 Вкус мороженого</div>'
      +'<div class="rc-pills">'+fpills+'</div>'
      +'</div>'
      +'<div class="toppings-section">'
      +'<div class="tp-label">+ Добавить шарик (каждый +'+extraScoopPrice+'₽)</div>'
      +'<div class="tp-pills extra-pills">'+expills+'</div>'
      +'</div>';
  }

  // ── Ice cream 3 scoops ──
  var iceCream3HTML = '';
  if (hasIceCream3) {
    var rows = iceFlavors.map(function(f){
      return '<div class="scoop-row" data-flavor="'+f+'">'
        +'<span class="scoop-name">'+f+'</span>'
        +'<div class="scoop-ctrl">'
        +'<button class="scoop-m">−</button>'
        +'<span class="scoop-n">0</span>'
        +'<button class="scoop-p">+</button>'
        +'</div></div>';
    }).join('');
    iceCream3HTML = '<div class="required-choice icecream3-section">'
      +'<div class="rc-label">🍦 Выберите 3 шарика</div>'+'<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">Порция — 3 шарика, можно разные вкусы · Доп. шарик +50₽</div>'
      +rows
      +'<div class="scoop-total-row">Выбрано: <span class="scoop-total-num">0</span> шт. — <span class="scoop-total-price">250₽</span>'
      +' <span class="scoop-hint-min" style="color:#ff6b6b;font-size:11px">(нужно мин. 3)</span></div>'
      +'</div>';
  }

  // ── Optional toppings ──
  var toppingHTML = '';
  if (hasToppings) {
    var tpills = TOPPINGS.map(function(t){
      return '<button class="tp-pill topping-pill" data-id="'+t.id+'" data-price="'+t.price+'">+ '+t.label+' <span>'+t.price+'₽</span></button>';
    }).join('');
    toppingHTML = '<div class="toppings-section">'
      +'<div class="tp-label">Добавки (по желанию)</div>'
      +'<div class="tp-pills">'+tpills+'</div>'
      +'</div>';
  }

  el.innerHTML = buildPhoto(item, category)
    +'<div class="card-body">'
    +'<div class="card-header">'
    +'<span class="card-name">'+item.name+'</span>'
    +'<span class="card-price">'+priceDisplay+'</span>'
    +'</div>'
    +(item.desc ? '<p class="card-desc">'+item.desc+'</p>' : '')
    +varHTML+cheeseHTML+iceCreamFlavorHTML+iceCream3HTML+toppingHTML
    +'<button class="add-btn">+ В корзину</button>'
    +'<div class="card-qty-control">'
    +'<button class="card-qty-btn card-minus">−</button>'
    +'<span class="card-qty-num">1</span>'
    +'<button class="card-qty-btn card-plus">+</button>'
    +'</div></div>';

  // ── State ──
  var curPrice   = isRequired ? null : basePrice;
  var curVariant = isRequired ? null : (hasVariants ? item.variants[0].label : '');
  var curCheese  = null;
  var curIceFlavor = null;
  var selTops    = [];
  var scoopCounts = {};  // for iceCream3
  if (hasIceCream3) iceFlavors.forEach(function(f){ scoopCounts[f]=0; });
  var extraScoops = {}; // flavor -> count, for iceCreamFlavor
  if (hasIceCreamFlav) iceFlavors.forEach(function(f){ extraScoops[f]=0; });

  var priceEl = el.querySelector('.card-price');
  var addBtn  = el.querySelector('.add-btn');
  var qtyCtrl = el.querySelector('.card-qty-control');
  var qtyNum  = el.querySelector('.card-qty-num');

  function totalPrice() {
    var base = curPrice || 0;
    var topsSum = selTops.reduce(function(s,t){return s+t.price;},0);
    var extraSum = 0;
    if (hasIceCreamFlav) {
      iceFlavors.forEach(function(f){ extraSum += (extraScoops[f]||0)*extraScoopPrice; });
    }
    if (hasIceCream3) {
      var total3 = iceFlavors.reduce(function(s,f){return s+(scoopCounts[f]||0);},0);
      var extraN = Math.max(0, total3 - 3);
      extraSum = extraN * extraScoopPrice;
    }
    return base + topsSum + extraSum;
  }

  function totalScoops3() {
    return iceFlavors.reduce(function(s,f){return s+(scoopCounts[f]||0);},0);
  }

  function refreshPrice() {
    if (isRequired && !curVariant) { priceEl.textContent = priceDisplay; return; }
    if ((hasIceCreamFlav||hasIceCream3) && !curIceFlavor && !hasIceCream3) { priceEl.textContent = priceDisplay; return; }
    priceEl.textContent = totalPrice()+'₽';
  }

  function refreshScoop3UI() {
    if (!hasIceCream3) return;
    var total = totalScoops3();
    var hint  = el.querySelector('.scoop-hint-min');
    var tnum  = el.querySelector('.scoop-total-num');
    var tprc  = el.querySelector('.scoop-total-price');
    if (tnum) tnum.textContent = total;
    if (hint) hint.style.display = total >= 3 ? 'none' : '';
    var extraN = Math.max(0, total-3);
    var price3 = item.price + extraN*extraScoopPrice;
    if (tprc) tprc.textContent = price3+'₽';
    refreshPrice();
  }

  // Required variant buttons
  if (hasVariants) {
    var rcBtns = el.querySelectorAll('.rc-btn:not(.cheese-btn):not(.ice-flavor-btn)');
    rcBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        rcBtns.forEach(function(b){b.classList.remove('selected');});
        btn.classList.add('selected');
        curPrice   = parseInt(btn.dataset.price);
        curVariant = btn.dataset.label;
        var hint = btn.closest('.rc-pills') && btn.closest('.rc-pills').querySelector('.rc-hint');
        if (hint) hint.style.display='none';
        refreshPrice(); syncCard();
      });
    });
    // Default select first for non-required
    if (!isRequired) {
      curPrice   = item.variants[0].price;
      curVariant = item.variants[0].label;
    }
  }

  // Cheese buttons
  if (hasCheeseChoice) {
    var cBtns = el.querySelectorAll('.cheese-btn');
    cBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        cBtns.forEach(function(b){b.classList.remove('selected');});
        btn.classList.add('selected');
        curCheese = btn.dataset.cheese;
        var hint = btn.closest('.rc-pills') && btn.closest('.rc-pills').querySelector('.rc-hint');
        if (hint) hint.style.display='none';
        syncCard();
      });
    });
  }

  // Ice cream single flavor
  if (hasIceCreamFlav) {
    var ifBtns = el.querySelectorAll('.ice-flavor-btn');
    ifBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        ifBtns.forEach(function(b){b.classList.remove('selected');});
        btn.classList.add('selected');
        curIceFlavor = btn.dataset.flavor;
        curPrice = item.price;
        var hint = btn.closest('.rc-pills') && btn.closest('.rc-pills').querySelector('.rc-hint');
        if (hint) hint.style.display='none';
        refreshPrice(); syncCard();
      });
    });
    // Extra scoops counter pills
    var epBtns = el.querySelectorAll('.extra-scoop-btn');
    epBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        var f = btn.dataset.flavor;
        extraScoops[f] = (extraScoops[f]||0) + 1;
        var em = btn.querySelector('.ep-count');
        if (em) em.textContent = extraScoops[f]>0 ? ' ×'+extraScoops[f] : '';
        btn.classList.toggle('active', extraScoops[f]>0);
        refreshPrice(); syncCard();
      });
      btn.addEventListener('contextmenu', function(e){
        e.preventDefault();
        var f = btn.dataset.flavor;
        if ((extraScoops[f]||0)>0) {
          extraScoops[f]--;
          var em = btn.querySelector('.ep-count');
          if (em) em.textContent = extraScoops[f]>0 ? ' ×'+extraScoops[f] : '';
          btn.classList.toggle('active', extraScoops[f]>0);
          refreshPrice(); syncCard();
        }
      });
    });
  }

  // Ice cream 3 scoops counters
  var pendingExtraScoop = false; // пользователь нажал "+шарик" но не выбрал вкус
  if (hasIceCream3) {
    curPrice = item.price;
    el.querySelectorAll('.scoop-row').forEach(function(row){
      var f     = row.dataset.flavor;
      var numEl = row.querySelector('.scoop-n');
      row.querySelector('.scoop-p').addEventListener('click', function(){
        scoopCounts[f]=(scoopCounts[f]||0)+1;
        if (numEl) numEl.textContent = scoopCounts[f];
        var total = totalScoops3();
        // Show extra scoop section when user has >=3 scoops
        var extraSec = el.querySelector('.extra-scoop3-section');
        if (extraSec) extraSec.style.display = total>=3 ? '' : 'none';
        refreshScoop3UI(); syncCard();
      });
      row.querySelector('.scoop-m').addEventListener('click', function(){
        if ((scoopCounts[f]||0)>0) { scoopCounts[f]--; if (numEl) numEl.textContent=scoopCounts[f]; }
        var total = totalScoops3();
        var extraSec = el.querySelector('.extra-scoop3-section');
        if (extraSec) extraSec.style.display = total>=3 ? '' : 'none';
        refreshScoop3UI(); syncCard();
      });
    });
    // Extra scoop3 flavor buttons — each click adds one extra scoop of that flavor
    el.querySelectorAll('.extra-scoop3-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var f = btn.dataset.flavor;
        scoopCounts[f]=(scoopCounts[f]||0)+1;
        var numEl = el.querySelector('.scoop-row[data-flavor="'+f+'"] .scoop-n');
        if (numEl) numEl.textContent = scoopCounts[f];
        var warn = el.querySelector('.extra-scoop3-warning');
        if (warn) warn.style.display='none';
        pendingExtraScoop = false;
        refreshScoop3UI(); syncCard();
      });
    });
  }

  // Optional toppings
  if (hasToppings) {
    el.querySelectorAll('.topping-pill').forEach(function(pill){
      pill.addEventListener('click', function(){
        pill.classList.toggle('active');
        var id    = pill.dataset.id;
        var price = parseInt(pill.dataset.price);
        var tObj  = TOPPINGS.find(function(t){return t.id===id;});
        if (pill.classList.contains('active')) {
          selTops.push({id:id, price:price, label:tObj?tObj.label:id});
        } else {
          selTops = selTops.filter(function(t){return t.id!==id;});
        }
        refreshPrice(); syncCard();
      });
    });
  }

  function buildVariantLabel() {
    var parts = [];
    if (curVariant) parts.push(curVariant);
    if (curCheese)  parts.push('сыр: '+curCheese);
    if (hasIceCreamFlav && curIceFlavor) {
      parts.push(curIceFlavor);
      iceFlavors.forEach(function(f){
        if ((extraScoops[f]||0)>0) parts.push('+'+extraScoops[f]+' '+f);
      });
    }
    if (hasIceCream3) {
      iceFlavors.forEach(function(f){
        if ((scoopCounts[f]||0)>0) parts.push(scoopCounts[f]+'×'+f);
      });
    }
    return parts.join(', ');
  }

  function curKey() {
    var tIds = selTops.map(function(t){return t.id;});
    return makeKey(item.name, buildVariantLabel(), tIds);
  }

  function getQty() {
    var k=curKey(), e=cart.find(function(i){return i.key===k;});
    return e?e.qty:0;
  }

  function syncCard() {
    var qty=getQty();
    addBtn.style.display = qty>0?'none':'';
    if (qty>0){qtyCtrl.classList.add('visible');qtyNum.textContent=qty;}
    else qtyCtrl.classList.remove('visible');
  }

  addBtn.addEventListener('click', function(){
    // Validate
    if (isRequired && !curVariant) {
      var vb=el.querySelectorAll('.rc-btn:not(.cheese-btn):not(.ice-flavor-btn)');
      vb.forEach(function(b){b.classList.add('pulse');}); setTimeout(function(){vb.forEach(function(b){b.classList.remove('pulse');});},600);
      showToast('👆 Выберите тип начинки'); return;
    }
    if (hasCheeseChoice && !curCheese) {
      var cb=el.querySelectorAll('.cheese-btn');
      cb.forEach(function(b){b.classList.add('pulse');}); setTimeout(function(){cb.forEach(function(b){b.classList.remove('pulse');});},600);
      showToast('🧀 Выберите сыр'); return;
    }
    if (hasIceCreamFlav && !curIceFlavor) {
      var ib=el.querySelectorAll('.ice-flavor-btn');
      ib.forEach(function(b){b.classList.add('pulse');}); setTimeout(function(){ib.forEach(function(b){b.classList.remove('pulse');});},600);
      showToast('🍦 Выберите вкус мороженого'); return;
    }
    if (hasIceCream3 && totalScoops3()<3) {
      showToast('🍦 Добавьте минимум 3 шарика'); return;
    }
    addToCart(curKey(), item.name, totalPrice(), buildVariantLabel(), selTops.slice());
    syncCard();
  });

  el.querySelector('.card-minus').addEventListener('click', function(){changeQtyByKey(curKey(),-1);syncCard();});
  el.querySelector('.card-plus').addEventListener('click',  function(){changeQtyByKey(curKey(), 1);syncCard();});

  el._sync = syncCard;
  return el;
}

function renderGrid(id, items, category) {
  var el=document.getElementById(id); if (!el) return;
  items.forEach(function(item){ var c=createCard(item,category); allCards.push(c); el.appendChild(c); });
}

renderGrid('grid-burgers',  menuData.burgers,  'burgers');
renderGrid('grid-hotdogs',  menuData.hotdogs,  'hotdogs');
renderGrid('grid-snacks',   menuData.snacks,   'snacks');
renderGrid('grid-fastfood', menuData.fastfood, 'fastfood');
renderGrid('grid-sauces',   menuData.sauces,   'sauces');
renderGrid('grid-desserts', menuData.desserts, 'desserts');
renderGrid('grid-drinks',   menuData.drinks,   'drinks');
renderGrid('grid-hot',      menuData.hot,      'hot');

/* ==============================
   CART OPERATIONS
============================== */
function addToCart(key, name, price, variant, tops) {
  var ex=cart.find(function(i){return i.key===key;});
  if (ex){ex.qty++;}
  else cart.push({key:key,name:name,price:price,variant:variant,tops:tops||[],qty:1});
  renderCart();
  showToast('<span class="gold">+1</span> '+name+(variant?' ('+variant+')':''));
}

function changeQtyByKey(key, delta) {
  var idx=cart.findIndex(function(i){return i.key===key;}); if(idx===-1)return;
  cart[idx].qty+=delta; if(cart[idx].qty<=0)cart.splice(idx,1); renderCart();
}

function syncAllCards(){allCards.forEach(function(c){if(c._sync)c._sync();});}

function renderCart() {
  var iEl=document.getElementById('cartItems'), bEl=document.getElementById('cartBadge'),
      tEl=document.getElementById('cartTotal'), bar=document.getElementById('bottomBar'),
      bQ=document.getElementById('bottomQty'), bT=document.getElementById('bottomTotal');
  var qty=cart.reduce(function(s,i){return s+i.qty;},0), total=cartSum();
  bEl.textContent=qty; bEl.classList.toggle('visible',qty>0);
  tEl.textContent=total.toLocaleString('ru')+' ₽';
  bQ.textContent=qty; bT.textContent=total.toLocaleString('ru')+' ₽';
  bar.classList.toggle('has-items',qty>0);
  syncAllCards();

  if(cart.length===0){
    iEl.innerHTML='<div class="cart-empty"><span class="cart-empty-icon">🛒</span><p>Корзина пуста<br><span style="font-size:12px;color:var(--text-muted)">Добавьте что-нибудь вкусное</span></p></div>';
    return;
  }
  iEl.innerHTML=cart.map(function(item,idx){
    var meta=[]; if(item.variant)meta.push(item.variant); if(item.tops&&item.tops.length)item.tops.forEach(function(t){meta.push(t.label);});
    return '<div class="cart-item">'
      +'<div class="cart-item-info"><div class="cart-item-name">'+item.name+'</div>'
      +(meta.length?'<div class="cart-item-meta">'+meta.join(' · ')+'</div>':'')
      +'</div>'
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
      var i=parseInt(btn.dataset.idx); cart[i].qty+=btn.dataset.add?1:-1;
      if(cart[i].qty<=0)cart.splice(i,1); renderCart();
    });
  });
}

/* ==============================
   CART DRAWER
============================== */
var cartOverlay=document.getElementById('cartOverlay'), cartDrawer=document.getElementById('cartDrawer');
function openCart(){cartOverlay.classList.add('open');cartDrawer.classList.add('open');document.body.style.overflow='hidden';}
function closeCart(){cartOverlay.classList.remove('open');cartDrawer.classList.remove('open');document.body.style.overflow='';}
document.getElementById('cartToggle').addEventListener('click',openCart);
document.getElementById('cartClose').addEventListener('click',closeCart);
document.getElementById('bottomCartBtn').addEventListener('click',openCart);
cartOverlay.addEventListener('click',closeCart);

/* ==============================
   TABS + SCROLL AUTO-SWITCH
============================== */
var tabs=document.querySelectorAll('.tab'), indicator=document.getElementById('tabIndicator');
function moveIndicator(t){indicator.style.width=t.offsetWidth+'px';indicator.style.height=t.offsetHeight+'px';indicator.style.left=t.offsetLeft+'px';indicator.style.top=t.offsetTop+'px';}
setTimeout(function(){var a=document.querySelector('.tab.active');if(a)moveIndicator(a);},60);
window.addEventListener('resize',function(){var a=document.querySelector('.tab.active');if(a)moveIndicator(a);});

var scrollLock=false;
var panelObserver=new IntersectionObserver(function(entries){
  if(scrollLock)return;
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      var id=entry.target.id.replace('panel-',''), tab=document.querySelector('.tab[data-tab="'+id+'"]');
      if(tab&&!tab.classList.contains('active')){
        tabs.forEach(function(t){t.classList.remove('active');}); tab.classList.add('active'); moveIndicator(tab);
        tab.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
      }
    }
  });
},{rootMargin:'-35% 0px -55% 0px',threshold:0});
document.querySelectorAll('.menu-panel').forEach(function(p){panelObserver.observe(p);});
tabs.forEach(function(tab){
  tab.addEventListener('click',function(){
    scrollLock=true;
    tabs.forEach(function(t){t.classList.remove('active');}); tab.classList.add('active'); moveIndicator(tab);
    tab.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    var panel=document.getElementById('panel-'+tab.dataset.tab);
    if(panel)panel.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(function(){scrollLock=false;},900);
  });
});

/* ==============================
   DELIVERY SELECTOR
============================== */
var villageSelect=document.getElementById('villageSelect');
DELIVERY_OPTIONS.forEach(function(opt,i){
  var o=document.createElement('option'); o.value=opt.name;
  o.textContent=opt.name+'  (+'+opt.price+' ₽)'; if(i===0)o.selected=true; villageSelect.appendChild(o);
});
function getDeliveryFee(){var a=document.querySelector('.toggle-option.active'); if(!a||a.dataset.value!=='delivery')return 0; var o=DELIVERY_OPTIONS[villageSelect.selectedIndex]; return o?o.price:0;}
function updateDeliveryNote(){var fee=getDeliveryFee(),note=document.getElementById('deliveryPriceNote'); note.textContent=fee>0?'Стоимость доставки: '+fee+' ₽':''; refreshModalPreview();}
villageSelect.addEventListener('change',updateDeliveryNote);

/* ==============================
   ORDER MODAL
============================== */
var modalOverlay=document.getElementById('modalOverlay'), deliveryOptions=document.querySelectorAll('.toggle-option'), deliveryBlock=document.getElementById('deliveryBlock');
deliveryOptions.forEach(function(opt){
  opt.addEventListener('click',function(){
    deliveryOptions.forEach(function(o){o.classList.remove('active');}); opt.classList.add('active');
    deliveryBlock.classList.toggle('visible',opt.dataset.value==='delivery'); updateDeliveryNote();
  });
});
document.getElementById('btnOrder').addEventListener('click',function(){
  if(cart.length===0){showToast('Добавьте товары в корзину');return;}
  refreshModalPreview(); modalOverlay.classList.add('open'); closeCart();
});

function refreshModalPreview(){
  var fee=getDeliveryFee(), total=cartSum()+fee;
  var lines=cart.map(function(i){
    var meta=[]; if(i.variant)meta.push(i.variant); if(i.tops&&i.tops.length)i.tops.forEach(function(t){meta.push(t.label);});
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

/* ==============================
   VALIDATE FORM
============================== */
function validateForm(){
  var name=document.getElementById('inputName').value.trim();
  var phone=document.getElementById('inputPhone').value.trim();
  var addrEl=document.getElementById('inputAddress'), addr=addrEl?addrEl.value.trim():'';
  var act=document.querySelector('.toggle-option.active'), type=act?act.dataset.value:'pickup';
  if(!name){document.getElementById('inputName').focus();showToast('Введите ваше имя');return null;}
  if(phone.length<7){document.getElementById('inputPhone').focus();showToast('Введите телефон');return null;}
  if(type==='delivery'&&!addr){if(addrEl)addrEl.focus();showToast('Введите адрес доставки');return null;}
  if(!document.getElementById('consentCheck').checked){
    var row=document.getElementById('consentRow');
    if(row){row.classList.add('consent-shake');setTimeout(function(){row.classList.remove('consent-shake');},600);}
    showToast('☑️ Отметьте согласие на обработку данных');
    return null;
  }
  return {name:name,phone:phone,addr:addr,type:type};
}
function clearForm(){document.getElementById('inputName').value='';document.getElementById('inputPhone').value='';var a=document.getElementById('inputAddress');if(a)a.value='';}
function clearCart(){cart=[];renderCart();}

/* ==============================
   BUILD ORDER TEXT
============================== */
function buildOrderText(f){
  var fee=getDeliveryFee(), total=cartSum()+fee;
  var tl={pickup:'Самовывоз',hall:'Питание в зале',delivery:'Доставка'};
  var addrLine=f.type==='delivery'?f.addr+' ('+villageSelect.value+')':RESTAURANT_ADDRESS;
  var sep='------------------------';
  var itemLines=cart.map(function(item,idx){
    var meta=[]; if(item.variant)meta.push(item.variant); if(item.tops&&item.tops.length)item.tops.forEach(function(t){meta.push(t.label);});
    return (idx+1)+'. '+item.name+(meta.length?' ('+meta.join(', ')+')':'')+' — '+item.qty+' шт. х '+item.price+' ₽';
  }).join('\n');
  var lines=['🍔 НОВЫЙ ЗАКАЗ RuRuBurger',sep,'👤 Клиент: '+f.name,'📞 Телефон: '+f.phone,'🚗 Способ: '+(tl[f.type]||f.type),'📍 Адрес: '+addrLine,sep,'🧾 СОСТАВ ЗАКАЗА:',itemLines,sep];
  if(fee>0)lines.push('🚚 Доставка: '+fee+' ₽');
  lines.push('💰 ИТОГО К ОПЛАТЕ: '+total.toLocaleString('ru')+' ₽');
  return lines.join('\n');
}

/* ==============================
   SEND — GOOGLE APPS SCRIPT
============================== */
document.getElementById('btnSendScript').addEventListener('click',async function(){
  var f=validateForm(); if(!f)return;
  var fee=getDeliveryFee(), total=cartSum()+fee;
  var tl={pickup:'Самовывоз',hall:'Питание в зале',delivery:'Доставка'};
  var addrLine=f.type==='delivery'?f.addr+' ('+villageSelect.value+')':RESTAURANT_ADDRESS;
  var orderList=cart.map(function(i){
    var meta=[]; if(i.variant)meta.push(i.variant); if(i.tops&&i.tops.length)i.tops.forEach(function(t){meta.push(t.label);});
    return i.qty+'х '+i.name+(meta.length?' ('+meta.join(', ')+')':'')+' — '+i.price+' ₽';
  }).join('\n');
  if(fee>0)orderList+='\n🚚 Доставка: '+fee+' ₽';
  orderList+='\n\n💰 ИТОГО: '+total.toLocaleString('ru')+' ₽';
  var btn=document.getElementById('btnSendScript');
  btn.disabled=true; btn.textContent='⏳ Отправляем...';
  try{
    var res=await fetch(GOOGLE_SCRIPT_URL,{method:'POST',body:JSON.stringify({name:f.name,phone:f.phone,address:addrLine,comment:tl[f.type]||f.type,order_list:orderList})});
    var result=await res.json();
    if(result.status==='success'){closeModal();clearForm();clearCart();showSuccessModal(f.name);}
    else throw new Error(result.message);
  }catch(e){console.error(e);showToast('Ошибка. Попробуйте другой способ');}
  finally{btn.disabled=false;btn.textContent='⚡ Авто (рекомендуем)';}
});

/* ==============================
   COPY MODAL
============================== */
var copyModalOverlay=document.getElementById('copyModalOverlay'), copyTargetUrl='';
function openCopyModal(icon,title,url){
  var f=validateForm(); if(!f)return;
  document.getElementById('copyIcon').textContent=icon;
  document.getElementById('copyTitle').textContent=title;
  document.getElementById('orderTextarea').value=buildOrderText(f);
  document.getElementById('copySuccess').classList.remove('show');
  copyTargetUrl=url; copyModalOverlay._formData=f; closeModal(); copyModalOverlay.classList.add('open');
}
document.getElementById('btnSendWa').addEventListener('click',function(){openCopyModal('📱','Отправить в WhatsApp',CONTACTS.whatsapp);});
document.getElementById('btnSendMax').addEventListener('click',function(){openCopyModal('💬','Отправить в MAX',CONTACTS.max);});
document.getElementById('btnSendTg').addEventListener('click',function(){openCopyModal('✈️','Отправить в Telegram',CONTACTS.telegram);});
document.getElementById('btnCopy').addEventListener('click',async function(){
  var text=document.getElementById('orderTextarea').value;
  try{await navigator.clipboard.writeText(text);}
  catch(e){var ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);}
  var ok=document.getElementById('copySuccess'); ok.classList.add('show'); setTimeout(function(){ok.classList.remove('show');},2500);
  showToast('📋 Заказ скопирован!');
});
document.getElementById('btnOpenApp').addEventListener('click',function(){
  window.open(copyTargetUrl,'_blank'); copyModalOverlay.classList.remove('open');
  var f=copyModalOverlay._formData; if(f){clearForm();clearCart();showSuccessModal(f.name);}
});
document.getElementById('copyModalClose').addEventListener('click',function(){copyModalOverlay.classList.remove('open');});
copyModalOverlay.addEventListener('click',function(e){if(e.target===copyModalOverlay)copyModalOverlay.classList.remove('open');});

/* ==============================
   SUCCESS MODAL
============================== */
var successModalOverlay=document.getElementById('successModalOverlay');
function showSuccessModal(clientName){
  document.getElementById('successOrderSummary').innerHTML='<b style="color:var(--gold)">'+clientName+'</b>, ваш заказ отправлен!';
  document.getElementById('successTg').href=CONTACTS.telegram;
  document.getElementById('successWa').href=CONTACTS.whatsapp;
  document.getElementById('successMax').href=CONTACTS.max;
  successModalOverlay.classList.add('open'); showSuccessBanner();
}
document.getElementById('successClose').addEventListener('click',function(){successModalOverlay.classList.remove('open');});
successModalOverlay.addEventListener('click',function(e){if(e.target===successModalOverlay)successModalOverlay.classList.remove('open');});

/* ==============================
   SUPPORT SECTION
============================== */
document.getElementById('supportTg').href=CONTACTS.telegram;
document.getElementById('supportWa').href=CONTACTS.whatsapp;
document.getElementById('supportMax').href=CONTACTS.max;

/* ==============================
   SUCCESS BANNER
============================== */
function showSuccessBanner(){var b=document.getElementById('successBanner');b.classList.add('show');setTimeout(function(){b.classList.remove('show');},4000);}

/* ==============================
   TOAST
============================== */
function showToast(msg){
  var c=document.getElementById('toastContainer'),t=document.createElement('div');
  t.className='toast';t.innerHTML=msg;c.appendChild(t);
  setTimeout(function(){t.remove();},2100);
}

/* ==============================
   PRIVACY POLICY MODAL
============================== */
var privacyOverlay = document.getElementById('privacyModalOverlay');

document.getElementById('consentLink').addEventListener('click', function(e){
  e.preventDefault(); privacyOverlay.classList.add('open');
});
document.getElementById('privacyAccept').addEventListener('click', function(){
  document.getElementById('consentCheck').checked = true;
  updateConsentState();
  privacyOverlay.classList.remove('open');
});
document.getElementById('privacyClose').addEventListener('click', function(){
  privacyOverlay.classList.remove('open');
});
privacyOverlay.addEventListener('click', function(e){
  if(e.target===privacyOverlay) privacyOverlay.classList.remove('open');
});

function updateConsentState(){
  var checked = document.getElementById('consentCheck').checked;
  var row = document.getElementById('consentRow');
  if(row) row.classList.toggle('consent-active', checked);
}

document.getElementById('consentCheck').addEventListener('change', updateConsentState);

renderCart();

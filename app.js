/* ==============================================
   RuRuBurger — app.js
   ============================================== */

/* ===== НАСТРОЙКИ ОТПРАВКИ ЗАКАЗА ===== */
// Вставь сюда ссылку из Google Apps Script → Управление развертываниями → Копировать /exec URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyZcktegKKrcMDP2XrMHm0SkKo2el0yEHUDozDtULKGgKTR7KcdQ2QMc6A_lPh-Dj4CXQ/exec';

/* ==============================
   MENU DATA
============================== */
const menuData = {
  burgers: [
    { name:"Двойной Биг Бургер с говядиной", desc:"Большая булочка, двойная котлета, сыр, помидор, малосольный огурец, соус 1000 островов, соус барбекю", price:490 },
    { name:"Двойной Биг Бургер с курицей",   desc:"Большая булочка, двойная котлета, сыр, помидор, малосольный огурец, кетчуп, майонез, сырный соус", price:470 },
    { name:"Биг Бургер с говядиной",          desc:"Большая булочка, одна котлета, сыр, помидор, малосольный огурец, соус 1000 островов, соус барбекю", price:370 },
    { name:"Биг Бургер с курицей",            desc:"Большая булочка, одна котлета, сыр, помидор, малосольный огурец, кетчуп, майонез, сырный соус", price:360 },
    { name:"Двойной Бургер с говядиной",      desc:"Маленькая булочка, двойная котлета, сыр, помидор, малосольный огурец, соус 1000 островов, соус барбекю", price:380 },
    { name:"Двойной Бургер с курицей",        desc:"Маленькая булочка, двойная котлета, сыр, помидор, малосольный огурец, кетчуп, майонез, сырный соус", price:360 },
    { name:"Бургер с говядиной",              desc:"Маленькая булочка, одна котлета, сыр, помидор, малосольный огурец, соус 1000 островов, соус барбекю", price:260 },
    { name:"Бургер с курицей",                desc:"Маленькая булочка, одна котлета, сыр, помидор, малосольный огурец, кетчуп, майонез, сырный соус", price:240 },
    { name:"Чикенбургер",                     desc:"Большая булочка, куриные стрипсы, сыр, помидор, лист салата, кисло-сладкий соус, сырный соус", price:320 },
  ],
  hotdogs: [
    { name:"Хот-Дог говяжий",   desc:"Булочка, говяжья колбаска, сыр, карамелизированный лук, кетчуп, майонез, горчичный соус", price:270 },
    { name:"Хот-Дог куриный",   desc:"Булочка, куриная колбаска, сыр, карамелизированный лук, кетчуп, майонез, горчичный соус", price:250 },
    { name:"Френч-Дог говяжий", desc:"Булочка, говяжья колбаска, кетчуп, майонез, горчичный соус", price:220 },
    { name:"Френч-Дог куриный", desc:"Булочка, куриная колбаска, кетчуп, майонез, горчичный соус", price:190 },
  ],
  snacks: [
    { name:"Картофель Фри",           desc:"Золотистые хрустящие ломтики",           variants:[{label:"150г",price:170},{label:"300г",price:300}] },
    { name:"Картофель по-деревенски", desc:"Кусочки с кожурой, фирменная приправа",  variants:[{label:"150г",price:180},{label:"300г",price:320}] },
    { name:"Наггетсы",                desc:"Сочные куриные наггетсы",                variants:[{label:"3 шт",price:130},{label:"6 шт",price:240},{label:"9 шт",price:330}] },
    { name:"Сырные палочки",          desc:"Хрустящие, тянущийся сыр",              variants:[{label:"3 шт",price:150},{label:"6 шт",price:270},{label:"9 шт",price:360}] },
    { name:"Крылышки",                desc:"Сочные куриные крылышки",               variants:[{label:"3 шт",price:240},{label:"6 шт",price:420},{label:"9 шт",price:560}] },
    { name:"Стрипсы",                 desc:"В хрустящей панировке",                 variants:[{label:"3 шт",price:140},{label:"6 шт",price:250},{label:"9 шт",price:340}] },
    { name:"Креветки в панировке",    desc:"Тигровые креветки в хрустящей корочке", variants:[{label:"3 шт",price:170},{label:"6 шт",price:290},{label:"9 шт",price:380}] },
  ],
  fastfood: [
    { name:"Гирос в лепешке", desc:"Пита, куриное филе, помидор, картошка фри, маринованный лук, красный соус, белый соус", price:380 },
    { name:"Клаб-Сэндвич",    desc:"Тостовый хлеб, куриное филе, яйцо, помидор, салат, бекон, майонез, горчица", price:360 },
    { name:"Тортилья",        desc:"Пшеничная лепёшка, куриное филе, свежие овощи, соус", price:360 },
    { name:"Кесадилья",       desc:"Лепёшка, плавленый сыр, курица, томаты", price:320 },
  ],
  sauces: [
    { name:"Кисло-сладкий соус",  desc:"", variants:[{label:"Маленький",price:40},{label:"Большой",price:50}] },
    { name:"Сырный соус",         desc:"", variants:[{label:"Маленький",price:40},{label:"Большой",price:50}] },
    { name:"Кетчуп",              desc:"", variants:[{label:"Маленький",price:40},{label:"Большой",price:50}] },
    { name:"Соус Барбекю",        desc:"", variants:[{label:"Маленький",price:40},{label:"Большой",price:50}] },
    { name:"Соус 1000 островов",  desc:"", variants:[{label:"Маленький",price:40},{label:"Большой",price:50}] },
    { name:"Красный соус",        desc:"", variants:[{label:"Маленький",price:40},{label:"Большой",price:50}] },
    { name:"Белый соус",          desc:"", variants:[{label:"Маленький",price:40},{label:"Большой",price:50}] },
    { name:"Маринованный лук",    desc:"Добавка к блюду", price:40 },
    { name:"Перец халапеньо",     desc:"Добавка, острый",  price:40 },
    { name:"Дополнительный сыр",  desc:"Добавка",          price:50 },
  ],
  drinks: [
    { name:"Добрый Кола",           desc:"", variants:[{label:"0.33 л",price:120},{label:"0.5 л",price:130}] },
    { name:"Добрый Фанта",          desc:"", variants:[{label:"0.33 л",price:120},{label:"0.5 л",price:130}] },
    { name:"Добрый Спрайт",         desc:"0.33 л", price:120 },
    { name:"Добрый Киви-виноград",  desc:"0.33 л", price:120 },
    { name:"Добрый Манго-маракуйя", desc:"0.5 л",  price:130 },
    { name:"Адреналин",             desc:"Энергетик", variants:[{label:"0.25 л",price:120},{label:"0.5 л",price:160}] },
    { name:"Сок Добрый Яблоко",     desc:"0.3 л", price:100 },
    { name:"Сок Добрый Мультифрукт",desc:"0.3 л", price:100 },
    { name:"Сок Ричи Вишня",        desc:"0.3 л", price:110 },
    { name:"Сок Ричи Апельсин",     desc:"0.3 л", price:110 },
    { name:"Чай Ричи Лимон",        desc:"0.5 л", price:130 },
    { name:"Чай Ричи Персик",       desc:"0.5 л", price:130 },
    { name:"Чай Ричи Зелёный",      desc:"0.5 л", price:130 },
    { name:"Палпи",                 desc:"0.5 л, апельсиновый", price:120 },
    { name:"Вода газированная",     desc:"0.5 л", price:60 },
    { name:"Вода негазированная",   desc:"0.5 л", price:60 },
  ],
  hot: [
    { name:"Чай чёрный",      desc:"Горячий",     price:50 },
    { name:"Кофе",            desc:"Растворимый", price:50 },
    { name:"MacCoffee 3 в 1", desc:"",            price:50 },
  ],
  desserts: [
    { name:"Чизкейк Арахис-карамель", desc:"Нежный сливочный чизкейк с карамелью и арахисом", price:230 },
    { name:"Чизкейк Шоколадный",      desc:"Насыщенный шоколадный чизкейк",                    price:230 },
    { name:"Чизкейк Клубничный",      desc:"Чизкейк с ароматной клубникой",                    price:230 },
  ],
};

/* ==============================
   RENDER CARDS
============================== */
function createCard(item) {
  const card = document.createElement('div');
  card.className = 'menu-card';
  const hasVariants    = item.variants && item.variants.length > 0;
  const defaultPrice   = hasVariants ? item.variants[0].price : item.price;
  const defaultVariant = hasVariants ? item.variants[0].label : '';

  let varHTML = '';
  if (hasVariants) {
    varHTML = '<div class="variants">' +
      item.variants.map((v, i) =>
        `<button class="variant-btn${i === 0 ? ' selected' : ''}" data-price="${v.price}" data-label="${v.label}">` +
        `${v.label} — ${v.price}₽</button>`
      ).join('') + '</div>';
  }

  card.innerHTML = `
    <div class="card-header">
      <span class="card-name">${item.name}</span>
      <span class="card-price">${defaultPrice}₽</span>
    </div>
    ${item.desc ? `<p class="card-desc">${item.desc}</p>` : ''}
    ${varHTML}
    <button class="add-btn" data-name="${item.name}" data-price="${defaultPrice}" data-variant="${defaultVariant}">+ В корзину</button>
  `;

  if (hasVariants) {
    const vBtns   = card.querySelectorAll('.variant-btn');
    const priceEl = card.querySelector('.card-price');
    const addBtn  = card.querySelector('.add-btn');
    vBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        vBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        priceEl.textContent    = btn.dataset.price + '₽';
        addBtn.dataset.price   = btn.dataset.price;
        addBtn.dataset.variant = btn.dataset.label;
      });
    });
  }

  card.querySelector('.add-btn').addEventListener('click', function () {
    addToCart(this.dataset.name, parseInt(this.dataset.price), this.dataset.variant || '');
    const orig = this.textContent;
    this.textContent      = '✓ Добавлено';
    this.style.background = 'rgba(255,204,0,0.22)';
    setTimeout(() => { this.textContent = orig; this.style.background = ''; }, 900);
  });

  return card;
}

function renderGrid(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  items.forEach(item => el.appendChild(createCard(item)));
}

renderGrid('grid-burgers',  menuData.burgers);
renderGrid('grid-hotdogs',  menuData.hotdogs);
renderGrid('grid-snacks',   menuData.snacks);
renderGrid('grid-fastfood', menuData.fastfood);
renderGrid('grid-sauces',   menuData.sauces);
renderGrid('grid-drinks',   menuData.drinks);
renderGrid('grid-hot',      menuData.hot);
renderGrid('grid-desserts', menuData.desserts);

/* ==============================
   TABS
============================== */
const tabs      = document.querySelectorAll('.tab');
const indicator = document.getElementById('tabIndicator');

function moveIndicator(t) {
  indicator.style.cssText =
    `width:${t.offsetWidth}px;height:${t.offsetHeight}px;left:${t.offsetLeft}px;top:${t.offsetTop}px;`;
}

setTimeout(() => {
  const a = document.querySelector('.tab.active');
  if (a) moveIndicator(a);
}, 60);

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    moveIndicator(tab);
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
});

window.addEventListener('resize', () => {
  const a = document.querySelector('.tab.active');
  if (a) moveIndicator(a);
});

/* ==============================
   CART STATE
============================== */
let cart = [];

function addToCart(name, price, variant) {
  const key = name + '|' + variant;
  const ex  = cart.find(i => i.key === key);
  if (ex) { ex.qty++; } else { cart.push({ key, name, price, variant, qty: 1 }); }
  renderCart();
  showToast(`<span class="gold">+1</span> ${name}${variant ? ' (' + variant + ')' : ''}`);
}

function renderCart() {
  const itemsEl    = document.getElementById('cartItems');
  const badgeEl    = document.getElementById('cartBadge');
  const totalEl    = document.getElementById('cartTotal');
  const bottomBar  = document.getElementById('bottomBar');
  const bottomQty  = document.getElementById('bottomQty');
  const bottomTotal= document.getElementById('bottomTotal');

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalSum = cart.reduce((s, i) => s + i.price * i.qty, 0);

  badgeEl.textContent = totalQty;
  badgeEl.classList.toggle('visible', totalQty > 0);
  totalEl.textContent        = totalSum.toLocaleString('ru') + ' ₽';
  bottomQty.textContent      = totalQty;
  bottomTotal.textContent    = totalSum.toLocaleString('ru') + ' ₽';
  bottomBar.classList.toggle('has-items', totalQty > 0);

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        <p>Корзина пуста<br><span style="font-size:12px;color:var(--text-muted)">Добавьте что-нибудь вкусное</span></p>
      </div>`;
    return;
  }

  itemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        ${item.variant ? `<div class="cart-item-variant">${item.variant}</div>` : ''}
      </div>
      <div class="qty-control">
        <button class="qty-btn delete" data-idx="${idx}">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" data-idx="${idx}" data-add="1">+</button>
      </div>
      <span class="cart-item-price">${(item.price * item.qty).toLocaleString('ru')}₽</span>
    </div>
  `).join('');

  itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i     = parseInt(btn.dataset.idx);
      const delta = btn.dataset.add ? 1 : -1;
      cart[i].qty += delta;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      renderCart();
    });
  });
}

/* ==============================
   CART DRAWER — OPEN / CLOSE
============================== */
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer  = document.getElementById('cartDrawer');

function openCart() {
  cartOverlay.classList.add('open');
  cartDrawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('open');
  cartDrawer.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('bottomCartBtn').addEventListener('click', openCart);
cartOverlay.addEventListener('click', closeCart);

/* ==============================
   ORDER MODAL — OPEN / CLOSE
============================== */
const modalOverlay    = document.getElementById('modalOverlay');
const deliveryOptions = document.querySelectorAll('.toggle-option');
const addressField    = document.getElementById('addressField');

// Переключатель доставка / самовывоз
deliveryOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    deliveryOptions.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    addressField.classList.toggle('visible', opt.dataset.value === 'delivery');
  });
});

document.getElementById('btnOrder').addEventListener('click', () => {
  if (cart.length === 0) { showToast('Добавьте товары в корзину'); return; }
  refreshModalPreview();
  modalOverlay.classList.add('open');
  closeCart();
});

function refreshModalPreview() {
  const totalSum = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('modalCartPreview').innerHTML =
    cart.map(i =>
      `${i.name}${i.variant ? ' (' + i.variant + ')' : ''} × ${i.qty} = ${(i.price * i.qty).toLocaleString('ru')}₽`
    ).join('<br>');
  document.getElementById('modalTotalLine').innerHTML =
    `Итого: <span>${totalSum.toLocaleString('ru')} ₽</span>`;
}

function closeModal() { modalOverlay.classList.remove('open'); }
document.getElementById('modalClose').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

/* ==============================
   BUILD ORDER LIST (для Google Script)
============================== */

/**
 * Собирает строку состава заказа для поля order_list.
 */
function buildOrderList() {
  return cart.map(item => {
    const variant = item.variant ? ` (${item.variant})` : '';
    return `${item.qty}х ${item.name}${variant} — ${item.price} ₽`;
  }).join('\n');
}

/* ==============================
   SUBMIT ORDER — GOOGLE APPS SCRIPT
============================== */

/**
 * Клик «Отправить заказ»:
 * 1. Валидирует форму
 * 2. Собирает данные корзины и формы в объект
 * 3. Шлёт POST на Google Apps Script (серверы Google, США)
 * 4. Google Script пересылает в Telegram — никаких блокировок
 */
document.getElementById('btnSendOrder').addEventListener('click', async () => {
  const nameInput    = document.getElementById('inputName');
  const phoneInput   = document.getElementById('inputPhone');
  const addressInput = document.getElementById('inputAddress');
  const activeOption = document.querySelector('.toggle-option.active');
  const deliveryType = activeOption ? activeOption.dataset.value : 'pickup';
  const sendBtn      = document.getElementById('btnSendOrder');

  // Валидация
  const name  = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const addr  = addressInput ? addressInput.value.trim() : '';

  if (!name)            { nameInput.focus();  showToast('Введите ваше имя');        return; }
  if (phone.length < 7) { phoneInput.focus(); showToast('Введите телефон');         return; }
  if (deliveryType === 'delivery' && !addr) {
    addressInput.focus();
    showToast('Введите адрес доставки');
    return;
  }

  // При самовывозе подставляем адрес заведения
  const addressLine = deliveryType === 'delivery'
    ? addr
    : 'ст. Отрадная, ул. Ленина, 15Б (самовывоз)';

  const totalSum = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Объект данных — точно под формат Google Script от Gemini
  const orderData = {
    name:       name,
    phone:      phone,
    address:    addressLine,
    comment:    deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз',
    order_list: buildOrderList() + '\n\n💰 ИТОГО: ' + totalSum.toLocaleString('ru') + ' ₽',
  };

  // Блокируем кнопку на время запроса
  sendBtn.disabled    = true;
  sendBtn.textContent = '⏳ Отправляем...';

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body:   JSON.stringify(orderData),
      // Намеренно без Content-Type — Google Apps Script не любит preflight CORS
    });

    const result = await response.json();

    if (result.status === 'success') {
      // Очищаем корзину и форму
      cart = [];
      renderCart();
      closeModal();

      nameInput.value  = '';
      phoneInput.value = '';
      if (addressInput) addressInput.value = '';

      showSuccessBanner();
    } else {
      throw new Error(result.message || 'Неизвестная ошибка');
    }

  } catch (err) {
    console.error('Ошибка отправки заказа:', err);
    showToast('Ошибка отправки. Позвоните нам: 8 918 162 31 45');
  } finally {
    sendBtn.disabled    = false;
    sendBtn.textContent = '✈️ Отправить заказ';
  }
});

/* ==============================
   iOS-STYLE SUCCESS BANNER
============================== */
function showSuccessBanner() {
  const banner = document.getElementById('successBanner');
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 4000);
}

/* ==============================
   TOAST NOTIFICATION
============================== */
function showToast(msg) {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 2100);
}

/* ==============================
   INIT
============================== */
renderCart();

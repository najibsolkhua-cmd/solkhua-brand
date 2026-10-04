/* ==========================================================
   SOLKHUA — логика сайта: шапка, корзина, анимации, страницы.
   ========================================================== */
(() => {
  const CFG = window.SOLKHUA_CONFIG;
  const PRODUCTS = window.SOLKHUA_PRODUCTS;
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const page = document.body.dataset.page || "";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => n.toLocaleString("ru-RU") + " " + CFG.currency;
  const img = (id, kind = "product") => (kind === "product" ? `assets/img/product-${id}.webp` : `assets/img/${kind}-${id}.jpg`);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- storage (safe) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  /* ---------- icons ---------- */
  const ico = {
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M3 8h18M3 16h18"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  /* ---------- layout ---------- */
  const navItems = [
    ["catalog.html", "Каталог", "catalog"],
    ["about.html", "О бренде", "about"],
    ["charity.html", "Помощь котам", "charity"],
    ["info.html", "Доставка", "info"]
  ];
  function layout() {
    const nav = navItems.map(([h, t, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`).join("");
    document.body.insertAdjacentHTML("afterbegin", `
      <a class="sr" href="#main">Перейти к содержанию</a>
      <div class="announce">${CFG.charityPercent}% с каждой свечи мы передаём <b>бездомным котам и кошкам</b></div>
      <header class="header" id="header">
        <div class="wrap header-in">
          <button class="icon-btn burger" id="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu">${ico.menu}</button>
          <nav class="nav" aria-label="Основное меню">${nav}</nav>
          <a class="logo" href="index.html" aria-label="SOLKHUA — на главную">SOLKHUA</a>
          <div class="header-tools">
            <button class="icon-btn" id="cart-btn" type="button" aria-label="Открыть корзину" aria-controls="drawer">${ico.bag}<span class="cart-count" id="cart-count" data-empty="true">0</span></button>
          </div>
        </div>
      </header>
      <div class="menu" id="menu" aria-hidden="true">
        <button class="icon-btn menu-close" id="menu-close" type="button" aria-label="Закрыть меню">${ico.close}</button>
        <a href="index.html">Главная</a>${navItems.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}
        <div class="menu-foot"><span>${CFG.city}</span><span>${esc(CFG.email)}</span></div>
      </div>`);
    document.body.insertAdjacentHTML("beforeend", `
      <footer class="footer">
        <div class="wrap">
          <div class="foot-grid">
            <div>
              <h4>Письма из Петербурга</h4>
              <p class="muted" style="max-width:36ch">Новые ароматы, коты месяца и отчёты о помощи. Раз в месяц, без спама.</p>
              <form class="sub" id="sub" novalidate>
                <label class="sr" for="sub-email">E-mail</label>
                <input id="sub-email" type="email" placeholder="Ваш e-mail" autocomplete="email" required>
                <button class="btn" type="submit">Подписаться</button>
              </form>
            </div>
            <div><h4>Магазин</h4><ul><li><a href="catalog.html">Все свечи</a></li>${PRODUCTS.slice(0, 3).map(p => `<li><a href="product.html?id=${p.id}">${p.name}</a></li>`).join("")}</ul></div>
            <div><h4>SOLKHUA</h4><ul><li><a href="about.html">О бренде</a></li><li><a href="charity.html">Помощь котам</a></li><li><a href="info.html#faq">Вопросы и ответы</a></li></ul></div>
            <div><h4>Связаться</h4><ul>
              <li><a href="https://t.me/${CFG.telegram}" target="_blank" rel="noopener">Telegram</a></li>
              <li><a href="https://instagram.com/${CFG.instagram}" target="_blank" rel="noopener">Instagram</a></li>
              <li><a href="info.html#contacts">${esc(CFG.email)}</a></li>
            </ul></div>
          </div>
          <div class="wordmark" aria-hidden="true">SOLKHUA</div>
          <div class="legal"><span>© ${new Date().getFullYear()} SOLKHUA · ${CFG.city}</span><span class="credit">Фото города и котов: <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a></span><a href="info.html">Доставка и оплата</a></div>
        </div>
      </footer>
      <div class="overlay" id="overlay"></div>
      <aside class="drawer" id="drawer" aria-label="Корзина" aria-hidden="true">
        <div class="drawer-head"><h2>Корзина</h2><button class="icon-btn" id="drawer-close" type="button" aria-label="Закрыть корзину">${ico.close}</button></div>
        <div class="drawer-body" id="drawer-body"></div>
        <div class="drawer-foot" id="drawer-foot"></div>
      </aside>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
      <div class="curtain" id="curtain"></div>`);
  }

  /* ---------- cart ---------- */
  let cart = store.get("solkhua-cart", []).filter(l => byId[l.id] && l.qty > 0);
  const save = () => { store.set("solkhua-cart", cart); renderCart(); document.dispatchEvent(new Event("cart")); };
  const count = () => cart.reduce((s, l) => s + l.qty, 0);
  const subtotal = () => cart.reduce((s, l) => s + l.qty * byId[l.id].price, 0);
  function add(id, qty = 1) {
    const l = cart.find(x => x.id === id);
    l ? (l.qty += qty) : cart.push({ id, qty });
    save();
    const c = $("#cart-count"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
    toast(`«${byId[id].name}» в корзине`, img(id, "label"), "Открыть", openDrawer);
  }
  function setQty(id, qty) {
    if (qty <= 0) cart = cart.filter(l => l.id !== id);
    else cart.find(l => l.id === id).qty = Math.min(qty, 99);
    save();
  }
  function renderCart() {
    const c = $("#cart-count"); if (!c) return;
    c.textContent = count(); c.dataset.empty = count() === 0;
    const body = $("#drawer-body"), foot = $("#drawer-foot");
    if (!cart.length) {
      body.innerHTML = `<div class="empty"><img src="${img("lemongrass", "label")}" alt=""><p>В корзине пока пусто.<br>Котики ждут в каталоге.</p><a class="btn light" href="catalog.html">В каталог</a></div>`;
      foot.hidden = true; return;
    }
    foot.hidden = false;
    body.innerHTML = cart.map(l => { const p = byId[l.id]; return `
      <div class="line">
        <a href="product.html?id=${p.id}"><img src="${img(p.id)}" alt="${esc(p.name)}"></a>
        <div><a class="line-name" href="product.html?id=${p.id}">${esc(p.name)}</a>
          <div class="line-tools">
            <div class="qty"><button type="button" data-dec="${p.id}" aria-label="Меньше">−</button><span>${l.qty}</span><button type="button" data-inc="${p.id}" aria-label="Больше">+</button></div>
            <button class="remove" type="button" data-rm="${p.id}">Удалить</button>
          </div></div>
        <span class="price">${money(p.price * l.qty)}</span>
      </div>`; }).join("");
    const left = CFG.freeShippingFrom - subtotal();
    const pct = Math.min(100, subtotal() / CFG.freeShippingFrom * 100);
    foot.innerHTML = `
      <div class="ship-bar">${left > 0 ? `До бесплатной доставки осталось ${money(left)}` : "Доставка для вас бесплатна"}<i style="--w:${pct}%"></i></div>
      <div class="total-row"><span>Итого</span><b>${money(subtotal())}</b></div>
      <div class="charity-note"><b>${CFG.charityPercent}%</b><span>из этой суммы, ${money(Math.round(subtotal() * CFG.charityPercent / 100))}, получат бездомные коты и кошки</span></div>
      <a class="btn block" href="checkout.html">Оформить заказ</a>`;
  }
  function openDrawer() {
    $("#drawer").classList.add("open"); $("#overlay").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    setTimeout(() => $("#drawer-close").focus(), 50);
  }
  function closeDrawer() {
    $("#drawer").classList.remove("open"); $("#overlay").classList.remove("open");
    $("#drawer").setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
  }

  /* ---------- toast ---------- */
  let tt;
  function toast(text, pic, action, fn) {
    const t = $("#toast");
    t.innerHTML = `${pic ? `<img src="${pic}" alt="">` : ""}<span>${esc(text)}</span>${action ? `<button type="button">${action}</button>` : ""}`;
    if (action) t.querySelector("button").onclick = () => { t.classList.remove("show"); fn(); };
    t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 3200);
  }

  /* ---------- global events ---------- */
  function events() {
    $("#cart-btn").onclick = openDrawer;
    $("#drawer-close").onclick = closeDrawer;
    $("#overlay").onclick = closeDrawer;
    $("#drawer").addEventListener("click", e => {
      const t = e.target.closest("button"); if (!t) return;
      if (t.dataset.inc) setQty(t.dataset.inc, cart.find(l => l.id === t.dataset.inc).qty + 1);
      if (t.dataset.dec) setQty(t.dataset.dec, cart.find(l => l.id === t.dataset.dec).qty - 1);
      if (t.dataset.rm) setQty(t.dataset.rm, 0);
    });
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-add]");
      if (b) { e.preventDefault(); add(b.dataset.add, +(b.dataset.qty || 1)); }
    });
    const menu = $("#menu"), burger = $("#burger");
    const setMenu = open => {
      menu.classList.toggle("open", open); menu.setAttribute("aria-hidden", !open);
      burger.setAttribute("aria-expanded", open); document.body.style.overflow = open ? "hidden" : "";
      if (open) setTimeout(() => $("#menu-close").focus(), 100);
    };
    burger.onclick = () => setMenu(true);
    $("#menu-close").onclick = () => setMenu(false);
    document.addEventListener("keydown", e => { if (e.key === "Escape") { closeDrawer(); setMenu(false); } });
    $("#sub").addEventListener("submit", e => {
      e.preventDefault();
      const i = $("#sub-email");
      if (!/^\S+@\S+\.\S+$/.test(i.value)) { toast("Проверьте e-mail: в нём должна быть @ и домен"); i.focus(); return; }
      e.target.reset(); toast("Спасибо! Первое письмо придёт в начале месяца");
    });
    const header = $("#header");
    const onScroll = () => header.classList.toggle("scrolled", scrollY > 10);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* ---------- page transitions fallback (when no cross-document View Transitions) ---------- */
  function transitions() {
    if ("onpagereveal" in window) return;
    const curtain = $("#curtain");
    document.addEventListener("click", e => {
      const a = e.target.closest("a[href]");
      if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || !/\.html$|\/$/.test(url.pathname)) return;
      e.preventDefault(); curtain.classList.add("on");
      setTimeout(() => { location.href = a.href; }, 320);
    });
    addEventListener("pageshow", () => curtain.classList.remove("on"));
  }

  /* ---------- reveal + split text ---------- */
  function animations() {
    $$("[data-split]").forEach(el => {
      const walk = node => [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/([ \t\n\r]+)/).forEach(w => {
            if (!w) return;
            if (/^[ \t\n\r]+$/.test(w)) { frag.append(" "); return; }
            const s = document.createElement("span"); s.className = "w";
            const i = document.createElement("span"); i.textContent = w; s.append(i); frag.append(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
      walk(el); el.classList.add("split");
      $$(".w>span", el).forEach((s, i) => (s.style.transitionDelay = i * 0.06 + "s"));
    });
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    $$(".reveal,.reveal-img,[data-split]").forEach(el => io.observe(el));
    requestAnimationFrame(() => document.documentElement.classList.add("loaded"));
  }

  /* ---------- shared product card ---------- */
  function card(p, i = 0) {
    return `
      <article class="card reveal d${i % 3 + 1}">
        <div class="card-visual">
          <a class="card-media" href="product.html?id=${p.id}" data-vt aria-label="${esc(p.name)}">
            ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ""}
            <img class="main" src="${img(p.id)}" alt="Свеча ${esc(p.name)} в вакуумной упаковке" loading="lazy" width="1400" height="1400">
          </a>
          <button class="card-quick" type="button" data-add="${p.id}">В корзину · ${money(p.price)}</button>
        </div>
        <div class="card-row"><a class="card-title" href="product.html?id=${p.id}">${esc(p.name)}</a><span class="price">${money(p.price)}</span></div>
        <p class="card-meta">${esc(p.mood)} · ${p.notes.join(", ")}</p>
      </article>`;
  }
  // shared-element transition: the clicked image morphs into the product page photo
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-vt]");
    if (a) { const im = a.querySelector(".main"); if (im) im.style.viewTransitionName = "product-hero"; }
  });
  addEventListener("pageshow", () => $$(".card-media .main").forEach(i => (i.style.viewTransitionName = "")));

  /* ---------- pages ---------- */
  const pages = {
    home() {
      hero();
      $("#grid").innerHTML = PRODUCTS.map(card).join("");
      $("#cats").innerHTML = PRODUCTS.map((p, i) => `
        <a class="cat reveal d${i % 3 + 1}" href="product.html?id=${p.id}">
          <div class="cat-wrap"><div class="cat-img" data-spin="${i % 2 ? -1 : 1}"><img src="${img(p.id, "label")}" alt="Этикетка «${esc(p.name)}»" loading="lazy"></div></div>
          <b>${esc(p.name)}</b><span>${esc(p.author)}</span>
        </a>`).join("");
      spin();
      quotes();
      counter();
      story();
    },
    catalog() {
      const grid = $("#grid");
      let mood = "all", sort = "default";
      const groups = { all: () => true, fresh: p => ["bergamot", "evkalipt", "lemongrass"].includes(p.id), warm: p => ["palo-santo", "tabak-bergamot", "apelsin-koritsa"].includes(p.id) };
      const draw = () => {
        let list = PRODUCTS.filter(groups[mood]);
        if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "ru"));
        if (sort === "price") list = [...list].sort((a, b) => a.price - b.price);
        grid.innerHTML = list.map(card).join("");
        $$(".card", grid).forEach((c, i) => setTimeout(() => c.classList.add("in"), 60 * i));
        $("#count").textContent = `${list.length} ${list.length === 1 ? "свеча" : list.length < 5 ? "свечи" : "свечей"}`;
      };
      $$(".chip").forEach(ch => ch.onclick = () => { mood = ch.dataset.mood; $$(".chip").forEach(c => c.setAttribute("aria-pressed", c === ch)); draw(); });
      $("#sort").onchange = e => { sort = e.target.value; draw(); };
      draw();
    },
    product() {
      const id = new URLSearchParams(location.search).get("id");
      const p = byId[id] || PRODUCTS[0];
      document.title = `${p.name} — SOLKHUA`;
      const shots = [img(p.id), img(p.id, "label")];
      if (p.id === "apelsin-koritsa") shots.push("assets/img/lit-apelsin.webp");
      let qty = 1;
      $("#pdp").innerHTML = `
        <div class="gallery">
          <div class="thumbs" role="tablist" aria-label="Фото товара">${shots.map((s, i) => `<button class="thumb" type="button" data-i="${i}" aria-current="${i === 0}" aria-label="Фото ${i + 1}"><img src="${s}" alt="" loading="lazy"></button>`).join("")}</div>
          <div class="main-img" id="main-img"><img src="${shots[0]}" alt="Свеча ${esc(p.name)}" style="view-transition-name:product-hero" width="1400" height="1400"></div>
        </div>
        <div class="pdp-info">
          <nav class="crumbs" aria-label="Навигация"><a href="index.html">Главная</a><span>/</span><a href="catalog.html">Каталог</a><span>/</span><span>${esc(p.name)}</span></nav>
          <div><span class="eyebrow">${esc(p.mood)}</span><h1 style="margin-top:10px">${esc(p.name)}</h1></div>
          <div class="pdp-price">${money(p.price)}</div>
          <p class="lead">${esc(p.text)}</p>
          <ul class="notes" aria-label="Ноты">${p.notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>
          <div class="buy">
            <div class="qty"><button type="button" id="q-dec" aria-label="Меньше">−</button><output id="q-val" aria-live="polite">1</output><button type="button" id="q-inc" aria-label="Больше">+</button></div>
            <button class="btn" type="button" id="buy">В корзину · ${money(p.price)}</button>
          </div>
          <div class="charity-note"><b>${CFG.charityPercent}%</b><span>с этой свечи получат бездомные коты и кошки</span></div>
          <div class="label-quote">
            <img src="${img(p.id, "label")}" alt="" loading="lazy">
            <div><q>${esc(p.quote)}</q><small>${esc(p.author)} · на крышке</small></div>
          </div>
          <div class="acc">
            <details open><summary>Характеристики</summary><div class="acc-body"><dl class="spec-table">
              <dt>Воск</dt><dd>100% кокосовый</dd><dt>Объём</dt><dd>60 мл</dd><dt>Банка</dt><dd>Алюминий, крышка на резьбе</dd><dt>Упаковка</dt><dd>Вакуумная прозрачная плёнка</dd><dt>Аромат</dt><dd>${p.notes.join(", ")}</dd></dl></div></details>
            <details><summary>Кот на этикетке</summary><div class="acc-body"><p>${esc(p.cat)}</p><p>Каждая крышка — портрет петербургского кота с характером и цитата великой женщины.</p></div></details>
            <details><summary>Как зажигать</summary><div class="acc-body"><p>В первый раз дайте свече гореть, пока весь верхний слой воска не станет жидким, обычно 1–2 часа. Так она будет прогорать ровно.</p><p>Перед каждым зажиганием подрезайте фитиль до 5 мм. Не оставляйте горящую свечу без присмотра и держите её подальше от котов, детей и сквозняков.</p></div></details>
            <details><summary>Доставка и оплата</summary><div class="acc-body"><p>СДЭК и Почтой России по всей стране, курьером по Петербургу. При заказе от ${money(CFG.freeShippingFrom)} доставка бесплатна.</p><p><a class="link" href="info.html">Подробнее</a></p></div></details>
          </div>
        </div>`;
      const main = $("#main-img img");
      $$(".thumb").forEach(t => t.onclick = () => {
        $$(".thumb").forEach(x => x.setAttribute("aria-current", x === t));
        main.style.opacity = 0;
        setTimeout(() => { main.src = shots[+t.dataset.i]; main.onload = () => (main.style.opacity = 1); }, 200);
      });
      const mi = $("#main-img");
      mi.onclick = () => mi.classList.toggle("zoom");
      mi.onmousemove = e => { if (!mi.classList.contains("zoom")) return; const r = mi.getBoundingClientRect(); main.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; };
      const upd = () => { $("#q-val").textContent = qty; $("#buy").textContent = `В корзину · ${money(p.price * qty)}`; };
      $("#q-dec").onclick = () => { qty = Math.max(1, qty - 1); upd(); };
      $("#q-inc").onclick = () => { qty = Math.min(99, qty + 1); upd(); };
      $("#buy").onclick = () => { add(p.id, qty); qty = 1; upd(); };
      $("#related").innerHTML = PRODUCTS.filter(x => x.id !== p.id).slice(0, 3).map(card).join("");
    },
    checkout() { checkout(); },
    info() {
      $("#ship-table").innerHTML = CFG.shipping.map(s => `<div><span>${s.name}</span><span class="muted">${s.eta}</span><b>${s.price ? money(s.price) : "бесплатно"}</b></div>`).join("");
      $$("[data-cfg]").forEach(el => (el.textContent = CFG[el.dataset.cfg]));
      $$("[data-free]").forEach(el => (el.textContent = money(CFG.freeShippingFrom)));
      $$("[data-copy]").forEach(b => b.onclick = async () => {
        const v = CFG[b.dataset.copy];
        try { await navigator.clipboard.writeText(v); toast("Скопировано: " + v); } catch { toast(v); }
      });
      $("#tg-link").href = `https://t.me/${CFG.telegram}`;
      $("#ig-link").href = `https://instagram.com/${CFG.instagram}`;
    },
    charity() { $$("[data-cfg]").forEach(el => (el.textContent = CFG[el.dataset.cfg])); },
    about() {}
  };

  /* ---------- home: hero scent switcher ---------- */
  function hero() {
    const root = $("#hero"); if (!root) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DUR = 6000;
    const panel = $("#hero-panel"), picker = $("#picker");
    const preload = () => PRODUCTS.forEach(p => { const i = new Image(); i.src = img(p.id); });
    "requestIdleCallback" in window ? requestIdleCallback(preload) : setTimeout(preload, 1500);
    picker.innerHTML = PRODUCTS.map((p, i) => `
      <button class="pick" type="button" data-i="${i}" aria-pressed="${i === 0}" aria-label="${esc(p.name)}" style="--dur:${DUR}ms">
        <img src="${img(p.id, "label")}" alt=""><svg viewBox="0 0 62 62"><circle cx="31" cy="31" r="29"/></svg>
      </button>`).join("");
    let cur = 0, timer, auto = !reduce;
    const fill = p => {
      panel.innerHTML = `
        <span class="eyebrow">${esc(p.mood)}</span>
        <div class="hero-name">${esc(p.name)}</div>
        <ul class="hero-notes">${p.notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>
        <q class="hero-quote">${esc(p.quote)}</q><span class="hero-cite">${esc(p.author)} · на крышке</span>
        <div class="hero-buy"><span class="price">${money(p.price)}</span><button class="btn" type="button" data-add="${p.id}">В корзину</button></div>
        <a class="link" href="product.html?id=${p.id}" style="align-self:flex-start">Подробнее о свече</a>`;
    };
    const show = (i, user) => {
      if (user) { auto = false; clearTimeout(timer); }
      const p = PRODUCTS[i]; cur = i;
      $$(".pick", picker).forEach((b, k) => { b.setAttribute("aria-pressed", k === i); b.classList.remove("run"); });
      const active = $$(".pick", picker)[i];
      if (auto) { void active.offsetWidth; active.classList.add("run"); }
      // crossfade: the new candle fades in on top of the old one, so the label never disappears
      const tilt = $("#hero-tilt"), old = $$(".hero-candle", tilt).pop();
      const next = old.cloneNode();
      next.removeAttribute("id"); next.src = img(p.id); next.alt = `Свеча ${p.name}`; next.classList.add("enter");
      tilt.append(next);
      panel.classList.add("fade");
      setTimeout(() => { fill(p); panel.classList.remove("fade"); }, reduce ? 0 : 320);
      const reveal = () => requestAnimationFrame(() => requestAnimationFrame(() => {
        next.classList.remove("enter");
        setTimeout(() => $$(".hero-candle", tilt).slice(0, -1).forEach(el => el.remove()), reduce ? 0 : 850);
      }));
      (next.decode ? next.decode() : Promise.resolve()).then(reveal, reveal);
      if (auto) timer = setTimeout(() => show((cur + 1) % PRODUCTS.length), DUR);
    };
    picker.addEventListener("click", e => { const b = e.target.closest(".pick"); if (b) show(+b.dataset.i, true); });
    root.addEventListener("pointerenter", () => { if (auto) { clearTimeout(timer); $$(".pick.run", picker).forEach(b => b.classList.remove("run")); } });
    root.addEventListener("pointerleave", () => { if (auto) { clearTimeout(timer); timer = setTimeout(() => show((cur + 1) % PRODUCTS.length), 2500); } });
    // gentle 3D tilt toward the pointer
    const tilt = $("#hero-tilt");
    if (!reduce && matchMedia("(hover:hover)").matches) {
      root.addEventListener("pointermove", e => {
        const r = root.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        tilt.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translate3d(${x * 16}px,${y * 10}px,0)`;
      });
      root.addEventListener("pointerleave", () => (tilt.style.transform = ""));
    }
    fill(PRODUCTS[0]);
    if (auto) { $$(".pick", picker)[0].classList.add("run"); timer = setTimeout(() => show(1), DUR); }
  }

  /* ---------- home: labels spin like records while scrolling ---------- */
  function spin() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = $$("[data-spin]");
    const go = () => els.forEach(el => { const r = el.getBoundingClientRect(); el.style.transform = `rotate(${(r.top - innerHeight / 2) * 0.12 * el.dataset.spin}deg)`; });
    addEventListener("scroll", () => requestAnimationFrame(go), { passive: true }); go();
  }

  /* ---------- home: rotating quotes from the lids ---------- */
  function quotes() {
    const box = $("#quotes"); if (!box) return;
    box.innerHTML = PRODUCTS.map((p, i) => `<figure class="q${i === 0 ? " on" : ""}" style="margin:0"><blockquote>${esc(p.quote)}</blockquote><cite><img src="${img(p.id, "label")}" alt="">${esc(p.author)} · ${esc(p.name)}</cite></figure>`).join("");
    const dots = $("#q-dots");
    dots.innerHTML = PRODUCTS.map((p, i) => `<button type="button" aria-label="Цитата ${i + 1}" aria-pressed="${i === 0}"></button>`).join("");
    let i = 0, t;
    const go = n => { i = n; $$(".q", box).forEach((q, k) => q.classList.toggle("on", k === i)); $$("button", dots).forEach((d, k) => d.setAttribute("aria-pressed", k === i)); clearTimeout(t); t = setTimeout(() => go((i + 1) % PRODUCTS.length), 5500); };
    dots.addEventListener("click", e => { const b = e.target.closest("button"); if (b) go([...dots.children].indexOf(b)); });
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) t = setTimeout(() => go(1), 5500);
  }

  /* ---------- home: 0 → 10% counter ---------- */
  function counter() {
    $$("[data-count]").forEach(el => {
      const to = +el.dataset.count;
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        const t0 = performance.now();
        const step = t => { const k = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + "%"; if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }, { threshold: .5 });
      io.observe(el);
    });
  }

  /* ---------- scroll story: frames now, scrubbed video when assets/video/unboxing.mp4 exists ---------- */
  function story() {
    const track = $("#story-track"); if (!track) return;
    const frames = $$(".frame", track), steps = $$(".step", track), dots = $$(".story-dots i", track);
    const n = steps.length; let cur = -1, video = null;
    const v = document.createElement("video");
    Object.assign(v, { muted: true, playsInline: true, preload: "auto" });
    if (!CFG.unboxingVideo) { addEventListener("scroll", () => requestAnimationFrame(tick), { passive: true }); addEventListener("resize", tick); tick(); return; }
    v.src = CFG.unboxingVideo;
    v.addEventListener("loadedmetadata", () => { video = v; $("#stage").prepend(v); frames.forEach(f => (f.style.display = "none")); tick(); });
    function tick() {
      const r = track.getBoundingClientRect(), total = r.height - innerHeight;
      const p = Math.min(Math.max(-r.top / total, 0), 0.9999);
      const i = Math.floor(p * n);
      dots.forEach((d, k) => d.style.setProperty("--p", Math.min(Math.max(p * n - k, 0), 1)));
      if (video && video.duration) video.currentTime = p * video.duration;
      if (i === cur) return; cur = i;
      frames.forEach((f, k) => f.classList.toggle("on", k === i));
      steps.forEach((s, k) => s.classList.toggle("on", k === i));
    }
    addEventListener("scroll", () => requestAnimationFrame(tick), { passive: true });
    addEventListener("resize", tick); tick();
  }

  /* ---------- checkout ---------- */
  function checkout() {
    const root = $("#checkout");
    const lines = () => cart.map(l => ({ ...byId[l.id], qty: l.qty }));
    if (!cart.length) {
      root.innerHTML = `<div class="done" style="grid-column:1/-1"><img src="${img("palo-santo", "label")}" alt="" style="width:160px;border-radius:50%"><h1>Корзина пуста</h1><p class="lead">Выберите свечу, и котики вернутся сюда вместе с ней.</p><a class="btn" href="catalog.html">В каталог</a></div>`;
      return;
    }
    root.innerHTML = `
      <form class="form" id="order" novalidate>
        <fieldset class="fieldset"><legend>Контакты</legend>
          <div class="row2">
            <div class="field"><label for="f-name">Имя и фамилия</label><input id="f-name" name="name" autocomplete="name" required><span class="err">Напишите, как к вам обращаться</span></div>
            <div class="field"><label for="f-phone">Телефон</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+7 (___) ___-__-__" required><span class="err">Нужен номер из 11 цифр</span></div>
          </div>
          <div class="field"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" autocomplete="email" required><span class="err">Проверьте e-mail: нужна @ и домен</span></div>
        </fieldset>
        <fieldset class="fieldset"><legend>Доставка</legend>
          <div class="radios">${CFG.shipping.map((s, i) => `
            <label class="radio"><input type="radio" name="ship" value="${s.id}"${i === 0 ? " checked" : ""}><span>${s.name}<small>${s.eta}</small></span><span class="price">${s.price ? money(s.price) : "бесплатно"}</span></label>`).join("")}</div>
          <div class="row2">
            <div class="field"><label for="f-city">Город</label><input id="f-city" name="city" autocomplete="address-level2" value="${CFG.city}" required><span class="err">Укажите город</span></div>
            <div class="field"><label for="f-zip">Индекс</label><input id="f-zip" name="zip" autocomplete="postal-code" inputmode="numeric"></div>
          </div>
          <div class="field" id="addr-field"><label for="f-addr">Адрес или пункт выдачи</label><input id="f-addr" name="address" autocomplete="street-address" required><span class="err">Укажите адрес или пункт выдачи</span></div>
          <div class="field"><label for="f-comment">Комментарий к заказу</label><textarea id="f-comment" name="comment" placeholder="Например, подарочная открытка или удобное время доставки"></textarea></div>
        </fieldset>
        <fieldset class="fieldset"><legend>Оплата</legend>
          <div class="radios">
            <label class="radio"><input type="radio" name="pay" value="link" checked><span>Ссылка на оплату картой или СБП<small>Пришлём после подтверждения заказа</small></span><span></span></label>
            <label class="radio"><input type="radio" name="pay" value="cash"><span>При получении<small>Курьер по Петербургу и самовывоз</small></span><span></span></label>
          </div>
        </fieldset>
        <button class="btn block" type="submit" id="place">Подтвердить заказ</button>
        <p class="muted" style="font-size:var(--s--1)">Нажимая кнопку, вы соглашаетесь на обработку персональных данных для доставки заказа.</p>
      </form>
      <aside class="summary" id="summary"></aside>`;
    const form = $("#order");
    const ship = () => CFG.shipping.find(s => s.id === form.ship.value);
    const shipCost = () => (subtotal() >= CFG.freeShippingFrom ? 0 : ship().price);
    const drawSum = () => {
      $("#summary").innerHTML = `
        <h2>Ваш заказ</h2>
        <div class="sum-lines">${lines().map(l => `<div class="sum-line"><img src="${img(l.id)}" alt=""><span><b>${esc(l.name)}</b>${l.qty} шт.</span><span class="price">${money(l.price * l.qty)}</span></div>`).join("")}</div>
        <div class="sum-row"><span>Товары</span><span class="price">${money(subtotal())}</span></div>
        <div class="sum-row"><span>Доставка</span><span class="price">${shipCost() ? money(shipCost()) : "бесплатно"}</span></div>
        <div class="sum-row total"><span>Итого</span><b>${money(subtotal() + shipCost())}</b></div>
        <div class="charity-note"><b>${CFG.charityPercent}%</b><span>${money(Math.round(subtotal() * CFG.charityPercent / 100))} получат бездомные коты и кошки</span></div>`;
    };
    form.addEventListener("change", e => {
      if (e.target.name === "ship") $("#addr-field").hidden = form.ship.value === "pickup";
      drawSum();
    });
    const phone = $("#f-phone");
    phone.addEventListener("input", () => {
      let d = phone.value.replace(/\D/g, ""); if (d.startsWith("8")) d = "7" + d.slice(1); if (d && !d.startsWith("7")) d = "7" + d; d = d.slice(0, 11);
      const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
      phone.value = d ? `+7${p[0] ? " (" + p[0] : ""}${p[0].length === 3 ? ") " : ""}${p[1]}${p[2] ? "-" + p[2] : ""}${p[3] ? "-" + p[3] : ""}` : "";
    });
    const rules = {
      name: v => v.trim().length > 1,
      phone: v => v.replace(/\D/g, "").length === 11,
      email: v => /^\S+@\S+\.\S+$/.test(v),
      city: v => v.trim().length > 1,
      address: v => form.ship.value === "pickup" || v.trim().length > 3
    };
    const check = el => { const ok = rules[el.name] ? rules[el.name](el.value) : true; el.closest(".field").classList.toggle("invalid", !ok); return ok; };
    $$("input", form).forEach(el => el.addEventListener("blur", () => rules[el.name] && check(el)));
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const bad = Object.keys(rules).map(k => form[k]).filter(el => !check(el));
      if (bad.length) { bad[0].focus(); toast("Заполните отмеченные поля"); return; }
      const no = "SK-" + Date.now().toString(36).toUpperCase().slice(-6);
      const order = {
        number: no, date: new Date().toLocaleString("ru-RU"),
        name: form.name.value, phone: form.phone.value, email: form.email.value,
        city: form.city.value, zip: form.zip.value, address: form.address.value,
        shipping: ship().name, payment: form.pay.value === "link" ? "Ссылка на оплату" : "При получении",
        comment: form.comment.value,
        items: lines().map(l => `${l.name} × ${l.qty} = ${l.price * l.qty} ₽`).join("; "),
        total: subtotal() + shipCost()
      };
      const btn = $("#place"); btn.disabled = true; btn.textContent = "Отправляем…";
      let sent = false;
      if (CFG.orderEndpoint) {
        try {
          const r = await fetch(CFG.orderEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(order) });
          sent = r.ok;
        } catch {}
        if (!sent) { btn.disabled = false; btn.textContent = "Подтвердить заказ"; toast("Не получилось отправить заказ. Проверьте интернет и попробуйте ещё раз"); return; }
      }
      const text = `Заказ ${no}\n${order.items}\nИтого: ${order.total} ₽\n${order.name}, ${order.phone}, ${order.email}\n${order.shipping}: ${order.city}, ${order.address}\nОплата: ${order.payment}${order.comment ? "\nКомментарий: " + order.comment : ""}`;
      store.set("solkhua-last-order", order);
      cart = []; save();
      root.innerHTML = `
        <div class="done" style="grid-column:1/-1">
          <div class="done-check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
          <span class="eyebrow">Заказ ${no}</span>
          <h1>Спасибо, ${esc(order.name.split(" ")[0])}!</h1>
          <p class="lead" style="margin-inline:auto">${sent ? "Мы получили заказ и скоро свяжемся с вами, чтобы подтвердить доставку и прислать ссылку на оплату." : "Чтобы мы получили заказ, отправьте его нам в Telegram: скопируйте текст и вставьте в чат."}</p>
          ${sent ? "" : `<div class="hero-actions" style="justify-content:center"><button class="btn" type="button" id="copy-order">Скопировать заказ</button><a class="btn light" href="https://t.me/${CFG.telegram}" target="_blank" rel="noopener">Открыть Telegram</a></div>`}
          <div class="charity-note" style="max-width:420px"><b>${CFG.charityPercent}%</b><span>этого заказа получат бездомные коты и кошки. Спасибо, что помогаете.</span></div>
          <a class="link" href="catalog.html">Вернуться в каталог</a>
        </div>`;
      const cp = $("#copy-order");
      if (cp) cp.onclick = async () => { try { await navigator.clipboard.writeText(text); toast("Текст заказа скопирован"); } catch { toast("Не удалось скопировать, выделите текст вручную"); } };
      scrollTo({ top: 0, behavior: "smooth" });
    });
    drawSum();
  }

  /* ---------- fonts from data.js (only files that exist, so no 404s) ---------- */
  function fonts() {
    const f = CFG.fonts || {}, fmt = u => (/\.woff2$/i.test(u) ? "woff2" : /\.woff$/i.test(u) ? "woff" : /\.otf$/i.test(u) ? "opentype" : "truetype");
    const face = (fam, w, u) => u ? `@font-face{font-family:"${fam}";font-weight:${w};font-display:swap;src:url("${u}") format("${fmt(u)}")}` : "";
    const css = face("Molodnyak", 400, f.display) + face("Evolventa", 400, f.body) + face("Evolventa", 700, f.bodyBold);
    if (css) { const st = document.createElement("style"); st.textContent = css; document.head.append(st); }
  }

  /* ---------- Molodnyak detection: installed locally or loaded from data.js ---------- */
  function fontClass() {
    const ctx = document.createElement("canvas").getContext("2d");
    const t = "абвгдеж SOLKHUA 0123";
    const w = f => { ctx.font = f; return ctx.measureText(t).width; };
    const has = w('48px "Molodnyak", monospace') !== w("48px monospace");
    document.documentElement.classList.toggle("f-mol", has);
  }

  /* ---------- soft parallax for wide photos ---------- */
  function parallax() {
    const els = $$("[data-parallax]");
    if (!els.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const go = () => els.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = `translate3d(0,${(-k * 8).toFixed(2)}%,0)`;
    });
    addEventListener("scroll", () => requestAnimationFrame(go), { passive: true }); go();
  }

  /* ---------- boot ---------- */
  fonts();
  fontClass();
  if (document.fonts) document.fonts.ready.then(fontClass);
  layout();
  renderCart();
  events();
  transitions();
  (pages[page] || (() => {}))();
  animations();
  parallax();
})();

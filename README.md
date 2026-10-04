# SOLKHUA — интернет-магазин свечей

Петербургские свечи из кокосового воска. Статический сайт: работает на GitHub Pages, без сервера и сборки.

## Страницы

| Файл | Что это |
|---|---|
| `index.html` | Главная: выбор аромата с парящей свечой, каталог, распаковка при скролле, коты, помощь котам, цитаты |
| `catalog.html` | Каталог с фильтром «Тёплые / Свежие» и сортировкой |
| `product.html?id=…` | Страница товара: галерея с зумом, количество, характеристики, цитата |
| `checkout.html` | Оформление заказа: контакты, доставка, оплата, проверка полей |
| `about.html` | О бренде |
| `charity.html` | Помощь котам (10%) |
| `info.html` | Доставка, оплата, вопросы и ответы, контакты |
| `404.html` | Страница «не найдено» |

Корзина сохраняется в браузере покупателя и открывается сбоку на любой странице.

## Что и где менять

- **Цены, тексты ароматов, контакты, доставка, процент на благотворительность:** `assets/js/data.js`.
- **Куда приходят заказы:** `orderEndpoint` в `assets/js/data.js`.
  Зарегистрируйтесь на [formspree.io](https://formspree.io), создайте форму и вставьте её адрес.
  Заказы будут приходить на вашу почту. Пока поле пустое, покупатель после оформления копирует заказ и отправляет вам в Telegram.
- **Шрифты:** все лежат в папке `fonts/` (woff2, подключены в `assets/css/style.css`), без Google Fonts — одинаковы на телефоне и ПК. Как заменить шрифт — в `fonts/README.md`.
  В Molodnyak есть только строчные буквы (нарисованы как жирные заглавные), поэтому заголовки и логотип всегда набираются строчными.
- **Видео распаковки:** файл в `assets/video/` и путь в `unboxingVideo` в `data.js`.
- **Фото товаров:**
  - `assets/img/product-<id>.webp` — свеча на фоне #EFE9E2 (главная, каталог, карточка товара, корзина).
    Фон сайта (`--milk` в `style.css`) совпадает с фоном этих фото, поэтому свечи выглядят как без фона.
    Новые фото выравнивайте под #EFE9E2 или присылайте мне.
  - `assets/img/closed-<id>.webp` — банка без упаковки, крышка закрыта (галерея, наведение в каталоге).
  - `assets/img/open-<id>.webp` — открытая банка, крышка рядом (галерея, блок «Откройте» на главной).
  - `assets/img/label-<id>.webp` — наклейка; исходники PNG лежат в `gemini-kit/labels/`.
  - `assets/img/side.webp` — вид сбоку (толщина банки), `assets/img/lit.webp` — горящая свеча; показываются в галерее каждой свечи.
  Наклейки на всех фото наложены из PNG-исходников с учётом перспективы, поэтому текст везде точный.
- **Фото Петербурга и котов** — Unsplash (бесплатная лицензия Unsplash, указание авторов желательно):
  - `assets/img/spb/bridge.webp` — Ilia Bronskiy, https://unsplash.com (photo-1642021824052-920192524b19)
  - `assets/img/spb/isaac-flowers.webp` — Ilia Bronskiy, https://unsplash.com (photo-1642258483742-a4495842847b)
  - `assets/img/spb/rooftops.webp` — iam_os, https://unsplash.com (photo-1579677359441-a59fa83ecc40)
  - `assets/img/spb/courtyard.webp` — Karina Kegy, https://unsplash.com (photo-1609367947233-6e9bcbaadcb3)
  - `assets/img/spb/canal.webp` — Nick Night, https://unsplash.com (photo-1635237929027-819d8cce4c26)
  - `assets/img/spb/isaac-canal.webp` — Ainur Khakimov, https://unsplash.com (photo-1655121109751-20a78309dc2e)
  - `assets/img/cats/care.webp` — Nicholas Ng, https://unsplash.com (photo-1658433544476-832b7bbfc17a)
  - `assets/img/cats/hope.webp` — Hkyu Wu, https://unsplash.com (photo-1560145393-2f79d01cabc5)
  - `assets/img/cats/kittens.webp` — little plant, https://unsplash.com (photo-1622273413883-265d478feda3)
  - `assets/img/cats/ginger.webp` — Daniel Mačura, https://unsplash.com (photo-1604675223954-b1aabd668078)
- **Цвета и размеры:** переменные в начале `assets/css/style.css`.

## Как открыть сайт в браузере

1. На GitHub откройте репозиторий → **Settings** → **Pages**.
2. В **Source** выберите **Deploy from a branch**, ветку `claude/epic-hamilton-dk2zc2`, папку `/ (root)` → **Save**.
3. Через 1–2 минуты сайт откроется по адресу `https://najibsolkhua-cmd.github.io/solkhua-brand/`.

Локально: откройте папку в терминале и запустите `python3 -m http.server`, затем зайдите на `http://localhost:8000`.

## Папка `gemini-kit`

Промпты и исходники для генерации продуктовых фото в Gemini.

## Как выложить на рег.ру

Готовый архив `SOLKHUA_site_regru.zip` содержит ровно то, что нужно. Или загрузите в папку сайта (`public_html` или `www/ваш-домен`) содержимое репозитория: все `*.html`, `favicon.ico`, `site.webmanifest`, папки `assets/` и `fonts/` и файл `.htaccess`. Папки `gemini-kit/` и `fonts/original/` и файлы `README.md` загружать не нужно. Сборка не нужна, сайт работает как есть.

- `.htaccess` включает страницу 404, сжатие и кэш. Когда подключите SSL-сертификат в панели рег.ру, уберите `#` в трёх строках про https, и сайт будет всегда открываться по защищённому адресу.
- Для красивого превью ссылки в Telegram и ВКонтакте замените во всех .html `content="assets/img/og.jpg"` на полный адрес, например `content="https://ваш-домен.ru/assets/img/og.jpg"`.

## Иконка сайта (фавикон)

- `assets/img/favicon-light.svg` — тёмная лапка, для светлой темы браузера.
- `assets/img/favicon-dark.svg` — белая лапка, для тёмной темы браузера.
- `favicon.ico` — запасной вариант для старых браузеров (лапка на светлом круге, видна на любом фоне).
- `assets/img/apple-touch-icon.png`, `icon-192.png`, `icon-512.png` — иконки для экрана «Домой» на iPhone и Android.

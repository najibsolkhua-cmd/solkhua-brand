# Шрифты

1. Положите сюда файлы шрифтов (лучше .woff2, подойдут .woff, .otf, .ttf).
2. Откройте `assets/js/data.js` и впишите пути в блок `fonts`:

```js
fonts: {
  display: "fonts/Molodnyak-Regular.woff2",   // заголовки
  body: "fonts/Evolventa-Regular.woff2",      // текст и кнопки
  bodyBold: "fonts/Evolventa-Bold.woff2"      // жирный текст
}
```

Пока пути пустые, сайт показывает запасные шрифты (Poiret One и Didact Gothic) и не ищет несуществующие файлы.
Times New Roman подключать не нужно: он есть на всех устройствах, на Android вместо него подставляется Tinos.

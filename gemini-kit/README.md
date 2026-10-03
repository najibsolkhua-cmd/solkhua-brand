# SOLKHUA — набор для генерации предметной съёмки в Gemini

Цель: 6 одинаковых по композиции, свету и фону карточек товара (по одной на каждый аромат).
Различается только этикетка на крышке. Качество как у студийной предметной съёмки.

Модель: самая свежая модель генерации изображений в Gemini (Nano Banana Pro или новее).
Лучше работать в **Google AI Studio**: там можно выставить **Aspect ratio 1:1** и **Resolution 4K**.
В приложении Gemini включите режим «Создать изображение» с моделью Thinking/Pro.

---

## Как это работает (2 шага)

Если сгенерировать 6 карточек по отдельности, каждая выйдет со своим ракурсом и светом.
Поэтому так:

1. **Шаг 1 — мастер-кадр.** Делаем одну идеальную карточку (Пало санто) по всем исходникам.
   Перегенерируем, пока не получится идеально. Это эталон.
2. **Шаг 2 — серия.** Для остальных 5 ароматов отправляем **эталон + новую этикетку**
   и просим заменить только этикетку. Каждый раз начинаем **новый чат** и всегда берём за основу эталон,
   а не предыдущую замену, иначе ошибки накапливаются.

---

## Шаг 1. Какие файлы отправить (9 шт., строго в этом порядке)

| # | Файл | Зачем |
|---|------|-------|
| 1 | `product/01_in-bag_top.jpg` | как товар выглядит в вакуумном пакете сверху |
| 2 | `product/02_in-bag_angle.jpg` | как плёнка обтягивает банку, складки |
| 3 | `product/03_in-bag_low-angle.jpg` | высота банки в пакете, блики на плёнке |
| 4 | `product/04_in-bag_seal-edge.jpg` | рифлёная фактура шва вакуумного пакета |
| 5 | `product/05_tin_label_no-bag.jpg` | банка и этикетка без плёнки: материал, бортик крышки |
| 6 | `product/06_tin_side-profile.jpg` | точная форма банки сбоку, резьба, рифлёный край крышки |
| 7 | `style/style_ref_pinterest_vacuum.png` | референс света, бликов и капель на плёнке (плашка «Изменено с помощью ИИ» уже обрезана) |
| 8 | `style/style_ref_my_layout.png` | ваша раскладка: светло-серый фон, банка по центру, форма пакета |
| 9 | `labels/label_01_palo-santo.png` | этикетка, которая должна быть на крышке |

**Не отправляйте:** фото дна банки, открытую свечу, фото с рукой, общий лист с 6 этикетками
(модель начнёт смешивать этикетки).

### Промпт шага 1 (вставлять на английском, так модель понимает точнее)

```
Create an ultra-photorealistic commercial product photograph for an e-commerce
catalog, indistinguishable from a real high-end studio shoot.

PRODUCT (match images 1–6 exactly — this is a real product, do not redesign it):
A small round brushed-aluminium screw-top candle tin, about 7 cm in diameter
and 3 cm tall, with a fine knurled lid rim and a visible screw seam on the side
(see image 6). The lid top is fully covered by a round matte paper sticker label.
The tin is vacuum-sealed inside a clear, thin, glossy embossed vacuum bag
(images 1–4): the film is pulled drum-tight over the lid and tin wall, with fine
tension wrinkles radiating from the tin edge to the corners, and a loose flat
film margin around it with soft creases and pinched, slightly curled corners,
giving the pouch a soft four-pointed star shape. Along the heat-sealed edges the
film has the fine embossed dot/channel texture seen in image 4. The film is
crystal clear — the label is fully readable through it.

LABEL (reproduce image 9 exactly, as printed artwork, do not retype or redraw it):
Copy the label from image 9 1:1 — same photo of the cat, same colours, same
"SOLKHUA" logo, same curved top line "CANDLE 100% coconut wax 60ml", the same
Russian quote, author and the scent name "Пало санто" at the bottom. Keep all
Cyrillic text exactly as in image 9, letter for letter. The label sits flat on
the lid, slightly dimmed and glazed by the plastic film over it, with
realistic specular highlights from the film crossing it.

COMPOSITION (follow image 8):
Square 1:1 frame. The single product is centred, occupying about 60% of the
frame width, on a seamless, very light cool-grey paper background (#EDEDED),
with even negative space on all sides. Camera almost top-down, tilted about
10° from vertical, so the brushed-aluminium side wall and knurled lid rim are
just visible along the lower edge of the tin. Nothing else in the frame.

LIGHT & MOOD (follow image 7 for light and film rendering only):
Large overhead softbox plus two narrow strip lights at the sides, producing
long, clean gradient highlights along the wrinkles of the film, crisp bright
specular edges on the aluminium rim, and a soft, short, natural contact shadow
under the pouch. A few tiny clear condensation droplets on the film surface.
Neutral, cool, true-to-life colours, clean minimal luxury aesthetic.

CAMERA:
Shot on a Phase One IQ4 150MP medium-format camera with a 120 mm macro lens at
f/11, focus-stacked so the whole product is tack-sharp, ISO 50,
professionally retouched, 4K resolution, ultra-detailed textures of brushed
metal, paper and plastic film.

AVOID:
Do not copy any text, stamps, stickers, barcodes or the vial from image 7.
No props, no hands, no extra objects, no reflections of people, no logos other
than the label. No glass look, no thick or cloudy plastic, no CGI/3D-render
look, no plastic-toy look, no warped or misspelled text, no distorted label,
no colour cast, no vignette, no watermark.
```

---

## Шаг 2. Серия из остальных 5 ароматов

Новый чат на каждый аромат. Отправить **2 файла**:

1. Ваш утверждённый эталон (результат шага 1).
2. Этикетку нужного аромата из папки `labels/`.

| Аромат | Файл этикетки | Название на этикетке |
|--------|---------------|----------------------|
| Табак и бергамот | `labels/label_02_tabak-bergamot.png` | Табак и бергамот |
| Бергамот | `labels/label_03_bergamot.png` | Бергамот |
| Эвкалипт | `labels/label_04_evkalipt.png` | Эвкалипт |
| Лемонграсс | `labels/label_05_lemongrass.png` | Лемонграсс |
| Апельсин и корица | `labels/label_06_apelsin-koritsa.png` | Апельсин и корица |

### Промпт шага 2 (меняйте только `[НАЗВАНИЕ]`)

```
Image 1 is the approved master product photo. Edit it: replace ONLY the
printed round label on the tin lid with the label artwork from image 2,
reproduced 1:1 — same cat photo, colours, "SOLKHUA" logo, curved top line
"CANDLE 100% coconut wax 60ml", the same Russian quote and author, and the
scent name "[НАЗВАНИЕ]" at the bottom, letter for letter.

Keep EVERYTHING else identical to image 1: the same camera angle, framing,
product size and position, the same vacuum-bag shape, every wrinkle, highlight
and droplet on the film, the same aluminium tin, the same light-grey
background, the same lighting, shadow and colour grading. The new label must
sit under the same plastic film with the same glare and highlights crossing
it. Output 1:1, 4K. Do not change anything except the label.
```

---

## Если что-то пошло не так — короткие уточнения в том же чате

- **Текст на этикетке кривой:**
  `Keep the image, but redo only the label: copy the text from the label reference exactly, letter for letter, sharp and legible.`
- **Плёнка выглядит как стекло или толстый пластик:**
  `Make the vacuum film thinner and softer: a thin flexible clear vacuum pouch tightly shrunk onto the tin, with fine crinkles, not rigid glass.`
- **Банка не той формы:**
  `Match the tin shape exactly to image 6: low, wide, brushed aluminium, knurled screw lid.`
- **Выглядит как 3D-рендер:**
  `Make it look like a real photograph: subtle paper texture of the background, natural micro-imperfections on the film, real lens depth.`

**Мелкий русский текст цитат** — самое слабое место любой нейросети. Если после 3–4 попыток
цитата всё равно искажена, сделайте так, как поступают ретушёры в дорогих студиях:
оставьте сгенерированный кадр, а настоящую этикетку из `labels/` наложите в Photoshop или Figma
поверх крышки (трансформация «Перспектива», режим наложения Multiply, а сверху копия бликов плёнки
в режиме Screen). Так текст будет на 100% точным.

---

## Что я заметил в ваших файлах

1. На вашем рендере (`style_ref_my_layout.png`) на крышке написано **«CANDELS»**, а на настоящей
   этикетке и в эскизе правильно: **«CANDLE»**. В промпте указан правильный вариант.
2. На том же рендере у **Эвкалипта** (серый кот) стоит цитата Брижит Бардо, а в эскизе у него
   цитата Леди Дианы. Этикетки в `labels/` вырезаны из эскиза, там всё правильно.
3. На референсе из Pinterest была плашка «Изменено с помощью ИИ», я её обрезал, иначе Gemini может
   нарисовать её на вашей карточке.

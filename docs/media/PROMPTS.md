# PROMPTS DE GERAÇÃO — TRILHA GRATUITA

> Companheiro de `MEDIA_PLAN.md`. Atualizado em 2026-08-04.
> Destinado às ferramentas que o proprietário já assina: **Nano Banana Pro**
> (Google AI Pro) para imagem e **Veo 3.1 / Sora** para vídeo.

Os prompts estão em inglês porque modelos de imagem respondem de forma mais
previsível nesse idioma. As instruções de uso estão em português.

---

## 1. Como usar — a ordem importa

O erro mais caro em geração de catálogo é gerar cada produto isoladamente: o frasco
muda de forma entre as fotos e a loja parece um agregador, não uma marca.

**Sequência correta:**

```
PASSO 1   Gerar o FRASCO MESTRE (prompt 0). Iterar até ficar bom.
             ↓  salvar o arquivo
PASSO 2   Anexar o frasco mestre como IMAGEM DE REFERÊNCIA em todos
          os prompts seguintes, mudando só cor do vidro, luz e cenário.
             ↓
PASSO 3   Gerar galeria, close-up, categorias e campanha.
             ↓
PASSO 4   Só então gerar vídeo, usando um still aprovado como primeiro quadro.
```

No Nano Banana Pro, anexe a imagem antes do prompt e escreva
`Use the attached bottle as the exact reference. Keep its silhouette, proportions
and cap identical.`

**Configurações:** peça `4K` e informe a proporção (`16:9`, `9:16`, `1:1`, `4:5`).

---

## 2. Regras fixas — coloque no fim de todo prompt de imagem

```
No text, no lettering, no logos, no watermarks, no brand names anywhere in the image.
The bottle label must be blank or absent.
Photorealistic product photography, not illustration, not 3D render look.
No hands, no people, no faces.
Clean, undistorted glass — no warped edges, no melted shapes, no duplicated caps.
Sharp focus on the bottle, natural depth of field.
```

**Por que "no text":** modelos ainda erram tipografia, e texto queimado na imagem
quebra acessibilidade, SEO e tradução. O texto entra por HTML.

---

## 3. Prompt 0 — Frasco mestre `(gerar primeiro, uma única vez)`

Proporção `1:1`. É a peça mais importante do conjunto.

```
Studio product photograph of an original luxury perfume bottle, invented design,
not resembling any existing brand.

Bottle: heavy rectangular glass flacon with softly beveled vertical edges,
tall narrow neck, solid brushed-metal cap in dark champagne tone.
Thick glass base showing internal refraction. Completely blank front face —
no label, no engraving, no text.

Lighting: single large softbox from camera left at 45 degrees, subtle rim light
from behind right to define the glass edges, deep falloff into shadow.
Surface: seamless matte charcoal backdrop, faint reflection under the bottle.

Camera: 100mm macro lens, f/8, straight-on eye-level angle, bottle centered,
occupying 60% of frame height.
Mood: quiet, expensive, editorial. Cinematic contrast, rich blacks that retain detail.

No text, no lettering, no logos, no watermarks, no brand names anywhere in the image.
The bottle label must be blank or absent.
Photorealistic product photography, not illustration, not 3D render look.
No hands, no people, no faces.
Clean, undistorted glass — no warped edges, no melted shapes, no duplicated caps.
Sharp focus on the bottle, natural depth of field.

4K resolution, square 1:1.
```

Itere até o frasco ficar convincente. **Salve como `media/source/_master-bottle.png`.**
Tudo depois deriva daqui.

---

## 4. Modificadores por linha de produto

Anexe o frasco mestre e troque apenas o bloco abaixo dentro dos prompts 1 a 5.

| Linha | Substituir por |
|---|---|
| Lenho Vigil | `dark amber glass, warm side light, background of blurred coarse wood grain in deep brown` |
| Alba Cítrica | `clear transparent glass, cool bright morning light, background of pale sand gradient with a single suspended water droplet` |
| Flora Velada | `frosted milky opaline glass, high soft diffused light, background of out-of-focus pale petals in blush tones` |
| Âmbar Secreto | `smoked grey-brown glass, low dramatic light, brushed brass cap, background of deep bronze shadow` |
| Maré Clara | `pale blue translucent glass, cool light with water caustics projected on the backdrop, background of soft teal gradient` |
| Noturno Absoluto | `opaque black glass with a single specular highlight, near-black background, extreme low-key lighting` |
| Comum Raro | `colorless clear glass, neutral even light, background of mid-grey seamless paper, minimal geometry` |

---

## 5. Prompts 1–4 — Galeria de produto `(4 por produto)`

Proporção `4:5`. Anexe sempre o frasco mestre.

**1 — Hero do produto**
```
Use the attached bottle as the exact reference. Keep its silhouette, proportions
and cap identical.
[MODIFICADOR DA LINHA]
Three-quarter angle, bottle slightly right of center, generous empty space on the
left third for text overlay. 85mm lens, f/5.6, soft key light from upper left.
[REGRAS FIXAS]
4K resolution, 4:5 portrait.
```

**2 — Ângulo alternativo**
```
Use the attached bottle as the exact reference. Keep its silhouette, proportions
and cap identical.
[MODIFICADOR DA LINHA]
Profile view from the left side, cap slightly open and resting beside the bottle.
Low camera angle looking slightly up, conveying weight and presence.
[REGRAS FIXAS]
4K resolution, 4:5 portrait.
```

**3 — Detalhe de material**
```
Use the attached bottle as the exact reference.
[MODIFICADOR DA LINHA]
Extreme close-up of the shoulder and neck of the bottle, showing glass thickness,
internal refraction and the machined texture of the metal cap.
100mm macro, f/4, very shallow depth of field.
[REGRAS FIXAS]
4K resolution, 4:5 portrait.
```

**4 — Contexto**
```
Use the attached bottle as the exact reference. Keep its silhouette, proportions
and cap identical.
[MODIFICADOR DA LINHA]
Bottle standing on a dark stone ledge, styled with one or two natural elements that
suggest the fragrance family — dry wood, citrus peel, a single petal, a smooth stone.
Elements are secondary and out of focus. Wide framing with strong negative space above.
[REGRAS FIXAS]
4K resolution, 4:5 portrait.
```

**5 — Close-up dedicado** (`1:1`)
```
Use the attached bottle as the exact reference.
[MODIFICADOR DA LINHA]
Macro shot of the spray nozzle and collar, catching a single sharp specular
highlight. Background almost entirely black and out of focus.
[REGRAS FIXAS]
4K resolution, square 1:1.
```

---

## 6. Prompt 6 — Campanha do hero

**Desktop `16:9`** — este é o ativo mais visível da loja.
```
Wide cinematic campaign image for a luxury perfume house.
An original invented perfume bottle stands on the right third of the frame on a
dark polished surface. The left two thirds are near-empty: a deep gradient from
charcoal to warm black, with a slow drift of atmospheric haze catching light.
A single hard rim light traces the right edge of the bottle. One soft warm bounce
fills the front.
Composition deliberately leaves the entire left half clear for headline text overlay.
Anamorphic look, 40mm, f/2.8, subtle lens falloff at the corners.
Mood: restrained, nocturnal, expensive.
[REGRAS FIXAS]
4K resolution, 16:9 widescreen.
```

**Mobile `9:16`** — mesmo prompt, trocando as duas últimas linhas de composição por:
```
Vertical composition. Bottle in the lower third, entire upper half left clear
and dark for headline text overlay.
4K resolution, 9:16 vertical.
```

---

## 7. Prompt 7 — Fundos cinematográficos `(sem produto)`

Servem de camada de fundo para seções inteiras. Gere `16:9` e `9:16`.
```
Abstract cinematic background for a luxury fragrance website. No objects, no product.
Deep charcoal field with a slow diagonal sweep of warm amber light, fine
atmospheric particles suspended in the beam, heavy vignetting at the edges.
Very low contrast in the center so that white text remains readable on top.
Smooth gradients, no banding, film grain barely present.
[REGRAS FIXAS]
4K resolution, 16:9.
```

Variações: trocar `warm amber light` por `cold blue light` e por `pale neutral light`
para obter as três cenas do inventário.

---

## 8. Prompt 8 — Categorias e coleções `(7 linhas × 2)`

Precisa ler bem em miniatura e ter área de texto. `16:9` e `9:16`.
```
Category banner for a perfume collection.
[MODIFICADOR DA LINHA]
The bottle sits small in the lower right corner, sharply lit. The rest of the frame
is an atmospheric field of the collection's dominant color, dark enough for white
text on the left half.
Strong sense of a single color story. Simple, uncluttered, readable at thumbnail size.
[REGRAS FIXAS]
4K resolution, 16:9.
```

---

## 9. Prompt 9 — Notas olfativas `(abstratas, sem frasco)`

Ilustram saída, coração e fundo na página de produto. `1:1`.
```
Abstract macro photograph representing a fragrance note. No bottle, no product,
no text.
Subject: [SAÍDA: citrus zest and cold water droplets suspended in air]
        [CORAÇÃO: soft blurred petals dissolving into warm light]
        [FUNDO: dark resin, dry wood fibers and drifting smoke]
Extreme shallow depth of field, single directional light, deep shadow.
Feels like a fragment of a larger scene, not a centered still life.
[REGRAS FIXAS]
4K resolution, square 1:1.
```

---

## 10. Prompt 10 — Open Graph `(1200×630 lógico, gerar 16:9)`

Aparece no WhatsApp e nas redes. Texto será sobreposto por código, não gerado.
```
Open Graph preview image for a luxury perfume store.
Single invented perfume bottle centered slightly right, dark cinematic background,
strong single light source. Extremely simple composition — it will be seen small.
Wide clear area on the left for a text overlay.
High contrast between the bottle and the background so the subject survives
downscaling to 600 pixels wide.
[REGRAS FIXAS]
4K resolution, 16:9.
```

---

## 11. Prompt 11 — Texturas `(para o design system)`

Usadas como fundo sutil de seções e cartões. `1:1`, sem produto.
```
Seamless tileable texture, photographed flat, evenly lit, no perspective.
Subject: [dark tempered glass with faint fingerprint sheen]
        [heavy cotton paper with visible fiber]
        [matte black woven fabric]
        [brushed champagne metal with fine directional grain]
Very low contrast, subtle detail, suitable as a background layer under text.
No objects, no text, no shadows cast by external objects.
4K resolution, square 1:1.
```

---

## 12. Prompt 12 — Referências para modelagem 3D

Estas **não** vão para a loja. Servem de referência para modelar o frasco em
Blender/Three.js. Precisam ser ortográficas e sem drama de luz.
```
Technical orthographic reference view of the attached perfume bottle.
[front elevation / side elevation / top view]
Flat even lighting, no shadows, no reflections, no perspective distortion.
Pure mid-grey background. The bottle is centered and fills the frame vertically.
This is a modeling reference sheet, not a beauty shot.
No text, no dimensions, no annotation.
4K resolution, square 1:1.
```

---

## 13. Prompt 13 — Vídeo do hero `(Veo 3.1 ou Sora)`

Antes de gerar, releia a seção 4 de `MEDIA_PLAN.md`: um still 4K com movimento em
CSS pode ser a melhor escolha técnica. Se ainda assim quiser vídeo:

**Regras:** 6 segundos, movimento lento, sem corte, começo e fim parecidos para
permitir loop, **sem áudio** (o hero de e-commerce nunca deve tocar som sozinho).

```
A slow, continuous 6-second camera move around a luxury perfume bottle standing on
a dark polished surface.
The camera orbits gently to the right by about 15 degrees while drifting almost
imperceptibly closer. Nothing else moves except faint atmospheric haze catching
the rim light.
Deep charcoal environment, single warm key light from the left, hard rim light
from behind.
The shot begins and ends at nearly the same framing so it can loop seamlessly.
No cuts, no zoom snaps, no camera shake.
No text, no logos, no people, no hands.
Photorealistic, cinematic, shallow depth of field.
1080p, 16:9.
```

Variação mobile: trocar a última linha por `1080p, 9:16 vertical` e reenquadrar o
movimento para a metade inferior do quadro.

---

## 14. Depois de gerar — checklist antes de aceitar

Mesmo critério da seção 9 de `MEDIA_PLAN.md`. Os três erros mais frequentes:

1. **Frasco mudou de forma** entre as fotos do mesmo produto → regerar com a
   referência anexada e instrução explícita de manter a silhueta.
2. **Apareceu texto ou logo** apesar da instrução → regerar; não tente corrigir
   por edição, o modelo tende a reintroduzir.
3. **Faltou área negativa** e o título não cabe → peça explicitamente
   `leave the left half empty` e verifique sobrepondo texto de teste antes de aprovar.

## 15. Onde salvar

Siga a convenção da seção 8 de `MEDIA_PLAN.md`. Os originais vão para
`media/source/`, que **não entra no Git**. O pipeline de otimização gera as versões
públicas em `public/media/`.

# Master Bottle Media Set Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produzir quatro imagens cinematográficas, quatro pranchas ortográficas correspondentes e um vídeo Lenho Vigil de seis segundos, todos ancorados no mesmo frasco mestre.

**Architecture:** As oito imagens serão geradas individualmente com a ferramenta nativa `image_gen`, sempre anexando `_master-bottle.png` como referência geométrica. As cenas cinematográficas usarão a referência JPEG apenas para clima e composição; cada prancha 3D usará o mestre, a cena aprovada da variante e a referência de layout. O vídeo será produzido a partir da cena Lenho Vigil pelo endpoint oficial `fal-ai/vidu/q2/image-to-video/pro`, usando a mesma imagem no início e no fim para favorecer o loop, e normalizado localmente com FFmpeg.

**Tech Stack:** OpenAI built-in `image_gen`; fal.ai Vidu Q2 Pro; navegador autenticado no playground oficial do fal.ai; FFmpeg/FFprobe; PowerShell; arquivos PNG e MP4.

## Global Constraints

- Frasco obrigatório: `docs/media/source/_master-bottle.png`.
- Preservar silhueta, proporções, ombros, base e tampa cilíndrica do frasco mestre.
- Manter a tampa em acabamento metálico champanhe escovado.
- Variar somente aparência do vidro/líquido, iluminação e cenário.
- Proibidos texto, logotipo, rótulo, símbolo, monograma, marca-d'água, pessoa e mão.
- As imagens cinematográficas devem ser 16:9, ter no mínimo 1920 × 1080 e reservar espaço negativo à esquerda.
- Cada prancha deve conter vistas frontal, lateral direita e superior, em projeção ortográfica, sem sombras, reflexos de cenário ou distorção de perspectiva.
- O vídeo final deve ter exatamente 6 segundos, 1920 × 1080, 16:9, plano único e nenhuma faixa de áudio.
- Não modificar arquivos de aplicação nem integrar as mídias ao site nesta entrega.
- Não adicionar os arquivos binários gerados ao Git; preservar os originais no diretório solicitado pelo usuário.
- Limite de custo: uma geração inicial por imagem, no máximo uma correção direcionada por imagem reprovada e um único render pago de vídeo. Um segundo vídeo exige nova autorização.

---

## File Map

- Create: `docs/media/generated/master-bottle-collection-2026-08-07/prompts/generation-prompts.txt` — registro integral dos prompts efetivamente usados.
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/cinematic/01-lenho-vigil.png` — cena hero âmbar e quente.
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/cinematic/02-alba-citrica.png` — cena hero clara e fria.
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/cinematic/03-mare-clara.png` — cena hero azul e aquática.
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/cinematic/04-noturno-absoluto.png` — cena hero preto-fumê e dramática.
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/refs-3d/01-lenho-vigil-orthographic.png` — vistas ortográficas da variante Lenho Vigil.
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/refs-3d/02-alba-citrica-orthographic.png` — vistas ortográficas da variante Alba Cítrica.
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/refs-3d/03-mare-clara-orthographic.png` — vistas ortográficas da variante Maré Clara.
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/refs-3d/04-noturno-absoluto-orthographic.png` — vistas ortográficas da variante Noturno Absoluto.
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/video/01-lenho-vigil-loop-6s-1080p.mp4` — vídeo final normalizado e sem áudio.
- Temporary: `C:/tmp/loja-perfumes-media/` — download bruto do vídeo e quadros de controle; não é parte da entrega.

## Interfaces

- `image_gen.imagegen({ referenced_image_paths, prompt })` produz uma imagem e um caminho de saída sob `$CODEX_HOME/generated_images/`.
- Cada imagem cinematográfica aceita fornece material visual para sua prancha ortográfica correspondente.
- `01-lenho-vigil.png` é o quadro inicial e final da geração Vidu Q2 Pro.
- O playground `https://fal.ai/models/fal-ai/vidu/q2/image-to-video/pro` recebe `prompt`, `image_url`, `end_image_url`, `duration`, `resolution`, `movement_amplitude` e `bgm`.
- FFmpeg recebe o MP4 bruto e produz H.264 1920 × 1080, seis segundos, `yuv420p`, sem áudio e com `faststart`.

---

### Task 1: Preparar estrutura e manifesto de prompts

**Files:**
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/prompts/generation-prompts.txt`
- Create directories: `cinematic`, `refs-3d`, `video`

**Interfaces:**
- Consumes: a especificação aprovada e os três arquivos em `docs/media/source/`.
- Produces: diretórios de destino e prompts completos que todas as tarefas seguintes usarão.

- [ ] **Step 1: Confirmar as três referências sem ler ou alterar outros arquivos do usuário**

Run:

```powershell
Get-Item -LiteralPath 'docs\media\source\_master-bottle.png','docs\media\source\Perfume_bottle_in_store_2K_202608042308.jpeg','docs\media\source\ChatGPT Image 4 de ago. de 2026, 22_40_18.png' | Select-Object Name,Length,FullName
```

Expected: três itens existentes, todos com tamanho maior que zero.

- [ ] **Step 2: Criar somente os quatro diretórios aprovados**

Run:

```powershell
$base = 'docs\media\generated\master-bottle-collection-2026-08-07'
New-Item -ItemType Directory -Force -Path "$base\cinematic","$base\refs-3d","$base\video","$base\prompts" | Out-Null
```

Expected: os quatro diretórios existem sob `docs/media/generated/master-bottle-collection-2026-08-07/`.

- [ ] **Step 3: Criar o manifesto com os nove prompts abaixo usando `apply_patch`**

O arquivo deve conter estes blocos completos em inglês, idioma mais estável para os geradores selecionados:

```text
[GLOBAL INVARIANTS]
Use case: product-mockup.
The exact bottle geometry in Image 1 is mandatory. Preserve its silhouette, proportions, shoulders, thick base, neck and cylindrical brushed champagne-metal cap. The bottle face remains blank. Change only the glass/liquid appearance, lighting and environment. Never add text, labels, logos, symbols, monograms, watermarks, people or hands. Never replace the bottle with the short faceted bottle or black cap shown in the mood/layout references.

[01 CINEMATIC — LENHO VIGIL]
Asset type: luxury e-commerce landing-page hero.
Input images: Image 1 is the mandatory master bottle geometry and identity reference. Image 2 is mood and composition reference only; do not copy its bottle, cap, logo, flower or exact scene.
Primary request: Create an original photorealistic cinematic product photograph featuring the exact master bottle, with deep translucent amber glass and liquid.
Scene/backdrop: deep charcoal environment, dark polished wood surface, very faint atmospheric haze, no decorative objects.
Composition/framing: wide 16:9 frame, bottle on the right third, generous clean negative space on the left for website copy, camera near bottle height, restrained reflection beneath the bottle.
Lighting/mood: one warm key light from the left, hard narrow rim light from behind, intimate premium mood, shallow depth of field.
Materials/textures: physically plausible amber glass, visible glass thickness at edges and base, brushed champagne-metal cap, controlled highlights.
Constraints: preserve Image 1 geometry exactly; blank bottle face; no text, logo, label, symbol, monogram, watermark, people or hands.
Avoid: Image 2 bottle geometry, black faceted cap, gold collar, flower, floating particles, extra bottles, warped glass, duplicate cap, excessive smoke.

[02 CINEMATIC — ALBA CITRICA]
Asset type: luxury e-commerce landing-page hero.
Input images: Image 1 is the mandatory master bottle geometry and identity reference. Image 2 is composition reference only; do not copy its bottle, cap, logo, flower or brown palette.
Primary request: Create an original photorealistic cinematic product photograph featuring the exact master bottle, with clear nearly crystalline glass and a very pale citrus-gold liquid.
Scene/backdrop: minimal pale limestone surface and softly graded cool-gray background, no decorative objects.
Composition/framing: wide 16:9 frame, bottle on the right third, generous clean negative space on the left for website copy, camera near bottle height, subtle contact reflection.
Lighting/mood: cool diffused daylight from the left with one restrained soft warm accent, fresh quiet premium mood, shallow depth of field.
Materials/textures: physically plausible clear glass, visible thickness at edges and base, brushed champagne-metal cap, delicate pale-yellow refraction.
Constraints: preserve Image 1 geometry exactly; blank bottle face; no text, logo, label, symbol, monogram, watermark, people or hands.
Avoid: Image 2 bottle geometry, black cap, dramatic smoke, botanical props, fruit, droplets, extra bottles, warped glass, duplicate cap.

[03 CINEMATIC — MARE CLARA]
Asset type: luxury e-commerce landing-page hero.
Input images: Image 1 is the mandatory master bottle geometry and identity reference. Image 2 is composition reference only; do not copy its bottle, cap, logo, flower or warm brown palette.
Primary request: Create an original photorealistic cinematic product photograph featuring the exact master bottle, with restrained translucent mineral-blue glass and liquid.
Scene/backdrop: deep slate environment and a subtly wet dark stone surface, no objects and no water drops on the bottle.
Composition/framing: wide 16:9 frame, bottle on the right third, generous clean negative space on the left for website copy, camera near bottle height, soft reflection contained beneath the bottle.
Lighting/mood: cool aquatic side light from the left, narrow neutral rim from behind, calm mineral atmosphere, shallow depth of field.
Materials/textures: physically plausible desaturated blue glass, visible thickness and refraction, brushed champagne-metal cap, controlled wet-surface highlights.
Constraints: preserve Image 1 geometry exactly; blank bottle face; no text, logo, label, symbol, monogram, watermark, people or hands.
Avoid: Image 2 bottle geometry, black cap, ocean waves, splashes, droplets on glass, seashells, extra bottles, warped glass, duplicate cap, neon cyan.

[04 CINEMATIC — NOTURNO ABSOLUTO]
Asset type: luxury e-commerce landing-page hero.
Input images: Image 1 is the mandatory master bottle geometry and identity reference. Image 2 is mood and composition reference only; do not copy its bottle, cap, logo, flower or exact scene.
Primary request: Create an original photorealistic cinematic product photograph featuring the exact master bottle, with black-smoke translucent glass that still reveals thickness and transparency along the edges.
Scene/backdrop: deep charcoal environment and low-reflection charcoal stone surface, no decorative objects.
Composition/framing: wide 16:9 frame, bottle on the right third, generous clean negative space on the left for website copy, camera near bottle height, minimal grounded reflection.
Lighting/mood: sculptural hard back rim defining the silhouette and one small warm side accent from the left, dense restrained premium mood, shallow depth of field.
Materials/textures: physically plausible smoke-black glass, luminous edge thickness, brushed champagne-metal cap, precise controlled highlights.
Constraints: preserve Image 1 geometry exactly; blank bottle face; no text, logo, label, symbol, monogram, watermark, people or hands.
Avoid: fully opaque plastic, Image 2 bottle geometry, black faceted cap, gold collar, flowers, extra bottles, warped glass, duplicate cap, crushed blacks that hide the silhouette.

[01 ORTHOGRAPHIC — LENHO VIGIL]
Asset type: non-dimensional 3D modeling reference sheet.
Input images: Image 1 is the mandatory master bottle geometry; Image 2 supplies only the approved amber glass/liquid material; Image 3 supplies only the three-view sheet layout. Do not copy the bottle, black cap, logo or dramatic reflections from Image 3.
Primary request: Render one clean square reference sheet containing exactly three separated views of the same exact master bottle: front elevation, right-side elevation and top view.
Scene/backdrop: uniform neutral mid-gray.
Style/medium: precise orthographic studio render, not a cinematic photograph.
Lighting/mood: flat, soft and perfectly even technical lighting.
Materials/textures: deep translucent amber glass/liquid and the unchanged brushed champagne-metal cylindrical cap.
Constraints: identical scale for front and side; orthographic projection; parallel verticals; blank bottle face; no ground plane, cast shadow, reflection, perspective, depth of field, text, label, logo, symbol, dimensions, arrows or watermark.
Avoid: three-quarter view, extra view, mismatched proportions between views, Image 3 bottle design, black faceted cap, gold collar, glossy environment reflections.

[02 ORTHOGRAPHIC — ALBA CITRICA]
Asset type: non-dimensional 3D modeling reference sheet.
Input images: Image 1 is the mandatory master bottle geometry; Image 2 supplies only the approved clear glass and pale citrus-gold liquid; Image 3 supplies only the three-view sheet layout. Do not copy the bottle, black cap, logo or dramatic reflections from Image 3.
Primary request: Render one clean square reference sheet containing exactly three separated views of the same exact master bottle: front elevation, right-side elevation and top view.
Scene/backdrop: uniform neutral mid-gray.
Style/medium: precise orthographic studio render, not a cinematic photograph.
Lighting/mood: flat, soft and perfectly even technical lighting.
Materials/textures: clear nearly crystalline glass, very pale citrus-gold liquid and the unchanged brushed champagne-metal cylindrical cap.
Constraints: identical scale for front and side; orthographic projection; parallel verticals; blank bottle face; no ground plane, cast shadow, reflection, perspective, depth of field, text, label, logo, symbol, dimensions, arrows or watermark.
Avoid: three-quarter view, extra view, mismatched proportions between views, Image 3 bottle design, black faceted cap, gold collar, glossy environment reflections.

[03 ORTHOGRAPHIC — MARE CLARA]
Asset type: non-dimensional 3D modeling reference sheet.
Input images: Image 1 is the mandatory master bottle geometry; Image 2 supplies only the approved restrained mineral-blue glass/liquid material; Image 3 supplies only the three-view sheet layout. Do not copy the bottle, black cap, logo or dramatic reflections from Image 3.
Primary request: Render one clean square reference sheet containing exactly three separated views of the same exact master bottle: front elevation, right-side elevation and top view.
Scene/backdrop: uniform neutral mid-gray.
Style/medium: precise orthographic studio render, not a cinematic photograph.
Lighting/mood: flat, soft and perfectly even technical lighting.
Materials/textures: desaturated translucent mineral-blue glass/liquid and the unchanged brushed champagne-metal cylindrical cap.
Constraints: identical scale for front and side; orthographic projection; parallel verticals; blank bottle face; no ground plane, cast shadow, reflection, perspective, depth of field, text, label, logo, symbol, dimensions, arrows or watermark.
Avoid: three-quarter view, extra view, mismatched proportions between views, Image 3 bottle design, black faceted cap, gold collar, water drops, glossy environment reflections.

[04 ORTHOGRAPHIC — NOTURNO ABSOLUTO]
Asset type: non-dimensional 3D modeling reference sheet.
Input images: Image 1 is the mandatory master bottle geometry; Image 2 supplies only the approved smoke-black translucent glass material; Image 3 supplies only the three-view sheet layout. Do not copy the bottle, black cap, logo or dramatic reflections from Image 3.
Primary request: Render one clean square reference sheet containing exactly three separated views of the same exact master bottle: front elevation, right-side elevation and top view.
Scene/backdrop: uniform neutral mid-gray.
Style/medium: precise orthographic studio render, not a cinematic photograph.
Lighting/mood: flat, soft and perfectly even technical lighting with enough transmission to reveal the glass boundaries.
Materials/textures: translucent smoke-black glass with visible edge thickness and the unchanged brushed champagne-metal cylindrical cap.
Constraints: identical scale for front and side; orthographic projection; parallel verticals; blank bottle face; no ground plane, cast shadow, reflection, perspective, depth of field, text, label, logo, symbol, dimensions, arrows or watermark.
Avoid: fully opaque plastic, three-quarter view, extra view, mismatched proportions between views, Image 3 bottle design, black faceted cap, gold collar, glossy environment reflections.

[VIDEO — LENHO VIGIL]
Use the uploaded Lenho Vigil image as both the exact first frame and exact end frame. Preserve the bottle's geometry, amber glass, blank face, cylindrical brushed champagne-metal cap, lighting and background throughout. One continuous six-second shot. The camera glides very slowly to the right in a restrained arc of approximately 15 degrees while moving almost imperceptibly closer, then settles naturally into the supplied matching end frame. Nothing moves except a barely visible atmospheric haze catching the rim light. Deep charcoal environment, dark polished surface, warm key light from the left, hard narrow rim light from behind. Photorealistic luxury product cinematography, shallow depth of field. No cuts, no zoom snaps, no camera shake, no geometry morphing, no cap deformation, no added objects, no text, no logos, no labels, no people, no hands and no audio.
```

- [ ] **Step 4: Verificar o manifesto e a estrutura**

Run:

```powershell
$base = 'docs\media\generated\master-bottle-collection-2026-08-07'
Get-ChildItem -LiteralPath $base -Recurse | Select-Object FullName,Length
Select-String -LiteralPath "$base\prompts\generation-prompts.txt" -Pattern '^\[(01|02|03|04) CINEMATIC','^\[(01|02|03|04) ORTHOGRAPHIC','^\[VIDEO' | Select-Object Line
```

Expected: quatro blocos `CINEMATIC`, quatro `ORTHOGRAPHIC` e um `VIDEO`.

---

### Task 2: Gerar e aprovar as quatro imagens cinematográficas

**Files:**
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/cinematic/01-lenho-vigil.png`
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/cinematic/02-alba-citrica.png`
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/cinematic/03-mare-clara.png`
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/cinematic/04-noturno-absoluto.png`

**Interfaces:**
- Consumes: `_master-bottle.png`, a referência JPEG de atmosfera e os quatro prompts cinematográficos do manifesto.
- Produces: quatro PNGs aprovados, usados pela Task 3; Lenho Vigil também alimenta a Task 4.

- [ ] **Step 1: Gerar Lenho Vigil com referências explicitamente separadas**

Call `image_gen.imagegen` once with:

```json
{
  "referenced_image_paths": [
    "C:/Users/drkzz/loja-perfumes/docs/media/source/_master-bottle.png",
    "C:/Users/drkzz/loja-perfumes/docs/media/source/Perfume_bottle_in_store_2K_202608042308.jpeg"
  ],
  "prompt": "Paste the literal text of [GLOBAL INVARIANTS], then [01 CINEMATIC — LENHO VIGIL], then the final output sentence. Do not send only the heading names or this instruction."
}
```

After the tool returns, create `C:/tmp/loja-perfumes-media/` and copy its exact returned output path to `C:/tmp/loja-perfumes-media/01-lenho-vigil-native.png`. Do not overwrite a pre-existing temporary or final file; if either exists, stop and inspect it first.

- [ ] **Step 2: Gerar Alba Cítrica**

Use these two reference paths: `_master-bottle.png` as Image 1 and `Perfume_bottle_in_store_2K_202608042308.jpeg` as Image 2. Concatenate the complete literal `[GLOBAL INVARIANTS]` and `[02 CINEMATIC — ALBA CITRICA]` blocks into the tool's `prompt` argument; do not send only the heading names. Copy the exact returned output to `C:/tmp/loja-perfumes-media/02-alba-citrica-native.png` without overwriting an existing temporary or final file.

- [ ] **Step 3: Gerar Maré Clara**

Use these two reference paths: `_master-bottle.png` as Image 1 and `Perfume_bottle_in_store_2K_202608042308.jpeg` as Image 2. Concatenate the complete literal `[GLOBAL INVARIANTS]` and `[03 CINEMATIC — MARE CLARA]` blocks into the tool's `prompt` argument; do not send only the heading names. Copy the exact returned output to `C:/tmp/loja-perfumes-media/03-mare-clara-native.png` without overwriting an existing temporary or final file.

- [ ] **Step 4: Gerar Noturno Absoluto**

Use these two reference paths: `_master-bottle.png` as Image 1 and `Perfume_bottle_in_store_2K_202608042308.jpeg` as Image 2. Concatenate the complete literal `[GLOBAL INVARIANTS]` and `[04 CINEMATIC — NOTURNO ABSOLUTO]` blocks into the tool's `prompt` argument; do not send only the heading names. Copy the exact returned output to `C:/tmp/loja-perfumes-media/04-noturno-absoluto-native.png` without overwriting an existing temporary or final file.

- [ ] **Step 5: Normalizar cópias finais para 1920 × 1080 sem deformar o frasco**

Run:

```powershell
$sourceDir = 'C:\tmp\loja-perfumes-media'
$targetDir = 'docs\media\generated\master-bottle-collection-2026-08-07\cinematic'
$names = '01-lenho-vigil','02-alba-citrica','03-mare-clara','04-noturno-absoluto'
foreach ($name in $names) {
  $source = Join-Path $sourceDir ($name + '-native.png')
  $target = Join-Path $targetDir ($name + '.png')
  if (Test-Path -LiteralPath $target) { throw ('Refusing to overwrite ' + $target) }
  ffmpeg -i $source -vf 'scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,setsar=1' -frames:v 1 $target
  if ($LASTEXITCODE -ne 0) { throw ('FFmpeg failed for ' + $source) }
}
```

Expected: quatro cópias finais exatamente 1920 × 1080. Os nativos permanecem em `C:/tmp/loja-perfumes-media/`; o filtro preserva proporções e recorta apenas excedentes do quadro.

- [ ] **Step 6: Verificar dimensões e proporção**

Run:

```powershell
Get-ChildItem -LiteralPath 'docs\media\generated\master-bottle-collection-2026-08-07\cinematic' -File -Filter '*.png' | ForEach-Object {
  $dimensions = & ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 -- $_.FullName
  [PSCustomObject]@{ Name=$_.Name; Dimensions=$dimensions; Bytes=$_.Length }
}
```

Expected: quatro PNGs informando exatamente `1920x1080`. Registrar no relatório final as dimensões nativas preservadas em `C:/tmp/loja-perfumes-media/`.

- [ ] **Step 7: Fazer QA visual individual**

Abrir cada PNG com `view_image` e reprovar se houver qualquer uma destas falhas: tampa preta/facetada, geometria diferente do mestre, texto/logotipo, frasco adicional, pessoa/mão, vidro deformado, ausência de espaço negativo à esquerda ou cenário incompatível com a variante.

Expected: as quatro cenas passam todos os invariantes e são visualmente distintas. Para uma reprovação, executar no máximo uma nova geração com uma única correção explícita e substituir apenas após comparar as versões.

---

### Task 3: Gerar e aprovar as quatro pranchas ortográficas

**Files:**
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/refs-3d/01-lenho-vigil-orthographic.png`
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/refs-3d/02-alba-citrica-orthographic.png`
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/refs-3d/03-mare-clara-orthographic.png`
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/refs-3d/04-noturno-absoluto-orthographic.png`

**Interfaces:**
- Consumes: o mestre como controle geométrico, cada cena cinematográfica como controle de material e a referência PNG como controle exclusivo de layout.
- Produces: quatro pranchas quadradas correspondentes às cenas.

- [ ] **Step 1: Gerar a prancha Lenho Vigil**

Call `image_gen.imagegen` once with:

```json
{
  "referenced_image_paths": [
    "C:/Users/drkzz/loja-perfumes/docs/media/source/_master-bottle.png",
    "C:/Users/drkzz/loja-perfumes/docs/media/generated/master-bottle-collection-2026-08-07/cinematic/01-lenho-vigil.png",
    "C:/Users/drkzz/loja-perfumes/docs/media/source/ChatGPT Image 4 de ago. de 2026, 22_40_18.png"
  ],
  "prompt": "Paste the literal text of [GLOBAL INVARIANTS], then [01 ORTHOGRAPHIC — LENHO VIGIL], then the final output sentence. Do not send only the heading names or this instruction."
}
```

Copy the exact returned output to `C:/tmp/loja-perfumes-media/01-lenho-vigil-orthographic-native.png` without overwriting an existing temporary or final file.

- [ ] **Step 2: Gerar a prancha Alba Cítrica**

Use `_master-bottle.png` as Image 1, `cinematic/02-alba-citrica.png` as Image 2 and `ChatGPT Image 4 de ago. de 2026, 22_40_18.png` as Image 3. Concatenate the literal `[GLOBAL INVARIANTS]` and `[02 ORTHOGRAPHIC — ALBA CITRICA]` blocks into the tool's `prompt` argument. Copy the result to `C:/tmp/loja-perfumes-media/02-alba-citrica-orthographic-native.png` without overwriting an existing temporary or final file.

- [ ] **Step 3: Gerar a prancha Maré Clara**

Use `_master-bottle.png` as Image 1, `cinematic/03-mare-clara.png` as Image 2 and `ChatGPT Image 4 de ago. de 2026, 22_40_18.png` as Image 3. Concatenate the literal `[GLOBAL INVARIANTS]` and `[03 ORTHOGRAPHIC — MARE CLARA]` blocks into the tool's `prompt` argument. Copy the result to `C:/tmp/loja-perfumes-media/03-mare-clara-orthographic-native.png` without overwriting an existing temporary or final file.

- [ ] **Step 4: Gerar a prancha Noturno Absoluto**

Use `_master-bottle.png` as Image 1, `cinematic/04-noturno-absoluto.png` as Image 2 and `ChatGPT Image 4 de ago. de 2026, 22_40_18.png` as Image 3. Concatenate the literal `[GLOBAL INVARIANTS]` and `[04 ORTHOGRAPHIC — NOTURNO ABSOLUTO]` blocks into the tool's `prompt` argument. Copy the result to `C:/tmp/loja-perfumes-media/04-noturno-absoluto-orthographic-native.png` without overwriting an existing temporary or final file.

- [ ] **Step 5: Normalizar cópias finais para 2048 × 2048 sem deformar o frasco**

Run:

```powershell
$sourceDir = 'C:\tmp\loja-perfumes-media'
$targetDir = 'docs\media\generated\master-bottle-collection-2026-08-07\refs-3d'
$names = '01-lenho-vigil','02-alba-citrica','03-mare-clara','04-noturno-absoluto'
foreach ($name in $names) {
  $source = Join-Path $sourceDir ($name + '-orthographic-native.png')
  $target = Join-Path $targetDir ($name + '-orthographic.png')
  if (Test-Path -LiteralPath $target) { throw ('Refusing to overwrite ' + $target) }
  ffmpeg -i $source -vf 'scale=2048:2048:force_original_aspect_ratio=decrease:flags=lanczos,pad=2048:2048:(ow-iw)/2:(oh-ih)/2:color=#808080,setsar=1' -frames:v 1 $target
  if ($LASTEXITCODE -ne 0) { throw ('FFmpeg failed for ' + $source) }
}
```

Expected: quatro pranchas finais exatamente 2048 × 2048; imagens não quadradas recebem apenas margens cinza neutras, sem recorte ou deformação.

- [ ] **Step 6: Verificar formato e QA técnico**

Run:

```powershell
Get-ChildItem -LiteralPath 'docs\media\generated\master-bottle-collection-2026-08-07\refs-3d' -File -Filter '*.png' | ForEach-Object {
  $dimensions = & ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 -- $_.FullName
  [PSCustomObject]@{ Name=$_.Name; Dimensions=$dimensions; Bytes=$_.Length }
}
```

Expected: quatro imagens `2048x2048`. Em `view_image`, cada arquivo deve apresentar exatamente três vistas, escala frontal/lateral coerente, verticais paralelas, fundo cinza uniforme, tampa champanhe cilíndrica e ausência de texto, sombra, reflexo ambiental e perspectiva. Executar no máximo uma correção direcionada por prancha reprovada.

---

### Task 4: Gerar um único vídeo Lenho Vigil no fal.ai

**Files:**
- Temporary: `C:/tmp/loja-perfumes-media/01-lenho-vigil-loop-6s-raw.mp4`
- Create: `docs/media/generated/master-bottle-collection-2026-08-07/video/01-lenho-vigil-loop-6s-1080p.mp4`

**Interfaces:**
- Consumes: `cinematic/01-lenho-vigil.png` e o prompt `[VIDEO — LENHO VIGIL]`.
- Produces: um MP4 bruto de seis segundos para normalização local.

- [ ] **Step 1: Executar preflight de acesso sem revelar credenciais**

Run:

```powershell
if (Test-Path Env:FAL_KEY) { 'FAL_KEY_AVAILABLE' } else { 'FAL_KEY_MISSING' }
```

Expected in the current environment: `FAL_KEY_MISSING`. Open the official Vidu Q2 Pro playground in the browser and inspect whether a fal.ai session is already authenticated. If neither an authenticated session nor `FAL_KEY` is available, pause and ask the user to sign in or set `FAL_KEY` locally; never request that the key be pasted into chat.

- [ ] **Step 2: Configurar exatamente um job pago no playground**

Open: `https://fal.ai/models/fal-ai/vidu/q2/image-to-video/pro`

Set:

```text
Prompt: complete [VIDEO — LENHO VIGIL] block from generation-prompts.txt
Image Url / start image: cinematic/01-lenho-vigil.png
End Image Url: cinematic/01-lenho-vigil.png
Duration: 6
Resolution: 1080p
Movement amplitude: small
BGM: false
```

Expected estimated charge from the official page on 2026-08-07: US$0.30 base + US$0.10 per second = approximately US$0.90 for one six-second 1080p render. The user already authorized credit/token use, but this plan permits only one video job.

- [ ] **Step 3: Enviar o job e aguardar o resultado**

Submit once. Monitor until the job is complete; do not submit a duplicate while it is queued or processing.

Expected: one MP4 result. Download it to `C:/tmp/loja-perfumes-media/01-lenho-vigil-loop-6s-raw.mp4`.

- [ ] **Step 4: Normalizar resolução, duração, codec e ausência de áudio**

Run:

```powershell
New-Item -ItemType Directory -Force -Path 'C:\tmp\loja-perfumes-media' | Out-Null
ffmpeg -y -i 'C:\tmp\loja-perfumes-media\01-lenho-vigil-loop-6s-raw.mp4' -t 6 -an -vf 'scale=1920:1080:flags=lanczos,setsar=1' -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart 'docs\media\generated\master-bottle-collection-2026-08-07\video\01-lenho-vigil-loop-6s-1080p.mp4'
```

Expected: exit code 0 and a non-empty final MP4. Preserve the raw file in `C:/tmp` until all QA is complete.

---

### Task 5: Validar tecnicamente e visualmente a entrega

**Files:**
- Inspect: all nine deliverables under `docs/media/generated/master-bottle-collection-2026-08-07/`
- Temporary: `C:/tmp/loja-perfumes-media/loop-first.png`
- Temporary: `C:/tmp/loja-perfumes-media/loop-last.png`
- Temporary: `C:/tmp/loja-perfumes-media/loop-comparison.png`

**Interfaces:**
- Consumes: oito PNGs e o MP4 normalizado.
- Produces: evidência de inventário, propriedades técnicas e continuidade do loop.

- [ ] **Step 1: Conferir o inventário final**

Run:

```powershell
$base = 'docs\media\generated\master-bottle-collection-2026-08-07'
Get-ChildItem -LiteralPath $base -Recurse -File | Select-Object FullName,Length | Sort-Object FullName
```

Expected: quatro PNGs em `cinematic`, quatro PNGs em `refs-3d`, um MP4 em `video` e um TXT em `prompts`; todos maiores que zero.

- [ ] **Step 2: Validar duração, resolução, taxa de quadros e ausência de áudio**

Run:

```powershell
$video = 'docs\media\generated\master-bottle-collection-2026-08-07\video\01-lenho-vigil-loop-6s-1080p.mp4'
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,codec_name -of default=nw=1 $video
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 $video
$audio = ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 $video
if ($audio) { throw 'O vídeo final ainda contém faixa de áudio.' } else { 'NO_AUDIO_STREAM' }
```

Expected: `width=1920`, `height=1080`, codec `h264`, duração entre `5.99` e `6.01` segundos e `NO_AUDIO_STREAM`.

- [ ] **Step 3: Extrair e comparar os quadros inicial e final**

Run:

```powershell
$video = 'docs\media\generated\master-bottle-collection-2026-08-07\video\01-lenho-vigil-loop-6s-1080p.mp4'
ffmpeg -y -ss 0 -i $video -frames:v 1 'C:\tmp\loja-perfumes-media\loop-first.png'
ffmpeg -y -sseof -0.04 -i $video -frames:v 1 'C:\tmp\loja-perfumes-media\loop-last.png'
ffmpeg -y -i 'C:\tmp\loja-perfumes-media\loop-first.png' -i 'C:\tmp\loja-perfumes-media\loop-last.png' -filter_complex 'hstack=inputs=2' 'C:\tmp\loja-perfumes-media\loop-comparison.png'
ffmpeg -i 'C:\tmp\loja-perfumes-media\loop-first.png' -i 'C:\tmp\loja-perfumes-media\loop-last.png' -lavfi ssim -f null NUL
```

Expected: `loop-comparison.png` mostra enquadramentos visualmente próximos e o log SSIM informa similaridade global suficiente para não haver salto evidente; usar `All >= 0.70` como triagem quantitativa, complementada por inspeção visual.

- [ ] **Step 4: Assistir ao vídeo completo sem áudio**

Inspect the final MP4 from start to finish. Reject if the bottle morphs, the cap changes, text/logo appears, an object moves, the camera shakes, a cut occurs, the movement is abrupt or the loop has a visible discontinuity.

Expected: movimento único, lento e contínuo; apenas névoa sutil; identidade do frasco estável; primeiro e último enquadramentos semelhantes.

- [ ] **Step 5: Verificar que alterações do usuário continuam fora do escopo**

Run:

```powershell
git status --short
```

Expected: nenhuma página, componente ou teste é alterado por este plano. Os arquivos binários da coleção permanecem não rastreados, e todas as alterações que já pertenciam ao usuário continuam preservadas.

- [ ] **Step 6: Entregar caminhos, prompts e limitações**

Reportar ao usuário:

```text
Pasta da coleção: docs/media/generated/master-bottle-collection-2026-08-07/
Imagens cinematográficas: 4
Pranchas 3D: 4
Vídeos: 1
Prompt utilizado: prompts/generation-prompts.txt
Geradores: OpenAI built-in image_gen e fal.ai Vidu Q2 Pro
QA: dimensões das imagens, duração/resolução/áudio do vídeo, identidade do frasco e continuidade do loop
```

Incluir qualquer limitação observada de resolução nativa, fidelidade geométrica ou suavidade do loop, sem declarar aprovação quando um critério tiver falhado.

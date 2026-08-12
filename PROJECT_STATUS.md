# PROJECT STATUS

> Arquivo de progresso exigido pelo prompt mestre (linha 43).
> Atualizado em 2026-08-10. Branch de trabalho: `feat/loja-perfumes`.

## Estado atual

**Fase 1 — Descoberta: em andamento (parcial).**

## Ambiente verificado

| Item | Estado | Evidência |
|---|---|---|
| Repositório | `C:\Users\drkzz\loja-perfumes` | `git rev-parse --show-toplevel` |
| Remoto | `github.com/DHTheOne/loja-perfumes` (privado) | `git remote -v` |
| Branch principal | `main` — commit raiz `d055a2e` | `git branch -vv` |
| Branch de trabalho | `feat/loja-perfumes` (ativa, rastreando origin) | `git branch -vv` |
| Stack existente | Nenhuma — diretório era vazio | `git ls-files` retornou só `README.md` |
| MCP KAIROGEN | **Conectado** | `get_me_context` respondeu com conta ativa |

## KAIROGEN — inspeção real (seção 7 do prompt)

Executado somente-leitura, sem geração paga.

| Dado | Valor verificado |
|---|---|
| Conta | `drkzzinmalado` |
| Plano | **FREE** |
| Créditos disponíveis | **0** |
| Valor do crédito | R$ 0,175 |
| Gerações simultâneas | 1 |
| Modelos de imagem | 16 |
| Modelos de vídeo (família Veo) | 3 |

Custos medidos via `estimate_cost` (plano free):

| Modelo | Tipo | Créditos | Custo aprox. |
|---|---|---|---|
| `seedream-v4-5` | imagem (até 4096×4096) | 2 | R$ 0,35 |
| `nano-banana-pro` | imagem | 6 | R$ 1,05 |
| `veo-3-1-fast` | vídeo 6s | 23 | R$ 4,03 |

**R1 CONTORNADO em 2026-08-04.** Saldo zero continua impedindo geração via KAIROGEN,
mas deixou de bloquear a Fase 6: o proprietário optou pela trilha gratuita, usando
ChatGPT Plus e Google AI Pro que já assina. Estratégia, prompts e cálculo de saldo
em `MEDIA_PLAN.md` e `docs/media/PROMPTS.md`.

Saldo necessário se optar pela trilha paga depois: **~500 créditos ≈ R$ 88**
(cenário recomendado). Detalhamento na seção 7 de `MEDIA_PLAN.md`.

## Entregas desta fase

### Concluído

- [x] Repositório Git criado e verificado
- [x] Remoto `origin` configurado e branches publicadas
- [x] Branch `feat/loja-perfumes` isolada da principal
- [x] MCP KAIROGEN inspecionado com dados reais
- [x] `PROJECT_BRIEF.md`
- [x] `ARCHITECTURE.md`
- [x] `PROJECT_STATUS.md`
- [x] `MEDIA_PLAN.md` — inclui cálculo de saldo KAIROGEN e trilha gratuita
- [x] `docs/media/PROMPTS.md` — prompts prontos para ChatGPT Plus e Google AI Pro
- [x] `SECURITY_PLAN.md`
- [x] `DATABASE_SCHEMA.md`
- [x] `DEPLOYMENT.md`
- [x] `.env.example`
- [x] `docs/decisions/ADR-0001-stack.md`
- [x] `docs/decisions/ADR-0002-orm.md`
- [x] `docs/decisions/ADR-0003-escopo-operacional-v1.md`
- [x] `docs/decisions/ADR-0004-gateway-pagamento.md`

### Pendente na Fase 1

- [ ] Aprovação do proprietário sobre `ARCHITECTURE.md`
- [ ] Aprovação (ou substituição) dos nomes de linha propostos em `MEDIA_PLAN.md` §5

## Decisões registradas do proprietário

| Data | Decisão | Valor | Registro |
|---|---|---|---|
| 2026-08-04 | Gateway de pagamento | **Mercado Pago** | ADR-0004, `ARCHITECTURE.md` §5.1 |
| 2026-08-04 | Abordagem de mídia | **Placeholders neutros + geração gratuita** | `MEDIA_PLAN.md` §1 |

## Riscos abertos

| # | Risco | Severidade | Estado |
|---|---|---|---|
| R1 | KAIROGEN sem créditos | Alta → **Baixa** | **Contornado** — trilha gratuita adotada em 2026-08-04 |
| R2 | Escopo muito maior que uma entrega curta | Alta | Mitigado por fases |
| R3 | Gateway de pagamento indefinido | Alta → — | **Resolvido** — Mercado Pago, 2026-08-04 |
| R4 | Complexidade enterprise vs projeto inicial | Média | Endereçado no ADR-0003 |
| R5 | Textos legais sem revisão profissional | Média | Minutas publicadas com banner obrigatório (2026-08-07); aberto até revisão jurídica |
| R6 | 3D pesado prejudicar mobile | Média | Mitigação arquitetural definida |
| R7 | Uso comercial da saída das ferramentas de IA não confirmado | Média | **Novo** — checklist em `MEDIA_PLAN.md` §2 |
| R8 | Nomes de linha fictícios sem busca de anterioridade de marca | Média | **Novo** — obrigatório antes do lançamento |
| R10 | ~~Hero cinematográfico sem recorte retrato no mobile~~ | — | **Resolvido em 2026-08-10.** Composição 9:16 dedicada (vídeo e poster): faixa nítida no terço superior sobre extensão desfocada do próprio quadro, terço inferior livre para a tipografia. Não é recorte — cortar 1080 de largura de um quadro de 1920 decepa o frasco no clímax, quando ele encosta nas bordas |
| R11 | 39,7 MB de vídeo versionados em `public/media/cinema/` | Média | **Novo (2026-08-10)** — coerente com MEDIA_PLAN §8, que admite `public/media/` no repositório, mas é peso permanente no Git. Só o clipe do hero é baixado na abertura; os outros cinco existem para os capítulos ainda não construídos. Decisão do proprietário: manter, ou mover a mídia para object storage já na Fase 5 |
| R9 | Sacola sem checkout real: fluxo termina numa página explicativa | Média | **Novo (2026-08-10)** — deliberado. Coletar nome, endereço ou pagamento exige decisões pendentes do proprietário (provedor de e-mail, frete, dados fiscais) e credenciais do Mercado Pago que não estão configuradas. Formulário que descarta o que recebe é pior que nenhum: a pessoa entregaria dados achando que virou pedido. `/sacola/checkout` lista as pendências reais |

## Decisões ainda pendentes do proprietário

Nenhuma bloqueia as Fases 2 a 5.

1. `[NOME_DA_LOJA]`, `[DOMINIO]`, `[EMAIL_DE_SUPORTE]`, `[CNPJ_OU_DADOS_DA_EMPRESA]`
2. `[PROVEDOR_DE_EMAIL]` — bloqueia e-mails transacionais reais
3. `[PROVEDOR_DE_HOSPEDAGEM]` — bloqueia a Fase 12
4. Estratégia de frete (tabela própria ou integração com transportadora)
5. Nomes das 7 linhas de fragrância (proposta em `MEDIA_PLAN.md` §5)

## Fase 2 — em andamento desde 2026-08-04

Aplicação inicializada conforme `ARCHITECTURE.md` e ADR-0001.

| Entrega | Estado | Verificação |
|---|---|---|
| Next.js 16 + React 19 + TS strict + Tailwind 4 | Feito | `next build` OK |
| three, @react-three/fiber, @react-three/drei | Feito | 0 vulnerabilidades no install |
| `src/3d/Bottle.tsx` — frasco procedural | Feito | Renderiza no navegador |
| `src/3d/HeroScene.tsx` — luz, ambiente, chão | Feito | Sem erro de console |
| Fallback sem WebGL + `prefers-reduced-motion` + dispositivo fraco | Feito (2026-08-07) | Verificado em navegador: E2E Playwright cobre os 3 caminhos e prova que o chunk do three.js não é sequer baixado |
| `src/ui/tokens.ts` + `globals.css` | Feito | Paleta amostrada do lote 01 |
| Home com hero | Feito | `tsc` e `eslint` limpos |
| Catálogo estático — 7 linhas com atributos de perfumaria | Feito (2026-08-07) | 11 testes vitest de integridade |
| Header, footer e wordmark provisório ("Sillage") | Feito (2026-08-07) | Centralizado em `src/config/site.ts`; pendente aprovação do proprietário |
| Páginas `/colecoes`, `/perfumes/[slug]` (SSG) e `/sobre` | Feito (2026-08-07) | `next build`: 13 páginas estáticas |
| Placeholder programático do frasco (`BottleGlyph`) | Feito (2026-08-07) | Trilha A do MEDIA_PLAN §3, em CSS puro |
| Verificação visual desktop + mobile (375 px) | Feito (2026-08-07) | Screenshots Playwright no servidor de produção |
| Filtros por família e ocasião em `/colecoes` | Feito (2026-08-07) | URL como estado; parsers com allowlist testados |
| Página 404 e minutas legais (`/privacidade`, `/termos`, `/trocas`) | Feito (2026-08-07) | Banner de minuta obrigatório — risco R5 sinalizado no site |
| Suíte ampliada: 77 testes unitários + 18 E2E | Feito (2026-08-07) | `vitest --coverage` (v8) com threshold de 80% travado; `src/3d` segue excluído e é coberto pelo Playwright |
| Carregamento sob demanda do 3D (ARCHITECTURE §9) | Feito (2026-08-07) | `HeroVisual` carrega a cena em `requestIdleCallback`; three.js (968 KB) fora dos 8 chunks iniciais da home |
| Fallback móvel com art direction | Feito (2026-08-07) | `<picture>` serve `hero-mobile.jpg` (retrato) até 767 px; E2E confirma `currentSrc` por viewport |
| Desacoplamento catálogo → UI (ARCHITECTURE §2) | Feito (2026-08-07) | `lineKey` saiu de `FragranceLine`; mapa slug → vidro em `src/ui/lineVisual.ts` |
| `robots.txt`, `sitemap.xml` e `metadataBase` | Feito (2026-08-07) | Minutas com `noindex` + `disallow`, fora do sitemap; invariante travado em `seo.test.ts` |
| Revisão do relatório 2026-08-07 — itens ALTA, MÉDIA e BAIXA | Feito (2026-08-07) | 8/8 itens tratados; ver seção "Riscos" para o que segue aberto |
| Cartão de compartilhamento (Open Graph + Twitter) | Feito (2026-08-09) | Não existia nenhuma tag: o link do site era publicado sem imagem e sem título em WhatsApp, Instagram, X e LinkedIn. `openGraphFor()` em `src/config/site.ts` monta o bloco; conferido por `curl` nas 5 rotas |
| `canonical` por página | Feito (2026-08-09) | `/colecoes` tinha as combinações de filtro competindo entre si como URLs distintas do mesmo catálogo |
| JSON-LD `schema.org/Product` nas 7 páginas de produto | Feito (2026-08-09) | Preço, moeda e `PreOrder` — vendas não abriram, anunciar `InStock` seria declarar estoque inexistente |
| `theme-color` + `colorScheme: dark` | Feito (2026-08-09) | A barra do Chrome no Android abria clara sobre a página escura |
| Testes de regressão de Open Graph | Feito (2026-08-09) | 8 casos novos em `seo.test.ts` (77 → 85). Verificados por reintrodução da falha: o teste fica vermelho |
| Favicon próprio | Feito (2026-08-09) | Era o padrão do `create-next-app` (logo do Next.js) desde o scaffold. Trocado pela silhueta do frasco em champanhe sobre `--surface-void`, nas proporções do `BottleGlyph`: `src/app/icon.svg` + `src/app/favicon.ico` (16/32/48/64 px). Legibilidade conferida renderizando a 16 px |
| Cinematográficas servidas em cards e produto | Feito (2026-08-10) | `npm run media:lines` converte os 7 PNG mestres em WebP de 1600 px: 1,4–1,9 MB por arquivo viraram 26–49 KB, 253 KB no total. `LineCard` e a página de produto passaram a usá-las, com `BottleGlyph` preservado como fallback na mesma caixa 16:9. Cada produto anuncia a própria imagem no cartão social — antes as sete publicavam o mesmo frasco |
| Cavidade interna do frasco 3D | Feito (2026-08-10) | Parede de 0,055 com `backside`, e o líquido passou a carregar a cor da linha (atenuação 0,22 contra 5,5 da parede). Aninhar dois `MeshTransmissionMaterial` foi tentado e descartado: cada um desenha a cena num buffer que exclui a si mesmo, e o frasco virou placa opaca |
| Realismo do render do hero | Feito (2026-08-10) | `Backdrop` de estúdio atrás do frasco — material de transmissão sobre fundo preto devolve preto, e era isso que fazia o vidro ler como superfície chapada. Névoa recuada para 6..11 para não anular o backdrop; `envMapIntensity` 1,6 nas arestas |
| Cena 3D nas páginas de produto | Feito (2026-08-10) | Vidro na cor da família; `useSceneAllowed` e `StudioEnvironment` extraídos para não duplicar critério de carga nem luz. O fallback passou a ser a cinematográfica da própria linha |
| Revelação por rolagem sem JavaScript | Feito (2026-08-10) | `animation-timeline: view()` dentro de `@supports`, com gate próprio de `prefers-reduced-motion` — o kill-switch global zera `animation-duration`, que animação por rolagem não usa |
| Guia de notas em `/notas` | Feito (2026-08-10) | 61 notas em 7 linhas, 3 atravessando mais de uma. Índice derivado do catálogo, não lista paralela. `/familias/[familia]` foi descartada por competir com `/colecoes?familia=` |
| Sacola e etapa de checkout | Feito (2026-08-10) | Estado em `localStorage` via `useSyncExternalStore`; preço lido do catálogo, nunca copiado para o item. Checkout sem formulário de propósito — ver "Riscos" |
| Pipeline de vídeo cinematográfico | Feito (2026-08-10) | `npm run media:cinema` gera desktop/mobile/poster/último-quadro dos 6 CGI. Sem áudio (§26), `faststart` e GOP 12 — o GOP curto é o que torna o scrub viável, porque busca só pousa em keyframe |
| Hero cinematográfico com scrub por rolagem | Feito (2026-08-10) | Branch `feat/cinematic-scroll`. A rolagem é a linha do tempo do clipe `concreto`, escolhido por ser o único com movimento monotônico. Progresso escrito como custom property dentro do rAF — zero re-render do React por quadro. Sem GSAP |
| Sistema de movimento e escala de camadas | Feito (2026-08-10) | 4 durações e 4 curvas nomeadas por papel, 6 camadas fixas (`--layer-*`) em `globals.css` |
| Lint limpo no projeto inteiro | Feito (2026-08-09) | `npm run lint` acusava aviso em `coverage/block-navigation.js`, JS de terceiros do relatório do v8. O `eslint.config.mjs` é protegido por hook, então a exclusão foi para o script: `--ignore-pattern` para `coverage`, `test-results` e `playwright-report`. Os configs da raiz continuam sendo verificados |

### Mídia — lote 01

- 32 imagens do grupo A **aprovadas** e ampliadas para 4K por Lanczos.
  Menor resultado: 9 MP. Ver `docs/media/ANALISE-LOTE-01.md`.
- Grupo B (2 JPEG + 6 vídeos) **reprovado** para uso de produto: frasco
  divergente do mestre, emblema no vidro e texto queimado na imagem.
- Real-ESRGAN avaliado e descartado — exagera o metal escovado.

### Pendente

- [ ] Regerar os vídeos anexando `_master-bottle.png` como referência
- [ ] Gerar as 6 referências ortográficas (`PROMPTS.md` §12)
- [ ] Cavidade interna do frasco 3D — exige geometria de casca, não sólido
- [x] Fallback sem WebGL testado (2026-08-07): `e2e/hero.spec.ts` desabilita
      `getContext('webgl')` e prova que a cena não é baixada
- [x] Testes em 2026-08-07 (commit `7b29101`): 77 testes vitest em 12 arquivos
      + 18 E2E Playwright em desktop e mobile. Cobertura 92,15% de statements
      / 92,75% de linhas, com piso de 80% travado no `vitest.config.mts`;
      `src/3d` segue fora do denominador e é coberto pelo E2E

## Experiência cinematográfica — branch `feat/cinematic-scroll`

Trabalho em andamento, isolado da `feat/loja-perfumes`. Commits: `c91c361`
(hero com scrub por rolagem) e `c33888e` (composição 9:16 e header no celular).

**Feito:** capítulo 01 (hero) com a rolagem controlando o clipe `concreto`;
composição vertical própria para celular; sistema de movimento (`--motion-*`,
`--ease-*`) e escala de camadas (`--layer-*`); pipeline `npm run media:cinema`
gerando 4 variantes dos 6 clipes.

### Retomada de 2026-08-12 — os cinco itens acordados

Os itens 1, 2, 4 e 5 estão **feitos**. O item 3 é conferência do proprietário
e continua aberto por natureza.

| # | Item | Estado | Verificação |
|---|---|---|---|
| 1 | Rolagem inercial (Lenis) | **Feito** (`75b4de1`) | 5 cliques de roda de 200 px: salto máximo por quadro caiu de 200 para **22 px**. Teclado real por CDP: PageDown 630 com Lenis e 630 sem, ArrowDown ×5 = 200, Space 630, End 4639. Skip link foca e leva ao `#conteudo`. Sob `prefers-reduced-motion` a instância é destruída e `html.lenis` sai da árvore |
| 2 | Capítulo 02 (`galeria`) com match cut | **Feito** (`cf0cf04`) | `--p` 0,8125 → `currentTime` 6,50 s (0,8125 × 8 s) |
| 3 | Conferência de ritmo pelo proprietário | **Aberto** | Só o proprietário julga. Ver "A decidir" abaixo |
| 4 | Capítulos 03 a 06 | **Feito** (`cf0cf04`) | Os 6 clipes estão na home; 10 casos E2E novos, desktop e mobile |
| 5 | Faixa de 768–1200 px | **Feito** (`cf0cf04`) | Scrim **lateral** do lado do texto, no hero e nos capítulos |

**`src/cinema/CinematicChapter.tsx`** generaliza o hero, com três gestos
extraídos das quatro referências. O que se copia é a linguagem de movimento,
não layout nem identidade:

1. **Match cut** — o capítulo abre exibindo o último quadro do anterior e
   dissolve dele. Só onde os capítulos são ADJACENTES (02 e 04): anunciar
   continuidade com uma seção de conteúdo no meio mostraria a imagem errada
   dissolvendo. As `-tail.jpg` já existiam e nunca tinham sido usadas.
2. **Recuo para moldura** — a mídia sangra até a borda e recua para uma moldura
   arredondada por `clip-path`, revelando a cor de ambiente. O espaço negativo
   não é decidido no layout: é criado pelo movimento.
3. **Tipografia que cede** — entra em 0,04–0,20, permanece no miolo, sai em
   0,58–0,82 por opacidade E deslocamento.

**Carga sob demanda** (`useArmWhenNear`): seis clipes de 3 a 6 MB seriam ~30 MB
para ver a primeira tela. O `<video>` só monta quando o capítulo se aproxima;
até lá o poster sustenta a composição. Medido em aba nova: **1 vídeo na
abertura**, 2 no capítulo 02. O caso E2E que conta vídeos montados foi
verificado por reintrodução da falha — com o hook armado de saída ele fica
vermelho com `unexpected value 6`.

**Match cut agora existe nas duas orientações.** O pipeline passou a gerar
também `-tail-vertical.jpg`, extraído do master pelo MESMO filtro do vídeo
9:16 — e não recortado do `-tail.jpg`, que não teria a extensão desfocada e
entregaria uma imagem que nunca esteve na tela. A escolha entre os dois
quadros é do navegador, por `<picture>` com a mesma media query do poster
(`max-aspect-ratio: 3/4`), então `matchFrom` passou a receber o SLUG do
capítulo anterior em vez de um caminho já resolvido: a orientação não existe
no servidor, e só o cliente pode decidir.

O caso E2E foi verificado por reintrodução da falha, com o `<source>`
apontando para o quadro 16:9: fica vermelho em mobile com
`Received "…/concreto-tail.jpg"` contra o padrão `…/concreto-tail-vertical.jpg`.
A verificação é por `currentSrc`, não por `src` — com art direction o atributo
`src` continua sendo o 16:9 em qualquer orientação.

> Armadilha registrada: o E2E roda contra o BUILD DE PRODUÇÃO
> (`playwright.config.ts`, `npx next start`) com `reuseExistingServer`. Editar
> o código-fonte e rodar o Playwright direto testa o build ANTIGO e produz
> verde falso — foi exatamente o que aconteceu na primeira tentativa deste
> item. Rode `npx next build` antes de confiar em qualquer resultado.

**A decidir pelo proprietário — ritmo.** A home passou a ter **19 telas de
altura** (17 252 px a 910 px de viewport), efeito de seis capítulos com trilho
de 220 a 320 svh. Reduzir os trilhos encurta a página e acelera a câmera;
manter privilegia o peso cinematográfico. Não há resposta técnica: depende de
rolar e sentir.

**Atribuição dos 6 clipes**, derivada do que cada um faz de melhor:

| Capítulo | Clipe | Razão |
|---|---|---|
| 01 Hero | `concreto` ✔ | Único com movimento monotônico — o scrub não inverte |
| 02 Essência | `galeria` | Maior amplitude de escala; o recuo CRIA o espaço negativo onde as notas entram |
| 03 Atmosfera | `salao-luz` | Termina limpo sobre quase-preto — emenda com `--surface-void` sem corte |
| 04 Material | `pedra-vapor` | Vapor contínuo: laço ambiente que não compete com o texto |
| 05 Editorial | `travertino` | O único quase estático — aceita tipografia por cima |
| 06 Fechamento | `pedestal-ambar` | Coluna vertical de luz vira eixo central para o CTA |

**Regra reafirmada pelo proprietário:** as referências valem pela linguagem de
movimento e fluidez, não por cópia de layout, identidade ou composição — são
sites comerciais reais.

## Próximo passo

1. Proprietário aprova (ou substitui) o wordmark provisório "Sillage" e os
   nomes de linha do `MEDIA_PLAN.md` §5 — agora visíveis no site.
2. ~~**Integrar as 7 cinematográficas ao site**~~ **Feito em 2026-08-10**
   (commit `8dcb769`): WebP em `public/media/lines/`, ligadas em `LineCard` e
   na página de produto, e cartão social por linha.
3. Regerar o vídeo do hero com o frasco mestre.
4. ~~Integrar a branch `feat/media-master-bottle`~~ **Feito em 2026-08-07**:
   squash merge no commit `ba10ee3` (9 arquivos — 8 PNG + manifesto de
   prompts, 8/8 hashes conferidos com `4e40268`). O `--squash` deixou de fora
   os 4 commits vazios da branch (`81b0742`, `b6e7299`, `fdf672b`, `2262e96`).
   A branch e o worktree `.worktrees/media-master-bottle` podem ser removidos
   quando o proprietário quiser — todo o conteúdo já está na
   `feat/loja-perfumes`.
5. ~~**Backup de `docs/media/source/`**~~ — **parcialmente resolvido em
   2026-08-09**. Cópia verificada em
   `D:\backups\loja-perfumes\media-source-2026-08-09`: 74 arquivos, 375,2 MB,
   os 74 conferidos por SHA-1 contra a origem, zero divergências. O `D:` é
   **disco físico distinto** do `C:` (`Get-Partition`: disco 0 = WDC SATA SSD
   223 GB com o `C:`; disco 1 = WD Green SN350 NVMe 1 TB com o `D:`), então a
   falha de disco único — o risco que estava registrado — deixou de existir.
   **Continua pendente cópia externa à máquina**: incêndio, furto, ransomware
   ou erro humano ainda atingiriam as duas cópias. Decisão do proprietário
   sobre nuvem, disco removível ou object storage. O texto original do risco
   segue abaixo para rastreabilidade.

   Texto original: **Backup externo de `docs/media/source/`** — 77 arquivos, ~380 MB fora do
   Git por política (MEDIA_PLAN §8), sem nenhuma cópia em outro lugar:
   originais do lote 01, upscales 4K (255 MB), vídeos e o `_master-bottle.png`.
   Disco único é hoje o maior risco de perda do projeto. Decisão do
   proprietário: nuvem, disco externo, object storage ou repositório de mídia
   dedicado.

### Mídia — conjunto do frasco mestre (branch `feat/media-master-bottle`)

Cobertura por linha do catálogo, em `docs/media/generated/master-bottle-collection-2026-08-07/`:

| Linha | `cinematic/` | `refs-3d/` |
|---|---|---|
| `lenho-vigil` | ✔ 1920×1080 | ✔ 2048×2048 |
| `alba-citrica` | ✔ 1920×1080 | ✔ 2048×2048 |
| `mare-clara` | ✔ 1920×1080 | ✔ 2048×2048 |
| `noturno-absoluto` | ✔ 1920×1080 | ✔ 2048×2048 |
| `flora-velada` | ✔ 1672×941 (**regerada** 2026-08-09) | ✔ 1254×1254 (2026-08-07) |
| `ambar-secreto` | ✔ 1672×941 (2026-08-07) | ✔ 1254×1254 (2026-08-07) |
| `comum-raro` | ✔ 1672×941 (2026-08-07) | ✔ 1254×1254 (2026-08-07) |

**Conjunto completo: 7 cinematográficas distintas + 7 folhas ortográficas.**

### Duplicata da Flora Velada — detectada e corrigida em 2026-08-09

A tabela afirmava cinematográfica entregue em 1920×1080. A comparação por
pixel mostrou que `cinematic/05-flora-velada.png` era **a mesma imagem** de
`cinematic/01-lenho-vigil.png`: diferença média 0,00 em RGB, tom médio
idêntico (`rgb(46, 29, 18)`), âmbar amadeirado. Os bytes diferiam só por
recompressão (2,94 MB contra 1,79 MB) — por isso o hash não denunciou e o
registro passou como entregue. Flora Velada é a linha **floral**: publicar
aquela imagem mostraria o frasco errado na página do produto.

**Causa provável.** O prompt original mandava usar uma "Imagem 2" como
referência de clima e composição. Com uma cinematográfica pronta nesse papel,
o modelo devolveu a própria referência em vez de compor uma cena nova.

**Correção.** Regerada em 2026-08-09 usando **apenas** `_master-bottle.png`
como referência, sem segunda imagem, e com instrução explícita proibindo
devolver imagem anterior. Resultado: 1672×941, tom médio `rgb(229, 218, 205)`
— marfim claro, vidro opalino leitoso, contra `rgb(46, 29, 18)` da âmbar.

**Verificação.** O detector compara todos os 21 pares das 7 imagens após
normalizá-las para 160×160: nenhum par abaixo do limiar. As 7 folhas
ortográficas passaram pelo mesmo teste e também são distintas.

Das 6 imagens tidas como novas em 2026-08-07 (3 cinematográficas + 3
ortográficas), **5 são de fato novas**: as cinematográficas de Âmbar Secreto e
Comum Raro e as 3 folhas ortográficas. A sexta — a cinematográfica de Flora
Velada — é a duplicata descrita acima. Todas foram geradas via ChatGPT (GPT
Image), usando `_master-bottle.png` como referência de geometria e uma folha
ortográfica existente como referência de layout de três vistas; prompts em
`prompts/generation-prompts-lines-05-07.txt`.

Ressalva de resolução (pendência menor, não bloqueia uso): as imagens geradas
nesta sessão saíram menores que as originais do time — cinematográficas de
Âmbar e Comum Raro a 1672×941 (vs 1920×1080), e as 3 ortográficas novas a
1254×1254 (vs 2048×2048) — por ser a maior resolução que a página do ChatGPT
liberou. Uniformizar é opcional.

Os originais de referência em `docs/media/source/` (3 arquivos, ~5 MB, entre
eles `_master-bottle.png`) seguem **fora do Git por política** (MEDIA_PLAN §8)
e não têm backup externo — pendência do proprietário.

## Regra de portão

Conforme linha 1335 do prompt mestre: não avançar de fase havendo falha crítica
conhecida na fase atual. Não há falha crítica aberta na Fase 1. R5, R7 e R8 são
bloqueios de **lançamento**, não de fase, e estão registrados como tal.

# PROJECT STATUS

> Arquivo de progresso exigido pelo prompt mestre (linha 43).
> Atualizado em 2026-08-07. Branch de trabalho: `feat/loja-perfumes`.

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

## Próximo passo

1. Proprietário aprova (ou substitui) o wordmark provisório "Sillage" e os
   nomes de linha do `MEDIA_PLAN.md` §5 — agora visíveis no site.
2. **Regerar a cinematográfica da `flora-velada`** (a atual é duplicata — ver
   correção acima) e só então substituir o `BottleGlyph` nos cards pelas
   imagens por linha. As 6 imagens boas seguem em `docs/media/generated/` e
   **ainda não são servidas pelo site**: falta convertê-las para WebP/AVIF em
   tamanhos web, movê-las para `public/media/lines/` e ligá-las em `LineCard`
   e na página de produto. Regerar depende das contas do proprietário
   (ChatGPT Plus / Google AI Pro), por isso a integração está parada em 6/7.
3. Regerar o vídeo do hero com o frasco mestre.
4. ~~Integrar a branch `feat/media-master-bottle`~~ **Feito em 2026-08-07**:
   squash merge no commit `ba10ee3` (9 arquivos — 8 PNG + manifesto de
   prompts, 8/8 hashes conferidos com `4e40268`). O `--squash` deixou de fora
   os 4 commits vazios da branch (`81b0742`, `b6e7299`, `fdf672b`, `2262e96`).
   A branch e o worktree `.worktrees/media-master-bottle` podem ser removidos
   quando o proprietário quiser — todo o conteúdo já está na
   `feat/loja-perfumes`.
5. **Backup externo de `docs/media/source/`** — 77 arquivos, ~380 MB fora do
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
| `flora-velada` | ✗ **duplicata** de `lenho-vigil` | ✔ 1254×1254 (2026-08-07) |
| `ambar-secreto` | ✔ 1672×941 (2026-08-07) | ✔ 1254×1254 (2026-08-07) |
| `comum-raro` | ✔ 1672×941 (2026-08-07) | ✔ 1254×1254 (2026-08-07) |

**Conjunto real: 6 cinematográficas distintas + 7 folhas ortográficas.**

Correção de 2026-08-09: a linha da `flora-velada` afirmava cinematográfica
entregue em 1920×1080. A verificação por pixel mostrou que
`cinematic/05-flora-velada.png` é **a mesma imagem** de
`cinematic/01-lenho-vigil.png` — diferença média 0,00 em RGB e tom médio
idêntico (`rgb(46, 29, 18)`), âmbar amadeirado. Os bytes diferem só por
recompressão (2,94 MB contra 1,79 MB), por isso o hash não denunciou. Flora
Velada é a linha **floral**, de vidro rosado: publicar essa imagem mostraria o
frasco errado na página do produto. As 7 folhas ortográficas foram conferidas
pelo mesmo método e são todas distintas.

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

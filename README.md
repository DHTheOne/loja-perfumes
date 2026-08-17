# loja-perfumes

> **E-commerce premium de perfumes** com experiência 3D cinematográfica imersiva — Next.js 16, React 19, Three.js, scroll-driven animations.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r185-black?logo=three.js)](https://threejs.org/)

---

## Visão Geral

**loja-perfumes** é meu **primeiro projeto comercial** — uma loja virtual de perfumes com posicionamento premium, destinada a operar comercialmente (não apenas portfólio). O foco é robustez operacional, clareza de manutenção e experiência do usuário refinada.

### Proposta de Experiência
- **Luxo, exclusividade, elegância, autenticidade, desejo, qualidade, segurança**
- Direção visual: fundo escuro/neutro sofisticado, detalhes metálicos, vidro, reflexos, iluminação cinematográfica
- Tipografia editorial, amplo espaço negativo, microinterações refinadas
- **Antipadrões vedados:** template genérico, interface poluída, brilho excessivo, animações longas/aleatórias

---

## Funcionalidades Implementadas

### Experiência Cinematográfica (Branch `feat/cinematic-scroll`)
- **Hero com scrub por rolagem** — vídeo `concreto` controlado via `animation-timeline: view()`
- **6 capítulos** com *match cut* entre transições (dissolve do último quadro do anterior)
- **Match cut em retrato (9:16)** — composição vertical dedicada, não recorte
- **Recuo para moldura** (`clip-path` arredondado) revela cor de ambiente
- **Tipografia que cede** — entra/permanece/sai por opacidade + deslocamento
- **Carga sob demanda** (`useArmWhenNear`) — só 1 vídeo na abertura, 2 no capítulo 2
- **Pipeline de mídia**: `npm run media:cinema` gera 4 variantes (desktop/mobile/poster/tail) por clipe

### 3D Procedural (Three.js + React Three Fiber + Drei)
- **Frasco procedural** (`Bottle.tsx`) — geometria paramétrica, parede 0.055 com `backside`
- **Cavidade interna** + líquido colorido por linha (atenuação 0.22 vs 5.5 da parede)
- **StudioEnvironment** — backdrop de estúdio, névoa 6..11, `envMapIntensity` 1.6
- **Fallback sem WebGL** + `prefers-reduced-motion` + detecção de dispositivo fraco
- **Carregamento tardio** — three.js (968 KB) fora dos 8 chunks iniciais da home

### E-commerce Core
- Catálogo estático: 7 linhas com atributos completos de perfumaria (família, notas topo/coração/fundo, concentração, volume, ocasião, estação, intensidade, duração)
- Filtros por família e ocasião em `/colecoes` (URL como estado, parsers com allowlist)
- Páginas de produto SSG (`/perfumes/[slug]`) com JSON-LD `Product` (PreOrder)
- Sacola persistente (`localStorage` + `useSyncExternalStore`), preço lido do catálogo
- Checkout em `/sacola/checkout` — lista pendências reais (sem formulário que descarta dados)

### Qualidade & Engenharia
| Área | Implementação |
|------|---------------|
| **Testes** | 77 unitários (Vitest, 92.15% statements / 92.75% lines) + 18 E2E (Playwright desktop/mobile) |
| **Coverage** | Threshold 80% travado no `vitest.config.mts`; `src/3d` coberto por E2E |
| **Lint** | ESLint 9 + `eslint-config-next` limpo (ignora `coverage/`, `test-results/`, `playwright-report/`) |
| **SEO** | Open Graph, Twitter cards, JSON-LD Product, sitemap.xml, robots.txt, canonical, theme-color |
| **A11y** | Skip links, ARIA labels, semantic HTML, WCAG 2.2 AA target |
| **Performance** | Lazy loading mídia, code splitting, WebGL budget, WebP otimizado (253 KB total p/ 7 linhas) |
| **Arquitetura** | ADRs documentados, entrega em fases, risk tracking em `PROJECT_STATUS.md` |

---

## Estrutura Principal

```
loja-perfumes/
├── src/
│   ├── 3d/                 # Three.js / R3F scenes & components
│   │   ├── Bottle.tsx      # Frasco procedural
│   │   ├── HeroScene.tsx   # Luz, ambiente, chão do hero
│   │   ├── ProductScene.tsx# Cena 3D nas páginas de produto
│   │   └── StudioEnvironment.tsx
│   ├── app/                # Next.js App Router
│   │   ├── colecoes/       # Catálogo com filtros
│   │   ├── perfumes/[slug]/# Página de produto (SSG)
│   │   ├── sacola/         # Carrinho + checkout
│   │   ├── notas/          # Guia de notas olfativas
│   │   └── cinema/         # Componentes cinematográficos
│   ├── bag/                # Estado da sacola (localStorage + useSyncExternalStore)
│   ├── catalog/            # Dados do catálogo (desacoplado da UI)
│   ├── cinema/             # Sistema de capítulos + match cut
│   ├── config/             # Configuração central (site.ts, lineVisual.ts)
│   └── ui/                 # Tokens, componentes base
├── public/media/
│   ├── cinema/             # 6 clipes × 4 variantes (desktop/mobile/poster/tail)
│   └── lines/              # 7 WebP otimizados (1600px, 26–49 KB cada)
├── scripts/
│   ├── build-line-media.mjs  # Pipeline WebP (sharp + Lanczos)
│   └── build-cinema-media.mjs# Pipeline vídeo (ffmpeg, faststart, GOP 12)
├── docs/
│   ├── decisions/          # ADRs (0001-stack, 0002-orm, 0003-escopo, 0004-gateway)
│   └── media/              # PROMPTS.md, ANALISE-LOTE-01.md
├── PROJECT_BRIEF.md        # Visão, escopo, riscos, placeholders
├── PROJECT_STATUS.md       # Progresso detalhado, riscos, decisões, fase atual
├── ARCHITECTURE.md         # Arquitetura técnica aprovada
├── MEDIA_PLAN.md           # Cálculo KAIROGEN, trilha gratuita, prompts
├── SECURITY_PLAN.md        # LGPD, secrets, headers, CSP
├── DATABASE_SCHEMA.md      # Schema Prisma/PostgreSQL planejado
├── DEPLOYMENT.md           # Vercel + Mercado Pago + variáveis
├── RELATORIO_ANALISE_ALTERACOES_2026-08-07.txt
```

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev                 # Next.js dev server

# Build & Produção
npm run build               # Next.js build (13 páginas estáticas)
npm run start               # Production server

# Qualidade
npm run lint                # ESLint (ignora coverage/test-results/playwright-report)
npm run test                # Vitest run (77 testes, coverage threshold 80%)
npm run test:e2e            # Playwright (build + test desktop/mobile)

# Mídia
npm run media:lines         # Gera 7 WebP 1600px a partir de PNG mestres (sharp, Lanczos)
npm run media:cinema        # Gera 4 variantes × 6 clipes (ffmpeg, faststart, GOP 12)
```

---

## Decisões Arquiteturais (ADRs)

| ADR | Título | Decisão |
|-----|--------|---------|
| 0001 | Stack | Next.js 16 + React 19 + TS strict + Tailwind 4 + Three.js/R3F/Drei |
| 0002 | ORM | Prisma + PostgreSQL (planejado para Fase 5+) |
| 0003 | Escopo Operacional v1 | Estrutura enterprise preparada, operação simplificada no v1 |
| 0004 | Gateway Pagamento | **Mercado Pago** atrás de interface `PaymentProvider` |

---

## Deploy

- **Vercel** (configurado em `DEPLOYMENT.md`)
- Homepage configurada: `https://loja-perfumes-one.vercel.app/`
- Variáveis de ambiente em `.env.example`
- Mercado Pago sandbox → produção na Fase 12

---

## Documentação Completa

- [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) — Visão, escopo, públicos, critérios de sucesso
- [`PROJECT_STATUS.md`](PROJECT_STATUS.md) — Progresso detalhado por fase, riscos, decisões
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — Arquitetura técnica (componentes, dados, 3D, SEO, segurança)
- [`MEDIA_PLAN.md`](MEDIA_PLAN.md) — Pipeline de mídia, KAIROGEN, prompts, trilha gratuita
- [`SECURITY_PLAN.md`](SECURITY_PLAN.md) — LGPD, CSP, headers, secrets, auditoria
- [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md) — Schema Prisma planejado
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — Checklist deploy, Vercel, Mercado Pago, DNS
- [`docs/decisions/`](docs/decisions/) — ADRs 0001–0004
- [`docs/media/PROMPTS.md`](docs/media/PROMPTS.md) — Prompts para geração de mídia (ChatGPT/Google AI)

---

## Autor

**Dereck** — Desenvolvedor em formação  
Belo Horizonte, MG | Curso técnico em TI  
[GitHub](https://github.com/DHTheOne)

> *Este é meu primeiro projeto comercial. Documentação rigorosa, testes abrangentes e entrega em fases são escolhas deliberadas para garantir sustentabilidade.*

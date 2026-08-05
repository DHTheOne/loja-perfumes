# PROJECT STATUS

> Arquivo de progresso exigido pelo prompt mestre (linha 43).
> Atualizado em 2026-08-04. Branch de trabalho: `feat/loja-perfumes`.

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
| R5 | Textos legais sem revisão profissional | Média | Sinalizado; permanece aberto até revisão jurídica |
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
| Fallback sem WebGL + `prefers-reduced-motion` | Feito | Caminho implementado; **teste em navegador sem WebGL ainda pendente** |
| `src/ui/tokens.ts` + `globals.css` | Feito | Paleta amostrada do lote 01 |
| Home com hero | Feito | `tsc` e `eslint` limpos |

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
- [ ] Testar o fallback num navegador sem WebGL
- [ ] Nenhum teste automatizado escrito ainda — a exigência de 80% de
      cobertura (seção 28 do prompt mestre) segue **não atendida**

## Próximo passo

Regerar o vídeo do hero com o frasco mestre anexado, e escrever os primeiros
testes. Nenhuma fase é declarada concluída sem teste — linha 1335.

## Regra de portão

Conforme linha 1335 do prompt mestre: não avançar de fase havendo falha crítica
conhecida na fase atual. Não há falha crítica aberta na Fase 1. R5, R7 e R8 são
bloqueios de **lançamento**, não de fase, e estão registrados como tal.

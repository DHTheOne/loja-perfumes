# PROJECT STATUS

> Arquivo de progresso exigido pelo prompt mestre (linha 43).
> Atualizado em 2026-08-02. Branch de trabalho: `feat/loja-perfumes`.

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

**BLOQUEIO ATIVO (R1):** saldo zero impede qualquer geração de mídia. A Fase 6
não pode iniciar até haver créditos. Detalhamento e plano alternativo em
`MEDIA_PLAN.md` (pendente).

## Entregas desta fase

### Concluído

- [x] Repositório Git criado e verificado
- [x] Remoto `origin` configurado e branches publicadas
- [x] Branch `feat/loja-perfumes` isolada da principal
- [x] MCP KAIROGEN inspecionado com dados reais
- [x] `PROJECT_BRIEF.md`
- [x] `ARCHITECTURE.md`
- [x] `PROJECT_STATUS.md`

### Pendente na Fase 1

- [ ] `SECURITY_PLAN.md`
- [ ] `DATABASE_SCHEMA.md`
- [ ] `MEDIA_PLAN.md`
- [ ] `DEPLOYMENT.md`
- [ ] `.env.example`
- [ ] `docs/decisions/ADR-0001-stack.md`
- [ ] `docs/decisions/ADR-0002-orm.md`
- [ ] `docs/decisions/ADR-0003-escopo-operacional-v1.md`

## Riscos abertos

| # | Risco | Severidade | Estado |
|---|---|---|---|
| R1 | KAIROGEN sem créditos | Alta | **Bloqueando Fase 6** |
| R2 | Escopo muito maior que uma entrega curta | Alta | Mitigado por fases |
| R3 | `[GATEWAY_DE_PAGAMENTO]` indefinido | Alta | **Bloqueia Fase 9** |
| R4 | Complexidade enterprise vs projeto inicial | Média | Aguarda ADR-0003 |
| R5 | Textos legais sem revisão profissional | Média | Sinalizado |
| R6 | 3D pesado prejudicar mobile | Média | Mitigação arquitetural definida |

## Decisões pendentes do proprietário

1. **Gateway de pagamento** — maior impacto na sequência. Candidatos para o
   contexto brasileiro: Mercado Pago, Pagar.me, Stripe.
2. **Créditos KAIROGEN** — comprar ou seguir com placeholders neutros.
3. Nome da loja, domínio, e-mail de suporte, dados da empresa.
4. Provedor de e-mail e de hospedagem.
5. Estratégia de frete (tabela própria ou integração com transportadora).

## Próximo passo

Concluir os documentos pendentes da Fase 1, começando por `SECURITY_PLAN.md`
e `DATABASE_SCHEMA.md`. Nenhum código de aplicação será escrito antes da
aprovação de `ARCHITECTURE.md`.

## Regra de portão

Conforme linha 1335 do prompt mestre: não avançar de fase havendo falha crítica
conhecida na fase atual. R1 e R3 são bloqueios de fase específica (6 e 9), não
impedem o avanço para as Fases 2 a 5.

# ARQUITETURA — [NOME_DA_LOJA]

> Status: proposta da Fase 1, pendente de aprovação do proprietário.
> Atualizado em 2026-08-02.

## 1. Princípio orientador

O prompt mestre (linha 1474) manda equilibrar segurança, manutenção, desempenho,
experiência, custo, escalabilidade, simplicidade e prazo. Quando esses vetores
conflitam, este projeto resolve assim:

**Estruture para evoluir, opere de forma simples.** Interfaces desacopladas onde a
troca é provável (pagamento, e-mail, storage, mídia); implementação direta onde a
troca é improvável. Sem infraestrutura que ninguém vai operar.

Ver `docs/decisions/ADR-0003-escopo-operacional-v1.md`.

## 2. Stack proposta

| Camada | Escolha | Justificativa |
|---|---|---|
| Framework | Next.js (App Router) | SSR/SSG para SEO de catálogo, Server Components reduzem JS no cliente, Route Handlers evitam backend separado no v1 |
| Linguagem | TypeScript `strict` | Exigido pelo prompt (linha 1148); contratos entre camadas |
| Estilo | Tailwind CSS + design system próprio | Tokens explícitos, sem dependência de biblioteca de UI de terceiros |
| 3D | React Three Fiber + Three.js + Drei | Integração declarativa com React; ecossistema maduro |
| Animação | GSAP (scroll/timeline) + CSS | Framer Motion apenas se houver necessidade não coberta |
| Banco | PostgreSQL | Exigido; transações e constraints reais para estoque e pedidos |
| ORM | Prisma | Ver ADR-0002 |
| Validação | Schema tipado compartilhado cliente/servidor | Fronteira única de validação |
| Autenticação | Sessão via cookie `HttpOnly`/`Secure`/`SameSite` | Ver seção 6 |
| Pagamento | Interface `PaymentProvider` | Implementação concreta pendente de `[GATEWAY_DE_PAGAMENTO]` |

Decisões registradas em `docs/decisions/`.

## 3. Organização do código

```
src/
  app/                    rotas (público, conta, admin, api)
  domain/                 regras de negócio puras — sem I/O, sem framework
    catalog/  cart/  order/  pricing/  inventory/  coupon/
  infra/                  implementações concretas
    db/  payment/  mail/  storage/  media/
  ui/                     design system e componentes
    tokens/  primitives/  patterns/
  3d/                     cena, materiais, loaders, fallback
  lib/                    utilitários transversais (log, erro, validação)
```

Regra de dependência: `app` → `domain` → (nada). `infra` implementa contratos
declarados em `domain`. `domain` nunca importa `infra`, `app` ou `ui`.

Consequência prática: preço, desconto, disponibilidade e total do pedido são
funções puras testáveis, chamadas exclusivamente no servidor.

## 4. Fronteira cliente/servidor

Regra inegociável derivada das linhas 668-676 e 845 do prompt:

- Preço, cupom, frete e total **sempre** recalculados no servidor a partir do banco.
- O cliente envia apenas identificadores e quantidades. Nunca valores monetários.
- Chaves, credenciais e regras comerciais sensíveis nunca chegam ao bundle.
- Server Components como padrão; `"use client"` apenas onde há interação real.

## 5. Fluxo de checkout

```
cliente          servidor                        gateway
  |  itens (ids + qtd)  |                              |
  |-------------------->|                              |
  |                     | valida estoque (transação)   |
  |                     | recalcula preços do banco    |
  |                     | aplica cupom (regras server) |
  |                     | cria Order (status PENDING)  |
  |                     | idempotency key              |
  |                     |----- cria intenção --------->|
  |<-- redirect/checkout oficial do gateway ---------->|
  |                     |                              |
  |                     |<---- webhook assinado -------|
  |                     | valida assinatura            |
  |                     | dedup por event id           |
  |                     | transiciona status           |
  |                     | baixa estoque definitiva     |
```

O pedido **nunca** é marcado como pago pelo redirecionamento do navegador
(linha 854). Somente o webhook validado altera estado financeiro.

## 6. Autenticação e autorização

- Senhas com hash moderno de custo configurável (Argon2id ou bcrypt com custo alto).
- Sessão em cookie `HttpOnly`, `Secure`, `SameSite=Lax`, rotacionada no login.
- Verificação de e-mail obrigatória para compra.
- Respostas de login e recuperação idênticas para usuário existente ou não
  (sem enumeração — linha 704).
- Limite de tentativas por IP e por conta.
- RBAC no admin: papéis com permissões nomeadas, checadas no servidor por rota
  **e** por operação. Nunca apenas escondendo elementos na interface.
- MFA de administrador: estrutura prevista, ativação no v1.1 (ver ADR-0003).

## 7. Estoque e concorrência

Ponto de maior risco de perda financeira real.

- Disponibilidade validada dentro da mesma transação que cria o pedido.
- Constraint no banco impedindo quantidade negativa.
- Reserva com expiração para o intervalo entre criação do pedido e confirmação.
- Toda movimentação registrada em `InventoryMovement` (append-only).
- Teste e2e obrigatório: duas compras concorrentes do último item — apenas uma vence.

## 8. Erros, logs e observabilidade

- Erros de domínio tipados, distintos de erros de infraestrutura.
- Resposta de API nunca expõe stack, SQL, caminho ou detalhe interno.
- Log estruturado com `correlation_id` por requisição.
- Mascaramento obrigatório de e-mail, documento, endereço e qualquer token.
- Health check e readiness check separados.

## 9. Mídia e 3D

- Ativos servidos por CDN, com AVIF/WebP para imagem e GLB comprimido para 3D.
- Cena 3D carregada sob demanda, após o conteúdo principal, nunca bloqueando LCP.
- Fallback estático obrigatório: sem WebGL, com `prefers-reduced-motion`, ou em
  dispositivo fraco, a loja funciona integralmente com imagem.
- Carrinho e checkout são utilizáveis sem qualquer efeito 3D (linha 940).

## 10. O que ainda não está decidido

| Item | Bloqueia | Responsável |
|---|---|---|
| `[GATEWAY_DE_PAGAMENTO]` | Fase 9 | Proprietário |
| `[PROVEDOR_DE_EMAIL]` | E-mails transacionais reais | Proprietário |
| `[PROVEDOR_DE_HOSPEDAGEM]` | Fase 12 | Proprietário |
| Storage de mídia | Upload em produção | Definir na Fase 2 |
| Cálculo de frete (transportadora ou tabela) | Checkout completo | Proprietário |

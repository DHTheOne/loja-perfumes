# ESQUEMA DE BANCO DE DADOS — [NOME_DA_LOJA]

> Documento da Fase 1. Atualizado em 2026-08-04.
> Fonte: seção 11 do prompt mestre. PostgreSQL + Prisma (ADR-0002).

Este documento define o **modelo**, não a migration. As migrations são geradas na
Fase 3 a partir do schema Prisma e revisadas antes de aplicar.

## 1. Convenções que valem para todas as tabelas

| Convenção | Decisão | Motivo |
|---|---|---|
| Chave primária | UUID v7 | Ordenável por tempo como um inteiro sequencial, mas sem revelar volume de vendas nem permitir enumeração de pedidos por incremento |
| Identificador público | `slug` único para produto, categoria e coleção | URL legível e estável; o UUID nunca aparece em URL pública de catálogo |
| Dinheiro | **Inteiro em centavos** + código de moeda | Ponto flutuante erra em soma de carrinho. Nunca `float`, nunca `double` |
| Datas | `timestamptz`, sempre gravadas em UTC | Conversão para o fuso do usuário acontece na apresentação |
| Timestamps | `createdAt`, `updatedAt` em toda tabela | Base de auditoria e depuração |
| Status | Enum tipado no banco | String livre aceita valor inválido e quebra silenciosamente |
| Exclusão | Física por padrão | Soft delete só onde justificado — ver seção 6 |

## 2. As 28 entidades

Agrupadas por domínio. Todas as exigidas pela seção 11 estão presentes.

### Identidade e acesso

| Entidade | Papel | Pontos críticos |
|---|---|---|
| `User` | Cliente ou operador | `email` único e case-insensitive; `passwordHash`; `emailVerifiedAt` nulo até verificação; `status` |
| `Account` | Vínculo com provedor externo, se houver login social | Único por (`provider`, `providerAccountId`) |
| `Session` | Sessão ativa | Guarda **hash** do token, nunca o token; `expiresAt`; `revokedAt`; IP e user agent para o usuário poder encerrar sessões |
| `RefreshToken` | Renovação de sessão | Também por hash. Rotação com detecção de reuso: token já usado que reaparece invalida toda a família |
| `Role` | Papel nomeado (`customer`, `admin`, `operator`) | — |
| `Permission` | Permissão nomeada (`product.publish`, `order.refund`) | Relação N:N com `Role`. Checagem por permissão, não por nome de papel |
| `Address` | Endereço de entrega ou cobrança | Vinculado a `User`; um marcado como padrão |

### Catálogo

| Entidade | Papel | Pontos críticos |
|---|---|---|
| `Product` | Perfume | `slug` único; atributos de perfumaria (família, notas de saída/coração/fundo, concentração, ocasião, estação, intensidade, duração); `publishedAt` nulo = rascunho |
| `ProductVariant` | Volume comercializável (30 ml, 50 ml, 100 ml) | **É aqui que vivem preço e SKU**, não no produto. `sku` único |
| `Category` | Taxonomia | Hierarquia opcional por `parentId` |
| `Collection` | Agrupamento editorial | N:N com `Product` |
| `Media` | Imagem, vídeo ou modelo 3D | `alt` **obrigatório** para imagem — acessibilidade é requisito; `role` (`hero`, `gallery`, `og`); `position` |
| `Review` | Avaliação de cliente | `status` de moderação; **só é criada por compra verificada**. Nenhuma avaliação fictícia entra no seed |

### Estoque

| Entidade | Papel | Pontos críticos |
|---|---|---|
| `Inventory` | Saldo atual por variante | `quantity` com `CHECK (quantity >= 0)`; `reserved` |
| `InventoryMovement` | **Livro-razão append-only** | Nunca sofre `UPDATE` nem `DELETE`. Registra tipo, delta, motivo, referência ao pedido e ator |

O saldo em `Inventory` é um cache de leitura rápida. A verdade histórica está no
livro-razão. Divergência entre os dois é detectável por soma — e essa checagem vira
um teste.

### Compra

| Entidade | Papel | Pontos críticos |
|---|---|---|
| `Cart` | Carrinho | Funciona para visitante (token em cookie) e para usuário; funde ao fazer login |
| `CartItem` | Item do carrinho | Guarda apenas `variantId` e `quantity`. **Nunca preço** — preço é sempre recalculado no servidor |
| `Wishlist` | Favoritos | Único por (`userId`, `productId`) |
| `Order` | Pedido | `number` legível e único; `status` tipado; **totais congelados** no fechamento |
| `OrderItem` | Item do pedido | **Snapshot completo**: nome, SKU, volume, preço unitário e imagem no momento da compra |
| `Payment` | Tentativa de pagamento | `providerPaymentId` único; `status` traduzido do gateway; `amountCents`; `idempotencyKey` |
| `Shipment` | Envio | Transportadora, código de rastreio, prazo estimado |
| `Coupon` | Cupom | `code` único; tipo (percentual ou valor); mínimo; validade; limite total e limite por usuário |
| `CouponUsage` | Uso efetivo | Único por (`couponId`, `orderId`); é o que torna o limite realmente aplicável sob concorrência |

**Por que o snapshot em `OrderItem` é inegociável:** se o pedido apontasse só para a
variante, mudar o preço amanhã reescreveria o histórico de vendas de ontem. Nota
fiscal, disputa e contabilidade exigem que o pedido guarde o que foi vendido, pelo
valor que foi cobrado, com o nome que o produto tinha.

### Operação

| Entidade | Papel | Pontos críticos |
|---|---|---|
| `AuditLog` | Trilha de ações administrativas | Ator, ação, entidade, estado antes e depois, IP, user agent. Append-only |
| `WebhookEvent` | Notificação recebida de terceiro | Único por (`provider`, `externalEventId`) — **é o que garante idempotência**. Guarda corpo bruto, cabeçalho de assinatura e resultado |
| `SiteSetting` | Configuração editável pelo admin | Chave-valor tipado |
| `ContactMessage` | Mensagem do formulário de contato | `status` de atendimento; sujeito a rate limit e antispam |

## 3. Integridade que o banco precisa garantir sozinho

Regra de aplicação pode ser contornada por bug, script ou console. Constraint não.

```sql
-- Estoque nunca negativo
CHECK (quantity >= 0)

-- Nunca dois pedidos com o mesmo número
UNIQUE (number)

-- Uma notificação de gateway processada uma única vez
UNIQUE (provider, external_event_id)

-- Um cupom contado uma única vez por pedido
UNIQUE (coupon_id, order_id)

-- E-mail único independente de maiúsculas
UNIQUE (LOWER(email))

-- Valores monetários nunca negativos
CHECK (unit_price_cents >= 0)
CHECK (total_cents >= 0)
```

## 4. Índices previstos

Criados junto com a tabela, não depois que a loja ficar lenta.

| Tabela | Índice | Consulta que ele serve |
|---|---|---|
| `Product` | `slug`, `publishedAt`, `categoryId` | Página de produto, listagem, filtro |
| `ProductVariant` | `productId`, `sku` | Página de produto, busca por SKU no admin |
| `Order` | `userId + createdAt DESC`, `status`, `number` | Histórico do cliente, fila do admin |
| `Payment` | `orderId`, `providerPaymentId` | Conciliação e processamento de webhook |
| `InventoryMovement` | `variantId + createdAt` | Extrato de movimentação |
| `Session` | `userId`, `expiresAt` | Listagem e limpeza de sessões |
| `AuditLog` | `entityType + entityId`, `actorId + createdAt` | Investigação |
| `Cart` | `token`, `userId` | Recuperação de carrinho |

Busca textual de catálogo começa com índice GIN sobre `tsvector` do PostgreSQL.
Motor de busca dedicado só se a medição mostrar necessidade — não antes.

## 5. Concorrência: o caso do último frasco

Ponto de maior risco de prejuízo real. Duas pessoas compram a última unidade ao
mesmo tempo.

```
BEGIN
  SELECT ... FROM inventory WHERE variant_id = $1 FOR UPDATE   -- serializa
  verifica quantity >= pedido
  INSERT order, order_items                                     -- com snapshot
  UPDATE inventory SET reserved = reserved + n
  INSERT inventory_movement (tipo = RESERVA)
COMMIT
```

A reserva expira se o pagamento não confirmar dentro da janela. A baixa definitiva
acontece **apenas** no processamento do webhook aprovado, dentro de outra transação,
protegida pela unicidade em `WebhookEvent`.

**Teste e2e obrigatório** (seção 29 do prompt mestre): duas compras concorrentes do
último item — uma vence, outra recebe erro de indisponibilidade, e o estoque final
é exatamente zero. Sem esse teste passando, a Fase 9 não é declarada concluída.

## 6. Exclusão, retenção e LGPD

Existe uma tensão real que precisa estar documentada, não escondida:

> O direito à exclusão previsto na LGPD convive com a obrigação legal de reter
> documentos fiscais. Apagar o `User` de quem já comprou destruiria registro que a
> lei manda guardar.

**Solução adotada — anonimização, não exclusão:**

1. Dados pessoais diretos (nome, e-mail, telefone, documento, endereço) são
   substituídos por marcadores irreversíveis.
2. O `User` permanece com o identificador, para não quebrar integridade referencial
   dos pedidos.
3. O `OrderItem` já é snapshot e não contém dado pessoal.
4. `Session`, `RefreshToken`, `Cart` e `Wishlist` são apagados de fato.
5. A operação é registrada em `AuditLog` com data, solicitante e escopo.

Soft delete é usado apenas em `Product` — despublicar precisa preservar o histórico
de pedidos que apontam para ele. Em nenhuma outra tabela.

> Este desenho é técnico. **Requer validação jurídica antes do lançamento**
> (risco R5). Não afirmo conformidade legal; afirmo que a estrutura permite
> cumprir ambos os deveres.

## 7. Backup e restauração

| Item | Definição |
|---|---|
| Frequência | Diária completa + WAL contínuo para recuperação a um ponto no tempo |
| Retenção | 30 dias |
| Local | Fora do provedor do banco principal |
| Criptografia | Em repouso e em trânsito |
| **Teste de restauração** | **Trimestral, obrigatório, documentado** |

Backup nunca testado não é backup. O procedimento de restauração fica em
`DEPLOYMENT.md` e precisa ter sido executado ao menos uma vez antes do lançamento.

## 8. Seed de desenvolvimento

Conforme seção 26: 10 produtos das 7 linhas fictícias, categorias, coleções,
variações de volume, estoque, mídia provisória, pedidos fictícios e cupons de teste.

Regras:

- **Nenhum dado pessoal real.** Nomes e e-mails são sinteticamente gerados.
- **Nenhuma avaliação fictícia** — `Review` nasce vazia. Inventar avaliação é
  proibido pela seção 31 e é risco de publicidade enganosa.
- O administrador de desenvolvimento é criado por procedimento documentado que
  **exige senha informada no ambiente**, nunca uma senha fixa no código.
- O seed é idempotente: rodar duas vezes não duplica nada.

## 9. Próximo passo

Fase 3 — traduzir este documento em `schema.prisma`, gerar a primeira migration,
escrever as factories de teste e produzir o diagrama ER.

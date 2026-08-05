# ADR-0002 — Acesso a dados

- **Status:** proposto
- **Data:** 2026-08-04

## Contexto

O modelo tem 28 entidades com integridade forte: estoque que não pode ficar
negativo, pedidos com snapshot imutável, webhooks idempotentes. É necessário
transação real, constraint no banco e migrations versionadas.

O operador tem experiência limitada. Erro de acesso a dados aqui não gera bug
cosmético — gera venda de produto sem estoque ou cobrança duplicada.

## Decisão

**Prisma como ORM, sobre PostgreSQL.**

SQL bruto permanece disponível e será usado onde o ORM atrapalhar — busca textual
com `tsvector` e relatórios agregados são os casos previstos. Quando usado, sempre
com parâmetro vinculado, nunca concatenação.

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Drizzle | Mais próximo do SQL e mais leve, mas exige mais domínio de SQL para não errar em transação e bloqueio. Contra o perfil da equipe |
| SQL puro com driver | Máximo controle, custo alto de manutenção e nenhuma proteção de tipo entre banco e código |
| TypeORM | Histórico de comportamento surpreendente em migrations e relacionamentos |

## Consequências

**Positivas**

- Tipos derivados do schema: uma coluna renomeada quebra a compilação em vez de
  quebrar em produção.
- Migrations versionadas e revisáveis em pull request.
- Transações explícitas com API clara — importante para a seção de concorrência.
- Schema único como documentação executável do modelo.

**Negativas**

- Consultas complexas podem gerar SQL ineficiente. Mitigação: medir com `EXPLAIN`
  antes de otimizar, e cair para SQL bruto onde valer a pena.
- Risco de N+1 se as relações forem carregadas sem atenção. Mitigação: teste de
  integração que conta consultas nas rotas de listagem.
- Camada extra de abstração a aprender.

## Restrição herdada

Constraints de integridade — `CHECK`, `UNIQUE`, chave estrangeira — vivem **no
banco**, não apenas no código. O ORM é conveniência de acesso; a garantia é do
PostgreSQL. Ver `DATABASE_SCHEMA.md` §3.

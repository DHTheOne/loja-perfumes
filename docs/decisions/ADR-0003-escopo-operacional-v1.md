# ADR-0003 — Escopo operacional do v1

- **Status:** proposto
- **Data:** 2026-08-04

## Contexto

O prompt mestre descreve um sistema de porte empresarial: RBAC completo, trilha de
auditoria, observabilidade, conformidade LGPD, 3D, testes em três níveis,
implantação em múltiplos ambientes.

Simultaneamente, este é o **primeiro projeto comercial do proprietário**, operado
por uma equipe muito pequena, provavelmente por uma pessoa só.

Há uma tensão real entre as duas coisas. Ignorá-la produz um de dois fracassos:

- construir tudo e não conseguir operar nem manter;
- simplificar demais e precisar reescrever ao primeiro sinal de tração.

Este é o risco R4.

## Decisão

**Estruture para evoluir, opere de forma simples.**

A regra de corte é a seguinte:

> Aquilo cuja ausência causa **perda financeira, vazamento de dado ou risco
> jurídico** entra completo no v1. Aquilo que apenas melhora conforto de operação
> entra como estrutura preparada, com ativação posterior.

### Entra completo no v1

Segurança de pagamento e webhook; integridade transacional de estoque; RBAC checado
no servidor; verificação de propriedade de recurso; trilha de auditoria de ação
administrativa; estrutura de LGPD; backup com restauração testada; testes dos
fluxos críticos; acessibilidade WCAG 2.2 AA.

### Estrutura preparada, ativação posterior

| Item | v1 | Depois |
|---|---|---|
| MFA de administrador | Modelo e ponto de extensão prontos | Ativação no v1.1 |
| Papéis granulares | `customer`, `admin`, `operator` | Papéis adicionais conforme a operação exigir |
| Busca | Índice GIN do PostgreSQL | Motor dedicado **se a medição exigir** |
| Cache | Cache do próprio framework | Camada distribuída sob pressão real |
| Observabilidade | Log estruturado + rastreamento de erro | Métricas e tracing distribuído |
| Frete | Tabela própria configurável | Integração com transportadora |
| Fila de tarefas | Processamento em linha, com retry | Fila dedicada quando o volume justificar |

### Fora do v1

Marketplace, assinatura recorrente, fidelidade, aplicativo nativo,
internacionalização, multimoeda e recomendação por aprendizado de máquina.
Registrado em `PROJECT_BRIEF.md` §3 para evitar expansão silenciosa.

## Consequências

**Positivas**

- O produto chega ao ar. Escopo que ninguém termina não protege ninguém.
- Nenhum dos cortes cria dívida em segurança ou em integridade de dados — é ali que
  se paga caro depois.
- A ativação posterior é acréscimo, não reescrita, porque a estrutura já existe.

**Negativas**

- Alguns itens exigirão trabalho de ativação depois. Aceito conscientemente.
- Há risco de "depois" nunca chegar. Mitigação: cada item adiado está nomeado nesta
  tabela e revisado a cada release, não deixado à memória.

## Reavaliação

Este ADR é revisto quando ocorrer o primeiro de: mil pedidos processados, segunda
pessoa entrando na operação, ou primeiro incidente de segurança.

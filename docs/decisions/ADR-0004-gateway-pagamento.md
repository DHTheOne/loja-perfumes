# ADR-0004 — Gateway de pagamento

- **Status:** **aceito**
- **Data:** 2026-08-04
- **Decidido por:** proprietário

## Contexto

O gateway era o item de maior impacto na sequência de fases — bloqueava a Fase 9
(checkout e webhooks) e definia parte do modelo de `Payment`.

O público é brasileiro. Isso torna Pix e boleto requisitos comerciais reais, não
diferenciais: uma parcela relevante das compras no país não passa por cartão.

## Decisão

**Mercado Pago**, na modalidade de **checkout hospedado** (o cliente conclui o
pagamento em página do próprio gateway).

## Alternativas consideradas

| Alternativa | Por que não foi escolhida |
|---|---|
| Pagar.me | Boa opção nacional, cobre os mesmos meios. Decisão do proprietário pendeu para Mercado Pago |
| Stripe | Documentação e ergonomia de API superiores, mas cobertura de Pix e boleto no Brasil é menos central ao produto |
| Múltiplos gateways no v1 | Complexidade desnecessária antes de existir volume. A interface `PaymentProvider` mantém a porta aberta |

## Consequências

**Positivas**

- Cartão, Pix e boleto em uma integração única.
- Checkout hospedado significa que **dado de cartão nunca passa pelo nosso
  servidor** — redução expressiva de superfície de risco e de escopo PCI.
- Reconhecimento da marca pelo consumidor brasileiro reduz atrito de confiança no
  momento do pagamento.

**Negativas**

- O cliente sai do domínio da loja para pagar, o que custa alguma conversão e
  quebra a continuidade visual. Aceito no v1; migrar para checkout embutido é uma
  troca local, atrás da interface `PaymentProvider`.
- Acoplamento a um fornecedor nacional. Mitigado pela interface e pela tradução
  explícita de status descrita abaixo.

## Restrições de implementação — obrigatórias

Detalhadas em `ARCHITECTURE.md` §5.1 e `SECURITY_PLAN.md` §7:

1. Pedido **nunca** marcado como pago por redirecionamento do navegador.
2. Assinatura da notificação validada antes de qualquer processamento.
3. A notificação fornece o identificador; o estado real vem de reconsulta à API.
4. Idempotência na criação da intenção e na recepção da notificação.
5. **Status do gateway traduzido para status de domínio** por tabela explícita —
   a string do fornecedor nunca é gravada direto na coluna de status do pedido.
6. Toda notificação registrada em `WebhookEvent`, com corpo, cabeçalho de
   assinatura e resultado do processamento.

Credenciais apenas em variáveis de ambiente
(`MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_PUBLIC_KEY`,
`MERCADOPAGO_WEBHOOK_SECRET`), com sandbox e produção nunca no mesmo ambiente.

> Nomes de endpoints, campos e valores de status serão obtidos da documentação
> oficial no início da Fase 9. Este ADR fixa a decisão e as restrições, não a
> assinatura da API — inventar endpoint é proibido pela linha 315 do prompt mestre.

## Efeito no planejamento

Risco R3 encerrado. A Fase 9 deixa de estar bloqueada.

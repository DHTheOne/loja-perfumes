# PROJECT BRIEF — [NOME_DA_LOJA]

> Status: rascunho da Fase 1 (Descoberta). Atualizado em 2026-08-02.
> Fonte de requisitos: `prompt_loja_perfumes_profissional.txt` (prompt mestre, 32 seções).

## 1. Visão

Loja virtual de perfumes com posicionamento premium, destinada a operar comercialmente —
não a servir como demonstração de portfólio. O produto precisa ser seguro, responsivo,
escalável, documentado e implantável.

Este é o primeiro projeto comercial do proprietário. A consequência prática é que
robustez operacional e clareza de manutenção valem mais do que sofisticação técnica
que ninguém consegue sustentar depois.

## 2. Proposta de experiência

A navegação deve comunicar luxo, exclusividade, elegância, autenticidade, desejo,
qualidade e segurança durante a compra.

Direção visual: fundo escuro ou neutro sofisticado, detalhes metálicos discretos,
vidro e reflexos, iluminação cinematográfica, tipografia editorial, amplo espaço
negativo, fotografia de produto em destaque e microinterações refinadas.

Antipadrões explicitamente vedados: aparência de template genérico, interface poluída,
brilho excessivo, animação longa ou aleatória, e qualquer estética de cassino ou
página promocional duvidosa.

## 3. Escopo do v1

### Dentro do escopo

- Catálogo de perfumes com atributos de perfumaria (família olfativa, notas de saída,
  coração e fundo, concentração, volume, ocasião, estação, intensidade, duração).
- Busca, filtros, ordenação, categorias e coleções.
- Página de produto com galeria, zoom e apresentação 3D opcional.
- Favoritos, carrinho persistente, cupons, cálculo de frete e checkout.
- Autenticação de clientes, perfil, endereços, histórico e acompanhamento de pedidos.
- Painel administrativo com RBAC e trilha de auditoria.
- Experiência 3D na home com fallback estático obrigatório.
- Conteúdo institucional e legal (privacidade, cookies, termos, entrega, trocas).
- Conformidade LGPD estrutural e acessibilidade WCAG 2.2 AA.

### Fora do escopo do v1

Registrado para evitar expansão silenciosa. Reavaliar após o lançamento:

- Marketplace ou múltiplos vendedores.
- Assinatura recorrente de fragrâncias.
- Programa de fidelidade e cashback.
- Aplicativo móvel nativo.
- Internacionalização e multimoeda.
- Recomendação por aprendizado de máquina.

## 4. Públicos

| Perfil | Necessidade central |
|---|---|
| Visitante | Entender a proposta e confiar na loja em poucos segundos |
| Cliente | Encontrar, avaliar e comprar sem atrito, com clareza sobre prazo e devolução |
| Administrador | Cadastrar produtos, controlar estoque e acompanhar pedidos sem depender de dev |
| Proprietário | Operar o negócio com custo previsível e sem risco jurídico evitável |

## 5. Critérios de sucesso

Derivados da seção 29 do prompt mestre. A lista completa e verificável vive em
`PROJECT_STATUS.md`. Os critérios de negócio são:

- Um visitante consegue concluir uma compra em sandbox do início ao fim.
- Um administrador consegue cadastrar e publicar um produto sem intervenção técnica.
- A loja funciona em celular intermediário, sem WebGL e sem mouse.
- Nenhum segredo no repositório; nenhum preço calculado no cliente.
- Textos legais sinalizados para revisão jurídica antes do lançamento.

## 6. Restrições e premissas

- **Legal/IP:** proibido replicar perfumes protegidos, embalagens, rótulos ou
  identidade de marcas reais. Todas as fragrâncias do catálogo inicial são fictícias
  e originais, claramente marcadas como tal.
- **Conteúdo comercial:** proibido inventar avaliações, selos, certificações ou
  promoções.
- **Dados:** o seed de desenvolvimento não usa dados pessoais reais.
- **Orçamento de mídia:** geração via KAIROGEN consome créditos pagos. Ver
  `MEDIA_PLAN.md` — há um bloqueio ativo de saldo.

## 7. Placeholders pendentes de decisão do proprietário

Nenhum destes bloqueia o desenvolvimento. Todos são substituíveis por busca textual.

| Placeholder | Impacto se permanecer indefinido |
|---|---|
| `[NOME_DA_LOJA]` | Baixo — afeta copy, metadados e identidade |
| `[DOMINIO]` | Baixo até o deploy — afeta canonical, CORS, cookies e OG |
| `[EMAIL_DE_SUPORTE]` | Baixo — afeta contato e e-mails transacionais |
| `[CNPJ_OU_DADOS_DA_EMPRESA]` | Médio — obrigatório nos textos legais e na nota fiscal |
| `[GATEWAY_DE_PAGAMENTO]` | **Alto** — bloqueia a Fase 9 (checkout e webhooks) |
| `[PROVEDOR_DE_EMAIL]` | Médio — bloqueia e-mails transacionais reais |
| `[PROVEDOR_DE_HOSPEDAGEM]` | Médio — bloqueia a Fase 12 (staging e produção) |

## 8. Riscos identificados na Descoberta

| # | Risco | Severidade | Mitigação |
|---|---|---|---|
| R1 | Conta KAIROGEN sem créditos — mídia premium indisponível | Alta | Placeholders neutros + plano de geração faseado. Ver `MEDIA_PLAN.md` |
| R2 | Escopo muito maior que a capacidade de uma entrega curta | Alta | Fases verificáveis; nada declarado pronto sem teste |
| R3 | Gateway de pagamento indefinido | Alta | Camada de pagamento desacoplada atrás de interface |
| R4 | Complexidade enterprise incompatível com projeto inicial | Média | Ver ADR-0003 — estrutura preparada, operação simplificada no v1 |
| R5 | Textos legais sem revisão profissional | Média | Sinalizados no código e no checklist de lançamento |
| R6 | 3D pesado prejudicar conversão em mobile | Média | Fallback estático, carregamento tardio, orçamento de performance |

## 9. Próximo passo

Fase 2 — Arquitetura. Consolidar `ARCHITECTURE.md` como decisão aprovada e obter
do proprietário a definição de `[GATEWAY_DE_PAGAMENTO]`, que é o item de maior
impacto na sequência de fases.

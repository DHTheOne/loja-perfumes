# PLANO DE SEGURANÇA — [NOME_DA_LOJA]

> Documento da Fase 1. Atualizado em 2026-08-04.
> Fonte: seções 17 a 20 do prompt mestre.

## 1. O que este documento afirma — e o que não afirma

**Afirma:** quais controles serão implementados, como serão verificados e qual
ameaça cada um endereça.

**Não afirma que o sistema é seguro.** Conforme a linha 1054 do prompt mestre:
teste passando não é prova de segurança. Um controle só é considerado presente
depois de implementado **e** verificado; até lá permanece marcado como pendente
neste documento. Nenhuma frase deste plano deve ser citada como atestado de
conformidade.

## 2. Fronteiras de confiança

Tudo que cruza uma fronteira é dado não confiável até ser validado.

```
┌─ NÃO CONFIÁVEL ────────────────────────────────────────┐
│  Navegador do cliente                                   │
│  · JavaScript, DOM, cookies, localStorage               │
│  · Qualquer valor enviado em requisição                 │
│  · Código do cliente é inspecionável — ofuscação        │
│    não é controle de segurança (linha 668)              │
└───────────────────┬─────────────────────────────────────┘
                    │  ← fronteira: validação + autorização
┌───────────────────┴─────────────────────────────────────┐
│  Servidor da aplicação          ← CONFIÁVEL              │
│  · Preço, desconto, frete, total, estoque, permissão     │
└───────────────────┬─────────────────────────────────────┘
                    │  ← fronteira: assinatura + reconsulta
┌───────────────────┴─────────────────────────────────────┐
│  Terceiros: gateway, e-mail, storage  ← NÃO CONFIÁVEL    │
│  · Webhook é notificação, não autorização                │
└─────────────────────────────────────────────────────────┘
```

**Regra central:** o cliente envia identificadores e quantidades. Nunca valores
monetários, nunca papéis, nunca permissões, nunca status de pedido.

## 3. Autenticação

| Controle | Definição |
|---|---|
| Hash de senha | Argon2id com custo calibrado na máquina de produção; bcrypt com custo alto como alternativa |
| Política de senha | Comprimento mínimo generoso, sem exigência de troca periódica, bloqueio de senhas notoriamente vazadas |
| Sessão | Cookie `HttpOnly`, `Secure`, `SameSite=Lax`; token armazenado por hash no banco |
| Rotação | Identificador de sessão rotacionado no login e na elevação de privilégio |
| Verificação de e-mail | Obrigatória antes da primeira compra |
| Recuperação | Token de uso único, curta validade, invalidado após uso |
| **Não enumeração** | Resposta **idêntica** em login e recuperação, exista o usuário ou não — inclusive no tempo de resposta (linha 704) |
| Limite de tentativas | Por IP **e** por conta, com atraso progressivo |
| MFA de administrador | Estrutura prevista; ativação no v1.1 (ADR-0003) |

O detalhe de tempo de resposta importa: comparar hash só quando o usuário existe
cria diferença mensurável que reintroduz a enumeração pela porta dos fundos.

## 4. Autorização

- **RBAC checado no servidor, por rota e por operação.** Esconder um botão na
  interface não é autorização.
- Permissões nomeadas (`order.refund`), não checagem por nome de papel — papel muda,
  permissão descreve a capacidade.
- **Verificação de propriedade em todo acesso a recurso.** Pedido, endereço e
  carrinho só são acessíveis pelo dono. Este é o vetor mais comum de vazamento em
  e-commerce: trocar o id na URL e ver o pedido de outra pessoa.
- Negação por padrão: rota nova nasce fechada.

## 5. Validação de entrada

- Schema tipado único, compartilhado entre cliente e servidor. A validação no
  cliente é conveniência; **a do servidor é a que conta**.
- Lista de permitidos, não lista de proibidos.
- Limites explícitos de tamanho em todo campo, corpo de requisição e upload.
- Coerção de tipo explícita — `"1e10"` não vira quantidade válida.

## 6. OWASP Top 10 — mapeamento

| Risco | Controle neste projeto |
|---|---|
| Quebra de controle de acesso | RBAC no servidor + verificação de propriedade em todo recurso (§4) |
| Falhas criptográficas | TLS obrigatório, HSTS, Argon2id, tokens por hash, segredos fora do código |
| Injeção | Prisma com consulta parametrizada; SQL bruto só com parâmetro vinculado, nunca concatenação |
| Design inseguro | Preço e estoque no servidor; webhook como única fonte de estado financeiro |
| Configuração incorreta | Cabeçalhos de segurança, CSP, erro genérico ao cliente, admin fora de índice |
| Componentes vulneráveis | Auditoria de dependência no CI, atualização mensal, bloqueio de build com vulnerabilidade crítica |
| Falhas de identificação | §3 completa |
| Integridade de software e dados | Validação de assinatura de webhook, lockfile versionado, build reprodutível |
| Falhas de log e monitoramento | Log estruturado com `correlation_id`, `AuditLog`, alerta em falha de autenticação em série |
| SSRF | Nenhuma requisição a URL fornecida por usuário; se necessária, lista de permitidos e bloqueio de faixas internas |

## 7. Pagamento

Reforça `ARCHITECTURE.md` §5.1. Os três controles que evitam prejuízo direto:

1. **Nenhum pedido é marcado como pago por redirecionamento do navegador** — só por
   webhook validado (linha 854).
2. **Assinatura verificada antes de qualquer processamento**; a notificação é usada
   apenas para obter o identificador, e o estado real vem de reconsulta ao gateway.
3. **Idempotência por (`provider`, `externalEventId`)** — a mesma notificação chega
   várias vezes e não pode gerar baixa dupla de estoque nem estorno duplicado.

Dado de cartão nunca transita pelo nosso servidor (checkout hospedado).

## 8. Segredos

Regra do workspace, sem exceção:

- Nunca em código, commit, log, bundle do cliente, arquivo público ou documentação.
- `.env` fora do Git; `.env.example` contém **apenas nomes**, jamais valores.
- Em exemplos, sempre a forma `${NOME_DA_VARIAVEL}`.
- Validação na inicialização: se um segredo obrigatório faltar, a aplicação
  **falha ao subir** em vez de rodar degradada e silenciosa.
- Segredo exposto é rotacionado fora deste repositório, e o incidente é registrado
  pelo tipo e caminho afetado — nunca pelo valor.

## 9. Cabeçalhos e política de conteúdo

`Content-Security-Policy` restritiva, `Strict-Transport-Security`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`,
`X-Frame-Options` ou `frame-ancestors`.

A CSP precisa de atenção específica: a cena 3D (WebGL, workers, blobs) e o
redirecionamento ao gateway tendem a exigir exceções. Exceção concedida é
documentada com justificativa — CSP com `unsafe-inline` genérico anula o controle.

## 10. Limitação de taxa

| Alvo | Motivo |
|---|---|
| Login e recuperação | Força bruta e enumeração |
| Cadastro | Criação massiva de contas |
| Formulário de contato | Spam |
| Aplicação de cupom | Adivinhação de código |
| Busca | Custo de consulta |
| Webhook | Proteção contra inundação, sem descartar evento legítimo |

## 11. Upload de arquivo

Superfície de risco frequentemente subestimada no admin.

- Tipo verificado pelo **conteúdo**, não pela extensão nem pelo `Content-Type`.
- Limite de tamanho e de dimensão.
- Nome gerado pelo servidor; o nome enviado pelo usuário nunca vira caminho.
- Servido de domínio ou caminho sem execução, com `Content-Disposition` adequado.
- Metadados EXIF removidos — imagem de terceiro pode carregar geolocalização.

## 12. Log e vazamento de informação

- Resposta de erro ao cliente é genérica: nunca stack, SQL, caminho de arquivo,
  versão de biblioteca ou nome de tabela.
- Mascaramento obrigatório em log: e-mail, documento, telefone, endereço, token,
  cabeçalho de autorização, corpo de webhook com dado pessoal.
- `correlation_id` por requisição para investigar sem precisar de dado pessoal.
- `AuditLog` para ação administrativa; append-only.

## 13. LGPD — estrutura

- Base legal registrada por finalidade de tratamento.
- Consentimento de cookies antes de qualquer rastreamento não essencial.
- Exportação e anonimização de dados do titular (`DATABASE_SCHEMA.md` §6).
- Retenção definida por tipo de dado.
- Encarregado e canal de contato — dependem de `[CNPJ_OU_DADOS_DA_EMPRESA]`.

> Estrutura técnica. **Não é parecer jurídico** (risco R5).

## 14. Dependências

Auditoria no CI a cada PR; build bloqueado por vulnerabilidade crítica; lockfile
versionado; revisão manual antes de adicionar dependência nova — pacote a menos é
superfície de ataque a menos.

## 15. Checklist de pré-lançamento

Nenhum item é dispensável. Todos precisam de evidência, não de opinião.

- [ ] Varredura de segredos em todo o histórico do repositório, não só no HEAD
- [ ] Verificação de propriedade testada em pedido, endereço e carrinho
- [ ] Rota administrativa testada com usuário sem permissão → negada
- [ ] Login e recuperação com resposta e tempo indistinguíveis para usuário inexistente
- [ ] Webhook com assinatura inválida → rejeitado e registrado
- [ ] Webhook duplicado → processado uma única vez
- [ ] Duas compras concorrentes do último item → uma vence, estoque final zero
- [ ] Preço manipulado na requisição → ignorado, total recalculado do banco
- [ ] Cabeçalhos de segurança e CSP verificados em produção
- [ ] Limitação de taxa verificada em cada alvo da §10
- [ ] Upload de arquivo com extensão falsificada → rejeitado
- [ ] Restauração de backup executada com sucesso ao menos uma vez
- [ ] Textos legais revisados por profissional
- [ ] Auditoria de dependências sem vulnerabilidade crítica aberta

## 16. Resposta a incidente

Conforme a regra de segurança do workspace:

1. Interromper a propagação.
2. Não repetir o valor exposto em nenhum lugar.
3. Registrar apenas o **tipo** de exposição e o caminho afetado.
4. Solicitar ao responsável a revogação ou rotação da credencial, fora deste
   repositório.
5. Remover a cópia somente com autorização e por procedimento recuperável.
6. Revisar o restante do código em busca do mesmo padrão.

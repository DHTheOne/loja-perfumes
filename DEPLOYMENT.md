# IMPLANTAÇÃO — [NOME_DA_LOJA]

> Documento da Fase 1. Atualizado em 2026-08-04.
> Fonte: seções 24 e 30 do prompt mestre.

`[PROVEDOR_DE_HOSPEDAGEM]` ainda não foi definido. Este documento fixa **o que
precisa ser verdade em qualquer provedor**; a escolha concreta entra na Fase 12 sem
alterar a estrutura abaixo.

## 1. Ambientes

| Ambiente | Origem | Banco | Gateway | Acesso |
|---|---|---|---|---|
| Local | máquina do desenvolvedor | PostgreSQL em container | sandbox | — |
| Preview | cada pull request | banco efêmero, seed automático | sandbox | protegido por senha |
| Staging | branch principal | cópia de estrutura, **dados sintéticos** | sandbox | restrito |
| Produção | tag de release | PostgreSQL gerenciado, com backup | produção | público |

**Staging nunca recebe cópia do banco de produção.** Copiar dados reais para um
ambiente com controle de acesso mais frouxo é o caminho mais comum de vazamento de
dado pessoal. Staging usa o mesmo seed sintético do desenvolvimento.

## 2. Configuração por variável de ambiente

Toda diferença entre ambientes é variável, não código. Nomes em `.env.example`.

Regras:

1. `.env` **nunca** entra no Git.
2. Segredo de produção vive apenas no gerenciador de segredos do provedor.
3. A aplicação **valida as variáveis obrigatórias ao iniciar** e falha imediatamente
   se faltar alguma. Subir com configuração incompleta e quebrar só no checkout é
   pior do que não subir.
4. Chave de sandbox e chave de produção nunca coexistem no mesmo ambiente.

## 3. Pipeline

```
push / pull request
   ├─ lint
   ├─ verificação de tipos (TypeScript strict)
   ├─ testes unitários
   ├─ testes de integração (com banco real efêmero)
   ├─ auditoria de dependências        → bloqueia em vulnerabilidade crítica
   ├─ varredura de segredos            → bloqueia em qualquer achado
   ├─ build
   └─ e2e nos fluxos críticos
        ↓  tudo verde
   deploy de preview
        ↓  aprovação humana
   staging → produção
```

Nenhuma etapa é pulável. Falha em qualquer uma interrompe o deploy — conforme a
linha 1335 do prompt mestre, não se avança com falha crítica conhecida.

## 4. Migrations

O ponto onde deploys quebram lojas de verdade.

**Regra: migration nunca é destrutiva no mesmo deploy que muda o código.**
Usa-se expansão e contração:

```
Deploy 1  EXPANDIR   adiciona coluna nova, nullable, com valor padrão
                     código novo escreve nas duas, lê da antiga
Deploy 2  MIGRAR     preenche a coluna nova nos registros existentes
                     código passa a ler da nova
Deploy 3  CONTRAIR   remove a coluna antiga
```

Consequência prática: em qualquer momento é possível fazer rollback do código sem
que o banco fique incompatível. Sem isso, um rollback de emergência corrompe dados.

Toda migration é revisada por pessoa antes de aplicar em produção, e executada com
backup imediatamente anterior confirmado.

## 5. Verificações de saúde

Dois endpoints distintos, com propósitos diferentes:

| Endpoint | Responde | Uso |
|---|---|---|
| Vivacidade | processo está de pé | reiniciar container travado |
| Prontidão | banco acessível, migrations aplicadas, variáveis presentes | liberar tráfego |

Nenhum dos dois expõe versão, caminho, nome de host ou detalhe interno.

## 6. Rollback

| Situação | Ação |
|---|---|
| Bug na aplicação | Voltar para a release anterior — imediato, sem tocar no banco |
| Migration ruim | Restaurar backup + reaplicar. **Nunca** editar dados à mão em produção |
| Segredo vazado | Rotacionar fora do repositório, invalidar sessões, registrar incidente |

Meta: rollback de aplicação em minutos, executável por quem estiver de plantão sem
precisar reconstruir nada.

## 7. Backup e restauração

Política em `DATABASE_SCHEMA.md` §7. O procedimento operacional:

1. Confirmar o backup mais recente e sua integridade.
2. Provisionar instância de restauração **separada** — nunca restaurar por cima da
   produção como primeiro passo.
3. Restaurar e verificar contagens e integridade referencial.
4. Só então promover, com janela de manutenção comunicada.
5. Registrar data, motivo, duração e resultado.

**Teste trimestral obrigatório.** Precisa ter sido executado ao menos uma vez antes
do lançamento — é item do checklist da §10.

## 8. Domínio, TLS e cabeçalhos

Depende de `[DOMINIO]`. Requisitos fixos: HTTPS obrigatório com redirecionamento,
HSTS, certificado com renovação automática, `www` e ápice resolvendo de forma
canônica, cabeçalhos de segurança conforme `SECURITY_PLAN.md` §9.

Cookies com `Secure` e `SameSite` corretos — o domínio final afeta diretamente o
comportamento de sessão e o retorno do gateway.

## 9. Observabilidade

- Log estruturado em JSON com `correlation_id`, sem dado pessoal em claro.
- Métricas: latência por rota, taxa de erro, tempo de consulta ao banco,
  fila de webhooks pendentes.
- **Alertas que importam:** falha de processamento de webhook, erro em criação de
  pedido, saldo de estoque negativo detectado, série de falhas de autenticação,
  certificado perto do vencimento.
- Rastreamento de erro com agrupamento e alerta por regressão.

Alerta que ninguém lê é ruído. A lista acima é deliberadamente curta.

## 10. Checklist de lançamento

- [ ] Todas as variáveis de produção configuradas e validadas na inicialização
- [ ] Migrations aplicadas e verificadas
- [ ] Backup automático ativo **e restauração testada com sucesso**
- [ ] Webhook de produção registrado e recebendo com assinatura válida
- [ ] Compra de ponta a ponta concluída em sandbox
- [ ] Checklist completo de `SECURITY_PLAN.md` §15 aprovado
- [ ] Orçamento de performance atingido em celular intermediário
- [ ] Acessibilidade WCAG 2.2 AA verificada nos fluxos críticos
- [ ] Loja funcional sem WebGL e com `prefers-reduced-motion`
- [ ] Textos legais revisados por profissional (R5)
- [ ] Uso comercial da mídia gerada confirmado (R7) e busca de marca feita (R8)
- [ ] Rollback ensaiado ao menos uma vez
- [ ] Alertas configurados e testados com falha real
- [ ] Ambiente de produção **sem** dado de seed e sem usuário de desenvolvimento

## 11. Próximo passo

Definir `[PROVEDOR_DE_HOSPEDAGEM]` e `[PROVEDOR_DE_EMAIL]` na Fase 12. Nenhum dos
dois bloqueia as Fases 2 a 11.

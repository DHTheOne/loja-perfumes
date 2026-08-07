import type { Metadata } from "next";

import { site } from "@/config/site";
import { MinutaNotice } from "@/ui/MinutaNotice";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Minuta da política de privacidade: dados coletados, finalidades, bases legais e direitos do titular conforme a LGPD.",
  // Minuta sem validade legal: não pode ser indexada antes da revisão
  // jurídica e da substituição dos placeholders. Ver PROJECT_STATUS (R5).
  robots: { index: false, follow: false },
};

/**
 * Minuta estruturada pela LGPD (Lei 13.709/2018). Placeholders entre
 * colchetes dependem de decisão do proprietário (PROJECT_BRIEF §7).
 */
export default function PrivacidadePage() {
  return (
    <main
      id="conteudo"
      className="mx-auto w-full max-w-3xl px-6 pt-36 md:px-12"
      style={{ paddingBottom: "var(--space-section)" }}
    >
      <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
        Institucional
      </p>
      <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">
        Política de privacidade
      </h1>
      <p className="mt-4 font-sans text-sm text-ink-muted">
        Minuta de 7 de agosto de 2026.
      </p>

      <MinutaNotice />

      <div className="mt-12 space-y-10">
        <section aria-labelledby="quem-somos">
          <h2 id="quem-somos" className="font-display text-2xl font-light text-ink">
            1. Quem somos
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            {site.name} (nome provisório), operada por
            [CNPJ_OU_DADOS_DA_EMPRESA], é a controladora dos dados pessoais
            tratados nesta loja. Contato do encarregado (DPO):
            [EMAIL_DE_SUPORTE].
          </p>
        </section>

        <section aria-labelledby="dados-coletados">
          <h2 id="dados-coletados" className="font-display text-2xl font-light text-ink">
            2. Dados que coletamos
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 font-sans text-sm leading-relaxed text-ink-muted">
            <li>Cadastro: nome, e-mail e telefone.</li>
            <li>Entrega: endereços informados por você.</li>
            <li>Compras: histórico de pedidos e preferências.</li>
            <li>Navegação: cookies e dados técnicos de acesso.</li>
          </ul>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Não coletamos dados sensíveis nem dados de menores de idade.
          </p>
        </section>

        <section aria-labelledby="finalidades">
          <h2 id="finalidades" className="font-display text-2xl font-light text-ink">
            3. Para que usamos e com que base legal
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 font-sans text-sm leading-relaxed text-ink-muted">
            <li>
              Processar e entregar pedidos — execução de contrato (art. 7º,
              V da LGPD).
            </li>
            <li>
              Emitir nota fiscal e cumprir obrigações fiscais — obrigação
              legal (art. 7º, II).
            </li>
            <li>
              Prevenir fraude e proteger a conta — legítimo interesse
              (art. 7º, IX).
            </li>
            <li>
              Enviar comunicações de marketing — somente com o seu
              consentimento (art. 7º, I), revogável a qualquer momento.
            </li>
          </ul>
        </section>

        <section aria-labelledby="pagamentos">
          <h2 id="pagamentos" className="font-display text-2xl font-light text-ink">
            4. Pagamentos
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Os pagamentos são processados pelo Mercado Pago. Os dados
            completos do seu cartão são tratados pelo processador e não são
            armazenados por nós.
          </p>
        </section>

        <section aria-labelledby="compartilhamento">
          <h2 id="compartilhamento" className="font-display text-2xl font-light text-ink">
            5. Com quem compartilhamos
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Compartilhamos dados apenas com quem precisa deles para a loja
            funcionar: processador de pagamento, transportadoras e
            autoridades quando houver obrigação legal. Não vendemos dados
            pessoais.
          </p>
        </section>

        <section aria-labelledby="direitos">
          <h2 id="direitos" className="font-display text-2xl font-light text-ink">
            6. Seus direitos
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            A LGPD garante a você confirmação do tratamento, acesso,
            correção, anonimização, portabilidade, eliminação e informação
            sobre compartilhamentos, além da revogação de consentimento.
            Para exercer qualquer direito, escreva para [EMAIL_DE_SUPORTE] —
            respondemos em até 15 dias.
          </p>
        </section>

        <section aria-labelledby="cookies">
          <h2 id="cookies" className="font-display text-2xl font-light text-ink">
            7. Cookies
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Usamos cookies essenciais (sessão e carrinho) e de preferência.
            Você pode gerenciá-los nas configurações do navegador; sem os
            essenciais, partes da loja deixam de funcionar.
          </p>
        </section>

        <section aria-labelledby="retencao">
          <h2 id="retencao" className="font-display text-2xl font-light text-ink">
            8. Por quanto tempo guardamos
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Mantemos os dados enquanto a sua conta existir e pelos prazos
            fiscais e legais aplicáveis após cada compra. Depois disso, os
            dados são eliminados ou anonimizados.
          </p>
        </section>

        <section aria-labelledby="alteracoes">
          <h2 id="alteracoes" className="font-display text-2xl font-light text-ink">
            9. Alterações desta política
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Mudanças relevantes serão anunciadas na loja com a data de
            atualização. A versão vigente é sempre a publicada nesta página.
          </p>
        </section>
      </div>
    </main>
  );
}

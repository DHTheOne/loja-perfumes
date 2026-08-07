import type { Metadata } from "next";

import { MinutaNotice } from "@/ui/MinutaNotice";

export const metadata: Metadata = {
  title: "Trocas e devoluções",
  description:
    "Minuta da política de trocas: arrependimento em 7 dias (CDC art. 49), defeitos em 30 dias e procedimento de devolução.",
};

export default function TrocasPage() {
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
        Trocas e devoluções
      </h1>
      <p className="mt-4 font-sans text-sm text-ink-muted">
        Minuta de 7 de agosto de 2026.
      </p>

      <MinutaNotice />

      <div className="mt-12 space-y-10">
        <section aria-labelledby="arrependimento">
          <h2 id="arrependimento" className="font-display text-2xl font-light text-ink">
            1. Arrependimento — 7 dias
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Compras feitas pela internet podem ser desfeitas em até 7 dias
            corridos após o recebimento, sem precisar de motivo (art. 49 do
            Código de Defesa do Consumidor). O reembolso é integral,
            incluindo o frete pago, e o frete de retorno é por nossa conta.
          </p>
        </section>

        <section aria-labelledby="lacre">
          <h2 id="lacre" className="font-display text-2xl font-light text-ink">
            2. Condição do produto
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Perfume é produto de uso pessoal: por higiene e segurança, a
            devolução por arrependimento exige o lacre e a película do
            frasco intactos. Essa condição não se aplica a produtos com
            defeito ou avaria.
          </p>
        </section>

        <section aria-labelledby="defeito">
          <h2 id="defeito" className="font-display text-2xl font-light text-ink">
            3. Defeito ou avaria — 30 dias
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Produto que chegue violado, avariado ou com defeito (válvula,
            vazamento, frasco danificado) pode ser reclamado em até 30 dias
            após o recebimento (art. 26 do CDC). Você escolhe entre
            substituição, abatimento do preço ou reembolso integral.
          </p>
        </section>

        <section aria-labelledby="procedimento">
          <h2 id="procedimento" className="font-display text-2xl font-light text-ink">
            4. Como pedir
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 font-sans text-sm leading-relaxed text-ink-muted">
            <li>
              Escreva para [EMAIL_DE_SUPORTE] com o número do pedido e, em
              caso de avaria, fotos do produto e da embalagem.
            </li>
            <li>
              Enviaremos o código de postagem para devolução sem custo.
            </li>
            <li>
              Após o recebimento, a inspeção leva até 5 dias úteis e você é
              avisado do resultado por e-mail.
            </li>
          </ol>
        </section>

        <section aria-labelledby="reembolso">
          <h2 id="reembolso" className="font-display text-2xl font-light text-ink">
            5. Reembolso
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            O estorno é feito no mesmo meio de pagamento da compra, via
            Mercado Pago, em até 10 dias úteis após a aprovação da
            devolução. O prazo de aparecer na fatura depende do emissor do
            cartão.
          </p>
        </section>
      </div>
    </main>
  );
}

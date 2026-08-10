import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/config/site";

const pageDescription =
  "As vendas ainda não abriram. Esta é a etapa que receberá pagamento e entrega quando a loja entrar em operação.";

export const metadata: Metadata = {
  title: "Checkout",
  description: pageDescription,
  alternates: { canonical: "/sacola/checkout" },
  robots: { index: false, follow: true },
};

/**
 * Entrada do checkout — deliberadamente sem formulário.
 *
 * O fluxo termina aqui de propósito. Coletar nome, endereço ou pagamento
 * exigiria decisões que o proprietário ainda não tomou (PROJECT_STATUS:
 * provedor de e-mail, estratégia de frete, CNPJ) e credenciais do Mercado
 * Pago (ADR-0004) que não estão configuradas. Um formulário bonito que
 * descarta o que recebe é pior do que não ter formulário: a pessoa entrega
 * dados pessoais acreditando que viraram um pedido.
 *
 * O que existe aqui é a etapa e o contrato dela. Quando as vendas abrirem,
 * é este arquivo que recebe o formulário e a chamada ao gateway.
 */
export default function CheckoutPage() {
  return (
    <main
      id="conteudo"
      className="mx-auto w-full max-w-3xl px-6 pt-36 md:px-12"
      style={{ paddingBottom: "var(--space-section)" }}
    >
      <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
        Checkout
      </p>
      <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">
        As vendas ainda não abriram
      </h1>

      <div className="mt-8 space-y-5 font-sans text-base leading-relaxed text-ink-muted">
        <p>
          Sua sacola continua guardada neste navegador. Nada foi cobrado,
          nenhum dado foi enviado e nenhum pedido foi criado.
        </p>
        <p>
          Quando a loja entrar em operação, é nesta etapa que entram entrega,
          pagamento e confirmação. Até lá, o catálogo é de demonstração e os
          preços são ilustrativos.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-raised p-7">
        <h2 className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted">
          O que falta para abrir
        </h2>
        {/* Lista honesta em vez de "em breve": são as pendências reais
            registradas no PROJECT_STATUS. */}
        <ul className="mt-4 space-y-3 font-sans text-sm text-ink-muted">
          <li>Meio de pagamento em produção</li>
          <li>Política de frete e prazo de entrega</li>
          <li>Revisão jurídica dos termos, trocas e privacidade</li>
          <li>Dados fiscais da empresa</li>
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/sacola"
          className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-8 font-sans text-sm text-ink transition-colors duration-300 hover:border-champagne hover:text-champagne"
        >
          Voltar à sacola
        </Link>
        <Link
          href="/colecoes"
          className="inline-flex h-12 items-center justify-center rounded-full bg-champagne px-8 font-sans text-sm font-medium text-void transition-colors duration-300 hover:bg-[var(--metal-champagne-light)]"
        >
          Continuar vendo as coleções
        </Link>
      </div>

      <p className="mt-14 font-sans text-xs leading-relaxed text-ink-muted">
        {site.demoNotice}
      </p>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/config/site";
import { MinutaNotice } from "@/ui/MinutaNotice";

export const metadata: Metadata = {
  title: "Termos de compra",
  description:
    "Minuta dos termos de compra: cadastro, preços, pagamento via Mercado Pago, entrega e responsabilidades.",
};

export default function TermosPage() {
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
        Termos de compra
      </h1>
      <p className="mt-4 font-sans text-sm text-ink-muted">
        Minuta de 7 de agosto de 2026.
      </p>

      <MinutaNotice />

      <div className="mt-12 space-y-10">
        <section aria-labelledby="aceite">
          <h2 id="aceite" className="font-display text-2xl font-light text-ink">
            1. Aceite
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Estes termos regem as compras feitas em {site.name} (nome
            provisório), operada por [CNPJ_OU_DADOS_DA_EMPRESA]. Ao concluir
            um pedido, você declara que leu e aceitou estas condições.
          </p>
        </section>

        <section aria-labelledby="cadastro">
          <h2 id="cadastro" className="font-display text-2xl font-light text-ink">
            2. Cadastro e conta
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            O cadastro exige dados verdadeiros e atualizados. As credenciais
            de acesso são pessoais — atividades feitas com a sua conta são
            de sua responsabilidade. Avise [EMAIL_DE_SUPORTE] imediatamente
            em caso de uso não autorizado.
          </p>
        </section>

        <section aria-labelledby="precos">
          <h2 id="precos" className="font-display text-2xl font-light text-ink">
            3. Produtos e preços
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Preços em reais, exibidos no catálogo e confirmados no checkout.
            Podem mudar sem aviso até a confirmação do pedido. Em caso de
            erro evidente de preço, o pedido poderá ser cancelado com
            comunicação e reembolso integral.
          </p>
        </section>

        <section aria-labelledby="pagamento">
          <h2 id="pagamento" className="font-display text-2xl font-light text-ink">
            4. Pagamento
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Os pagamentos são processados pelo Mercado Pago, nos meios
            oferecidos no checkout. O pedido é confirmado somente após a
            aprovação do pagamento pelo processador.
          </p>
        </section>

        <section aria-labelledby="entrega">
          <h2 id="entrega" className="font-display text-2xl font-light text-ink">
            5. Entrega
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Prazos e custos de frete são calculados no checkout conforme o
            endereço informado. [ESTRATEGIA_DE_FRETE — tabela própria ou
            integração com transportadora, pendente de decisão.] Atrasos
            causados pela transportadora serão acompanhados por nós até a
            resolução.
          </p>
        </section>

        <section aria-labelledby="trocas">
          <h2 id="trocas" className="font-display text-2xl font-light text-ink">
            6. Trocas e devoluções
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            As condições de arrependimento, troca e devolução estão na
            página{" "}
            <Link
              href="/trocas"
              className="text-champagne underline-offset-4 hover:underline"
            >
              Trocas e devoluções
            </Link>
            , que integra estes termos.
          </p>
        </section>

        <section aria-labelledby="propriedade">
          <h2 id="propriedade" className="font-display text-2xl font-light text-ink">
            7. Propriedade intelectual
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            As fragrâncias, nomes de linha, textos, imagens e a identidade
            visual desta loja são criações originais da casa. É vedada a
            reprodução sem autorização expressa.
          </p>
        </section>

        <section aria-labelledby="responsabilidades">
          <h2 id="responsabilidades" className="font-display text-2xl font-light text-ink">
            8. Responsabilidades
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Respondemos pelos produtos que vendemos nos termos do Código de
            Defesa do Consumidor. Não respondemos por indisponibilidades
            causadas por força maior ou por falhas de terceiros fora do
            nosso controle, sem prejuízo dos seus direitos legais.
          </p>
        </section>

        <section aria-labelledby="foro">
          <h2 id="foro" className="font-display text-2xl font-light text-ink">
            9. Contato e foro
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
            Dúvidas: [EMAIL_DE_SUPORTE]. Fica eleito o foro da comarca de
            [COMARCA], sem prejuízo do foro do seu domicílio garantido pelo
            Código de Defesa do Consumidor.
          </p>
        </section>
      </div>
    </main>
  );
}

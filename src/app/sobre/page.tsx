import type { Metadata } from "next";
import Link from "next/link";

import { openGraphFor, site } from "@/config/site";

const pageDescription =
  "A casa, o frasco único e o processo: composição, maceração e engarrafamento em lotes numerados.";

export const metadata: Metadata = {
  title: "Sobre",
  description: pageDescription,
  alternates: { canonical: "/sobre" },
  openGraph: openGraphFor({
    url: "/sobre",
    title: `Sobre — ${site.name}`,
    description: pageDescription,
  }),
};

/** Sequência real de produção — a numeração carrega informação de ordem. */
const processSteps = [
  {
    title: "Composição",
    text:
      "Cada fragrância nasce como acorde no papel antes de tocar o álcool. " +
      "A fórmula é revisada até a pirâmide sustentar as três fases — saída, " +
      "coração e fundo — sem truque de abertura que evapora em minutos.",
  },
  {
    title: "Maceração",
    text:
      "O concentrado descansa em vidro por semanas, no escuro e em " +
      "temperatura constante. É o tempo que arredonda as arestas e faz as " +
      "notas pararem de disputar espaço.",
  },
  {
    title: "Engarrafamento",
    text:
      "Lotes pequenos e numerados, no frasco único da casa: vidro maciço " +
      "de faces retas e tampa em metal champanhe escovado. Sem versão de " +
      "viagem, sem edição relâmpago.",
  },
] as const;

export default function SobrePage() {
  return (
    <main
      id="conteudo"
      className="mx-auto w-full max-w-7xl px-6 pt-36 md:px-12"
      style={{ paddingBottom: "var(--space-section)" }}
    >
      <header className="max-w-2xl">
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
          Sobre
        </p>
        <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">
          Uma casa, sete temperamentos
        </h1>
        <p
          className="mt-6 max-w-xl text-ink-muted"
          style={{ fontSize: "var(--text-lead)" }}
        >
          {site.name} é uma perfumaria autoral: sete fragrâncias originais,
          um único frasco, produção em série limitada. Nada aqui imita
          perfume existente — é composição própria, do acorde ao vidro.
        </p>
      </header>

      <section aria-labelledby="processo-heading" className="mt-20">
        <h2
          id="processo-heading"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted"
        >
          O processo
        </h2>
        <ol className="mt-8 grid gap-10 md:grid-cols-3">
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <p
                aria-hidden="true"
                className="font-display text-5xl font-light text-champagne/60"
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-display text-2xl font-light text-ink">
                {step.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="transparencia-heading"
        className="mt-20 max-w-2xl border-t border-white/10 pt-10"
      >
        <h2
          id="transparencia-heading"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted"
        >
          Transparência
        </h2>
        <p className="mt-4 font-sans text-sm leading-relaxed text-ink-muted">
          {site.demoNotice} Os textos legais — privacidade, termos de compra,
          trocas e devoluções — estão em preparação e passarão por revisão
          jurídica antes do lançamento.
        </p>
        <Link
          href="/colecoes"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-champagne px-8 font-sans text-sm font-medium text-void transition-colors duration-300 hover:bg-[var(--metal-champagne-light)]"
        >
          Ver as coleções
        </Link>
      </section>
    </main>
  );
}

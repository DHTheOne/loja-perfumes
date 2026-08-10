import type { Metadata } from "next";

import { site } from "@/config/site";
import { BagView } from "@/ui/BagView";

const pageDescription =
  "As fragrâncias que você separou. As vendas ainda não abriram — a sacola guarda sua escolha neste navegador.";

export const metadata: Metadata = {
  title: "Sacola",
  description: pageDescription,
  alternates: { canonical: "/sacola" },
  // Fora do índice: o conteúdo é o estado local de cada visitante, não uma
  // página do catálogo. Indexá-la ofereceria na busca uma sacola vazia.
  robots: { index: false, follow: true },
};

export default function SacolaPage() {
  return (
    <main
      id="conteudo"
      className="mx-auto w-full max-w-7xl px-6 pt-36 md:px-12"
      style={{ paddingBottom: "var(--space-section)" }}
    >
      <header className="max-w-2xl">
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
          Sacola
        </p>
        <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">
          O que você separou
        </h1>
      </header>

      <BagView />

      <p className="mt-16 font-sans text-xs leading-relaxed text-ink-muted">
        {site.demoNotice}
      </p>
    </main>
  );
}

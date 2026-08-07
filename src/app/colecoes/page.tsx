import type { Metadata } from "next";

import { lines } from "@/catalog/lines";
import { site } from "@/config/site";
import { LineCard } from "@/ui/LineCard";

export const metadata: Metadata = {
  title: "Coleções",
  description:
    "As sete linhas da casa: amadeirada, cítrica, floral, oriental, aquática e as coleções noturna e unissex. Fragrâncias originais em série limitada.",
};

export default function ColecoesPage() {
  return (
    <main
      id="conteudo"
      className="mx-auto w-full max-w-7xl px-6 pt-36 md:px-12"
      style={{ paddingBottom: "var(--space-section)" }}
    >
      <header className="max-w-2xl">
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
          Coleções
        </p>
        <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">
          Sete linhas, um único frasco
        </h1>
        <p
          className="mt-6 max-w-xl text-ink-muted"
          style={{ fontSize: "var(--text-lead)" }}
        >
          Cada linha parte de uma família olfativa e de uma cor de vidro. O
          frasco não muda — a luz que o atravessa, sim.
        </p>
      </header>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lines.map((fragrance) => (
          <LineCard
            key={fragrance.slug}
            fragrance={fragrance}
            headingLevel="h2"
          />
        ))}
      </div>

      <p className="mt-14 font-sans text-xs leading-relaxed text-ink-muted/70">
        {site.demoNotice}
      </p>
    </main>
  );
}

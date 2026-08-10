import type { Metadata } from "next";
import Link from "next/link";

import { lines } from "@/catalog/lines";
import {
  buildNoteIndex,
  noteStageLabel,
  sharedNotes,
  type NoteEntry,
} from "@/catalog/notes";
import { openGraphFor, site } from "@/config/site";

const pageDescription =
  "Todas as notas olfativas da casa e em que fragrâncias cada uma aparece — na saída, no coração ou no fundo.";

export const metadata: Metadata = {
  title: "Guia de notas",
  description: pageDescription,
  alternates: { canonical: "/notas" },
  openGraph: openGraphFor({
    url: "/notas",
    title: `Guia de notas — ${site.name}`,
    description: pageDescription,
  }),
};

/**
 * Guia de notas olfativas.
 *
 * Entra como conteúdo novo, não como recorte do catálogo: `/colecoes` já
 * filtra por família e ocasião, e uma rota `/familias/[familia]` serviria o
 * mesmo conjunto de linhas por outra URL — competindo consigo mesma na busca,
 * que foi o problema resolvido pelas `canonical` em 2026-08-09.
 *
 * O que esta página responde e nenhuma outra responde: onde uma nota
 * reaparece. É a leitura transversal do catálogo — quem entrou por uma
 * fragrância descobre as outras pelo que elas têm em comum.
 */

function NoteCard({ entry }: { entry: NoteEntry }) {
  return (
    <li className="scroll-reveal rounded-2xl border border-white/10 bg-raised p-6">
      <h3
        id={`nota-${entry.slug}`}
        className="font-display text-2xl font-light text-ink"
      >
        {entry.name}
      </h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {entry.usedBy.map((usage) => (
          <li key={`${usage.slug}-${usage.stage}`}>
            <Link
              href={`/perfumes/${usage.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 py-2 pl-4 pr-3 font-sans text-sm text-ink-muted transition-colors duration-300 hover:border-champagne hover:text-champagne"
            >
              {usage.name}
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-widest">
                {noteStageLabel[usage.stage]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function NotasPage() {
  const index = buildNoteIndex(lines);
  const compartilhadas = sharedNotes(index);

  return (
    <main
      id="conteudo"
      className="mx-auto w-full max-w-7xl px-6 pt-36 md:px-12"
      style={{ paddingBottom: "var(--space-section)" }}
    >
      <header className="max-w-2xl">
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
          Guia de notas
        </p>
        <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">
          O vocabulário da casa
        </h1>
        <p
          className="mt-6 max-w-xl text-ink-muted"
          style={{ fontSize: "var(--text-lead)" }}
        >
          Uma fragrância se lê em três tempos: a saída, que dura minutos; o
          coração, que sustenta; o fundo, que fica. Abaixo, cada nota do
          catálogo e onde ela aparece.
        </p>
        <p className="mt-4 font-sans text-sm text-ink-muted">
          {index.length} notas em {lines.length} linhas —{" "}
          {compartilhadas.length} aparecem em mais de uma.
        </p>
      </header>

      {compartilhadas.length > 0 ? (
        <section aria-labelledby="pontes-heading" className="mt-16">
          <h2
            id="pontes-heading"
            className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted"
          >
            Notas que atravessam a coleção
          </h2>
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-ink-muted">
            São elas que dão parentesco às linhas: quem gosta de uma costuma
            reconhecer a outra.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {compartilhadas.map((entry) => (
              <NoteCard key={entry.slug} entry={entry} />
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="todas-heading" className="mt-20">
        <h2
          id="todas-heading"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted"
        >
          Todas as notas
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {index.map((entry) => (
            <NoteCard key={entry.slug} entry={entry} />
          ))}
        </ul>
      </section>

      <p className="mt-16 font-sans text-xs leading-relaxed text-ink-muted">
        {site.demoNotice}
      </p>
    </main>
  );
}

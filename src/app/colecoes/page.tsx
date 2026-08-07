import type { Metadata } from "next";
import Link from "next/link";

import {
  familyOptions,
  filterLines,
  occasionOptions,
  parseFamilyParam,
  parseOccasionParam,
} from "@/catalog/filter";
import { lines } from "@/catalog/lines";
import { site } from "@/config/site";
import { LineCard } from "@/ui/LineCard";

export const metadata: Metadata = {
  title: "Coleções",
  description:
    "As sete linhas da casa: amadeirada, cítrica, floral, oriental, aquática e as coleções noturna e unissex. Fragrâncias originais em série limitada.",
};

type ColecoesPageProps = {
  searchParams: Promise<{
    familia?: string | string[];
    ocasiao?: string | string[];
  }>;
};

/** Filtro vive na URL — compartilhável e sem JavaScript no cliente. */
function buildHref(familia?: string, ocasiao?: string): string {
  const params = new URLSearchParams();
  if (familia) params.set("familia", familia);
  if (ocasiao) params.set("ocasiao", ocasiao);
  const query = params.toString();
  return query ? `/colecoes?${query}` : "/colecoes";
}

type FilterChipProps = {
  href: string;
  label: string;
  isActive: boolean;
};

function FilterChip({ href, label, isActive }: FilterChipProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "true" : undefined}
      className={`inline-flex h-9 items-center rounded-full border px-4 font-sans text-sm transition-colors duration-300 ${
        isActive
          ? "border-transparent bg-champagne text-void"
          : "border-white/15 text-ink-muted hover:border-champagne hover:text-champagne"
      }`}
    >
      {label}
    </Link>
  );
}

export default async function ColecoesPage({ searchParams }: ColecoesPageProps) {
  const params = await searchParams;
  const activeFamily = parseFamilyParam(params.familia);
  const activeOccasion = parseOccasionParam(params.ocasiao);

  const filtered = filterLines(lines, {
    family: activeFamily?.family,
    occasion: activeOccasion?.occasion,
  });

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

      <div className="mt-12 space-y-4">
        <div
          role="group"
          aria-label="Filtrar por família olfativa"
          className="flex flex-wrap items-center gap-2"
        >
          <span className="mr-2 font-sans text-xs uppercase tracking-[0.25em] text-ink-muted">
            Família
          </span>
          <FilterChip
            href={buildHref(undefined, activeOccasion?.param)}
            label="Todas"
            isActive={!activeFamily}
          />
          {familyOptions.map((option) => (
            <FilterChip
              key={option.param}
              href={buildHref(option.param, activeOccasion?.param)}
              label={option.label}
              isActive={activeFamily?.param === option.param}
            />
          ))}
        </div>

        <div
          role="group"
          aria-label="Filtrar por ocasião"
          className="flex flex-wrap items-center gap-2"
        >
          <span className="mr-2 font-sans text-xs uppercase tracking-[0.25em] text-ink-muted">
            Ocasião
          </span>
          <FilterChip
            href={buildHref(activeFamily?.param, undefined)}
            label="Todas"
            isActive={!activeOccasion}
          />
          {occasionOptions.map((option) => (
            <FilterChip
              key={option.param}
              href={buildHref(activeFamily?.param, option.param)}
              label={option.label}
              isActive={activeOccasion?.param === option.param}
            />
          ))}
        </div>
      </div>

      <p className="mt-8 font-sans text-sm text-ink-muted">
        {filtered.length === lines.length
          ? `${lines.length} linhas`
          : `${filtered.length} de ${lines.length} linhas`}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((fragrance) => (
            <LineCard
              key={fragrance.slug}
              fragrance={fragrance}
              headingLevel="h2"
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-white/10 bg-raised p-10 text-center">
          <p className="font-display text-2xl font-light text-ink">
            Nenhuma linha combina esses filtros
          </p>
          <p className="mt-2 font-sans text-sm text-ink-muted">
            Experimente outra combinação de família e ocasião.
          </p>
          <Link
            href="/colecoes"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 font-sans text-sm text-ink transition-colors duration-300 hover:border-champagne hover:text-champagne"
          >
            Limpar filtros
          </Link>
        </div>
      )}

      <p className="mt-14 font-sans text-xs leading-relaxed text-ink-muted">
        {site.demoNotice}
      </p>
    </main>
  );
}

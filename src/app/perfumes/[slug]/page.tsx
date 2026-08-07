import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatPriceBRL, getLineBySlug, lines } from "@/catalog/lines";
import { site } from "@/config/site";
import { BottleGlyph } from "@/ui/BottleGlyph";
import { hexToRgba } from "@/ui/color";
import { line } from "@/ui/tokens";

/** Catálogo estático na Fase 2 → todas as páginas saem no build. */
export function generateStaticParams() {
  return lines.map((fragrance) => ({ slug: fragrance.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fragrance = getLineBySlug(slug);
  if (!fragrance) return {};
  return {
    title: fragrance.name,
    description: `${fragrance.tagline} ${fragrance.familyLabel}, ${fragrance.concentration}.`,
  };
}

const INTENSITY_SCALE = [1, 2, 3, 4, 5] as const;

const noteStages = [
  {
    key: "top",
    label: "Saída",
    hint: "os primeiros minutos",
  },
  {
    key: "heart",
    label: "Coração",
    hint: "o corpo da fragrância",
  },
  {
    key: "base",
    label: "Fundo",
    hint: "o rastro que permanece",
  },
] as const;

export default async function PerfumePage({ params }: PageProps) {
  const { slug } = await params;
  const fragrance = getLineBySlug(slug);
  if (!fragrance) notFound();

  const glass = line[fragrance.lineKey];
  const seasonsLabel = fragrance.seasons.join(" · ");

  return (
    <main
      id="conteudo"
      className="mx-auto w-full max-w-7xl px-6 pt-32 md:px-12"
      style={{ paddingBottom: "var(--space-section)" }}
    >
      <Link
        href="/colecoes"
        className="font-sans text-sm text-ink-muted transition-colors duration-300 hover:text-champagne"
      >
        ← Todas as coleções
      </Link>

      <div className="mt-10 grid gap-14 lg:grid-cols-[5fr_7fr]">
        {/* ——— Visual — placeholder programático até a mídia final ——— */}
        <div className="relative self-start overflow-hidden rounded-2xl border border-white/10 bg-raised lg:sticky lg:top-28">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `radial-gradient(110% 80% at 50% 0%, ${hexToRgba(glass, 0.35)} 0%, transparent 65%)`,
            }}
          />
          <div className="relative flex aspect-[4/5] items-center justify-center">
            <BottleGlyph
              lineKey={fragrance.lineKey}
              className="aspect-[2/5] w-28 md:w-36"
            />
          </div>
        </div>

        {/* ——— Informação ——— */}
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
            {fragrance.familyLabel} · {fragrance.concentration}
          </p>
          <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">
            {fragrance.name}
          </h1>
          <p
            className="mt-5 max-w-lg text-ink-muted"
            style={{ fontSize: "var(--text-lead)" }}
          >
            {fragrance.tagline}
          </p>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ink-muted">
            {fragrance.description}
          </p>

          {/* Volumes e preços — valores definidos no servidor (seed). */}
          <section aria-labelledby="volumes-heading" className="mt-12">
            <h2
              id="volumes-heading"
              className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted"
            >
              Volumes
            </h2>
            <ul className="mt-4 flex flex-wrap gap-4">
              {fragrance.volumes.map((volume) => (
                <li
                  key={volume.ml}
                  className="rounded-xl border border-white/10 bg-raised px-6 py-4"
                >
                  <p className="font-sans text-sm text-ink">{volume.ml} ml</p>
                  <p className="mt-1 font-sans text-base text-champagne">
                    {formatPriceBRL(volume.priceCents)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <button
                type="button"
                disabled
                className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full border border-white/15 px-8 font-sans text-sm text-ink-muted"
              >
                Vendas abrem em breve
              </button>
              <p className="mt-3 font-sans text-xs leading-relaxed text-ink-muted/70">
                A loja está em construção — preços exibidos são de
                demonstração.
              </p>
            </div>
          </section>

          {/* Pirâmide olfativa */}
          <section aria-labelledby="piramide-heading" className="mt-12">
            <h2
              id="piramide-heading"
              className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted"
            >
              Pirâmide olfativa
            </h2>
            <div className="mt-4 space-y-6">
              {noteStages.map((stage) => (
                <div key={stage.key}>
                  <p className="font-display text-xl font-light text-ink">
                    {stage.label}
                    <span className="ml-3 font-sans text-xs uppercase tracking-widest text-ink-muted/70">
                      {stage.hint}
                    </span>
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {fragrance.notes[stage.key].map((note) => (
                      <li
                        key={note}
                        className="rounded-full border border-white/10 px-4 py-1.5 font-sans text-sm text-ink-muted"
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Perfil */}
          <section aria-labelledby="perfil-heading" className="mt-12">
            <h2
              id="perfil-heading"
              className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted"
            >
              Perfil
            </h2>
            <dl className="mt-4 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              <div>
                <dt className="font-sans text-sm text-ink-muted">Intensidade</dt>
                <dd className="mt-2">
                  <div
                    role="img"
                    aria-label={`Intensidade ${fragrance.intensity} de 5`}
                    className="flex items-center gap-1.5"
                  >
                    {INTENSITY_SCALE.map((step) => (
                      <span
                        key={step}
                        aria-hidden="true"
                        className={`h-1.5 w-6 rounded-full ${
                          step <= fragrance.intensity
                            ? "bg-champagne"
                            : "bg-white/15"
                        }`}
                      />
                    ))}
                  </div>
                </dd>
              </div>
              <div>
                <dt className="font-sans text-sm text-ink-muted">Duração</dt>
                <dd className="mt-2 font-sans text-sm text-ink">
                  cerca de {fragrance.longevityHours} h na pele
                </dd>
              </div>
              <div>
                <dt className="font-sans text-sm text-ink-muted">Ocasião</dt>
                <dd className="mt-2 font-sans text-sm capitalize text-ink">
                  {fragrance.occasion}
                </dd>
              </div>
              <div>
                <dt className="font-sans text-sm text-ink-muted">Estações</dt>
                <dd className="mt-2 font-sans text-sm capitalize text-ink">
                  {seasonsLabel}
                </dd>
              </div>
            </dl>
          </section>

          <p className="mt-12 font-sans text-xs leading-relaxed text-ink-muted/70">
            {site.demoNotice}
          </p>
        </div>
      </div>
    </main>
  );
}

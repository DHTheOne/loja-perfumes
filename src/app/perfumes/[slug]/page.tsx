import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getLineBySlug, lines } from "@/catalog/lines";
import { openGraphFor, site } from "@/config/site";
import { AddToBag } from "@/ui/AddToBag";
import { BottleGlyph } from "@/ui/BottleGlyph";
import { hexToRgba } from "@/ui/color";
import { lineMediaAlt, lineMediaForSlug } from "@/ui/lineMedia";
import { glassColorForSlug, lineKeyForSlug } from "@/ui/lineVisual";

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
  const description = `${fragrance.tagline} ${fragrance.familyLabel}, ${fragrance.concentration}.`;
  const media = lineMediaForSlug(fragrance.slug);
  return {
    title: fragrance.name,
    description,
    alternates: { canonical: `/perfumes/${fragrance.slug}` },
    // O `type` fica em "website": o Next só aceita os tipos do OG core. A
    // semântica de produto vai no JSON-LD do corpo da página, que é o que os
    // buscadores leem para preço e disponibilidade.
    openGraph: openGraphFor({
      url: `/perfumes/${fragrance.slug}`,
      title: `${fragrance.name} — ${site.name}`,
      description,
      // Cada produto compartilha a própria fragrância. Sem isto as sete
      // páginas publicariam o mesmo frasco do hero, e o cartão deixaria de
      // distinguir o que está sendo compartilhado.
      image: media
        ? {
            url: media.src,
            width: media.width,
            height: media.height,
            alt: lineMediaAlt(fragrance.name, fragrance.familyLabel),
          }
        : undefined,
    }),
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

  const glass = glassColorForSlug(fragrance.slug);
  const media = lineMediaForSlug(fragrance.slug);
  const seasonsLabel = fragrance.seasons.join(" · ");

  /**
   * Dados estruturados de produto (schema.org/Product).
   *
   * É o que permite ao buscador exibir preço e disponibilidade junto do
   * resultado, em vez de só título e descrição. `availability: PreOrder`
   * e `demoNotice` mantêm a página honesta: o catálogo é fictício e as
   * vendas ainda não abriram — anunciar `InStock` seria declarar ao Google
   * um estoque que não existe.
   */
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: fragrance.name,
    description: fragrance.description,
    category: fragrance.familyLabel,
    brand: { "@type": "Brand", name: site.name },
    disambiguatingDescription: site.demoNotice,
    offers: fragrance.volumes.map((volume) => ({
      "@type": "Offer",
      name: `${volume.ml} ml`,
      price: (volume.priceCents / 100).toFixed(2),
      priceCurrency: "BRL",
      availability: "https://schema.org/PreOrder",
    })),
  };

  return (
    <main
      id="conteudo"
      className="mx-auto w-full max-w-7xl px-6 pt-32 md:px-12"
      style={{ paddingBottom: "var(--space-section)" }}
    >
      {/* Os valores vêm do catálogo estático do repositório, não de entrada de
          usuário. Ainda assim todo sinal de menor-que é reescrito na forma de
          escape unicode do JSON: é o que impede que uma tag de fechamento de
          script dentro de um texto do catálogo encerre este bloco antes da
          hora e jogue o resto do JSON no HTML como marcação. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Link
        href="/colecoes"
        className="font-sans text-sm text-ink-muted transition-colors duration-300 hover:text-champagne"
      >
        ← Todas as coleções
      </Link>

      <div className="mt-10 grid gap-14 lg:grid-cols-[5fr_7fr]">
        {/* ——— Visual ——— */}
        <div className="relative self-start overflow-hidden rounded-2xl border border-white/10 bg-raised lg:sticky lg:top-28">
          {media ? (
            <Image
              src={media.src}
              alt={lineMediaAlt(fragrance.name, fragrance.familyLabel)}
              width={media.width}
              height={media.height}
              placeholder="blur"
              blurDataURL={media.blurDataURL}
              /* Prioridade alta: num viewport de produto esta imagem é o LCP.
                 Deixá-la em lazy adiaria o próprio elemento que define a
                 métrica. */
              priority
              sizes="(min-width: 1024px) 42vw, 92vw"
              className="h-auto w-full"
            />
          ) : (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(110% 80% at 50% 0%, ${hexToRgba(glass, 0.35)} 0%, transparent 65%)`,
                }}
              />
              <div className="relative flex aspect-[4/5] items-center justify-center">
                <BottleGlyph
                  lineKey={lineKeyForSlug(fragrance.slug)}
                  className="aspect-[2/5] w-28 md:w-36"
                />
              </div>
            </>
          )}
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
            <div className="mt-4">
              <AddToBag slug={fragrance.slug} volumes={fragrance.volumes} />
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
                    <span className="ml-3 font-sans text-xs uppercase tracking-widest text-ink-muted">
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

          <p className="mt-12 font-sans text-xs leading-relaxed text-ink-muted">
            {site.demoNotice}
          </p>
        </div>
      </div>
    </main>
  );
}

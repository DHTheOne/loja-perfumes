import Image from "next/image";
import Link from "next/link";

import { formatPriceBRL, startingPriceCents } from "@/catalog/lines";
import type { FragranceLine } from "@/catalog/types";
import { BottleGlyph } from "@/ui/BottleGlyph";
import { hexToRgba } from "@/ui/color";
import { lineMediaAlt, lineMediaForSlug } from "@/ui/lineMedia";
import { glassColorForSlug, lineKeyForSlug } from "@/ui/lineVisual";

type LineCardProps = {
  fragrance: FragranceLine;
  /** "h2" quando o card está direto sob um h1 (ex.: /colecoes). */
  headingLevel?: "h2" | "h3";
};

/**
 * Card de linha.
 *
 * Com cinematográfica publicada, a foto é o corpo do card. Sem ela, o card
 * cai na silhueta programática desenhada na cor de vidro da fragrância — o
 * mesmo desenho que serviu a coleção inteira antes de a mídia existir. As
 * duas variantes ocupam a mesma caixa 16:9, então uma linha sem foto não
 * desalinha a grade das que têm.
 */
export function LineCard({ fragrance, headingLevel = "h3" }: LineCardProps) {
  const glass = glassColorForSlug(fragrance.slug);
  const media = lineMediaForSlug(fragrance.slug);
  const Heading = headingLevel;

  return (
    <Link
      href={`/perfumes/${fragrance.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-raised transition-colors duration-500 hover:border-white/25"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50 transition-opacity duration-700 group-hover:opacity-90"
        style={{
          background: `radial-gradient(120% 90% at 50% -10%, ${hexToRgba(glass, 0.3)} 0%, transparent 62%)`,
        }}
      />

      <div className="relative aspect-[16/9] overflow-hidden">
        {media ? (
          <Image
            src={media.src}
            alt={lineMediaAlt(fragrance.name, fragrance.familyLabel)}
            width={media.width}
            height={media.height}
            placeholder="blur"
            blurDataURL={media.blurDataURL}
            /* O card nunca ocupa a largura toda no desktop: são três colunas
               em /colecoes e na home. Sem `sizes` o Next assumiria 100vw e
               serviria um arquivo três vezes maior que o necessário. */
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 92vw"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BottleGlyph
              lineKey={lineKeyForSlug(fragrance.slug)}
              className="aspect-[2/5] w-14 transition-transform duration-700 group-hover:-translate-y-1.5 sm:w-16"
            />
          </div>
        )}
      </div>

      <div className="relative p-7 text-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-ink-muted">
          {fragrance.familyLabel}
        </p>
        <Heading className="mt-3 font-display text-3xl font-light text-ink">
          {fragrance.name}
        </Heading>
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
          {fragrance.tagline}
        </p>
        <p className="mt-5 font-sans text-sm text-champagne">
          A partir de {formatPriceBRL(startingPriceCents(fragrance))}
        </p>
      </div>
    </Link>
  );
}

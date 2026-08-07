import Link from "next/link";

import { formatPriceBRL, startingPriceCents } from "@/catalog/lines";
import type { FragranceLine } from "@/catalog/types";
import { BottleGlyph } from "@/ui/BottleGlyph";
import { hexToRgba } from "@/ui/color";
import { line } from "@/ui/tokens";

type LineCardProps = {
  fragrance: FragranceLine;
  /** "h2" quando o card está direto sob um h1 (ex.: /colecoes). */
  headingLevel?: "h2" | "h3";
};

/**
 * Card de linha sem fotografia: a cor de vidro da fragrância é o próprio
 * material do card — luz radial no topo e silhueta do frasco. Quando a
 * mídia final existir, a imagem entra no lugar do BottleGlyph e o resto
 * permanece.
 */
export function LineCard({ fragrance, headingLevel = "h3" }: LineCardProps) {
  const glass = line[fragrance.lineKey];
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

      <div className="relative flex justify-center pt-12">
        <BottleGlyph
          lineKey={fragrance.lineKey}
          className="aspect-[2/5] w-14 transition-transform duration-700 group-hover:-translate-y-1.5 sm:w-16"
        />
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

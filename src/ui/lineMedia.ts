import { LINE_MEDIA, type LineMediaEntry } from "@/ui/lineMedia.generated";

/**
 * Ponte entre o catálogo e a fotografia de cada linha.
 *
 * Mesmo desenho de `lineVisual.ts`, e pelo mesmo motivo (ARCHITECTURE.md §2):
 * o domínio não conhece asset. O catálogo expõe `slug`; o mapeamento slug →
 * arquivo servido vive aqui, na UI, e é o único ponto a mudar quando a mídia
 * sair do repositório para um bucket na Fase 5.
 *
 * A busca devolve `null` em vez de uma imagem padrão de propósito. Uma linha
 * sem foto deve cair no `BottleGlyph`, que é desenhado na cor dela — servir a
 * foto de outra fragrância mostraria o frasco errado na página do produto,
 * que foi exatamente a falha corrigida em 2026-08-09 (ver PROJECT_STATUS).
 */

export type { LineMediaEntry };

/** `true` quando a linha tem cinematográfica publicada. */
export function hasLineMedia(slug: string): boolean {
  return Object.hasOwn(LINE_MEDIA, slug);
}

/** Imagem da linha, ou `null` quando ela ainda não tem mídia publicada. */
export function lineMediaForSlug(slug: string): LineMediaEntry | null {
  return LINE_MEDIA[slug as keyof typeof LINE_MEDIA] ?? null;
}

/**
 * Texto alternativo da cinematográfica.
 *
 * Descreve o que a imagem mostra — frasco e clima da linha — em vez de repetir
 * o nome, que já está no título ao lado. Leitor de tela que anuncia "Flora
 * Velada, imagem: Flora Velada" não ganhou informação nenhuma.
 */
export function lineMediaAlt(name: string, familyLabel: string): string {
  return `Frasco da linha ${name} em cena de estúdio, fotografia de fragrância ${familyLabel.toLowerCase()}`;
}

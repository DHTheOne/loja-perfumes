import { describe, expect, it } from "vitest";

import { lines } from "@/catalog/lines";
import {
  DEFAULT_LINE_KEY,
  glassColorForSlug,
  hasLineKey,
  lineKeyForSlug,
} from "@/ui/lineVisual";
import { line as lineColors } from "@/ui/tokens";

/**
 * Guarda da fronteira domínio → UI.
 *
 * O catálogo deixou de carregar `lineKey` (ARCHITECTURE.md §2), então nada no
 * tipo obriga o mapa desta camada a acompanhar uma linha nova. Este teste faz
 * esse papel: adicionar um perfume sem registrar o vidro dele quebra aqui, em
 * vez de a linha aparecer silenciosamente com a cor da assinatura da casa.
 */
describe("lineVisual — mapa slug → vidro", () => {
  it("mapeia explicitamente todas as linhas do catálogo", () => {
    const semMapa = lines
      .filter((fragrance) => !hasLineKey(fragrance.slug))
      .map((fragrance) => fragrance.slug);

    expect(semMapa).toEqual([]);
  });

  it("resolve cada linha para uma cor de vidro existente nos tokens", () => {
    for (const fragrance of lines) {
      expect(glassColorForSlug(fragrance.slug)).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("não repete o mesmo vidro em linhas diferentes", () => {
    const chaves = lines.map((fragrance) => lineKeyForSlug(fragrance.slug));

    expect(new Set(chaves).size).toBe(chaves.length);
  });

  it("cai no vidro padrão para slug desconhecido, sem lançar", () => {
    expect(hasLineKey("slug-que-nao-existe")).toBe(false);
    expect(lineKeyForSlug("slug-que-nao-existe")).toBe(DEFAULT_LINE_KEY);
    expect(glassColorForSlug("slug-que-nao-existe")).toBe(
      lineColors[DEFAULT_LINE_KEY],
    );
  });
});

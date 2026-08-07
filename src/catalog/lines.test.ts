import { describe, expect, it } from "vitest";

import {
  formatPriceBRL,
  getLineBySlug,
  lines,
  startingPriceCents,
} from "@/catalog/lines";
import { line as lineColors } from "@/ui/tokens";

/**
 * Integridade do seed — estas invariantes viram constraints de banco na
 * Fase 5; até lá, o teste é o que impede um card sem preço ou uma página
 * de produto sem notas.
 */
describe("catálogo — integridade das linhas", () => {
  it("tem exatamente as 7 linhas do MEDIA_PLAN §5", () => {
    expect(lines).toHaveLength(7);
  });

  it("tem slugs únicos em kebab-case", () => {
    const slugs = lines.map((fragrance) => fragrance.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("tem pirâmide olfativa completa em todas as linhas", () => {
    for (const fragrance of lines) {
      expect(fragrance.notes.top.length).toBeGreaterThan(0);
      expect(fragrance.notes.heart.length).toBeGreaterThan(0);
      expect(fragrance.notes.base.length).toBeGreaterThan(0);
    }
  });

  it("tem preços em centavos como inteiros positivos", () => {
    for (const fragrance of lines) {
      expect(fragrance.volumes.length).toBeGreaterThan(0);
      for (const volume of fragrance.volumes) {
        expect(Number.isInteger(volume.priceCents)).toBe(true);
        expect(volume.priceCents).toBeGreaterThan(0);
        expect(volume.ml).toBeGreaterThan(0);
      }
    }
  });

  it("aponta cada linha para uma cor de vidro existente nos tokens", () => {
    for (const fragrance of lines) {
      expect(lineColors[fragrance.lineKey]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("tem copy editorial preenchida", () => {
    for (const fragrance of lines) {
      expect(fragrance.name.trim().length).toBeGreaterThan(0);
      expect(fragrance.tagline.trim().length).toBeGreaterThan(0);
      expect(fragrance.description.trim().length).toBeGreaterThan(50);
    }
  });
});

describe("catálogo — helpers", () => {
  it("encontra linha por slug e devolve undefined para slug desconhecido", () => {
    expect(getLineBySlug("lenho-vigil")?.name).toBe("Lenho Vigil");
    expect(getLineBySlug("nao-existe")).toBeUndefined();
  });

  it("calcula o menor preço da linha", () => {
    const fragrance = getLineBySlug("lenho-vigil");
    expect(fragrance).toBeDefined();
    if (!fragrance) return;
    const minimum = Math.min(
      ...fragrance.volumes.map((volume) => volume.priceCents),
    );
    expect(startingPriceCents(fragrance)).toBe(minimum);
  });

  it("formata centavos como BRL", () => {
    // O Intl usa espaço não separável entre "R$" e o valor — \s cobre ambos.
    expect(formatPriceBRL(52900)).toMatch(/^R\$\s529,00$/);
    expect(formatPriceBRL(100)).toMatch(/^R\$\s1,00$/);
  });
});

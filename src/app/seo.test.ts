import { describe, expect, it } from "vitest";

import robots, { MINUTAS_LEGAIS } from "@/app/robots";
import sitemap from "@/app/sitemap";
import { lines } from "@/catalog/lines";

/**
 * Estes testes existem pelo risco, não pela cobertura.
 *
 * As minutas legais afirmam prazos e direitos que ainda não passaram por
 * revisão jurídica. Se alguém publicá-las no sitemap ou remover o `disallow`,
 * o erro não aparece em nenhuma tela — só num resultado de busca, depois de
 * indexado. É o tipo de regressão que precisa quebrar o build.
 */
describe("robots.txt", () => {
  it("bloqueia todas as minutas legais", () => {
    const { rules } = robots();
    const disallow = Array.isArray(rules) ? [] : [rules.disallow].flat();

    for (const minuta of MINUTAS_LEGAIS) {
      expect(disallow).toContain(minuta);
    }
  });

  it("libera o restante do site e aponta o sitemap", () => {
    const resultado = robots();
    const { rules } = resultado;

    expect(Array.isArray(rules) ? undefined : rules.allow).toBe("/");
    expect(resultado.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});

describe("sitemap.xml", () => {
  const urls = sitemap().map((entrada) => entrada.url);

  it("não anuncia nenhuma minuta legal", () => {
    for (const minuta of MINUTAS_LEGAIS) {
      expect(urls.some((url) => url.endsWith(minuta))).toBe(false);
    }
  });

  it("lista todas as páginas de produto do catálogo", () => {
    for (const fragrance of lines) {
      expect(
        urls.some((url) => url.endsWith(`/perfumes/${fragrance.slug}`)),
      ).toBe(true);
    }
  });

  it("não repete URL", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("usa apenas URLs absolutas", () => {
    for (const url of urls) {
      expect(() => new URL(url)).not.toThrow();
    }
  });
});

import { describe, expect, it } from "vitest";

import { metadata as colecoesMetadata } from "@/app/colecoes/page";
import { metadata as homeMetadata } from "@/app/page";
import { generateMetadata as perfumeMetadata } from "@/app/perfumes/[slug]/page";
import robots, { MINUTAS_LEGAIS } from "@/app/robots";
import sitemap from "@/app/sitemap";
import { metadata as sobreMetadata } from "@/app/sobre/page";
import { lines } from "@/catalog/lines";
import { socialImage } from "@/config/site";

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

/**
 * Armadilha real do App Router, encontrada em 2026-08-09.
 *
 * `openGraph` SUBSTITUI o valor do layout — não mescla. Uma página que declare
 * apenas `openGraph: { url }` perde imagem, `type`, `locale` e `siteName` sem
 * erro de build, sem aviso e sem teste vermelho: o link simplesmente passa a
 * ser publicado sem cartão nas redes sociais. Estes testes existem para que a
 * omissão quebre aqui, e não no WhatsApp de um cliente.
 */
describe("cartão de compartilhamento (Open Graph)", () => {
  async function perfumeOpenGraph(slug: string) {
    const resolved = await perfumeMetadata({
      params: Promise.resolve({ slug }),
    });
    return resolved.openGraph;
  }

  const rotasEstaticas = [
    ["home", homeMetadata],
    ["coleções", colecoesMetadata],
    ["sobre", sobreMetadata],
  ] as const;

  it.each(rotasEstaticas)("%s anuncia a imagem social", (_nome, metadata) => {
    const images = metadata.openGraph?.images;

    expect(Array.isArray(images) ? images : []).toContainEqual(
      expect.objectContaining({ url: socialImage.url }),
    );
  });

  it.each(rotasEstaticas)("%s declara canonical própria", (_nome, metadata) => {
    expect(metadata.alternates?.canonical).toBeTruthy();
  });

  it("toda página de produto anuncia imagem, canonical e URL própria", async () => {
    for (const fragrance of lines) {
      const openGraph = await perfumeOpenGraph(fragrance.slug);
      const images = openGraph?.images;

      expect(Array.isArray(images) ? images : []).toContainEqual(
        expect.objectContaining({ url: socialImage.url }),
      );
      expect(openGraph?.url).toBe(`/perfumes/${fragrance.slug}`);
    }
  });

  it("cada produto tem canonical distinta, apontando para si", async () => {
    const canonicals = await Promise.all(
      lines.map(async (fragrance) => {
        const resolved = await perfumeMetadata({
          params: Promise.resolve({ slug: fragrance.slug }),
        });
        return resolved.alternates?.canonical;
      }),
    );

    for (const [index, fragrance] of lines.entries()) {
      expect(canonicals[index]).toBe(`/perfumes/${fragrance.slug}`);
    }
    expect(new Set(canonicals).size).toBe(lines.length);
  });
});

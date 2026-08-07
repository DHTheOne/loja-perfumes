import { describe, expect, it } from "vitest";

import { FALLBACK_ORIGIN, normalizeOrigin } from "@/config/origin";

/**
 * A origem entra em URLs absolutas de sitemap, robots e canonical. Um valor
 * malformado não quebra o build — ele publica links quebrados, que é pior
 * porque passa despercebido. Daí a normalização ser testada nas bordas.
 */
describe("normalizeOrigin", () => {
  it("usa o fallback quando APP_URL não está definida", () => {
    expect(normalizeOrigin(undefined)).toBe(FALLBACK_ORIGIN);
  });

  it.each(["", "   "])("usa o fallback para valor vazio %o", (vazio) => {
    expect(normalizeOrigin(vazio)).toBe(FALLBACK_ORIGIN);
  });

  it("remove barras finais para não gerar caminho duplicado", () => {
    expect(normalizeOrigin("https://exemplo.com.br/")).toBe(
      "https://exemplo.com.br",
    );
    expect(normalizeOrigin("https://exemplo.com.br///")).toBe(
      "https://exemplo.com.br",
    );
  });

  it("preserva host, porta e caminho de subdiretório", () => {
    expect(normalizeOrigin("http://localhost:4000")).toBe(
      "http://localhost:4000",
    );
    expect(normalizeOrigin("https://exemplo.com.br/loja")).toBe(
      "https://exemplo.com.br/loja",
    );
  });

  it("ignora espaços em volta", () => {
    expect(normalizeOrigin("  https://exemplo.com.br  ")).toBe(
      "https://exemplo.com.br",
    );
  });

  it.each(["exemplo.com.br", "javascript:alert(1)", "ftp://exemplo.com.br"])(
    "recusa %o e cai no fallback",
    (invalido) => {
      expect(normalizeOrigin(invalido)).toBe(FALLBACK_ORIGIN);
    },
  );
});

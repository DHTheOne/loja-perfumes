import { describe, expect, it } from "vitest";

import { hexToRgba } from "@/ui/color";

describe("hexToRgba", () => {
  it("converte hex de token para rgba com alfa", () => {
    expect(hexToRgba("#c6b78f", 0.5)).toBe("rgba(198, 183, 143, 0.5)");
  });

  it("aceita hex sem cerquilha", () => {
    expect(hexToRgba("0a0908", 1)).toBe("rgba(10, 9, 8, 1)");
  });

  it("expande a forma curta de 3 dígitos", () => {
    // Antes da validação isto devolvia "rgba(NaN, NaN, NaN, 1)".
    expect(hexToRgba("#fff", 1)).toBe("rgba(255, 255, 255, 1)");
    expect(hexToRgba("#0a9", 0.5)).toBe("rgba(0, 170, 153, 0.5)");
  });

  it.each(["#12", "#12345", "#gggggg", "", "rgb(1,2,3)"])(
    "lança em vez de produzir NaN para %o",
    (invalido) => {
      expect(() => hexToRgba(invalido, 1)).toThrow(/hex inválido/);
    },
  );
});

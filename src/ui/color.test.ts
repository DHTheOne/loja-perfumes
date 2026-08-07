import { describe, expect, it } from "vitest";

import { hexToRgba } from "@/ui/color";

describe("hexToRgba", () => {
  it("converte hex de token para rgba com alfa", () => {
    expect(hexToRgba("#c6b78f", 0.5)).toBe("rgba(198, 183, 143, 0.5)");
  });

  it("aceita hex sem cerquilha", () => {
    expect(hexToRgba("0a0908", 1)).toBe("rgba(10, 9, 8, 1)");
  });
});

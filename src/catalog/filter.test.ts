import { describe, expect, it } from "vitest";

import {
  familyOptions,
  filterLines,
  occasionOptions,
  parseFamilyParam,
  parseOccasionParam,
} from "@/catalog/filter";
import { lines } from "@/catalog/lines";

describe("filterLines", () => {
  it("sem filtro devolve todas as linhas", () => {
    expect(filterLines(lines, {})).toHaveLength(lines.length);
  });

  it("filtra por família", () => {
    const floral = filterLines(lines, { family: "floral" });
    expect(floral.map((fragrance) => fragrance.slug)).toEqual(["flora-velada"]);
  });

  it("filtra por ocasião", () => {
    const noite = filterLines(lines, { occasion: "noite" });
    expect(noite.length).toBeGreaterThan(0);
    for (const fragrance of noite) {
      expect(fragrance.occasion).toBe("noite");
    }
  });

  it("combina família e ocasião", () => {
    const resultado = filterLines(lines, {
      family: "oriental",
      occasion: "noite",
    });
    expect(resultado.map((fragrance) => fragrance.slug)).toEqual([
      "ambar-secreto",
      "noturno-absoluto",
    ]);
  });

  it("combinação sem resultado devolve lista vazia", () => {
    expect(
      filterLines(lines, { family: "floral", occasion: "noite" }),
    ).toHaveLength(0);
  });
});

describe("parsers de parâmetros de URL", () => {
  it("aceita apenas valores da allowlist e ignora o resto", () => {
    expect(parseFamilyParam("floral")?.family).toBe("floral");
    expect(parseFamilyParam("<script>alert(1)</script>")).toBeUndefined();
    expect(parseFamilyParam(undefined)).toBeUndefined();
    expect(parseOccasionParam("versatil")?.occasion).toBe("versátil");
    expect(parseOccasionParam("qualquer")).toBeUndefined();
  });

  it("usa o primeiro valor quando o parâmetro se repete", () => {
    expect(parseFamilyParam(["citrica", "floral"])?.family).toBe("citrica");
  });

  it("as opções cobrem todas as famílias e ocasiões presentes no catálogo", () => {
    const families = new Set(lines.map((fragrance) => fragrance.family));
    for (const family of families) {
      expect(familyOptions.some((option) => option.family === family)).toBe(
        true,
      );
    }
    const occasions = new Set(lines.map((fragrance) => fragrance.occasion));
    for (const occasion of occasions) {
      expect(
        occasionOptions.some((option) => option.occasion === occasion),
      ).toBe(true);
    }
  });
});

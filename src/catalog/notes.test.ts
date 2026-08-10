import { describe, expect, it } from "vitest";

import { lines } from "@/catalog/lines";
import {
  buildNoteIndex,
  noteSlug,
  noteStages,
  sharedNotes,
} from "@/catalog/notes";

describe("noteSlug", () => {
  it("remove acentos sem tabela de substituição", () => {
    expect(noteSlug("Íris")).toBe("iris");
    expect(noteSlug("Âmbar-cinza")).toBe("ambar-cinza");
    expect(noteSlug("Baunilha")).toBe("baunilha");
  });

  it("colapsa separadores e não deixa hífen nas pontas", () => {
    expect(noteSlug("  Lírio-d'água  ")).toBe("lirio-d-agua");
    expect(noteSlug("Cedro do Atlas")).toBe("cedro-do-atlas");
  });

  /**
   * O slug vira URL e chave de agrupamento. Se duas notas distintas
   * colapsassem no mesmo slug, o guia fundiria composições diferentes numa
   * entrada só — e a página da nota mentiria sobre quem a usa.
   */
  it("não colide entre as notas reais do catálogo", () => {
    const nomes = new Set<string>();
    for (const fragrance of lines) {
      for (const stage of noteStages) {
        for (const note of fragrance.notes[stage]) nomes.add(note);
      }
    }

    const slugs = [...nomes].map(noteSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every((slug) => /^[a-z0-9-]+$/.test(slug))).toBe(true);
  });
});

describe("buildNoteIndex", () => {
  const index = buildNoteIndex(lines);

  it("cobre todas as notas do catálogo, sem inventar nenhuma", () => {
    const doCatalogo = new Set<string>();
    for (const fragrance of lines) {
      for (const stage of noteStages) {
        for (const note of fragrance.notes[stage]) doCatalogo.add(note);
      }
    }

    expect(index.length).toBe(doCatalogo.size);
    expect(index.every((entry) => doCatalogo.has(entry.name))).toBe(true);
  });

  it("registra o estágio de cada uso, não só a linha", () => {
    for (const entry of index) {
      expect(entry.usedBy.length).toBeGreaterThan(0);
      for (const usage of entry.usedBy) {
        expect(noteStages).toContain(usage.stage);
        expect(lines.some((line) => line.slug === usage.slug)).toBe(true);
      }
    }
  });

  it("aponta para linhas que existem, com o nome correto", () => {
    for (const entry of index) {
      for (const usage of entry.usedBy) {
        const fragrance = lines.find((line) => line.slug === usage.slug);
        expect(fragrance?.name).toBe(usage.name);
      }
    }
  });

  it("ordena alfabeticamente em português", () => {
    const nomes = index.map((entry) => entry.name);
    const ordenado = [...nomes].sort((a, b) => a.localeCompare(b, "pt-BR"));
    expect(nomes).toEqual(ordenado);
  });
});

describe("sharedNotes", () => {
  it("só devolve notas usadas por mais de uma linha", () => {
    const index = buildNoteIndex(lines);
    for (const entry of sharedNotes(index)) {
      const linhas = new Set(entry.usedBy.map((usage) => usage.slug));
      expect(linhas.size).toBeGreaterThan(1);
    }
  });

  /**
   * Uma nota que aparece duas vezes na MESMA fragrância (saída e coração,
   * por exemplo) não é uma nota compartilhada. Contar usos em vez de linhas
   * distintas faria o guia anunciar uma ponte entre fragrâncias que não
   * existe.
   */
  it("não confunde dois usos na mesma linha com duas linhas", () => {
    const entry = {
      name: "Bergamota",
      slug: "bergamota",
      usedBy: [
        { slug: "alba-citrica", name: "Alba Cítrica", stage: "top" as const },
        { slug: "alba-citrica", name: "Alba Cítrica", stage: "heart" as const },
      ],
    };

    expect(sharedNotes([entry])).toHaveLength(0);
  });
});

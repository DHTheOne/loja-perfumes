import type { FragranceLine, NotePyramid } from "@/catalog/types";

/**
 * Índice de notas olfativas do catálogo.
 *
 * Deriva das linhas em vez de manter uma lista própria: uma nota só existe
 * porque alguma fragrância a usa. Lista paralela sairia de sincronia na
 * primeira vez que uma pirâmide mudasse, e o guia passaria a prometer notas
 * que o catálogo não tem — ou a esconder as que tem.
 *
 * Como `src/catalog/filter.ts`, este módulo não importa nada de `@/ui`
 * (ARCHITECTURE.md §2).
 */

/** Estágio da pirâmide em que a nota aparece numa fragrância. */
export type NoteStage = keyof NotePyramid;

export const noteStages: readonly NoteStage[] = ["top", "heart", "base"];

export const noteStageLabel: Record<NoteStage, string> = {
  top: "Saída",
  heart: "Coração",
  base: "Fundo",
};

export type NoteUsage = {
  /** Linha que usa a nota. */
  slug: string;
  name: string;
  stage: NoteStage;
};

export type NoteEntry = {
  /** Nome da nota como escrito no catálogo. Ex.: "Bergamota". */
  name: string;
  /** Identificador de URL, derivado do nome. */
  slug: string;
  /** Onde a nota aparece, por linha. Ordenado como o catálogo. */
  usedBy: readonly NoteUsage[];
};

/**
 * `Íris` → `iris`, `Ambar-cinza` → `ambar-cinza`.
 *
 * A decomposição NFD separa a letra do acento e o intervalo remove o acento,
 * então `á` vira `a` sem precisar de tabela de substituição.
 */
export function noteSlug(name: string): string {
  return name
    .normalize("NFD")
    // Intervalo escrito por code point: os diacríticos combinantes são
    // invisíveis em editor e sobrevivem mal a recodificação de arquivo.
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Constrói o índice de notas a partir das linhas.
 *
 * Uma mesma nota pode aparecer em estágios diferentes conforme a fragrância —
 * bergamota na saída de uma e no coração de outra — e as duas ocorrências são
 * registradas. Agrupar por nota e perder o estágio esconderia justamente o
 * que diferencia as composições.
 */
export function buildNoteIndex(
  catalog: readonly FragranceLine[],
): readonly NoteEntry[] {
  const index = new Map<string, { name: string; usedBy: NoteUsage[] }>();

  for (const fragrance of catalog) {
    for (const stage of noteStages) {
      for (const note of fragrance.notes[stage]) {
        const slug = noteSlug(note);
        const entry = index.get(slug) ?? { name: note, usedBy: [] };
        entry.usedBy.push({
          slug: fragrance.slug,
          name: fragrance.name,
          stage,
        });
        index.set(slug, entry);
      }
    }
  }

  return [...index.entries()]
    .map(([slug, entry]) => ({
      name: entry.name,
      slug,
      usedBy: entry.usedBy,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

/** Notas presentes em mais de uma linha — o que costura o catálogo. */
export function sharedNotes(
  entries: readonly NoteEntry[],
): readonly NoteEntry[] {
  return entries.filter((entry) => {
    const lines = new Set(entry.usedBy.map((usage) => usage.slug));
    return lines.size > 1;
  });
}

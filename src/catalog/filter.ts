import type {
  FragranceLine,
  Occasion,
  OlfactoryFamily,
} from "@/catalog/types";

/**
 * Filtro do catálogo — funções puras, sem dependência de URL ou React,
 * para serem testáveis isoladamente e reaproveitadas quando o catálogo
 * migrar para o banco (Fase 5).
 */

export type FamilyOption = {
  /** Valor usado na URL (?familia=). Sempre ASCII. */
  param: string;
  family: OlfactoryFamily;
  label: string;
};

export type OccasionOption = {
  /** Valor usado na URL (?ocasiao=). Sempre ASCII. */
  param: string;
  occasion: Occasion;
  label: string;
};

export const familyOptions: readonly FamilyOption[] = [
  { param: "amadeirada", family: "amadeirada", label: "Amadeirada" },
  { param: "citrica", family: "citrica", label: "Cítrica" },
  { param: "floral", family: "floral", label: "Floral" },
  { param: "oriental", family: "oriental", label: "Oriental" },
  { param: "aquatica", family: "aquatica", label: "Aquática" },
  { param: "aromatica", family: "aromatica", label: "Aromática" },
] as const;

export const occasionOptions: readonly OccasionOption[] = [
  { param: "dia", occasion: "dia", label: "Dia" },
  { param: "noite", occasion: "noite", label: "Noite" },
  { param: "versatil", occasion: "versátil", label: "Versátil" },
] as const;

/**
 * Params de URL são entrada não confiável: aceita apenas valores da lista
 * conhecida e ignora o resto (fail-closed). Arrays (param repetido) usam
 * o primeiro valor.
 */
export function parseFamilyParam(
  value: string | string[] | undefined,
): FamilyOption | undefined {
  const single = Array.isArray(value) ? value[0] : value;
  return familyOptions.find((option) => option.param === single);
}

export function parseOccasionParam(
  value: string | string[] | undefined,
): OccasionOption | undefined {
  const single = Array.isArray(value) ? value[0] : value;
  return occasionOptions.find((option) => option.param === single);
}

export type CatalogFilter = {
  family?: OlfactoryFamily;
  occasion?: Occasion;
};

export function filterLines(
  all: readonly FragranceLine[],
  filter: CatalogFilter,
): readonly FragranceLine[] {
  return all.filter(
    (fragrance) =>
      (!filter.family || fragrance.family === filter.family) &&
      (!filter.occasion || fragrance.occasion === filter.occasion),
  );
}

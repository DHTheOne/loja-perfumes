import type { LineKey } from "@/ui/tokens";

/**
 * Modelo do catálogo — versão estática da Fase 2.
 *
 * Espelha os atributos de perfumaria exigidos pelo PROJECT_BRIEF §3 e a
 * estrutura prevista em DATABASE_SCHEMA.md. Quando o Prisma entrar (Fase 5),
 * estes tipos viram o contrato entre o banco e a UI — a UI não muda.
 */

export type OlfactoryFamily =
  | "amadeirada"
  | "citrica"
  | "floral"
  | "oriental"
  | "aquatica"
  | "aromatica";

export type Concentration = "Parfum" | "Eau de Parfum" | "Eau de Toilette";

export type Occasion = "dia" | "noite" | "versátil";

export type Season = "primavera" | "verão" | "outono" | "inverno";

/** Preço em centavos — nunca em float. Ver DATABASE_SCHEMA.md. */
export type Volume = {
  ml: number;
  priceCents: number;
};

export type NotePyramid = {
  /** Notas de saída — os primeiros minutos. */
  top: readonly string[];
  /** Notas de coração — o corpo da fragrância. */
  heart: readonly string[];
  /** Notas de fundo — o rastro que permanece. */
  base: readonly string[];
};

export type FragranceLine = {
  /** Identificador de URL. Estável — muda de nome, não de slug. */
  slug: string;
  name: string;
  family: OlfactoryFamily;
  /** Rótulo da família para exibição, com acentuação correta. */
  familyLabel: string;
  /** Chave da cor de vidro em src/ui/tokens.ts (`line`). */
  lineKey: LineKey;
  /** Uma linha editorial — aparece em cards e no topo da página de produto. */
  tagline: string;
  /** Parágrafo de apresentação. */
  description: string;
  /** Descrição material do vidro/luz — dirige a direção visual do card. */
  accord: string;
  notes: NotePyramid;
  concentration: Concentration;
  volumes: readonly Volume[];
  /** 1 (pele) a 5 (rastro de sala). */
  intensity: 1 | 2 | 3 | 4 | 5;
  /** Duração média na pele, em horas. */
  longevityHours: number;
  occasion: Occasion;
  seasons: readonly Season[];
};

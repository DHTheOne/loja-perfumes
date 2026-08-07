import { line, type LineKey } from "@/ui/tokens";

/**
 * Ponte entre o catálogo e a camada visual.
 *
 * ARCHITECTURE.md §2 ("Regra de dependência") determina que o domínio nunca
 * importe UI. O modelo de catálogo, portanto, não carrega token de cor: ele
 * expõe apenas `slug`, que `src/catalog/types.ts` define como identificador
 * estável ("muda de nome, não de slug"). O mapeamento slug → cor de vidro
 * vive aqui, na UI, e é o único ponto que precisa mudar quando o catálogo
 * migrar para o Prisma (Fase 5) — o banco guardará o slug, não o token.
 *
 * A família olfativa não serve como chave: "oriental" cobre duas linhas
 * (Âmbar Secreto e Noturno Absoluto) com vidros diferentes.
 */
const SLUG_TO_LINE_KEY = {
  "lenho-vigil": "lenhoVigil",
  "alba-citrica": "albaCitrica",
  "flora-velada": "floraVelada",
  "ambar-secreto": "ambarSecreto",
  "mare-clara": "mareClara",
  "noturno-absoluto": "noturnoAbsoluto",
  "comum-raro": "comumRaro",
} as const satisfies Record<string, LineKey>;

/** Vidro da assinatura da casa — usado quando o slug não tem mapa próprio. */
export const DEFAULT_LINE_KEY: LineKey = "comumRaro";

/** `true` quando o slug tem mapeamento explícito (não caiu no padrão). */
export function hasLineKey(slug: string): boolean {
  return Object.hasOwn(SLUG_TO_LINE_KEY, slug);
}

export function lineKeyForSlug(slug: string): LineKey {
  return (
    SLUG_TO_LINE_KEY[slug as keyof typeof SLUG_TO_LINE_KEY] ?? DEFAULT_LINE_KEY
  );
}

/** Cor de vidro (hex) da linha — atalho para os gradientes dos cards. */
export function glassColorForSlug(slug: string): string {
  return line[lineKeyForSlug(slug)];
}

/**
 * Conversão dos tokens hex (formato exigido pelo Three.js) para rgba com
 * alfa, usada pelos gradientes de "luz através do vidro" nos cards.
 */
const HEX_PATTERN = /^([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Falha alto em vez de devolver `rgba(NaN, NaN, NaN, α)`.
 *
 * Sem validação, um hex de 3 dígitos produzia NaN silenciosamente: o
 * `parseInt` de `slice(4, 6)` sobre "fff" recebe string vazia. O navegador
 * descarta a declaração inválida e o gradiente some sem erro nenhum — o tipo
 * de defeito que só aparece em revisão visual. Como todos os valores vêm de
 * `src/ui/tokens.ts` (constantes de build, cobertas por teste), este `throw`
 * é inalcançável em produção e serve para quebrar cedo se um token novo
 * entrar malformado.
 */
export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.trim().replace("#", "");

  if (!HEX_PATTERN.test(normalized)) {
    throw new Error(`hexToRgba: hex inválido ${JSON.stringify(hex)}`);
  }

  // Expande a forma curta: "abc" -> "aabbcc".
  const full =
    normalized.length === 3
      ? normalized.replace(/./g, (digit) => digit + digit)
      : normalized;

  const red = parseInt(full.slice(0, 2), 16);
  const green = parseInt(full.slice(2, 4), 16);
  const blue = parseInt(full.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

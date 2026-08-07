/**
 * Origem pública do site, usada por `metadataBase`, `robots.ts` e `sitemap.ts`.
 *
 * Lê `APP_URL` (já declarada em .env.example). A variável não tem prefixo
 * `NEXT_PUBLIC_`, então só existe no servidor — que é onde os três
 * consumidores rodam. Importar este módulo de um Client Component faria o
 * valor virar `undefined` no bundle e cair silenciosamente no fallback de
 * desenvolvimento; não faça isso.
 */

/** Usado em desenvolvimento e quando APP_URL não está definida. */
export const FALLBACK_ORIGIN = "http://localhost:3000";

/**
 * Normaliza a origem: remove barras finais para que a concatenação de rotas
 * não gere `//sobre`, e recusa valor vazio ou sem esquema.
 */
export function normalizeOrigin(raw: string | undefined): string {
  const trimmed = raw?.trim();
  if (!trimmed) return FALLBACK_ORIGIN;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return FALLBACK_ORIGIN;
    }
    return trimmed.replace(/\/+$/, "");
  } catch {
    return FALLBACK_ORIGIN;
  }
}

export function siteOrigin(): string {
  return normalizeOrigin(process.env.APP_URL);
}

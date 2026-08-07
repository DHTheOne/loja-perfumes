import type { MetadataRoute } from "next";

import { siteOrigin } from "@/config/origin";

/**
 * As minutas legais ficam fora do índice.
 *
 * Elas afirmam prazos e direitos que ainda não passaram por revisão jurídica
 * e contêm placeholders (CNPJ, e-mail, comarca). Indexadas, seriam a primeira
 * coisa que um consumidor — ou um Procon — encontraria buscando a política da
 * loja. O `noindex` de cada página é o controle que vale; esta entrada evita
 * o rastreamento em primeiro lugar. Liberar depende da revisão jurídica.
 */
export const MINUTAS_LEGAIS = ["/privacidade", "/termos", "/trocas"] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...MINUTAS_LEGAIS],
    },
    sitemap: `${siteOrigin()}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

import { lines } from "@/catalog/lines";
import { siteOrigin } from "@/config/origin";

/**
 * Só rotas públicas e estáveis.
 *
 * As minutas legais ficam de fora enquanto não houver revisão jurídica —
 * anunciá-las no sitemap contradiria o `noindex` delas e o `disallow` do
 * robots.ts. As páginas de produto saem do próprio catálogo, então uma linha
 * nova entra aqui sozinha.
 *
 * Sem `lastModified`: o valor honesto seria a data de publicação de cada
 * página, que ainda não existe. `new Date()` no build daria a todo mundo a
 * data do deploy, o que é ruído para o rastreador em vez de informação.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();

  const paginasFixas = ["", "/colecoes", "/notas", "/sobre"].map((rota) => ({
    url: `${origin}${rota}`,
    changeFrequency: "monthly" as const,
    priority: rota === "" ? 1 : 0.8,
  }));

  const paginasDeProduto = lines.map((fragrance) => ({
    url: `${origin}/perfumes/${fragrance.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...paginasFixas, ...paginasDeProduto];
}

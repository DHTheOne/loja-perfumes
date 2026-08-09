import type { Metadata } from "next";

/**
 * Identidade provisória da loja.
 *
 * `[NOME_DA_LOJA]` segue pendente de decisão do proprietário
 * (PROJECT_BRIEF §7). "Sillage" é um wordmark PROVISÓRIO — termo de
 * perfumaria para o rastro que um perfume deixa, coerente com a manchete
 * do hero ("O que fica depois da presença"). Trocar o nome definitivo é
 * trocar as constantes abaixo; nada mais no código repete estes valores.
 */
export const site = {
  name: "Sillage",
  isProvisionalName: true,
  tagline: "Perfumaria autoral em série limitada",
  /**
   * Descrição padrão do site: vai na meta `description` e no cartão social da
   * home. Mora aqui para existir uma única vez — `layout.tsx` e `page.tsx`
   * precisam do mesmo texto, e duas cópias divergiriam na primeira edição.
   */
  description:
    "Fragrâncias originais em edição limitada. Catálogo de demonstração; todas as fragrâncias são fictícias.",
  /** Aviso exigido pela seção 26 do prompt mestre. */
  demoNotice:
    "Catálogo de demonstração. Todas as fragrâncias, nomes e frascos são fictícios e originais.",
} as const;

/**
 * Imagem dos cartões de compartilhamento (WhatsApp, Instagram, X, LinkedIn,
 * Facebook). Sem ela o link do site é publicado como texto cru.
 *
 * Reaproveita o hero em vez de um arquivo dedicado: já está no `public/`, já é
 * a primeira imagem que o visitante vê, e 1920×1081 (~1.78:1) cai perto do
 * 1.91:1 que as plataformas recortam — o frasco não é cortado. Quando a mídia
 * por linha entrar no site, a página de produto pode anunciar a imagem da
 * própria fragrância.
 */
export const socialImage = {
  url: "/media/hero/hero-desktop.jpg",
  width: 1920,
  height: 1081,
  alt: "Frasco de perfume em vidro transparente com tampa metálica champanhe, iluminado sobre fundo escuro",
} as const;

type OpenGraphInput = {
  /** Caminho da rota, resolvido contra `metadataBase`. Ex.: "/colecoes". */
  url: string;
  title: string;
  description: string;
};

/**
 * Monta o bloco Open Graph de uma página.
 *
 * Existe por causa de uma armadilha do App Router: `openGraph` **substitui**
 * o valor do layout, não mescla com ele. Uma página que declarasse apenas
 * `openGraph: { url }` perderia silenciosamente imagem, `type`, `locale` e
 * `siteName` — as tags somem do HTML sem erro de build e sem teste vermelho.
 * Toda rota que precisa de Open Graph passa por aqui.
 */
export function openGraphFor({
  url,
  title,
  description,
}: OpenGraphInput): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    // Cópia rasa: `socialImage` é `as const`, e o tipo do Next exige um array
    // mutável de imagens.
    images: [{ ...socialImage }],
    url,
    title,
    description,
  };
}

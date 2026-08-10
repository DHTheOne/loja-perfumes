import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import { siteOrigin } from "@/config/origin";
import { BagProvider } from "@/bag/BagProvider";
import { site, socialImage } from "@/config/site";
import { SiteHeader } from "@/ui/SiteHeader";
import { SiteFooter } from "@/ui/SiteFooter";

// Duas famílias, com papéis distintos: serifada editorial para display,
// sem-serifa neutra para leitura. Ver web/design-quality.
const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Base para URLs absolutas de canonical, robots e Open Graph. Sem ela, o
  // Next resolve rotas relativas contra localhost e avisa no build.
  metadataBase: new URL(siteOrigin()),
  // Wordmark provisório — [NOME_DA_LOJA] pendente do proprietário (src/config/site.ts).
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  // Cartão de compartilhamento. Cada página herda estes valores e sobrescreve
  // título, descrição e `url` — o Next resolve as rotas relativas contra a
  // `metadataBase` acima. Sem este bloco, colar o link em qualquer rede social
  // produz um retângulo vazio.
  //
  // NÃO se aplica `alternates.canonical` aqui: no App Router os filhos herdam
  // o valor, e uma canonical "/" herdada por /colecoes e pelas 7 páginas de
  // produto as apagaria dos resultados de busca. A canonical é declarada por
  // página.
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [socialImage.url],
  },
};

/**
 * Pinta a barra do navegador móvel com o fundo do site. Sem isso o Chrome no
 * Android abre a página escura sob uma barra clara — a emenda aparece já no
 * primeiro frame. `colorScheme` avisa o navegador que não há tema claro, o
 * que também acerta a cor de formulários e barras de rolagem nativas.
 */
export const viewport: Viewport = {
  themeColor: "#0a0908",
  colorScheme: "dark",
};

type RootLayoutProps = Readonly<{ children: ReactNode }>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void text-ink">
        {/* O provedor envolve header e conteúdo porque os dois leem a sacola:
            o contador no header e a conferência em /sacola. É o único estado
            de cliente global do site. */}
        <BagProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </BagProvider>
      </body>
    </html>
  );
}

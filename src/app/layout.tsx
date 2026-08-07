import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import { siteOrigin } from "@/config/origin";
import { site } from "@/config/site";
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
  description:
    "Fragrâncias originais em edição limitada. Catálogo de demonstração; todas as fragrâncias são fictícias.",
};

type RootLayoutProps = Readonly<{ children: ReactNode }>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void text-ink">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

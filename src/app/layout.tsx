import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

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
  // [NOME_DA_LOJA] segue pendente de decisão do proprietário.
  title: "[NOME_DA_LOJA] — Perfumaria",
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
      <body className="min-h-full bg-void text-ink">{children}</body>
    </html>
  );
}

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "@/app/not-found";
import PrivacidadePage from "@/app/privacidade/page";
import SobrePage from "@/app/sobre/page";
import TermosPage from "@/app/termos/page";
import TrocasPage from "@/app/trocas/page";

/**
 * Smoke tests das páginas estáticas: garantem h1 correto e, nas minutas
 * legais, a presença do banner de revisão jurídica (risco R5) — remover
 * o banner quebra o teste de propósito.
 */
describe("páginas estáticas", () => {
  it("/sobre apresenta a casa e o processo", () => {
    render(<SobrePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Uma casa, sete temperamentos" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Maceração")).toBeInTheDocument();
  });

  it("404 oferece caminho de volta", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Isso evaporou" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver as coleções" })).toHaveAttribute(
      "href",
      "/colecoes",
    );
  });

  const legalPages = [
    { name: "/privacidade", Page: PrivacidadePage, heading: "Política de privacidade" },
    { name: "/termos", Page: TermosPage, heading: "Termos de compra" },
    { name: "/trocas", Page: TrocasPage, heading: "Trocas e devoluções" },
  ] as const;

  for (const { name, Page, heading } of legalPages) {
    it(`${name} exibe o título e o banner de minuta`, () => {
      render(<Page />);
      expect(
        screen.getByRole("heading", { level: 1, name: heading }),
      ).toBeInTheDocument();
      expect(screen.getByRole("note")).toHaveTextContent(
        /não tem validade legal/,
      );
    });
  }
});

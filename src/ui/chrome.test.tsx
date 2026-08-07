import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "@/ui/SiteFooter";
import { SiteHeader } from "@/ui/SiteHeader";

describe("SiteHeader", () => {
  it("tem navegação principal e atalho para o conteúdo", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Coleções" })).toHaveAttribute(
      "href",
      "/colecoes",
    );
    expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute(
      "href",
      "/sobre",
    );
    expect(
      screen.getByRole("link", { name: "Pular para o conteúdo" }),
    ).toHaveAttribute("href", "#conteudo");
    expect(
      screen.getByRole("link", { name: /página inicial/ }),
    ).toHaveAttribute("href", "/");
  });
});

describe("SiteFooter", () => {
  it("liga as minutas legais e mantém o aviso de demonstração", () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("link", { name: "Política de privacidade" }),
    ).toHaveAttribute("href", "/privacidade");
    expect(
      screen.getByRole("link", { name: "Termos de compra" }),
    ).toHaveAttribute("href", "/termos");
    expect(
      screen.getByRole("link", { name: "Trocas e devoluções" }),
    ).toHaveAttribute("href", "/trocas");
    expect(screen.getByText(/fictícios e originais/)).toBeInTheDocument();
  });
});

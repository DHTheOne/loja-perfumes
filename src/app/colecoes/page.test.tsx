import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ColecoesPage from "@/app/colecoes/page";

function pageProps(params: Record<string, string | string[]> = {}) {
  return { searchParams: Promise.resolve(params) };
}

describe("página de coleções", () => {
  it("sem filtros mostra as 7 linhas", async () => {
    render(await ColecoesPage(pageProps()));

    expect(screen.getByText("7 linhas")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(7);
  });

  it("filtra por família via URL", async () => {
    render(await ColecoesPage(pageProps({ familia: "floral" })));

    expect(screen.getByText("1 de 7 linhas")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Flora Velada" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Lenho Vigil")).not.toBeInTheDocument();
  });

  it("ignora valores desconhecidos de filtro e exibe o catalogo completo", async () => {
    render(
      await ColecoesPage(pageProps({ familia: "<script>alert(1)</script>" })),
    );

    expect(screen.getByText("7 linhas")).toBeInTheDocument();
  });

  it("marca o chip ativo com aria-current", async () => {
    render(await ColecoesPage(pageProps({ familia: "floral" })));

    expect(screen.getByRole("link", { name: "Floral" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("mostra estado vazio com caminho de saída", async () => {
    render(await ColecoesPage(pageProps({ familia: "floral", ocasiao: "noite" })));

    expect(
      screen.getByText("Nenhuma linha combina esses filtros"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Limpar filtros" }),
    ).toHaveAttribute("href", "/colecoes");
  });
});

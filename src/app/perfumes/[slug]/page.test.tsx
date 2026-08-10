import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PerfumePage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/perfumes/[slug]/page";
import { lines } from "@/catalog/lines";
import { renderWithProviders } from "@/test-utils";

function pageProps(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

describe("página de produto", () => {
  it("gera params estáticos para todas as linhas", () => {
    expect(generateStaticParams()).toHaveLength(lines.length);
  });

  it("renderiza pirâmide, perfil, preços e CTA honesto", async () => {
    // Com provedores: a seção de volumes virou o controle de sacola.
    renderWithProviders(await PerfumePage(pageProps("lenho-vigil")));

    expect(
      screen.getByRole("heading", { level: 1, name: "Lenho Vigil" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Vetiver")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s529,00/)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Intensidade 4 de 5" }),
    ).toBeInTheDocument();
    // O CTA deixou de ser um botão morto e virou entrada na sacola. O que o
    // caso protege continua sendo o mesmo: a página não pode prometer compra
    // enquanto as vendas não abriram, então o aviso acompanha a ação.
    expect(
      screen.getByRole("button", { name: /Reservar 50 ml/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/vendas ainda não abriram/i)).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /50 ml/ }),
    ).toBeInTheDocument();
  });

  it("gera metadata com o nome do perfume", async () => {
    const metadata = await generateMetadata(pageProps("alba-citrica"));
    expect(metadata.title).toBe("Alba Cítrica");
  });

  it("dispara notFound para slug desconhecido", async () => {
    await expect(PerfumePage(pageProps("nao-existe"))).rejects.toThrow();
  });
});

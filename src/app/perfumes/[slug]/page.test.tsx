import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PerfumePage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/perfumes/[slug]/page";
import { lines } from "@/catalog/lines";

function pageProps(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

describe("página de produto", () => {
  it("gera params estáticos para todas as linhas", () => {
    expect(generateStaticParams()).toHaveLength(lines.length);
  });

  it("renderiza pirâmide, perfil, preços e CTA honesto", async () => {
    render(await PerfumePage(pageProps("lenho-vigil")));

    expect(
      screen.getByRole("heading", { level: 1, name: "Lenho Vigil" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Vetiver")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s529,00/)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Intensidade 4 de 5" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Vendas abrem em breve" }),
    ).toBeDisabled();
  });

  it("gera metadata com o nome do perfume", async () => {
    const metadata = await generateMetadata(pageProps("alba-citrica"));
    expect(metadata.title).toBe("Alba Cítrica");
  });

  it("dispara notFound para slug desconhecido", async () => {
    await expect(PerfumePage(pageProps("nao-existe"))).rejects.toThrow();
  });
});

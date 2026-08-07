import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getLineBySlug } from "@/catalog/lines";
import { LineCard } from "@/ui/LineCard";

const fragrance = getLineBySlug("lenho-vigil");
if (!fragrance) throw new Error("seed ausente: lenho-vigil");

describe("LineCard", () => {
  it("apresenta nome, família, tagline e preço de partida", () => {
    render(<LineCard fragrance={fragrance} />);

    expect(
      screen.getByRole("heading", { name: "Lenho Vigil" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Amadeirada")).toBeInTheDocument();
    expect(screen.getByText(fragrance.tagline)).toBeInTheDocument();
    expect(screen.getByText(/A partir de/)).toHaveTextContent("529,00");
  });

  it("leva à página do perfume", () => {
    render(<LineCard fragrance={fragrance} />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/perfumes/lenho-vigil",
    );
  });

  it("usa h2 quando o card está direto sob um h1", () => {
    render(<LineCard fragrance={fragrance} headingLevel="h2" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Lenho Vigil" }),
    ).toBeInTheDocument();
  });
});

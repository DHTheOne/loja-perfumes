import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

/**
 * `matchMedia` não existe no jsdom — é uma lacuna conhecida do ambiente, não
 * do código. Sem o polyfill, todo componente que consulta uma media query
 * derruba o teste com "window.matchMedia is not a function".
 *
 * O padrão devolve `matches: false`, ou seja: sem preferência por movimento
 * reduzido. É a resposta certa para o caso geral — quem precisar testar o
 * caminho de `reduce` sobrescreve a implementação no próprio teste.
 */
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  cleanup();
});

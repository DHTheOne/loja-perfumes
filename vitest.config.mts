import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**"],
      // A cena WebGL não executa em jsdom — cobertura dela virá de E2E
      // (Playwright) na fase de testes de navegador. Registrado no
      // PROJECT_STATUS.
      exclude: ["src/3d/**", "src/**/*.test.*"],
    },
  },
});

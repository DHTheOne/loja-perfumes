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
      // Gate automático: hoje a cobertura está bem acima disto, mas sem o
      // threshold uma regressão passaria silenciosa no CI. O piso é 80%
      // (rules/common/testing.md), não a cobertura atual — travar no valor
      // de hoje transformaria qualquer refatoração legítima em falha.
      //
      // Atenção ao denominador: `src/3d/**` está excluído acima, então estes
      // percentuais NÃO dizem nada sobre HeroScene/HeroVisual/HeroFallback.
      // A garantia daquela camada vem do E2E em e2e/, não daqui.
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});

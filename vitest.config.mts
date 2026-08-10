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
    // 15s no lugar dos 5s padrão.
    //
    // Não é teste lento, é contenção: os arquivos rodam em paralelo e cada um
    // levanta o próprio jsdom. Ao entrar o 13º arquivo (notes.test.ts), o
    // teste que renderiza as 7 páginas de coleção passou a estourar 5s na
    // suíte completa e a passar sozinho — comportamento que depende da
    // máquina, não do código.
    //
    // O timeout existe para pegar teste travado, não para medir desempenho de
    // CPU. Um limite que muda de veredito conforme a carga da máquina produz
    // falha vermelha sem defeito, que é o pior tipo de sinal num gate de CI.
    testTimeout: 15_000,
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

import { defineConfig, devices } from "@playwright/test";

/**
 * E2E do hero (relatório, melhoria #3).
 *
 * Roda contra o BUILD DE PRODUÇÃO, não o dev server: o carregamento sob
 * demanda da cena 3D depende do chunking real do Turbopack, que o dev server
 * não reproduz. Um teste passando em dev não diria nada sobre produção.
 *
 * `src/3d/**` está excluído da cobertura do vitest porque WebGL não roda em
 * jsdom. Estes testes são a contrapartida: é aqui que HeroVisual, HeroScene e
 * HeroFallback ganham verificação.
 */
export default defineConfig({
  testDir: "./e2e",
  // Sem paralelismo entre arquivos: um único servidor de produção atende
  // todos, e as asserções de rede ficam mais previsíveis em série.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "npx next start --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

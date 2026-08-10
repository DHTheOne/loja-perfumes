import { expect, test, type Page } from "@playwright/test";

/**
 * Contrato do hero: ARCHITECTURE.md §9 exige que a loja funcione
 * integralmente com imagem estática "sem WebGL, com prefers-reduced-motion,
 * ou em dispositivo fraco".
 *
 * A asserção forte não é "existe um canvas?", e sim "o chunk do three.js
 * chegou a ser pedido?". Ausência de canvas poderia significar apenas que a
 * cena ainda não montou; ausência de download prova que a decisão foi tomada
 * antes de gastar a banda — que é o requisito de performance.
 */

/** O chunk do three.js passa de 900 KB; os de aplicação ficam na casa das dezenas. */
const LIMIAR_CHUNK_PESADO = 300_000;

/**
 * A cena 3D deixou a home quando o hero cinematográfico entrou; hoje ela vive
 * na página de produto (`ProductVisual`). O contrato de ARCHITECTURE §9 não
 * mudou — mudou o endereço onde ele é exercido. Reapontar preserva a garantia;
 * apagar estes casos a perderia junto com a rota antiga.
 */
const ROTA_DA_CENA = "/perfumes/lenho-vigil";

function rastrearDownloadDaCena(page: Page): { baixou: () => boolean } {
  let baixou = false;

  page.on("response", (response) => {
    const url = response.url();
    if (!url.includes("/chunks/") || !url.endsWith(".js")) return;

    const tamanho = Number(response.headers()["content-length"] ?? 0);
    if (tamanho > LIMIAR_CHUNK_PESADO) baixou = true;
  });

  return { baixou: () => baixou };
}

/**
 * Espera determinística: `HeroVisual` agenda a cena em requestIdleCallback
 * com timeout de 2500ms. Passado esse prazo mais folga, a decisão é final —
 * não existe estado "ainda vai montar".
 */
async function aguardarDecisaoDoHero(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3200);
}

test.describe("hero — fallback obrigatório", () => {
  test("controle positivo: dispositivo capaz recebe a cena 3D", async ({
    page,
  }) => {
    await page.goto(ROTA_DA_CENA);
    await aguardarDecisaoDoHero(page);

    // Se este teste falhar, os negativos abaixo perdem o sentido: passariam
    // por o 3D nunca funcionar, não por a guarda estar correta.
    expect(await page.locator("canvas").count()).toBeGreaterThan(0);
  });

  test("prefers-reduced-motion: nenhum canvas, nenhum download da cena", async ({
    page,
  }) => {
    const cena = rastrearDownloadDaCena(page);
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto(ROTA_DA_CENA);
    await aguardarDecisaoDoHero(page);

    expect(await page.locator("canvas").count()).toBe(0);
    expect(cena.baixou()).toBe(false);
    // Sem a cena, o que fica é a fotografia da própria fragrância.
    await expect(page.locator("img").first()).toBeVisible();
  });

  test("sem WebGL: cai no fallback estático", async ({ page }) => {
    const cena = rastrearDownloadDaCena(page);
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      // `as typeof original` porque getContext é sobrecarregado: uma função
      // genérica não é atribuível ao conjunto de assinaturas. O repasse via
      // Reflect.apply preserva o comportamento para os demais contextos.
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        ...args: Parameters<typeof original>
      ) {
        if (args[0] === "webgl" || args[0] === "webgl2") return null;
        return Reflect.apply(original, this, args);
      } as typeof original;
    });

    await page.goto(ROTA_DA_CENA);
    await aguardarDecisaoDoHero(page);

    expect(await page.locator("canvas").count()).toBe(0);
    expect(cena.baixou()).toBe(false);
    // Sem a cena, o que fica é a fotografia da própria fragrância.
    await expect(page.locator("img").first()).toBeVisible();
  });

  test("dispositivo fraco: poucos núcleos impedem o download da cena", async ({
    page,
  }) => {
    const cena = rastrearDownloadDaCena(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => 2,
        configurable: true,
      });
    });

    await page.goto(ROTA_DA_CENA);
    await aguardarDecisaoDoHero(page);

    expect(await page.locator("canvas").count()).toBe(0);
    expect(cena.baixou()).toBe(false);
  });

  test("a manchete aparece mesmo sem a cena", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // O LCP não pode depender do 3D: o h1 precisa estar lá de imediato.
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "depois da presença",
    );
  });
});

test.describe("hero — mídia responsiva", () => {
  /**
   * Substitui o caso que verificava o `<picture>` do hero antigo, com recortes
   * distintos por viewport. O hero cinematográfico ainda não tem recorte
   * retrato — é uma lacuna aberta de §23, registrada no PROJECT_STATUS.
   *
   * O que já existe e passa a ser protegido aqui é a outra metade da direção
   * mobile: o peso. O celular recebe o arquivo de 720 (~1,4 MB) e não o de
   * 1080 (~5 MB). Servir o desktop ao celular seria triplicar a mídia do LCP
   * numa conexão que costuma ser pior.
   */
  test("o arquivo de vídeo servido corresponde ao viewport", async ({
    page,
  }, testInfo) => {
    await page.goto("/");

    const video = page.locator("video").first();
    await expect(video).toBeAttached();

    await expect
      .poll(
        () =>
          video.evaluate((v: HTMLVideoElement) =>
            v.currentSrc.split("/").pop(),
          ),
        { timeout: 10_000 },
      )
      .toContain(testInfo.project.name === "mobile" ? "-720" : "-1080");
  });
});

test.describe("hero — console e teclado", () => {
  test("não há erro de console no carregamento", async ({ page }) => {
    const erros: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") erros.push(msg.text());
    });
    page.on("pageerror", (err) => erros.push(err.message));

    await page.goto(ROTA_DA_CENA);
    await aguardarDecisaoDoHero(page);

    expect(erros).toEqual([]);
  });

  test("o skip link é o primeiro alvo do teclado e leva ao conteúdo", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skip).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.locator("#conteudo")).toBeVisible();
  });

  test("os links do header têm alvo de toque adequado", async ({ page }) => {
    await page.goto("/");

    // WCAG 2.2 SC 2.5.8 (AA) exige 24x24 CSS px no mínimo.
    for (const nome of ["Coleções", "Sobre"]) {
      const caixa = await page
        .getByRole("navigation", { name: "Navegação principal" })
        .getByRole("link", { name: nome })
        .boundingBox();

      expect(caixa?.height ?? 0).toBeGreaterThanOrEqual(24);
    }
  });
});

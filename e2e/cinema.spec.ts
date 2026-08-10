import { expect, test } from "@playwright/test";

/**
 * Hero cinematográfico — a rolagem percorre o vídeo.
 *
 * Estes casos existem porque o comportamento não é verificável em jsdom nem
 * por inspeção: `requestAnimationFrame` só corre em página que compõe quadros,
 * e o scrub depende de o navegador decodificar mídia real. É a mesma razão de
 * `src/3d` ficar fora da cobertura do vitest e ser coberto aqui.
 *
 * O que se protege: que o hero ABRA na composição autoral (manchete presente),
 * que a rolagem avance o vídeo, e que sob movimento reduzido nada disso seja
 * baixado nem executado.
 */

/** Custom property escrita pelo laço de rolagem. */
async function progresso(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>('[style*="--p"]');
    return Number.parseFloat(stage?.style.getPropertyValue("--p") ?? "-1");
  });
}

test.describe("hero cinematográfico", () => {
  test("abre na composição autoral, com a manchete visível", async ({
    page,
  }) => {
    await page.goto("/");

    const titulo = page.getByRole("heading", { level: 1 });
    await expect(titulo).toBeVisible();

    // O defeito que este caso trava: aplicar o estado FINAL da animação na
    // abertura deixaria a manchete em opacidade 0 já no primeiro quadro.
    const opacidade = await titulo
      .locator("xpath=..")
      .evaluate((el) => Number.parseFloat(getComputedStyle(el).opacity));
    expect(opacidade).toBeGreaterThan(0.9);

    expect(await progresso(page)).toBeLessThan(0.05);
  });

  test("a rolagem avança o tempo do vídeo", async ({ page }) => {
    await page.goto("/");

    const video = page.locator("video").first();
    await expect(video).toBeAttached();

    // Espera a decodificação: sem dado suficiente `duration` é NaN e o scrub
    // não teria em que se apoiar.
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState), {
        timeout: 15_000,
      })
      .toBeGreaterThanOrEqual(2);

    const tempoInicial = await video.evaluate(
      (v: HTMLVideoElement) => v.currentTime,
    );

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.8));

    /**
     * O que se prova aqui é direcional: a rolagem AVANÇA o vídeo. O limiar é
     * deliberadamente baixo.
     *
     * A primeira versão exigia +0,5 s e ficava vermelha no mobile quando a
     * suíte inteira rodava junto, passando isolada — o alvo dependia de
     * quantos quadros a interpolação tinha conseguido rodar sob concorrência
     * de CPU. Isso mede a máquina, não o recurso. Um limiar que só é
     * alcançável em máquina ociosa produz vermelho sem defeito.
     */
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime), {
        timeout: 20_000,
      })
      .toBeGreaterThan(tempoInicial + 0.2);

    // Também por poll, e não leitura instantânea: a suavização caminha 12% do
    // resto por quadro, então o progresso chega depois do primeiro avanço do
    // vídeo. Ler agora devolveria um valor ainda a caminho do alvo — foi
    // exatamente assim que este caso ficou vermelho com 0,0982.
    await expect.poll(() => progresso(page), { timeout: 10_000 }).toBeGreaterThan(0.4);
  });

  test("o vídeo não toca sozinho e está sem som", async ({ page }) => {
    await page.goto("/");
    const video = page.locator("video").first();

    // §26: mídia estrutural nunca reproduz áudio. E o clipe é percorrido, não
    // tocado — se estivesse tocando, a posição avançaria sem rolagem.
    expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
    await page.waitForTimeout(1200);
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });

  test("movimento reduzido: sem vídeo e sem trilho de rolagem", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    const pedidosDeVideo: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/media/cinema/") && req.url().endsWith(".mp4")) {
        pedidosDeVideo.push(req.url());
      }
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await expect(page.locator("video")).toHaveCount(0);
    expect(pedidosDeVideo).toEqual([]);

    // O trilho encolhe para uma tela: sem laço de rolagem, 320svh seriam três
    // telas de nada até o próximo conteúdo.
    const alturaTrilho = await page.evaluate(() => {
      const stage = document.querySelector<HTMLElement>('[style*="--p"]');
      return stage?.parentElement?.getBoundingClientRect().height ?? 0;
    });
    const alturaJanela = await page.evaluate(() => window.innerHeight);
    expect(alturaTrilho).toBeLessThan(alturaJanela * 1.5);
  });

  test("o poster sai do servidor e é o primeiro quadro visível", async ({
    page,
  }) => {
    await page.goto("/");
    const poster = page.locator('img[src*="poster"]').first();
    await expect(poster).toBeVisible();
  });
});

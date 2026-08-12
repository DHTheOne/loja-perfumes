import { expect, test } from "@playwright/test";

/**
 * Capítulos cinematográficos 02 a 06.
 *
 * O que estes casos protegem é, antes de tudo, PESO. A home passou a ter seis
 * clipes e cada um pesa de 3 a 6 MB. Montar os seis `<video>` na abertura
 * seriam ~30 MB para ver a primeira tela, e essa regressão é invisível em
 * revisão de código: o componente fica idêntico, só o `<source>` aparece cedo
 * demais. Só um teste que CONTA vídeos montados pega isso.
 *
 * Como `e2e/cinema.spec.ts`, estes casos existem porque o comportamento não é
 * verificável em jsdom: dependem de IntersectionObserver com layout real,
 * `requestAnimationFrame` e decodificação de mídia.
 */

/** Altura de uma unidade `svh`, para navegar por trilho em vez de por pixel. */
async function svh(page: import("@playwright/test").Page) {
  return page.evaluate(() => window.innerHeight / 100);
}

const CAPITULOS = [
  { slug: "galeria", titulo: "Uma nota não é um cheiro. É uma decisão." },
  { slug: "salao-luz", titulo: "O rastro chega antes de você" },
  { slug: "pedra-vapor", titulo: "Vidro maciço, metal escovado" },
  { slug: "travertino", titulo: "Revisados até merecerem o vidro" },
  { slug: "pedestal-ambar", titulo: "Comece pelo que fica" },
];

test.describe("capítulos cinematográficos", () => {
  test("na abertura só o vídeo do hero está montado", async ({ page }) => {
    const clipesBaixados = new Set<string>();
    page.on("request", (req) => {
      const url = req.url();
      if (url.includes("/media/cinema/") && url.endsWith(".mp4")) {
        clipesBaixados.add(url.split("/").pop() ?? url);
      }
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // O defeito que este caso trava: seis capítulos montando de uma vez.
    await expect(page.locator("video")).toHaveCount(1);

    // E nenhum clipe que não seja o do hero pode ter sido pedido à rede.
    const forasteiros = [...clipesBaixados].filter(
      (arquivo) => !arquivo.startsWith("concreto"),
    );
    expect(forasteiros).toEqual([]);
  });

  test("as cinco manchetes de capítulo saem do servidor", async ({ page }) => {
    // O HTML é servido pronto: os capítulos são conteúdo indexável, não
    // decoração que aparece só depois do JavaScript. Por isso a verificação é
    // por papel de cabeçalho, e não por presença de vídeo.
    await page.goto("/");

    for (const capitulo of CAPITULOS) {
      await expect(
        page.getByRole("heading", { level: 2, name: capitulo.titulo }),
      ).toBeAttached();
    }
  });

  test("o capítulo 02 arma ao aproximar e a rolagem avança o próprio vídeo", async ({
    page,
  }) => {
    await page.goto("/");
    const unidade = await svh(page);

    // 320svh é o fim do trilho do hero; o capítulo 02 ocupa os 260svh
    // seguintes. Parar no miolo dele.
    await page.evaluate(
      (topo) => window.scrollTo(0, topo),
      Math.round(376 * unidade),
    );

    const videoDoCapitulo = page.locator("video").nth(1);
    await expect(videoDoCapitulo).toBeAttached({ timeout: 15_000 });

    await expect
      .poll(
        () => videoDoCapitulo.evaluate((v: HTMLVideoElement) => v.readyState),
        { timeout: 20_000 },
      )
      .toBeGreaterThanOrEqual(2);

    // Por poll, e não leitura instantânea: a suavização caminha 12% do resto
    // por quadro, então o valor chega depois do primeiro avanço. Ler agora
    // devolveria um número ainda a caminho do alvo.
    await expect
      .poll(() => videoDoCapitulo.evaluate((v: HTMLVideoElement) => v.currentTime), {
        timeout: 20_000,
      })
      .toBeGreaterThan(0.5);

    // E é o clipe do capítulo 02, não outro: o scrub tem que estar ligado ao
    // vídeo daquela seção, e não ao primeiro `<video>` da página.
    const arquivo = await videoDoCapitulo.evaluate(
      (v: HTMLVideoElement) => v.currentSrc,
    );
    expect(arquivo).toContain("galeria");
  });

  test("o match cut usa o quadro do enquadramento que estava na tela", async ({
    page,
  }) => {
    await page.goto("/");

    // O que este caso protege é a PREMISSA do match cut: dissolver do último
    // quadro do capítulo anterior só costura a emenda se for o quadro que a
    // pessoa realmente viu. Em retrato ela viu a composição 9:16, que é outro
    // enquadramento, com o frasco em outro lugar da tela — servir ali o
    // quadro 16:9 faria o produto saltar de posição, e um salto chama MAIS
    // atenção para a emenda do que um corte seco chamaria.
    //
    // A verificação é por `currentSrc`, e não por `src`: com art direction em
    // <picture> o atributo `src` do <img> continua sendo o 16:9 em qualquer
    // orientação — quem revela a escolha do navegador é `currentSrc`.
    const emRetrato = await page.evaluate(
      () => window.matchMedia("(orientation: portrait)").matches,
    );

    const quadroDeEmenda = page.locator('img[src*="concreto-tail"]').first();
    await expect(quadroDeEmenda).toBeAttached();

    // Agora aparece nas DUAS orientações — cada uma com o seu quadro.
    const visivel = await quadroDeEmenda.evaluate(
      (el) => getComputedStyle(el).display !== "none",
    );
    expect(visivel).toBe(true);

    // Ancorado no fim do caminho, e não por `contains`:
    // "concreto-tail-vertical.jpg" contém "concreto-tail.jpg" como prefixo do
    // nome, então uma checagem de substring passaria com o arquivo errado.
    const esperado = emRetrato
      ? "concreto-tail-vertical.jpg"
      : "concreto-tail.jpg";

    await expect
      .poll(
        () =>
          quadroDeEmenda.evaluate((el: HTMLImageElement) => el.currentSrc),
        { timeout: 15_000 },
      )
      .toMatch(new RegExp(`/${esperado.replace(/\./g, "\\.")}$`));
  });

  test("movimento reduzido: os seis capítulos viram composição estática", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.locator("video")).toHaveCount(0);

    // Cada capítulo encolhe para uma tela. Sem isso seriam 260svh de nada
    // entre uma manchete e a próxima para quem pediu para não ser animado.
    const alturas = await page.evaluate(() =>
      [...document.querySelectorAll('[style*="--p"]')]
        .map((stage) => stage.parentElement?.getBoundingClientRect().height ?? 0)
        .filter((altura) => altura > 0),
    );
    const alturaJanela = await page.evaluate(() => window.innerHeight);

    expect(alturas.length).toBeGreaterThanOrEqual(6);
    for (const altura of alturas) {
      expect(altura).toBeLessThan(alturaJanela * 1.5);
    }
  });
});

import { expect, test, type Page } from "@playwright/test";

/**
 * Abertura em sequência contínua.
 *
 * O que estes casos protegem é o que não se vê em revisão de código: que o
 * vídeo REALMENTE toca sozinho (a política de autoplay é do navegador, não do
 * React), que a emenda acontece com os dois clipes em movimento, que a
 * composição não tem controle de player nenhum, e que a característica do
 * perfume aparece no meio da cena.
 */

const ABERTURA = "section[aria-labelledby='abertura-heading']";

/**
 * O clipe da vez.
 *
 * Localizado pelo `data-state`, não pela posição no DOM. Em repouso as camadas
 * montadas são [atual, próxima]; durante a emenda, [que sai, atual, próxima].
 * Nem `.first()` nem `.last()` acertam nos dois casos — `.last()` em repouso
 * pega a PRÓXIMA, que é pausada de propósito, e o teste conclui que a abertura
 * não toca.
 */
function currentVideo(page: Page) {
  return page.locator(`${ABERTURA} > div[data-state='current'] video`);
}

/** As camadas de mídia — uma por cena montada. */
function layers(page: Page) {
  return page.locator(`${ABERTURA} > div[data-state]`);
}

async function waitReady(page: Page) {
  await expect
    .poll(
      () => currentVideo(page).evaluate((v: HTMLVideoElement) => v.readyState),
      { timeout: 25_000 },
    )
    .toBeGreaterThanOrEqual(2);
}

/** Empurra a cena para dentro da janela de sobreposição. */
async function enterSeam(page: Page, secondsBeforeEnd = 1.5) {
  await currentVideo(page).evaluate((v: HTMLVideoElement, s) => {
    v.currentTime = Math.max(0, v.duration - s);
  }, secondsBeforeEnd);
}

function playingCount(page: Page) {
  return page
    .locator(`${ABERTURA} video`)
    .evaluateAll(
      (vs) => vs.filter((v) => !(v as HTMLVideoElement).paused).length,
    );
}

/** Empurra a cena corrente até a emenda e espera a seguinte assumir. */
async function skipScene(page: Page) {
  await expect
    .poll(
      () => currentVideo(page).evaluate((v: HTMLVideoElement) => v.readyState),
      { timeout: 20_000 },
    )
    .toBeGreaterThanOrEqual(2);
  await enterSeam(page, 0.15);
  await page.waitForTimeout(600);
}

test.describe("abertura — apresentação automática", () => {
  /**
   * A home não tinha `h1` nenhum: o `CinematicHero`, que o carregava, saiu
   * daqui e a abertura entrou com um `h2`. Página com `h2` e sem `h1` deixa
   * quem navega por títulos sem ponto de partida.
   */
  test("a página tem um h1, e só um", async ({ page }) => {
    await page.goto("/");

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("depois da presença");
  });

  /**
   * O laço.
   *
   * Antes a sequência terminava e congelava no último quadro. Agora ela volta
   * ao começo, e a volta é uma emenda como as outras — se alguém restaurar o
   * estado de fim, este caso encontra a apresentação parada na sexta cena.
   */
  test("a sequência volta ao início em vez de parar", async ({ page }) => {
    await page.goto("/");

    // atravessa as seis cenas
    for (let i = 0; i < 6; i += 1) await skipScene(page);

    // deu a volta: a primeira fragrância está de novo em cena, e tocando
    await expect(page.getByText("Alba Cítrica").first()).toBeVisible({
      timeout: 30_000,
    });
    await expect
      .poll(() => playingCount(page), { timeout: 20_000 })
      .toBeGreaterThan(0);
  });

  test("toca sozinha, sem som, e já mostra o primeiro perfume", async ({
    page,
  }) => {
    await page.goto("/");

    const video = currentVideo(page);
    await expect(video).toBeAttached();

    // Sem som é requisito de produto E condição para o navegador permitir
    // autoplay. Se isto falhar, a abertura fica parada num poster.
    await expect(video).toHaveJSProperty("muted", true);

    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused), {
        timeout: 20_000,
      })
      .toBe(false);

    await expect(page.getByText("Alba Cítrica").first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Conhecer Alba Cítrica/ }),
    ).toBeVisible();
  });

  test("o preço e o link vêm do catálogo, não do componente", async ({
    page,
  }) => {
    await page.goto("/");

    /* Escopo na seção, e não na página: "A partir de R$ 459,00" também
       aparece nos cards do catálogo abaixo (Alba Cítrica e Maré Clara custam
       o mesmo). Sem o escopo, o localizador casa três elementos e o modo
       estrito do Playwright recusa — com razão.

       `\s` e não um espaço literal: `Intl.NumberFormat("pt-BR")` separa o
       símbolo do valor com espaço NÃO-QUEBRÁVEL (U+00A0), e comparar com
       espaço comum falharia por um caractere invisível. */
    await expect(
      page.locator(ABERTURA).getByText(/A partir de R\$\s459,00/),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Conhecer Alba Cítrica/ }),
    ).toHaveAttribute("href", "/perfumes/alba-citrica");
  });

  test("ao fim de uma cena, a seguinte entra com a própria ficha", async ({
    page,
  }) => {
    await page.goto("/");
    await waitReady(page);
    await enterSeam(page, 0.2);

    // A segunda cena é `pedra-vapor` / Flora Velada — ver src/showcase/sequence.ts
    await expect(page.getByText("Flora Velada").first()).toBeVisible({
      timeout: 25_000,
    });
    await expect(
      page.getByRole("link", { name: /Conhecer Flora Velada/ }),
    ).toHaveAttribute("href", "/perfumes/flora-velada");
  });

  /**
   * O caso que protege a correção central.
   *
   * A versão anterior trocava de cena em `onEnded`: quando o fade começava, o
   * clipe que saía JÁ TINHA ACABADO e estava parado no último quadro. Meia
   * tela imóvel dissolvendo em meia tela em movimento é o que faz a troca ler
   * como "acabou um vídeo". Se alguém voltar o gatilho para `ended`, este
   * caso encontra um só vídeo tocando e falha.
   */
  test("na emenda, os dois clipes correm JUNTOS", async ({ page }) => {
    await page.goto("/");
    await waitReady(page);
    await enterSeam(page);

    await expect
      .poll(() => playingCount(page), { timeout: 20_000 })
      .toBeGreaterThanOrEqual(2);
  });

  /**
   * A outra metade da correção.
   *
   * Se as duas camadas cruzarem opacidade em direções opostas, o composto no
   * meio do caminho deixa o fundo escuro vazar e a imagem afunda. A camada de
   * baixo tem de ficar OPACA o tempo todo; só a de cima anima.
   */
  test("na emenda, a camada que sai não perde opacidade", async ({ page }) => {
    await page.goto("/");
    await waitReady(page);
    await enterSeam(page);

    const lidas: number[][] = [];
    await expect
      .poll(
        async () => {
          const ops = await layers(page).evaluateAll((els) =>
            els.map((e) => Number(getComputedStyle(e).opacity)),
          );
          if (ops.some((o) => o > 0.08 && o < 0.92)) lidas.push(ops);
          return lidas.length;
        },
        { timeout: 20_000 },
      )
      .toBeGreaterThan(0);

    // Em todo instante em que alguma camada estava dissolvendo, outra
    // continuava inteira.
    for (const ops of lidas) expect(Math.max(...ops)).toBe(1);
  });

  test("não há controle de player visível na composição", async ({ page }) => {
    await page.goto("/");
    await waitReady(page);

    // A pausa continua existindo para o teclado (WCAG 2.2 SC 2.2.2), mas
    // nenhum controle ocupa a composição.
    /* Limiar de 8px, e não `> 0`: `sr-only` do Tailwind não zera o elemento,
       encolhe-o para 1x1 com `clip`. Comparar com zero contaria o botão de
       pausa oculto e o teste falharia descrevendo um controle que ninguém vê. */
    const visiveis = await page
      .locator(`${ABERTURA} button`)
      .evaluateAll(
        (els) => els.filter((e) => e.getBoundingClientRect().width > 8).length,
      );
    expect(visiveis).toBe(0);

    // Sem controle nativo de vídeo.
    await expect(page.locator(`${ABERTURA} video[controls]`)).toHaveCount(0);
  });

  test("a pausa continua alcançável por teclado", async ({ page }) => {
    await page.goto("/");
    await waitReady(page);

    const pausar = page.getByRole("button", { name: "Pausar a apresentação" });
    await pausar.focus();
    await expect(pausar).toBeFocused();

    // Ao receber foco ela precisa ficar VISÍVEL — um controle que o teclado
    // alcança mas que ninguém vê não é mecanismo de pausa.
    await expect(pausar).toBeVisible();

    await page.keyboard.press("Enter");
    await expect.poll(() => playingCount(page), { timeout: 10_000 }).toBe(0);

    await page
      .getByRole("button", { name: "Retomar a apresentação" })
      .press("Enter");
    await expect
      .poll(() => playingCount(page), { timeout: 10_000 })
      .toBeGreaterThan(0);
  });

  /**
   * A característica pertence ao plano, não à página.
   *
   * O dado vem do catálogo: a primeira nota de fundo da Alba Cítrica é
   * "Almíscar branco".
   */
  test("a característica do perfume aparece no meio da cena", async ({
    page,
  }) => {
    await page.goto("/");
    await waitReady(page);

    const cartela = page.locator(ABERTURA).getByText("Almíscar branco");
    await expect(cartela).toBeAttached();

    await currentVideo(page).evaluate((v: HTMLVideoElement) => {
      v.currentTime = v.duration * 0.45;
    });

    /* Opacidade computada, e não `toBeVisible()`: a cartela existe no DOM o
       tempo todo e só a opacidade a governa — `toBeVisible` passaria com ela
       completamente invisível. */
    await expect
      .poll(
        () =>
          cartela.evaluate((el) =>
            Number(getComputedStyle(el.parentElement as HTMLElement).opacity),
          ),
        { timeout: 20_000 },
      )
      .toBeGreaterThan(0.5);
  });

  test("rolar leva ao catálogo, e a apresentação para de tocar", async ({
    page,
  }) => {
    await page.goto("/");
    const video = currentVideo(page);
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused), {
        timeout: 20_000,
      })
      .toBe(false);

    await page.locator("#catalogo").scrollIntoViewIfNeeded();

    await expect(
      page.getByRole("heading", { name: "Sete linhas, sete temperamentos" }),
    ).toBeVisible();

    // Fora da tela nada toca: decodificação custa bateria.
    await expect.poll(() => playingCount(page), { timeout: 15_000 }).toBe(0);
  });

  test("o poster sai do servidor, para não haver tela preta", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const poster = page.locator(`${ABERTURA} img`).first();
    await expect(poster).toHaveAttribute("src", /\/media\/cinema\/.*\.jpg/);
  });
});

test.describe("abertura — movimento reduzido", () => {
  /* `emulateMedia` antes do `goto`, como em cinema.spec.ts e hero.spec.ts:
     a preferência precisa valer já na primeira renderização, senão a página
     monta em modo automático e só depois descobre que não devia. */

  test("não toca nada sozinho e oferece o começo à pessoa", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.locator(`${ABERTURA} video`)).toHaveCount(0);

    await expect(
      page.getByRole("button", { name: "Iniciar a apresentação" }),
    ).toBeVisible();

    // A composição estática continua na tela — não é um retângulo vazio.
    await expect(page.locator(`${ABERTURA} img`).first()).toBeVisible();
  });

  test("o botão inicia a apresentação quando pedida", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await page.getByRole("button", { name: "Iniciar a apresentação" }).click();

    await expect(currentVideo(page)).toBeAttached();
  });
});

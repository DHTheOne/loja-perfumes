// @ts-check
/**
 * Prepara os vídeos CGI dos perfumes para uso estrutural na interface.
 *
 * Entrada: os masters em `docs/media/source/cinema/` (1920×1080, 8s, 24fps,
 * com áudio) — fora do Git, como manda MEDIA_PLAN §8 e o `.gitignore`.
 * Saída: por vídeo, uma versão desktop, uma mobile, o poster do primeiro
 * quadro e a imagem do último.
 *
 * Decisões que valem registro:
 *
 * — ÁUDIO REMOVIDO (`-an`). Estes vídeos são elemento de interface, não peça
 *   de vídeo: nunca tocam som (§26 da especificação). Remover a trilha também
 *   elimina a faixa que, presente, faz alguns navegadores tratarem o clipe
 *   como mídia com som e bloquearem o autoplay.
 *
 * — `faststart` move o índice do MP4 para o início do arquivo. Sem isso o
 *   navegador precisa baixar quase o vídeo inteiro antes do primeiro quadro,
 *   o que inviabiliza tanto o autoplay rápido quanto o scrubbing.
 *
 * — GOP CURTO (`-g 12`, metade dos 24 fps). Scrubbing por rolagem faz o
 *   navegador buscar quadros arbitrários, e a busca só pousa em keyframe. Com
 *   o GOP padrão (~250) cada salto percorreria segundos de vídeo; com 12 a
 *   granularidade cai para meio segundo, ao custo de algum tamanho. É a troca
 *   que torna o scrub viável.
 *
 * — ÚLTIMO QUADRO como imagem: serve às transições de continuidade entre
 *   capítulos (§7), em que o fim de um vídeo precisa coincidir visualmente
 *   com o início da seção seguinte.
 *
 * Uso: npm run media:cinema
 */

import { mkdir, readdir, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

const SOURCE_DIR = path.join("docs", "media", "source", "cinema");
const OUTPUT_DIR = path.join("public", "media", "cinema");
const MANIFEST_PATH = path.join("src", "cinema", "clips.generated.ts");

/**
 * Nomes estáveis pelo conteúdo da cena, não pelo nome do arquivo de origem —
 * os masters chegam com nomes gerados que não descrevem nada e mudam a cada
 * regeração. A ordem segue a listagem alfabética da pasta.
 */
const SLUGS = [
  "salao-luz",
  "pedra-vapor",
  "concreto",
  "galeria",
  "travertino",
  "pedestal-ambar",
];

const VARIANTS = [
  { suffix: "1080", width: 1920, crf: 24 },
  { suffix: "720", width: 1280, crf: 26 },
];

/**
 * Composição vertical (9:16) para telas de celular.
 *
 * NÃO é um recorte do 16:9. Recortar 1080 de largura de um quadro de 1920
 * descartaria 44% da cena, e no `concreto` isso é fatal: o frasco cresce até
 * encostar nas bordas laterais no fim do clipe, então o corte decepa o produto
 * justamente no clímax do movimento.
 *
 * A composição escolhida mantém o quadro inteiro, nítido, numa faixa
 * posicionada no terço superior, e estende o restante do enquadramento com uma
 * versão desfocada e rebaixada do MESMO quadro. Duas consequências: a extensão
 * acompanha a luz da cena a cada instante (uma barra de cor sólida
 * descolaria assim que a câmera mudasse a iluminação), e o terço inferior vira
 * espaço negativo real para a tipografia, em vez de texto sobre o produto.
 *
 * `BAND_TOP` põe o centro da faixa a ~38% da altura — o frasco fica na linha
 * superior de interesse e o texto ocupa a metade de baixo.
 */
const VERTICAL = {
  width: 1080,
  height: 1920,
  bandTop: 430,
  crf: 26,
};

/**
 * O desfoque é feito reduzindo, borrando pouco e ampliando de volta. Um
 * `gblur` com sigma alto direto em 1080×1920 custa caro por quadro; este
 * caminho entrega o mesmo resultado visual por uma fração do tempo, porque a
 * ampliação bilinear já é, por si, um borrão.
 */
const VERTICAL_FILTER = [
  "[0:v]split=2[bgsrc][fgsrc]",
  "[bgsrc]scale=136:242,gblur=sigma=5," +
    `scale=${VERTICAL.width}:${VERTICAL.height},` +
    "eq=brightness=-0.10:saturation=0.85,setsar=1[bg]",
  `[fgsrc]scale=${VERTICAL.width}:-2,setsar=1[fg]`,
  `[bg][fg]overlay=(W-w)/2:${VERTICAL.bandTop}[v]`,
].join(";");

async function ffprobeDuration(file) {
  const { stdout } = await run("ffprobe", [
    "-v",
    "quiet",
    "-show_entries",
    "format=duration",
    "-of",
    "csv=p=0",
    file,
  ]);
  return Number.parseFloat(stdout.trim());
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });

  const files = (await readdir(SOURCE_DIR))
    .filter((name) => name.toLowerCase().endsWith(".mp4"))
    .sort();

  if (files.length === 0) {
    throw new Error(`Nenhum .mp4 em ${SOURCE_DIR}`);
  }

  const manifest = [];

  for (const [index, file] of files.entries()) {
    const slug = SLUGS[index] ?? path.basename(file, ".mp4").toLowerCase();
    const source = path.join(SOURCE_DIR, file);
    const duration = await ffprobeDuration(source);

    for (const variant of VARIANTS) {
      const dest = path.join(OUTPUT_DIR, `${slug}-${variant.suffix}.mp4`);
      await run("ffmpeg", [
        "-y",
        "-v",
        "error",
        "-i",
        source,
        "-an",
        "-c:v",
        "libx264",
        "-profile:v",
        "high",
        "-crf",
        String(variant.crf),
        "-preset",
        "slow",
        "-g",
        "12",
        "-keyint_min",
        "12",
        "-sc_threshold",
        "0",
        "-pix_fmt",
        "yuv420p",
        "-vf",
        `scale=${variant.width}:-2`,
        "-movflags",
        "+faststart",
        dest,
      ]);
    }

    const vertical = path.join(OUTPUT_DIR, `${slug}-vertical.mp4`);
    await run("ffmpeg", [
      "-y",
      "-v",
      "error",
      "-i",
      source,
      "-an",
      "-filter_complex",
      VERTICAL_FILTER,
      "-map",
      "[v]",
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-crf",
      String(VERTICAL.crf),
      "-preset",
      "slow",
      "-g",
      "12",
      "-keyint_min",
      "12",
      "-sc_threshold",
      "0",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      vertical,
    ]);

    const verticalPoster = path.join(
      OUTPUT_DIR,
      `${slug}-poster-vertical.jpg`,
    );
    await run("ffmpeg", [
      "-y",
      "-v",
      "error",
      "-i",
      source,
      "-filter_complex",
      VERTICAL_FILTER,
      "-map",
      "[v]",
      "-frames:v",
      "1",
      "-q:v",
      "4",
      verticalPoster,
    ]);

    const poster = path.join(OUTPUT_DIR, `${slug}-poster.jpg`);
    await run("ffmpeg", [
      "-y",
      "-v",
      "error",
      "-i",
      source,
      "-frames:v",
      "1",
      "-q:v",
      "4",
      "-vf",
      "scale=1920:-2",
      poster,
    ]);

    // 0,08 s antes do fim: exatamente no fim a busca costuma cair depois do
    // último quadro decodificável e devolver imagem preta.
    const tail = path.join(OUTPUT_DIR, `${slug}-tail.jpg`);
    await run("ffmpeg", [
      "-y",
      "-v",
      "error",
      "-ss",
      String(Math.max(0, duration - 0.08)),
      "-i",
      source,
      "-frames:v",
      "1",
      "-q:v",
      "4",
      "-vf",
      "scale=1920:-2",
      tail,
    ]);

    manifest.push({ slug, duration: Number(duration.toFixed(3)) });
    console.log(`${slug}: ${duration.toFixed(2)}s`);
  }

  const body = manifest
    .map(
      (clip) => `  "${clip.slug}": {
    slug: "${clip.slug}",
    duration: ${clip.duration},
    desktop: "/media/cinema/${clip.slug}-1080.mp4",
    tablet: "/media/cinema/${clip.slug}-720.mp4",
    vertical: "/media/cinema/${clip.slug}-vertical.mp4",
    poster: "/media/cinema/${clip.slug}-poster.jpg",
    posterVertical: "/media/cinema/${clip.slug}-poster-vertical.jpg",
    tail: "/media/cinema/${clip.slug}-tail.jpg",
  },`,
    )
    .join("\n");

  await writeFile(
    MANIFEST_PATH,
    `/**
 * GERADO POR scripts/build-cinema-media.mjs — NÃO EDITE À MÃO.
 *
 * Rode \`npm run media:cinema\` após trocar qualquer master em
 * docs/media/source/cinema/.
 */

export type CinemaClip = {
  slug: string;
  /** Duração em segundos. O scrub mapeia o progresso da rolagem nela. */
  duration: number;
  desktop: string;
  /** Mesma composição 16:9, arquivo menor — telas médias. */
  tablet: string;
  /** Composição 9:16 própria: faixa nítida no alto, extensão desfocada. */
  vertical: string;
  /** Primeiro quadro — a composição estática que precede qualquer animação. */
  poster: string;
  posterVertical: string;
  /** Último quadro — ponto de continuidade com a seção seguinte. */
  tail: string;
};

export const CLIPS = {
${body}
} as const satisfies Record<string, CinemaClip>;

export type ClipSlug = keyof typeof CLIPS;
`,
    "utf8",
  );

  console.log(`\n${manifest.length} clipes → ${OUTPUT_DIR}`);
}

await main();

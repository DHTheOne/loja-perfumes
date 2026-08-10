// @ts-check
/**
 * Prepara as cinematográficas das linhas para serem servidas pelo site.
 *
 * Entrada: os PNG aprovados em docs/media/generated/ (1,4–1,9 MB cada), que
 * ficam no repositório como mestre editorial e nunca são servidos.
 * Saída: um WebP por linha em public/media/lines/, mais um manifesto TS com
 * dimensões reais e placeholder de desfoque.
 *
 * Por que um único arquivo por linha e não um jogo de larguras: quem gera o
 * srcset responsivo é o next/image, a partir deste mestre. Pré-gerar larguras
 * aqui duplicaria esse trabalho e ainda obrigaria a manter as duas listas em
 * sincronia. O que o pré-processo resolve é outra coisa — tirar o PNG de 1,9 MB
 * do caminho e fixar o teto de resolução no que a página realmente usa.
 *
 * O manifesto existe porque estes arquivos moram em public/: import estático
 * (que daria width/height/blurDataURL de graça) só funciona para imagens que
 * passam pelo bundler — ver
 * node_modules/next/dist/docs/01-app/01-getting-started/12-images.md.
 *
 * Uso: npm run media:lines
 */

import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const SOURCE_DIR = path.join(
  "docs",
  "media",
  "generated",
  "master-bottle-collection-2026-08-07",
  "cinematic",
);
const OUTPUT_DIR = path.join("public", "media", "lines");
const MANIFEST_PATH = path.join("src", "ui", "lineMedia.generated.ts");

/**
 * Teto de largura do arquivo servido.
 *
 * A maior caixa que a imagem ocupa é o visual da página de produto, que num
 * viewport de 1536 px fica em torno de 640 px CSS. 1600 cobre isso com folga
 * para telas 2x sem carregar os 1920 do mestre.
 */
const MAX_WIDTH = 1600;
const QUALITY = 82;

/** Largura do placeholder embutido como data URI no manifesto. */
const BLUR_WIDTH = 16;

/** `01-lenho-vigil.png` → `lenho-vigil`. */
function slugFromFilename(filename) {
  return path.basename(filename, path.extname(filename)).replace(/^\d+-/, "");
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const entries = (await readdir(SOURCE_DIR))
    .filter((name) => name.toLowerCase().endsWith(".png"))
    .sort();

  if (entries.length === 0) {
    throw new Error(`Nenhum PNG encontrado em ${SOURCE_DIR}`);
  }

  const manifest = [];

  for (const entry of entries) {
    const slug = slugFromFilename(entry);
    const sourcePath = path.join(SOURCE_DIR, entry);
    const outputPath = path.join(OUTPUT_DIR, `${slug}.webp`);

    const { width, height, size } = await sharp(sourcePath)
      .resize({
        width: MAX_WIDTH,
        // `withoutEnlargement` evita subir as 1672 px da Flora Velada para
        // 1600 — ela já está abaixo do teto, ampliar só inventaria pixel.
        withoutEnlargement: true,
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    // O placeholder sai do próprio arquivo servido, não do PNG mestre, para
    // que a cor média do desfoque bata com a da imagem que vai carregar.
    const blur = await sharp(outputPath)
      .resize({ width: BLUR_WIDTH })
      .webp({ quality: 40 })
      .toBuffer();

    manifest.push({
      slug,
      src: `/media/lines/${slug}.webp`,
      width,
      height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    });

    console.log(`${slug}: ${width}x${height} — ${(size / 1024).toFixed(0)} KB`);
  }

  const body = manifest
    .map(
      (item) => `  "${item.slug}": {
    src: "${item.src}",
    width: ${item.width},
    height: ${item.height},
    blurDataURL:
      "${item.blurDataURL}",
  },`,
    )
    .join("\n");

  const file = `/**
 * GERADO POR scripts/build-line-media.mjs — NÃO EDITE À MÃO.
 *
 * Dimensões reais e placeholder de cada cinematográfica servida em
 * public/media/lines/. Rode \`npm run media:lines\` após trocar qualquer
 * imagem de origem.
 */

export type LineMediaEntry = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export const LINE_MEDIA = {
${body}
} as const satisfies Record<string, LineMediaEntry>;
`;

  await writeFile(MANIFEST_PATH, file, "utf8");
  console.log(`\n${manifest.length} imagens → ${OUTPUT_DIR}`);
  console.log(`manifesto → ${MANIFEST_PATH}`);
}

await main();

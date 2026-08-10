"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

import { useSceneAllowed } from "@/3d/useSceneAllowed";
import type { LineMediaEntry } from "@/ui/lineMedia";
import type { LineKey } from "@/ui/tokens";

/**
 * Visual da página de produto: a cinematográfica sempre, o 3D por cima quando
 * o cliente aguenta.
 *
 * A ordem importa. A imagem é renderizada no servidor e é o LCP da página —
 * trocá-la por um canvas vazio até o three.js chegar adiaria a própria
 * métrica que ARCHITECTURE.md §9 manda proteger. A cena entra depois, em
 * cima, e some de novo se a pessoa ligar "movimento reduzido" com a página
 * aberta.
 *
 * Isso também resolve o fallback de graça: sem WebGL, em dispositivo fraco ou
 * com movimento reduzido, o que fica é a fotografia da própria fragrância —
 * não um placeholder genérico.
 */
const ProductScene = dynamic(
  () => import("@/3d/ProductScene").then((mod) => mod.ProductScene),
  { ssr: false },
);

type ProductVisualProps = {
  media: LineMediaEntry;
  alt: string;
  lineKey: LineKey;
};

export function ProductVisual({ media, alt, lineKey }: ProductVisualProps) {
  const { isSceneAllowed } = useSceneAllowed();

  return (
    /* A razão de aspecto vem do manifesto, não do layout da imagem.
       Herdá-la da `<img>` deixava o contêiner sem altura no instante em que a
       cena montava, e o r3f media 0 e fixava o canvas no padrão de 300x150 —
       verificado no navegador. Com `aspect-ratio` a caixa tem altura antes de
       qualquer imagem carregar, o que de quebra elimina salto de layout. */
    <div
      className="relative"
      style={{ aspectRatio: `${media.width} / ${media.height}` }}
    >
      {isSceneAllowed ? null : (
        <Image
          src={media.src}
          alt={alt}
          fill
          placeholder="blur"
          blurDataURL={media.blurDataURL}
          priority
          sizes="(min-width: 1024px) 42vw, 92vw"
          className="object-cover"
        />
      )}

      {/* O contêiner da cena existe desde o servidor e só o canvas entra
          depois. Criar os dois no mesmo instante fazia o react-three-fiber
          medir um elemento ainda sem layout e fixar o canvas no padrão de
          300x150 — verificado no navegador. Com a caixa já posicionada e
          dimensionada, a medição na montagem do canvas acerta de primeira.

          `aria-hidden`: a cena mostra a mesma coisa que a fotografia já
          descreve no `alt`. Anunciá-la de novo faria o leitor de tela
          repetir o frasco duas vezes. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 motion-safe:animate-[fade-in_700ms_ease-out]"
      >
        {isSceneAllowed ? <ProductScene lineKey={lineKey} /> : null}
      </div>
    </div>
  );
}

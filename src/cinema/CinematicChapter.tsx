"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";

import { artDirection, clip, type ClipSlug } from "@/cinema/clips";
import {
  useArmWhenNear,
  usePrefersReducedMotion,
  useScrollTimeline,
} from "@/cinema/useScrollTimeline";

/**
 * Capítulo cinematográfico — o hero generalizado para o resto da página.
 *
 * VOCABULÁRIO DE MOVIMENTO, derivado dos quatro vídeos de referência do
 * proprietário. O que se copia é a LINGUAGEM, não o layout: os três gestos
 * abaixo aparecem nas quatro referências e são o que faz aqueles sites lerem
 * como filme em vez de página.
 *
 *  1. MATCH CUT. Cada capítulo abre exibindo o ÚLTIMO quadro do capítulo
 *     anterior e dissolve dele para a própria cena. Sem isso a emenda entre
 *     dois vídeos é um corte seco de luz e cor — o olho registra "trocou de
 *     seção". Com isso, a página inteira lê como uma tomada contínua. As
 *     imagens `-tail.jpg` já eram geradas pelo pipeline e nunca tinham sido
 *     usadas; é exatamente para isto que existem.
 *
 *  2. RECUO PARA MOLDURA. A mídia começa sangrando até a borda e RECUA para
 *     uma moldura arredondada conforme o capítulo avança. É o gesto mais
 *     reconhecível da referência de produto: o vídeo em tela cheia que se
 *     retrai e devolve espaço à tipografia. O espaço negativo não é decidido
 *     no layout, ele é CRIADO pelo movimento.
 *
 *  3. TIPOGRAFIA QUE CEDE. O texto apresenta e sai; a imagem sustenta. Sair
 *     por opacidade E deslocamento lê como "ficou para trás"; só por opacidade
 *     lê como "apagou".
 *
 * PESO. A home tem seis capítulos e cada clipe pesa de 3 a 6 MB. Montar os
 * seis na abertura seriam ~30 MB para ver a primeira tela. `useArmWhenNear`
 * só monta o `<video>` quando o capítulo se aproxima; até lá quem sustenta a
 * composição é o poster, que sai do servidor e pesa dezenas de KB.
 */

type ChapterCta = { href: string; label: string };

type CinematicChapterProps = {
  slug: ClipSlug;
  /** Numeral editorial do capítulo — "02". Decorativo, fora do fluxo de leitura. */
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  cta?: ChapterCta;
  /**
   * Capítulo anterior, por slug. Sem ele não há match cut.
   *
   * Recebe o SLUG e não um caminho pronto porque a emenda precisa de dois
   * quadros — o 16:9 e o 9:16 —, e quem escolhe entre eles é o navegador,
   * pela orientação. Passar um caminho só obrigaria a página a adivinhar a
   * orientação no servidor, que é onde ela não existe.
   */
  matchFrom?: ClipSlug;
  /**
   * Altura do trilho em `svh`. Mais trilho, câmera mais lenta.
   *
   * O hero usa 320 porque é a primeira impressão e pode se dar ao luxo de
   * durar. Os capítulos seguintes ficam em 260: já se entendeu o gesto, e
   * repetir a mesma duração seis vezes transforma a home em túnel.
   */
  runway?: number;
};

export function CinematicChapter({
  slug,
  index,
  eyebrow,
  title,
  lede,
  cta,
  matchFrom,
  runway = 260,
}: CinematicChapterProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = usePrefersReducedMotion();
  const armed = useArmWhenNear(runwayRef);

  const media = clip(slug);
  const art = artDirection(slug);
  const matchClip = matchFrom ? clip(matchFrom) : null;

  const handleProgress = useCallback((progress: number) => {
    stageRef.current?.style.setProperty("--p", progress.toFixed(4));

    const video = videoRef.current;
    if (!video || !video.duration) return;

    const target = progress * video.duration;
    // Mesmo limiar de meio quadro do hero: atribuir `currentTime` a cada
    // quadro empilha buscas que o decodificador não atende, e o vídeo trava
    // em vez de correr.
    if (Math.abs(video.currentTime - target) > 1 / 48) {
      video.currentTime = target;
    }
  }, []);

  useScrollTimeline(runwayRef, {
    onProgress: handleProgress,
    enabled: !prefersReducedMotion,
  });

  const primeDecoder = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    void video
      .play()
      .then(() => video.pause())
      .catch(() => {
        // Autoplay negado: o poster continua no lugar. Nada a recuperar.
      });
  }, []);

  /* A direção de arte diz de que lado do quadro está o frasco. A tipografia
     ocupa o lado OPOSTO em vez de disputar espaço com o produto. Nas cenas
     centradas ela vai para a base, que é onde o gradiente já dá contraste. */
  const typePosition =
    art.bias === "right"
      ? "justify-center items-start text-left"
      : art.bias === "left"
        ? "justify-center items-end text-right"
        : "justify-end items-start text-left";

  const showVideo = !prefersReducedMotion && armed;

  return (
    <section
      ref={runwayRef}
      aria-labelledby={`capitulo-${slug}`}
      className="relative"
      style={{
        height: prefersReducedMotion ? "100svh" : `${runway}svh`,
        background: art.ambient,
      }}
    >
      <div
        ref={stageRef}
        style={
          {
            "--p": 0,
            /* Progresso da MOLDURA, derivado do progresso bruto. O recuo só
               começa depois que o match cut terminou (0,18) e se completa na
               metade do capítulo — daí em diante a composição é estável e a
               atenção pode ir para o texto. */
            "--f": "clamp(0, calc((var(--p) - 0.18) / 0.32), 1)",
          } as React.CSSProperties
        }
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
      >
        {/* Bloco de mídia. O `clip-path` recua as quatro bordas e arredonda os
            cantos, revelando a cor de ambiente por trás — é ela que vira a
            moldura. Clip-path e opacidade são resolvidos pelo compositor: não
            há recálculo de layout por quadro. */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: "var(--layer-media)",
            clipPath:
              "inset(calc(var(--f) * 4.5%) calc(var(--f) * 3.5%) round calc(var(--f) * 1.25rem))",
            willChange: "clip-path",
          }}
        >
          {/* Poster — a composição estática. Sai do servidor e permanece sob o
              vídeo: se a decodificação falhar, o que fica é uma imagem certa. */}
          <picture>
            <source
              media="(max-aspect-ratio: 3/4)"
              srcSet={media.posterVertical}
              width={1080}
              height={1920}
            />
            {/* `no-img-element` abre exceção para <img> dentro de <picture>,
                que é o caso de art direction — dois enquadramentos compostos
                separadamente, não a mesma imagem em duas escalas. */}
            <img
              src={media.poster}
              alt=""
              width={1920}
              height={1080}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>

          {showVideo ? (
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              poster={media.poster}
              onLoadedData={primeDecoder}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source
                src={media.vertical}
                type="video/mp4"
                media="(max-aspect-ratio: 3/4)"
              />
              <source
                src={media.tablet}
                type="video/mp4"
                media="(max-width: 1279px)"
              />
              <source src={media.desktop} type="video/mp4" />
            </video>
          ) : null}

          {/* Match cut: o último quadro do capítulo anterior, por cima da
              própria cena, dissolvendo nos primeiros 12% do trilho. Quando o
              capítulo anterior desencosta do topo ele está exibindo
              exatamente esta imagem — então o primeiro quadro deste capítulo
              é o mesmo pixel, e a emenda desaparece.

              ART DIRECTION, pelo mesmo motivo do poster: a emenda é com o que
              ESTAVA NA TELA, e isso depende da orientação. Em paisagem o
              capítulo anterior terminou no master 16:9; em retrato terminou na
              composição 9:16, que é outro enquadramento, com o frasco em outro
              lugar da tela. Servir o quadro errado faria o produto saltar de
              posição — e um salto chama MAIS atenção para a emenda do que um
              corte seco chamaria. Por isso são dois arquivos, escolhidos pela
              mesma media query do poster e do vídeo. */}
          {matchClip && !prefersReducedMotion ? (
            <picture>
              <source
                media="(max-aspect-ratio: 3/4)"
                srcSet={matchClip.tailVertical}
                width={1080}
                height={1920}
              />
              <img
                src={matchClip.tail}
                alt=""
                aria-hidden="true"
                width={1920}
                height={1080}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  zIndex: 1,
                  opacity: "clamp(0, calc((0.12 - var(--p)) / 0.12), 1)",
                }}
              />
            </picture>
          ) : null}
        </div>

        {/* Emenda da composição vertical — só existe no enquadramento 9:16,
            onde a faixa nítida ocupa de 22,4% a 54,1% da altura e a transição
            para a extensão desfocada é uma aresta reta. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 portrait:block landscape:hidden"
          style={{
            zIndex: "var(--layer-grade)",
            background: `linear-gradient(to bottom,
              transparent 17%, ${art.ambient} 22.4%, transparent 28%,
              transparent 48%, ${art.ambient} 54.1%, transparent 60%)`,
            opacity: 0.85,
          }}
        />

        {/* Tratamento de luz — VERTICAL: rebaixa o topo para o header não
            competir com a cena e escurece a base para o texto ter contraste
            sem caixa opaca por trás. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: "var(--layer-grade)",
            background:
              "linear-gradient(to bottom, rgb(10 9 8 / 0.7) 0%, transparent 28%, rgb(10 9 8 / 0.5) 62%, rgb(10 9 8 / 0.92) 100%)",
            opacity: "calc(0.65 + var(--p) * 0.35)",
          }}
        />

        {/* Tratamento de luz — LATERAL, do lado em que o texto vive.
            Existe por uma falha medida, não por gosto: entre ~768 e ~1200 px
            a manchete atravessa o produto, porque as cenas têm o frasco
            centrado e nessa faixa não sobra coluna livre. O gradiente vertical
            sozinho não resolve — ele escurece a BASE, e a manchete vive na
            altura média, onde a cena está no seu ponto mais claro.

            Um scrim de um lado só preserva a fotografia: o lado do produto
            continua com o contraste original, e apenas a coluna de leitura
            recebe apoio. Escurecer o quadro inteiro para salvar o texto seria
            trocar o problema por uma imagem lavada. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: "var(--layer-grade)",
            background: `linear-gradient(to ${art.bias === "left" ? "left" : "right"},
              rgb(10 9 8 / 0.68) 0%, rgb(10 9 8 / 0.34) 34%, transparent 58%)`,
            opacity: "calc(0.55 + var(--p) * 0.25)",
          }}
        />

        <div
          className={`relative mx-auto flex h-full w-full max-w-7xl flex-col px-6 pb-24 pt-28 md:px-12 md:pb-28 ${typePosition}`}
          style={{ zIndex: "var(--layer-type)" }}
        >
          <div
            className="max-w-xl"
            style={{
              /* Entra de 0,04 a 0,2 e cede de 0,58 a 0,82. O intervalo de
                 permanência é o miolo do capítulo — a cena continua correndo
                 sob um texto parado, que é o que dá a leitura de câmera. */
              opacity:
                "min(clamp(0, calc((var(--p) - 0.04) / 0.16), 1), clamp(0, calc((0.82 - var(--p)) / 0.24), 1))",
              transform:
                "translate3d(0, calc((1 - clamp(0, calc((var(--p) - 0.04) / 0.16), 1)) * 2rem + var(--p) * -2rem), 0)",
              willChange: "transform, opacity",
            }}
          >
            <p className="flex items-baseline gap-4 font-sans text-xs uppercase tracking-[0.35em] text-champagne">
              {/* O numeral é decoração editorial: quem ouve a página não ganha
                  nada com "zero dois" antes do nome do capítulo. */}
              <span
                aria-hidden="true"
                className="font-display text-3xl leading-none opacity-60"
              >
                {index}
              </span>
              {eyebrow}
            </p>

            <h2
              id={`capitulo-${slug}`}
              className="mt-5 font-display text-4xl font-light leading-[1.05] md:text-6xl"
            >
              {title}
            </h2>

            {lede ? (
              <p
                className="mt-6 max-w-md text-ink-muted"
                style={{ fontSize: "var(--text-lead)" }}
              >
                {lede}
              </p>
            ) : null}

            {cta ? (
              <Link
                href={cta.href}
                className="mt-9 inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 font-sans text-sm text-ink transition-colors hover:border-champagne hover:text-champagne"
                style={{ transitionDuration: "var(--motion-ui)" }}
              >
                {cta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";

import { artDirection, clip, type ClipSlug } from "@/cinema/clips";
import {
  usePrefersReducedMotion,
  useScrollTimeline,
} from "@/cinema/useScrollTimeline";

/**
 * Hero cinematográfico: a rolagem é a linha do tempo do vídeo.
 *
 * O clipe escolhido para esta primeira sequência é o `concreto`, e a escolha é
 * técnica antes de ser estética: das seis cenas, é a única com movimento
 * MONOTÔNICO — a câmera só aproxima, nunca recua. Num scrub, movimento que
 * inverte de direção no meio faz o usuário rolar para baixo e ver a câmera
 * voltar, o que lê como falha de controle. Com movimento monotônico, rolar
 * para baixo é sempre aproximar e rolar para cima é sempre afastar.
 *
 * ARQUITETURA DA CENA (§12): o poster pinta a composição estática, o vídeo
 * entra por cima quando decodifica, o gradiente trata a luz, e só então a
 * tipografia. Cada camada tem seu papel na escala `--layer-*`.
 *
 * SEM BIBLIOTECA DE SCROLL. A especificação autoriza GSAP, mas §20 também
 * manda não adicionar biblioteca só porque apareceu na referência, e §21 trata
 * performance como requisito crítico. O scrub precisa de um laço `rAF` de
 * qualquer forma — que é o que `useScrollTimeline` faz — e a coreografia da
 * tipografia sai de uma custom property lida pelo CSS. GSAP acrescentaria
 * ~50 KB para reimplementar exatamente isso.
 */

type CinematicHeroProps = {
  slug: ClipSlug;
  eyebrow: string;
  title: string;
  lede: string;
  ctaHref: string;
  ctaLabel: string;
};

export function CinematicHero({
  slug,
  eyebrow,
  title,
  lede,
  ctaHref,
  ctaLabel,
}: CinematicHeroProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = usePrefersReducedMotion();

  const media = clip(slug);
  const art = artDirection(slug);

  const handleProgress = useCallback(
    (progress: number) => {
      // A custom property é o único canal entre o laço e a interface: o CSS
      // deriva dela opacidade e deslocamento sem passar pelo React.
      stageRef.current?.style.setProperty("--p", progress.toFixed(4));

      const video = videoRef.current;
      if (!video || !video.duration) return;

      const target = progress * video.duration;
      // Só busca quando a diferença passa de meio quadro. Atribuir
      // `currentTime` a cada quadro empilha buscas que o decodificador não
      // consegue atender, e o vídeo trava em vez de correr.
      if (Math.abs(video.currentTime - target) > 1 / 48) {
        video.currentTime = target;
      }
    },
    [],
  );

  useScrollTimeline(runwayRef, {
    onProgress: handleProgress,
    enabled: !prefersReducedMotion,
  });

  /**
   * Prepara o decodificador.
   *
   * Safari não pinta o quadro de um vídeo que nunca tocou: sem isto o elemento
   * fica transparente e só o poster aparece, mesmo com o arquivo carregado. Um
   * `play()` seguido de `pause()` imediato força o primeiro quadro na tela sem
   * que o usuário veja reprodução. `muted` + `playsInline` são o que tornam
   * essa chamada permitida sem gesto do usuário.
   */
  const primeDecoder = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    void video
      .play()
      .then(() => video.pause())
      .catch(() => {
        // Autoplay negado: o poster continua no lugar e a página segue
        // legível. Não há o que recuperar aqui.
      });
  }, []);

  return (
    <div
      ref={runwayRef}
      /* O trilho é o que dá curso à linha do tempo: 320svh significa pouco
         mais de duas telas de rolagem para percorrer os 8s do clipe. Menos que
         isso e o vídeo corre rápido demais para ler como câmera; muito mais e
         a seção vira um túnel. Sob movimento reduzido o trilho encolhe para
         uma tela e a seção passa a ser uma composição estática. */
      style={{
        height: prefersReducedMotion ? "100svh" : "320svh",
        background: art.ambient,
      }}
      className="relative"
    >
      <div
        ref={stageRef}
        style={{ "--p": 0 } as React.CSSProperties}
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
      >
        {/* Camada 1 — poster: a composição estática perfeita que §4 pede.
            Sai do servidor, é o LCP, e permanece sob o vídeo. Se a decodificação
            falhar ou demorar, o que fica na tela é uma imagem correta, não um
            retângulo vazio. */}
        {/* `<picture>` e não next/image: são DOIS enquadramentos distintos —
            16:9 e 9:16 compostos separadamente —, não a mesma imagem em
            escalas diferentes. next/image gera srcset de um único `src` e não
            faz art direction; as alternativas seriam esticar o horizontal no
            celular ou renderizar duas <Image> alternadas por CSS, o que baixa
            as duas, já que `display: none` não impede o fetch. É o mesmo
            raciocínio que o hero antigo documentava em HeroFallback. */}
        <picture>
          <source
            media="(max-aspect-ratio: 3/4)"
            srcSet={media.posterVertical}
            width={1080}
            height={1920}
          />
          {/* A regra `no-img-element` abre exceção para <img> dentro de
              <picture>, que é exatamente o caso de art direction acima. */}
          <img
            src={media.poster}
            alt=""
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ zIndex: "var(--layer-ambient)" }}
          />
        </picture>

        {/* Camada 2 — vídeo. Sem controles, sem som, sem laço: ele não toca,
            é percorrido. */}
        {prefersReducedMotion ? null : (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            poster={media.poster}
            onLoadedData={primeDecoder}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ zIndex: "var(--layer-media)" }}
          >
            {/* Três arquivos, três enquadramentos. O celular recebe a
                composição 9:16 própria — não o 16:9 esticado nem recortado.
                A ordem importa: o navegador escolhe a PRIMEIRA fonte cuja
                media query casa. */}
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
        )}

        {/* Emenda da composição vertical.
            A faixa nítida ocupa de 22,4% a 54,1% da altura do arquivo 9:16, e
            a transição para a extensão desfocada é uma aresta reta — sem
            tratamento, lê como vídeo colado sobre fundo borrado. Estes dois
            degradês, alinhados às bordas da faixa, dissolvem a aresta. Só
            existem no enquadramento vertical; no 16:9 não há emenda alguma. */}
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

        {/* Camada 3 — tratamento de luz. Dois gradientes: um rebaixa o topo
            para o header não competir com a cena, outro escurece a base o
            bastante para o texto ter contraste sem precisar de caixa opaca por
            trás. A opacidade cresce com o progresso — quando a câmera chega ao
            close, a cena tem mais luz e o texto precisa de mais apoio. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: "var(--layer-grade)",
            background:
              "linear-gradient(to bottom, rgb(10 9 8 / 0.75) 0%, transparent 32%, transparent 45%, rgb(10 9 8 / 0.88) 100%)",
            opacity: "calc(0.7 + var(--p) * 0.3)",
          }}
        />

        {/* Scrim lateral do lado da manchete — mesma correção aplicada aos
            capítulos, pela mesma falha medida: entre ~768 e ~1200 px o
            `concreto` tem o frasco centrado e a manchete o atravessa. O
            gradiente acima escurece a BASE, e a manchete vive na altura
            média. Escurecer só a coluna de leitura preserva o contraste
            original do lado do produto. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: "var(--layer-grade)",
            background: `linear-gradient(to right,
              rgb(10 9 8 / 0.66) 0%, rgb(10 9 8 / 0.32) 34%, transparent 58%)`,
            opacity: "calc(0.5 + var(--p) * 0.3)",
          }}
        />

        {/* Camada 4 — tipografia.
            A manchete existe no começo e cede lugar à medida que a câmera
            entra: o texto apresenta, a imagem sustenta. Sair por opacidade E
            por deslocamento vertical dá a leitura de que ela ficou para trás,
            e não de que apagou. */}
        <div
          className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-12 md:pb-28"
          style={{ zIndex: "var(--layer-type)" }}
        >
          <div
            style={{
              // clamp() faz o papel de "zerar fora do intervalo": a manchete
              // vive de 0 a 0,42 do progresso e some depois disso.
              opacity: "clamp(0, calc((0.42 - var(--p)) / 0.28), 1)",
              transform:
                "translate3d(0, calc(var(--p) * -3rem), 0) scale(calc(1 - var(--p) * 0.04))",
              transformOrigin: "left bottom",
              willChange: "transform, opacity",
            }}
          >
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
              {eyebrow}
            </p>
            <h1
              className="mt-5 max-w-3xl font-display font-light leading-[0.95]"
              style={{ fontSize: "var(--text-hero)" }}
            >
              {title}
            </h1>
            <p
              className="mt-6 max-w-md text-ink-muted"
              style={{ fontSize: "var(--text-lead)" }}
            >
              {lede}
            </p>
          </div>

          {/* A chamada é a última a sair e a primeira a voltar: e-commerce
              continua e-commerce (§27). Ela nunca desaparece por completo —
              o piso de 0,12 mantém o alvo presente e clicável. */}
          <div
            className="mt-9"
            style={{
              zIndex: "var(--layer-ui)",
              opacity: "clamp(0.12, calc((0.62 - var(--p)) / 0.3), 1)",
              transform: "translate3d(0, calc(var(--p) * -1.5rem), 0)",
              willChange: "transform, opacity",
            }}
          >
            <Link
              href={ctaHref}
              className="inline-flex h-12 items-center justify-center rounded-full bg-champagne px-8 font-sans text-sm font-medium text-void transition-colors hover:bg-[var(--metal-champagne-light)]"
              style={{ transitionDuration: "var(--motion-ui)" }}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>

        {/* Indicação de rolagem: some assim que a pessoa entende o gesto.
            Mantê-la depois disso seria instruir alguém que já sabe. */}
        {prefersReducedMotion ? null : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center"
            style={{
              zIndex: "var(--layer-ui)",
              opacity: "clamp(0, calc((0.12 - var(--p)) / 0.12), 1)",
            }}
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-ink-muted">
              role
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

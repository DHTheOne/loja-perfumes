"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { formatPriceBRL, startingPriceCents } from "@/catalog/lines";
import { usePrefersReducedMotion } from "@/cinema/usePrefersReducedMotion";
import { SceneTrait } from "@/showcase/SceneTrait";
import { buildScenes, type ShowcaseScene } from "@/showcase/sequence";

/**
 * Abertura da home: as seis cenas como UMA sequência, não como seis vídeos.
 *
 * O QUE ISTO SUBSTITUI. O `CinematicHero` amarrava um clipe à rolagem — a
 * pessoa tinha de rolar para a câmera andar. Aqui a página se apresenta
 * sozinha, e a rolagem serve para SAIR da apresentação, não para conduzi-la.
 *
 * ——— A emenda ———
 *
 * A versão anterior trocava de cena em `onEnded`, e é aí que estava o defeito
 * central: quando o `ended` dispara, o clipe que sai JÁ ACABOU e está parado
 * no último quadro durante o fade inteiro. Meia tela imóvel dissolvendo em
 * meia tela em movimento é o sinal mais alto possível de "acabou um vídeo" —
 * nenhuma curva de easing conserta isso. Aqui a troca dispara em
 * `timeupdate`, a `overlap` segundos do fim, e o clipe que sai CONTINUA
 * correndo por baixo até acabar sozinho. Os dois estão em movimento durante
 * toda a emenda.
 *
 * O segundo defeito era aritmético. Fazendo as duas camadas cruzarem opacidade
 * em direções opostas sobre o fundo, o composto no meio do caminho é
 * `0,5·entra + 0,25·sai + 0,25·fundo`: um quarto do fundo escuro vaza e a
 * imagem AFUNDA no meio de toda transição. Aqui só a camada de cima anima. A
 * de baixo fica em opacidade 1 até ser desmontada, e a composição vira
 * `α·entra + (1−α)·sai` — a conta de um dissolve óptico, sem perda de luz.
 *
 * O terceiro é o fantasma duplo, e é o que `sequence.ts` resolve: a camada que
 * entra chega com o enquadramento da que sai e relaxa até o próprio. O
 * transform dura mais que a opacidade (`SETTLE`), então o movimento continua
 * DEPOIS que o dissolve terminou — que é o que faz o olho ler câmera andando
 * em vez de corte.
 *
 * ——— Sem controles ———
 *
 * Nada de barra de progresso, botão de pausa visível ou controle de som: a
 * composição não é um player. O som saiu por inteiro porque os seis clipes são
 * codificados sem trilha de áudio — o botão não controlava nada. A pausa
 * continua existindo, invisível até receber foco de teclado: o WCAG 2.2 SC
 * 2.2.2 exige mecanismo de pausa para movimento automático acima de cinco
 * segundos, e a sequência tem cerca de quarenta.
 *
 * DOIS VÍDEOS MONTADOS, TRÊS NA EMENDA. Cada clipe pesa de 3 a 6 MB; montar os
 * seis na abertura seriam ~30 MB para ver a primeira tela. Em repouso ficam o
 * que toca e o próximo; durante a emenda, o anterior sobrevive o tempo do
 * dissolve e é desmontado.
 *
 * ——— O laço ———
 *
 * A sequência não termina: da sexta cena volta à primeira, e a volta é uma
 * emenda como as outras cinco, com entrada própria em `TRANSITIONS`. Se ela
 * fosse um corte seco, seria justamente ali que a pessoa perceberia que está
 * vendo um laço.
 *
 * QUEM ENCERRA É A ROLAGEM. Descer até o catálogo tira a seção da tela e o
 * `IntersectionObserver` para tudo — que é o único fim que esta abertura tem.
 * Subir de volta retoma de onde parou.
 *
 * Como não há mais um fim, não há mais o momento em que a chamada "Ver a
 * coleção" aparecia. O caminho para o catálogo é rolar, e cada cena continua
 * oferecendo o seu "Conhecer <perfume>".
 */

/**
 * O transform dura mais que a opacidade, nesta proporção.
 *
 * É o detalhe que separa "transição" de "movimento de câmera". Se os dois
 * terminassem juntos, o quadro assentaria no mesmo instante em que a imagem
 * antiga some, e o olho encontraria uma parada — que é a assinatura de um
 * corte. Terminando depois, a câmera ainda está andando quando o dissolve
 * acabou, e não há instante nenhum em que algo "chega".
 */
const SETTLE = 1.45;

/** Quando a cartela do perfume entra e sai, em fração da cena. */
const TRAIT_IN = 0.22;
const TRAIT_OUT = 0.76;

/**
 * "Já hidratou?", sem efeito e sem renderização em cascata.
 *
 * A forma óbvia — `useState(false)` mais um efeito que escreve `true` — é a
 * que o lint do projeto recusa (`react-hooks/set-state-in-effect`), e com
 * razão: são duas renderizações onde uma basta. `useSyncExternalStore` responde
 * a pergunta na própria leitura, porque tem um retorno para o servidor e outro
 * para o cliente. Assinatura vazia porque nada muda depois: hidratar acontece
 * uma vez e não volta atrás.
 */
const neverChanges = () => () => {};

function useHasMounted(): boolean {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

export function HomeShowcase() {
  const scenes = buildScenes();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [index, setIndex] = useState(0);
  /** A cena que ainda toca por baixo durante a emenda. */
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [traitVisible, setTraitVisible] = useState(false);
  /* A visibilidade é ESTADO, não comando. Quando o observador chamava
     `pause()` por conta própria, ele disputava os mesmos elementos com o
     efeito de reprodução — e um `pause()` que chega antes de a promessa do
     `play()` resolver a faz rejeitar. Guardando só o fato aqui, existe um
     único lugar no componente que decide o que toca. */
  const [isOnScreen, setIsOnScreen] = useState(true);
  /* Aba em segundo plano é o outro jeito de a reprodução parar, e o navegador
     a interrompe POR FORA do React: nenhuma dependência muda, então sem este
     sinal o efeito de reprodução nunca reavaliaria e voltar para a aba
     encontraria a apresentação congelada num quadro. */
  const [isPageVisible, setIsPageVisible] = useState(true);
  /* Sob movimento reduzido nada toca até a pessoa pedir. O estado começa
     falso e só o botão o levanta — nunca um efeito. */
  const [hasStarted, setHasStarted] = useState(false);
  /* O servidor não sabe a preferência de movimento: `usePrefersReducedMotion`
     devolve `true` no snapshot de servidor, que é o padrão prudente. A
     consequência é que o HTML inicial é sempre o estado "parado", e sem esta
     trava o botão de iniciar apareceria por um quadro para TODO visitante,
     antes de a hidratação descobrir que ele não pede movimento reduzido.
     Pior: sem JavaScript o botão ficaria na tela sem nada por trás. Com a
     trava, o que sai do servidor é a composição estática e mais nada — que é
     exatamente o que um visitante sem JavaScript deve ver. */
  const hasMounted = useHasMounted();

  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  /* `timeupdate` dispara ~4x/s e `ended` pode chegar depois: sem esta trava a
     mesma cena avançaria duas vezes e pularia a seguinte. */
  const advancedFrom = useRef(-1);

  const isActive = hasMounted && (!prefersReducedMotion || hasStarted);
  const scene = scenes[index];
  /* Circular: depois da última vem a primeira. É o que transforma a sequência
     em laço sem nenhum caso especial no resto do componente. */
  const nextIndex = scenes.length ? (index + 1) % scenes.length : 0;

  const registerVideo = useCallback(
    (position: number) => (node: HTMLVideoElement | null) => {
      if (node) videoRefs.current.set(position, node);
      else videoRefs.current.delete(position);
    },
    [],
  );

  const advance = useCallback(
    (from: number, to: number) => {
      /* A trava é contra o disparo DUPLO da mesma cena — `timeupdate` chega
         ~4x/s e `ended` pode chegar depois. Guardar a origem basta mesmo com
         o laço: duas emendas seguidas nunca partem da mesma cena, então
         voltar à cena 0 na segunda volta não fica bloqueado pela primeira. */
      if (advancedFrom.current === from) return;
      advancedFrom.current = from;
      setOutgoing(from);
      setIndex(to);
      /* A cartela sai ANTES da emenda começar, sempre. Deixá-la atravessar o
         dissolve a transformaria em elemento de interface — algo que persiste
         enquanto a imagem muda. Ela pertence ao plano, não à página. */
      setTraitVisible(false);
    },
    [],
  );

  /**
   * O relógio da cena: governa a cartela e dispara a emenda.
   *
   * O progresso é medido a partir do `inPoint`, não do zero. Uma cena que
   * corta a cabeça do plano (o travertino entra em 2,2s) tem menos tempo de
   * tela, e a cartela precisa caber no que sobrou.
   */
  const handleTimeUpdate = useCallback(() => {
    const video = videoRefs.current.get(index);
    const current = scenes[index];
    if (!video || !current) return;

    const total = Number.isFinite(video.duration)
      ? video.duration
      : current.clip.duration;
    const start = current.enter.inPoint;
    const span = total - start;
    const progress = span > 0 ? (video.currentTime - start) / span : 0;

    const shouldShow = progress >= TRAIT_IN && progress <= TRAIT_OUT;
    setTraitVisible((visible) =>
      visible === shouldShow ? visible : shouldShow,
    );

    const next = scenes[nextIndex];
    if (!next || next === current) return;
    if (video.currentTime >= total - next.enter.overlap) {
      advance(index, nextIndex);
    }
  }, [index, nextIndex, scenes, advance]);

  /* Rede de proteção. Em condição normal a emenda já começou bem antes; isto
     só age se o `timeupdate` tiver perdido a janela — aba em segundo plano,
     por exemplo, onde o navegador estrangula os eventos. */
  const handleEnded = useCallback(() => {
    advance(index, nextIndex);
  }, [advance, index, nextIndex]);

  /**
   * Trava o clipe no seu ponto de entrada.
   *
   * Roda na chegada dos metadados, e não no instante da emenda, para que o
   * elemento já esteja parado no quadro certo muito antes de ficar visível —
   * buscar durante o dissolve mostraria o quadro errado por um instante.
   *
   * Roda TAMBÉM a cada `play`, por causa do laço. Um vídeo que chegou ao fim
   * volta ao zero sozinho quando recebe `play()` de novo, e zero não é o ponto
   * de entrada de quem tem `inPoint` — o travertino reapareceria com 2,2s de
   * plano que a montagem descarta. Vem do evento, e não do mapa de refs, para
   * não escrever num nó que o React possui.
   */
  const applyInPoint = useCallback(
    (position: number) => (event: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = event.currentTarget;
      const inPoint = scenes[position]?.enter.inPoint ?? 0;
      if (inPoint > 0 && video.currentTime < inPoint) {
        video.currentTime = inPoint;
      }
    },
    [scenes],
  );

  /**
   * O único lugar que manda tocar ou parar.
   *
   * Tocam os DOIS envolvidos na emenda; todo o resto para, porque vídeo fora
   * de cena ainda ocupa decodificador.
   *
   * O TRATAMENTO DO ERRO É O DETALHE QUE IMPORTA. `play()` devolve uma
   * promessa que REJEITA quando um `pause()` chega antes de ela resolver — e
   * isso acontece o tempo todo aqui por construção: toda troca de cena e toda
   * saída da viewport pausam elementos que podem ter um `play()` em voo. Esse
   * caso vem como `AbortError` e é rotina. Tratá-lo como recusa de autoplay
   * derruba `isPlaying` e a apresentação para de vez, sem nada na tela
   * explicando por quê. Só `NotAllowedError` é recusa de verdade — aí o
   * poster segura a composição e o botão de retomar passa a fazer sentido.
   */
  useEffect(() => {
    if (!isActive) return;

    const running = isPlaying && isOnScreen && isPageVisible;
    for (const [position, node] of videoRefs.current) {
      const involved = position === index || position === outgoing;
      if (involved && running) {
        void node.play().catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "NotAllowedError") {
            setIsPlaying(false);
          }
        });
      } else {
        node.pause();
      }
    }
  }, [index, outgoing, isActive, isPlaying, isOnScreen, isPageVisible, scenes]);

  useEffect(() => {
    const sync = () => setIsPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  /* Desmonta a camada de baixo quando a de cima já está opaca. A folga cobre o
     assentamento do transform, que passa do fim do dissolve. */
  useEffect(() => {
    if (outgoing === null) return;
    const overlap = scenes[index]?.enter.overlap ?? 1.6;
    const timer = window.setTimeout(
      () => setOutgoing(null),
      overlap * SETTLE * 1000 + 120,
    );
    return () => window.clearTimeout(timer);
  }, [outgoing, index, scenes]);

  /* Fora da tela, nada toca. Quem rolou até o catálogo não deve continuar
     pagando decodificação de uma seção que já passou. O observador apenas
     REGISTRA o fato; quem age é o efeito acima. Depende só de `isActive`,
     então é montado uma vez e não se refaz a cada troca de cena. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !isActive) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isActive]);

  const togglePlay = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  const startShowcase = useCallback(() => {
    setHasStarted(true);
    setIsPlaying(true);
  }, []);

  if (!scene) return null;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="abertura-heading"
      className="relative h-[100svh] w-full overflow-hidden"
      style={{
        background: scene.art.ambient,
        transitionProperty: "background-color",
        transitionDuration: "var(--motion-cinematic)",
      }}
    >
      {/* ——— O H1 DA PÁGINA ———
          A home não tinha nenhum: o `CinematicHero`, que o carregava, saiu
          daqui, e a abertura entrou com um `h2`. Uma página com `h2` e sem
          `h1` deixa quem navega por títulos sem ponto de partida e o buscador
          sem manchete.

          Fica OCULTO À VISTA, e é uma escolha, não um esquecimento. A
          composição já tem uma manchete visual — o nome do perfume, grande, no
          canto inferior — mas ela TROCA a cada oito segundos. Um `h1` que muda
          de texto sozinho não é o título da página; é legenda. O `h1` precisa
          dizer o que a página é, de forma estável, e essa frase é a da casa,
          registrada em src/config/site.ts.

          É também o rótulo da seção (`aria-labelledby`), então serve às duas
          funções sem duplicar título nenhum. */}
      <h1 id="abertura-heading" className="sr-only">
        O que fica depois da presença
      </h1>

      {/* ——— Pausa ———
          Primeiro filho de propósito: quem navega por teclado encontra a pausa
          antes de qualquer outra coisa da seção. Invisível ao mouse, presente
          ao foco e ao leitor de tela — a exigência do SC 2.2.2 é que o
          mecanismo EXISTA e seja alcançável, não que ocupe a composição. */}
      {isActive ? (
        <button
          type="button"
          onClick={togglePlay}
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-24 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:rounded-full focus:border focus:border-champagne focus:bg-void/80 focus:px-5 focus:font-sans focus:text-sm focus:text-ink focus:backdrop-blur-sm md:focus:left-12"
        >
          {isPlaying ? "Pausar a apresentação" : "Retomar a apresentação"}
        </button>
      ) : null}

      {/* ——— Camada de mídia ———
          A pilha vem do PAPEL da camada, não da posição na lista. Enquanto a
          sequência era linear a ordem do DOM bastava — quem sai vem antes de
          quem entra. Com o laço deixa de bastar: na volta, a cena que entra é
          a de índice 0 e renderiza ANTES da que sai, o que a colocaria embaixo
          e faria a última emenda dissolver ao contrário. Três z-index
          resolvem, e não dependem de ordem nenhuma. */}
      {scenes.map((item, position) => {
        const isCurrent = position === index;
        const isOutgoing = position === outgoing;
        const isNext = position === nextIndex && !isCurrent;
        if (!isCurrent && !isOutgoing && !isNext) return null;

        const enter = item.enter;
        /* Só a camada que ainda não chegou usa o enquadramento emprestado. */
        const borrowed = isNext;

        return (
          <div
            key={item.clip.slug}
            aria-hidden="true"
            /* O papel da camada, legível de fora. Em repouso as camadas
               montadas são [atual, próxima] e durante a emenda [que sai,
               atual, próxima] — a posição no DOM sozinha não diz qual é qual,
               e quem observa de fora (teste, depuração) acabaria medindo a
               camada errada exatamente no instante mais interessante. */
            data-state={
              isCurrent ? "current" : isOutgoing ? "outgoing" : "next"
            }
            className="absolute inset-0"
            style={{
              zIndex: isCurrent
                ? "calc(var(--layer-media) + 1)"
                : isOutgoing
                  ? "var(--layer-media)"
                  : "calc(var(--layer-media) + 2)",
              opacity: borrowed ? 0 : 1,
              transform: borrowed
                ? `translate3d(${(enter.x * 100).toFixed(3)}%, ${(enter.y * 100).toFixed(3)}%, 0) scale(${enter.scale})`
                : "translate3d(0, 0, 0) scale(1)",
              /* Desfoque durante o primeiro terço, dosado pelo que a emenda
                 tem para esconder. Onde ela se apoia no objeto — o frasco no
                 mesmo lugar nas duas cenas — 2px bastam para o resíduo ler
                 como foco resolvendo. Onde ela se apoia em luz ou em forma, o
                 assunto MUDA de lugar através do corte, e é o desfoque somado
                 ao clarão que impede isso de ler como imagem dupla. */
              filter: borrowed
                ? enter.match === "objeto"
                  ? "blur(2px)"
                  : "blur(5px)"
                : "blur(0px)",
              transitionProperty: "opacity, transform, filter",
              transitionDuration: `${enter.overlap}s, ${enter.overlap * SETTLE}s, ${enter.overlap * 0.4}s`,
              transitionTimingFunction:
                "var(--ease-cinematic), var(--ease-enter), var(--ease-exit)",
              /* Promoção de camada só em quem está prestes a se mover ou está
                 se movendo. A cena em repouso não carrega memória de
                 compositor à toa. */
              willChange:
                isCurrent && outgoing === null
                  ? undefined
                  : "transform, opacity",
            }}
          >
            {/* O poster sai do servidor e fica sob o vídeo. É ele que impede a
                tela preta enquanto o arquivo decodifica — e é ele que resta se
                a decodificação falhar. */}
            <picture>
              <source
                media="(max-aspect-ratio: 3/4)"
                srcSet={item.clip.posterVertical}
                width={1080}
                height={1920}
              />
              {/* <img> dentro de <picture> é art direction — dois
                  enquadramentos compostos separadamente, não a mesma imagem em
                  duas escalas. É a exceção que o projeto já abre no hero. */}
              <img
                src={item.clip.poster}
                alt=""
                width={1920}
                height={1080}
                fetchPriority={position === 0 ? "high" : "low"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>

            {isActive ? (
              <video
                ref={registerVideo(position)}
                muted
                playsInline
                preload="auto"
                poster={item.clip.poster}
                onLoadedMetadata={applyInPoint(position)}
                onPlay={applyInPoint(position)}
                onTimeUpdate={isCurrent ? handleTimeUpdate : undefined}
                onEnded={isCurrent ? handleEnded : undefined}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source
                  src={item.clip.vertical}
                  type="video/mp4"
                  media="(max-aspect-ratio: 3/4)"
                />
                <source
                  src={item.clip.tablet}
                  type="video/mp4"
                  media="(max-width: 1279px)"
                />
                <source src={item.clip.desktop} type="video/mp4" />
              </video>
            ) : null}

            {/* ——— O clarão da emenda ———
                Vive DENTRO da camada que entra, e é isso que o faz funcionar
                sem uma única keyframe: a opacidade da camada sobe de 0 a 1
                enquanto a deste desce de 1 a 0, e o produto das duas —
                `α·(1−α)` — tem pico no meio do caminho, exatamente onde o
                fantasma duplo apareceria. Um dissolve óptico de verdade
                floresce no meio porque as altas-luzes das duas imagens se
                somam; aqui é a mesma coisa, e por isso `screen`.

                A cor sai do ambiente da cena que chega, clareada. É assim que
                o salto de temperatura do travertino para o concreto acontece
                DENTRO da luz, e não como uma virada de cor no meio da tela. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mix-blend-screen"
              style={{
                background: `radial-gradient(125% 95% at 50% 60%, color-mix(in oklab, ${item.art.ambient} 45%, var(--metal-champagne-light)) 0%, transparent 74%)`,
                opacity: borrowed ? 1 : 0,
                transitionProperty: "opacity",
                transitionDuration: `${enter.overlap * 0.85}s`,
                transitionTimingFunction: "var(--ease-exit)",
              }}
            />
          </div>
        );
      })}

      {/* ——— Tratamento de luz ———
          Três camadas, todas de composição pura (nenhuma toca layout):

          1. Âmbar de baixo para cima — a luz quente pedida sobre os frascos.
             Em `screen` para SOMAR luz onde a cena já tem brilho, em vez de
             lavar a imagem inteira com um véu laranja.
          2. Reflexo de vidro — faixa clara e fraquíssima na diagonal, também
             em `screen`. Sugere a aresta polida sem desenhar nada.
          3. Escurecimento vertical — o contraste do texto. Vem por último
             porque precisa vencer os dois anteriores na base do quadro. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          zIndex: "var(--layer-grade)",
          background:
            "radial-gradient(120% 80% at 50% 108%, rgb(198 183 143 / 0.30) 0%, rgb(198 183 143 / 0.10) 38%, transparent 68%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          zIndex: "var(--layer-grade)",
          background:
            "linear-gradient(108deg, transparent 34%, rgb(226 214 180 / 0.10) 47%, transparent 58%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: "var(--layer-grade)",
          background:
            "linear-gradient(to bottom, rgb(10 9 8 / 0.72) 0%, transparent 26%, rgb(10 9 8 / 0.45) 58%, rgb(10 9 8 / 0.94) 100%)",
        }}
      />

      {/* ——— Ficha da fragrância ———
          Troca junto com a cena. `aria-live` porque a mudança é automática:
          sem ela, quem usa leitor de tela ficaria no primeiro perfume enquanto
          a tela já mostra o quarto. `polite` não interrompe a leitura em
          curso. */}
      <div
        className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-6 pb-28 md:px-12 md:pb-24"
        style={{ zIndex: "var(--layer-type)" }}
      >
        <div aria-live="polite" aria-atomic="true">
          {/* A chave remonta o bloco a cada cena: é o que faz a ficha ENTRAR
              junto com a imagem, em vez de trocar as palavras no lugar. */}
          <ShowcaseCard key={scene.clip.slug} scene={scene} />
        </div>

      </div>

      {/* A característica do perfume em cena. Fora do `aria-live` acima de
          propósito: já é anunciada uma vez por cena junto da ficha, e repetir
          o anúncio ao aparecer e ao sumir seria ruído para quem ouve. */}
      <SceneTrait
        key={`trait-${scene.clip.slug}`}
        line={scene.line}
        visible={isActive && traitVisible}
      />

      {/* ——— Movimento reduzido ———
          Nada toca sozinho. A composição estática do primeiro clipe fica na
          tela e a apresentação só começa se a pessoa pedir. */}
      {hasMounted && !isActive ? (
        <div
          className="absolute inset-x-0 bottom-28 flex justify-center px-6"
          style={{ zIndex: "var(--layer-ui)" }}
        >
          <button
            type="button"
            onClick={startShowcase}
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 bg-void/70 px-8 font-sans text-sm text-ink backdrop-blur-sm transition-colors hover:border-champagne hover:text-champagne"
            style={{ transitionDuration: "var(--motion-ui)" }}
          >
            Iniciar a apresentação
          </button>
        </div>
      ) : null}
    </section>
  );
}

function ShowcaseCard({ scene }: { scene: ShowcaseScene }) {
  const { line } = scene;

  return (
    <div className="max-w-xl animate-rise">
      <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
        {line.familyLabel}
      </p>
      <p className="mt-4 font-display text-5xl font-light leading-[1.02] text-ink md:text-7xl">
        {line.name}
      </p>
      <p
        className="mt-5 max-w-md text-ink-muted"
        style={{ fontSize: "var(--text-lead)" }}
      >
        {line.tagline}
      </p>
      <p className="mt-4 font-sans text-sm text-champagne">
        A partir de {formatPriceBRL(startingPriceCents(line))}
      </p>
      <Link
        href={`/perfumes/${line.slug}`}
        className="mt-7 inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 font-sans text-sm text-ink transition-colors hover:border-champagne hover:text-champagne"
        style={{ transitionDuration: "var(--motion-ui)" }}
      >
        Conhecer {line.name}
      </Link>
    </div>
  );
}

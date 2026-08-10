"use client";

import { useEffect, type RefObject } from "react";

/**
 * Converte a posição de um elemento na rolagem em progresso de 0 a 1.
 *
 * O progresso NÃO vai para estado do React. Ele é entregue a um callback que
 * roda dentro do `requestAnimationFrame` — quem consome escreve direto no DOM
 * (custom property, `currentTime` do vídeo). Guardar em `useState` obrigaria
 * uma re-renderização da árvore a cada quadro, que é exatamente o que §22 da
 * especificação proíbe: a 60 fps isso são 60 reconciliações por segundo para
 * animar duas propriedades.
 *
 * O laço só existe enquanto o elemento está perto da viewport. Fora dela o
 * IntersectionObserver desliga tudo — sem `rAF` girando à toa, sem ouvinte de
 * rolagem, sem decodificação de vídeo em seção que ninguém está vendo (§21).
 *
 * A suavização (`smoothing`) resolve um problema concreto do scrub: roda de
 * mouse entrega saltos grandes e discretos, e aplicar o valor cru faz o vídeo
 * pular. Interpolar em direção ao alvo transforma o salto em movimento de
 * câmera.
 */

type ScrollTimelineOptions = {
  /**
   * Recebe o progresso suavizado (0–1) a cada quadro. Deve escrever no DOM,
   * nunca chamar `setState`.
   */
  onProgress: (progress: number) => void;
  /**
   * Fração do caminho até o alvo percorrida por quadro. 1 desliga a
   * suavização e aplica o valor cru.
   */
  smoothing?: number;
  /** Quando `false`, o laço não roda e `staticProgress` é aplicado uma vez. */
  enabled?: boolean;
  /**
   * Progresso aplicado quando o laço está desligado.
   *
   * O padrão é 0, o estado de ABERTURA. Parece contraintuitivo — o instinto é
   * aplicar 1, "o resultado final da animação" — mas numa cena cinematográfica
   * o quadro inicial é a composição autoral: manchete presente, produto
   * enquadrado. O progresso 1 é a câmera já tendo passado, com o texto fora de
   * cena. Aplicá-lo sob movimento reduzido entregaria a essa pessoa a sobra da
   * animação em vez da composição.
   */
  staticProgress?: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function useScrollTimeline(
  ref: RefObject<HTMLElement | null>,
  {
    onProgress,
    smoothing = 0.12,
    enabled = true,
    staticProgress = 0,
  }: ScrollTimelineOptions,
): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    /**
     * O alvo é a posição real; `current` é o que foi aplicado. A distância
     * entre os dois é o que a suavização consome.
     */
    let target = 0;
    let current = 0;
    let frame = 0;
    let isRunning = false;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      // Distância rolável: a altura do trilho menos uma tela. É o quanto o
      // elemento percorre entre encostar no topo e terminar de sair.
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return 0;
      return clamp01(-rect.top / travel);
    };

    if (!enabled) {
      onProgress(staticProgress);
      return;
    }

    const tick = () => {
      target = measure();
      current += (target - current) * smoothing;

      // Encosta no alvo quando a diferença deixa de ser perceptível, senão a
      // interpolação persegue o valor para sempre e o laço nunca descansa.
      if (Math.abs(target - current) < 0.0005) current = target;

      onProgress(current);
      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (isRunning) return;
      isRunning = true;
      // Primeira aplicação sem suavização: entrar na seção já no valor certo,
      // em vez de ver a animação correr do zero até a posição atual.
      current = measure();
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!isRunning) return;
      isRunning = false;
      window.cancelAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      // Margem generosa: o laço acorda antes de a seção aparecer, então o
      // primeiro quadro visível já está no estado correto.
      { rootMargin: "20% 0px 20% 0px" },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [ref, onProgress, smoothing, enabled, staticProgress]);
}

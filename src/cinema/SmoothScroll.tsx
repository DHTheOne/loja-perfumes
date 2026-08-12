"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Rolagem inercial.
 *
 * POR QUE UMA DEPENDÊNCIA AQUI, e só aqui. O resto da experiência
 * cinematográfica é escrito à mão justamente para não carregar biblioteca —
 * o scrub precisa de um laço `rAF` de qualquer forma e a coreografia sai de
 * custom property lida pelo CSS. Rolagem inercial é outro problema. A roda de
 * mouse entrega saltos discretos e grandes; suavizá-los à mão exige sequestrar
 * o evento de roda e reposicionar o conteúdo por transform, e é exatamente aí
 * que se quebram teclado, âncoras, histórico, barra de rolagem e leitor de
 * tela. Lenis mantém a rolagem NATIVA por baixo: ele interpola e escreve a
 * posição real do documento, então tudo que depende de `scrollTop` continua
 * verdadeiro. São ~3 KB gzip para não reimplementar (mal) essa parte.
 *
 * TOQUE FICA NATIVO (`syncTouch` não é ligado). iOS e Android já entregam
 * inércia própria, calibrada pelo sistema e com o rubber-band que a pessoa
 * espera. Sobrepor uma segunda inércia sobre aquela produz a sensação de
 * arrasto pesado que se reconhece de longe em site "suavizado". O ganho é de
 * roda de mouse e trackpad, que é onde o problema existe.
 *
 * ÂNCORAS SEGUEM INSTANTÂNEAS (a opção `anchors` fica desligada). O skip link
 * precisa CHEGAR, não viajar: quem navega por teclado pediu para pular o
 * cabeçalho, e animar esse salto é fazer a pessoa esperar por um efeito que
 * ela não pediu. O salto nativo move o foco e a posição de uma vez, e o Lenis
 * apenas se realinha depois.
 */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);

    let lenis: Lenis | null = null;
    let frame = 0;

    const start = () => {
      if (lenis) return;

      lenis = new Lenis({
        /* Tempo que a rolagem leva para assentar depois que a roda para. Abaixo
           de ~0,9 s o ganho sobre a rolagem nativa some; acima de ~1,3 s a
           página passa a responder com atraso perceptível ao comando. */
        duration: 1.1,
        /* Saída exponencial: quase toda a distância é vencida no começo e o
           fim é uma chegada longa. É o que lê como peso — a mesma razão de
           `--ease-cinematic` existir no design system. */
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        /* O laço é nosso (abaixo), para poder ser desligado junto com a
           instância quando o movimento reduzido entra. */
        autoRaf: false,
      });

      const tick = (time: number) => {
        lenis?.raf(time);
        frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!lenis) return;
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      lenis = null;
    };

    /* O gate é reativo, não uma leitura única na montagem: quem liga "reduzir
       movimento" no sistema com a página aberta deve ver a rolagem voltar ao
       nativo na hora, sem recarregar. */
    const sync = () => {
      if (query.matches) stop();
      else start();
    };

    sync();
    query.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}

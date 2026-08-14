"use client";

import { useSyncExternalStore } from "react";

/**
 * Preferência de movimento do sistema.
 *
 * Este módulo já foi a linha do tempo de rolagem que dirigia o hero e os
 * capítulos cinematográficos. Os dois saíram quando a abertura virou uma
 * sequência contínua, que anda sozinha em vez de ser conduzida pela rolagem,
 * e com eles saíram `useScrollTimeline` e `useArmWhenNear` — não havia mais
 * quem os chamasse, e o histórico do Git guarda os dois se voltarem a fazer
 * falta. Sobrou o que continua tendo dono.
 */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Preferência de movimento reduzido, reativa.
 *
 * No SERVIDOR assume-se `true`: o HTML sai na composição estática, sem vídeo.
 * Assumir o contrário faria o servidor emitir a marcação animada para todo
 * mundo, e quem pediu movimento reduzido veria a versão animada até a
 * hidratação corrigir — exatamente o instante em que a preferência mais
 * importa.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );
}

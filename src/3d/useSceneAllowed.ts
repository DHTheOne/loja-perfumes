"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { detectWebGL, isWeakDevice, readDeviceCapabilities } from "@/lib/device";

/**
 * Decide SE vale baixar e montar uma cena 3D neste cliente.
 *
 * A regra é a de ARCHITECTURE.md §9 e estava escrita dentro de `HeroVisual`.
 * Saiu para cá quando a página de produto passou a precisar da mesma decisão:
 * duas cópias divergiriam na primeira vez que um dos critérios mudasse, e o
 * critério aqui é justamente o que protege o site de quebrar sem WebGL.
 *
 * Devolve também `prefersReducedMotion` porque quem chama precisa reavaliar a
 * cada render: se a pessoa ligar "movimento reduzido" com a página aberta, a
 * cena tem de sair na hora, mesmo já tendo sido baixada.
 */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** No servidor assumimos movimento reduzido: o HTML sai com o fallback. */
function getReducedMotionServerSnapshot(): boolean {
  return true;
}

/**
 * Agenda o trabalho para quando a thread principal estiver ociosa — ou seja,
 * depois de o conteúdo principal ter pintado. É isso que tira o download do
 * three.js do caminho crítico do LCP, como pede ARCHITECTURE.md §9.
 *
 * O `timeout` garante que a cena não fique presa indefinidamente numa aba que
 * nunca fica ociosa; o `setTimeout` cobre navegadores sem requestIdleCallback
 * (Safari até versões recentes).
 */
function scheduleWhenIdle(run: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(run, { timeout: 2500 });
    return () => window.cancelIdleCallback(handle);
  }

  const handle = window.setTimeout(run, 400);
  return () => window.clearTimeout(handle);
}

export type SceneGate = {
  /** `true` quando a cena pode ser montada agora. */
  isSceneAllowed: boolean;
  prefersReducedMotion: boolean;
};

export function useSceneAllowed(): SceneGate {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!detectWebGL(document)) return;
    if (isWeakDevice(readDeviceCapabilities(navigator))) return;

    return scheduleWhenIdle(() => setIsAllowed(true));
  }, [prefersReducedMotion]);

  return {
    isSceneAllowed: isAllowed && !prefersReducedMotion,
    prefersReducedMotion,
  };
}

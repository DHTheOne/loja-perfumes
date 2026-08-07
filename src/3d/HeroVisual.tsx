"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

import { HeroFallback } from "@/3d/HeroFallback";
import { detectWebGL, isWeakDevice, readDeviceCapabilities } from "@/lib/device";
import type { LineKey } from "@/ui/tokens";

/**
 * Decide SE a cena 3D deve ser baixada e montada.
 *
 * A divisão de responsabilidade é: este componente resolve o carregamento
 * (vale a pena gastar o bundle e a GPU deste usuário?), e `HeroScene` resolve
 * a renderização (dado que fui montada, consigo desenhar?). Cada um mantém a
 * própria guarda, então nenhum caminho de entrada perde o fallback exigido
 * por ARCHITECTURE.md §9.
 *
 * `ssr: false` só é permitido em Client Component — por isso este arquivo
 * existe separado da home, que é Server Component
 * (node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md).
 */
const HeroScene = dynamic(
  () => import("@/3d/HeroScene").then((mod) => mod.HeroScene),
  { ssr: false, loading: () => <HeroFallback /> },
);

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

type HeroVisualProps = {
  lineKey?: LineKey;
};

export function HeroVisual({ lineKey }: HeroVisualProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const [isSceneAllowed, setIsSceneAllowed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!detectWebGL(document)) return;
    if (isWeakDevice(readDeviceCapabilities(navigator))) return;

    return scheduleWhenIdle(() => setIsSceneAllowed(true));
  }, [prefersReducedMotion]);

  // Reavaliado a cada render: se o usuário ligar "movimento reduzido" com a
  // página aberta, a cena sai imediatamente, mesmo já tendo sido baixada.
  if (!isSceneAllowed || prefersReducedMotion) {
    return <HeroFallback />;
  }

  return <HeroScene lineKey={lineKey} />;
}

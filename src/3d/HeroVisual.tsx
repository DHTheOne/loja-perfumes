"use client";

import dynamic from "next/dynamic";

import { HeroFallback } from "@/3d/HeroFallback";
import { useSceneAllowed } from "@/3d/useSceneAllowed";
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

type HeroVisualProps = {
  lineKey?: LineKey;
};

export function HeroVisual({ lineKey }: HeroVisualProps) {
  // O critério vive em `useSceneAllowed`, compartilhado com a página de
  // produto — inclusive a reavaliação a cada render, que tira a cena do ar na
  // hora se a pessoa ligar "movimento reduzido" com a página aberta.
  const { isSceneAllowed } = useSceneAllowed();

  if (!isSceneAllowed) {
    return <HeroFallback />;
  }

  return <HeroScene lineKey={lineKey} />;
}

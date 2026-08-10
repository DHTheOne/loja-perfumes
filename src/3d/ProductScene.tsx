"use client";

import { Suspense, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";

import { Bottle } from "@/3d/Bottle";
import { StudioEnvironment } from "@/3d/StudioEnvironment";
import { detectWebGL } from "@/lib/device";
import { surface, type LineKey } from "@/ui/tokens";

/**
 * Cena 3D da página de produto.
 *
 * Difere do hero na composição, não na luz: aqui o frasco é o assunto único,
 * então fica centrado, mais perto da câmera e num enquadramento retrato. No
 * hero ele está deslocado para a direita porque o terço esquerdo pertence à
 * manchete.
 *
 * Sem plano refletor: o piso do hero é um `MeshReflectorMaterial` de 1024,
 * um dos passes mais caros da cena. Numa página que já carrega a
 * cinematográfica em WebP, gastar isso de novo não se paga —
 * `ContactShadows` entrega o assentamento no chão por uma fração do custo.
 *
 * A guarda de WebGL é repetida aqui de propósito, como em `HeroScene`: a cena
 * precisa estar correta por si, independentemente de quem a monte.
 */

let webGLSupport: boolean | null = null;

function getWebGLSnapshot(): boolean {
  webGLSupport ??= detectWebGL(document);
  return webGLSupport;
}

function getWebGLServerSnapshot(): boolean {
  return false;
}

function subscribeNever(): () => void {
  return () => {};
}

type ProductSceneProps = {
  lineKey: LineKey;
};

export function ProductScene({ lineKey }: ProductSceneProps) {
  const hasWebGL = useSyncExternalStore(
    subscribeNever,
    getWebGLSnapshot,
    getWebGLServerSnapshot,
  );

  if (!hasWebGL) return null;

  return (
    <Canvas
      camera={{ position: [0, 0.15, 3.4], fov: 32 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      /* Preenche a caixa por fluxo, em vez de `absolute inset-0`.
         Aninhado em dois contêineres absolutos, o react-three-fiber media 0 na
         montagem e trava o canvas em 300x150 — verificado no navegador. O
         posicionamento absoluto fica no contêiner de ProductVisual, que é
         quem precisa dele; aqui basta ocupar 100%. */
      className="!h-full !w-full"
    >
      {/* Fundo opaco na cor do cartão. Com alfa, a fotografia por baixo
          aparecia através do canvas e os dois frascos se sobrepunham. */}
      <color attach="background" args={[surface.raised]} />

      <Suspense fallback={null}>
        <StudioEnvironment />

        <group position={[0, -0.28, 0]}>
          <Bottle lineKey={lineKey} />

          {/* Sombra de contato: assenta o frasco sem plano refletor. */}
          <ContactShadows
            position={[0, -0.56, 0]}
            opacity={0.55}
            scale={4}
            blur={2.6}
            far={1.4}
            resolution={256}
            color="#000000"
          />
        </group>
      </Suspense>
    </Canvas>
  );
}

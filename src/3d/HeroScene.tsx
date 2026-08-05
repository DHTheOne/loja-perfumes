"use client";

import { Suspense, useSyncExternalStore } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
} from "@react-three/drei";

import { Bottle } from "@/3d/Bottle";
import { lighting, surface, type LineKey } from "@/ui/tokens";

/**
 * Cena 3D do hero, com fallback estático obrigatório.
 *
 * Requisito de ARCHITECTURE.md §9: a loja funciona integralmente sem WebGL e
 * com `prefers-reduced-motion`. A cena nunca bloqueia o conteúdo principal.
 *
 * O mapa de ambiente é gerado por Lightformers dentro da própria cena, sem
 * arquivo HDR externo. Isso mantém a página funcional offline e evita uma
 * exceção de CSP para domínio de terceiro (SECURITY_PLAN.md §9).
 */

/** Detecta suporte a WebGL sem manter o contexto de teste vivo. */
function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * O suporte a WebGL não muda durante a vida da página, então a detecção é
 * feita uma única vez e memoizada no módulo. `useSyncExternalStore` exige que
 * `getSnapshot` devolva sempre o mesmo valor enquanto nada mudar — recalcular
 * a cada chamada criaria um laço de renderização.
 */
let webGLSupport: boolean | null = null;

function getWebGLSnapshot(): boolean {
  webGLSupport ??= detectWebGL();
  return webGLSupport;
}

/** No servidor não há WebGL: renderiza o fallback e troca após a hidratação. */
function getWebGLServerSnapshot(): boolean {
  return false;
}

function subscribeNever(): () => void {
  return () => {};
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

function StaticFallback() {
  return (
    <Image
      src="/media/hero/hero-desktop.jpg"
      alt="Frasco de perfume em vidro transparente com tampa metálica champanhe, sobre superfície escura polida"
      fill
      priority
      sizes="100vw"
      className="object-cover object-right"
    />
  );
}

type HeroSceneProps = {
  lineKey?: LineKey;
};

export function HeroScene({ lineKey = "comumRaro" }: HeroSceneProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const hasWebGL = useSyncExternalStore(
    subscribeNever,
    getWebGLSnapshot,
    getWebGLServerSnapshot,
  );

  if (!hasWebGL) {
    return <StaticFallback />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0.35, 5.6], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <color attach="background" args={[surface.void]} />
      <fog attach="fog" args={[surface.void, 4.5, 9]} />

      <ambientLight intensity={lighting.ambientIntensity} />

      {/* Key: softbox grande à esquerda, 45° — como no frasco mestre. */}
      <directionalLight
        position={[-3.2, 2.6, 2.4]}
        intensity={lighting.keyIntensity}
        color="#fff4e2"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Rim: define a aresta direita do vidro contra o fundo escuro. */}
      <directionalLight
        position={[3.4, 1.4, -2.2]}
        intensity={lighting.rimIntensity}
        color="#ffd9a8"
      />
      <directionalLight
        position={[0, -1.5, 1.5]}
        intensity={lighting.fillIntensity}
        color="#8fa6c4"
      />

      <Suspense fallback={null}>
        {/* Ambiente procedural: dá ao vidro algo para refletir sem HDR externo. */}
        <Environment resolution={256}>
          {/* Vidro transparente sobre fundo escuro só é legível pelas arestas.
              Estes formers existem para o vidro ter o que refletir — sem eles
              o frasco some no preto. */}
          <Lightformer
            form="rect"
            intensity={3.2}
            position={[-2.5, 1.5, 2]}
            scale={[5, 7, 1]}
            color="#fff2dd"
          />
          <Lightformer
            form="rect"
            intensity={2.4}
            position={[3.5, 1, -1.5]}
            scale={[4, 6, 1]}
            color="#ffc98a"
          />
          <Lightformer
            form="rect"
            intensity={1.6}
            position={[2.2, -0.6, 2.5]}
            scale={[2, 3, 1]}
            color="#ffe6c2"
          />
          <Lightformer
            form="ring"
            intensity={0.8}
            position={[0, 3, 1]}
            scale={3}
            color="#c8d4e0"
          />
        </Environment>

        <group position={[0, -0.15, 0]}>
          {/* Frasco deslocado para a direita: o terço esquerdo fica livre para
              a manchete, como no hero de referência do lote 01. */}
          <group position={[1.35, 0, 0]} scale={0.78}>
            <Bottle lineKey={lineKey} isStatic={prefersReducedMotion} />
          </group>

          {/* Superfície polida — o reflexo sob o frasco é metade da leitura
              de "premium" nas imagens de referência. */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.54, 0]}>
            <planeGeometry args={[16, 16]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={1024}
              mixBlur={1}
              mixStrength={28}
              roughness={0.85}
              depthScale={1.1}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.3}
              color={surface.slate}
              metalness={0.55}
              mirror={0}
            />
          </mesh>
        </group>
      </Suspense>
    </Canvas>
  );
}

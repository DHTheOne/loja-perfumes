"use client";

import { Environment, Lightformer } from "@react-three/drei";

import { lighting } from "@/ui/tokens";

/**
 * Iluminação de estúdio do frasco mestre — key grande à esquerda a 45°, rim
 * atrás à direita, fill frio por baixo, e um mapa de ambiente procedural.
 *
 * Vive num componente próprio porque hero e página de produto precisam da
 * mesma luz em composições diferentes. Duplicar os quatro Lightformers faria
 * as duas telas divergirem na primeira calibragem.
 *
 * O mapa é gerado por Lightformers dentro da própria cena, sem arquivo HDR
 * externo: mantém a página funcional offline e evita uma exceção de CSP para
 * domínio de terceiro (SECURITY_PLAN.md §9).
 */
export function StudioEnvironment() {
  return (
    <>
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

      {/* Vidro transparente sobre fundo escuro só é legível pelas arestas.
          Estes formers existem para o vidro ter o que refletir — sem eles o
          frasco some no preto. */}
      <Environment resolution={256}>
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
    </>
  );
}

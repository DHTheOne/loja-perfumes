"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import type { Group } from "three";

import { line, metal, type LineKey } from "@/ui/tokens";

/**
 * Frasco procedural, modelado a partir de `_master-bottle.png`.
 *
 * Por que procedural e não um GLB: a forma é geométrica simples — prisma
 * retangular chanfrado, colar e tampa cilíndrica. Em código ela custa alguns
 * KB e permite trocar a cor do vidro por linha sem gerar um asset por SKU.
 * Um GLB equivalente passaria de vários MB e prejudicaria o LCP.
 *
 * As imagens do lote 01 servem de referência de proporção e de iluminação,
 * não como textura — ver docs/media/ANALISE-LOTE-01.md.
 */

/** Proporções medidas no frasco mestre, em unidades de cena. */
const BODY = { width: 1, height: 1.05, depth: 0.42, radius: 0.05 } as const;
const COLLAR = { radius: 0.15, height: 0.09 } as const;
const CAP = { radius: 0.2, height: 0.3 } as const;

const BODY_TOP = BODY.height / 2;
const COLLAR_Y = BODY_TOP + COLLAR.height / 2;
const CAP_Y = BODY_TOP + COLLAR.height + CAP.height / 2;

type BottleProps = {
  /** Família olfativa — define a cor do vidro. Ver MEDIA_PLAN.md §5. */
  lineKey?: LineKey;
};

/**
 * Não há prop para desligar a rotação: `prefers-reduced-motion` é resolvido
 * em `HeroScene`, que devolve o fallback estático antes de montar o Canvas.
 * Parar a rotação aqui não pouparia nada — o frameloop do r3f continuaria
 * renderizando o vidro e o reflexo a cada frame.
 */
export function Bottle({ lineKey = "comumRaro" }: BottleProps) {
  const groupRef = useRef<Group>(null);
  const glassColor = line[lineKey];

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Órbita lenta e contínua, sem corte — mesma linguagem de movimento
    // dos vídeos de referência. delta mantém a velocidade independente do FPS.
    group.rotation.y += delta * 0.18;

    // Flutuação quase imperceptível, só para o objeto não parecer colado.
    group.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.015;
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Corpo em vidro. A transmissão faz a refração; a espessura controla
          quanto o fundo distorce ao atravessar o vidro. */}
      <RoundedBox
        args={[BODY.width, BODY.height, BODY.depth]}
        radius={BODY.radius}
        smoothness={8}
        castShadow
      >
        {/* `color` branco mantém o vidro incolor; a cor da linha entra por
            atenuação, que é como vidro tingido se comporta de verdade — a cor
            se acumula com a distância percorrida dentro do material, em vez de
            pintar a superfície e deixá-la leitosa. */}
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.32}
          ior={1.5}
          roughness={0.04}
          chromaticAberration={0.06}
          anisotropicBlur={0.04}
          distortion={0.02}
          distortionScale={0.2}
          temporalDistortion={0}
          color="#ffffff"
          attenuationColor={glassColor}
          attenuationDistance={1.8}
          samples={8}
          resolution={512}
        />
      </RoundedBox>

      {/* Colar metálico entre o ombro e a tampa. Dois anéis, como no mestre. */}
      <mesh position={[0, COLLAR_Y, 0]} castShadow>
        <cylinderGeometry
          args={[COLLAR.radius, COLLAR.radius, COLLAR.height, 48]}
        />
        <meshStandardMaterial
          color={metal.champagne}
          metalness={1}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, COLLAR_Y + COLLAR.height * 0.45, 0]} castShadow>
        <cylinderGeometry
          args={[COLLAR.radius * 1.08, COLLAR.radius * 1.08, 0.022, 48]}
        />
        <meshStandardMaterial
          color={metal.champagneLight}
          metalness={1}
          roughness={0.18}
        />
      </mesh>

      {/* Tampa cilíndrica em metal escovado. A rugosidade mais alta que a do
          colar é o que dá a leitura de "escovado" em vez de "polido". */}
      <mesh position={[0, CAP_Y, 0]} castShadow>
        <cylinderGeometry args={[CAP.radius, CAP.radius, CAP.height, 64]} />
        <meshStandardMaterial
          color={metal.champagne}
          metalness={1}
          roughness={0.32}
        />
      </mesh>

      {/* Chanfro superior da tampa — capta o realce especular. */}
      <mesh position={[0, CAP_Y + CAP.height / 2 - 0.008, 0]}>
        <cylinderGeometry args={[CAP.radius * 0.94, CAP.radius, 0.016, 64]} />
        <meshStandardMaterial
          color={metal.champagneLight}
          metalness={1}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

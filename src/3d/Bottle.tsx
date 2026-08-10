"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import type { Group, Mesh } from "three";

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

/**
 * Espessura da parede de vidro.
 *
 * É ela que transforma o corpo em casca. Um frasco de perfume real tem vidro
 * grosso — 4 a 6 mm num corpo de 10 cm. 0,055 em unidades de cena mantém essa
 * razão e é o que dá a aresta dupla que se vê nas cinematográficas: a luz
 * atravessa parede, cavidade e parede de novo, em vez de um bloco maciço.
 */
const WALL = 0.055;

const CAVITY = {
  width: BODY.width - WALL * 2,
  height: BODY.height - WALL * 2,
  depth: BODY.depth - WALL * 2,
  radius: Math.max(BODY.radius - WALL / 2, 0.01),
} as const;

/** Fração da cavidade ocupada pelo perfume. */
const FILL = 0.62;

const LIQUID_HEIGHT = CAVITY.height * FILL;
/** Assenta o líquido no fundo da cavidade, não no centro do corpo. */
const LIQUID_Y = -CAVITY.height / 2 + LIQUID_HEIGHT / 2;

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
  const liquidRef = useRef<Mesh>(null);
  const glassColor = line[lineKey];

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const t = state.clock.elapsedTime;

    // Órbita lenta e contínua, sem corte — mesma linguagem de movimento
    // dos vídeos de referência. delta mantém a velocidade independente do FPS.
    group.rotation.y += delta * 0.18;

    // Flutuação quase imperceptível, só para o objeto não parecer colado.
    const bob = Math.sin(t * 0.6);
    group.position.y = bob * 0.015;

    // Inclinação mínima acompanhando a subida e a descida. Corpo rígido que
    // sobe e desce sem nenhuma variação de eixo lê como elevador, não como
    // objeto flutuando.
    group.rotation.z = Math.sin(t * 0.42) * 0.012;

    // O líquido responde ao movimento do frasco em contrafase: a superfície
    // de um líquido tende a se manter na horizontal enquanto o recipiente
    // inclina. Sem isto o perfume parece gelatina presa ao vidro.
    const liquid = liquidRef.current;
    if (liquid) {
      liquid.rotation.z = -group.rotation.z * 0.65;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Parede externa do vidro.
          `thickness` agora vale a parede (0,055), não a profundidade inteira
          do corpo (0,32). Era isso que fazia o frasco refratar como um bloco
          maciço: a luz atravessava 32 cm de vidro imaginário. */}
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
        {/* `color` branco mantém o vidro incolor; a cor da linha entra por
            atenuação, que é como vidro tingido se comporta de verdade — a cor
            se acumula com a distância percorrida dentro do material, em vez de
            pintar a superfície e deixá-la leitosa.

            `backside` é o que dá a casca. O material renderiza primeiro as
            faces de trás e só depois as da frente, então a luz é refratada
            duas vezes: ao entrar e ao sair. É a forma suportada de simular
            interior — empilhar um segundo mesh de transmissão dentro do
            primeiro não funciona, porque cada MeshTransmissionMaterial
            desenha a cena num buffer que exclui a si mesmo e os dois se
            ignoram, achatando o resultado. */}
        <MeshTransmissionMaterial
          transmission={1}
          thickness={WALL}
          backside
          backsideThickness={CAVITY.depth}
          backsideResolution={256}
          ior={1.5}
          roughness={0.04}
          chromaticAberration={0.06}
          anisotropicBlur={0.04}
          distortion={0.02}
          distortionScale={0.2}
          temporalDistortion={0}
          color="#ffffff"
          attenuationColor={glassColor}
          /* Distância longa deixa a parede praticamente incolor. Quem carrega
             a cor da linha passou a ser o líquido, como nas cinematográficas:
             o vidro é claro e o conteúdo é que tinge. Com a parede tingida, o
             frasco lia como bloco monolítico de vidro colorido e o menisco
             desaparecia. */
          attenuationDistance={5.5}
          /* Reflexo do ambiente acima do padrão: são as arestas que
             descrevem a forma de um objeto transparente. Sem realce elas
             somem no fundo e o frasco vira mancha — a leitura de "superficial"
             que o proprietário apontou. */
          envMapIntensity={1.6}
          samples={6}
          resolution={512}
        />
      </RoundedBox>

      {/* Perfume.
          O menisco — a linha onde o líquido encontra o vidro — é o sinal mais
          forte de que existe cavidade: é ele que separa "vidro tingido" de
          "frasco com conteúdo". Material físico comum, não de transmissão,
          justamente para não disputar o buffer com a parede (ver acima). */}
      <RoundedBox
        ref={liquidRef}
        args={[CAVITY.width * 0.99, LIQUID_HEIGHT, CAVITY.depth * 0.99]}
        radius={CAVITY.radius}
        smoothness={4}
        position={[0, LIQUID_Y, 0]}
      >
        {/* Líquido é superfície lisa e molhada: rugosidade quase nula mais
            clearcoat. A versão anterior (roughness 0,14, cor cheia, canto
            vivo de boxGeometry) lia como bloco de gesso — apontado pelo
            proprietário em captura de tela. A cor entra por atenuação, que
            escurece com a profundidade como líquido real; a superfície em si
            é incolor. Um perfume claro fica límpido — e é o backdrop atrás
            do frasco (HeroScene) que o torna visível, não a cor chapada. */}
        {/* Transmissão total, sem clearcoat.
            A parede transmite o fundo e fica escura; o líquido, difuso,
            devolvia branco — dois modelos incoerentes na mesma peça, e daí a
            leitura de bloco de leite apontada pelo proprietário. Líquido é
            meio transmissivo como o vidro, apenas mais absorvente: mesma
            física, atenuação curta. O clearcoat saiu porque acrescentava um
            verniz especular branco por cima justamente do que precisava
            ficar límpido.

            A distância curta (0,22 contra 5,5 da parede) é o que distingue
            os dois: a mesma luz atravessa a parede quase intacta e sai
            tingida e mais escura ao cruzar o perfume. É isso que desenha o
            menisco, sem precisar pintá-lo. */}
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          thickness={CAVITY.depth}
          ior={1.36}
          roughness={0.02}
          metalness={0}
          attenuationColor={glassColor}
          attenuationDistance={0.22}
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

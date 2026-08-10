import { CLIPS, type CinemaClip, type ClipSlug } from "@/cinema/clips.generated";

export type { CinemaClip, ClipSlug };

/**
 * Acesso aos clipes cinematográficos.
 *
 * Mesma separação de `lineMedia.ts`: o manifesto é gerado e a camada de acesso
 * é escrita à mão. Quem consome importa daqui, então trocar o transporte da
 * mídia — de `public/` para um bucket na Fase 5 — é uma mudança de um arquivo.
 */
export function clip(slug: ClipSlug): CinemaClip {
  return CLIPS[slug];
}

/**
 * Direção de arte por clipe.
 *
 * A cor de ambiente é a dominante da cena, amostrada do poster. Ela pinta o
 * fundo ANTES de o vídeo decodificar: sem isso o hero abre num retângulo preto
 * e o primeiro quadro entra como um salto de luminosidade. Com ela, o vídeo
 * aparece dentro de um ambiente que já tem a temperatura certa.
 *
 * `bias` diz de que lado do quadro o frasco está, para a tipografia ocupar o
 * lado oposto em vez de disputar espaço com o produto (§10, espaço negativo).
 */
export type ClipArtDirection = {
  ambient: string;
  bias: "center" | "left" | "right";
};

export const ART_DIRECTION: Record<ClipSlug, ClipArtDirection> = {
  // Concreto brutalista, cinza-azulado frio, feixe diagonal de luz.
  concreto: { ambient: "#2b3238", bias: "center" },
  // Salão colunado, luz de janela quente atravessando névoa.
  "salao-luz": { ambient: "#1b1712", bias: "center" },
  // Parede ocre com sombra de caixilho, laje de pedra escura.
  "pedra-vapor": { ambient: "#241a12", bias: "center" },
  // Galeria fria com monólitos; vira quente nos closes.
  galeria: { ambient: "#20242a", bias: "center" },
  // Travertino e bronze — o mais quente e o mais estático do conjunto.
  travertino: { ambient: "#2e1f14", bias: "right" },
  // Pedestal com coluna vertical de luz e névoa âmbar densa.
  "pedestal-ambar": { ambient: "#301d0e", bias: "center" },
};

export function artDirection(slug: ClipSlug): ClipArtDirection {
  return ART_DIRECTION[slug];
}

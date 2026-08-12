/**
 * GERADO POR scripts/build-cinema-media.mjs — NÃO EDITE À MÃO.
 *
 * Rode `npm run media:cinema` após trocar qualquer master em
 * docs/media/source/cinema/.
 */

export type CinemaClip = {
  slug: string;
  /** Duração em segundos. O scrub mapeia o progresso da rolagem nela. */
  duration: number;
  desktop: string;
  /** Mesma composição 16:9, arquivo menor — telas médias. */
  tablet: string;
  /** Composição 9:16 própria: faixa nítida no alto, extensão desfocada. */
  vertical: string;
  /** Primeiro quadro — a composição estática que precede qualquer animação. */
  poster: string;
  posterVertical: string;
  /** Último quadro — ponto de continuidade com a seção seguinte. */
  tail: string;
  /** O mesmo último quadro em 9:16 — a continuidade vista em retrato. */
  tailVertical: string;
};

export const CLIPS = {
  "salao-luz": {
    slug: "salao-luz",
    duration: 8,
    desktop: "/media/cinema/salao-luz-1080.mp4",
    tablet: "/media/cinema/salao-luz-720.mp4",
    vertical: "/media/cinema/salao-luz-vertical.mp4",
    poster: "/media/cinema/salao-luz-poster.jpg",
    posterVertical: "/media/cinema/salao-luz-poster-vertical.jpg",
    tail: "/media/cinema/salao-luz-tail.jpg",
    tailVertical: "/media/cinema/salao-luz-tail-vertical.jpg",
  },
  "pedra-vapor": {
    slug: "pedra-vapor",
    duration: 8,
    desktop: "/media/cinema/pedra-vapor-1080.mp4",
    tablet: "/media/cinema/pedra-vapor-720.mp4",
    vertical: "/media/cinema/pedra-vapor-vertical.mp4",
    poster: "/media/cinema/pedra-vapor-poster.jpg",
    posterVertical: "/media/cinema/pedra-vapor-poster-vertical.jpg",
    tail: "/media/cinema/pedra-vapor-tail.jpg",
    tailVertical: "/media/cinema/pedra-vapor-tail-vertical.jpg",
  },
  "concreto": {
    slug: "concreto",
    duration: 8,
    desktop: "/media/cinema/concreto-1080.mp4",
    tablet: "/media/cinema/concreto-720.mp4",
    vertical: "/media/cinema/concreto-vertical.mp4",
    poster: "/media/cinema/concreto-poster.jpg",
    posterVertical: "/media/cinema/concreto-poster-vertical.jpg",
    tail: "/media/cinema/concreto-tail.jpg",
    tailVertical: "/media/cinema/concreto-tail-vertical.jpg",
  },
  "galeria": {
    slug: "galeria",
    duration: 8,
    desktop: "/media/cinema/galeria-1080.mp4",
    tablet: "/media/cinema/galeria-720.mp4",
    vertical: "/media/cinema/galeria-vertical.mp4",
    poster: "/media/cinema/galeria-poster.jpg",
    posterVertical: "/media/cinema/galeria-poster-vertical.jpg",
    tail: "/media/cinema/galeria-tail.jpg",
    tailVertical: "/media/cinema/galeria-tail-vertical.jpg",
  },
  "travertino": {
    slug: "travertino",
    duration: 8,
    desktop: "/media/cinema/travertino-1080.mp4",
    tablet: "/media/cinema/travertino-720.mp4",
    vertical: "/media/cinema/travertino-vertical.mp4",
    poster: "/media/cinema/travertino-poster.jpg",
    posterVertical: "/media/cinema/travertino-poster-vertical.jpg",
    tail: "/media/cinema/travertino-tail.jpg",
    tailVertical: "/media/cinema/travertino-tail-vertical.jpg",
  },
  "pedestal-ambar": {
    slug: "pedestal-ambar",
    duration: 8,
    desktop: "/media/cinema/pedestal-ambar-1080.mp4",
    tablet: "/media/cinema/pedestal-ambar-720.mp4",
    vertical: "/media/cinema/pedestal-ambar-vertical.mp4",
    poster: "/media/cinema/pedestal-ambar-poster.jpg",
    posterVertical: "/media/cinema/pedestal-ambar-poster-vertical.jpg",
    tail: "/media/cinema/pedestal-ambar-tail.jpg",
    tailVertical: "/media/cinema/pedestal-ambar-tail-vertical.jpg",
  },
} as const satisfies Record<string, CinemaClip>;

export type ClipSlug = keyof typeof CLIPS;

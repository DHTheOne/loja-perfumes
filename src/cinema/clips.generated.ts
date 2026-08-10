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
  mobile: string;
  /** Primeiro quadro — a composição estática que precede qualquer animação. */
  poster: string;
  /** Último quadro — ponto de continuidade com a seção seguinte. */
  tail: string;
};

export const CLIPS = {
  "salao-luz": {
    slug: "salao-luz",
    duration: 8,
    desktop: "/media/cinema/salao-luz-1080.mp4",
    mobile: "/media/cinema/salao-luz-720.mp4",
    poster: "/media/cinema/salao-luz-poster.jpg",
    tail: "/media/cinema/salao-luz-tail.jpg",
  },
  "pedra-vapor": {
    slug: "pedra-vapor",
    duration: 8,
    desktop: "/media/cinema/pedra-vapor-1080.mp4",
    mobile: "/media/cinema/pedra-vapor-720.mp4",
    poster: "/media/cinema/pedra-vapor-poster.jpg",
    tail: "/media/cinema/pedra-vapor-tail.jpg",
  },
  "concreto": {
    slug: "concreto",
    duration: 8,
    desktop: "/media/cinema/concreto-1080.mp4",
    mobile: "/media/cinema/concreto-720.mp4",
    poster: "/media/cinema/concreto-poster.jpg",
    tail: "/media/cinema/concreto-tail.jpg",
  },
  "galeria": {
    slug: "galeria",
    duration: 8,
    desktop: "/media/cinema/galeria-1080.mp4",
    mobile: "/media/cinema/galeria-720.mp4",
    poster: "/media/cinema/galeria-poster.jpg",
    tail: "/media/cinema/galeria-tail.jpg",
  },
  "travertino": {
    slug: "travertino",
    duration: 8,
    desktop: "/media/cinema/travertino-1080.mp4",
    mobile: "/media/cinema/travertino-720.mp4",
    poster: "/media/cinema/travertino-poster.jpg",
    tail: "/media/cinema/travertino-tail.jpg",
  },
  "pedestal-ambar": {
    slug: "pedestal-ambar",
    duration: 8,
    desktop: "/media/cinema/pedestal-ambar-1080.mp4",
    mobile: "/media/cinema/pedestal-ambar-720.mp4",
    poster: "/media/cinema/pedestal-ambar-poster.jpg",
    tail: "/media/cinema/pedestal-ambar-tail.jpg",
  },
} as const satisfies Record<string, CinemaClip>;

export type ClipSlug = keyof typeof CLIPS;

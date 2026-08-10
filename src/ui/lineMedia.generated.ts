/**
 * GERADO POR scripts/build-line-media.mjs — NÃO EDITE À MÃO.
 *
 * Dimensões reais e placeholder de cada cinematográfica servida em
 * public/media/lines/. Rode `npm run media:lines` após trocar qualquer
 * imagem de origem.
 */

export type LineMediaEntry = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export const LINE_MEDIA = {
  "lenho-vigil": {
    src: "/media/lines/lenho-vigil.webp",
    width: 1600,
    height: 900,
    blurDataURL:
      "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAQCdASoQAAkAA4BaJQBOgCG+Bqm/+gAA/vSsALMyIfrHMkH8g+5QzWj6qbWO4ADSYiHWNqEcChekATz6JAAA",
  },
  "alba-citrica": {
    src: "/media/lines/alba-citrica.webp",
    width: 1600,
    height: 900,
    blurDataURL:
      "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADQAQCdASoQAAkAA4BaJZQCdAC3h7sHAAD+7exobv91MYNW5fBv/MKkQLd2yjQqL1ayT94kAAA=",
  },
  "mare-clara": {
    src: "/media/lines/mare-clara.webp",
    width: 1600,
    height: 900,
    blurDataURL:
      "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAQCdASoQAAkAA4BaJQBOgB3tiMjoAAD+6VM2DOrVoJAQZdcMfEIrvPZbAHocTZf1ALi7NSSdljE4hncFwSQA",
  },
  "noturno-absoluto": {
    src: "/media/lines/noturno-absoluto.webp",
    width: 1600,
    height: 900,
    blurDataURL:
      "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAACwAQCdASoQAAkAA4BaJZwCw7EMLo64AP73l6asUa+1r0dfFn9E6iASpqQbOTI8MkgAAA==",
  },
  "flora-velada": {
    src: "/media/lines/flora-velada.webp",
    width: 1600,
    height: 900,
    blurDataURL:
      "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADQAQCdASoQAAkAA4BaJYwCdADwRIkyAAD+9xFrZmrewS4DZxGrKX3y0NGpZgEZFn0L42IAAAA=",
  },
  "ambar-secreto": {
    src: "/media/lines/ambar-secreto.webp",
    width: 1600,
    height: 900,
    blurDataURL:
      "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAQCdASoQAAkAA4BaJZgCdAENahT7gAD+6aw9423gc1yDHx2iTbc/l/U7WRLGENdAvW5sWBGiZstXN4AAAA==",
  },
  "comum-raro": {
    src: "/media/lines/comum-raro.webp",
    width: 1600,
    height: 900,
    blurDataURL:
      "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACQAQCdASoQAAkAA4BaJZwAATz5mYAA/ov5YgowuucHOQBy4lmndNa7IAA=",
  },
} as const satisfies Record<string, LineMediaEntry>;

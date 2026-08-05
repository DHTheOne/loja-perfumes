/**
 * Tokens de cor do design system.
 *
 * Amostrados das imagens aprovadas no lote 01 (grupo A) —
 * ver docs/media/ANALISE-LOTE-01.md. Os valores em `surface` e `metal`
 * vêm de `_master-bottle.png`; os de `line` das variações por família.
 *
 * Estes são os valores usados pelo Three.js, que trabalha com hex numérico.
 * A contraparte em CSS custom properties vive em src/app/globals.css e as
 * duas precisam ser mantidas em sincronia.
 */

export const surface = {
  /** Fundo da cena e da página. Preto quente, nunca #000 puro. */
  void: "#0a0908",
  /** Superfície polida sob o frasco. */
  slate: "#14120f",
  /** Elevação de cartão. */
  raised: "#1f1b16",
} as const;

export const metal = {
  /** Tampa e colar — champanhe escovado do frasco mestre. */
  champagne: "#c6b78f",
  /** Realce especular na aresta da tampa. */
  champagneLight: "#e2d6b4",
} as const;

export const ink = {
  /** Texto principal. Branco quente para não vibrar sobre o fundo. */
  primary: "#f2ede3",
  /** Texto secundário. */
  muted: "#8f877a",
} as const;

/** Cor do vidro por família olfativa. Ver MEDIA_PLAN.md §5. */
export const line = {
  lenhoVigil: "#b06e28",
  albaCitrica: "#e8e3d6",
  floraVelada: "#e6dcd8",
  ambarSecreto: "#7a5c3e",
  mareClara: "#a8c4cc",
  noturnoAbsoluto: "#141414",
  comumRaro: "#dcdcd8",
} as const;

export type LineKey = keyof typeof line;

/**
 * Intensidade das luzes da cena.
 * Calibrado para reproduzir a iluminação do frasco mestre: uma key grande e
 * suave à esquerda a 45°, rim atrás à direita, ambiente quase nulo.
 */
export const lighting = {
  keyIntensity: 3.2,
  rimIntensity: 2.4,
  fillIntensity: 0.35,
  ambientIntensity: 0.08,
} as const;

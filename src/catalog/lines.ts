import type { FragranceLine } from "@/catalog/types";

/**
 * Seed estático das 7 linhas — Fase 2.
 *
 * TODAS as fragrâncias são fictícias e originais (PROJECT_BRIEF §6).
 * Os nomes vêm de MEDIA_PLAN.md §5 e seguem PENDENTES de aprovação do
 * proprietário e de busca de anterioridade de marca (risco R8) — trocar um
 * nome é trocar `name`; o `slug` só muda antes do lançamento.
 *
 * Preços em centavos, definidos aqui (servidor). Nenhum preço é calculado
 * no cliente — critério de sucesso do PROJECT_BRIEF §5.
 */
export const lines: readonly FragranceLine[] = [
  {
    slug: "lenho-vigil",
    name: "Lenho Vigil",
    family: "amadeirada",
    familyLabel: "Amadeirada",
    tagline: "A madeira que guarda o fim da tarde.",
    description:
      "Um amadeirado seco e ereto, construído sobre cedro-do-atlas e vetiver. " +
      "Abre com especiarias discretas, aquece no coração de íris e termina em " +
      "sândalo — um perfume de postura, para quem fala baixo e é ouvido.",
    accord: "Vidro âmbar escuro, grão de madeira, luz lateral quente.",
    notes: {
      top: ["Bergamota", "Pimenta-rosa", "Cardamomo"],
      heart: ["Cedro-do-atlas", "Íris", "Folha de figueira"],
      base: ["Vetiver", "Sândalo", "Fava-tonka"],
    },
    concentration: "Eau de Parfum",
    volumes: [
      { ml: 50, priceCents: 52900 },
      { ml: 100, priceCents: 74900 },
    ],
    intensity: 4,
    longevityHours: 8,
    occasion: "versátil",
    seasons: ["outono", "inverno"],
  },
  {
    slug: "alba-citrica",
    name: "Alba Cítrica",
    family: "citrica",
    familyLabel: "Cítrica",
    tagline: "O primeiro minuto da manhã, retido em vidro.",
    description:
      "Cítricos de casca fria — bergamota, limão-siciliano e yuzu — sobre um " +
      "coração de néroli e chá-branco. Seca limpa, sem açúcar, com almíscar " +
      "claro. É o perfume de camisa passada e janela aberta.",
    accord: "Vidro claro, luz fria da manhã, respingo suspenso.",
    notes: {
      top: ["Bergamota de Calábria", "Limão-siciliano", "Yuzu"],
      heart: ["Néroli", "Chá-branco", "Gengibre"],
      base: ["Almíscar branco", "Musgo claro", "Madeira lavada"],
    },
    concentration: "Eau de Parfum",
    volumes: [
      { ml: 50, priceCents: 45900 },
      { ml: 100, priceCents: 64900 },
    ],
    intensity: 2,
    longevityHours: 6,
    occasion: "dia",
    seasons: ["primavera", "verão"],
  },
  {
    slug: "flora-velada",
    name: "Flora Velada",
    family: "floral",
    familyLabel: "Floral",
    tagline: "Flores atrás de um véu de luz.",
    description:
      "Um floral fora de foco: peônia e jasmim-sambac amaciados por aldeídos, " +
      "como pétalas vistas através de vidro leitoso. O fundo de almíscar e " +
      "baunilha seca mantém tudo a meia-voz — presente, nunca insistente.",
    accord: "Vidro leitoso, pétala desfocada, luz difusa alta.",
    notes: {
      top: ["Pera", "Aldeídos", "Folha de violeta"],
      heart: ["Peônia", "Jasmim-sambac", "Magnólia"],
      base: ["Almíscar", "Cedro branco", "Baunilha seca"],
    },
    concentration: "Eau de Parfum",
    volumes: [
      { ml: 50, priceCents: 48900 },
      { ml: 100, priceCents: 68900 },
    ],
    intensity: 3,
    longevityHours: 7,
    occasion: "dia",
    seasons: ["primavera"],
  },
  {
    slug: "ambar-secreto",
    name: "Âmbar Secreto",
    family: "oriental",
    familyLabel: "Oriental",
    tagline: "O que o latão escovado esconde do escuro.",
    description:
      "Açafrão e laranja-amarga acendem uma rosa escura; benjoim, ládano e " +
      "couro seguram a base como brasa coberta. É denso, lento e próximo — " +
      "um perfume que só quem chega perto descobre inteiro.",
    accord: "Vidro fumê, latão escovado, luz baixa e dramática.",
    notes: {
      top: ["Açafrão", "Canela", "Laranja-amarga"],
      heart: ["Rosa turca", "Benjoim", "Papiro"],
      base: ["Âmbar", "Ládano", "Couro", "Baunilha"],
    },
    concentration: "Eau de Parfum",
    volumes: [
      { ml: 50, priceCents: 56900 },
      { ml: 100, priceCents: 79900 },
    ],
    intensity: 5,
    longevityHours: 10,
    occasion: "noite",
    seasons: ["outono", "inverno"],
  },
  {
    slug: "mare-clara",
    name: "Maré Clara",
    family: "aquatica",
    familyLabel: "Aquática",
    tagline: "Água aberta, sal e distância.",
    description:
      "Um aquático de sal, não de piscina: acorde marinho com toranja na " +
      "abertura, alecrim e lírio-d'água no coração, âmbar-cinza na base. " +
      "Evapora como o fim de manhã na praia deserta — limpo e sem pressa.",
    accord: "Vidro azulado translúcido, cáustica de água.",
    notes: {
      top: ["Acorde marinho", "Toranja", "Cássis"],
      heart: ["Sal marinho", "Alecrim", "Lírio-d'água"],
      base: ["Âmbar-cinza", "Madeira clara", "Almíscar"],
    },
    concentration: "Eau de Parfum",
    volumes: [
      { ml: 50, priceCents: 45900 },
      { ml: 100, priceCents: 64900 },
    ],
    intensity: 2,
    longevityHours: 6,
    occasion: "dia",
    seasons: ["verão"],
  },
  {
    slug: "noturno-absoluto",
    name: "Noturno Absoluto",
    family: "oriental",
    familyLabel: "Coleção noturna",
    tagline: "Feito para depois da meia-noite.",
    description:
      "A concentração mais alta da casa. Incenso e couro sobre patchouli e " +
      "cacau amargo, aberto por pimenta-preta. Não acompanha o dia — espera " +
      "por ele acabar. Frasco em vidro preto opaco, de reflexo único.",
    accord: "Vidro preto opaco, reflexo único, fundo quase preto.",
    notes: {
      top: ["Pimenta-preta", "Absinto", "Bergamota"],
      heart: ["Incenso", "Couro", "Papoula"],
      base: ["Âmbar escuro", "Patchouli", "Cacau amargo"],
    },
    concentration: "Parfum",
    volumes: [
      { ml: 50, priceCents: 68900 },
      { ml: 100, priceCents: 94900 },
    ],
    intensity: 5,
    longevityHours: 12,
    occasion: "noite",
    seasons: ["inverno"],
  },
  {
    slug: "comum-raro",
    name: "Comum Raro",
    family: "aromatica",
    familyLabel: "Coleção unissex",
    tagline: "O extraordinário disfarçado de cotidiano.",
    description:
      "Sálvia, figo e chá-mate num acorde que lembra roupa limpa e pele — " +
      "de ninguém em particular, de qualquer um que o vista. Sem gênero, sem " +
      "estação, sem ocasião: o perfume que vira assinatura por insistência.",
    accord: "Vidro incolor, geometria limpa, fundo neutro médio.",
    notes: {
      top: ["Sálvia", "Mandarina", "Cardamomo verde"],
      heart: ["Figo", "Chá-mate", "Lírio"],
      base: ["Almíscar de algodão", "Vetiver claro", "Cedro lavado"],
    },
    concentration: "Eau de Parfum",
    volumes: [
      { ml: 50, priceCents: 49900 },
      { ml: 100, priceCents: 69900 },
    ],
    intensity: 3,
    longevityHours: 7,
    occasion: "versátil",
    seasons: ["primavera", "verão", "outono", "inverno"],
  },
] as const;

export function getLineBySlug(slug: string): FragranceLine | undefined {
  return lines.find((candidate) => candidate.slug === slug);
}

/** Menor preço da linha — o "a partir de" dos cards. */
export function startingPriceCents(fragrance: FragranceLine): number {
  return Math.min(...fragrance.volumes.map((volume) => volume.priceCents));
}

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatPriceBRL(priceCents: number): string {
  return brlFormatter.format(priceCents / 100);
}

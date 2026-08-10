import { getLineBySlug } from "@/catalog/lines";
import type { FragranceLine, Volume } from "@/catalog/types";

/**
 * Sacola — estado e regras, sem React e sem armazenamento.
 *
 * O item guarda apenas `slug` + `ml` + quantidade. Preço NÃO é copiado para
 * dentro da sacola: ele é lido do catálogo na hora de exibir. Uma sacola que
 * carrega o preço do dia em que o item entrou volta do localStorage semanas
 * depois anunciando um valor que a loja não pratica mais — e, pior, o
 * checkout precisaria decidir qual dos dois vale. Guardar a referência e
 * derivar o preço faz o conflito deixar de existir.
 *
 * Pelo mesmo motivo o módulo não guarda nome nem imagem: tudo isso é
 * derivável do slug e mudaria sozinho quando o catálogo mudasse.
 */

/** Teto por item. Existe para a sacola não virar vetor de valor absurdo. */
export const MAX_QUANTITY = 10;

export type BagItem = {
  /** Slug da linha. Identificador estável do catálogo. */
  slug: string;
  /** Volume escolhido, em ml — distingue as variantes da mesma linha. */
  ml: number;
  quantity: number;
};

export type Bag = readonly BagItem[];

export const emptyBag: Bag = [];

function isSameVariant(item: BagItem, slug: string, ml: number): boolean {
  return item.slug === slug && item.ml === ml;
}

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(quantity)));
}

/**
 * Acrescenta uma variante. Se ela já está na sacola, soma à quantidade em vez
 * de criar uma segunda linha — duas entradas do mesmo 50 ml confundiriam a
 * conferência e o total.
 */
export function addItem(
  bag: Bag,
  slug: string,
  ml: number,
  quantity = 1,
): Bag {
  const amount = clampQuantity(quantity);
  const existing = bag.find((item) => isSameVariant(item, slug, ml));

  if (!existing) {
    return [...bag, { slug, ml, quantity: amount }];
  }

  return bag.map((item) =>
    isSameVariant(item, slug, ml)
      ? { ...item, quantity: clampQuantity(item.quantity + amount) }
      : item,
  );
}

export function removeItem(bag: Bag, slug: string, ml: number): Bag {
  return bag.filter((item) => !isSameVariant(item, slug, ml));
}

/** Quantidade 0 ou menos remove o item — é o que o usuário quer dizer. */
export function setQuantity(
  bag: Bag,
  slug: string,
  ml: number,
  quantity: number,
): Bag {
  if (quantity <= 0) return removeItem(bag, slug, ml);

  return bag.map((item) =>
    isSameVariant(item, slug, ml)
      ? { ...item, quantity: clampQuantity(quantity) }
      : item,
  );
}

/** Total de unidades — o número que vai no contador do header. */
export function itemCount(bag: Bag): number {
  return bag.reduce((total, item) => total + item.quantity, 0);
}

export type ResolvedBagItem = {
  item: BagItem;
  fragrance: FragranceLine;
  volume: Volume;
  /** Preço da variante × quantidade, em centavos. */
  subtotalCents: number;
};

/**
 * Liga a sacola ao catálogo e descarta o que não existe mais.
 *
 * Item de linha removida ou de volume descontinuado é silenciosamente
 * ignorado, não exibido como erro: a sacola vem do localStorage e pode ter
 * sido gravada por uma versão anterior do catálogo. Mostrar "produto
 * inválido" culparia a pessoa por uma mudança nossa.
 */
export function resolveBag(bag: Bag): readonly ResolvedBagItem[] {
  return bag.flatMap((item) => {
    const fragrance = getLineBySlug(item.slug);
    if (!fragrance) return [];

    const volume = fragrance.volumes.find((option) => option.ml === item.ml);
    if (!volume) return [];

    return [
      {
        item,
        fragrance,
        volume,
        subtotalCents: volume.priceCents * item.quantity,
      },
    ];
  });
}

export function totalCents(resolved: readonly ResolvedBagItem[]): number {
  return resolved.reduce((total, entry) => total + entry.subtotalCents, 0);
}

/**
 * Valida o que veio do armazenamento.
 *
 * `localStorage` é entrada não confiável: outra aba, uma extensão ou uma
 * versão futura do site podem ter escrito qualquer coisa ali. Só passa o que
 * tem a forma esperada; o resto é descartado sem quebrar a página.
 */
export function parseBag(raw: unknown): Bag {
  if (!Array.isArray(raw)) return emptyBag;

  const items: BagItem[] = [];

  for (const candidate of raw) {
    if (typeof candidate !== "object" || candidate === null) continue;

    const { slug, ml, quantity } = candidate as Record<string, unknown>;
    if (typeof slug !== "string" || slug.length === 0) continue;
    if (typeof ml !== "number" || !Number.isFinite(ml) || ml <= 0) continue;
    if (typeof quantity !== "number") continue;

    // Passa pelo `addItem` para herdar a fusão de duplicatas e o teto: um
    // JSON adulterado com o mesmo item duas vezes, ou com quantidade 9999,
    // sai daqui normalizado.
    const normalized = addItem(items, slug, ml, quantity);
    items.length = 0;
    items.push(...normalized);
  }

  return items;
}

import { describe, expect, it } from "vitest";

import {
  addItem,
  emptyBag,
  itemCount,
  MAX_QUANTITY,
  parseBag,
  removeItem,
  resolveBag,
  setQuantity,
  totalCents,
} from "@/bag/bag";
import { lines } from "@/catalog/lines";

const linha = lines[0];
const volume = linha.volumes[0];
const outroVolume = linha.volumes[1];

describe("addItem", () => {
  it("acrescenta a variante", () => {
    const bag = addItem(emptyBag, linha.slug, volume.ml);
    expect(bag).toEqual([{ slug: linha.slug, ml: volume.ml, quantity: 1 }]);
  });

  /**
   * Duas linhas do mesmo 50 ml na conferência confundiriam o total e a
   * edição — qual das duas o botão de remover apaga?
   */
  it("soma na variante existente em vez de duplicar a linha", () => {
    let bag = addItem(emptyBag, linha.slug, volume.ml);
    bag = addItem(bag, linha.slug, volume.ml, 2);

    expect(bag).toHaveLength(1);
    expect(bag[0].quantity).toBe(3);
  });

  it("trata volumes diferentes da mesma linha como itens distintos", () => {
    let bag = addItem(emptyBag, linha.slug, volume.ml);
    bag = addItem(bag, linha.slug, outroVolume.ml);

    expect(bag).toHaveLength(2);
  });

  it("respeita o teto por item", () => {
    const bag = addItem(emptyBag, linha.slug, volume.ml, 999);
    expect(bag[0].quantity).toBe(MAX_QUANTITY);
  });
});

describe("setQuantity e removeItem", () => {
  it("quantidade zero remove o item", () => {
    const bag = addItem(emptyBag, linha.slug, volume.ml, 3);
    expect(setQuantity(bag, linha.slug, volume.ml, 0)).toHaveLength(0);
  });

  it("remove só a variante pedida", () => {
    let bag = addItem(emptyBag, linha.slug, volume.ml);
    bag = addItem(bag, linha.slug, outroVolume.ml);

    const restante = removeItem(bag, linha.slug, volume.ml);
    expect(restante).toHaveLength(1);
    expect(restante[0].ml).toBe(outroVolume.ml);
  });
});

describe("itemCount", () => {
  it("conta unidades, não linhas", () => {
    let bag = addItem(emptyBag, linha.slug, volume.ml, 2);
    bag = addItem(bag, linha.slug, outroVolume.ml, 3);
    expect(itemCount(bag)).toBe(5);
  });
});

describe("resolveBag", () => {
  it("liga ao catálogo e calcula o subtotal", () => {
    const bag = addItem(emptyBag, linha.slug, volume.ml, 2);
    const [entry] = resolveBag(bag);

    expect(entry.fragrance.slug).toBe(linha.slug);
    expect(entry.subtotalCents).toBe(volume.priceCents * 2);
  });

  /**
   * A sacola vem do localStorage e pode ter sido gravada por uma versão
   * anterior do catálogo. Item órfão sai da lista em silêncio — exibir
   * "produto inválido" culparia a pessoa por uma mudança nossa.
   */
  it("descarta linha que não existe mais", () => {
    const bag = addItem(emptyBag, "linha-que-nao-existe", 50);
    expect(resolveBag(bag)).toHaveLength(0);
  });

  it("descarta volume descontinuado da linha", () => {
    const inexistente = 999;
    expect(linha.volumes.some((v) => v.ml === inexistente)).toBe(false);

    const bag = addItem(emptyBag, linha.slug, inexistente);
    expect(resolveBag(bag)).toHaveLength(0);
  });

  /**
   * O preço não é copiado para dentro da sacola: é lido do catálogo na
   * exibição. Este teste trava esse contrato — se alguém passar a gravar
   * `priceCents` no item, o total deixaria de acompanhar o catálogo.
   */
  it("deriva o preço do catálogo, não do item guardado", () => {
    const bag = addItem(emptyBag, linha.slug, volume.ml);
    expect(Object.keys(bag[0]).sort()).toEqual(["ml", "quantity", "slug"]);
    expect(totalCents(resolveBag(bag))).toBe(volume.priceCents);
  });
});

describe("parseBag", () => {
  it("devolve sacola vazia para entrada que não é lista", () => {
    expect(parseBag(null)).toEqual([]);
    expect(parseBag("{}")).toEqual([]);
    expect(parseBag({ slug: linha.slug })).toEqual([]);
  });

  it("descarta itens malformados sem derrubar os válidos", () => {
    const parsed = parseBag([
      { slug: linha.slug, ml: volume.ml, quantity: 2 },
      { slug: 123, ml: volume.ml, quantity: 1 },
      { slug: linha.slug, ml: "50", quantity: 1 },
      { slug: linha.slug, ml: volume.ml },
      null,
    ]);

    expect(parsed).toEqual([
      { slug: linha.slug, ml: volume.ml, quantity: 2 },
    ]);
  });

  /** localStorage é entrada não confiável: outra aba ou extensão escreve ali. */
  it("normaliza duplicata e quantidade absurda vindas do armazenamento", () => {
    const parsed = parseBag([
      { slug: linha.slug, ml: volume.ml, quantity: 4 },
      { slug: linha.slug, ml: volume.ml, quantity: 9999 },
    ]);

    expect(parsed).toHaveLength(1);
    expect(parsed[0].quantity).toBe(MAX_QUANTITY);
  });
});

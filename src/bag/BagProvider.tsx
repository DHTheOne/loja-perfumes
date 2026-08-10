"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  addItem,
  emptyBag,
  itemCount,
  parseBag,
  removeItem,
  setQuantity,
  type Bag,
} from "@/bag/bag";

/**
 * Estado da sacola, com o localStorage como fonte única.
 *
 * Não há cópia da sacola em `useState`. A alternativa — estado do React
 * espelhando o armazenamento — precisa de um efeito que lê e chama `setState`
 * na montagem, e outro que grava a cada mudança. Além de proibido pelo lint
 * (`react-hooks/set-state-in-effect`), esse desenho tem duas fontes de
 * verdade que saem de sincronia assim que outra aba escreve.
 *
 * `useSyncExternalStore` é a forma suportada de assinar um estado externo com
 * renderização concorrente, e é o mesmo mecanismo já usado em `HeroScene`
 * para WebGL e movimento reduzido.
 *
 * Nada de servidor: não há conta, sessão nem pedido. A sacola é local a este
 * navegador e some se a pessoa limpar o armazenamento — coerente com uma loja
 * cujas vendas ainda não abriram (ADR-0004; JSON-LD em PreOrder).
 */

const STORAGE_KEY = "sillage:sacola:v1";

/** Evento próprio: `storage` só dispara em OUTRAS abas, nunca na que gravou. */
const BAG_EVENT = "sillage:sacola";

/**
 * Cache do último valor lido.
 *
 * `getSnapshot` precisa devolver a MESMA referência enquanto nada mudar. Sem
 * o cache, cada chamada faria `JSON.parse` e devolveria um array novo, que o
 * React entenderia como mudança — e o componente entraria em laço infinito
 * de renderização.
 */
let cachedRaw: string | null = null;
let cachedBag: Bag = emptyBag;

function readBag(): Bag {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Armazenamento bloqueado (modo privado, política de terceiros).
    return emptyBag;
  }

  if (raw === cachedRaw) return cachedBag;

  cachedRaw = raw;
  try {
    cachedBag = raw ? parseBag(JSON.parse(raw)) : emptyBag;
  } catch {
    // JSON corrompido por outra aba, extensão ou versão futura do site.
    cachedBag = emptyBag;
  }
  return cachedBag;
}

function writeBag(next: Bag): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Cota estourada ou armazenamento negado: a mudança não persiste, mas
    // derrubar a página por causa disso seria pior.
  }
  window.dispatchEvent(new Event(BAG_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(BAG_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(BAG_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** No servidor não há armazenamento: o HTML sai com a sacola vazia. */
function getServerBag(): Bag {
  return emptyBag;
}

function subscribeNever(): () => void {
  return () => {};
}

type BagContextValue = {
  bag: Bag;
  count: number;
  /**
   * `false` no HTML do servidor, `true` a partir da hidratação. Existe para
   * a interface não afirmar "sacola vazia" antes de poder saber — o servidor
   * não tem como ler o localStorage deste navegador.
   */
  isReady: boolean;
  add: (slug: string, ml: number, quantity?: number) => void;
  remove: (slug: string, ml: number) => void;
  changeQuantity: (slug: string, ml: number, quantity: number) => void;
  clear: () => void;
};

const BagContext = createContext<BagContextValue | null>(null);

export function BagProvider({ children }: { children: ReactNode }) {
  const bag = useSyncExternalStore(subscribe, readBag, getServerBag);

  const isReady = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  // Cada mutação lê o valor corrente do armazenamento antes de escrever, em
  // vez de partir do `bag` capturado no render. É o que mantém a operação
  // correta quando outra aba alterou a sacola entre o render e o clique.
  const add = useCallback((slug: string, ml: number, quantity = 1) => {
    writeBag(addItem(readBag(), slug, ml, quantity));
  }, []);

  const remove = useCallback((slug: string, ml: number) => {
    writeBag(removeItem(readBag(), slug, ml));
  }, []);

  const changeQuantity = useCallback(
    (slug: string, ml: number, quantity: number) => {
      writeBag(setQuantity(readBag(), slug, ml, quantity));
    },
    [],
  );

  const clear = useCallback(() => writeBag(emptyBag), []);

  const value = useMemo<BagContextValue>(
    () => ({
      bag,
      count: itemCount(bag),
      isReady,
      add,
      remove,
      changeQuantity,
      clear,
    }),
    [bag, isReady, add, remove, changeQuantity, clear],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag(): BagContextValue {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error("useBag precisa estar dentro de <BagProvider>");
  }
  return context;
}

"use client";

import Link from "next/link";

import { useBag } from "@/bag/BagProvider";

/**
 * Acesso à sacola no header, com contador.
 *
 * O número só aparece depois de o armazenamento ser lido (`isReady`). Antes
 * disso o servidor não tem como saber quantos itens existem, e pintar "0"
 * para depois trocar por "3" produziria salto visível e aviso de hidratação.
 * O link em si é servido sempre — é navegação, não pode depender de JS.
 */
export function BagLink() {
  const { count, isReady } = useBag();
  const hasItems = isReady && count > 0;

  return (
    <Link
      href="/sacola"
      className="inline-flex items-center gap-2 py-3.5 font-sans text-xs uppercase tracking-[0.25em] text-ink-muted transition-colors duration-300 hover:text-champagne"
    >
      Sacola
      {hasItems ? (
        <span
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-champagne px-1.5 text-[11px] font-medium tracking-normal text-void"
          /* O número sozinho seria lido como "3" solto. */
          aria-label={`${count} ${count === 1 ? "item" : "itens"} na sacola`}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

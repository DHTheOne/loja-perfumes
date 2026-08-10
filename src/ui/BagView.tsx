"use client";

import Image from "next/image";
import Link from "next/link";

import { resolveBag, totalCents, MAX_QUANTITY } from "@/bag/bag";
import { useBag } from "@/bag/BagProvider";
import { formatPriceBRL } from "@/catalog/lines";
import { lineMediaAlt, lineMediaForSlug } from "@/ui/lineMedia";

/**
 * Conferência da sacola.
 *
 * Cliente porque o estado mora no localStorage deste navegador. A rota em si
 * é Server Component — ela exporta os metadados e monta este componente, que
 * é o único pedaço que precisa de JavaScript.
 */
export function BagView() {
  const { bag, isReady, changeQuantity, remove, clear } = useBag();

  const resolved = resolveBag(bag);
  const total = totalCents(resolved);

  // Enquanto o armazenamento não foi lido não dá para afirmar nem que a
  // sacola está vazia nem que tem itens. Anunciar "sacola vazia" e trocar
  // por três itens meio segundo depois é pior que um estado de espera.
  if (!isReady) {
    return (
      <p className="mt-12 font-sans text-sm text-ink-muted">
        Carregando sua sacola…
      </p>
    );
  }

  if (resolved.length === 0) {
    return (
      <div className="mt-12 rounded-2xl border border-white/10 bg-raised p-10 text-center">
        <p className="font-display text-2xl font-light text-ink">
          Sua sacola está vazia
        </p>
        <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-ink-muted">
          As sete linhas da casa estão nas coleções — cada uma com dois
          volumes.
        </p>
        <Link
          href="/colecoes"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 font-sans text-sm text-ink transition-colors duration-300 hover:border-champagne hover:text-champagne"
        >
          Ver as coleções
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[7fr_5fr]">
      <ul className="space-y-4">
        {resolved.map(({ item, fragrance, volume, subtotalCents }) => {
          const media = lineMediaForSlug(fragrance.slug);

          return (
            <li
              key={`${item.slug}-${item.ml}`}
              className="flex gap-5 rounded-2xl border border-white/10 bg-raised p-5"
            >
              {media ? (
                <Link
                  href={`/perfumes/${fragrance.slug}`}
                  className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-xl sm:block"
                >
                  <Image
                    src={media.src}
                    alt={lineMediaAlt(fragrance.name, fragrance.familyLabel)}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </Link>
              ) : null}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/perfumes/${fragrance.slug}`}
                      className="font-display text-xl font-light text-ink transition-colors duration-300 hover:text-champagne"
                    >
                      {fragrance.name}
                    </Link>
                    <p className="mt-1 font-sans text-sm text-ink-muted">
                      {volume.ml} ml · {formatPriceBRL(volume.priceCents)} cada
                    </p>
                  </div>
                  <p className="font-sans text-base text-champagne">
                    {formatPriceBRL(subtotalCents)}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-3">
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted">
                      Quantidade
                    </span>
                    {/* `select` em vez de campo numérico: o teto é 10, então a
                        lista inteira cabe — e o controle nativo já resolve
                        teclado, toque e leitor de tela. */}
                    <select
                      value={item.quantity}
                      onChange={(event) =>
                        changeQuantity(
                          item.slug,
                          item.ml,
                          Number(event.target.value),
                        )
                      }
                      aria-label={`Quantidade de ${fragrance.name} ${volume.ml} ml`}
                      className="h-10 rounded-lg border border-white/15 bg-void px-3 font-sans text-sm text-ink"
                    >
                      {Array.from({ length: MAX_QUANTITY }, (_, i) => i + 1).map(
                        (amount) => (
                          <option key={amount} value={amount}>
                            {amount}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() => remove(item.slug, item.ml)}
                    className="font-sans text-sm text-ink-muted underline-offset-4 transition-colors duration-300 hover:text-champagne hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl border border-white/10 bg-raised p-7">
          <h2 className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted">
            Resumo
          </h2>

          <dl className="mt-5 space-y-3">
            <div className="flex items-baseline justify-between">
              <dt className="font-sans text-sm text-ink-muted">Subtotal</dt>
              <dd className="font-sans text-base text-ink">
                {formatPriceBRL(total)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="font-sans text-sm text-ink-muted">Frete</dt>
              {/* Não há tabela de frete nem transportadora decididas
                  (PROJECT_STATUS, decisões pendentes do proprietário).
                  Escrever "grátis" ou um valor qualquer seria inventar. */}
              <dd className="font-sans text-sm text-ink-muted">
                a definir
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex items-baseline justify-between border-t border-white/10 pt-5">
            <p className="font-sans text-sm text-ink">Total parcial</p>
            <p className="font-display text-2xl font-light text-champagne">
              {formatPriceBRL(total)}
            </p>
          </div>

          <Link
            href="/sacola/checkout"
            className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-champagne px-8 font-sans text-sm font-medium text-void transition-colors duration-300 hover:bg-[var(--metal-champagne-light)]"
          >
            Continuar
          </Link>

          <button
            type="button"
            onClick={clear}
            className="mt-4 w-full font-sans text-sm text-ink-muted underline-offset-4 transition-colors duration-300 hover:text-champagne hover:underline"
          >
            Esvaziar sacola
          </button>
        </div>
      </aside>
    </div>
  );
}

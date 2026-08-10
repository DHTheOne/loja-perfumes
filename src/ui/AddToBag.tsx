"use client";

import { useState } from "react";

import { useBag } from "@/bag/BagProvider";
import { formatPriceBRL } from "@/catalog/lines";
import type { Volume } from "@/catalog/types";

/**
 * Escolha de volume e entrada na sacola, na página de produto.
 *
 * Substitui o botão desabilitado "Vendas abrem em breve". A loja continua sem
 * vender — o que este fluxo monta é uma lista de intenção, e o texto diz
 * isso. Um botão que promete compra sem gateway configurado seria a mentira
 * pior: a pessoa descobriria só no fim.
 */

type AddToBagProps = {
  slug: string;
  volumes: readonly Volume[];
};

export function AddToBag({ slug, volumes }: AddToBagProps) {
  const { add, isReady } = useBag();
  const [selectedMl, setSelectedMl] = useState(volumes[0]?.ml ?? 0);
  const [justAdded, setJustAdded] = useState(false);

  const selected = volumes.find((volume) => volume.ml === selectedMl);
  if (!selected) return null;

  function handleAdd() {
    add(slug, selected!.ml);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2600);
  }

  return (
    <div>
      <fieldset>
        {/* Oculto visualmente: a seção que envolve este componente já mostra
            "Volumes" como título. Repetir na tela seria ruído; sem o legend,
            porém, o grupo de rádios chegaria sem nome ao leitor de tela. */}
        <legend className="sr-only">Escolha o volume</legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {volumes.map((volume) => {
            const isSelected = volume.ml === selectedMl;
            return (
              <label
                key={volume.ml}
                className={`cursor-pointer rounded-xl border px-6 py-4 transition-colors duration-300 ${
                  isSelected
                    ? "border-champagne bg-raised"
                    : "border-white/10 bg-raised hover:border-white/25"
                }`}
              >
                {/* Rádio real, apenas visualmente oculto: mantém navegação por
                    teclado e por leitor de tela sem recriar o comportamento de
                    grupo com divs e ARIA. */}
                <input
                  type="radio"
                  name="volume"
                  value={volume.ml}
                  checked={isSelected}
                  onChange={() => setSelectedMl(volume.ml)}
                  className="sr-only"
                />
                <span className="block font-sans text-sm text-ink">
                  {volume.ml} ml
                </span>
                <span className="mt-1 block font-sans text-base text-champagne">
                  {formatPriceBRL(volume.priceCents)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleAdd}
          /* Desabilitado até a sacola ser lida do armazenamento: clicar antes
             disso adicionaria a um estado que o efeito de leitura ainda vai
             substituir, e o item sumiria. */
          disabled={!isReady}
          className="inline-flex h-12 items-center justify-center rounded-full bg-champagne px-8 font-sans text-sm font-medium text-void transition-colors duration-300 hover:bg-[var(--metal-champagne-light)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reservar {selected.ml} ml
        </button>

        {/* `aria-live`: quem não vê a mudança de cor precisa ser avisado de
            que a ação deu certo. `polite` não interrompe a leitura em curso. */}
        <p aria-live="polite" className="font-sans text-sm text-ink-muted">
          {justAdded ? "Adicionado à sacola." : ""}
        </p>
      </div>

      <p className="mt-4 max-w-md font-sans text-xs leading-relaxed text-ink-muted">
        As vendas ainda não abriram. A sacola guarda sua escolha neste
        navegador — nada é cobrado e nenhum dado é enviado.
      </p>
    </div>
  );
}

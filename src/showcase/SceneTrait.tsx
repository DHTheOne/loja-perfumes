import type { FragranceLine } from "@/catalog/types";

/**
 * A característica da fragrância em cena.
 *
 * NÃO É LEGENDA. Uma legenda descreve o que está na tela e some quando a tela
 * muda. Isto é o contrário: fica no canto que os controles desocuparam, no
 * peso tipográfico de uma cartela de ficha técnica de filme, e some ANTES da
 * emenda — nunca atravessa um dissolve. É o que separa direção de arte de
 * interface: interface persiste, cartela entra e sai com o plano.
 *
 * O DADO É DO CATÁLOGO, não texto inventado para a tela. A nota de fundo é o
 * que resta horas depois — em perfumaria, o rastro — e a casa se chama
 * sillage justamente por isso (ver src/config/site.ts). Das seis linhas em
 * cena, é o campo que mais as distingue: vetiver, almíscar branco, âmbar,
 * cacau amargo. Preço e nome já estão na ficha à esquerda; repeti-los aqui
 * seria enfeite.
 *
 * Fica no canto INFERIOR DIREITO por composição: o frasco ocupa o eixo
 * central dos seis planos e a ficha ocupa a base esquerda. A base direita é a
 * única região escura e vazia nas seis cenas — verificado quadro a quadro.
 */

type SceneTraitProps = {
  line: FragranceLine;
  /** Governado pelo tempo do clipe, não por rolagem nem por hover. */
  visible: boolean;
};

export function SceneTrait({ line, visible }: SceneTraitProps) {
  const trail = line.notes.base[0];
  if (!trail) return null;

  return (
    <div
      className="pointer-events-none absolute bottom-6 right-6 max-w-[45vw] text-right md:bottom-8 md:right-12"
      style={{
        zIndex: "var(--layer-type)",
        opacity: visible ? 1 : 0,
        /* Deriva de 6px, não de 2rem. A ficha à esquerda ENTRA na cena e
           merece deslocamento; esta aparece como se já estivesse ali e a luz
           tivesse subido. Movimento grande aqui viraria o elemento chamativo
           que o pedido exclui. */
        transform: visible ? "translate3d(0,0,0)" : "translate3d(0,6px,0)",
        /* O desfoque some junto com a opacidade: a cartela não desliza para
           dentro, ela RESOLVE, como texto que entra em foco. */
        filter: visible ? "blur(0px)" : "blur(3px)",
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "var(--motion-cinematic)",
        transitionTimingFunction: "var(--ease-cinematic)",
      }}
    >
      <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-ink-muted">
        Rastro
      </p>
      <p className="mt-2 font-display text-lg font-light leading-none text-champagne md:text-xl">
        {trail}
      </p>
      <p className="mt-2 font-sans text-[11px] tracking-[0.18em] text-ink-muted">
        {line.longevityHours} h na pele
      </p>
    </div>
  );
}

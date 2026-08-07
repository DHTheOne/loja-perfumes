import { line, metal, type LineKey } from "@/ui/tokens";
import { hexToRgba } from "@/ui/color";

type BottleGlyphProps = {
  lineKey: LineKey;
  /** Controla o tamanho: passar largura + aspect ratio (ex.: "aspect-[2/5] w-16"). */
  className?: string;
};

/**
 * Silhueta do frasco em CSS puro — o placeholder programático da Trilha A
 * (MEDIA_PLAN §3) em forma de componente. Usa a cor de vidro da linha e o
 * metal champanhe dos tokens; nenhuma imagem, nenhum WebGL.
 *
 * Decorativo por definição (aria-hidden): a informação está sempre no
 * texto ao lado, nunca aqui.
 */
export function BottleGlyph({ lineKey, className }: BottleGlyphProps) {
  const glass = line[lineKey];

  return (
    <div aria-hidden="true" className={`relative ${className ?? ""}`}>
      {/* Tampa em metal champanhe escovado. */}
      <div
        className="absolute left-1/2 top-0 h-[10%] w-[40%] -translate-x-1/2 rounded-t-[3px]"
        style={{
          background: `linear-gradient(180deg, ${metal.champagneLight} 0%, ${metal.champagne} 70%)`,
        }}
      />
      {/* Colar. */}
      <div
        className="absolute left-1/2 top-[10%] h-[3%] w-[46%] -translate-x-1/2"
        style={{ background: metal.champagne }}
      />
      {/* Corpo de vidro. A borda e o brilho especular fazem até o vidro
          preto do Noturno Absoluto ser legível sobre o fundo escuro. */}
      <div
        className="relative mt-[15%] h-[85%] w-full rounded-[6px] border border-white/15"
        style={{
          background: `linear-gradient(160deg, ${hexToRgba(glass, 0.85)} 0%, ${hexToRgba(glass, 0.3)} 55%, ${hexToRgba(glass, 0.6)} 100%)`,
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.25)",
        }}
      >
        <div className="absolute left-[12%] top-[8%] h-[68%] w-[5%] rounded-full bg-white/15 blur-[2px]" />
      </div>
    </div>
  );
}

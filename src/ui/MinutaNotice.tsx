/**
 * Sinalização do risco R5 (PROJECT_STATUS): os textos legais são minutas
 * técnicas e só ganham validade após revisão jurídica profissional.
 * Este banner NÃO pode ser removido pelas páginas — remover é decisão de
 * lançamento, não de layout.
 */
export function MinutaNotice() {
  return (
    <div
      role="note"
      className="mt-8 rounded-xl border border-champagne/30 bg-raised p-5"
    >
      <p className="font-sans text-xs uppercase tracking-[0.25em] text-champagne">
        Minuta
      </p>
      <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
        Este texto é uma minuta em preparação e ainda não tem validade
        legal. Ele será revisado por profissional jurídico antes do
        lançamento da loja.
      </p>
    </div>
  );
}

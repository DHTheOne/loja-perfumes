import Link from "next/link";

/** 404 na direção visual da casa — sempre com um caminho de volta. */
export default function NotFound() {
  return (
    <main
      id="conteudo"
      className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col items-start justify-center px-6 md:px-12"
    >
      <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
        Erro 404
      </p>
      <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">
        Isso evaporou
      </h1>
      <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-ink-muted">
        A página que você procura não existe ou mudou de endereço. O catálogo
        continua no lugar.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/colecoes"
          className="inline-flex h-12 items-center justify-center rounded-full bg-champagne px-8 font-sans text-sm font-medium text-void transition-colors duration-300 hover:bg-[var(--metal-champagne-light)]"
        >
          Ver as coleções
        </Link>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-8 font-sans text-sm text-ink transition-colors duration-300 hover:border-champagne hover:text-champagne"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}

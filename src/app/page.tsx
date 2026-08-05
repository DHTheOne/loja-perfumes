import { HeroScene } from "@/3d/HeroScene";

/**
 * Home — primeira fatia vertical do projeto.
 *
 * Server Component: o texto do hero é HTML servido pelo servidor e indexável.
 * Só a cena 3D é cliente. Consequência prática: a manchete aparece mesmo se o
 * WebGL falhar, e o LCP não depende do Canvas (ARCHITECTURE.md §9).
 *
 * O texto NÃO está queimado em imagem — é HTML sobreposto à área negativa
 * reservada nas imagens de referência (MEDIA_PLAN.md §2, item 4).
 */
export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col justify-center overflow-hidden">
      {/* Camada 3D — decorativa. Todo o conteúdo está no texto abaixo. */}
      <div aria-hidden="true" className="absolute inset-0">
        <HeroScene lineKey="comumRaro" />
      </div>

      {/* Véu que garante contraste do texto sobre a cena, à esquerda.
          Sem ele, o contraste depende do que a cena renderizar naquele frame. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void from-25% via-void/70 via-45% to-transparent to-65%"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-12">
        <div className="max-w-xl animate-rise">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
            Coleção de estreia
          </p>

          <h1
            className="mt-6 font-display font-light leading-[0.95] tracking-tight"
            style={{ fontSize: "var(--text-hero)" }}
          >
            O que fica
            <br />
            depois da presença
          </h1>

          <p
            className="mt-8 max-w-md text-ink-muted"
            style={{ fontSize: "var(--text-lead)" }}
          >
            Sete fragrâncias originais, compostas para durar no tecido e na
            memória. Frascos de vidro maciço, produzidos em série limitada.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/colecoes"
              className="inline-flex h-12 items-center justify-center rounded-full bg-champagne px-8 font-sans text-sm font-medium text-void transition-colors duration-300 hover:bg-[var(--metal-champagne-light)]"
            >
              Ver a coleção
            </a>
            <a
              href="/sobre"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-8 font-sans text-sm text-ink transition-colors duration-300 hover:border-champagne hover:text-champagne"
            >
              Nossa composição
            </a>
          </div>

          {/* Exigência da seção 26 do prompt mestre: conteúdo provisório precisa
              estar claramente identificado como fictício. */}
          <p className="mt-14 font-sans text-xs leading-relaxed text-ink-muted/70">
            Catálogo de demonstração. Todas as fragrâncias, nomes e frascos são
            fictícios e originais.
          </p>
        </div>
      </div>
    </main>
  );
}

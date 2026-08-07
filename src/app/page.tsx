import Image from "next/image";
import Link from "next/link";

import { HeroVisual } from "@/3d/HeroVisual";
import { getLineBySlug, lines } from "@/catalog/lines";
import { site } from "@/config/site";
import { LineCard } from "@/ui/LineCard";

/**
 * Home — Server Component (ARCHITECTURE.md §9): todo o texto é HTML servido
 * pelo servidor e indexável; só a cena 3D é cliente. A manchete aparece
 * mesmo se o WebGL falhar e o LCP não depende do Canvas.
 *
 * `HeroVisual` sai do servidor já com a imagem estática do hero e só troca
 * pela cena 3D depois do conteúdo pintar, e apenas em dispositivo capaz —
 * o three.js fica fora do caminho crítico do LCP.
 */
export default function Home() {
  const signature = getLineBySlug("comum-raro");
  const gridLines = lines.filter((fragrance) => fragrance.slug !== "comum-raro");

  return (
    <main id="conteudo">
      {/* ——— Hero ——— */}
      <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden">
        {/* Camada 3D — decorativa. Todo o conteúdo está no texto abaixo. */}
        <div aria-hidden="true" className="absolute inset-0">
          <HeroVisual lineKey="comumRaro" />
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
              <Link
                href="/colecoes"
                className="inline-flex h-12 items-center justify-center rounded-full bg-champagne px-8 font-sans text-sm font-medium text-void transition-colors duration-300 hover:bg-[var(--metal-champagne-light)]"
              >
                Ver a coleção
              </Link>
              <Link
                href="/sobre"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-8 font-sans text-sm text-ink transition-colors duration-300 hover:border-champagne hover:text-champagne"
              >
                Nossa composição
              </Link>
            </div>

            {/* Exigência da seção 26 do prompt mestre: conteúdo provisório precisa
                estar claramente identificado como fictício. */}
            <p className="mt-14 font-sans text-xs leading-relaxed text-ink-muted">
              {site.demoNotice}
            </p>
          </div>
        </div>
      </section>

      {/* ——— As linhas ——— */}
      <section
        aria-labelledby="linhas-heading"
        className="mx-auto w-full max-w-7xl px-6 md:px-12"
        style={{ paddingBlock: "var(--space-section)" }}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
              Catálogo
            </p>
            <h2
              id="linhas-heading"
              className="mt-4 font-display text-4xl font-light md:text-5xl"
            >
              Sete linhas, sete temperamentos
            </h2>
          </div>
          <Link
            href="/colecoes"
            className="font-sans text-sm text-ink-muted transition-colors duration-300 hover:text-champagne"
          >
            Ver todas as coleções
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridLines.map((fragrance) => (
            <LineCard key={fragrance.slug} fragrance={fragrance} />
          ))}
        </div>
      </section>

      {/* ——— A casa ——— */}
      <section
        aria-labelledby="casa-heading"
        className="border-y border-white/10 bg-slate"
      >
        <div
          className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:px-12"
          style={{ paddingBlock: "var(--space-section)" }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/media/hero/bottle-reference.jpg"
              alt="Frasco mestre da casa: vidro transparente de faces retas e tampa metálica champanhe, sobre superfície escura"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
              A casa
            </p>
            <h2
              id="casa-heading"
              className="mt-4 font-display text-4xl font-light md:text-5xl"
            >
              Feito devagar,
              <br />
              feito para durar
            </h2>
            <div className="mt-8 space-y-5 font-sans text-base leading-relaxed text-ink-muted">
              <p>
                Um único frasco para as sete linhas: vidro maciço de faces
                retas, tampa em metal champanhe escovado. O que muda é o que
                está dentro — e a cor que a luz encontra ao atravessar.
              </p>
              <p>
                Cada composição macera por semanas antes do engarrafamento,
                em lotes pequenos e numerados. Não há coleção nova por
                estação: há sete perfumes, revisados até merecerem o vidro.
              </p>
            </div>
            <Link
              href="/sobre"
              className="mt-10 inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-8 font-sans text-sm text-ink transition-colors duration-300 hover:border-champagne hover:text-champagne"
            >
              Conhecer a casa
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Assinatura ——— */}
      {signature ? (
        <section
          aria-labelledby="assinatura-heading"
          className="mx-auto w-full max-w-7xl px-6 text-center md:px-12"
          style={{ paddingBlock: "var(--space-section)" }}
        >
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-champagne">
            A assinatura da casa
          </p>
          <h2
            id="assinatura-heading"
            className="mt-4 font-display text-5xl font-light md:text-6xl"
          >
            {signature.name}
          </h2>
          <p className="mx-auto mt-6 max-w-md font-sans text-base leading-relaxed text-ink-muted">
            {signature.tagline} {signature.familyLabel}, sem estação e sem
            ocasião — o perfume que abre a casa.
          </p>
          <Link
            href={`/perfumes/${signature.slug}`}
            className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-champagne px-8 font-sans text-sm font-medium text-void transition-colors duration-300 hover:bg-[var(--metal-champagne-light)]"
          >
            Conhecer o perfume
          </Link>
        </section>
      ) : null}
    </main>
  );
}

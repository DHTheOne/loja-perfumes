import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getLineBySlug, lines } from "@/catalog/lines";
import { CinematicHero } from "@/cinema/CinematicHero";
import { openGraphFor, site } from "@/config/site";
import { LineCard } from "@/ui/LineCard";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: openGraphFor({
    url: "/",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  }),
};

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
      {/* ——— Capítulo 01 — Hero cinematográfico ———
          A rolagem percorre a cena: a câmera atravessa o concreto em direção
          ao frasco enquanto a manchete cede lugar. O último quadro do clipe é
          um close do vidro sobre fundo escuro, que é justamente o estado em
          que a seção seguinte começa — a transição entre capítulos não é um
          corte, é a continuação da mesma luz. */}
      <CinematicHero
        slug="concreto"
        eyebrow="Coleção de estreia"
        title="O que fica depois da presença"
        lede="Sete fragrâncias originais, compostas para durar no tecido e na memória. Frascos de vidro maciço, produzidos em série limitada."
        ctaHref="/colecoes"
        ctaLabel="Ver a coleção"
      />

      {/* Exigência da seção 26 do prompt mestre: conteúdo provisório precisa
          estar claramente identificado como fictício. */}
      <p className="mx-auto w-full max-w-7xl px-6 pt-10 font-sans text-xs leading-relaxed text-ink-muted md:px-12">
        {site.demoNotice}
      </p>

      {/* ——— As linhas ——— */}
      <section
        aria-labelledby="linhas-heading"
        className="mx-auto w-full max-w-7xl px-6 md:px-12"
        style={{ paddingBlock: "var(--space-section)" }}
      >
        <div className="scroll-reveal flex flex-wrap items-end justify-between gap-6">
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
          <div className="scroll-reveal relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/media/hero/bottle-reference.jpg"
              alt="Frasco mestre da casa: vidro transparente de faces retas e tampa metálica champanhe, sobre superfície escura"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="scroll-reveal">
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
          className="scroll-reveal mx-auto w-full max-w-7xl px-6 text-center md:px-12"
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

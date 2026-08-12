import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getLineBySlug, lines } from "@/catalog/lines";
import { CinematicChapter } from "@/cinema/CinematicChapter";
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

      {/* ——— Capítulo 02 — Essência ———
          MATCH CUT a partir do `concreto`. Este capítulo encosta no anterior
          sem nada entre os dois, então o último quadro do hero é literalmente
          o que está na tela quando o trilho do 02 começa — e é essa imagem que
          `matchFrom` exibe antes de dissolver na galeria. Emenda invisível.

          O `galeria` foi escolhido aqui por ter a maior amplitude de escala do
          conjunto: a câmera recua e o recuo CRIA o espaço negativo em que o
          texto entra. O movimento produz a composição, e não o contrário. */}
      <CinematicChapter
        slug="galeria"
        index="02"
        eyebrow="Essência"
        title="Uma nota não é um cheiro. É uma decisão."
        lede="Sessenta e uma notas atravessam as sete linhas. Três aparecem em mais de uma — e é onde as três se cruzam que a casa se reconhece."
        cta={{ href: "/notas", label: "Ver o guia de notas" }}
        matchFrom="concreto"
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

      {/* ——— Capítulo 03 — Atmosfera ———
          Sem match cut: entre este capítulo e o 02 existe a grade das linhas,
          então o último quadro do 02 não é o que está na tela quando o 03
          começa. Anunciar continuidade onde ela não existe seria pior que
          corte seco — o olho percebe a imagem errada dissolvendo.

          O `salao-luz` termina limpo sobre quase-preto, o que emenda com
          `--surface-void` sem precisar de corte. */}
      <CinematicChapter
        slug="salao-luz"
        index="03"
        eyebrow="Atmosfera"
        title="O rastro chega antes de você"
        lede="Sillage é o nome do que um perfume deixa no ar depois que a pessoa já passou. É o que a casa persegue: presença que não precisa ser anunciada."
        runway={240}
      />

      {/* ——— Capítulo 04 — Material ———
          MATCH CUT a partir do `salao-luz`: os dois capítulos são adjacentes.

          Este capítulo é a CARTELA DE TÍTULO da seção "A casa" logo abaixo —
          a estrutura que as quatro referências repetem: manchete sozinha sobre
          a cena, e o conteúdo detalhado montando em seguida. Por isso ele não
          leva chamada própria: o link vive na seção que ele apresenta, e dois
          botões seguidos para o mesmo destino competiriam entre si. */}
      <CinematicChapter
        slug="pedra-vapor"
        index="04"
        eyebrow="Material"
        title="Vidro maciço, metal escovado"
        lede="Faces retas que não escondem o líquido. A tampa em champanhe é a única peça que a mão encontra fria."
        matchFrom="salao-luz"
        runway={240}
      />

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

      {/* ——— Capítulo 05 — Editorial ———
          O `travertino` é o único clipe quase estático do conjunto, e é por
          isso que ele recebe o texto mais longo: cena que se move pouco aceita
          tipografia por cima sem que as duas disputem a atenção. É também o
          único com `bias: right` — o frasco fica à direita do quadro, então o
          bloco de texto vai para a esquerda em vez da base.

          Trilho mais curto (220) exatamente porque a cena é estática: dar 260
          a um clipe que quase não muda é vender rolagem sem entregar imagem. */}
      <CinematicChapter
        slug="travertino"
        index="05"
        eyebrow="Editorial"
        title="Revisados até merecerem o vidro"
        lede="Não há coleção nova por estação. Cada composição macera por semanas antes do engarrafamento, em lotes pequenos e numerados."
        runway={220}
      />

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

      {/* ——— Capítulo 06 — Fechamento ———
          O `pedestal-ambar` tem uma coluna vertical de luz que vira eixo
          central da composição, e é o único do conjunto que termina mais
          quente do que começa. Fecha a página no mesmo lugar onde ela abriu:
          um frasco, luz, e a chamada.

          Trilho de volta a 260 — o fechamento é o segundo momento (depois do
          hero) em que a pessoa aceita que a página demore. */}
      <CinematicChapter
        slug="pedestal-ambar"
        index="06"
        eyebrow="A coleção"
        title="Comece pelo que fica"
        lede="Sete linhas, uma casa. Não há ordem certa para entrar — só o frasco que a sua pele decide manter."
        cta={{ href: "/colecoes", label: "Ver a coleção" }}
      />
    </main>
  );
}

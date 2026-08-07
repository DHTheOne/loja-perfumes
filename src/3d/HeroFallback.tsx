/**
 * Fallback estático do hero — a versão da cena que sempre funciona.
 *
 * É ela que aparece sem WebGL, com `prefers-reduced-motion`, em dispositivo
 * fraco (ARCHITECTURE.md §9) e enquanto a cena 3D ainda não foi baixada. Como
 * é renderizada no servidor, é o elemento de LCP do hero: o texto e a imagem
 * chegam prontos, sem depender de JavaScript.
 *
 * Por que <picture> e não next/image: os dois arquivos são recortes
 * diferentes, não a mesma imagem em escalas diferentes — hero-desktop é
 * 1920x1081 (paisagem, frasco à direita) e hero-mobile é 1080x1919 (retrato,
 * frasco centrado). Isso é art direction, e next/image não a suporta: ele
 * gera srcset de um único src. As alternativas seriam esticar o recorte
 * paisagem no celular (a composição que o relatório apontou como inadequada)
 * ou renderizar dois <Image> alternados por CSS, o que baixa os dois arquivos
 * porque `display: none` não impede o fetch.
 */
export function HeroFallback() {
  return (
    <picture>
      <source
        media="(max-width: 767px)"
        srcSet="/media/hero/hero-mobile.jpg"
        width={1080}
        height={1919}
      />
      {/* `@next/next/no-img-element` não dispara aqui: a regra abre exceção
          para <img> dentro de <picture>, que é justamente o caso de art
          direction descrito acima. */}
      <img
        src="/media/hero/hero-desktop.jpg"
        alt="Frasco de perfume em vidro transparente com tampa metálica champanhe, sobre superfície escura polida"
        width={1920}
        height={1081}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center md:object-right"
      />
    </picture>
  );
}

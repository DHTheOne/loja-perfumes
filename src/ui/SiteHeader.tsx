import Link from "next/link";

import { site } from "@/config/site";
import { BagLink } from "@/ui/BagLink";

const navItems = [
  { href: "/colecoes", label: "Coleções" },
  { href: "/notas", label: "Notas" },
  { href: "/sobre", label: "Sobre" },
] as const;

/**
 * Header fixo sobre o conteúdo. O véu em gradiente garante contraste do
 * wordmark sobre a cena 3D do hero sem criar uma barra opaca — a página
 * de luxo escuro não pode abrir com um retângulo chapado no topo.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-champagne focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-void"
      >
        Pular para o conteúdo
      </a>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/85 via-void/40 to-transparent"
      />

      <div className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-12">
        {/* `shrink-0` é o que impede a colisão, e não o tamanho da fonte.
            Num flex container o item encolhe abaixo da largura do próprio
            conteúdo quando falta espaço — a caixa do wordmark ficava menor que
            a palavra e o texto vazava por cima da navegação. Verificado em
            375 px (iPhone SE, 11 mini): "sillage" sobre "COLEÇÕES". A correção
            anterior mediu 390 px, onde ainda cabia por alguns pixels. */}
        <Link
          href="/"
          className="shrink-0 font-display text-xl font-medium lowercase tracking-[0.08em] text-ink transition-colors duration-300 hover:text-champagne sm:text-2xl"
        >
          {site.name}
          <span className="sr-only"> — página inicial</span>
        </Link>

        {/* O espaçamento cede antes do conteúdo.
            Com quatro itens mais o wordmark, `gap-8` e `tracking-[0.25em]`
            estouravam 390 px: o wordmark colidia com "Coleções" e "Sacola"
            saía da tela — verificado em captura no iPhone 13. Esconder itens
            resolveria a largura tirando navegação de quem tem menos espaço
            para procurá-la; apertar o respiro custa só respiro. */}
        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-3 sm:gap-4 md:gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                {/* `inline-flex` + `py-3.5` levam a área clicável a ~44px de
                    altura sem alterar o layout: o contêiner tem altura fixa
                    (h-20) e os itens são centralizados, então o padding cresce
                    só o alvo de toque. Texto de 12px sem padding deixava o
                    alvo em ~16px — abaixo dos 24px do WCAG 2.2 SC 2.5.8 e
                    bem abaixo dos 44px recomendados para dedo. */}
                <Link
                  href={item.href}
                  className="inline-flex items-center py-3.5 font-sans text-[11px] uppercase tracking-[0.12em] md:text-xs md:tracking-[0.25em] text-ink-muted transition-colors duration-300 hover:text-champagne"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <BagLink />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

import { site } from "@/config/site";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/colecoes", label: "Coleções" },
  { href: "/sobre", label: "Sobre" },
] as const;

/**
 * Páginas legais ainda não existem (fase de conteúdo institucional).
 * Aparecem como texto inerte para não criar links quebrados — vira lista
 * de <Link> quando as rotas forem criadas.
 */
const upcomingLegal = [
  "Política de privacidade",
  "Termos de compra",
  "Trocas e devoluções",
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-medium lowercase tracking-[0.08em] text-ink">
              {site.name}
            </p>
            <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-ink-muted">
              {site.tagline}. Composições próprias, frascos de vidro maciço,
              produção em série limitada.
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted">
              Navegar
            </h2>
            <ul className="mt-4 space-y-3">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-ink transition-colors duration-300 hover:text-champagne"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-xs uppercase tracking-[0.25em] text-ink-muted">
              Institucional
            </h2>
            <ul className="mt-4 space-y-3">
              {upcomingLegal.map((label) => (
                <li key={label} className="font-sans text-sm text-ink-muted/70">
                  {label}
                  <span className="ml-2 text-xs uppercase tracking-widest text-ink-muted/50">
                    em preparação
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <p className="font-sans text-xs leading-relaxed text-ink-muted/70">
            {site.demoNotice}
            {site.isProvisionalName ? " Nome da loja provisório." : null}
          </p>
        </div>
      </div>
    </footer>
  );
}

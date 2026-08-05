# ADR-0001 — Stack da aplicação

- **Status:** proposto
- **Data:** 2026-08-04
- **Decide:** proprietário, mediante aprovação de `ARCHITECTURE.md`

## Contexto

A loja precisa de SEO forte em catálogo, experiência premium com 3D opcional,
checkout seguro e manutenção viável por uma equipe muito pequena — este é o
primeiro projeto comercial do proprietário.

O requisito de SEO e o requisito de interatividade puxam em direções opostas:
renderização no servidor favorece indexação; interatividade rica favorece cliente.

## Decisão

**Next.js com App Router, TypeScript em modo `strict`, Tailwind CSS com design
system próprio, React Three Fiber para 3D e GSAP para animação de scroll.**

Server Components como padrão. `"use client"` apenas onde há interação real.

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| SPA (Vite + React) com API separada | SEO de catálogo exigiria renderização no servidor de qualquer forma, e dois artefatos para operar dobram o custo de manutenção sem ganho no v1 |
| Astro | Excelente para conteúdo, mas checkout e admin têm interatividade e estado que fogem do ponto forte |
| Plataforma pronta de e-commerce | Descartada pelo escopo: o prompt mestre pede um produto próprio, e o requisito de 3D e identidade visual não cabe bem em tema de plataforma |
| Biblioteca de UI pronta (MUI, Chakra) | A direção visual é o diferencial do produto. Sobrescrever uma biblioteca até que ela deixe de parecer genérica custa mais do que construir os componentes necessários |

## Consequências

**Positivas**

- Um único artefato para operar, testar e implantar.
- Renderização no servidor resolve SEO sem trabalho extra.
- Server Components reduzem JavaScript enviado ao cliente, o que protege o
  desempenho em celular intermediário — critério explícito de sucesso.
- Preço e regra de negócio ficam naturalmente no servidor, reforçando
  `SECURITY_PLAN.md` §2.

**Negativas**

- A fronteira servidor/cliente do App Router é uma fonte real de erro para quem
  está começando. Mitigação: a regra de dependência de `ARCHITECTURE.md` §3 e
  revisão focada nessa fronteira.
- Acoplamento ao ecossistema do framework. Aceito: a camada `domain/` é código
  puro, sem framework, e migra se necessário.
- 3D acrescenta peso. Mitigado por carregamento tardio e fallback obrigatório.

/**
 * Identidade provisória da loja.
 *
 * `[NOME_DA_LOJA]` segue pendente de decisão do proprietário
 * (PROJECT_BRIEF §7). "Sillage" é um wordmark PROVISÓRIO — termo de
 * perfumaria para o rastro que um perfume deixa, coerente com a manchete
 * do hero ("O que fica depois da presença"). Trocar o nome definitivo é
 * trocar as constantes abaixo; nada mais no código repete estes valores.
 */
export const site = {
  name: "Sillage",
  isProvisionalName: true,
  tagline: "Perfumaria autoral em série limitada",
  /** Aviso exigido pela seção 26 do prompt mestre. */
  demoNotice:
    "Catálogo de demonstração. Todas as fragrâncias, nomes e frascos são fictícios e originais.",
} as const;

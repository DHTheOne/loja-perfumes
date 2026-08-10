import { render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";

import { BagProvider } from "@/bag/BagProvider";

/**
 * `render` com os provedores globais da aplicação.
 *
 * Hoje só a sacola. Componentes que a consomem — `BagLink` no header,
 * `AddToBag` na página de produto — lançam fora do provedor, de propósito:
 * um contexto com valor padrão silencioso esconderia a montagem errada até
 * alguém notar que a sacola não guarda nada.
 *
 * Cada teste começa com armazenamento limpo. Sem isso a sacola vazaria de um
 * caso para o outro, já que o `localStorage` do jsdom é do arquivo inteiro.
 */
export function renderWithProviders(ui: ReactElement): RenderResult {
  window.localStorage.clear();
  return render(<BagProvider>{ui}</BagProvider>);
}

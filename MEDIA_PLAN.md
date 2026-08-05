# PLANO DE MÍDIA — [NOME_DA_LOJA]

> Documento exigido pela Fase 1. Atualizado em 2026-08-04.
> Fonte de requisitos: seções 7 (ativos e qualidade) e 26 (conteúdo inicial) do prompt mestre.

## 1. Decisão vigente do proprietário

| Decisão | Valor | Data |
|---|---|---|
| Abordagem de mídia | **Placeholders neutros agora; prévia gerada por ferramentas gratuitas** | 2026-08-04 |
| Geração paga (KAIROGEN) | Adiada até haver saldo — ver seção 7 | 2026-08-04 |

Consequência prática: **nenhuma geração paga será executada nesta fase.** O
desenvolvimento das Fases 2 a 5 não depende de mídia final.

## 2. Restrições inegociáveis de conteúdo

Derivadas das seções 26 e 31 do prompt mestre. Valem para qualquer ferramenta,
gratuita ou paga.

1. Todas as fragrâncias são **fictícias e originais**, marcadas como tal no seed.
2. Proibido reproduzir nome, frasco, rótulo, embalagem ou identidade visual
   confundível com marca real de perfumaria.
3. Proibido gerar avaliações, selos, certificações ou prêmios fictícios.
4. Evitar texto dentro da imagem — o texto entra por HTML, o que preserva
   acessibilidade, SEO e permite traduzir depois.
5. Toda imagem de composição precisa de **área negativa** reservada para
   sobreposição de texto.

### Verificação legal pendente antes do lançamento

- [ ] Confirmar nos termos de uso vigentes de cada ferramenta se a saída pode ser
      usada **comercialmente** no plano contratado. Planos de consumidor às vezes
      têm termos diferentes dos planos de API.
- [ ] Registrar que imagens do Google carregam marca d'água invisível (SynthID).
      Não impede uso comercial, mas é um fato a documentar.
- [ ] Busca de anterioridade de marca para os nomes de linha propostos na seção 5
      antes de qualquer uso comercial.

## 3. Estratégia em três trilhas

As trilhas são independentes. A trilha A destrava o layout hoje; a B dá a prévia
realista; a C é a produção final.

### Trilha A — Placeholder programático (custo zero, automático)

Objetivo: permitir que o layout, o grid, o carregamento progressivo e o corte
responsivo sejam construídos e testados **sem depender de nenhuma imagem real**.

- SVG gerado por script, com gradiente da paleta do design system, proporção
  correta por slot e rótulo do slot ao centro.
- Resolução irrelevante — SVG é vetorial, serve em qualquer densidade.
- Também gera a variante `blur placeholder` (LQIP) usada durante o carregamento.
- Vantagem sobre serviços online de placeholder: funciona offline, não vaza
  requisições para terceiros e já usa a paleta real do projeto.

**Status:** a implementar na Fase 4 (design system). Script previsto em
`scripts/gen-placeholders.mjs`.

### Trilha B — Prévia realista com ferramentas que o proprietário já assina

Objetivo declarado pelo proprietário: *"ter uma noção de como ficará"*.

O proprietário possui **ChatGPT Plus** e **Google AI Pro (Gemini)**. Ambos incluem
geração de imagem e vídeo dentro de cotas do plano, sem custo adicional por peça.

| Ferramenta | Plano | Melhor uso neste projeto | Resolução |
|---|---|---|---|
| **Nano Banana Pro** (Gemini 3 Pro Image) | Google AI Pro | **Primária para imagem.** Saída nativa em 4K; aceita imagens de referência, o que resolve a consistência do frasco entre produtos | até 4K nativo |
| **GPT Image** (ChatGPT) | ChatGPT Plus | Exploração de composição e direção de arte; segunda opinião visual | ~1–2K, precisa upscale |
| **Veo 3.1** (via Gemini / Flow) | Google AI Pro | Clipes curtos do hero, com movimento suave | 1080p |
| **Sora** (via ChatGPT) | ChatGPT Plus | Alternativa de vídeo para o hero | 1080p |

Recomendação: **Nano Banana Pro como ferramenta principal**. É a única das quatro
que entrega 4K nativo, o que elimina o passo de upscale e atende diretamente a
exigência da seção 7 do prompt mestre.

Os prompts prontos para colar estão em `docs/media/PROMPTS.md`.

> As cotas desses planos mudam com frequência e não são verificáveis por este
> repositório. Trate os limites como desconhecidos e gere de forma incremental.

### Trilha C — KAIROGEN (produção final, pago)

Reservada para quando houver saldo. Vantagem sobre a trilha B: geração em lote via
MCP, reprodutível, versionada e sem trabalho manual de copiar e colar. Cálculo de
custo na seção 7.

## 4. Pipeline de finalização — inteiramente gratuito

Independe da trilha usada para gerar. Roda na máquina local, sem custo por peça.

```
1. GERAR       Nano Banana Pro (4K) ou GPT Image / Sora / Veo
                 ↓
2. UPSCALE     Somente se a origem for menor que 4K.
               Upscayl (open source, offline, Real-ESRGAN) — Windows.
                 ↓
3. CORTAR      Enquadramentos desktop / mobile / quadrado / OG.
                 ↓
4. OTIMIZAR    sharp (Node) → AVIF + WebP + fallback JPEG,
               múltiplas larguras para `srcset`, LQIP embutido.
                 ↓
5. ENTREGAR    public/media/... servido com cache longo e nome versionado.
```

O passo 4 é código do projeto, não trabalho manual: um script processa a pasta de
originais inteira. Thumbnails **nunca** são gerados por IA — saem de
redimensionamento local, com custo zero e resultado consistente.

### Alternativa ao vídeo que vale considerar

Um hero em vídeo custa cota, pesa no carregamento e é difícil de dirigir. Um *still*
4K com movimento lento de câmera feito em CSS/GSAP (parallax ou Ken Burns):

- não consome nenhuma cota de geração;
- carrega muito mais rápido, o que protege o LCP exigido na seção de performance;
- respeita `prefers-reduced-motion` trivialmente;
- é reversível — se o vídeo real ficar bom depois, troca-se o componente.

**Recomendação:** construir o hero primeiro com still + movimento CSS. Tratar vídeo
como melhoria opcional, não como requisito da primeira entrega.

## 5. Linhas de produto do seed — propostas

Sete linhas fictícias derivadas da seção 26. **Nomes são proposta, pendentes de
aprovação do proprietário e de busca de anterioridade de marca.**

| # | Família (prompt mestre) | Nome proposto | Direção visual |
|---|---|---|---|
| 1 | Amadeirada | Lenho Vigil | Vidro âmbar escuro, grão de madeira, luz lateral quente |
| 2 | Cítrica | Alba Cítrica | Vidro claro, luz fria da manhã, respingo suspenso |
| 3 | Floral | Flora Velada | Vidro leitoso, pétala desfocada, luz difusa alta |
| 4 | Oriental | Âmbar Secreto | Vidro fumê, latão escovado, luz baixa e dramática |
| 5 | Aquática | Maré Clara | Vidro azulado translúcido, cáustica de água |
| 6 | Coleção noturna | Noturno Absoluto | Vidro preto opaco, reflexo único, fundo quase preto |
| 7 | Coleção unissex | Comum Raro | Vidro incolor, geometria limpa, fundo neutro médio |

## 6. Inventário de ativos

Cobre os 14 tipos exigidos pela seção 7. Premissa: **10 produtos no seed**
(7 linhas + 3 variações de volume tratadas como SKU próprio com foto).

| Bloco | Qtd | Observação |
|---|---|---|
| Galeria de produto | 40 | 4 ângulos × 10 produtos |
| Close-up de frasco | 10 | Detalhe de válvula, tampa e textura do vidro |
| Imagem principal de campanha | 2 | Desktop 16:9 e mobile 9:16 |
| Fundos cinematográficos | 6 | 3 cenas × 2 enquadramentos |
| Categorias e coleções | 14 | 7 linhas × 2 enquadramentos |
| Cenas de notas olfativas | 9 | Abstratas: saída, coração, fundo × 3 variações |
| Banners | 8 | 4 peças × 2 enquadramentos |
| Open Graph | 8 | 1 home + 7 linhas |
| Redes sociais | 6 | Quadrado e vertical |
| Texturas | 8 | Vidro, papel, tecido, metal — para o design system |
| Referências para modelagem 3D | 6 | Ortográficas do frasco: frente, lado, topo |
| Vídeos do hero | 6 | 3 cenas × 16:9 e 9:16, 6 s cada |
| **Total** | **123** | Thumbnails e peças promocionais derivam destes |

## 7. Cálculo de saldo KAIROGEN

Custos **medidos** com `estimate_cost` na conta `drkzzinmalado`. Crédito a
R$ 0,175. Verificado que o custo em créditos é **idêntico nos planos free e pro** —
a estimativa não muda com o plano contratado.

| Modelo | Uso | Créditos | R$ |
|---|---|---|---|
| `z-image-turbo` | Texturas | 1 | 0,18 |
| `seedream-v4-5` | Produto, categorias, OG — **4096×4096 nativo** | 2 | 0,35 |
| `nano-banana-pro` | Campanha | 6 | 1,05 |
| `veo3-1-lite` | Vídeo 6 s | 12 | 2,10 |
| `veo-3-1-fast` | Vídeo 6 s, melhor controle | 23 | 4,03 |

### Custo bruto do inventário

| Bloco | Modelo | Créditos |
|---|---|---|
| Galeria de produto (40) | seedream-v4-5 | 80 |
| Close-ups (10) | seedream-v4-5 | 20 |
| Campanha (2) | nano-banana-pro | 12 |
| Fundos (6) | seedream-v4-5 | 12 |
| Categorias (14) | seedream-v4-5 | 28 |
| Notas olfativas (9) | seedream-v4-5 | 18 |
| Banners (8) | seedream-v4-5 | 16 |
| Open Graph (8) | seedream-v4-5 | 16 |
| Redes sociais (6) | seedream-v4-5 | 12 |
| Texturas (8) | z-image-turbo | 8 |
| Referências 3D (6) | seedream-v4-5 | 12 |
| Vídeos (6) | veo3-1-lite | 72 |
| **Bruto** | | **306** |

### Fator de retentativa

306 créditos assume acerto na primeira tentativa em todas as 123 peças. Isso não
acontece. Manter o mesmo frasco reconhecível entre 10 produtos, preservar área
negativa e evitar rótulo deformado exige iteração real.

- Imagem: **2×** → 234 × 2 = **468**
- Vídeo: **2,5×** → 72 × 2,5 = **180**

### Faixas

| Cenário | Escopo | Créditos | Custo |
|---|---|---|---|
| Mínimo viável | 10 produtos × 3 fotos, campanha, 7 categorias, 1 OG | **176** | **R$ 31** |
| **Recomendado** | Catálogo completo, sem vídeo | **468** | **R$ 82** |
| Completo | Tudo, com vídeo do hero | **648** | **R$ 114** |

**Recomendação: ~500 créditos (≈ R$ 88).** Cobre o cenário recomendado com folga
para retrabalho. Vídeo fica de fora: representa 28% do custo total no item de menor
impacto sobre conversão, e a alternativa em CSS da seção 4 resolve o hero sem cota.

### Ressalvas

1. R$ 0,175/crédito é a taxa observada no plano **free**. Planos pagos podem ter
   crédito mais barato; o custo em créditos não muda, o custo em reais pode cair.
2. `maxConcurrentGenerations: 1` no plano free torna a geração serial e lenta.
3. Upscale não foi precificado — busca por modelo Topaz retornou zero resultados.
   Como `seedream-v4-5` entrega 4096×4096 nativo, provavelmente é desnecessário.
4. Se o catálogo real tiver mais que 10 produtos, o bloco de produto escala em
   **+10 créditos por perfume** (5 imagens × 2 cr).

## 8. Convenção de arquivos

```
media/source/          ← originais 4K. FORA do Git (ver .gitignore)
public/media/
  products/<slug>/     01-hero  02-angle  03-detail  04-context  close
  collections/<slug>/  desktop  mobile
  categories/<slug>/   desktop  mobile
  notes/               top-1 … base-3
  backgrounds/         <cena>-desktop  <cena>-mobile
  banners/             <peca>-desktop  <peca>-mobile
  og/                  home  <slug>
  social/              <peca>-square  <peca>-story
  textures/            glass  paper  fabric  metal
  video/               hero-<cena>-16x9.mp4  hero-<cena>-9x16.mp4
  refs-3d/             bottle-front  bottle-side  bottle-top
```

**Originais 4K não entram no Git.** Um PNG 4096×4096 passa de 20 MB; 123 deles
inviabilizam o repositório. Apenas as versões otimizadas em `public/media/` são
versionadas. Os originais ficam em `media/source/`, ignorado pelo Git, com backup
fora do repositório.

## 9. Critério de aceite de um ativo

Um ativo só é aprovado se cumprir todos os itens:

- [ ] Sem texto legível gerado dentro da imagem
- [ ] Sem deformação no frasco, na tampa ou na válvula
- [ ] Frasco visualmente consistente com os demais ativos do mesmo produto
- [ ] Área negativa suficiente onde haverá sobreposição de texto
- [ ] Sem semelhança com embalagem ou identidade de marca real
- [ ] 4K na origem, ou upscaled para 4K sem artefato visível
- [ ] Existe variante desktop e mobile quando o slot exige
- [ ] Exportado em AVIF e WebP, com fallback e `srcset`
- [ ] `alt` descritivo redigido — acessibilidade é requisito, não opcional

## 10. Próximo passo

1. Proprietário aprova (ou substitui) os nomes de linha da seção 5.
2. Gerar de 3 a 5 imagens de teste pela trilha B usando `docs/media/PROMPTS.md`,
   para validar a direção visual antes de produzir as 123 peças.
3. Decidir sobre crédito KAIROGEN à luz do resultado da trilha B.

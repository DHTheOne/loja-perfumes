# Análise do lote 01 de mídia gerada

> Avaliação contra os critérios de `MEDIA_PLAN.md` §9 e as regras fixas de
> `docs/media/PROMPTS.md` §2. Data: 2026-08-04.
> Origem dos arquivos: `docs/media/source/` — 34 imagens, 6 vídeos, 87 MB.

## Veredito resumido

| Grupo | Arquivos | Veredito |
|---|---|---|
| **A** — imagens do ChatGPT | 32 PNG | **Aprovado para prévia e layout.** Reprovado para produção apenas por resolução |
| **B** — 2 JPEG + 6 vídeos | 8 arquivos | **Reprovado para uso de produto.** Aproveitável só como fundo, com o frasco removido |

## Grupo A — 32 imagens do ChatGPT

Dimensões: 1254×1254 (1:1), 1122×1402 (4:5), 1672×941 (16:9), 941×1672 (9:16).
Todas em ~1,6 MP.

| Critério (§9) | Resultado |
|---|---|
| Sem texto legível gerado | **Passa** — nenhuma ocorrência |
| Sem deformação em frasco, tampa ou válvula | **Passa** |
| Frasco consistente entre ativos | **Passa** — silhueta, chanfro e tampa champanhe idênticos ao mestre em todas as variações verificadas |
| Área negativa para sobreposição de texto | **Passa** — 16:9 com metade esquerda livre; 9:16 com metade superior livre; 4:5 com canto superior esquerdo livre |
| Sem semelhança com marca real | **Passa** — face lisa, sem rótulo |
| **4K na origem ou upscaled** | **Passa após upscale** — ver §Upscale abaixo. Origem tinha 1,6 MP |
| Variante desktop e mobile | **Passa** — pares 16:9 e 9:16 presentes |
| AVIF/WebP com `srcset` | Pendente — etapa do pipeline, não da geração |
| `alt` descritivo | Pendente — redação posterior |

**Conclusão:** a direção visual está correta e a consistência do frasco funcionou.
O único bloqueio real é resolução, e ele é resolvível sem regerar nada: Upscayl
(gratuito, offline) leva 1254² a 5016² em lote. Regerar não é necessário.

### Upscale — executado em 2026-08-04

As 32 imagens do grupo A foram ampliadas para 4K e gravadas em
`docs/media/source/_upscaled-4k/` (fora do Git, 256 MB).

| Método | Lanczos, via ffmpeg, local e offline |
|---|---|
| Regra | Maior lado ajustado a 4096 px, proporção preservada |
| Resultado | 17 em 4096×4096 (16 MP), 3 em 3278×4096 (12,8 MP), 12 em ~4096×2304 (9 MP) |
| Menor do lote | **9 MP** — acima dos 8,3 MP de 4K |
| Custo | Zero. Nenhum download, nenhuma cota |

**O que o upscale entrega e o que não entrega.** Lanczos é interpolação: ele
aumenta a contagem de pixels sem reconstruir detalhe que não existia. A
inspeção 1:1 da tampa escovada mostra estrias preservadas, anéis do colar
nítidos e nenhum halo, ringing ou serrilhado — resultado limpo porque a origem
é síntese sem ruído nem compressão, que é justamente o que um filtro desses
costuma amplificar.

Portanto: o critério de resolução de `MEDIA_PLAN.md` §9 está **atendido em
dimensão e sem artefato visível**, que é o texto do critério. Não é o mesmo que
detalhe capturado em 4K na origem.

**Alternativa se a nitidez não bastar:** Real-ESRGAN ncnn-vulkan, gratuito e
offline, roda bem na GPU disponível (Radeon RX 7600). Reconstrói micro-detalhe
em vez de interpolar. Risco a observar: em gradientes muito suaves — o fundo
escuro e o vidro — modelos desse tipo às vezes introduzem banding ou textura
inventada. Vale comparar em duas ou três imagens antes de aplicar ao lote.

## Grupo B — 2 JPEG e 6 vídeos

Dimensões: JPEG 2752×1536 (4,2 MP); vídeos 6 s, quatro em 1920×1080, um em
1080×1920, um em 720×1280.

Falham em três pontos, todos previstos em `PROMPTS.md` §14:

1. **Frasco diferente do mestre.** Tampa facetada preta com colar dourado
   serrilhado, ombros angulados, líquido âmbar. Não é o frasco retangular de
   tampa cilíndrica champanhe definido como mestre. Quebra a consistência de
   catálogo por completo.
2. **Emblema gravado no vidro.** Um brasão dourado (círculo com haste vertical)
   aparece em todos os vídeos. Logo é proibido pelas regras fixas.
3. **Texto queimado na imagem.** `Perfume_bottle_on_dark_background_202608042307.jpeg`
   traz "OBSIDIAN BLOOM", "EAU DE PARFUM" e um monograma "M".
   Além de violar a regra de "sem texto", "Obsidian Bloom" é um nome que não passou
   por busca de anterioridade de marca — risco R8.

**Pontos positivos:** iluminação e atmosfera excelentes; área negativa à esquerda
bem resolvida; maior resolução do lote.

**Aproveitamento possível:** recortar o frasco e usar apenas o fundo — fumaça,
mármore e feixe de luz — como textura de seção. Nessa forma, não há frasco
divergente, nem logo, nem texto.

## Causa provável

O grupo B foi gerado sem anexar o frasco mestre como imagem de referência. É
exatamente o modo de falha descrito em `PROMPTS.md` §1: sem referência anexada, o
modelo inventa um frasco novo a cada geração.

## Ações

| # | Ação | Custo |
|---|---|---|
| 1 | Upscale do grupo A para 4K com Upscayl | Zero, offline |
| 2 | Regerar os vídeos **anexando o frasco mestre** como primeiro quadro | Cota do plano |
| 3 | Reservar o grupo B apenas para fundo, com o frasco recortado | Zero |
| 4 | Gerar as 6 referências ortográficas (`PROMPTS.md` §12) — ainda ausentes | Cota do plano |
| 5 | Descartar o nome "Obsidian Bloom" | — |

## Impacto no inventário

Do inventário de 123 ativos de `MEDIA_PLAN.md` §6, este lote cobre parcialmente:
campanha, fundos, categorias e galeria de um único produto. Faltam as demais linhas
de fragrância, notas olfativas, banners, Open Graph, redes sociais, texturas e as
referências ortográficas para modelagem.

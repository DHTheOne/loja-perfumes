# Especificação — Coleção visual do frasco mestre

Data: 2026-08-07
Status: design aprovado; geração pendente de validação desta especificação

## Objetivo

Criar uma coleção coerente de mídia para o site Loja Perfumes usando o mesmo frasco mestre em todas as peças. A coleção terá quatro cenas cinematográficas, quatro pranchas correspondentes para apoio à modelagem 3D e um vídeo de seis segundos baseado na direção Lenho Vigil.

## Referências e fonte de identidade

- Frasco obrigatório: `docs/media/source/_master-bottle.png`.
- Referência de atmosfera: `docs/media/source/Perfume_bottle_in_store_2K_202608042308.jpeg`.
- Referência de organização das vistas 3D: `docs/media/source/ChatGPT Image 4 de ago. de 2026, 22_40_18.png`.
- As duas referências visuais orientam apenas composição, luz, clima e apresentação. O frasco, a tampa, as proporções e os materiais-base não devem ser copiados delas.

## Invariantes do frasco

- Preservar a silhueta, as proporções, os ombros, a base e a tampa cilíndrica do frasco mestre.
- Manter a tampa em acabamento metálico champanhe escovado.
- Não acrescentar rótulos, símbolos, monogramas, inscrições ou logotipos.
- Não substituir o frasco por um modelo facetado, mais baixo ou com tampa preta.
- Entre as quatro linhas, variar somente a aparência do vidro/líquido, a iluminação e o cenário.

## Abordagem escolhida

Usar pares ancorados no frasco mestre. Cada cena cinematográfica e sua respectiva prancha 3D devem receber o arquivo mestre como referência obrigatória. A prancha deve reproduzir a mesma variante de vidro da cena correspondente.

## Linhas visuais

### 1. Lenho Vigil

- Vidro e líquido: âmbar profundo, translúcido e elegante.
- Cenário: madeira escura e superfície polida em ambiente carvão.
- Luz: principal quente vinda da esquerda e recorte mais duro por trás.
- Clima: íntimo, sofisticado, levemente enfumaçado.
- Uso adicional: imagem-base do vídeo.

### 2. Alba Cítrica

- Vidro e líquido: claro, quase cristalino, com reflexos amarelo-pálidos.
- Cenário: pedra clara de textura discreta.
- Luz: fria e difusa, com um pequeno acento solar suave.
- Clima: luminoso, fresco e minimalista.

### 3. Maré Clara

- Vidro e líquido: azul translúcido, sem saturação excessiva.
- Cenário: superfície escura sutilmente úmida, sem gotas sobre o frasco.
- Luz: azul-aquática lateral com recorte neutro.
- Clima: mineral, sereno e atmosférico.

### 4. Noturno Absoluto

- Vidro e líquido: preto fumê, ainda revelando espessura e transparência nas bordas.
- Cenário: carvão profundo com superfície de baixa reflexão.
- Luz: contraluz dramática e pequeno acento quente lateral.
- Clima: denso, premium e escultórico.

## Entregáveis

### Imagens cinematográficas

- Quatro arquivos, um por linha visual.
- Proporção 16:9; resolução mínima de 1920 × 1080; alvo de 3840 × 2160 quando suportado.
- Composição de herói para e-commerce: frasco no terço direito e espaço negativo útil à esquerda, sem texto incorporado.
- Fotorealismo, profundidade de campo rasa e reflexos controlados.

### Pranchas para modelagem 3D

- Quatro arquivos, um correspondente a cada imagem cinematográfica.
- Uma prancha por variante com vistas frontal, lateral direita e superior do mesmo frasco.
- Projeção ortográfica, fundo cinza neutro, luz plana e uniforme.
- Sem sombra projetada, reflexo de cenário, profundidade de campo ou distorção de perspectiva.
- Separação clara entre as vistas, sem títulos, legendas ou outras marcas.
- Resolução-alvo de 2048 × 2048 ou superior.

As pranchas são referências visuais de modelagem, não desenhos técnicos dimensionados. A geometria deverá ser conferida contra o arquivo mestre.

### Vídeo Lenho Vigil

- Duração: 6 segundos.
- Formato: 1920 × 1080, 16:9, MP4, 24 ou 30 fps.
- Áudio: ausente; o arquivo final não deve conter faixa de áudio.
- Plano único, sem cortes, tremores, saltos de zoom ou alterações súbitas.
- Câmera: deslocamento lento e contínuo para a direita, em arco de aproximadamente 15 graus, com aproximação quase imperceptível.
- Ação ambiental: apenas névoa muito leve reagindo à luz de recorte.
- Luz e cenário: carvão profundo, superfície escura polida, luz principal quente à esquerda e recorte duro por trás.
- Loop: primeiro e último enquadramentos visualmente próximos, sem transição brusca perceptível.
- Proibições: texto, logotipo, pessoas, mãos ou movimento de objetos adicionais.

## Estrutura de saída

Os arquivos devem ser organizados fora da pasta de fontes originais:

```text
docs/media/generated/master-bottle-collection-2026-08-07/
├── cinematic/
│   ├── 01-lenho-vigil.png
│   ├── 02-alba-citrica.png
│   ├── 03-mare-clara.png
│   └── 04-noturno-absoluto.png
├── refs-3d/
│   ├── 01-lenho-vigil-orthographic.png
│   ├── 02-alba-citrica-orthographic.png
│   ├── 03-mare-clara-orthographic.png
│   └── 04-noturno-absoluto-orthographic.png
├── video/
│   └── 01-lenho-vigil-loop-6s-1080p.mp4
└── prompts/
    └── generation-prompts.txt
```

## Fluxo de produção

1. Gerar e verificar as quatro cenas cinematográficas com o frasco mestre anexado a cada solicitação.
2. Gerar uma prancha ortográfica correspondente a cada variante aprovada.
3. Comparar todas as peças com o frasco mestre e rejeitar deriva geométrica ou elementos proibidos.
4. Usar a cena aprovada de Lenho Vigil como quadro de referência para geração de vídeo por imagem-para-vídeo.
5. Remover qualquer faixa de áudio e validar duração, resolução, continuidade e proximidade entre os quadros inicial e final.
6. Registrar os prompts efetivamente usados, incluindo ajustes feitos após reprovações.

## Critérios de aceitação

- O mesmo frasco mestre é reconhecível e geometricamente consistente nas oito imagens e no vídeo.
- Cada cena possui uma prancha 3D com a mesma variante de vidro/líquido.
- Não há texto, logotipo, pessoa, mão, rótulo inventado nem aparência de marca real.
- As quatro cenas são distintas em material visual, luz e ambiente, mas pertencem à mesma coleção.
- As imagens têm composição útil para o herói do site e não contêm texto embutido.
- O vídeo tem exatamente seis segundos, 1080p, proporção 16:9 e nenhuma faixa de áudio.
- O movimento do vídeo é contínuo e lento; não há corte, tremor ou salto de zoom.
- A diferença visual entre o primeiro e o último quadro é pequena o suficiente para um loop suave.

## Riscos e controles

- Deriva do formato do frasco: anexar o mestre em todas as gerações e comparar silhuetas antes de aceitar.
- Texto ou logotipo alucinado: declarar as proibições nos prompts e rejeitar qualquer ocorrência.
- Inconsistência entre cena e prancha: gerar cada prancha a partir do mesmo mestre e da descrição de material da respectiva cena.
- Loop imperfeito: priorizar enquadramento quase estático, limitar o arco e verificar os quadros inicial e final.
- Perda de qualidade no site: preservar os originais e produzir derivados WebP/AVIF somente em uma etapa posterior de integração.


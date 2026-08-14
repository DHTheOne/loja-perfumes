import { getLineBySlug } from "@/catalog/lines";
import type { FragranceLine } from "@/catalog/types";
import {
  artDirection,
  clip,
  type CinemaClip,
  type ClipArtDirection,
  type ClipSlug,
} from "@/cinema/clips";

/**
 * A sequência de abertura: qual cena apresenta qual perfume.
 *
 * ESTE ARQUIVO É A ÚNICA DECISÃO EDITORIAL DA PRÉVIA — e ela precisa do seu
 * aval, porque o projeto não a tinha.
 *
 * Os seis clipes de `public/media/cinema/` são CENAS DE AMBIENTE, não tomadas
 * de produto: chamam-se `concreto`, `galeria`, `travertino` — lugares, não
 * fragrâncias. Nenhum arquivo do projeto associa clipe a perfume. Como a
 * apresentação precisa mostrar nome, família, frase e preço sobre cada vídeo,
 * o vínculo teve de ser criado.
 *
 * NÃO foi criado por gosto. Cada par sai de dois dados que já estavam no
 * repositório: a cor e a descrição de ambiente em `ART_DIRECTION`
 * (src/cinema/clips.ts) e a cor de vidro da linha em `src/ui/tokens.ts`. O
 * campo `porque` registra o critério de cada par, para você discordar com
 * precisão em vez de no geral.
 *
 * REORDENAR: mexa só na ordem desta lista. TROCAR UM PAR: troque o `line`.
 * Nada mais no código depende desta ordem — mas veja `TRANSITIONS` abaixo: as
 * emendas são afinadas POR PAR de cenas, e um par novo cai no padrão neutro.
 *
 * FORA DA SEQUÊNCIA: `noturno-absoluto`. O vidro da linha é #141414 e a frase
 * é "feito para depois da meia-noite"; nenhuma das seis cenas é noturna. Pôr
 * essa fragrância sobre um salão de luz quente diria ao visitante o oposto do
 * que ela é. Duplicar clipe ou buscar vídeo de fora estava descartado por
 * instrução, então a linha fica de fora — e o README diz isso.
 */

export type SequenceEntry = {
  clip: ClipSlug;
  line: string;
  /** Critério do par. Vive aqui, nunca na tela. */
  porque: string;
};

export const SEQUENCE: readonly SequenceEntry[] = [
  {
    clip: "salao-luz",
    line: "alba-citrica",
    porque:
      "ART_DIRECTION: 'luz de janela quente atravessando névoa'. A linha é 'o primeiro minuto da manhã, retido em vidro'. É a mesma hora do dia.",
  },
  {
    clip: "pedra-vapor",
    line: "flora-velada",
    porque:
      "A cena tem vapor contínuo; a linha é 'flores atrás de um véu de luz'. O véu da frase é o vapor da cena.",
  },
  {
    clip: "travertino",
    line: "lenho-vigil",
    porque:
      "ART_DIRECTION: 'travertino e bronze — o mais quente do conjunto'. A linha é 'a madeira que guarda o fim da tarde'.",
  },
  {
    clip: "concreto",
    line: "mare-clara",
    porque:
      "Ambiente #2b3238, 'cinza-azulado frio'. O vidro da Maré Clara é #a8c4cc — a única linha de paleta fria. Aquática sobre pedra fria.",
  },
  {
    clip: "galeria",
    line: "comum-raro",
    porque:
      "Ambiente #20242a, galeria fria e neutra. O vidro da Comum Raro é #dcdcd8, o mais neutro do catálogo. Cena sem temperatura para a linha sem estação.",
  },
  {
    clip: "pedestal-ambar",
    line: "ambar-secreto",
    porque:
      "Névoa âmbar densa sobre pedestal; a linha é a oriental de âmbar. O par mais direto dos seis, e por isso fecha a sequência.",
  },
] as const;

/**
 * ——— As emendas ———
 *
 * As seis cenas não são seis cenas. Olhando o primeiro e o último quadro de
 * cada clipe: é O MESMO frasco, na mesma posição, na mesma altura de câmera,
 * sobre a mesma base escura. O que muda de um clipe para outro é a luz e o
 * fundo, não o assunto. A continuidade já está no material — só não estava
 * sendo usada.
 *
 * A PRIMEIRA VERSÃO DISTO ESTAVA ERRADA, e vale registrar por quê.
 *
 * A ideia era fazer o clipe que entra chegar vestindo o enquadramento do que
 * sai, com correções de 10% a 22% do quadro, estimadas a olho sobre o primeiro
 * e o último quadro de cada clipe. Congelado o composto no meio da emenda
 * `pedra-vapor -> travertino`, o resultado era um FRASCO DUPLO evidente: o que
 * sai no centro e o que entra deslocado para a direita.
 *
 * A medição desfez a premissa. Tomando o centroide da energia de gradiente —
 * que nestas cenas localiza o frasco porque ele é a única coisa nítida num
 * fundo todo desfocado —, a distância horizontal entre o que sai e o que entra
 * é, nas cinco junções: 0,076 · 0,008 · 0,115 · 0,034 · 0,024 do quadro.
 * Mediana de 3,4%. AS CENAS JÁ ESTAVAM ALINHADAS — mesmo frasco, mesmo eixo,
 * mesma altura de câmera. Correções de 10% a 22% sobre material que já casava
 * dentro de 3% não corrigiam desalinhamento: produziam-no.
 *
 * O QUE SOBROU, e que é o que de fato importa: a emenda acontece com os dois
 * clipes EM MOVIMENTO (ver HomeShowcase), e a camada que sai nunca perde
 * opacidade. Isso já entrega a continuidade; o reenquadramento nunca foi a
 * parte importante.
 *
 * O que resta aqui é modesto de propósito:
 *
 * - `scale` entre 1,03 e 1,08 — um respiro que relaxa depois do dissolve, o
 *   suficiente para o olho ler câmera ainda andando, pequeno demais para
 *   desalinhar o que já casa.
 * - `x` e `y` nunca passam de ±(scale−1)/2, que é a sobra que a ampliação
 *   criou de cada lado. `resolveEnter` trava isso, então o pior erro possível
 *   nesta tabela é um empurrão de 4% — perceptível como movimento, jamais como
 *   objeto duplicado. Os valores vêm da medição, truncados por essa folga.
 * - `inPoint` corta a cabeça de um plano quando a medição mostra ganho real. É
 *   o caso do travertino, e só dele: em 0s seu frasco está em 0,668 e em 2,2s
 *   em 0,575, contra 0,567 de quem sai. O corte de cabeça fecha uma distância
 *   de 0,10 que transform nenhum fecharia sem ampliar a ponto de borrar.
 *
 * NEM TODO CORTE É CASAMENTO DE OBJETO. Onde a disparidade é grande demais
 * para transform (o `travertino -> concreto`, de 0,115), o corte se apoia em
 * outra coisa que as duas cenas têm em comum — uma forma, ou o eixo da luz — e
 * no clarão da emenda. O campo `match` registra em qual das três ele se apoia.
 */
export type SceneTransition = {
  /** Segundos em que os dois clipes correm JUNTOS. */
  overlap: number;
  /** Escala de entrada. 1 = entra no próprio enquadramento. */
  scale: number;
  /** Deslocamento de entrada, em fração da largura/altura do quadro. */
  x: number;
  y: number;
  /** Segundo em que o clipe que entra começa. Corta a cabeça do plano. */
  inPoint: number;
  /** Em que a emenda se apoia. */
  match: "objeto" | "grafico" | "luminancia";
  porque: string;
};

/** Sem afinação: dissolve curto, sem reenquadramento. Nunca abre borda. */
export const NEUTRAL_TRANSITION: SceneTransition = {
  overlap: 1.6,
  scale: 1,
  x: 0,
  y: 0,
  inPoint: 0,
  match: "objeto",
  porque: "Par não afinado — dissolve neutro.",
};

/** Chave: `${clipe que sai}->${clipe que entra}`. */
export const TRANSITIONS: Readonly<Record<string, SceneTransition>> = {
  "salao-luz->pedra-vapor": {
    overlap: 1.8,
    scale: 1.04,
    x: -0.02,
    y: -0.0045,
    inPoint: 0,
    match: "objeto",
    porque:
      "A emenda mais fácil das cinco, e por isso abre. O salão termina com o frasco recortado no PRETO; a pedra começa com o mesmo frasco, no mesmo eixo, só que dentro de uma sala acesa. Nada precisa se mover: a sala é que acende ao redor do frasco. Distância medida: 0,076 — o empurrão de 2% fecha parte dela e o resto some no clarão.",
  },
  "pedra-vapor->travertino": {
    overlap: 2.6,
    scale: 1.04,
    x: 0,
    y: 0,
    inPoint: 2.2,
    match: "luminancia",
    porque:
      "A EMENDA MAIS FRACA DAS CINCO, e o registro é honesto porque a decisão de fundo é sua. Congelado o composto no meio dela, aparecem dois frascos: o da pedra em ~0,47 da largura e o do travertino em ~0,72. Um quarto do quadro de distância. Transform não fecha isso — precisaria de um deslocamento maior que a folga da própria ampliação e abriria borda vazia. Entrar mais tarde no plano também não: o travertino só centraliza perto de 5s, e entrar ali deixaria a cena com um segundo de tela antes da emenda seguinte. Então esta não é emenda de objeto. É de luz: sem reenquadramento (que aqui só somaria risco), o dissolve mais longo dos cinco e o desfoque reforçado, para a mudança acontecer dentro do clarão. A CORREÇÃO DE VERDADE É EDITORIAL — separar estas duas cenas na ordem da sequência —, e isso é decisão de quem assina a apresentação, não do código.",
  },
  "travertino->concreto": {
    overlap: 2,
    scale: 1.05,
    x: 0.025,
    y: 0.025,
    inPoint: 0,
    match: "grafico",
    porque:
      "A maior distância das cinco (0,115) e o maior salto de temperatura: âmbar quente para azul-cinza frio. Transform não resolve — o concreto abre num plano largo, com o frasco pequeno e alto, e ampliar até casar borraria a imagem. O que as duas cenas têm em comum é FORMA: o travertino fecha com um arco curvo atrás do frasco, e o concreto abre com um arco de concreto sob ele. A curva permanece enquanto tudo o mais troca, e a temperatura vira dentro do clarão, não como virada de cor.",
  },
  "concreto->galeria": {
    overlap: 1.7,
    scale: 1.05,
    x: -0.025,
    y: -0.025,
    inPoint: 0,
    match: "objeto",
    porque:
      "Distância de 0,034. O concreto termina em close extremo, com o frasco preenchendo o quadro; a galeria abre em close, no mesmo eixo. Os dois frascos ficam praticamente um sobre o outro e só a luz troca — de fria e dura para quente e difusa. É a emenda que menos precisa de ajuda.",
  },
  "galeria->pedestal-ambar": {
    overlap: 2.2,
    scale: 1.08,
    x: 0.0259,
    y: -0.04,
    inPoint: 0,
    match: "luminancia",
    porque:
      "Distância de 0,024, mas o frasco do pedestal é bem menor no quadro — casar tamanho pediria 2,3x e a imagem chegaria borrada. Não precisa: o pedestal abre com uma COLUNA VERTICAL DE LUZ no centro exato onde está o frasco da galeria, e o frasco da galeria, em contraluz, é a coisa mais clara do quadro. O corte é de luminância — a mancha clara não se move, o frasco vira a coluna de luz. O dissolve mais longo dos cinco, para a luz ter tempo de assumir.",
  },
  "pedestal-ambar->salao-luz": {
    overlap: 2.4,
    scale: 1.05,
    x: 0,
    y: 0,
    inPoint: 0,
    match: "luminancia",
    porque:
      "A VOLTA DO LAÇO, e a emenda que mais precisa não se anunciar: é exatamente aqui que a pessoa descobriria estar vendo a mesma coisa de novo. Trabalha a favor o fato de as duas serem as cenas mais quentes do conjunto — âmbar denso e luz de janela dourada — e de as duas terem uma mancha clara vertical atrás do frasco: a coluna de luz do pedestal e o vão em arco da janela do salão. É de luminância, sem reenquadramento, num dos dissolves mais longos. Se um dia a ordem da sequência mudar, esta chave deixa de casar e o par novo cai no dissolve neutro — que é o comportamento certo, e não um bug.",
  },
};

/**
 * Trava a transição no que é geometricamente seguro.
 *
 * `scale` nunca abaixo de 1, senão o quadro encolhe e aparece o fundo pela
 * borda. Deslocamento nunca além de (scale−1)/2, que é exatamente a sobra que
 * a ampliação criou de cada lado — um pixel além e a lateral se descobre.
 * Valor digitado à mão erra; esta função faz o erro virar um corte mais tímido
 * em vez de um retângulo vazio na tela.
 */
export function resolveEnter(
  from: ClipSlug | null,
  to: ClipSlug,
): SceneTransition {
  if (!from) return { ...NEUTRAL_TRANSITION, overlap: 0 };

  const tuned = TRANSITIONS[`${from}->${to}`] ?? NEUTRAL_TRANSITION;
  const scale = Math.max(1, tuned.scale);
  const room = (scale - 1) / 2;
  const clamp = (value: number) => Math.max(-room, Math.min(room, value));

  return { ...tuned, scale, x: clamp(tuned.x), y: clamp(tuned.y) };
}

/** Uma cena montada: o clipe, a arte e a fragrância que ela apresenta. */
export type ShowcaseScene = {
  clip: CinemaClip;
  art: ClipArtDirection;
  line: FragranceLine;
  porque: string;
  /** Como esta cena CHEGA, vinda da anterior. A primeira chega sem emenda. */
  enter: SceneTransition;
};

/**
 * Monta a sequência, descartando par cujo perfume não exista no catálogo.
 *
 * O descarte é silencioso de propósito: se uma linha sair do catálogo, a
 * prévia perde aquela cena e continua rodando. Lançar aqui derrubaria a home
 * inteira por causa de uma entrada de dados — e esta é a tela de abertura,
 * não uma transação.
 */
export function buildScenes(): readonly ShowcaseScene[] {
  const kept = SEQUENCE.flatMap((entry) => {
    const line = getLineBySlug(entry.line);
    return line ? [{ entry, line }] : [];
  });

  /* A emenda é resolvida DEPOIS do descarte, contra a cena que de fato ficou
     antes. Resolver contra a lista original faria uma linha ausente deixar
     para trás o reenquadramento de um par que não existe mais na tela. */
  return kept.map(({ entry, line }, position) => ({
    clip: clip(entry.clip),
    art: artDirection(entry.clip),
    line,
    porque: entry.porque,
    enter: resolveEnter(
      position === 0 ? null : kept[position - 1].entry.clip,
      entry.clip,
    ),
  }));
}

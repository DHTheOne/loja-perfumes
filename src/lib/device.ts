/**
 * Critérios mensuráveis de capacidade do dispositivo.
 *
 * ARCHITECTURE.md §9 exige fallback estático "sem WebGL, com
 * `prefers-reduced-motion`, ou em dispositivo fraco". As duas primeiras
 * condições são binárias; "dispositivo fraco" precisava de uma definição
 * verificável — é o que este módulo fixa.
 *
 * As funções recebem as capacidades como argumento em vez de ler `navigator`
 * direto: isso as torna testáveis sem stub de global e deixa explícito que a
 * decisão depende só de dados de entrada.
 */

/** Abaixo de qualquer um destes limiares, a cena 3D não é carregada. */
export const WEAK_DEVICE_THRESHOLDS = {
  /** Núcleos lógicos. Celulares de entrada ficam em 2–4. */
  minLogicalCores: 4,
  /** Memória em GB. `deviceMemory` é reportado em degraus: 0.25/0.5/1/2/4/8. */
  minMemoryGB: 4,
} as const;

/** Tipos de conexão em que baixar three.js + drei não se justifica. */
const SLOW_CONNECTIONS = new Set(["slow-2g", "2g"]);

/**
 * Subconjunto de `navigator` que nos interessa. `deviceMemory` e `connection`
 * não estão na lib padrão do TS porque não são universais — daí o tipo local.
 */
export type DeviceCapabilities = {
  hardwareConcurrency?: number;
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

/**
 * Sinal ausente nunca conta como fraco.
 *
 * `deviceMemory` e `connection` só existem em navegadores Chromium; Safari e
 * Firefox não os expõem. Tratar ausência como fraqueza puniria todo usuário
 * dessas plataformas com o fallback. A política é otimista: só rebaixamos
 * quando o dispositivo declara um número abaixo do limiar.
 */
export function isWeakDevice(capabilities: DeviceCapabilities): boolean {
  // Economia de dados é escolha explícita do usuário: respeitamos sempre.
  if (capabilities.connection?.saveData === true) return true;

  const effectiveType = capabilities.connection?.effectiveType;
  if (effectiveType !== undefined && SLOW_CONNECTIONS.has(effectiveType)) {
    return true;
  }

  const cores = capabilities.hardwareConcurrency;
  if (
    typeof cores === "number" &&
    cores > 0 &&
    cores < WEAK_DEVICE_THRESHOLDS.minLogicalCores
  ) {
    return true;
  }

  const memory = capabilities.deviceMemory;
  if (
    typeof memory === "number" &&
    memory > 0 &&
    memory < WEAK_DEVICE_THRESHOLDS.minMemoryGB
  ) {
    return true;
  }

  return false;
}

/** Lê as capacidades do `navigator` atual. Só chamar no cliente. */
export function readDeviceCapabilities(
  navigatorLike: Navigator,
): DeviceCapabilities {
  const extended = navigatorLike as Navigator & DeviceCapabilities;
  return {
    hardwareConcurrency: extended.hardwareConcurrency,
    deviceMemory: extended.deviceMemory,
    connection: extended.connection,
  };
}

/**
 * Detecta suporte a WebGL sem manter vivo o contexto de teste.
 *
 * Cada contexto WebGL consome memória de GPU e os navegadores limitam quantos
 * podem existir por página; sem `loseContext()` a sondagem gastaria um slot
 * que a cena real precisa.
 */
export function detectWebGL(doc: Document): boolean {
  try {
    const canvas = doc.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

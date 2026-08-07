import { describe, expect, it } from "vitest";

import {
  WEAK_DEVICE_THRESHOLDS,
  isWeakDevice,
  detectWebGL,
} from "@/lib/device";

/**
 * O critério de "dispositivo fraco" decide se a cena 3D chega a ser baixada.
 * Errar para o lado permissivo custa GPU em celular; errar para o restritivo
 * tira o 3D de quem poderia vê-lo. Os dois lados estão cobertos aqui.
 */
describe("isWeakDevice", () => {
  it("considera capaz o dispositivo que não informa nada", () => {
    // Safari e Firefox não expõem deviceMemory nem connection.
    expect(isWeakDevice({})).toBe(false);
  });

  it("considera capaz um desktop folgado", () => {
    expect(
      isWeakDevice({
        hardwareConcurrency: 8,
        deviceMemory: 8,
        connection: { saveData: false, effectiveType: "4g" },
      }),
    ).toBe(false);
  });

  it("respeita o modo de economia de dados mesmo em hardware forte", () => {
    expect(
      isWeakDevice({
        hardwareConcurrency: 16,
        deviceMemory: 8,
        connection: { saveData: true, effectiveType: "4g" },
      }),
    ).toBe(true);
  });

  it.each(["slow-2g", "2g"])("rebaixa em conexão %s", (effectiveType) => {
    expect(
      isWeakDevice({
        hardwareConcurrency: 8,
        deviceMemory: 8,
        connection: { effectiveType },
      }),
    ).toBe(true);
  });

  it.each(["3g", "4g"])("não rebaixa em conexão %s", (effectiveType) => {
    expect(
      isWeakDevice({
        hardwareConcurrency: 8,
        deviceMemory: 8,
        connection: { effectiveType },
      }),
    ).toBe(false);
  });

  it("rebaixa abaixo do limiar de núcleos e aceita no limiar", () => {
    const { minLogicalCores } = WEAK_DEVICE_THRESHOLDS;

    expect(isWeakDevice({ hardwareConcurrency: minLogicalCores - 1 })).toBe(
      true,
    );
    expect(isWeakDevice({ hardwareConcurrency: minLogicalCores })).toBe(false);
  });

  it("rebaixa abaixo do limiar de memória e aceita no limiar", () => {
    const { minMemoryGB } = WEAK_DEVICE_THRESHOLDS;

    expect(isWeakDevice({ deviceMemory: minMemoryGB / 2 })).toBe(true);
    expect(isWeakDevice({ deviceMemory: minMemoryGB })).toBe(false);
  });

  it("ignora valores zerados em vez de tratá-los como fraqueza", () => {
    // hardwareConcurrency === 0 significa "não sei", não "zero núcleos".
    expect(isWeakDevice({ hardwareConcurrency: 0, deviceMemory: 0 })).toBe(
      false,
    );
  });
});

describe("detectWebGL", () => {
  it("retorna false quando o canvas não entrega contexto", () => {
    const doc = {
      createElement: () => ({ getContext: () => null }),
    } as unknown as Document;

    expect(detectWebGL(doc)).toBe(false);
  });

  it("retorna false, sem lançar, quando o navegador rejeita a sondagem", () => {
    const doc = {
      createElement: () => {
        throw new Error("bloqueado por política de segurança");
      },
    } as unknown as Document;

    expect(detectWebGL(doc)).toBe(false);
  });

  it("libera o contexto de teste quando há suporte", () => {
    let liberado = false;
    const doc = {
      createElement: () => ({
        getContext: () => ({
          getExtension: () => ({
            loseContext: () => {
              liberado = true;
            },
          }),
        }),
      }),
    } as unknown as Document;

    expect(detectWebGL(doc)).toBe(true);
    expect(liberado).toBe(true);
  });
});

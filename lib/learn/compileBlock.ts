export type CompileOk<T> = { ok: true; value: T };
export type CompileErr = { ok: false; error: string };
export type CompileResult<T> = CompileOk<T> | CompileErr;

export function compileCalculatorSource(
  source: string,
): CompileResult<(xa: number, ya: number) => unknown> {
  const trimmed = source.trim();
  try {
    const factory = new Function(
      `"use strict";\n${trimmed}\nif (typeof compute !== "function") {\n  throw new Error("Define function compute() { ... } using top-level let x; and let y;");\n}\nreturn (xa, ya) => {\n  x = Number(xa);\n  y = Number(ya);\n  return compute();\n};\n`,
    ) as () => (xa: number, ya: number) => unknown;
    const runner = factory();
    return { ok: true, value: runner };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

export function compileResultPreviewSource(
  source: string,
): CompileResult<(input: number) => unknown> {
  const trimmed = source.trim();
  try {
    const factory = new Function(
      `"use strict";\n${trimmed}\nif (typeof result !== "function") {\n  throw new Error("Define function result(count) { ... } using top-level let x;");\n}\nreturn (input) => {\n  const n = Number(input);\n  x = n;\n  return result(n);\n};\n`,
    ) as () => (input: number) => unknown;
    const runner = factory();
    return { ok: true, value: runner };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

export function compileChatterBoxSource(
  source: string,
): CompileResult<() => unknown> {
  const trimmed = source.trim();
  try {
    const factory = new Function(
      `"use strict";\n${trimmed}\nif (typeof shout !== "function") {\n  throw new Error("Define function shout() { ... }");\n}\nreturn () => shout();\n`,
    ) as () => () => unknown;
    const runner = factory();
    return { ok: true, value: runner };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

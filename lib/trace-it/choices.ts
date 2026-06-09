import type { TraceItLevel, TraceRow } from "./types";
import { rowsEqual } from "./trace";

function cloneRow(row: TraceRow): TraceRow {
  return {
    label: row.label,
    vars: { ...row.vars },
    condition: row.condition ? { ...row.condition } : undefined,
    lineId: row.lineId,
  };
}

function mutateRow(
  row: TraceRow,
  varNames: string[],
  varMutations: Partial<Record<string, number | null>>,
  cond?: boolean | null
): TraceRow {
  const next = cloneRow(row);
  for (const name of varNames) {
    if (name in varMutations) {
      next.vars[name] = varMutations[name] as number | null;
    }
  }
  if (cond !== undefined && next.condition) {
    next.condition = { ...next.condition, result: cond };
  }
  return next;
}

function rowKey(row: TraceRow, varNames: string[]): string {
  const vars = varNames.map((n) => `${n}:${row.vars[n]}`).join("|");
  const cond = row.condition?.result ?? "null";
  return `${row.label}|${vars}|${cond}`;
}

/** Generate 3–4 multiple-choice row options including the correct answer. */
export function generateChoices(
  correct: TraceRow,
  level: TraceItLevel,
  hard = false
): TraceRow[] {
  const { varNames } = level;
  const candidates: TraceRow[] = [cloneRow(correct)];
  const seen = new Set([rowKey(correct, varNames)]);

  function add(row: TraceRow) {
    const key = rowKey(row, varNames);
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push(row);
  }

  const numVars = varNames.filter((n) => correct.vars[n] !== null);

  for (const name of numVars) {
    const v = correct.vars[name];
    if (v === null) continue;
    add(mutateRow(correct, varNames, { [name]: v + 1 }));
    add(mutateRow(correct, varNames, { [name]: v - 1 }));
    if (!hard) {
      add(mutateRow(correct, varNames, { [name]: v + 2 }));
    }
  }

  if (correct.condition && correct.condition.result !== null) {
    add(mutateRow(correct, varNames, {}, !correct.condition.result));
  }

  if (hard) {
    for (const name of numVars) {
      const v = correct.vars[name];
      if (v === null) continue;
      add(
        mutateRow(
          correct,
          varNames,
          { [name]: v + 1 },
          correct.condition?.result ?? null
        )
      );
    }
    const labelMatch = correct.label.match(/^loop (\d+)$/);
    if (labelMatch) {
      const n = Number(labelMatch[1]);
      add({ ...cloneRow(correct), label: `loop ${n + 1}` });
      if (n > 1) add({ ...cloneRow(correct), label: `loop ${n - 1}` });
    }
  }

  if (correct.label === "done") {
    for (const name of numVars) {
      const v = correct.vars[name];
      if (v === null) continue;
      add(mutateRow(correct, varNames, { [name]: v - 1 }, true));
    }
  }

  const targetCount = hard ? 4 : 3;
  let i = 0;
  while (candidates.length < targetCount && i < 20) {
    const name = numVars[i % numVars.length];
    const v = correct.vars[name];
    if (v !== null) {
      add(mutateRow(correct, varNames, { [name]: v + i + 3 }));
    }
    i += 1;
  }

  while (candidates.length < 3) {
    add(mutateRow(correct, varNames, { [varNames[0]]: (correct.vars[varNames[0]] ?? 0) + candidates.length + 5 }));
  }

  return shuffle(candidates.slice(0, Math.max(3, Math.min(targetCount, candidates.length))));
}

export function formatRowLabel(row: TraceRow, varNames: string[], conditionExpr?: string): string {
  const parts = varNames.map((n) => {
    const v = row.vars[n];
    return v === null ? "—" : String(v);
  });
  if (conditionExpr && row.condition) {
    const cond =
      row.condition.result === null ? "—" : row.condition.result ? "true" : "false";
    parts.push(cond);
  }
  return `${row.label}: ${parts.join(", ")}`;
}

export function pickMatches(pick: TraceRow, correct: TraceRow, varNames: string[]): boolean {
  return rowsEqual(pick, correct, varNames);
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

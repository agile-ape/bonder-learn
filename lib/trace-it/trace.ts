import {
  evalCondition,
  type LoopCondition,
  type Stmt,
  type TraceItLevel,
  type TraceRow,
} from "./types";

type Env = Record<string, number>;

function evalRhs(rhs: { kind: "num"; value: number } | { kind: "var"; name: string }, env: Env): number {
  return rhs.kind === "num" ? rhs.value : env[rhs.name];
}

function executeStmt(stmt: Stmt, env: Env): string {
  switch (stmt.type) {
    case "let":
      env[stmt.name] = stmt.value;
      return stmt.id;
    case "assign": {
      const rhsVal = evalRhs(stmt.rhs, env);
      if (stmt.op === "=") env[stmt.name] = rhsVal;
      else if (stmt.op === "+=") env[stmt.name] = (env[stmt.name] ?? 0) + rhsVal;
      else env[stmt.name] = (env[stmt.name] ?? 0) - rhsVal;
      return stmt.id;
    }
    case "increment":
      env[stmt.name] = (env[stmt.name] ?? 0) + stmt.delta;
      return stmt.id;
    default:
      return stmt.id;
  }
}

function runBody(body: Stmt[], env: Env): string | null {
  let lastLineId: string | null = null;
  for (const stmt of body) {
    lastLineId = executeStmt(stmt, env);
  }
  return lastLineId;
}

function snapshotVars(varNames: string[], env: Env): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  for (const name of varNames) {
    out[name] = name in env ? env[name] : null;
  }
  return out;
}

function conditionCell(
  expr: string | undefined,
  condition: LoopCondition | undefined,
  env: Env
): TraceRow["condition"] {
  if (!expr || !condition) return undefined;
  return { expr, result: evalCondition(condition, env) };
}

function runForLoop(
  stmt: Extract<Stmt, { type: "for" }>,
  env: Env,
  varNames: string[],
  conditionExpr: string | undefined,
  rows: TraceRow[],
  loopCounter: { n: number }
): void {
  env[stmt.var] = stmt.init;

  if (!evalCondition(stmt.condition, env)) {
    rows.push({
      label: "done",
      vars: snapshotVars(varNames, env),
      condition: conditionCell(conditionExpr, stmt.condition, env),
      lineId: `${stmt.id}-exit`,
    });
    return;
  }

  while (evalCondition(stmt.condition, env)) {
    loopCounter.n += 1;
    const lineId = runBody(stmt.body, env);

    rows.push({
      label: `loop ${loopCounter.n}`,
      vars: snapshotVars(varNames, env),
      condition: conditionCell(conditionExpr, stmt.condition, env),
      lineId,
    });

    env[stmt.var] = env[stmt.var] + stmt.increment.delta;
  }

  rows.push({
    label: "done",
    vars: snapshotVars(varNames, env),
    condition: conditionCell(conditionExpr, stmt.condition, env),
    lineId: `${stmt.id}-exit`,
  });
}

function runWhileLoop(
  stmt: Extract<Stmt, { type: "while" }>,
  env: Env,
  varNames: string[],
  conditionExpr: string | undefined,
  rows: TraceRow[],
  loopCounter: { n: number }
): void {
  if (!evalCondition(stmt.condition, env)) {
    rows.push({
      label: "done",
      vars: snapshotVars(varNames, env),
      condition: conditionCell(conditionExpr, stmt.condition, env),
      lineId: `${stmt.id}-exit`,
    });
    return;
  }

  while (evalCondition(stmt.condition, env)) {
    loopCounter.n += 1;
    const lineId = runBody(stmt.body, env);

    rows.push({
      label: `loop ${loopCounter.n}`,
      vars: snapshotVars(varNames, env),
      condition: conditionCell(conditionExpr, stmt.condition, env),
      lineId,
    });
  }

  rows.push({
    label: "done",
    vars: snapshotVars(varNames, env),
    condition: conditionCell(conditionExpr, stmt.condition, env),
    lineId: `${stmt.id}-exit`,
  });
}

/** Build the full display trace for a level (answer key). */
export function buildFullTrace(level: TraceItLevel): TraceRow[] {
  const env: Env = {};
  const rows: TraceRow[] = [];
  const loopCounter = { n: 0 };
  let stepNum = 0;

  rows.push({
    label: "start",
    vars: Object.fromEntries(level.varNames.map((n) => [n, null])),
    condition: level.conditionExpr ? { expr: level.conditionExpr, result: null } : undefined,
    lineId: null,
  });

  for (const stmt of level.program) {
    switch (stmt.type) {
      case "let":
      case "assign":
      case "increment": {
        const lineId = executeStmt(stmt, env);
        stepNum += 1;
        rows.push({
          label: `step ${stepNum}`,
          vars: snapshotVars(level.varNames, env),
          condition: level.conditionExpr
            ? { expr: level.conditionExpr, result: null }
            : undefined,
          lineId,
        });
        break;
      }
      case "for":
        runForLoop(stmt, env, level.varNames, level.conditionExpr, rows, loopCounter);
        break;
      case "while":
        runWhileLoop(stmt, env, level.varNames, level.conditionExpr, rows, loopCounter);
        break;
    }
  }

  return rows;
}

export function rowsEqual(a: TraceRow, b: TraceRow, varNames: string[]): boolean {
  if (a.label !== b.label) return false;
  for (const name of varNames) {
    if (a.vars[name] !== b.vars[name]) return false;
  }
  const aCond = a.condition?.result ?? null;
  const bCond = b.condition?.result ?? null;
  return aCond === bCond;
}

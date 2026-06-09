export type CompareOp = "<" | "<=" | ">" | ">=";

export type LoopCondition = {
  var: string;
  op: CompareOp;
  limit: number;
};

export type Stmt =
  | { type: "let"; name: string; value: number; id: string }
  | { type: "assign"; name: string; op: "=" | "+=" | "-="; rhs: Rhs; id: string }
  | { type: "increment"; name: string; delta: number; id: string }
  | {
      type: "for";
      var: string;
      init: number;
      condition: LoopCondition;
      increment: { name: string; delta: number };
      body: Stmt[];
      id: string;
    }
  | {
      type: "while";
      condition: LoopCondition;
      body: Stmt[];
      id: string;
    };

export type Rhs = { kind: "num"; value: number } | { kind: "var"; name: string };

export type LevelMode = "watch" | "predict" | "predict-hard";

export type TraceItLevel = {
  id: number;
  slug: string;
  title: string;
  mode: LevelMode;
  program: Stmt[];
  /** Variable names to show in table (order matters). */
  varNames: string[];
  /** Condition column expression label, e.g. "i<10". Omit when no loop. */
  conditionExpr?: string;
  intro?: string;
};

export type TraceRow = {
  label: string;
  vars: Record<string, number | null>;
  condition?: { expr: string; result: boolean | null };
  lineId: string | null;
};

export type CodeLine = {
  id: string;
  text: string;
  indent: number;
  highlightable: boolean;
};

let idCounter = 0;

export function resetIdCounter() {
  idCounter = 0;
}

export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function letVar(name: string, value: number, id?: string): Stmt {
  return { type: "let", name, value, id: id ?? nextId("let") };
}

export function assign(
  name: string,
  op: "=" | "+=" | "-=",
  rhs: Rhs,
  id?: string
): Stmt {
  return { type: "assign", name, op, rhs, id: id ?? nextId("assign") };
}

export function increment(name: string, delta = 1, id?: string): Stmt {
  return { type: "increment", name, delta, id: id ?? nextId("inc") };
}

export function forLoop(
  config: Omit<Extract<Stmt, { type: "for" }>, "type" | "id"> & { id?: string }
): Stmt {
  return { type: "for", ...config, id: config.id ?? nextId("for") };
}

export function whileLoop(
  config: Omit<Extract<Stmt, { type: "while" }>, "type" | "id"> & { id?: string }
): Stmt {
  return { type: "while", ...config, id: config.id ?? nextId("while") };
}

export function defineLevel(
  config: Omit<TraceItLevel, "id"> & { id: number }
): TraceItLevel {
  return config;
}

export function formatConditionExpr(c: LoopCondition): string {
  return `${c.var}${c.op}${c.limit}`;
}

export function evalCondition(c: LoopCondition, vars: Record<string, number>): boolean {
  const v = vars[c.var];
  switch (c.op) {
    case "<":
      return v < c.limit;
    case "<=":
      return v <= c.limit;
    case ">":
      return v > c.limit;
    case ">=":
      return v >= c.limit;
  }
}

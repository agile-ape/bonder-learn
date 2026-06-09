import {
  assign,
  defineLevel,
  forLoop,
  increment,
  letVar,
  resetIdCounter,
  whileLoop,
  type TraceItLevel,
} from "./types";

function buildLevels(): TraceItLevel[] {
  resetIdCounter();

  return [
    // ── Group 1: Variables (Mode A) ─────────────────────────────────────
    defineLevel({
      id: 0,
      slug: "start",
      title: "Start",
      mode: "watch",
      varNames: ["y"],
      program: [letVar("y", 5)],
    }),
    defineLevel({
      id: 1,
      slug: "step",
      title: "Step",
      mode: "watch",
      varNames: ["y"],
      program: [letVar("y", 2), increment("y"), increment("y")],
    }),

    // ── Group 2: Counter loops (Mode B) ─────────────────────────────────
    defineLevel({
      id: 2,
      slug: "three-laps",
      title: "Three laps",
      mode: "predict",
      varNames: ["i", "y"],
      conditionExpr: "i<3",
      program: [
        letVar("y", 0),
        forLoop({
          var: "i",
          init: 0,
          condition: { var: "i", op: "<", limit: 3 },
          increment: { name: "i", delta: 1 },
          body: [increment("y")],
        }),
      ],
    }),
    defineLevel({
      id: 3,
      slug: "count-both",
      title: "Count both",
      mode: "predict",
      varNames: ["i", "y"],
      conditionExpr: "i<5",
      program: [
        letVar("y", 2),
        forLoop({
          var: "i",
          init: 1,
          condition: { var: "i", op: "<", limit: 5 },
          increment: { name: "i", delta: 1 },
          body: [increment("y")],
        }),
      ],
    }),
    defineLevel({
      id: 4,
      slug: "use-i",
      title: "Use i",
      mode: "predict",
      varNames: ["i", "y"],
      conditionExpr: "i<4",
      program: [
        letVar("y", 0),
        forLoop({
          var: "i",
          init: 1,
          condition: { var: "i", op: "<", limit: 4 },
          increment: { name: "i", delta: 1 },
          body: [assign("y", "+=", { kind: "var", name: "i" })],
        }),
      ],
    }),
    defineLevel({
      id: 5,
      slug: "nine-laps",
      title: "Nine laps",
      mode: "predict",
      varNames: ["i", "y"],
      conditionExpr: "i<10",
      program: [
        letVar("y", 2),
        forLoop({
          var: "i",
          init: 1,
          condition: { var: "i", op: "<", limit: 10 },
          increment: { name: "i", delta: 1 },
          body: [increment("y")],
        }),
      ],
    }),

    // ── Group 3: Edge cases + off-by-one ────────────────────────────────
    defineLevel({
      id: 6,
      slug: "never-runs",
      title: "Never runs",
      mode: "predict",
      varNames: ["i", "y"],
      conditionExpr: "i<0",
      program: [
        letVar("y", 0),
        forLoop({
          var: "i",
          init: 1,
          condition: { var: "i", op: "<", limit: 0 },
          increment: { name: "i", delta: 1 },
          body: [increment("y")],
        }),
      ],
    }),
    defineLevel({
      id: 7,
      slug: "one-lap",
      title: "One lap",
      mode: "predict",
      varNames: ["i", "y"],
      conditionExpr: "i<1",
      program: [
        letVar("y", 0),
        forLoop({
          var: "i",
          init: 0,
          condition: { var: "i", op: "<", limit: 1 },
          increment: { name: "i", delta: 1 },
          body: [increment("y")],
        }),
      ],
    }),
    defineLevel({
      id: 8,
      slug: "sum",
      title: "Sum",
      mode: "predict",
      varNames: ["i", "sum"],
      conditionExpr: "i<4",
      program: [
        letVar("sum", 0),
        forLoop({
          var: "i",
          init: 1,
          condition: { var: "i", op: "<", limit: 4 },
          increment: { name: "i", delta: 1 },
          body: [assign("sum", "+=", { kind: "var", name: "i" })],
        }),
      ],
    }),
    defineLevel({
      id: 9,
      slug: "less-than",
      title: "Less than",
      mode: "predict-hard",
      varNames: ["i", "y"],
      conditionExpr: "i<5",
      program: [
        letVar("y", 0),
        forLoop({
          var: "i",
          init: 1,
          condition: { var: "i", op: "<", limit: 5 },
          increment: { name: "i", delta: 1 },
          body: [increment("y")],
        }),
      ],
    }),
    defineLevel({
      id: 10,
      slug: "less-or-equal",
      title: "Less or equal",
      mode: "predict-hard",
      varNames: ["i", "y"],
      conditionExpr: "i<=5",
      intro:
        "Off-by-one: i <= 5 runs one extra lap compared to i < 5. Watch the done row.",
      program: [
        letVar("y", 0),
        forLoop({
          var: "i",
          init: 1,
          condition: { var: "i", op: "<=", limit: 5 },
          increment: { name: "i", delta: 1 },
          body: [increment("y")],
        }),
      ],
    }),

    // ── Group 4: While + stretch (Mode C) ───────────────────────────────
    defineLevel({
      id: 11,
      slug: "while-loop",
      title: "While",
      mode: "predict-hard",
      varNames: ["i", "y"],
      conditionExpr: "i<3",
      program: [
        letVar("y", 0),
        letVar("i", 0),
        whileLoop({
          condition: { var: "i", op: "<", limit: 3 },
          body: [increment("y"), increment("i")],
        }),
      ],
    }),
    defineLevel({
      id: 12,
      slug: "decrement",
      title: "Decrement",
      mode: "predict-hard",
      varNames: ["i", "y"],
      conditionExpr: "i>0",
      program: [
        letVar("y", 0),
        forLoop({
          var: "i",
          init: 5,
          condition: { var: "i", op: ">", limit: 0 },
          increment: { name: "i", delta: -1 },
          body: [increment("y")],
        }),
      ],
    }),
    defineLevel({
      id: 13,
      slug: "countdown",
      title: "Countdown",
      mode: "predict-hard",
      varNames: ["i", "y"],
      conditionExpr: "i>=1",
      program: [
        letVar("y", 10),
        forLoop({
          var: "i",
          init: 3,
          condition: { var: "i", op: ">=", limit: 1 },
          increment: { name: "i", delta: -1 },
          body: [assign("y", "-=", { kind: "num", value: 1 })],
        }),
      ],
    }),
    defineLevel({
      id: 14,
      slug: "final-sum",
      title: "Final sum",
      mode: "predict-hard",
      varNames: ["i", "sum"],
      conditionExpr: "i<=3",
      intro: "Predict the done row — what is sum when the loop finishes?",
      program: [
        letVar("sum", 0),
        forLoop({
          var: "i",
          init: 1,
          condition: { var: "i", op: "<=", limit: 3 },
          increment: { name: "i", delta: 1 },
          body: [assign("sum", "+=", { kind: "var", name: "i" })],
        }),
      ],
    }),
  ];
}

export const LEVELS: TraceItLevel[] = buildLevels();
export const TOTAL_LEVELS = LEVELS.length;

export const LEVEL_GROUPS = [
  { label: "Vars", levelIds: [0, 1] },
  { label: "Loops", levelIds: [2, 3, 4, 5] },
  { label: "Edges", levelIds: [6, 7, 8, 9, 10] },
  { label: "More", levelIds: [11, 12, 13, 14] },
] as const;

export function getLevel(id: number): TraceItLevel | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getLevelBySlug(slug: string): TraceItLevel | undefined {
  return LEVELS.find((l) => l.slug === slug);
}

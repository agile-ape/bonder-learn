import { assertSquareLevel, emptySquare, fillSquare, patchSquare } from "./gridUtils";
import { defineLevel, move, nextId, resetIdCounter } from "./types";
import type { CellColor, ComputeItLevel, Stmt } from "./types";

function repeat(count: number, body: Stmt[], id?: string): Stmt {
  return { type: "repeat", count, body, id: id ?? nextId("repeat") };
}

function ifColor(
  color: CellColor,
  then: Stmt[],
  elseBranch?: Stmt[],
  id?: string
): Stmt {
  return {
    type: "if",
    color,
    then,
    else: elseBranch,
    id: id ?? nextId("if"),
  };
}

function ifNotColor(
  color: CellColor,
  then: Stmt[],
  elseBranch?: Stmt[],
  id?: string
): Stmt {
  return {
    type: "if",
    color,
    negated: true,
    then,
    else: elseBranch,
    id: id ?? nextId("if"),
  };
}

function whileColor(color: CellColor, body: Stmt[], id?: string): Stmt {
  return { type: "while", color, body, id: id ?? nextId("while") };
}

function call(name: string, id?: string): Stmt {
  return { type: "call", name, id: id ?? nextId("call") };
}

function define(name: string, body: Stmt[], id?: string): Stmt {
  return { type: "define", name, body, id: id ?? nextId("define") };
}

function buildLevels(): ComputeItLevel[] {
  resetIdCounter();

  const levels: ComputeItLevel[] = [
    // ── 3×3 (ids 0–5) ───────────────────────────────────────────────────
    defineLevel({
      id: 0,
      slug: "first-steps",
      title: "First steps",
      map: patchSquare(emptySquare(3), [
        { x: 0, y: 0, color: "blue" },
        { x: 1, y: 0, color: "blue" },
        { x: 2, y: 0, color: "blue" },
      ]),
      start: { x: 0, y: 0 },
      program: [move("right"), move("right")],
    }),
    defineLevel({
      id: 1,
      slug: "all-directions",
      title: "All directions",
      map: patchSquare(emptySquare(3), [
        { x: 0, y: 2, color: "green" },
        { x: 0, y: 1, color: "green" },
        { x: 1, y: 1, color: "green" },
        { x: 1, y: 0, color: "green" },
        { x: 2, y: 0, color: "green" },
      ]),
      start: { x: 0, y: 2 },
      program: [move("up"), move("right"), move("up"), move("right")],
    }),
    defineLevel({
      id: 2,
      slug: "code-beats-visual",
      title: "Code beats visual",
      map: [
        ["blue", "red", "red"],
        ["red", "red", "blue"],
        ["blue", "orange", "blue"],
      ],
      start: { x: 1, y: 2 },
      program: [move("up"), move("right"), move("up")],
    }),
    defineLevel({
      id: 3,
      slug: "go-down",
      title: "Go down",
      map: patchSquare(emptySquare(3), [
        { x: 0, y: 0, color: "green" },
        { x: 0, y: 1, color: "green" },
        { x: 0, y: 2, color: "green" },
        { x: 1, y: 2, color: "green" },
      ]),
      start: { x: 0, y: 0 },
      program: [move("down"), move("down"), move("right")],
    }),
    defineLevel({
      id: 4,
      slug: "go-left",
      title: "Go left",
      map: patchSquare(emptySquare(3), [
        { x: 0, y: 0, color: "green" },
        { x: 0, y: 1, color: "green" },
        { x: 1, y: 1, color: "green" },
        { x: 2, y: 1, color: "green" },
      ]),
      start: { x: 2, y: 1 },
      program: [move("left"), move("left"), move("up")],
    }),
    defineLevel({
      id: 5,
      slug: "full-compass",
      title: "Full compass",
      map: patchSquare(emptySquare(3), [
        { x: 1, y: 0, color: "green" },
        { x: 0, y: 1, color: "green" },
        { x: 1, y: 1, color: "green" },
        { x: 1, y: 2, color: "green" },
      ]),
      start: { x: 1, y: 0 },
      program: [move("down"), move("left"), move("up"), move("right")],
    }),

    // ── 4×4 (ids 6–14) ───────────────────────────────────────────────────
    defineLevel({
      id: 6,
      slug: "repeat-simple",
      title: "Repeat",
      map: patchSquare(emptySquare(4), [
        { x: 3, y: 0, color: "green" },
        { x: 3, y: 1, color: "green" },
        { x: 2, y: 1, color: "green" },
        { x: 2, y: 2, color: "green" },
        { x: 1, y: 2, color: "green" },
        { x: 1, y: 3, color: "green" },
        { x: 0, y: 3, color: "green" },
        { x: 0, y: 2, color: "green" },
      ]),
      start: { x: 3, y: 0 },
      program: [repeat(3, [move("down"), move("left")]), move("up")],
    }),
    defineLevel({
      id: 7,
      slug: "condition-simple",
      title: "If",
      map: patchSquare(emptySquare(4), [
        { x: 0, y: 1, color: "blue" },
        { x: 1, y: 1, color: "blue" },
        { x: 2, y: 1, color: "orange" },
        { x: 1, y: 0, color: "blue" },
      ]),
      start: { x: 0, y: 1 },
      program: [
        move("right"),
        move("right"),
        ifColor("orange", [move("up")]),
        move("left"),
      ],
    }),
    defineLevel({
      id: 8,
      slug: "not-color",
      title: "Not",
      map: patchSquare(emptySquare(4), [
        { x: 0, y: 1, color: "green" },
        { x: 1, y: 1, color: "red" },
        { x: 2, y: 1, color: "green" },
        { x: 2, y: 2, color: "green" },
      ]),
      start: { x: 0, y: 1 },
      program: [
        move("right"),
        ifNotColor("red", [move("down")]),
        move("right"),
        move("down"),
      ],
    }),
    defineLevel({
      id: 9,
      slug: "condition-else",
      title: "If / else",
      map: patchSquare(emptySquare(4), [
        { x: 1, y: 0, color: "orange" },
        { x: 2, y: 0, color: "green" },
      ]),
      start: { x: 0, y: 0 },
      program: [
        move("right"),
        ifColor("orange", [move("down")], [move("right")]),
        move("left"),
      ],
    }),
    defineLevel({
      id: 10,
      slug: "while-loop",
      title: "While",
      map: patchSquare(emptySquare(4), [
        { x: 0, y: 3, color: "purple" },
        { x: 1, y: 3, color: "purple" },
        { x: 2, y: 3, color: "purple" },
        { x: 3, y: 2, color: "yellow" },
      ]),
      start: { x: 0, y: 3 },
      program: [whileColor("purple", [move("right")]), move("up")],
    }),
    defineLevel({
      id: 11,
      slug: "if-then-repeat",
      title: "If then repeat",
      map: patchSquare(emptySquare(4), [
        { x: 0, y: 0, color: "orange" },
        { x: 0, y: 1, color: "green" },
        { x: 1, y: 1, color: "green" },
        { x: 2, y: 1, color: "green" },
      ]),
      start: { x: 0, y: 0 },
      program: [
        ifColor("orange", [move("down")]),
        repeat(2, [move("right")]),
      ],
    }),
    defineLevel({
      id: 12,
      slug: "if-else-then-repeat",
      title: "If / else then repeat",
      map: patchSquare(emptySquare(4), [
        { x: 3, y: 0, color: "green" },
        { x: 2, y: 0, color: "green" },
        { x: 2, y: 1, color: "green" },
        { x: 1, y: 1, color: "green" },
        { x: 0, y: 1, color: "green" },
      ]),
      start: { x: 3, y: 0 },
      program: [
        move("left"),
        ifColor("green", [move("down")], [move("up")]),
        repeat(2, [move("left")]),
      ],
    }),
    defineLevel({
      id: 13,
      slug: "if-then-while",
      title: "If then while",
      map: patchSquare(emptySquare(4), [
        { x: 0, y: 0, color: "blue" },
        { x: 1, y: 0, color: "purple" },
        { x: 1, y: 1, color: "purple" },
        { x: 1, y: 2, color: "purple" },
        { x: 1, y: 3, color: "green" },
      ]),
      start: { x: 0, y: 0 },
      program: [
        ifColor("blue", [move("right")]),
        whileColor("purple", [move("down")]),
      ],
    }),
    defineLevel({
      id: 14,
      slug: "while-then-repeat",
      title: "While then repeat",
      map: patchSquare(emptySquare(4), [
        { x: 0, y: 3, color: "purple" },
        { x: 1, y: 3, color: "purple" },
        { x: 2, y: 3, color: "purple" },
        { x: 3, y: 2, color: "green" },
        { x: 3, y: 1, color: "green" },
      ]),
      start: { x: 0, y: 3 },
      program: [
        whileColor("purple", [move("right")]),
        repeat(2, [move("up")]),
      ],
    }),

    // ── 5×5 (ids 15–21) ───────────────────────────────────────────────────
    defineLevel({
      id: 15,
      slug: "repeat-nested",
      title: "Nested repeat",
      map: fillSquare(5, "blue"),
      start: { x: 0, y: 0 },
      program: [
        repeat(2, [repeat(2, [move("right")]), move("down")]),
      ],
    }),
    defineLevel({
      id: 16,
      slug: "conditional-repeat",
      title: "If in loop",
      map: patchSquare(emptySquare(5), [
        { x: 0, y: 0, color: "green" },
        { x: 1, y: 0, color: "green" },
        { x: 2, y: 0, color: "orange" },
        { x: 3, y: 0, color: "green" },
        { x: 4, y: 0, color: "green" },
      ]),
      start: { x: 0, y: 0 },
      program: [
        repeat(4, [move("right"), ifColor("orange", [move("down")])]),
      ],
    }),
    defineLevel({
      id: 17,
      slug: "repeat-if-if",
      title: "Nested if",
      map: patchSquare(emptySquare(5), [
        { x: 0, y: 0, color: "green" },
        { x: 1, y: 0, color: "blue" },
        { x: 1, y: 1, color: "green" },
        { x: 2, y: 1, color: "green" },
      ]),
      start: { x: 0, y: 0 },
      program: [
        repeat(2, [
          ifColor("green", [
            move("right"),
            ifColor("blue", [move("down")]),
          ]),
        ]),
      ],
    }),
    defineLevel({
      id: 18,
      slug: "if-else-in-loop",
      title: "If / else in loop",
      map: patchSquare(emptySquare(5), [
        { x: 1, y: 2, color: "green" },
        { x: 2, y: 2, color: "orange" },
        { x: 2, y: 3, color: "green" },
        { x: 3, y: 3, color: "green" },
        { x: 3, y: 2, color: "green" },
      ]),
      start: { x: 1, y: 2 },
      program: [
        repeat(2, [
          move("right"),
          ifColor("orange", [move("down")], [move("up")]),
        ]),
      ],
    }),
    defineLevel({
      id: 19,
      slug: "while-if-combo",
      title: "While then if",
      map: patchSquare(emptySquare(5), [
        { x: 0, y: 0, color: "purple" },
        { x: 1, y: 0, color: "purple" },
        { x: 2, y: 0, color: "purple" },
        { x: 3, y: 0, color: "yellow" },
        { x: 3, y: 1, color: "green" },
      ]),
      start: { x: 0, y: 0 },
      program: [
        whileColor("purple", [move("right")]),
        ifColor("yellow", [move("down")]),
      ],
    }),
    defineLevel({
      id: 20,
      slug: "two-functions",
      title: "Two functions",
      map: patchSquare(emptySquare(5), [
        { x: 0, y: 0, color: "green" },
        { x: 1, y: 0, color: "green" },
        { x: 2, y: 0, color: "green" },
        { x: 2, y: 1, color: "green" },
        { x: 2, y: 2, color: "green" },
      ]),
      start: { x: 0, y: 0 },
      program: [
        call("goRight"),
        call("goDown"),
        define("goRight", [move("right"), move("right")]),
        define("goDown", [move("down"), move("down")]),
      ],
    }),
    defineLevel({
      id: 21,
      slug: "function-at-end",
      title: "Function",
      map: patchSquare(emptySquare(5), [
        { x: 0, y: 0, color: "purple" },
        { x: 1, y: 0, color: "purple" },
        { x: 2, y: 0, color: "purple" },
        { x: 3, y: 0, color: "purple" },
        { x: 4, y: 0, color: "purple" },
      ]),
      start: { x: 0, y: 0 },
      program: [
        call("toTheRight"),
        define("toTheRight", [
          move("right"),
          move("right"),
          move("right"),
          move("right"),
        ]),
      ],
    }),
  ];

  for (const level of levels) {
    assertSquareLevel(level);
  }

  return levels;
}

export const LEVELS = buildLevels();
export const TOTAL_LEVELS = LEVELS.length;

export const LEVEL_GROUPS = [
  { gridSize: 3, levelIds: [0, 1, 2, 3, 4, 5] },
  { gridSize: 4, levelIds: [6, 7, 8, 9, 10, 11, 12, 13, 14] },
  { gridSize: 5, levelIds: [15, 16, 17, 18, 19, 20, 21] },
] as const;

export function getLevel(id: number): ComputeItLevel | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getLevelBySlug(slug: string): ComputeItLevel | undefined {
  return LEVELS.find((l) => l.slug === slug);
}

export function getLevelGridSize(levelId: number): number | undefined {
  return getLevel(levelId)?.map.length;
}

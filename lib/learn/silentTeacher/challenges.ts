import {
  extraSmallNumber,
  pick,
  randInt,
  repeat,
  shuffleSeeded,
  smallNumber,
  withSeededRandom,
} from "./random";
import { SILENT_TEACHER_PUZZLE_COUNT } from "@/lib/learn/puzzleModules";

export type SilentTeacherChallenge = {
  type: string;
  code: string;
  answer: string;
};

type Generator = () => SilentTeacherChallenge;

function plus(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = smallNumber();
  return {
    type: "plus",
    code: `\n${a} + ${b}\n`,
    answer: String(a + b),
  };
}

function minusPositive(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = randIntBetween(a, a + 5);
  return {
    type: "minusPositive",
    code: `\n${a} - ${b}\n`,
    answer: String(a - b),
  };
}

function minusNegative(): SilentTeacherChallenge {
  const a = -smallNumber();
  const b = smallNumber();
  return {
    type: "minusNegative",
    code: `\n${a} - ${b}\n`,
    answer: String(a - b),
  };
}

function times(): SilentTeacherChallenge {
  const a = extraSmallNumber();
  const b = extraSmallNumber();
  return {
    type: "times",
    code: `\n${a} * ${b}\n`,
    answer: String(a * b),
  };
}

function letAndPlus(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = smallNumber();
  return {
    type: "letAndPlus",
    code: `\nlet a = ${a};\na + ${b}\n`,
    answer: String(a + b),
  };
}

function twoLetAndPlus(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = smallNumber();
  return {
    type: "twoLetAndPlus",
    code: `\nlet a = ${a};\nlet b = ${b};\na + b\n`,
    answer: String(a + b),
  };
}

function concatStrings(): SilentTeacherChallenge {
  const a = pick(["foo", "bar", "baz", "qux"]);
  const b = pick(["x", "y", "z", "zz"]);
  return {
    type: "concatStrings",
    code: `\n"${a}" + "${b}"\n`,
    answer: a + b,
  };
}

function concatNumberStrings(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = pick(["x", "y", "z"]);
  return {
    type: "concatNumberStrings",
    code: `\n${a} + "${b}"\n`,
    answer: `${a}${b}`,
  };
}

function numberToString(): SilentTeacherChallenge {
  const n = smallNumber();
  return {
    type: "numberToString",
    code: `\nString(${n})\n`,
    answer: String(n),
  };
}

function sameNumberEquality(): SilentTeacherChallenge {
  const n = smallNumber();
  return {
    type: "sameNumberEquality",
    code: `\n${n} === ${n}\n`,
    answer: "true",
  };
}

function numberEquality(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = smallNumber();
  return {
    type: "numberEquality",
    code: `\n${a} === ${b}\n`,
    answer: String(a === b),
  };
}

function numberInequality(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = smallNumber();
  return {
    type: "numberInequality",
    code: `\n${a} !== ${b}\n`,
    answer: String(a !== b),
  };
}

function numberLessThan(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = smallNumber();
  return {
    type: "numberLessThan",
    code: `\n${a} < ${b}\n`,
    answer: String(a < b),
  };
}

function numberGreaterThan(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = smallNumber();
  return {
    type: "numberGreaterThan",
    code: `\n${a} > ${b}\n`,
    answer: String(a > b),
  };
}

function notBoolean(): SilentTeacherChallenge {
  const value = pick([true, false]);
  return {
    type: "not",
    code: `\n!${value}\n`,
    answer: String(!value),
  };
}

function stringLength(): SilentTeacherChallenge {
  const word = pick(["hi", "code", "run", "let"]);
  return {
    type: "stringLength",
    code: `\n"${word}".length\n`,
    answer: String(word.length),
  };
}

function ifEqual(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = smallNumber();
  const c = smallNumber();
  const d = smallNumber();
  return {
    type: "ifEqual",
    code: `\n${a} === ${b} ? ${c} : ${d}\n`,
    answer: String(a === b ? c : d),
  };
}

function ifLessThan(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = smallNumber();
  const c = smallNumber();
  const d = smallNumber();
  return {
    type: "ifLessThan",
    code: `\n${a} < ${b} ? ${c} : ${d}\n`,
    answer: String(a < b ? c : d),
  };
}

function helloFunction(): SilentTeacherChallenge {
  const a = extraSmallNumber();
  const b = extraSmallNumber();
  return {
    type: "function",
    code: `\nfunction hello(a, b) {\n  return a + b;\n}\n\nhello(${a}, ${b})\n`,
    answer: String(a + b),
  };
}

function letAndFunction(): SilentTeacherChallenge {
  const a = smallNumber();
  const b = smallNumber();
  return {
    type: "letAndFunction",
    code: `\nfunction hello(a, b) {\n  return a + b;\n}\n\nlet a = ${a};\nlet b = ${b};\nhello(a, b)\n`,
    answer: String(a + b),
  };
}

function twoFunctions(): SilentTeacherChallenge {
  const a = extraSmallNumber();
  const b = extraSmallNumber();
  const c = extraSmallNumber();
  return {
    type: "twoFunctions",
    code: `\nfunction hello(a, b) {\n  return a + b;\n}\n\nfunction hi(a, b) {\n  return a * b;\n}\n\nhello(${a}, hi(${b}, ${c}))\n`,
    answer: String(a + b * c),
  };
}

function twoFunctionsInc(): SilentTeacherChallenge {
  const a = extraSmallNumber();
  const b = extraSmallNumber();
  return {
    type: "twoFunctionsInc",
    code: `\nfunction hello(a, b) {\n  return a + b;\n}\n\nfunction hi(a, b) {\n  return hello(a, b + 1);\n}\n\nhi(${a}, ${b})\n`,
    answer: String(a + b + 1),
  };
}

function functionIfLessThan(): SilentTeacherChallenge {
  const n1 = smallNumber();
  const n2 = smallNumber();
  const a = smallNumber();
  const b = smallNumber();
  const c = extraSmallNumber();
  const d = extraSmallNumber();
  return {
    type: "functionIfLessThan",
    code: `\nfunction hello(a, b) {\n  return a < b ? ${n1} : ${n2};\n}\n\nhello(${c}, ${d})\n`,
    answer: String(c < d ? n1 : n2),
  };
}

function twoIfLessThan(): SilentTeacherChallenge {
  const nums = Array.from({ length: 7 }, () => smallNumber());
  const [n1, n2, n3, n4, n5, n6, n7] = nums;
  const answer =
    n1! < n2! ? n3! : n4! < n5! ? n6! : n7!;
  return {
    type: "twoIfLessThan",
    code: `\n${n1} < ${n2} ? ${n3} : ${n4} < ${n5} ? ${n6} : ${n7}\n`,
    answer: String(answer),
  };
}

function randIntBetween(min: number, max: number): number {
  return randInt(min, max);
}

/** Ordered generators — each produces 3 random instances per session. */
const GENERATORS: Generator[] = [
  plus,
  minusPositive,
  minusNegative,
  times,
  letAndPlus,
  twoLetAndPlus,
  concatStrings,
  concatNumberStrings,
  numberToString,
  sameNumberEquality,
  numberEquality,
  numberInequality,
  numberLessThan,
  numberGreaterThan,
  notBoolean,
  stringLength,
  ifEqual,
  ifLessThan,
  helloFunction,
  letAndFunction,
  twoFunctions,
  twoFunctionsInc,
  twoIfLessThan,
  functionIfLessThan,
];

export const INSTANCES_PER_TYPE = 3;
export const TOTAL_PUZZLES = SILENT_TEACHER_PUZZLE_COUNT;

export function getPuzzle(puzzleId: number): SilentTeacherChallenge | undefined {
  if (puzzleId < 0 || puzzleId >= TOTAL_PUZZLES) return undefined;
  const generatorIndex = Math.floor(puzzleId / INSTANCES_PER_TYPE);
  const gen = GENERATORS[generatorIndex];
  if (!gen) return undefined;
  return withSeededRandom(puzzleId * 7919 + 42, gen);
}

/** @deprecated Use getPuzzle for per-puzzle flow */
export function generateSession(): SilentTeacherChallenge[] {
  return Array.from({ length: TOTAL_PUZZLES }, (_, id) => getPuzzle(id)!);
}

function buildDistractors(answer: string): string[] {
  const out = new Set<string>();

  if (answer === "true" || answer === "false") {
    out.add(answer === "true" ? "false" : "true");
  } else if (!Number.isNaN(Number(answer)) && answer.trim() !== "") {
    const n = Number(answer);
    out.add(String(n + 1));
    out.add(String(n - 1));
    out.add(String(n + 2));
    out.add(String(n * 2));
    out.add(String(Math.abs(n - 2)));
  } else {
    out.add(`${answer}x`);
    out.add(answer.length > 1 ? answer.slice(0, -1) : `${answer}?`);
    out.add([...answer].reverse().join(""));
    out.add(answer.toUpperCase());
  }

  out.delete(answer);
  return Array.from(out);
}

export function generateChoices(
  challenge: SilentTeacherChallenge,
  puzzleId: number
): string[] {
  const correct = challenge.answer;
  const distractors = buildDistractors(correct);
  const pool = [correct];
  for (const d of distractors) {
    if (pool.length >= 4) break;
    if (!pool.includes(d)) pool.push(d);
  }
  while (pool.length < 4) {
    const filler = `${correct}_${pool.length}`;
    if (!pool.includes(filler)) pool.push(filler);
  }
  return shuffleSeeded(pool, puzzleId * 31337 + 7);
}

export function normalizeAnswer(input: string): string {
  return input.trim();
}

export function answersMatch(input: string, expected: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(expected);
}

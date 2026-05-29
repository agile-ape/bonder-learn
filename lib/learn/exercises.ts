export type ExerciseKind = "calculator" | "resultPreview" | "chatterBox";

export type LearnExercise = {
  id: string;
  title: string;
  kind: ExerciseKind;
  defaultSource: string;
};

const CALCULATOR_DEFAULT = `let x;
let y;

function compute() {
  return x + y;
}
`;

const RESULT_PREVIEW_DEFAULT = `let x;

function result(count) {
  if (count > 10) return "Great";
  return "Good";
}
`;

const CHATTER_BOX_DEFAULT = `// Write shout() here
`;

export const CHATTER_BOX_ANSWER = `function shout() {
  return "Hello!";
}
`;

export const EXERCISES: LearnExercise[] = [
  {
    id: "calculator",
    title: "Calculator",
    kind: "calculator",
    defaultSource: CALCULATOR_DEFAULT,
  },
  {
    id: "result-preview",
    title: "Result preview",
    kind: "resultPreview",
    defaultSource: RESULT_PREVIEW_DEFAULT,
  },
  {
    id: "chatter-box",
    title: "Chatter box",
    kind: "chatterBox",
    defaultSource: CHATTER_BOX_DEFAULT,
  },
];

export function getExercise(id: string): LearnExercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

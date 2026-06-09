export type CellColor =
  | "normal"
  | "blue"
  | "green"
  | "red"
  | "orange"
  | "purple"
  | "yellow";

export type Direction = "up" | "down" | "left" | "right";

export type Stmt =
  | { type: "move"; dir: Direction; id: string }
  | {
      type: "if";
      color: CellColor;
      negated?: boolean;
      then: Stmt[];
      else?: Stmt[];
      id: string;
    }
  | { type: "while"; color: CellColor; body: Stmt[]; id: string }
  | { type: "repeat"; count: number; body: Stmt[]; id: string }
  | { type: "call"; name: string; id: string }
  | { type: "define"; name: string; body: Stmt[]; id: string };

export type Position = { x: number; y: number };

export type ComputeItLevel = {
  id: number;
  slug: string;
  title: string;
  map: CellColor[][];
  start: Position;
  program: Stmt[];
};

export type CodeLine = {
  id: string;
  text: string;
  indent: number;
  highlightable: boolean;
};

export type SubmitResult = "ok" | "wrong" | "complete" | "already_complete";

let idCounter = 0;

export function resetIdCounter() {
  idCounter = 0;
}

export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function move(dir: Direction, id?: string): Stmt {
  return { type: "move", dir, id: id ?? nextId("move") };
}

export function defineLevel(
  config: Omit<ComputeItLevel, "id"> & { id: number }
): ComputeItLevel {
  return config;
}

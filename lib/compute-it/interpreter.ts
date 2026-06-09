import type {
  CellColor,
  ComputeItLevel,
  Direction,
  Position,
  Stmt,
  SubmitResult,
} from "./types";

type WhileContext = {
  stmts: Stmt[];
  pc: number;
  color: CellColor;
};

type RepeatContext = {
  stmts: Stmt[];
  pc: number;
  remaining: number;
};

type Frame = {
  stmts: Stmt[];
  pc: number;
  whileCtx?: WhileContext;
  repeatCtx?: RepeatContext;
};

export function isInBounds(pos: Position, map: CellColor[][]): boolean {
  const size = map.length;
  return pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size;
}

export function applyMove(pos: Position, dir: Direction): Position {
  switch (dir) {
    case "up":
      return { x: pos.x, y: pos.y - 1 };
    case "down":
      return { x: pos.x, y: pos.y + 1 };
    case "left":
      return { x: pos.x - 1, y: pos.y };
    case "right":
      return { x: pos.x + 1, y: pos.y };
  }
}

export function colorAt(map: CellColor[][], pos: Position): CellColor {
  const row = map[pos.y];
  if (!row) return "normal";
  return row[pos.x] ?? "normal";
}

export class GameEngine {
  private readonly map: CellColor[][];
  private readonly program: Stmt[];
  private pos: Position;
  private stack: Frame[];
  private functions: Map<string, Stmt[]>;
  private awaitingMove: (Stmt & { type: "move" }) | null = null;
  public activeLineId: string | null = null;
  public finished = false;

  constructor(level: ComputeItLevel) {
    this.map = level.map;
    this.program = level.program;
    this.pos = { ...level.start };
    this.stack = [{ stmts: level.program, pc: 0 }];
    this.functions = collectDefines(level.program);
  }

  getPosition(): Position {
    return { ...this.pos };
  }

  peekMove(): Direction | null {
    this.runUntilMoveOrDone();
    return this.awaitingMove?.dir ?? null;
  }

  submitMove(dir: Direction): SubmitResult {
    if (this.finished) return "already_complete";

    this.runUntilMoveOrDone();

    if (this.finished) return "already_complete";
    if (!this.awaitingMove) return "already_complete";
    if (this.awaitingMove.dir !== dir) return "wrong";

    const nextPos = applyMove(this.pos, this.awaitingMove.dir);
    if (!isInBounds(nextPos, this.map)) return "wrong";

    this.pos = nextPos;
    this.advanceCurrentFrame();
    this.awaitingMove = null;
    this.activeLineId = null;

    this.runUntilMoveOrDone();

    if (this.finished) return "complete";
    return "ok";
  }

  reset(level: ComputeItLevel) {
    this.pos = { ...level.start };
    this.stack = [{ stmts: level.program, pc: 0 }];
    this.functions = collectDefines(level.program);
    this.awaitingMove = null;
    this.activeLineId = null;
    this.finished = false;
  }

  /** Run program to completion, returning every move in order. */
  simulateAllMoves(): Direction[] {
    const moves: Direction[] = [];
    while (!this.finished) {
      const next = this.peekMove();
      if (!next) break;
      const result = this.submitMove(next);
      if (result === "wrong") break;
      moves.push(next);
    }
    return moves;
  }

  private runUntilMoveOrDone() {
    while (!this.finished && !this.awaitingMove) {
      if (!this.executeStep()) {
        this.finished = true;
        break;
      }
    }
  }

  private advanceCurrentFrame() {
    const frame = this.stack[this.stack.length - 1];
    if (frame) frame.pc += 1;
  }

  private executeStep(): boolean {
    while (this.stack.length > 0) {
      const frame = this.stack[this.stack.length - 1];

      if (frame.pc >= frame.stmts.length) {
        this.stack.pop();

        if (this.stack.length === 0) return false;

        const parent = this.stack[this.stack.length - 1];

        if (frame.repeatCtx) {
          const ctx = frame.repeatCtx;
          ctx.remaining -= 1;
          if (ctx.remaining > 0) {
            this.stack.push({
              stmts: ctx.stmts,
              pc: 0,
              repeatCtx: ctx,
            });
          }
          continue;
        }

        if (frame.whileCtx) {
          const ctx = frame.whileCtx;
          if (colorAt(this.map, this.pos) === ctx.color) {
            this.stack.push({
              stmts: ctx.stmts,
              pc: 0,
              whileCtx: ctx,
            });
          } else {
            parent.pc += 1;
          }
          continue;
        }

        continue;
      }

      const stmt = frame.stmts[frame.pc];

      switch (stmt.type) {
        case "move":
          this.awaitingMove = stmt;
          this.activeLineId = stmt.id;
          return true;

        case "if": {
          const matches = colorAt(this.map, this.pos) === stmt.color;
          const truthy = stmt.negated ? !matches : matches;
          const branch = truthy ? stmt.then : stmt.else;
          frame.pc += 1;
          if (branch && branch.length > 0) {
            this.stack.push({ stmts: branch, pc: 0 });
          }
          break;
        }

        case "while": {
          if (colorAt(this.map, this.pos) === stmt.color) {
            this.stack.push({
              stmts: stmt.body,
              pc: 0,
              whileCtx: {
                stmts: stmt.body,
                pc: frame.pc,
                color: stmt.color,
              },
            });
          } else {
            frame.pc += 1;
          }
          break;
        }

        case "repeat": {
          this.stack.push({
            stmts: stmt.body,
            pc: 0,
            repeatCtx: {
              stmts: stmt.body,
              pc: frame.pc,
              remaining: stmt.count,
            },
          });
          frame.pc += 1;
          break;
        }

        case "define":
          this.functions.set(stmt.name, stmt.body);
          frame.pc += 1;
          break;

        case "call": {
          const body = this.functions.get(stmt.name);
          frame.pc += 1;
          if (body && body.length > 0) {
            this.stack.push({ stmts: body, pc: 0 });
          }
          break;
        }
      }
    }

    return false;
  }
}

function collectDefines(stmts: Stmt[]): Map<string, Stmt[]> {
  const functions = new Map<string, Stmt[]>();

  for (const stmt of stmts) {
    if (stmt.type === "define") {
      functions.set(stmt.name, stmt.body);
    } else if (stmt.type === "if") {
      collectDefines(stmt.then).forEach((v, k) => functions.set(k, v));
      if (stmt.else) {
        collectDefines(stmt.else).forEach((v, k) => functions.set(k, v));
      }
    } else if (stmt.type === "while" || stmt.type === "repeat") {
      collectDefines(stmt.body).forEach((v, k) => functions.set(k, v));
    }
  }

  return functions;
}

export function keyToDirection(key: string): Direction | null {
  switch (key) {
    case "ArrowUp":
      return "up";
    case "ArrowDown":
      return "down";
    case "ArrowLeft":
      return "left";
    case "ArrowRight":
      return "right";
    default:
      return null;
  }
}

import { buildFullTrace, rowsEqual } from "./trace";
import type { TraceItLevel, TraceRow } from "./types";

export type TraceEngineState = {
  /** Rows committed to the table so far. */
  committed: TraceRow[];
  /** Index of next row to reveal (into fullTrace). */
  nextIndex: number;
  /** Full answer trace. */
  fullTrace: TraceRow[];
  /** Current active line for code highlight. */
  activeLineId: string | null;
  /** Whether all rows are shown. */
  done: boolean;
  /** Waiting for player to pick the next row (predict modes). */
  awaitingPick: boolean;
};

export class TraceEngine {
  readonly level: TraceItLevel;
  readonly fullTrace: TraceRow[];
  private nextIndex: number;
  committed: TraceRow[];

  constructor(level: TraceItLevel) {
    this.level = level;
    this.fullTrace = buildFullTrace(level);
    this.nextIndex = 1;
    this.committed = this.fullTrace.length > 0 ? [this.fullTrace[0]] : [];
  }

  get activeLineId(): string | null {
    if (this.done) return null;
    const pending = this.fullTrace[this.nextIndex];
    return pending?.lineId ?? null;
  }

  get done(): boolean {
    return this.nextIndex >= this.fullTrace.length;
  }

  get awaitingPick(): boolean {
    return (
      !this.done &&
      this.level.mode !== "watch" &&
      this.nextIndex < this.fullTrace.length
    );
  }

  /** Mode A: advance one row. Returns the new row or null if done. */
  step(): TraceRow | null {
    if (this.done || this.level.mode !== "watch") return null;
    const row = this.fullTrace[this.nextIndex];
    if (!row) return null;
    this.committed = [...this.committed, row];
    this.nextIndex += 1;
    return row;
  }

  /** Mode B/C: submit a picked row. Returns ok | wrong | complete. */
  submitPick(pick: TraceRow): "ok" | "wrong" | "complete" {
    if (this.done || this.level.mode === "watch") return "wrong";
    const expected = this.fullTrace[this.nextIndex];
    if (!expected) return "wrong";

    if (!rowsEqual(pick, expected, this.level.varNames)) {
      return "wrong";
    }

    this.committed = [...this.committed, expected];
    this.nextIndex += 1;

    if (this.nextIndex >= this.fullTrace.length) {
      return "complete";
    }
    return "ok";
  }

  /** Row the player must predict next (for choice generation). */
  getPendingRow(): TraceRow | null {
    if (this.done) return null;
    return this.fullTrace[this.nextIndex] ?? null;
  }

  reset(): void {
    this.nextIndex = 1;
    this.committed = this.fullTrace.length > 0 ? [this.fullTrace[0]] : [];
  }

  getState(): TraceEngineState {
    return {
      committed: this.committed,
      nextIndex: this.nextIndex,
      fullTrace: this.fullTrace,
      activeLineId: this.activeLineId,
      done: this.done,
      awaitingPick: this.awaitingPick,
    };
  }
}

export function runFullTrace(level: TraceItLevel): TraceRow[] {
  return buildFullTrace(level);
}

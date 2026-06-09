import { GameEngine, isInBounds } from "./interpreter";
import type { ComputeItLevel, Position } from "./types";

/** Final cell after executing the level program (for goal highlight). */
export function getGoalPosition(level: ComputeItLevel): Position {
  const engine = new GameEngine(level);
  const size = level.map.length;

  while (!engine.finished) {
    const next = engine.peekMove();
    if (!next) break;
    engine.submitMove(next);
    const pos = engine.getPosition();
    if (!isInBounds(pos, level.map)) {
      throw new Error(
        `Level ${level.id} (${level.slug}): program moves out of bounds at (${pos.x},${pos.y})`
      );
    }
  }

  return engine.getPosition();
}

import { GameEngine } from "./interpreter";
import { getLevel } from "./levels";
import type { ComputeItLevel, Direction } from "./types";

export type ReverseLevelConfig = {
  reverseId: number;
  forwardLevelId: number;
};

export const REVERSE_LEVELS: readonly ReverseLevelConfig[] = [
  { reverseId: 0, forwardLevelId: 0 },
] as const;

export const TOTAL_REVERSE_LEVELS = REVERSE_LEVELS.length;

export function getReverseConfig(
  reverseId: number
): ReverseLevelConfig | undefined {
  return REVERSE_LEVELS.find((r) => r.reverseId === reverseId);
}

export function getReverseLevel(reverseId: number): ComputeItLevel | undefined {
  const config = getReverseConfig(reverseId);
  if (!config) return undefined;
  return getLevel(config.forwardLevelId);
}

export function getExpectedMoves(forwardLevelId: number): Direction[] {
  const level = getLevel(forwardLevelId);
  if (!level) return [];
  return new GameEngine(level).simulateAllMoves();
}

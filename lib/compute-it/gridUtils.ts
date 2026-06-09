import type { CellColor, ComputeItLevel } from "./types";

export function emptySquare(size: number): CellColor[][] {
  return fillSquare(size, "normal");
}

export function fillSquare(size: number, color: CellColor): CellColor[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => color)
  );
}

export function patchSquare(
  base: CellColor[][],
  patches: { x: number; y: number; color: CellColor }[]
): CellColor[][] {
  const map = base.map((row) => [...row]);
  for (const { x, y, color } of patches) {
    if (map[y]?.[x] !== undefined) {
      map[y][x] = color;
    }
  }
  return map;
}

export function assertSquareLevel(level: ComputeItLevel): void {
  const rows = level.map.length;
  if (rows === 0) {
    throw new Error(`Level ${level.id} (${level.slug}): map is empty`);
  }
  for (const row of level.map) {
    if (row.length !== rows) {
      throw new Error(
        `Level ${level.id} (${level.slug}): map must be square (${rows}×${row.length})`
      );
    }
  }
  const { x, y } = level.start;
  if (x < 0 || y < 0 || y >= rows || x >= rows) {
    throw new Error(
      `Level ${level.id} (${level.slug}): start (${x},${y}) out of bounds`
    );
  }
}

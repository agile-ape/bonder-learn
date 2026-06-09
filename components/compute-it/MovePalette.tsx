"use client";

import type { Direction } from "@/lib/compute-it/types";

const MOVES: Direction[] = ["right", "left", "up", "down"];

type MovePaletteProps = {
  disabled?: boolean;
  onPick: (dir: Direction) => void;
};

export default function MovePalette({ disabled, onPick }: MovePaletteProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {MOVES.map((dir) => (
        <button
          key={dir}
          type="button"
          disabled={disabled}
          onClick={() => onPick(dir)}
          className="rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 font-mono text-lg font-semibold text-white/80 transition-colors hover:bg-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:text-xl"
        >
          {dir}()
        </button>
      ))}
    </div>
  );
}

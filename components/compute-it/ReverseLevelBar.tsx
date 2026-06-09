"use client";

import { REVERSE_LEVELS } from "@/lib/compute-it/reverse";

type ReverseLevelBarProps = {
  currentReverseId: number;
  onSelectLevel: (reverseId: number) => void;
};

export default function ReverseLevelBar({
  currentReverseId,
  onSelectLevel,
}: ReverseLevelBarProps) {
  return (
    <div className="flex w-full flex-col gap-2 px-4 py-3">
      <div className="flex w-full flex-wrap items-center justify-center gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Reverse
        </span>
        <div className="flex items-center gap-2">
          {REVERSE_LEVELS.map(({ reverseId }) => {
            const current = reverseId === currentReverseId;
            return (
              <button
                key={reverseId}
                type="button"
                onClick={() => onSelectLevel(reverseId)}
                className={`flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-semibold transition-colors sm:h-8 sm:min-w-8 sm:px-2 sm:text-sm ${
                  current
                    ? "bg-white text-[#2c3e50] shadow-md"
                    : "bg-white/15 text-white/80 hover:bg-white/25"
                }`}
                title={`Reverse level ${reverseId + 1}`}
                aria-current={current ? "step" : undefined}
              >
                {reverseId + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

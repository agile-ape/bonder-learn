"use client";

import { LEVEL_GROUPS } from "@/lib/trace-it/levels";
import {
  isLevelCompleted,
  isLevelUnlocked,
  type TraceItProgress,
} from "@/lib/trace-it/storage";

type LevelBarProps = {
  currentLevelId: number;
  progress: TraceItProgress;
  onSelectLevel: (levelId: number) => void;
};

export default function LevelBar({
  currentLevelId,
  progress,
  onSelectLevel,
}: LevelBarProps) {
  return (
    <div className="flex w-full flex-col gap-2 px-4 py-3">
      <div className="flex w-full flex-wrap items-center justify-center gap-4 gap-y-2 sm:gap-6">
        {LEVEL_GROUPS.map((group, groupIndex) => (
          <div key={group.label} className="flex items-center gap-3">
            {groupIndex > 0 && (
              <span className="h-4 w-px bg-white/20" aria-hidden />
            )}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
              {group.label}
            </span>
            <div className="flex items-center gap-2">
              {group.levelIds.map((levelId) => {
                const completed = isLevelCompleted(levelId, progress);
                const unlocked = isLevelUnlocked(levelId, progress);
                const current = levelId === currentLevelId;

                return (
                  <button
                    key={levelId}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => onSelectLevel(levelId)}
                    className={`flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-semibold transition-colors sm:h-8 sm:min-w-8 sm:px-2 sm:text-sm disabled:cursor-not-allowed disabled:opacity-35 ${
                      current
                        ? "bg-white text-[#2c3e50] shadow-md"
                        : completed
                          ? "bg-lime-500/90 text-white"
                          : unlocked
                            ? "bg-white/15 text-white/80 hover:bg-white/25"
                            : "bg-white/10 text-white/40"
                    }`}
                    title={`Level ${levelId + 1}`}
                    aria-label={`Level ${levelId + 1}${completed ? ", completed" : current ? ", current" : unlocked ? ", unlocked" : ", locked"}`}
                    aria-current={current ? "step" : undefined}
                  >
                    {levelId + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

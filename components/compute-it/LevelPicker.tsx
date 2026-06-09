"use client";

import {
  isLevelCompleted,
  isLevelUnlocked,
  loadProgress,
  markLevelComplete,
  type ComputeItProgress,
} from "@/lib/compute-it/storage";
import { TOTAL_LEVELS } from "@/lib/compute-it/levels";

type LevelPickerProps = {
  open: boolean;
  currentLevelId: number;
  progress: ComputeItProgress;
  onClose: () => void;
  onSelectLevel: (levelId: number) => void;
};

export default function LevelPicker({
  open,
  currentLevelId,
  progress,
  onClose,
  onSelectLevel,
}: LevelPickerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-start bg-[#2c3e50]/70 p-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="rounded-xl bg-white/95 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-5 text-sm font-semibold text-[#2c3e50]">Levels</p>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
            const completed = isLevelCompleted(i, progress);
            const unlocked = isLevelUnlocked(i, progress);
            const current = i === currentLevelId;

            let color = "bg-red-400";
            if (completed) color = "bg-lime-500";
            else if (current) color = "bg-yellow-400";
            else if (unlocked) color = "bg-orange-400";

            return (
              <button
                key={i}
                type="button"
                disabled={!unlocked}
                onClick={() => {
                  onSelectLevel(i);
                  onClose();
                }}
                className={`h-5 w-5 rounded-full shadow-sm transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 ${color}`}
                title={`Level ${i}`}
                aria-label={`Level ${i}${completed ? ", completed" : current ? ", current" : unlocked ? ", unlocked" : ", locked"}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { loadProgress, markLevelComplete };

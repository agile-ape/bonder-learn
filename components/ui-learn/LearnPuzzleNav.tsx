"use client";

import {
  getActivePuzzleModule,
  parsePuzzleIdFromPath,
  type PuzzleModule,
} from "@/lib/learn/puzzleModules";
import {
  isLevelCompleted,
  isLevelUnlocked,
  loadProgress as loadBotProgress,
  type ComputeItProgress,
} from "@/lib/compute-it/storage";
import {
  isPuzzleCompleted,
  isPuzzleUnlocked,
  loadProgress as loadSilentTeacherProgress,
  type SilentTeacherProgress,
} from "@/lib/learn/silentTeacher/storage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function puzzleHref(module: PuzzleModule, puzzleId: number): string {
  return `${module.hrefPrefix}/${puzzleId}`;
}

function puzzleLabel(puzzleId: number): string {
  return `Puzzle ${puzzleId + 1}`;
}

type LearnPuzzleNavProps = {
  module: PuzzleModule;
};

export default function LearnPuzzleNav({ module }: LearnPuzzleNavProps) {
  const pathname = usePathname();
  const currentPuzzleId = parsePuzzleIdFromPath(pathname, module);
  const [botProgress, setBotProgress] = useState<ComputeItProgress | null>(
    null
  );
  const [stProgress, setStProgress] = useState<SilentTeacherProgress | null>(
    null
  );

  useEffect(() => {
    if (module.id === "bot") {
      setBotProgress(loadBotProgress());
    } else if (module.id === "silent-teacher") {
      setStProgress(loadSilentTeacherProgress());
    }
  }, [module.id, pathname]);

  return (
    <nav
      className="flex w-48 shrink-0 flex-col border-r border-border bg-card/80"
      aria-label={`${module.title} puzzles`}
    >
      <p className="border-b border-border px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Puzzles
      </p>
      <ul className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {Array.from({ length: module.puzzleCount }, (_, puzzleId) => {
          const href = puzzleHref(module, puzzleId);
          const active = currentPuzzleId === puzzleId;

          let unlocked = true;
          let completed = false;

          if (module.id === "bot" && botProgress) {
            unlocked = isLevelUnlocked(puzzleId, botProgress);
            completed = isLevelCompleted(puzzleId, botProgress);
          } else if (module.id === "silent-teacher" && stProgress) {
            unlocked = isPuzzleUnlocked(puzzleId, stProgress);
            completed = isPuzzleCompleted(puzzleId, stProgress);
          }

          return (
            <li key={puzzleId}>
              {unlocked ? (
                <Link
                  href={href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
                      : completed
                        ? "text-foreground/80 hover:bg-muted/60"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span>{puzzleLabel(puzzleId)}</span>
                    {completed && (
                      <span className="text-[10px] text-lime-600" aria-hidden>
                        ✓
                      </span>
                    )}
                  </span>
                </Link>
              ) : (
                <span
                  className="block cursor-not-allowed rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/40"
                  aria-disabled
                >
                  {puzzleLabel(puzzleId)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {currentPuzzleId === null && (
        <p className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
          Select a puzzle to play
        </p>
      )}
    </nav>
  );
}

export function LearnPuzzleNavFromPath() {
  const pathname = usePathname();
  const module = getActivePuzzleModule(pathname);
  if (!module) return null;
  return <LearnPuzzleNav module={module} />;
}

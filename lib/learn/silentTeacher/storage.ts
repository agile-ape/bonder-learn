import { TOTAL_PUZZLES } from "./challenges";

const STORAGE_KEY = "bonder-learn:silent-teacher-progress";
const LEGACY_SESSION_KEY = "bonder-learn:silent-teacher";

export type SilentTeacherProgress = {
  highestUnlocked: number;
  completed: number[];
};

const DEFAULT_PROGRESS: SilentTeacherProgress = {
  highestUnlocked: 0,
  completed: [],
};

function migrateLegacySession(): void {
  if (typeof window === "undefined") return;
  try {
    const legacy = localStorage.getItem(LEGACY_SESSION_KEY);
    if (legacy) {
      localStorage.removeItem(LEGACY_SESSION_KEY);
    }
  } catch {
    // ignore
  }
}

export function loadProgress(): SilentTeacherProgress {
  if (typeof window === "undefined") return { ...DEFAULT_PROGRESS };
  migrateLegacySession();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as SilentTeacherProgress;
    return {
      highestUnlocked: parsed.highestUnlocked ?? 0,
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: SilentTeacherProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markPuzzleComplete(
  puzzleId: number
): SilentTeacherProgress {
  const current = loadProgress();
  const completed = current.completed.includes(puzzleId)
    ? current.completed
    : [...current.completed, puzzleId].sort((a, b) => a - b);
  const highestUnlocked = Math.min(
    Math.max(current.highestUnlocked, puzzleId + 1),
    TOTAL_PUZZLES - 1
  );
  const next = { highestUnlocked, completed };
  saveProgress(next);
  return next;
}

export function resetProgress(): SilentTeacherProgress {
  saveProgress(DEFAULT_PROGRESS);
  return { ...DEFAULT_PROGRESS };
}

export function isPuzzleUnlocked(
  puzzleId: number,
  progress: SilentTeacherProgress
): boolean {
  return puzzleId <= progress.highestUnlocked;
}

export function isPuzzleCompleted(
  puzzleId: number,
  progress: SilentTeacherProgress
): boolean {
  return progress.completed.includes(puzzleId);
}

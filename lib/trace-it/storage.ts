const STORAGE_KEY = "codehaus-trace-it-progress";

export type TraceItProgress = {
  highestUnlocked: number;
  completed: number[];
};

const DEFAULT_PROGRESS: TraceItProgress = {
  highestUnlocked: 0,
  completed: [],
};

export function loadProgress(): TraceItProgress {
  if (typeof window === "undefined") return { ...DEFAULT_PROGRESS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as TraceItProgress;
    return {
      highestUnlocked: parsed.highestUnlocked ?? 0,
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: TraceItProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLevelComplete(levelId: number, totalLevels: number): TraceItProgress {
  const current = loadProgress();
  const completed = current.completed.includes(levelId)
    ? current.completed
    : [...current.completed, levelId].sort((a, b) => a - b);
  const highestUnlocked = Math.min(
    Math.max(current.highestUnlocked, levelId + 1),
    totalLevels - 1
  );
  const next = { highestUnlocked, completed };
  saveProgress(next);
  return next;
}

export function resetProgress(): TraceItProgress {
  saveProgress(DEFAULT_PROGRESS);
  return { ...DEFAULT_PROGRESS };
}

export function isLevelUnlocked(levelId: number, progress: TraceItProgress): boolean {
  return levelId <= progress.highestUnlocked;
}

export function isLevelCompleted(levelId: number, progress: TraceItProgress): boolean {
  return progress.completed.includes(levelId);
}

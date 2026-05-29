export type SavedChatterShout = {
  id: string;
  text: string;
  top: number;
  left: number;
};

const STORAGE_KEY = "bonder-learn:chatter-shouts";

export function loadChatterShouts(): SavedChatterShout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is SavedChatterShout =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as SavedChatterShout).id === "string" &&
          typeof (item as SavedChatterShout).text === "string" &&
          typeof (item as SavedChatterShout).top === "number" &&
          typeof (item as SavedChatterShout).left === "number",
      )
      .map(normalizeChatterPosition);
  } catch {
    return [];
  }
}

export function saveChatterShouts(shouts: SavedChatterShout[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shouts));
}

export function clearChatterShoutsStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function normalizeChatterPosition(
  shout: SavedChatterShout,
): SavedChatterShout {
  return {
    ...shout,
    top: Math.max(0, Math.min(90, shout.top)),
    left: Math.max(5, Math.min(95, shout.left)),
  };
}

/** Percent within the face-and-below placement zone (0% = top of face square). */
export function randomChatterPosition(): Pick<SavedChatterShout, "top" | "left"> {
  return {
    top: Math.random() * 72,
    left: 8 + Math.random() * 84,
  };
}

export function createSavedChatterShout(text: string): SavedChatterShout {
  return {
    id: crypto.randomUUID(),
    text,
    ...randomChatterPosition(),
  };
}

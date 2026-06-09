/** Mulberry32 PRNG — deterministic when seeded. */
export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  randInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(items: readonly T[]): T {
    return items[this.randInt(0, items.length - 1)]!;
  }
}

let activeRng: SeededRandom | null = null;
const fallbackRng = new SeededRandom(1);

function rng(): SeededRandom {
  return activeRng ?? fallbackRng;
}

export function withSeededRandom<T>(seed: number, fn: () => T): T {
  const prev = activeRng;
  activeRng = new SeededRandom(seed);
  try {
    return fn();
  } finally {
    activeRng = prev;
  }
}

export function randInt(min: number, max: number): number {
  return rng().randInt(min, max);
}

export function smallNumber(): number {
  return randInt(1, 9);
}

export function extraSmallNumber(): number {
  return randInt(1, 5);
}

export function pick<T>(items: readonly T[]): T {
  return rng().pick(items);
}

export function repeat<T>(count: number, fn: () => T): T[] {
  return Array.from({ length: count }, fn);
}

export function shuffleSeeded<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  const shuffleRng = new SeededRandom(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = shuffleRng.randInt(0, i);
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

import { TOTAL_LEVELS } from "@/lib/compute-it/levels";
import { TOTAL_REVERSE_LEVELS } from "@/lib/compute-it/reverse";

export type PuzzleModuleId = "silent-teacher" | "bot" | "programmer";

export type PuzzleModule = {
  id: PuzzleModuleId;
  title: string;
  hrefPrefix: string;
  puzzleCount: number;
  pathMatch: (pathname: string) => boolean;
};

/** 24 generators × 3 instances per type */
export const SILENT_TEACHER_PUZZLE_COUNT = 72;

export const PUZZLE_MODULES: PuzzleModule[] = [
  {
    id: "silent-teacher",
    title: "Silent Teacher",
    hrefPrefix: "/learn/silent-teacher",
    puzzleCount: SILENT_TEACHER_PUZZLE_COUNT,
    pathMatch: (pathname) => pathname.startsWith("/learn/silent-teacher"),
  },
  {
    id: "bot",
    title: "Bot",
    hrefPrefix: "/learn/bot",
    puzzleCount: TOTAL_LEVELS,
    pathMatch: (pathname) => pathname.startsWith("/learn/bot"),
  },
  {
    id: "programmer",
    title: "Programmer",
    hrefPrefix: "/learn/programmer",
    puzzleCount: TOTAL_REVERSE_LEVELS,
    pathMatch: (pathname) => pathname.startsWith("/learn/programmer"),
  },
];

export function getActivePuzzleModule(
  pathname: string
): PuzzleModule | undefined {
  return PUZZLE_MODULES.find((m) => m.pathMatch(pathname));
}

export function parsePuzzleIdFromPath(
  pathname: string,
  module: PuzzleModule
): number | null {
  const prefix = `${module.hrefPrefix}/`;
  if (!pathname.startsWith(prefix)) return null;
  const segment = pathname.slice(prefix.length).split("/")[0];
  if (!segment) return null;
  const id = parseInt(segment, 10);
  return Number.isNaN(id) ? null : id;
}

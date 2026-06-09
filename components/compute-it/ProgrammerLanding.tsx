"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TOTAL_REVERSE_LEVELS } from "@/lib/compute-it/reverse";
import { PLAYFIELD_BG } from "@/lib/compute-it/theme";

const STORAGE_KEY = "codehaus-programmer-progress";

type ProgrammerProgress = {
  completed: number[];
};

function loadProgress(): ProgrammerProgress {
  if (typeof window === "undefined") return { completed: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: [] };
    const parsed = JSON.parse(raw) as ProgrammerProgress;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
    };
  } catch {
    return { completed: [] };
  }
}

function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export default function ProgrammerLanding() {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setCompletedCount(loadProgress().completed.length);
  }, []);

  function handleReset() {
    if (window.confirm("Reset all Programmer progress?")) {
      resetProgress();
      setCompletedCount(0);
    }
  }

  return (
    <div
      className="flex min-h-full flex-col items-center justify-center gap-10 px-6 py-12 text-center"
      style={{ backgroundColor: PLAYFIELD_BG }}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-white/60">
          Code Haus presents
        </p>
        <h1 className="font-pixel text-5xl tracking-wide text-white drop-shadow-md md:text-6xl">
          PROGRAMMER
        </h1>
      </div>

      <Link
        href="/learn/programmer/0"
        className="group relative flex h-44 w-44 items-center justify-center"
        aria-label="Play"
      >
        <div className="absolute inset-0 rounded-full bg-white shadow-lg" />
        <div className="relative flex flex-col gap-2 p-8 font-mono text-sm text-[#2c3e50]">
          <span>right()</span>
          <span className="opacity-40">___()</span>
          <span className="opacity-40">___()</span>
        </div>
        <div
          className="absolute -right-2 top-1/2 -translate-y-1/2 border-y-[22px] border-l-[36px] border-y-transparent border-l-white drop-shadow-md transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>

      <p className="max-w-sm text-sm leading-relaxed text-white/70">
        Watch the bot move, then fill in the missing moves. You write the
        program — the bot runs it.
      </p>

      <p className="text-xs text-white/50">
        {completedCount} / {TOTAL_REVERSE_LEVELS} puzzles completed
      </p>

      {completedCount > 0 && (
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
        >
          Reset progress
        </button>
      )}
    </div>
  );
}

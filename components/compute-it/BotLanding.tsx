"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress, resetProgress } from "@/lib/compute-it/storage";
import { TOTAL_LEVELS } from "@/lib/compute-it/levels";
import { PLAYFIELD_BG } from "@/lib/compute-it/theme";

export default function BotLanding() {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setCompletedCount(loadProgress().completed.length);
  }, []);

  function handleReset() {
    if (window.confirm("Reset all Bot progress?")) {
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
          BOT
        </h1>
      </div>

      <Link
        href="/learn/bot/0"
        className="group relative flex h-44 w-44 items-center justify-center"
        aria-label="Play"
      >
        <div className="absolute inset-0 rounded-full bg-white shadow-lg" />
        <div className="relative grid grid-cols-2 gap-3 p-8">
          <div className="h-10 w-10 rounded-full bg-[#aed581] shadow-sm" />
          <div className="h-10 w-10 rounded-full bg-[#26c6da] shadow-inner ring-4 ring-white" />
          <div className="h-10 w-10 rounded-full bg-[#26c6da] shadow-sm" />
          <div className="h-10 w-10 rounded-full bg-[#aed581] shadow-sm" />
        </div>
        <div
          className="absolute -right-2 top-1/2 -translate-y-1/2 border-y-[22px] border-l-[36px] border-y-transparent border-l-white drop-shadow-md transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>

      <p className="max-w-sm text-sm leading-relaxed text-white/70">
        You are the computer. Read the program, press arrow keys, and follow
        the code — not the colors.
      </p>

      <p className="text-xs text-white/50">
        {completedCount} / {TOTAL_LEVELS} puzzles completed
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

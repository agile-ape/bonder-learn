"use client";

import { CODE_TEXT_DIM, CODE_TEXT_LIGHT } from "@/lib/compute-it/theme";
import type { Direction } from "@/lib/compute-it/types";

type ReverseCodePanelProps = {
  slotCount: number;
  answers: (Direction | null)[];
  activeSlot: number;
  onSelectSlot: (index: number) => void;
  phase: "watch" | "fill" | "success";
};

export default function ReverseCodePanel({
  slotCount,
  answers,
  activeSlot,
  onSelectSlot,
  phase,
}: ReverseCodePanelProps) {
  if (phase === "watch") {
    return (
      <div className="inline-block text-left font-mono text-4xl leading-relaxed text-white/50 md:text-5xl md:leading-relaxed lg:text-6xl">
        Watch…
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="inline-block text-left font-mono text-4xl leading-relaxed md:text-5xl md:leading-relaxed lg:text-6xl">
        {answers.map((dir, i) => (
          <div
            key={i}
            className="whitespace-pre px-2 py-0.5"
            style={{ color: CODE_TEXT_LIGHT }}
          >
            {dir}()
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="inline-block text-left font-mono text-4xl leading-relaxed md:text-5xl md:leading-relaxed lg:text-6xl">
      {Array.from({ length: slotCount }, (_, i) => {
        const filled = answers[i];
        const active = i === activeSlot;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelectSlot(i)}
            className={`block w-full whitespace-pre px-2 py-0.5 text-left transition-colors ${
              active ? "rounded-md ring-2 ring-white/40" : ""
            }`}
            style={{ color: filled ? CODE_TEXT_LIGHT : CODE_TEXT_DIM }}
          >
            {filled ? `${filled}()` : "___()"}
          </button>
        );
      })}
    </div>
  );
}

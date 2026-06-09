"use client";

import { formatRowLabel } from "@/lib/trace-it/choices";
import type { TraceItLevel, TraceRow } from "@/lib/trace-it/types";

type ChoicePickerProps = {
  choices: TraceRow[];
  level: TraceItLevel;
  onPick: (row: TraceRow) => void;
  disabled?: boolean;
};

export default function ChoicePicker({
  choices,
  level,
  onPick,
  disabled = false,
}: ChoicePickerProps) {
  return (
    <div className="mt-6 flex w-full max-w-md flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-wider text-white/50">
        What happens next?
      </p>
      {choices.map((choice, index) => (
        <button
          key={`${choice.label}-${index}`}
          type="button"
          disabled={disabled}
          onClick={() => onPick(choice)}
          className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-left font-mono text-sm text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
        >
          {formatRowLabel(choice, level.varNames, level.conditionExpr)}
        </button>
      ))}
    </div>
  );
}

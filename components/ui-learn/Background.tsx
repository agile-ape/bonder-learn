
"use client";

import CalculatorPanel from "@/components/ui-learn/CalculatorPanel";
import { useLearnCode } from "@/components/ui-learn/LearnCodeContext";

export default function Background() {
  const { codeSource, enableEditing } = useLearnCode();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pb-48 pt-8">
      <div className="w-full max-w-md space-y-4">
        <CalculatorPanel />
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Computed Function
            </h3>
            <button
              type="button"
              onClick={enableEditing}
              className="h-8 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted"
            >
              Edit
            </button>
          </div>
          <pre className="overflow-x-auto rounded-md border border-border bg-background/70 p-3 font-mono text-sm text-foreground">
            {codeSource}
          </pre>
        </div>
      </div>
    </div>
  );
}
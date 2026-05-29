"use client";

import { useLearnCode } from "@/components/ui-learn/LearnCodeContext";
import { useState } from "react";

export default function CalculatorPanel() {
  const { compiled } = useLearnCode();
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const fn = compiled?.variant === "calculator" ? compiled.fn : null;

  const handleCalculate = () => {
    if (!fn) {
      setCalcError("Run a valid program first.");
      setResult(null);
      return;
    }

    setCalcError(null);
    if (x.trim() === "" || y.trim() === "") {
      setCalcError("Enter values for x and y.");
      setResult(null);
      return;
    }

    const nx = Number(x);
    const ny = Number(y);
    if (Number.isNaN(nx) || Number.isNaN(ny)) {
      setCalcError("x and y must be valid numbers.");
      setResult(null);
      return;
    }

    try {
      const out = fn(nx, ny);
      const text = String(out);
      if (text === "NaN") {
        setCalcError("Result is not a number (NaN).");
        setResult(null);
        return;
      }
      setResult(text);
    } catch (e) {
      setCalcError(e instanceof Error ? e.message : String(e));
      setResult(null);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-gradient-to-br from-white/60 via-white/30 to-transparent p-6 text-foreground shadow-sm backdrop-blur-sm">
      <h2 className="text-lg font-semibold">Calculator</h2>
      <p className="text-sm text-muted-foreground">
        Enter x and y. They are written into your program, then{" "}
        <span className="font-mono">compute()</span> runs.
      </p>
      <div className="space-y-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium">x</span>
          <input
            type="number"
            value={x}
            onChange={(e) => setX(e.target.value)}
            className="w-full rounded-md border border-input bg-background/80 px-3 py-2 text-sm text-foreground outline-none ring-ring focus-visible:ring-2"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">y</span>
          <input
            type="number"
            value={y}
            onChange={(e) => setY(e.target.value)}
            className="w-full rounded-md border border-input bg-background/80 px-3 py-2 text-sm text-foreground outline-none ring-ring focus-visible:ring-2"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={handleCalculate}
        className="h-10 w-full rounded-md border border-border bg-primary text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Calculate
      </button>
      {calcError ? (
        <p className="text-sm text-destructive" role="status">
          {calcError}
        </p>
      ) : null}
      <div className="rounded-md border border-border bg-muted/50 px-3 py-2">
        <span className="text-sm text-muted-foreground">Result</span>
        <p className="font-mono text-lg font-medium tabular-nums">
          {result ?? "-"}
        </p>
      </div>
    </div>
  );
}

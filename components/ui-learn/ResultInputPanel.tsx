"use client";

import { useLearnCode } from "@/components/ui-learn/LearnCodeContext";
import { useState } from "react";

export default function ResultInputPanel() {
  const { compiled } = useLearnCode();
  const [x, setX] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const runner =
    compiled?.variant === "resultPreview" ? compiled.run : null;

  const handleSubmit = () => {
    if (!runner) {
      setRunError("Run a valid program first.");
      setResult(null);
      return;
    }

    setRunError(null);
    if (x.trim() === "") {
      setRunError("Enter a value for x.");
      setResult(null);
      return;
    }

    const nx = Number(x);
    if (Number.isNaN(nx)) {
      setRunError("x must be a valid number.");
      setResult(null);
      return;
    }

    try {
      const out = runner(nx);
      setResult(String(out));
    } catch (e) {
      setRunError(e instanceof Error ? e.message : String(e));
      setResult(null);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-gradient-to-br from-white/60 via-white/30 to-transparent p-6 text-foreground shadow-sm backdrop-blur-sm">
      <h2 className="text-lg font-semibold">Result preview</h2>
      <p className="text-sm text-muted-foreground">
        Set x, then submit to call <span className="font-mono">result</span>{" "}
        and show its return value.
      </p>
      <label className="block space-y-1">
        <span className="text-sm font-medium">x</span>
        <input
          type="number"
          value={x}
          onChange={(e) => setX(e.target.value)}
          className="w-full rounded-md border border-input bg-background/80 px-3 py-2 text-sm text-foreground outline-none ring-ring focus-visible:ring-2"
        />
      </label>
      <button
        type="button"
        onClick={handleSubmit}
        className="h-10 w-full rounded-md border border-border bg-primary text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Submit
      </button>
      {runError ? (
        <p className="text-sm text-destructive" role="status">
          {runError}
        </p>
      ) : null}
      <div className="rounded-md border border-border bg-muted/50 px-3 py-2">
        <span className="text-sm text-muted-foreground">Output</span>
        <p className="font-mono text-lg font-medium">{result ?? "-"}</p>
      </div>
    </div>
  );
}

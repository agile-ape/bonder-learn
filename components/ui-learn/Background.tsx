"use client";

import CalculatorPanel from "@/components/ui-learn/CalculatorPanel";
import ChatterBoxPanel from "@/components/ui-learn/ChatterBoxPanel";
import Controller from "@/components/ui-learn/Controller";
import ResultInputPanel from "@/components/ui-learn/ResultInputPanel";
import { useLearnCode } from "@/components/ui-learn/LearnCodeContext";
import Link from "next/link";

export default function Background() {
  const { exercise } = useLearnCode();

  return (
    <div className="flex min-h-screen flex-col items-center px-4 pb-12 pt-8">
      <div className="mb-6 flex w-full max-w-2xl flex-col gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {exercise.title}
          </h1>
      </div>
      <div className="flex w-full max-w-2xl flex-col space-y-4">
        {exercise.kind === "calculator" ? (
          <CalculatorPanel />
        ) : exercise.kind === "chatterBox" ? (
          <ChatterBoxPanel />
        ) : (
          <ResultInputPanel />
        )}
        <Controller />
      </div>
    </div>
  );
}

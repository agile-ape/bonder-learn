"use client";

import {
  compileCalculatorSource,
  compileChatterBoxSource,
  compileResultPreviewSource,
} from "@/lib/learn/compileBlock";
import { clearChatterShoutsStorage } from "@/lib/learn/chatterStorage";
import {
  getExercise,
  type LearnExercise,
} from "@/lib/learn/exercises";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LearnCompiled =
  | { variant: "calculator"; fn: (x: number, y: number) => unknown }
  | { variant: "resultPreview"; run: (n: number) => unknown }
  | { variant: "chatterBox"; shout: () => unknown };

type LearnCodeContextValue = {
  exerciseId: string;
  exercise: LearnExercise;
  codeSource: string;
  setCodeSource: (source: string) => void;
  compiled: LearnCompiled | null;
  compileError: string | null;
  runCode: (source: string) => boolean;
  clearCompiled: () => void;
  chatterShoutsClearedAt: number;
  clearChatterShouts: () => void;
  chatterRunSeq: number;
};

const LearnCodeContext = createContext<LearnCodeContextValue | null>(null);

type LearnCodeProviderProps = {
  exerciseId: string;
  children: ReactNode;
};

export function LearnCodeProvider({
  exerciseId,
  children,
}: LearnCodeProviderProps) {
  const exercise = getExercise(exerciseId);
  if (!exercise) {
    throw new Error(`Unknown exercise: ${exerciseId}`);
  }

  const [codeSource, setCodeSource] = useState(exercise.defaultSource);
  const [compiled, setCompiled] = useState<LearnCompiled | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [chatterShoutsClearedAt, setChatterShoutsClearedAt] = useState(0);
  const [chatterRunSeq, setChatterRunSeq] = useState(0);

  useEffect(() => {
    const next = getExercise(exerciseId);
    if (!next) return;
    setCodeSource(next.defaultSource);
    setCompiled(null);
    setCompileError(null);
  }, [exerciseId]);

  const runCode = useCallback((source: string) => {
    setCodeSource(source);
    const trimmed = source.trim();
    const ex = getExercise(exerciseId);
    if (!ex) {
      setCompileError("Unknown exercise.");
      setCompiled(null);
      return false;
    }

    if (ex.kind === "calculator") {
      const out = compileCalculatorSource(trimmed);
      if (!out.ok) {
        setCompileError(out.error);
        setCompiled(null);
        return false;
      }
      setCompiled({ variant: "calculator", fn: out.value });
      setCompileError(null);
      return true;
    }

    if (ex.kind === "chatterBox") {
      const out = compileChatterBoxSource(trimmed);
      if (!out.ok) {
        setCompileError(out.error);
        setCompiled(null);
        return false;
      }
      setCompiled({ variant: "chatterBox", shout: out.value });
      setCompileError(null);
      setChatterRunSeq((n) => n + 1);
      return true;
    }

    const out = compileResultPreviewSource(trimmed);
    if (!out.ok) {
      setCompileError(out.error);
      setCompiled(null);
      return false;
    }
    setCompiled({ variant: "resultPreview", run: out.value });
    setCompileError(null);
    return true;
  }, [exerciseId]);

  const clearCompiled = useCallback(() => {
    setCompiled(null);
    setCompileError(null);
  }, []);

  const clearChatterShouts = useCallback(() => {
    clearChatterShoutsStorage();
    setChatterShoutsClearedAt((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({
      exerciseId,
      exercise,
      codeSource,
      setCodeSource,
      compiled,
      compileError,
      runCode,
      clearCompiled,
      chatterShoutsClearedAt,
      clearChatterShouts,
      chatterRunSeq,
    }),
    [
      exerciseId,
      exercise,
      codeSource,
      compiled,
      compileError,
      runCode,
      clearCompiled,
      chatterShoutsClearedAt,
      clearChatterShouts,
      chatterRunSeq,
    ],
  );

  return (
    <LearnCodeContext.Provider value={value}>
      {children}
    </LearnCodeContext.Provider>
  );
}

export function useLearnCode(): LearnCodeContextValue {
  const ctx = useContext(LearnCodeContext);
  if (!ctx) {
    throw new Error("useLearnCode must be used within LearnCodeProvider");
  }
  return ctx;
}

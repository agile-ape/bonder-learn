"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LearnCompiledFn = (x: number, y: number) => unknown;

type LearnCodeContextValue = {
  codeSource: string;
  setCodeSource: (source: string) => void;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
  compiledFn: LearnCompiledFn | null;
  compileError: string | null;
  runCode: (source: string) => boolean;
  clearCompiled: () => void;
};

const LearnCodeContext = createContext<LearnCodeContextValue | null>(null);

const FN_REGEX =
  /^function\s+\w+\s*\(\s*x\s*,\s*y\s*\)\s*\{([\s\S]*)\}\s*$/;
const DEFAULT_SOURCE = "function name() {}";

export function LearnCodeProvider({ children }: { children: ReactNode }) {
  const [codeSource, setCodeSource] = useState(DEFAULT_SOURCE);
  const [isEditing, setIsEditing] = useState(false);
  const [compiledFn, setCompiledFn] = useState<LearnCompiledFn | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);

  const enableEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const disableEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const runCode = useCallback((source: string) => {
    setCodeSource(source);
    const trimmed = source.trim();
    const m = trimmed.match(FN_REGEX);
    if (!m) {
      setCompileError("Expected: function name(x, y) { ... }");
      setCompiledFn(null);
      return false;
    }
    const body = m[1];
    try {
      const factory = new Function("x", "y", body) as (
        x: number,
        y: number,
      ) => unknown;
      const wrapped: LearnCompiledFn = (x, y) => factory(Number(x), Number(y));
      setCompiledFn(() => wrapped);
      setCompileError(null);
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setCompileError(msg);
      setCompiledFn(null);
      return false;
    }
  }, []);

  const clearCompiled = useCallback(() => {
    setCompiledFn(null);
    setCompileError(null);
  }, []);

  const value = useMemo(
    () => ({
      codeSource,
      setCodeSource,
      isEditing,
      enableEditing,
      disableEditing,
      compiledFn,
      compileError,
      runCode,
      clearCompiled,
    }),
    [
      codeSource,
      isEditing,
      enableEditing,
      disableEditing,
      compiledFn,
      compileError,
      runCode,
      clearCompiled,
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

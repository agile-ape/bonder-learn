"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChoicePicker from "@/components/trace-it/ChoicePicker";
import CodePanel from "@/components/trace-it/CodePanel";
import LevelBar from "@/components/trace-it/LevelBar";
import TraceTable from "@/components/trace-it/TraceTable";
import { generateChoices } from "@/lib/trace-it/choices";
import { programToLines } from "@/lib/trace-it/codegen";
import { TraceEngine } from "@/lib/trace-it/engine";
import { getLevel, TOTAL_LEVELS } from "@/lib/trace-it/levels";
import { loadProgress, markLevelComplete } from "@/lib/trace-it/storage";
import { PLAYFIELD_BG } from "@/lib/trace-it/theme";
import type { TraceItProgress } from "@/lib/trace-it/storage";
import type { TraceRow } from "@/lib/trace-it/types";

type TraceItGameProps = {
  levelId: number;
};

export default function TraceItGame({ levelId }: TraceItGameProps) {
  const router = useRouter();
  const level = getLevel(levelId);
  const engineRef = useRef<TraceEngine | null>(null);

  const [committed, setCommitted] = useState<TraceRow[]>([]);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [choices, setChoices] = useState<TraceRow[]>([]);
  const [pulseRowIndex, setPulseRowIndex] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [complete, setComplete] = useState(false);
  const [progress, setProgress] = useState<TraceItProgress>(() => loadProgress());

  const codeLines = useMemo(
    () => (level ? programToLines(level.program) : []),
    [level]
  );

  const isWatchMode = level?.mode === "watch";
  const isHardMode = level?.mode === "predict-hard";

  const refreshChoices = useCallback(
    (engine: TraceEngine) => {
      const pending = engine.getPendingRow();
      if (!pending || !level) {
        setChoices([]);
        return;
      }
      setChoices(generateChoices(pending, level, isHardMode));
    },
    [level, isHardMode]
  );

  const syncFromEngine = useCallback(
    (engine: TraceEngine, pulseIndex?: number) => {
      setCommitted([...engine.committed]);
      setActiveLineId(engine.activeLineId);
      if (pulseIndex !== undefined) {
        setPulseRowIndex(pulseIndex);
        window.setTimeout(() => setPulseRowIndex(null), 600);
      }
      refreshChoices(engine);
    },
    [refreshChoices]
  );

  const initLevel = useCallback(() => {
    if (!level) return;
    const engine = new TraceEngine(level);
    engineRef.current = engine;
    setComplete(false);
    setShake(false);
    setPulseRowIndex(null);
    syncFromEngine(engine);
  }, [level, syncFromEngine]);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  useEffect(() => {
    if (!complete) return;
    const timer = window.setTimeout(() => {
      if (levelId < TOTAL_LEVELS - 1) {
        router.push(`/learn/trace-it/${levelId + 1}`);
      } else {
        router.push("/learn/trace-it");
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [complete, levelId, router]);

  const handleStep = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || engine.done || !isWatchMode) return;
    const row = engine.step();
    if (row) {
      syncFromEngine(engine, engine.committed.length - 1);
    }
    if (engine.done) {
      setComplete(true);
      setActiveLineId(null);
      setProgress(markLevelComplete(levelId, TOTAL_LEVELS));
    }
  }, [isWatchMode, levelId, syncFromEngine]);

  const handlePick = useCallback(
    (pick: TraceRow) => {
      const engine = engineRef.current;
      if (!engine || engine.done || isWatchMode) return;

      const result = engine.submitPick(pick);

      if (result === "wrong") {
        setShake(true);
        window.setTimeout(() => {
          setShake(false);
          initLevel();
        }, 400);
        return;
      }

      syncFromEngine(engine, engine.committed.length - 1);

      if (result === "complete") {
        setComplete(true);
        setActiveLineId(null);
        setChoices([]);
        setProgress(markLevelComplete(levelId, TOTAL_LEVELS));
      }
    },
    [isWatchMode, levelId, initLevel, syncFromEngine]
  );

  useEffect(() => {
    if (complete || !level || !isWatchMode) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== " " && e.key !== "ArrowRight") return;
      e.preventDefault();
      handleStep();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [complete, level, isWatchMode, handleStep]);

  if (!level) {
    return (
      <div
        className="flex min-h-full items-center justify-center text-white/70"
        style={{ backgroundColor: PLAYFIELD_BG }}
      >
        Level not found.
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-full flex-col"
      style={{ backgroundColor: PLAYFIELD_BG }}
    >
      <LevelBar
        currentLevelId={levelId}
        progress={progress}
        onSelectLevel={(id) => router.push(`/learn/trace-it/${id}`)}
      />

      <div
        className={`flex flex-1 flex-col items-center justify-center gap-8 px-6 py-8 lg:flex-row lg:items-start lg:justify-center lg:gap-16 ${shake ? "animate-shake" : ""}`}
      >
        <div className="flex w-full max-w-lg flex-col items-center lg:items-start">
          <p className="mb-4 text-sm font-medium text-white/50">{level.title}</p>
          {level.intro && (
            <p className="mb-4 max-w-md text-sm leading-relaxed text-white/70">
              {level.intro}
            </p>
          )}
          <CodePanel lines={codeLines} activeLineId={activeLineId} />
          {isWatchMode && !complete && (
            <p className="mt-6 text-xs font-medium uppercase tracking-wider text-white/40">
              Press Space to step
            </p>
          )}
          {isWatchMode && complete && (
            <p className="mt-6 text-sm font-medium text-lime-400">Complete!</p>
          )}
        </div>

        <div className="flex w-full max-w-md flex-col items-center">
          <TraceTable
            rows={committed}
            varNames={level.varNames}
            conditionExpr={level.conditionExpr}
            pulseRowIndex={pulseRowIndex}
          />

          {!isWatchMode && !complete && choices.length > 0 && (
            <ChoicePicker
              choices={choices}
              level={level}
              onPick={handlePick}
            />
          )}

          {!isWatchMode && complete && (
            <p className="mt-6 text-sm font-medium text-lime-400">Complete!</p>
          )}
        </div>
      </div>
    </div>
  );
}

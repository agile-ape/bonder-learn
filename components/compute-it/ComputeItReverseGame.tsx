"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Grid from "@/components/compute-it/Grid";
import MovePalette from "@/components/compute-it/MovePalette";
import ReverseCodePanel from "@/components/compute-it/ReverseCodePanel";
import { getGoalPosition } from "@/lib/compute-it/goal";
import { applyMove } from "@/lib/compute-it/interpreter";
import {
  getExpectedMoves,
  getReverseConfig,
  getReverseLevel,
} from "@/lib/compute-it/reverse";
import { PLAYFIELD_BG } from "@/lib/compute-it/theme";
import type { Direction, Position } from "@/lib/compute-it/types";

const DEMO_STEP_MS = 600;
const WRONG_RESET_MS = 400;

type Phase = "watch" | "fill" | "success";

type ComputeItReverseGameProps = {
  reverseId: number;
};

export default function ComputeItReverseGame({
  reverseId,
}: ComputeItReverseGameProps) {
  const router = useRouter();
  const config = getReverseConfig(reverseId);
  const level = getReverseLevel(reverseId);

  const expectedMoves = useMemo(
    () => (config ? getExpectedMoves(config.forwardLevelId) : []),
    [config]
  );

  const goalPos = useMemo(
    () => (level ? getGoalPosition(level) : { x: 0, y: 0 }),
    [level]
  );

  const startPos = level?.start ?? { x: 0, y: 0 };

  const [phase, setPhase] = useState<Phase>("watch");
  const [playerPos, setPlayerPos] = useState<Position>(startPos);
  const [answers, setAnswers] = useState<(Direction | null)[]>([]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [shake, setShake] = useState(false);
  const [demoRun, setDemoRun] = useState(0);

  const demoTimerRef = useRef<number | null>(null);

  const clearDemoTimer = useCallback(() => {
    if (demoTimerRef.current !== null) {
      window.clearTimeout(demoTimerRef.current);
      demoTimerRef.current = null;
    }
  }, []);

  const startDemo = useCallback(() => {
    clearDemoTimer();
    setPhase("watch");
    setPlayerPos(startPos);
    setAnswers(Array.from({ length: expectedMoves.length }, () => null));
    setActiveSlot(0);
    setShake(false);

    let pos = { ...startPos };
    let step = 0;

    function scheduleNext() {
      if (step >= expectedMoves.length) {
        setPhase("fill");
        setPlayerPos(startPos);
        return;
      }
      demoTimerRef.current = window.setTimeout(() => {
        pos = applyMove(pos, expectedMoves[step]!);
        setPlayerPos({ ...pos });
        step += 1;
        scheduleNext();
      }, DEMO_STEP_MS);
    }

    scheduleNext();
  }, [clearDemoTimer, expectedMoves, startPos]);

  useEffect(() => {
    if (!level || expectedMoves.length === 0) return;
    startDemo();
    return clearDemoTimer;
  }, [level, expectedMoves.length, startDemo, clearDemoTimer, demoRun]);

  function handlePickMove(dir: Direction) {
    if (phase !== "fill") return;

    const next = [...answers];
    next[activeSlot] = dir;
    setAnswers(next);

    const firstEmpty = next.findIndex((a) => a === null);
    if (firstEmpty !== -1) {
      setActiveSlot(firstEmpty);
    }
  }

  function handleSelectSlot(index: number) {
    if (phase !== "fill") return;
    setActiveSlot(index);
  }

  function handleCheck() {
    if (phase !== "fill") return;

    const complete = answers.every((a) => a !== null);
    if (!complete) return;

    const correct = answers.every((a, i) => a === expectedMoves[i]);
    if (correct) {
      setPhase("success");
      return;
    }

    setShake(true);
    window.setTimeout(() => {
      setShake(false);
      setDemoRun((n) => n + 1);
    }, WRONG_RESET_MS);
  }

  if (!level || !config) {
    return (
      <div
        className="flex min-h-full items-center justify-center text-white/70"
        style={{ backgroundColor: PLAYFIELD_BG }}
      >
        Reverse level not found.
      </div>
    );
  }

  const allFilled = answers.length > 0 && answers.every((a) => a !== null);

  return (
    <div
      className="relative flex min-h-full flex-col"
      style={{ backgroundColor: PLAYFIELD_BG }}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-8 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
        <Grid
          map={level.map}
          player={playerPos}
          goal={goalPos}
          shake={shake}
        />

        <div className="flex w-full max-w-xl flex-col items-center justify-center gap-8 px-4">
          <ReverseCodePanel
            slotCount={expectedMoves.length}
            answers={answers}
            activeSlot={activeSlot}
            onSelectSlot={handleSelectSlot}
            phase={phase}
          />

          {phase === "fill" && (
            <>
              <MovePalette onPick={handlePickMove} />
              <button
                type="button"
                onClick={handleCheck}
                disabled={!allFilled}
                className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-[#2c3e50] shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                Check
              </button>
            </>
          )}

          {phase === "success" && (
            <p className="text-lg font-semibold text-lime-400">Level complete!</p>
          )}

          {phase === "fill" && (
            <button
              type="button"
              onClick={() => setDemoRun((n) => n + 1)}
              className="text-xs text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
            >
              Replay demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

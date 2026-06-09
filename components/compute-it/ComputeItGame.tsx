"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CodePanel from "@/components/compute-it/CodePanel";
import Grid from "@/components/compute-it/Grid";
import { markLevelComplete } from "@/components/compute-it/LevelPicker";
import { getGoalPosition } from "@/lib/compute-it/goal";
import { programToLines } from "@/lib/compute-it/codegen";
import { GameEngine, keyToDirection } from "@/lib/compute-it/interpreter";
import { getLevel, TOTAL_LEVELS } from "@/lib/compute-it/levels";
import { PLAYFIELD_BG } from "@/lib/compute-it/theme";
import { loadProgress, type ComputeItProgress } from "@/lib/compute-it/storage";

type ComputeItGameProps = {
  levelId: number;
};

export default function ComputeItGame({ levelId }: ComputeItGameProps) {
  const router = useRouter();
  const level = getLevel(levelId);
  const engineRef = useRef<GameEngine | null>(null);

  const [playerPos, setPlayerPos] = useState(level?.start ?? { x: 0, y: 0 });
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [complete, setComplete] = useState(false);
  const [progress, setProgress] = useState<ComputeItProgress>(() => loadProgress());

  const codeLines = useMemo(
    () => (level ? programToLines(level.program) : []),
    [level]
  );

  const goalPos = useMemo(
    () => (level ? getGoalPosition(level) : { x: 0, y: 0 }),
    [level]
  );

  const initLevel = useCallback(() => {
    if (!level) return;
    const engine = new GameEngine(level);
    engineRef.current = engine;
    setPlayerPos(engine.getPosition());
    setActiveLineId(engine.activeLineId);
    setComplete(false);
    setShake(false);
  }, [level]);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  useEffect(() => {
    if (!complete) return;
    const timer = window.setTimeout(() => {
      if (levelId < TOTAL_LEVELS - 1) {
        router.push(`/learn/bot/${levelId + 1}`);
      } else {
        router.push("/learn/bot");
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [complete, levelId, router]);

  useEffect(() => {
    if (complete || !level) return;

    function onKeyDown(e: KeyboardEvent) {
      const dir = keyToDirection(e.key);
      if (!dir) return;
      e.preventDefault();

      const engine = engineRef.current;
      if (!engine) return;

      const result = engine.submitMove(dir);

      if (result === "wrong") {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          initLevel();
        }, 400);
        return;
      }

      setPlayerPos(engine.getPosition());
      setActiveLineId(engine.activeLineId);

      if (result === "complete") {
        setComplete(true);
        const updated = markLevelComplete(levelId, TOTAL_LEVELS);
        setProgress(updated);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [complete, level, levelId, initLevel]);

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

  const gridSize = level.map.length;
  const layoutGap =
    gridSize === 4
      ? "gap-12 lg:gap-28"
      : gridSize >= 5
        ? "gap-12 lg:gap-20"
        : "gap-12 lg:gap-16";

  return (
    <div
      className="relative flex min-h-full flex-col"
      style={{ backgroundColor: PLAYFIELD_BG }}
    >
      <div
        className={`flex flex-1 flex-col items-center justify-center px-6 py-8 lg:flex-row lg:items-center lg:justify-center ${layoutGap}`}
      >
        <Grid
          map={level.map}
          player={playerPos}
          goal={goalPos}
          shake={shake}
        />

        <div className="flex w-full max-w-xl flex-col items-center justify-center px-4">
          {/* <ArrowHints nextDirection={nextDirection} /> */}
          <CodePanel lines={codeLines} activeLineId={activeLineId} />
        </div>
      </div>
    </div>
  );
}

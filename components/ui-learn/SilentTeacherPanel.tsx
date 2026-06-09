"use client";

import {
  answersMatch,
  generateChoices,
  getPuzzle,
  TOTAL_PUZZLES,
  type SilentTeacherChallenge,
} from "@/lib/learn/silentTeacher/challenges";
import { markPuzzleComplete } from "@/lib/learn/silentTeacher/storage";
import {
  CODE_TEXT_DIM,
  CODE_TEXT_LIGHT,
  DOT_GOAL,
  PLAYFIELD_BG,
} from "@/lib/compute-it/theme";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

type SilentTeacherPanelProps = {
  puzzleId: number;
};

function ExerciseCard({
  challenge,
  choices,
  onSelect,
  selectedAnswer,
  showResult,
  shake,
}: {
  challenge: SilentTeacherChallenge;
  choices: string[];
  onSelect: (choice: string) => void;
  selectedAnswer: string | null;
  showResult: boolean;
  shake: boolean;
}) {
  return (
    <motion.div
      animate={shake ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-4 rounded-lg bg-white/10 p-6 shadow-lg backdrop-blur-sm"
    >
      <pre
        className="my-2 mb-6 whitespace-pre-wrap font-mono text-2xl font-bold leading-snug"
        style={{ color: CODE_TEXT_LIGHT }}
      >
        {challenge.code}
      </pre>
      <p
        className="mb-4 font-mono text-lg"
        style={{ color: CODE_TEXT_DIM }}
      >
        =
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {choices.map((choice) => {
          const isSelected = selectedAnswer === choice;
          const isCorrect = showResult && choice === challenge.answer;
          const isWrong =
            showResult && isSelected && choice !== challenge.answer;

          let buttonStyle: React.CSSProperties = {
            color: CODE_TEXT_LIGHT,
            borderColor: "rgba(255,255,255,0.2)",
            backgroundColor: "rgba(255,255,255,0.08)",
          };

          if (isCorrect) {
            buttonStyle = {
              color: CODE_TEXT_LIGHT,
              borderColor: DOT_GOAL,
              backgroundColor: DOT_GOAL,
            };
          } else if (isWrong) {
            buttonStyle = {
              color: CODE_TEXT_LIGHT,
              borderColor: "rgba(255,100,100,0.6)",
              backgroundColor: "rgba(255,100,100,0.25)",
            };
          } else if (isSelected && !showResult) {
            buttonStyle = {
              color: CODE_TEXT_LIGHT,
              borderColor: DOT_GOAL,
              backgroundColor: "rgba(120,176,221,0.35)",
            };
          }

          return (
            <button
              key={choice}
              type="button"
              disabled={showResult}
              onClick={() => onSelect(choice)}
              className="rounded-lg border-2 px-4 py-3 font-mono text-lg font-semibold transition-colors disabled:cursor-default"
              style={buttonStyle}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function LastAttemptCard({ challenge }: { challenge: SilentTeacherChallenge }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="mx-4 rounded-lg bg-white/10 p-6 backdrop-blur-sm"
    >
      <pre
        className="my-2 mb-4 whitespace-pre-wrap font-mono text-2xl font-bold leading-snug"
        style={{ color: CODE_TEXT_DIM }}
      >
        {challenge.code}
      </pre>
      <pre
        className="my-2 inline-block rounded px-3 py-1 font-mono text-2xl font-bold"
        style={{ backgroundColor: DOT_GOAL, color: CODE_TEXT_LIGHT }}
      >
        = {challenge.answer}
      </pre>
    </motion.div>
  );
}

export default function SilentTeacherPanel({ puzzleId }: SilentTeacherPanelProps) {
  const router = useRouter();
  const challenge = getPuzzle(puzzleId);
  const choices = useMemo(
    () => (challenge ? generateChoices(challenge, puzzleId) : []),
    [challenge, puzzleId]
  );

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shake, setShake] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<SilentTeacherChallenge | null>(
    null
  );

  const handleSelect = useCallback(
    (choice: string) => {
      if (!challenge || showResult) return;

      setSelectedAnswer(choice);

      if (answersMatch(choice, challenge.answer)) {
        setShowResult(true);
        markPuzzleComplete(puzzleId);
        window.setTimeout(() => {
          if (puzzleId < TOTAL_PUZZLES - 1) {
            router.push(`/learn/silent-teacher/${puzzleId + 1}`);
          } else {
            router.push("/learn/silent-teacher");
          }
        }, 800);
        return;
      }

      setShowResult(true);
      setLastAttempt(challenge);
      setShake(true);
      window.setTimeout(() => {
        setShake(false);
        setShowResult(false);
        setSelectedAnswer(null);
      }, 1200);
    },
    [challenge, showResult, puzzleId, router]
  );

  if (!challenge) {
    return (
      <div
        className="flex min-h-full items-center justify-center font-mono text-xl"
        style={{ backgroundColor: PLAYFIELD_BG, color: CODE_TEXT_DIM }}
      >
        Puzzle not found.
      </div>
    );
  }

  return (
    <div
      className="min-h-full font-[Calibri,Helvetica,Arial,sans-serif]"
      style={{ backgroundColor: PLAYFIELD_BG, color: CODE_TEXT_LIGHT }}
    >
      <header className="flex items-center justify-between px-6 py-4">
        <p
          className="font-mono text-sm font-bold uppercase tracking-[0.35em]"
          style={{ color: CODE_TEXT_DIM }}
        >
          Silent Teacher — Puzzle {puzzleId + 1}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 text-2xl lg:grid-cols-2">
        <div>
          <ExerciseCard
            challenge={challenge}
            choices={choices}
            onSelect={handleSelect}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            shake={shake}
          />
        </div>

        <div>
          <AnimatePresence mode="wait">
            {lastAttempt ? (
              <LastAttemptCard key={lastAttempt.code} challenge={lastAttempt} />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

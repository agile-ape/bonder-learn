"use client";

import {
  ArrowLeftRight,
  Binary,
  Brackets,
  Calculator,
  FunctionSquare,
  Tag,
  Variable,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import Comparison from "@/components/ui-skills/Comparison";
import LetConst from "@/components/ui-skills/LetConst";
import Logic from "@/components/ui-skills/Logic";
import Operators from "@/components/ui-skills/Operators";
import ToolFunction from "@/components/ui-skills/ToolFunction";
import ToolVariable from "@/components/ui-skills/ToolVariable";
import Types from "@/components/ui-skills/Types";

export type SkillId =
  | "variable"
  | "letConst"
  | "types"
  | "function"
  | "operators"
  | "logic"
  | "comparison";

type SkillConfig = {
  id: SkillId;
  label: string;
  icon: typeof Variable;
  Panel: ComponentType;
};

const SKILLS: SkillConfig[] = [
  { id: "variable", label: "Variable", icon: Variable, Panel: ToolVariable },
  { id: "letConst", label: "Let / const", icon: Brackets, Panel: LetConst },
  { id: "types", label: "Types", icon: Tag, Panel: Types },
  { id: "function", label: "Function", icon: FunctionSquare, Panel: ToolFunction },
  {
    id: "operators",
    label: "Operators",
    icon: Calculator,
    Panel: Operators,
  },
  { id: "logic", label: "Logic", icon: Binary, Panel: Logic },
  {
    id: "comparison",
    label: "Comparison",
    icon: ArrowLeftRight,
    Panel: Comparison,
  },
];

const skillById = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
) as Record<SkillId, SkillConfig>;

function ForkDownTwo() {
  return (
    <svg
      className="pointer-events-none text-border"
      width="100%"
      height="40"
      viewBox="0 0 200 40"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M 100 0 L 100 14 M 60 14 L 140 14 M 60 14 L 60 40 M 140 14 L 140 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

function StemDown() {
  return (
    <div className="flex h-8 w-full justify-center" aria-hidden>
      <div className="w-px shrink-0 bg-border" />
    </div>
  );
}

function ForkDownThree() {
  return (
    <svg
      className="pointer-events-none w-full max-w-[280px] text-border"
      height="44"
      viewBox="0 0 280 44"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden
    >
      <path
        d="M 140 0 L 140 12 M 46 12 L 234 12 M 46 12 L 46 44 M 140 12 L 140 44 M 234 12 L 234 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

function SkillNodeButton({
  skill,
  selectedId,
  onSelect,
}: {
  skill: SkillConfig;
  selectedId: SkillId | null;
  onSelect: (id: SkillId) => void;
}) {
  const Icon = skill.icon;
  const selected = selectedId === skill.id;
  return (
    <button
      type="button"
      onClick={() => onSelect(skill.id)}
      aria-pressed={selected}
      aria-current={selected ? "true" : undefined}
      className={`flex min-w-[5.5rem] flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-background text-foreground hover:bg-muted/40"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
      <span className="text-xs font-medium leading-tight">{skill.label}</span>
    </button>
  );
}

export default function SkillTree() {
  const [selectedId, setSelectedId] = useState<SkillId | null>(null);
  const selected = selectedId ? skillById[selectedId] : null;
  const Panel = selected?.Panel;

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Skill tree
        </p>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8">
          {/* Left branch: variable → let/const | types */}
          <div className="flex flex-col items-center">
            <SkillNodeButton
              skill={skillById.variable}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <StemDown />
            <div className="w-full max-w-[220px] px-1">
              <ForkDownTwo />
            </div>
            <div className="-mt-px flex w-full max-w-[220px] flex-row justify-center gap-4">
              <SkillNodeButton
                skill={skillById.letConst}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
              <SkillNodeButton
                skill={skillById.types}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          </div>

          {/* Right branch: function → operators | logic | comparison */}
          <div className="flex flex-col items-center">
            <SkillNodeButton
              skill={skillById.function}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <StemDown />
            <ForkDownThree />
            <div className="-mt-1 flex w-full max-w-[280px] flex-row flex-wrap justify-center gap-2 sm:gap-3">
              <SkillNodeButton
                skill={skillById.operators}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
              <SkillNodeButton
                skill={skillById.logic}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
              <SkillNodeButton
                skill={skillById.comparison}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[280px] rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
        {Panel ? (
          <Panel />
        ) : (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">Select a skill</p>
          </div>
        )}
      </div>
    </div>
  );
}

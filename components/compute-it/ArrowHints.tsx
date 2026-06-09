import type { Direction } from "@/lib/compute-it/types";

type ArrowHintsProps = {
  nextDirection: Direction | null;
};

const ARROWS: { dir: Direction; label: string; className: string }[] = [
  { dir: "up", label: "↑", className: "col-start-2 row-start-1" },
  { dir: "left", label: "←", className: "col-start-1 row-start-2" },
  { dir: "down", label: "↓", className: "col-start-2 row-start-3" },
  { dir: "right", label: "→", className: "col-start-3 row-start-2" },
];

export default function ArrowHints({ nextDirection }: ArrowHintsProps) {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1.5">
      {ARROWS.map(({ dir, label, className }) => {
        const active = nextDirection === dir;
        return (
          <div
            key={dir}
            className={`flex h-12 w-12 items-center justify-center rounded-md text-lg font-semibold ${className} ${
              active
                ? "bg-white text-[#2c3e50] shadow-md"
                : "bg-[#4a5a6a]/60 text-white/30"
            }`}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

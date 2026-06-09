import { CODE_TEXT_DIM, CODE_TEXT_LIGHT } from "@/lib/compute-it/theme";
import type { CodeLine } from "@/lib/compute-it/types";

type CodePanelProps = {
  lines: CodeLine[];
  activeLineId: string | null;
};

export default function CodePanel({ lines, activeLineId }: CodePanelProps) {
  return (
    <div className="inline-block text-left font-mono text-4xl leading-relaxed md:text-5xl md:leading-relaxed lg:text-6xl">
      {lines.map((line) => {
        const active = line.highlightable && line.id === activeLineId;
        return (
          <div
            key={line.id}
            className={`whitespace-pre px-2 py-0.5 transition-colors ${
              active ? "drop-shadow-sm" : ""
            }`}
            style={{
              paddingLeft: `calc(${line.indent * 1.25}rem + 0.5rem)`,
              color: active ? CODE_TEXT_LIGHT : CODE_TEXT_DIM,
            }}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
}

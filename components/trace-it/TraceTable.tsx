"use client";

import {
  CONDITION_FALSE,
  CONDITION_TRUE,
  ROW_PULSE,
  TABLE_CELL,
  TABLE_CELL_DIM,
  TABLE_HEADER,
} from "@/lib/trace-it/theme";
import type { TraceRow } from "@/lib/trace-it/types";

type TraceTableProps = {
  rows: TraceRow[];
  varNames: string[];
  conditionExpr?: string;
  pulseRowIndex?: number | null;
};

function formatCell(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return String(value);
}

function formatCondition(result: boolean | null | undefined): string {
  if (result === null || result === undefined) return "—";
  return result ? "true" : "false";
}

export default function TraceTable({
  rows,
  varNames,
  conditionExpr,
  pulseRowIndex,
}: TraceTableProps) {
  return (
    <div className="w-full max-w-md overflow-x-auto">
      <table className="w-full border-collapse font-mono text-sm md:text-base">
        <thead>
          <tr>
            <th
              className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider"
              style={{ color: TABLE_HEADER }}
            >
              step
            </th>
            {varNames.map((name) => (
              <th
                key={name}
                className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider"
                style={{ color: TABLE_HEADER }}
              >
                {name}
              </th>
            ))}
            {conditionExpr && (
              <th
                className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider"
                style={{ color: TABLE_HEADER }}
              >
                {conditionExpr}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const isPulse = pulseRowIndex === index;
            const condResult = row.condition?.result;
            return (
              <tr
                key={`${row.label}-${index}`}
                className="transition-colors duration-300"
                style={{
                  backgroundColor: isPulse ? `${ROW_PULSE}22` : "transparent",
                }}
              >
                <td
                  className="px-3 py-2 text-left capitalize"
                  style={{ color: TABLE_CELL_DIM }}
                >
                  {row.label}
                </td>
                {varNames.map((name) => (
                  <td
                    key={name}
                    className="px-3 py-2 text-center tabular-nums"
                    style={{ color: TABLE_CELL }}
                  >
                    {formatCell(row.vars[name])}
                  </td>
                ))}
                {conditionExpr && (
                  <td
                    className="px-3 py-2 text-center font-semibold"
                    style={{
                      color:
                        condResult === null || condResult === undefined
                          ? TABLE_CELL_DIM
                          : condResult
                            ? CONDITION_TRUE
                            : CONDITION_FALSE,
                    }}
                  >
                    {formatCondition(condResult)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

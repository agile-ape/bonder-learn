import type { CodeLine, Stmt } from "./types";
import { formatConditionExpr } from "./types";

export function programToLines(stmts: Stmt[], indent = 0): CodeLine[] {
  const lines: CodeLine[] = [];

  for (const stmt of stmts) {
    switch (stmt.type) {
      case "let":
        lines.push({
          id: stmt.id,
          text: `let ${stmt.name} = ${stmt.value};`,
          indent,
          highlightable: true,
        });
        break;
      case "assign": {
        const rhs =
          stmt.rhs.kind === "num" ? String(stmt.rhs.value) : stmt.rhs.name;
        const op = stmt.op === "=" ? "" : stmt.op.slice(0, -1);
        lines.push({
          id: stmt.id,
          text: `${stmt.name} ${op ? op + "= " : "= "}${rhs};`,
          indent,
          highlightable: true,
        });
        break;
      }
      case "increment": {
        const suffix = stmt.delta === 1 ? "++" : stmt.delta === -1 ? "--" : `+= ${stmt.delta}`;
        const text =
          stmt.delta === 1 || stmt.delta === -1
            ? `${stmt.name}${suffix};`
            : `${stmt.name} += ${stmt.delta};`;
        lines.push({
          id: stmt.id,
          text,
          indent,
          highlightable: true,
        });
        break;
      }
      case "for": {
        const cond = formatConditionExpr(stmt.condition);
        const inc =
          stmt.increment.delta === 1
            ? `${stmt.var}++`
            : stmt.increment.delta === -1
              ? `${stmt.var}--`
              : `${stmt.var} += ${stmt.increment.delta}`;
        lines.push({
          id: `${stmt.id}-header`,
          text: `for (let ${stmt.var} = ${stmt.init}; ${cond}; ${inc}) {`,
          indent,
          highlightable: false,
        });
        lines.push(...programToLines(stmt.body, indent + 1));
        lines.push({
          id: `${stmt.id}-close`,
          text: "}",
          indent,
          highlightable: false,
        });
        break;
      }
      case "while": {
        const cond = formatConditionExpr(stmt.condition);
        lines.push({
          id: `${stmt.id}-header`,
          text: `while (${cond}) {`,
          indent,
          highlightable: false,
        });
        lines.push(...programToLines(stmt.body, indent + 1));
        lines.push({
          id: `${stmt.id}-close`,
          text: "}",
          indent,
          highlightable: false,
        });
        break;
      }
    }
  }

  return lines;
}

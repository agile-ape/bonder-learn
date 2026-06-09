import type { CodeLine, Stmt } from "./types";

export function programToLines(stmts: Stmt[], indent = 0): CodeLine[] {
  const lines: CodeLine[] = [];

  for (const stmt of stmts) {
    switch (stmt.type) {
      case "move":
        lines.push({
          id: stmt.id,
          text: `${stmt.dir}()`,
          indent,
          highlightable: true,
        });
        break;
      case "if": {
        const pred = stmt.negated ? `!${stmt.color}()` : `${stmt.color}()`;
        lines.push({
          id: `${stmt.id}-cond`,
          text: `if (${pred}) {`,
          indent,
          highlightable: false,
        });
        lines.push(...programToLines(stmt.then, indent + 1));
        if (stmt.else) {
          lines.push({
            id: `${stmt.id}-else`,
            text: "} else {",
            indent,
            highlightable: false,
          });
          lines.push(...programToLines(stmt.else, indent + 1));
        }
        lines.push({
          id: `${stmt.id}-close`,
          text: "}",
          indent,
          highlightable: false,
        });
        break;
      }
      case "while":
        lines.push({
          id: `${stmt.id}-cond`,
          text: `while (${stmt.color}()) {`,
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
      case "repeat":
        lines.push({
          id: `${stmt.id}-open`,
          text: `repeat(${stmt.count}) {`,
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
      case "call":
        lines.push({
          id: stmt.id,
          text: `${stmt.name}()`,
          indent,
          highlightable: false,
        });
        break;
      case "define":
        lines.push({
          id: `${stmt.id}-sig`,
          text: `function ${stmt.name}() {`,
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

  return lines;
}

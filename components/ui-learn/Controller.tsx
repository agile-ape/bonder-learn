"use client";

import { useLearnCode } from "@/components/ui-learn/LearnCodeContext";
import { CHATTER_BOX_ANSWER } from "@/lib/learn/exercises";
import { useRef } from "react";

export default function Controller() {
  const {
    exercise,
    codeSource,
    setCodeSource,
    runCode,
    compileError,
    clearCompiled,
    clearChatterShouts,
  } = useLearnCode();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertSnippet = (snippet: string, tokenToSelect: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const insertPos = codeSource.length;
    const needsLeadingNewline =
      insertPos > 0 && !codeSource.slice(0, insertPos).endsWith("\n");
    const textToInsert = `${needsLeadingNewline ? "\n" : ""}${snippet}`;

    const before = codeSource.slice(0, insertPos);
    const after = codeSource.slice(insertPos);
    const nextCode = `${before}${textToInsert}${after}`;
    setCodeSource(nextCode);

    const tokenIndex = textToInsert.indexOf(tokenToSelect);
    if (tokenIndex < 0) return;

    const selectStart = insertPos + tokenIndex;
    const selectEnd = selectStart + tokenToSelect.length;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectStart, selectEnd);
    });
  };

  const applyAnswer = () => {
    setCodeSource(CHATTER_BOX_ANSWER);
    clearCompiled();
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const isCalculator = exercise.kind === "calculator";
  const isChatterBox = exercise.kind === "chatterBox";

  return (
    <section
      className="w-full rounded-2xl border border-border bg-card/80 p-4 shadow-sm transition-colors"
      aria-label="Your code"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Your code
        </h3>
      </div>
      <textarea
        ref={textareaRef}
        value={codeSource}
        onChange={(e) => setCodeSource(e.target.value)}
        spellCheck={false}
        rows={10}
        className="w-full resize-y rounded-xl border border-border bg-muted/30 px-3 py-3 font-mono text-sm text-foreground outline-none ring-ring focus-visible:ring-2"
        aria-label="Code editor"
      />
      {compileError ? (
        <p className="mt-2 text-sm text-destructive" role="status">
          {compileError}
        </p>
      ) : null}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {isCalculator ? (
            <>
              <button
                type="button"
                className="h-10 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground"
                onClick={() =>
                  insertSnippet(
                    "let x;\nlet y;\n\nfunction compute() {\n\n  return\n}",
                    "return",
                  )
                }
              >
                Block + compute
              </button>
              <button
                type="button"
                className="h-10 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground"
                onClick={() => insertSnippet("let x;\n", "x")}
              >
                let x
              </button>
            </>
          ) : isChatterBox ? (
            <button
              type="button"
              className="h-10 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground"
              onClick={applyAnswer}
            >
              Ans.
            </button>
          ) : (
            <>
              <button
                type="button"
                className="h-10 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground"
                onClick={() =>
                  insertSnippet(
                    "function result(count) {\n\n  return \"Good\"\n}",
                    "count",
                  )
                }
              >
                result()
              </button>
              <button
                type="button"
                className="h-10 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground"
                onClick={() => insertSnippet("let x;\n", "x")}
              >
                let x
              </button>
            </>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="h-10 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground"
            onClick={() => {
              setCodeSource(exercise.defaultSource);
              clearCompiled();
              if (isChatterBox) clearChatterShouts();
            }}
          >
            Reset
          </button>
          <button
            type="button"
            className="h-10 rounded-md border-none bg-blue-100 px-5 text-sm font-medium text-primary-foreground shadow-md shadow-[0_4px_6px_-1px_rgba(34,197,94,.3),0_2px_4px_-2px_rgba(6,182,212,.3)] hover:opacity-90"
            onClick={() => runCode(codeSource)}
          >
            Run
          </button>
        </div>
      </div>
    </section>
  );
}

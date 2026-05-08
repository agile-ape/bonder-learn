"use client";

import { useLearnCode } from "@/components/ui-learn/LearnCodeContext";
import { useRef } from "react";

export default function Controller() {
  const {
    codeSource,
    setCodeSource,
    isEditing,
    disableEditing,
    runCode,
    compileError,
    clearCompiled,
  } = useLearnCode();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertSnippet = (snippet: string, tokenToSelect: string) => {
    if (!isEditing) return;
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

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 px-4 pb-4">
      <div
        className={`pointer-events-auto mx-auto w-full max-w-3xl rounded-2xl border p-3 shadow-lg transition-colors ${
          isEditing
            ? "border-border bg-background/95"
            : "border-border/60 bg-slate-900/80"
        }`}
      >
        {!isEditing ? (
          <div className="mb-2 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200">
            Editor is locked. Click Edit above to modify function.
          </div>
        ) : null}
        <textarea
          ref={textareaRef}
          value={codeSource}
          onChange={(e) => setCodeSource(e.target.value)}
          spellCheck={false}
          rows={6}
          disabled={!isEditing}
          className={`w-full resize-none rounded-xl border px-3 py-3 font-mono text-sm outline-none ring-ring focus-visible:ring-2 ${
            isEditing
              ? "border-border bg-muted/30 text-foreground"
              : "cursor-not-allowed border-white/10 bg-black/40 text-slate-300 opacity-80"
          }`}
          aria-label="Code editor"
        />
        {compileError ? (
          <p className="text-sm text-destructive" role="status">
            {compileError}
          </p>
        ) : null}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!isEditing}
              className="h-10 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                insertSnippet("function name() {\n\n  return\n}", "name")
              }
            >
              Function
            </button>
            <button
              type="button"
              disabled={!isEditing}
              className="h-10 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => insertSnippet("let name:type = ", "name")}
            >
              Let
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-10 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground"
              onClick={() => {
                setCodeSource("function name() {}");
                clearCompiled();
                disableEditing();
              }}
            >
              Reset
            </button>
            <button
              type="button"
              className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
              onClick={() => {
                const ok = runCode(codeSource);
                if (ok) {
                  disableEditing();
                }
              }}
            >
              Run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

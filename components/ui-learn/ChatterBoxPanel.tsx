"use client";

import { useLearnCode } from "@/components/ui-learn/LearnCodeContext";
import {
  createSavedChatterShout,
  loadChatterShouts,
  saveChatterShouts,
  type SavedChatterShout,
} from "@/lib/learn/chatterStorage";
import { useEffect, useRef, useState } from "react";

function ChatBubble({
  text,
  className = "",
  animate = false,
}: {
  text: string;
  className?: string;
  animate?: boolean;
}) {
  return (
    <div
      className={`relative max-w-[220px] rounded-2xl border-2 border-primary/30 bg-card px-4 py-2.5 text-center shadow-md transition-transform duration-300 ${
        animate ? "scale-110 animate-chatter-pop" : "scale-100"
      } ${className}`}
    >
      <p className="font-semibold text-foreground">{text}</p>
      <div
        className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-primary/30 bg-card"
        aria-hidden
      />
    </div>
  );
}

export default function ChatterBoxPanel() {
  const { compiled, chatterShoutsClearedAt, chatterRunSeq } = useLearnCode();
  const [message, setMessage] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [isShouting, setIsShouting] = useState(false);
  const [savedShouts, setSavedShouts] = useState<SavedChatterShout[]>([]);
  const lastProcessedRunRef = useRef(0);

  const shoutFn =
    compiled?.variant === "chatterBox" ? compiled.shout : null;

  useEffect(() => {
    setSavedShouts(loadChatterShouts());
    lastProcessedRunRef.current = 0;
  }, [chatterShoutsClearedAt]);

  useEffect(() => {
    if (!shoutFn) {
      setMessage(null);
      setRunError(null);
      setIsShouting(false);
      return;
    }

    if (chatterRunSeq === 0 || chatterRunSeq === lastProcessedRunRef.current) {
      return;
    }
    lastProcessedRunRef.current = chatterRunSeq;

    setRunError(null);
    try {
      const out = String(shoutFn());
      setMessage(out);
      setIsShouting(true);

      const newShout = createSavedChatterShout(out);
      setSavedShouts((prev) => {
        const next = [...prev, newShout];
        saveChatterShouts(next);
        return next;
      });

      const t = window.setTimeout(() => setIsShouting(false), 500);
      return () => window.clearTimeout(t);
    } catch (e) {
      setMessage(null);
      setRunError(e instanceof Error ? e.message : String(e));
      setIsShouting(false);
    }
  }, [shoutFn, chatterRunSeq]);

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-4 rounded-2xl border border-border bg-gradient-to-br from-white/60 via-white/30 to-transparent p-6 text-foreground shadow-sm backdrop-blur-sm">
      <p className="w-full text-sm text-muted-foreground">
        <ul>
          <li>
            Write a <span className="font-mono">shout()</span> function that
            returns a string type.{" "}
          </li>
          <li>Run code to make box shout. </li>
          <li>
            You can make it return anything as long as it&apos;s a string.{" "}
          </li>
        </ul>
      </p>

      <div className="flex w-full max-w-sm flex-col items-center pt-2">
        {message ? (
          <div className="relative z-30 mb-3" role="status" aria-live="polite">
            <ChatBubble text={message} animate={isShouting} />
          </div>
        ) : null}

        <div className="relative w-full min-h-[220px] pb-6">
          {savedShouts.map((shout) => (
            <div
              key={shout.id}
              className="pointer-events-none absolute z-20 -translate-x-1/2"
              style={{ top: `${shout.top}%`, left: `${shout.left}%` }}
            >
              <ChatBubble text={shout.text} className="text-xs shadow-lg" />
            </div>
          ))}

          <div
            className={`relative z-10 mx-auto flex h-36 w-40 flex-col items-center justify-center rounded-2xl border-2 border-border bg-card shadow-lg transition-transform duration-300 ${
              isShouting ? "scale-105" : "scale-100"
            }`}
            aria-hidden
          >
            <div className="absolute left-8 top-10 h-3 w-3 rounded-full bg-foreground/80" />
            <div className="absolute right-8 top-10 h-3 w-3 rounded-full bg-foreground/80" />
            <div
              className={`mt-14 h-5 w-12 rounded-b-full border-2 border-foreground/70 bg-transparent transition-all duration-300 ${
                isShouting ? "h-7 w-14 border-primary" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {runError ? (
        <p className="w-full text-sm text-destructive" role="alert">
          {runError}
        </p>
      ) : null}
    </div>
  );
}

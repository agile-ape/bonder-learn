"use client";

import { LearnPuzzleNavFromPath } from "@/components/ui-learn/LearnPuzzleNav";
import { EXERCISES } from "@/lib/learn/exercises";
import { getActivePuzzleModule } from "@/lib/learn/puzzleModules";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const SILENT_TEACHER_HREF = "/learn/silent-teacher";
const BOT_PREFIX = "/learn/bot";
const PROGRAMMER_PREFIX = "/learn/programmer";
const TRACE_IT_PREFIX = "/learn/trace-it";

function navLinkClass(active: boolean): string {
  return `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    active
      ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
  }`;
}

export default function LearnShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSilentTeacher = pathname.startsWith(SILENT_TEACHER_HREF);
  const isBot = pathname.startsWith(BOT_PREFIX);
  const isProgrammer = pathname.startsWith(PROGRAMMER_PREFIX);
  const isTraceIt = pathname.startsWith(TRACE_IT_PREFIX);
  const puzzleModule = getActivePuzzleModule(pathname);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <div className="flex shrink-0">
        <aside className="flex w-64 flex-col border-r border-border bg-card">
          <div className="border-b border-border px-4 py-5">
            <Link
              href="/learn"
              className="block font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              Code Haus
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Placeholder tagline for the learning workspace. Short words go here
              until final copy ships.
            </p>
          </div>
          <nav
            className="flex flex-1 flex-col gap-0.5 p-2"
            aria-label="Exercises"
          >
            <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Exercises
            </p>
            <Link
              href={SILENT_TEACHER_HREF}
              className={navLinkClass(isSilentTeacher)}
            >
              Silent Teacher
            </Link>

            <p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Programmer and Bot
            </p>
            <Link href="/learn/bot" className={navLinkClass(isBot)}>
              Bot
            </Link>
            <Link
              href="/learn/programmer"
              className={navLinkClass(isProgrammer)}
            >
              Programmer
            </Link>

            <Link
              href="/learn/trace-it"
              className={`${navLinkClass(isTraceIt)} mt-1`}
            >
              Trace It
            </Link>
            {EXERCISES.map((ex) => {
              const href = `/learn/${ex.id}`;
              const active = pathname === href;
              return (
                <Link key={ex.id} href={href} className={navLinkClass(active)}>
                  {ex.title}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border px-4 py-3">
            <p className="text-[11px] leading-snug text-muted-foreground">
              Placeholder footer note. More words can live down here later.
            </p>
          </div>
        </aside>
        {puzzleModule ? <LearnPuzzleNavFromPath /> : null}
      </div>
      <main className="min-h-screen min-w-0 flex-1">{children}</main>
    </div>
  );
}

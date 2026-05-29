"use client";

import { EXERCISES } from "@/lib/learn/exercises";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function LearnShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
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
        <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="Exercises">
          <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Exercises
          </p>
          {EXERCISES.map((ex) => {
            const href = `/learn/${ex.id}`;
            const active = pathname === href;
            return (
              <Link
                key={ex.id}
                href={href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
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
      <main className="min-h-screen min-w-0 flex-1">{children}</main>
    </div>
  );
}

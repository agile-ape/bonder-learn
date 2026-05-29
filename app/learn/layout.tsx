import LearnShell from "@/components/ui-learn/LearnShell";
import type { ReactNode } from "react";

export default function LearnLayout({ children }: { children: ReactNode }) {
  return <LearnShell>{children}</LearnShell>;
}

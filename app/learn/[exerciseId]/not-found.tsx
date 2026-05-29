import Link from "next/link";

export default function LearnExerciseNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-foreground">
      <p className="text-sm text-muted-foreground">That exercise does not exist.</p>
      <Link
        href="/learn"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Back to overview
      </Link>
    </div>
  );
}

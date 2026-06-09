export default function LearnIndexPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-8 py-16 text-center">
      <p className="max-w-sm text-sm text-muted-foreground">
        Select an exercise from the sidebar to open the editor and preview.
      </p>
      <div className="flex flex-col gap-2 text-sm">
        <a
          href="/learn/silent-teacher"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Silent Teacher — read code, pick the answer
        </a>
        <a
          href="/learn/bot"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bot — read code, press arrow keys
        </a>
        <a
          href="/learn/programmer"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Programmer — fill in the missing moves
        </a>
        <a
          href="/learn/trace-it"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Trace It — step through loops, watch variables
        </a>
      </div>
      <p className="text-xs text-muted-foreground/80">
        Placeholder helper text — curriculum and progress can go here later.
      </p>
    </div>
  );
}

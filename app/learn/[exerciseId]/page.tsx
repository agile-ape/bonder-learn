import Background from "@/components/ui-learn/Background";
import { LearnCodeProvider } from "@/components/ui-learn/LearnCodeContext";
import { getExercise } from "@/lib/learn/exercises";
import { notFound } from "next/navigation";

type PageProps = {
  params: { exerciseId: string };
};

export default function LearnExercisePage({ params }: PageProps) {
  const { exerciseId } = params;
  const exercise = getExercise(exerciseId);
  if (!exercise) {
    notFound();
  }

  return (
    <LearnCodeProvider exerciseId={exerciseId}>
      <div className="relative min-h-screen bg-background flex justify-center items-center">
        <Background />
      </div>
    </LearnCodeProvider>
  );
}

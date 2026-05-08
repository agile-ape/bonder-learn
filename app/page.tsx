import Controller from "@/components/ui-learn/Controller";
import Background from "@/components/ui-learn/Background";
import { LearnCodeProvider } from "@/components/ui-learn/LearnCodeContext";

export default function Home() {
  return (
    <LearnCodeProvider>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <Background />
        <Controller />
      </div>
    </LearnCodeProvider>
  );
}

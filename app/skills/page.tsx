import SkillTree from "@/components/ui-skills/SkillTree";

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Skills
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore concepts and read details on the right.
        </p>
      </div>
      <SkillTree />
    </div>
  );
}

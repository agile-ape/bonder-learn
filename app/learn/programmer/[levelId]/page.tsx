import ComputeItReverseGame from "@/components/compute-it/ComputeItReverseGame";

type PageProps = {
  params: { levelId: string };
};

export default function ProgrammerLevelPage({ params }: PageProps) {
  const reverseId = parseInt(params.levelId, 10);
  return (
    <ComputeItReverseGame
      reverseId={Number.isNaN(reverseId) ? 0 : reverseId}
    />
  );
}

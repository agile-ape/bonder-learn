import ComputeItGame from "@/components/compute-it/ComputeItGame";

type PageProps = {
  params: { levelId: string };
};

export default function BotLevelPage({ params }: PageProps) {
  const levelId = parseInt(params.levelId, 10);
  return <ComputeItGame levelId={Number.isNaN(levelId) ? 0 : levelId} />;
}

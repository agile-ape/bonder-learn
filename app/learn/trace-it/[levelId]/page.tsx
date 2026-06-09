import TraceItGame from "@/components/trace-it/TraceItGame";

type PageProps = {
  params: { levelId: string };
};

export default function TraceItLevelPage({ params }: PageProps) {
  const levelId = parseInt(params.levelId, 10);
  return <TraceItGame levelId={Number.isNaN(levelId) ? 0 : levelId} />;
}

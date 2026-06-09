import SilentTeacherPanel from "@/components/ui-learn/SilentTeacherPanel";

type PageProps = {
  params: { puzzleId: string };
};

export default function SilentTeacherPuzzlePage({ params }: PageProps) {
  const puzzleId = parseInt(params.puzzleId, 10);
  return (
    <SilentTeacherPanel puzzleId={Number.isNaN(puzzleId) ? 0 : puzzleId} />
  );
}

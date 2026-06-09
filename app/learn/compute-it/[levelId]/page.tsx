import { redirect } from "next/navigation";

type PageProps = {
  params: { levelId: string };
};

export default function ComputeItLevelRedirectPage({ params }: PageProps) {
  redirect(`/learn/bot/${params.levelId}`);
}

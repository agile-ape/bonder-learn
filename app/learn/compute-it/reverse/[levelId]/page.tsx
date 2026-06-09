import { redirect } from "next/navigation";

type PageProps = {
  params: { levelId: string };
};

export default function ComputeItReverseRedirectPage({ params }: PageProps) {
  redirect(`/learn/programmer/${params.levelId}`);
}

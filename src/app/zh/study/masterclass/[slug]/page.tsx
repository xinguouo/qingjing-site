import { MasterclassDetailPage } from "@/components/StudyPages";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <MasterclassDetailPage locale="zh" slug={slug} />;
}

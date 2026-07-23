import { ArtworkDetailPage } from "@/components/ArtworkDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  return <ArtworkDetailPage category={category} locale="zh" slug={slug} />;
}

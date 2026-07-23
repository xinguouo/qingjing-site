import {ArtworkDetailPage} from "@/components/ArtworkDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  return <ArtworkDetailPage category="glass-art" locale="zh" slug={slug} />;
}

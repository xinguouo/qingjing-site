import { ArtworkDetailPage } from "@/components/ArtworkDetailPage";
import { redirect } from "next/navigation";

function isLegacySculptureCategory(category: string) {
  return category === "glass-art" || category === "sculpture-art";
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  if (isLegacySculptureCategory(category)) {
    redirect(`/zh/art-projects/sculpture/${slug}`);
  }

  return <ArtworkDetailPage category={category} locale="zh" slug={slug} />;
}

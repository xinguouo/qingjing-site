import { ArtworkDetailPage } from "@/components/ArtworkDetailPage";
import { redirect } from "next/navigation";

function isLegacyGlassEaselCategory(category: string) {
  return category === "glass-art" || category === "sculpture-art";
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  if (isLegacyGlassEaselCategory(category)) {
    redirect(`/art-projects/sculpture/${slug}`);
  }

  return (
    <ArtworkDetailPage
      category={category}
      includeLocalePrefix={false}
      locale="zh"
      slug={slug}
    />
  );
}

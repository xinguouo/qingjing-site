import {
  ArtCategoryPage,
  isArtCategorySlug,
} from "@/components/ArtCategoryPage";
import { ArtworkDetailPage } from "@/components/ArtworkDetailPage";
import { redirect } from "next/navigation";

function isLegacySculptureCategory(category: string) {
  return category === "glass-art" || category === "sculpture-art";
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (isLegacySculptureCategory(category)) {
    redirect("/art-projects/sculpture");
  }

  if (isArtCategorySlug(category)) {
    return (
      <ArtCategoryPage
        category={category}
        includeLocalePrefix={false}
        locale="zh"
      />
    );
  }

  return (
    <ArtworkDetailPage
      includeLocalePrefix={false}
      locale="zh"
      slug={category}
    />
  );
}

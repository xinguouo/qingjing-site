import {
  ArtCategoryPage,
  isArtCategorySlug,
} from "@/components/ArtCategoryPage";
import { ArtworkDetailPage } from "@/components/ArtworkDetailPage";
import { redirect } from "next/navigation";

function isLegacyGlassEaselCategory(category: string) {
  return category === "glass-art" || category === "sculpture-art";
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (isLegacyGlassEaselCategory(category)) {
    redirect("/en/art-projects/sculpture");
  }

  if (isArtCategorySlug(category)) {
    return <ArtCategoryPage category={category} locale="en" />;
  }

  return <ArtworkDetailPage locale="en" slug={category} />;
}

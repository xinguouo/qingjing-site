import {
  ArtCategoryPage,
  isArtCategorySlug,
} from "@/components/ArtCategoryPage";
import { ArtworkDetailPage } from "@/components/ArtworkDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

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

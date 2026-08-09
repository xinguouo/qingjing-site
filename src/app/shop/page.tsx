import { StoreOverview } from "@/components/StorePages";

function parseCategory(value?: string | string[]) {
  const category = Array.isArray(value) ? value[0] : value;

  if (category === "derivatives") {
    return "derivatives";
  }

  return "artworks";
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    artworkCategory?: string | string[];
    category?: string | string[];
    subcategory?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const artworkCategory = Array.isArray(params?.artworkCategory)
    ? params?.artworkCategory[0]
    : params?.artworkCategory;
  const subcategory = Array.isArray(params?.subcategory)
    ? params?.subcategory[0]
    : params?.subcategory;

  return (
    <StoreOverview
      activeCategory={parseCategory(params?.category)}
      artworkCategory={artworkCategory}
      includeLocalePrefix={false}
      locale="zh"
      subcategory={subcategory}
    />
  );
}

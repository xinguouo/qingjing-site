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
    craftCategory?: string | string[];
    series?: string | string[];
    seriesBranch?: string | string[];
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
  const craftCategory = Array.isArray(params?.craftCategory)
    ? params?.craftCategory[0]
    : params?.craftCategory;
  const series = Array.isArray(params?.series)
    ? params?.series[0]
    : params?.series;
  const seriesBranch = Array.isArray(params?.seriesBranch)
    ? params?.seriesBranch[0]
    : params?.seriesBranch;

  return (
    <StoreOverview
      activeCategory={parseCategory(params?.category)}
      artworkCategory={artworkCategory}
      craftCategory={craftCategory}
      locale="zh"
      series={series}
      seriesBranch={seriesBranch}
      subcategory={subcategory}
    />
  );
}

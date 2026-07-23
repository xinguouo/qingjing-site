import {StoreOverview} from "@/components/StorePages";

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
    category?: string | string[];
    subcategory?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const subcategory = Array.isArray(params?.subcategory)
    ? params?.subcategory[0]
    : params?.subcategory;

  return (
    <StoreOverview
      activeCategory={parseCategory(params?.category)}
      locale="en"
      subcategory={subcategory}
    />
  );
}

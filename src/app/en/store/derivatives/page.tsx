import {StoreOverview} from "@/components/StorePages";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{subcategory?: string}>;
}) {
  const {subcategory} = await searchParams;

  return (
    <StoreOverview
      activeCategory="derivatives"
      locale="en"
      subcategory={subcategory}
    />
  );
}

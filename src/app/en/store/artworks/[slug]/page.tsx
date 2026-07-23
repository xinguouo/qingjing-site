import {ArtworkProductDetailPage} from "@/components/StorePages";

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  return <ArtworkProductDetailPage locale="en" slug={slug} />;
}

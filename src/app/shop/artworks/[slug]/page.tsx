import {ShopArtworkDetailPage} from "@/components/StorePages";
import {client} from "@/sanity/client";
import {productDetailSlugsQuery} from "@/sanity/queries";

export async function generateStaticParams() {
  return client.fetch<Array<{slug: string}>>(productDetailSlugsQuery);
}

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  return (
    <ShopArtworkDetailPage
      category="artworks"
      includeLocalePrefix={false}
      locale="zh"
      slug={slug}
    />
  );
}

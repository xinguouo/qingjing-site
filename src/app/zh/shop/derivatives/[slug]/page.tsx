import {DerivativeProductDetailPage} from "@/components/StorePages";
import {client} from "@/sanity/client";
import {artDerivativeDetailSlugsQuery, derivativeProductSlugsQuery} from "@/sanity/queries";

export async function generateStaticParams() {
  const [products, artDerivatives] = await Promise.all([
    client.fetch<Array<{slug: string}>>(derivativeProductSlugsQuery),
    client.fetch<Array<{slug: string}>>(artDerivativeDetailSlugsQuery),
  ]);

  return [...products, ...artDerivatives];
}

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  return <DerivativeProductDetailPage locale="zh" slug={slug} />;
}

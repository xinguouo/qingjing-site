import {DerivativeProductDetailPage} from "@/components/StorePages";

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  return (
    <DerivativeProductDetailPage
      includeLocalePrefix={false}
      locale="zh"
      slug={slug}
    />
  );
}

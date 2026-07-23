import { ArtistProfilePage } from "@/components/AboutPages";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ArtistProfilePage locale="en" slug={slug} />;
}

import {redirect} from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  redirect(`/en/art-creation/sculpture/${slug}`);
}

import {ExperienceCourseDetailPage} from "@/components/ExperiencePages";

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  return <ExperienceCourseDetailPage locale="zh" slug={slug} />;
}

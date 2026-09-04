import { AdvancedStudyDetailPage } from "@/components/StudyPages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return <AdvancedStudyDetailPage locale="en" slug={slug} />;
}

import { EventDetailPage } from "@/components/EventDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <EventDetailPage
      expectedEventType="open-class"
      locale="en"
      slug={slug}
    />
  );
}

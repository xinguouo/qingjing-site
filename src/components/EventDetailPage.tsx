import type { SanityImageSource } from "@sanity/image-url";
import { notFound } from "next/navigation";

import type { Locale } from "@/config/navigation";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { eventBySlugQuery } from "@/sanity/queries";

import { AppShell } from "./AppShell";
import { PageContainer } from "./PageContainer";
import { PageHeader } from "./PageHeader";

type SanityImage = SanityImageSource | null | undefined;

type EventDetail = {
  _id?: string;
  content?: string | null;
  courseIntro?: string | null;
  coverImage?: SanityImage;
  eventType?: string | null;
  faculty?: string | null;
  fees?: string | null;
  galleryImages?: SanityImage[] | null;
  outcomes?: string | null;
  posterImage?: SanityImage;
  slug?: string | null;
  teachingSpace?: string | null;
  title?: string | null;
};

type EventDetailPageProps = {
  expectedEventType: "activity" | "open-class";
  locale: Locale;
  slug: string;
};

const copy = {
  zh: {
    activityEyebrow: "\u827a\u672f\u6d3b\u52a8",
    content: "\u6d3b\u52a8\u5185\u5bb9",
    courseIntro: "\u8bfe\u7a0b\u4ecb\u7ecd",
    empty: "\u5185\u5bb9\u5f85\u66f4\u65b0",
    faculty: "\u5b66\u672f\u4e3b\u6301",
    fees: "\u6536\u8d39\u60c5\u51b5",
    gallery: "\u56fe\u7247\u5c55\u793a",
    imagePending: "\u56fe\u7247\u5f85\u4e0a\u4f20",
    openClassEyebrow: "\u827a\u672f\u516c\u5f00\u8bfe",
    outcomes: "\u6210\u679c\u8d4f\u6790",
    teachingSpace: "\u6559\u5b66\u7a7a\u95f4",
  },
  en: {
    activityEyebrow: "Art Activity",
    content: "Event Content",
    courseIntro: "Course Introduction",
    empty: "Content pending",
    faculty: "Faculty",
    fees: "Fees",
    gallery: "Gallery",
    imagePending: "Image pending",
    openClassEyebrow: "Art Open Class",
    outcomes: "Outcomes",
    teachingSpace: "Teaching Space",
  },
} satisfies Record<Locale, Record<string, string>>;

function compactText(value: string | null | undefined) {
  return value?.trim() || "";
}

function imageUrl(image: SanityImage, width: number) {
  if (!image) {
    return null;
  }

  try {
    return urlForImage(image).width(width).auto("format").url();
  } catch {
    return null;
  }
}

function normalizeEventType(value: string | null | undefined) {
  return value === "event" ? "activity" : value || "";
}

function DetailSection({
  children,
  title,
}: {
  children: string;
  title: string;
}) {
  if (!compactText(children)) {
    return null;
  }

  return (
    <section className="border-t border-[var(--border)] pt-7">
      <h2 className="font-title text-[24px] font-normal leading-tight text-primary lg:text-[30px]">
        {title}
      </h2>
      <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.85] text-secondary">
        {children}
      </p>
    </section>
  );
}

function Gallery({
  images,
  title,
}: {
  images: SanityImage[] | null | undefined;
  title: string;
}) {
  const validImages = (images || [])
    .map((image) => imageUrl(image, 900))
    .filter((src): src is string => Boolean(src));

  if (!validImages.length) {
    return null;
  }

  return (
    <section className="border-t border-[var(--border)] pt-7">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {validImages.map((src, index) => (
          <div
            className="image-placeholder aspect-[4/3] overflow-hidden rounded-[18px] bg-[rgba(255,255,255,0.58)] dark:bg-[rgba(255,255,255,0.06)]"
            key={src}
          >
            <img
              alt={`${title} ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
              src={src}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export async function EventDetailPage({
  expectedEventType,
  locale,
  slug,
}: EventDetailPageProps) {
  const event = await client.fetch<EventDetail | null>(
    eventBySlugQuery,
    { locale, slug },
    { cache: "no-store" },
  );

  if (!event || normalizeEventType(event.eventType) !== expectedEventType) {
    notFound();
  }

  const labels = copy[locale];
  const title = compactText(event.title) || labels.empty;
  const eyebrow =
    expectedEventType === "open-class"
      ? labels.openClassEyebrow
      : labels.activityEyebrow;
  const intro = compactText(event.courseIntro) || compactText(event.content);
  const heroSrc = imageUrl(event.posterImage || event.coverImage, 1600);

  return (
    <AppShell locale={locale}>
      <PageContainer className="pb-16 lg:pb-20">
        <PageHeader titleEn={eyebrow} titleZh={title} />

        <section className="mt-8 max-w-[1280px] overflow-hidden rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] shadow-[0_16px_42px_rgba(0,0,0,0.055),inset_0_1px_0_rgba(255,255,255,0.58)] dark:border-[var(--glass-border)] dark:bg-[rgba(255,255,255,0.07)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.7fr)]">
            <div className="image-placeholder min-h-[320px] bg-[rgba(255,255,255,0.58)] dark:bg-[rgba(255,255,255,0.05)] lg:min-h-[460px]">
              {heroSrc ? (
                <img
                  alt={title}
                  className="h-full w-full object-cover"
                  src={heroSrc}
                />
              ) : (
                <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-muted-token">
                  {labels.imagePending}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="text-[13px] uppercase tracking-[0.18em] text-muted-token">
                {eyebrow}
              </p>
              <h1 className="mt-3 font-title text-[34px] font-normal leading-tight text-primary lg:text-[46px]">
                {title}
              </h1>
              <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.85] text-secondary">
                {intro || labels.empty}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 grid max-w-[1280px] gap-9 lg:mt-12">
          <DetailSection title={labels.courseIntro}>
            {compactText(event.courseIntro)}
          </DetailSection>
          <DetailSection title={labels.content}>
            {compactText(event.content)}
          </DetailSection>
          <DetailSection title={labels.teachingSpace}>
            {compactText(event.teachingSpace)}
          </DetailSection>
          <DetailSection title={labels.faculty}>
            {compactText(event.faculty)}
          </DetailSection>
          <DetailSection title={labels.fees}>
            {compactText(event.fees)}
          </DetailSection>
          <DetailSection title={labels.outcomes}>
            {compactText(event.outcomes)}
          </DetailSection>
          <Gallery images={event.galleryImages} title={title} />
        </div>
      </PageContainer>
    </AppShell>
  );
}

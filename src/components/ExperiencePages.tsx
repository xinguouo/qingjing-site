import type { SanityImageSource } from "@sanity/image-url";
import type { ReactNode } from "react";

import type { Locale } from "@/config/navigation";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import {
  eventBySlugQuery,
  experienceCourseBySlugQuery,
  experienceCoursesQuery,
  offlineExperiencePageQuery,
} from "@/sanity/queries";

import { AppShell } from "./AppShell";
import { PageContainer } from "./PageContainer";
import { PageHeader } from "./PageHeader";
import { PastReviewCarousel, type PastReviewItem } from "./PastReviewCarousel";
import { CourseCard, type StudyProgram } from "./StudyPages";

type SanityImage = SanityImageSource | null | undefined;

type ExperienceCourse = {
  _id?: string;
  _key?: string;
  academicHost?: string | null;
  academicSupport?: string | null;
  category?: string | null;
  contact?: string | null;
  coverImage?: SanityImage;
  description?: string | null;
  galleryImages?: SanityImage[] | null;
  heroImage?: SanityImage;
  location?: string | null;
  schedule?: string | null;
  shortDescription?: string | null;
  slug?: string | null;
  suitableAudience?: string | null;
  supportTeacher?: string | null;
  teacher?: string | null;
  title?: string | null;
};

type EventExperienceCourse = {
  _id?: string;
  content?: string | null;
  courseIntro?: string | null;
  coverImage?: SanityImage;
  eventType?: string | null;
  faculty?: string | null;
  galleryImages?: SanityImage[] | null;
  posterImage?: SanityImage;
  slug?: string | null;
  title?: string | null;
};

type OfflineExperiencePageData = {
  courses?: ExperienceCourse[] | null;
  pageTitleEn?: string | null;
  pageTitleZh?: string | null;
  pastReviewItems?: PastReviewItem[] | null;
};

type ExperiencePageProps = {
  locale: Locale;
};

type ExperienceDetailPageProps = ExperiencePageProps & {
  slug: string;
};

const copy = {
  zh: {
    academicSupport: "学术主持",
    audience: "招生对象",
    book: "预约体验",
    contact: "联系方式",
    courseIntro: "课程介绍",
    detail: "了解详情",
    empty: "内容待更新",
    gallery: "图片展示",
    heroTitle: "玻璃马赛克",
    imagePending: "图片待上传",
    location: "授课地点",
    pageTitle: "线下体验",
    pastReview: "往期回顾",
    schedule: "教学内容",
    sectionEn: "ON-SITE EXPERIENCE EVENT",
    teacherTeam: "授课教师团队",
  },
  en: {
    academicSupport: "Academic Host",
    audience: "Audience",
    book: "Book Experience",
    contact: "Contact",
    courseIntro: "Course Introduction",
    detail: "Learn More",
    empty: "Content pending",
    gallery: "Gallery",
    heroTitle: "Glass Mosaic",
    imagePending: "Image pending",
    location: "Location",
    pageTitle: "Offline Experience",
    pastReview: "Past Review",
    schedule: "Teaching Content",
    sectionEn: "ON-SITE EXPERIENCE EVENT",
    teacherTeam: "Teaching Team",
  },
} satisfies Record<Locale, Record<string, string>>;

const fallbackCourses: Record<Locale, ExperienceCourse[]> = {
  zh: [
    {
      _id: "experience-glass-mosaic",
      category: "glass-mosaic",
      description: "从玻璃材料认识开始，通过拼贴、组合等方式完成个人作品。",
      schedule: "周一至周日开放",
      slug: "glass-mosaic",
      teacher: "郑闻卿",
      title: "玻璃马赛克",
    },
    {
      _id: "experience-glass-painting",
      category: "glass-painting",
      description: "在透明玻璃表面进行图案绘制，体验色彩与光线的细腻变化。",
      schedule: "周一至周日开放",
      slug: "glass-painting",
      teacher: "郑闻卿",
      title: "玻璃彩绘",
    },
    {
      _id: "experience-lampworking",
      category: "lampworking",
      description:
        "通过火焰与玻璃棒材完成小型玻璃造型，感受材料在温度中的变化。",
      schedule: "预约开放",
      slug: "lampworking",
      teacher: "郑闻卿",
      title: "玻璃灯工",
    },
    {
      _id: "experience-glass-blowing",
      category: "glass-blowing",
      description: "观察并体验热玻璃吹制过程，从熔融玻璃到成型作品。",
      schedule: "预约开放",
      slug: "glass-blowing",
      teacher: "郑闻卿",
      title: "玻璃吹制",
    },
  ],
  en: [
    {
      _id: "experience-glass-mosaic",
      category: "glass-mosaic",
      description:
        "Learn the material language of glass and complete a personal work through collage and composition.",
      schedule: "Open Monday to Sunday",
      slug: "glass-mosaic",
      teacher: "Zheng Wenqing",
      title: "Glass Mosaic",
    },
    {
      _id: "experience-glass-painting",
      category: "glass-painting",
      description:
        "Paint on transparent glass surfaces and observe how color changes with light.",
      schedule: "Open Monday to Sunday",
      slug: "glass-painting",
      teacher: "Zheng Wenqing",
      title: "Glass Painting",
    },
    {
      _id: "experience-lampworking",
      category: "lampworking",
      description:
        "Shape small glass forms with flame and glass rods, experiencing the material through temperature.",
      schedule: "Reservation required",
      slug: "lampworking",
      teacher: "Zheng Wenqing",
      title: "Lampworking Experience",
    },
    {
      _id: "experience-glass-blowing",
      category: "glass-blowing",
      description:
        "Observe and experience hot glass blowing from molten glass to final form.",
      schedule: "Reservation required",
      slug: "glass-blowing",
      teacher: "Zheng Wenqing",
      title: "Glass Blowing",
    },
  ],
};

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

function imageCaption(image: SanityImage, locale: Locale) {
  if (!image || typeof image !== "object") {
    return "";
  }

  const imageWithCaption = image as {
    caption?: string | null;
    captionEn?: string | null;
    captionZh?: string | null;
  };

  return compactText(
    locale === "en"
      ? imageWithCaption.captionEn ||
          imageWithCaption.caption ||
          imageWithCaption.captionZh
      : imageWithCaption.captionZh ||
          imageWithCaption.caption ||
          imageWithCaption.captionEn,
  );
}

function mapToCourseCard(course: ExperienceCourse): StudyProgram {
  const teacher =
    course.supportTeacher ||
    course.teacher ||
    course.academicSupport ||
    course.academicHost;

  return {
    _id:
      course._id || course._key || course.slug || "offline-experience-course",
    academicHost: teacher,
    academicSupport: teacher,
    coverImage: course.coverImage,
    description: course.description,
    posterImage: course.coverImage,
    shortDescription: course.shortDescription || course.description,
    slug: course.slug,
    title: course.title,
  };
}

function experiencePastReviewFallback(
  courses: ExperienceCourse[],
): PastReviewItem[] {
  return courses.flatMap((course, courseIndex) => {
    const title = compactText(course.title);
    const description = compactText(
      course.shortDescription || course.description,
    );
    const images = [
      course.coverImage,
      ...(course.galleryImages?.filter(Boolean) || []),
    ].filter(Boolean);

    return images.map((image, imageIndex) => ({
      _key: `experience-review-${course._id || course._key || course.slug || courseIndex}-${imageIndex}`,
      description: description || null,
      image,
      title: title || null,
    }));
  });
}

export async function ExperienceCoursePage({ locale }: ExperiencePageProps) {
  const [pageData, courseDocuments] = await Promise.all([
    client.fetch<OfflineExperiencePageData | null>(
      offlineExperiencePageQuery,
      { locale },
      { cache: "no-store" },
    ),
    client.fetch<ExperienceCourse[]>(
      experienceCoursesQuery,
      { locale },
      { cache: "no-store" },
    ),
  ]);
  const labels = copy[locale];
  const pageCourses = pageData?.courses?.filter(Boolean) || [];
  const items = pageCourses.length
    ? pageCourses
    : courseDocuments.length
      ? courseDocuments
      : fallbackCourses[locale];
  const pageTitleZh = compactText(pageData?.pageTitleZh) || labels.pageTitle;
  const pageTitleEn = compactText(pageData?.pageTitleEn) || labels.sectionEn;
  const featuredTitle =
    locale === "zh" ? "\u7cbe\u9009\u8bfe\u7a0b" : "Featured Courses";
  const configuredPastReviews =
    pageData?.pastReviewItems?.filter(Boolean) || [];
  const pastReviewItems = configuredPastReviews.length
    ? configuredPastReviews
    : experiencePastReviewFallback(items);

  return (
    <AppShell locale={locale}>
      <PageContainer>
        <PageHeader titleEn={pageTitleEn} titleZh={pageTitleZh} />

        <section className="mt-10 lg:mt-12">
          <h2 className="font-title text-[26px] font-normal leading-tight text-primary lg:text-[32px]">
            {featuredTitle}
          </h2>
          <div className="mt-5 grid max-w-[1280px] gap-5 md:grid-cols-2 lg:grid-cols-4">
            {items.map((course, index) => (
              <CourseCard
                hrefPrefix="/events/offline-experience"
                key={course._id || course._key || course.slug || index}
                locale={locale}
                program={mapToCourseCard(course)}
              />
            ))}
          </div>
        </section>

        <PastReviewCarousel
          className="mt-10 lg:mt-12"
          items={pastReviewItems}
          itemsPerViewDesktop={3}
          itemsPerViewMobile={1}
          locale={locale}
          title={labels.pastReview}
        />
      </PageContainer>
    </AppShell>
  );
}

function DetailSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="border-t border-[var(--border)] pt-7">
      <h2 className="font-title text-[24px] font-normal leading-tight text-primary lg:text-[30px]">
        {title}
      </h2>
      <div className="mt-4 text-[15px] leading-[1.85] text-secondary">
        {children}
      </div>
    </section>
  );
}

function DetailText({
  empty,
  text,
}: {
  empty: string;
  text: string | null | undefined;
}) {
  const value = compactText(text);

  if (!value) {
    return <p className="text-muted-token">{empty}</p>;
  }

  return <p className="whitespace-pre-line">{value}</p>;
}

function Gallery({
  images,
  locale,
  title,
}: {
  images: SanityImage[] | null | undefined;
  locale: Locale;
  title: string;
}) {
  const validImages = (images || [])
    .map((image) => ({
      caption: imageCaption(image, locale),
      src: imageUrl(image, 900),
    }))
    .filter((item): item is {caption: string; src: string} =>
      Boolean(item.src),
    );

  if (!validImages.length) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {validImages.map((item, index) => (
        <figure key={item.src}>
          <div className="image-placeholder aspect-[4/3] overflow-hidden rounded-[18px] bg-[rgba(255,255,255,0.58)] dark:bg-[rgba(255,255,255,0.06)]">
            <img
              alt={`${title} ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
              src={item.src}
            />
          </div>
          {item.caption ? (
            <figcaption className="mt-3 whitespace-pre-line text-[13px] leading-[1.8] text-secondary">
              {item.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

function detailFallback(locale: Locale, slug: string): ExperienceCourse {
  return (
    fallbackCourses[locale].find((course) => course.slug === slug) ||
    fallbackCourses[locale][0]
  );
}

function eventToExperienceCourse(
  event: EventExperienceCourse | null,
): ExperienceCourse | null {
  if (!event || event.eventType !== "offline-experience") {
    return null;
  }

  return {
    _id: event._id,
    academicHost: event.faculty,
    academicSupport: event.faculty,
    coverImage: event.posterImage || event.coverImage,
    description: event.courseIntro || event.content,
    galleryImages: event.galleryImages,
    heroImage: event.posterImage || event.coverImage,
    slug: event.slug,
    teacher: event.faculty,
    title: event.title,
  };
}

export async function ExperienceCourseDetailPage({
  locale,
  slug,
}: ExperienceDetailPageProps) {
  const [course, event] = await Promise.all([
    client.fetch<ExperienceCourse | null>(
      experienceCourseBySlugQuery,
      { locale, slug },
      { cache: "no-store" },
    ),
    client.fetch<EventExperienceCourse | null>(
      eventBySlugQuery,
      { locale, slug },
      { cache: "no-store" },
    ),
  ]);
  const labels = copy[locale];
  const item =
    course || eventToExperienceCourse(event) || detailFallback(locale, slug);
  const title = compactText(item.title) || labels.pageTitle;
  const heroSrc = imageUrl(item.heroImage || item.coverImage, 1600);
  const teacher = item.teacher || item.academicHost || item.academicSupport;

  return (
    <AppShell locale={locale}>
      <PageContainer className="pb-16 lg:pb-20">
        <PageHeader titleEn={labels.sectionEn} titleZh={title} />

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
              <h1 className="font-title text-[34px] font-normal leading-tight text-primary lg:text-[46px]">
                {title}
              </h1>
              <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.85] text-secondary">
                {compactText(item.description) || labels.empty}
              </p>
              <div className="mt-8 grid gap-4 text-[14px] text-secondary sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {[
                  [labels.academicSupport, teacher],
                  [labels.schedule, item.schedule],
                  [labels.audience, item.suitableAudience],
                  [labels.location, item.location],
                ].map(([label, value]) =>
                  compactText(value) ? (
                    <div
                      className="rounded-[16px] border border-[var(--border)] bg-[rgba(255,255,255,0.48)] px-4 py-3 dark:border-[var(--glass-border)] dark:bg-[rgba(255,255,255,0.06)]"
                      key={label}
                    >
                      <p className="text-[12px] text-muted-token">{label}</p>
                      <p className="mt-1.5 whitespace-pre-line text-primary">
                        {value}
                      </p>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 grid max-w-[1280px] gap-9 lg:mt-12">
          <DetailSection title={labels.courseIntro}>
            <DetailText empty={labels.empty} text={item.description} />
          </DetailSection>

          <DetailSection title={labels.academicSupport}>
            <DetailText empty={labels.empty} text={teacher} />
          </DetailSection>

          <DetailSection title={labels.teacherTeam}>
            <DetailText empty={labels.empty} text={teacher} />
          </DetailSection>

          <DetailSection title={labels.schedule}>
            <DetailText
              empty={labels.empty}
              text={item.schedule || item.description}
            />
          </DetailSection>

          <DetailSection title={labels.gallery}>
            <Gallery
              images={item.galleryImages}
              locale={locale}
              title={title}
            />
          </DetailSection>

          <DetailSection title={labels.audience}>
            <DetailText empty={labels.empty} text={item.suitableAudience} />
          </DetailSection>

          <DetailSection title={labels.contact}>
            <DetailText empty={labels.empty} text={item.contact} />
          </DetailSection>
        </div>
      </PageContainer>
    </AppShell>
  );
}

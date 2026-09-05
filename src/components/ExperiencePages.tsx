import type { SanityImageSource } from "@sanity/image-url";

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
import {
  CourseCard,
  CourseDetailContent,
  type StudyProgram,
} from "./StudyPages";

type SanityImage = SanityImageSource | null | undefined;

type ExperienceCourse = {
  _id?: string;
  _key?: string;
  academicHost?: string | null;
  academicSupport?: string | null;
  category?: string | null;
  contact?: string | null;
  content?: string | PortableTextBlock[] | null;
  coverImage?: SanityImage;
  description?: string | null;
  fileResources?: FileResource[] | null;
  galleryImages?: SanityImage[] | null;
  heroImage?: SanityImage;
  courseImages?: SanityImage[] | null;
  location?: string | null;
  schedule?: string | null;
  shortDescription?: string | null;
  slug?: string | null;
  suitableAudience?: string | null;
  supportTeacher?: string | null;
  teacher?: string | null;
  title?: string | null;
};

type PortableTextBlock = {
  _key?: string;
  _type?: string;
  children?: Array<{
    _key?: string;
    marks?: string[];
    text?: string;
  }>;
  listItem?: string;
  style?: string;
};

type FileResource = {
  _key?: string;
  file?: {
    asset?: {
      _id?: string;
      mimeType?: string | null;
      originalFilename?: string | null;
      size?: number | null;
      url?: string | null;
    } | null;
  } | null;
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
    backToOffline: "返回线下体验",
    book: "预约体验",
    contact: "联系方式",
    courseIntro: "课程介绍",
    detail: "了解详情",
    downloadFile: "下载文件",
    empty: "内容待更新",
    gallery: "图片展示",
    heroTitle: "玻璃马赛克",
    imagePending: "图片待上传",
    openFile: "查看文件",
    location: "授课地点",
    pageTitle: "线下体验",
    pastReview: "往期回顾",
    resources: "课程资料",
    schedule: "教学内容",
    sectionEn: "ON-SITE EXPERIENCE EVENT",
    teacherTeam: "授课教师团队",
  },
  en: {
    academicSupport: "Academic Host",
    audience: "Audience",
    backToOffline: "Back to Offline Experience",
    book: "Book Experience",
    contact: "Contact",
    courseIntro: "Course Introduction",
    detail: "Learn More",
    downloadFile: "Download File",
    empty: "Content pending",
    gallery: "Gallery",
    heroTitle: "Glass Mosaic",
    imagePending: "Image pending",
    openFile: "View File",
    location: "Location",
    pageTitle: "Offline Experience",
    pastReview: "Past Review",
    resources: "Course Resources",
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
    slug: course.slug || course.category,
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
    client
      .withConfig({ useCdn: false })
      .fetch<OfflineExperiencePageData | null>(
        offlineExperiencePageQuery,
        { locale },
        { cache: "no-store" },
      ),
    client
      .withConfig({ useCdn: false })
      .fetch<ExperienceCourse[]>(
        experienceCoursesQuery,
        { locale },
        { cache: "no-store" },
      ),
  ]);
  const labels = copy[locale];
  const items = courseDocuments.filter(Boolean);
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
  const content = item.content || item.description;
  const images =
    item.courseImages && item.courseImages.length
      ? item.courseImages
      : item.galleryImages;

  return (
    <AppShell locale={locale}>
      <CourseDetailContent
        backHref={`/${locale}/events/offline-experience`}
        backLabel={labels.backToOffline}
        content={content}
        fileLabels={labels}
        images={images}
        locale={locale}
        resources={item.fileResources}
        title={title}
      />
    </AppShell>
  );
}

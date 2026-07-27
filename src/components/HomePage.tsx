import type { SanityImageSource } from "@sanity/image-url";
import Link from "next/link";

import type { Locale } from "@/config/navigation";
import { client } from "@/sanity/client";
import {
  homePageQuery,
  internationalMasterclassProgramsQuery,
  offlineExperienceEventsQuery,
  siteSettingsQuery,
} from "@/sanity/queries";

import { AppShell } from "./AppShell";
import { HeroBanner } from "./HeroBanner";
import { PageContainer } from "./PageContainer";
import { CourseCard, type StudyProgram } from "./StudyPages";

type SanityImage = SanityImageSource | null | undefined;

type HomeCardItem = {
  _id?: string;
  content?: string | null;
  coverImage?: SanityImage;
  courseIntro?: string | null;
  eventType?: string | null;
  faculty?: string | null;
  posterImage?: SanityImage;
  programType?: string | null;
  slug?: string | null;
  title?: string | null;
};

type HomePageData = {
  featuredEvents?: HomeCardItem[] | null;
  featuredStudyPrograms?: HomeCardItem[] | null;
  heroImage?: SanityImage;
  heroSubtitle?: string | null;
  heroTitle?: string | null;
};

type SiteSettingsData = {
  siteName?: string | null;
};

type HomePageProps = {
  locale: Locale;
};

const copy = {
  zh: {
    all: "全部",
    bookExperience: "预约体验",
    dataPending: "暂无内容",
    faculty: "学术主持",
    fallbackHeroTitle: "清镜玻璃花园",
    masterclassEntryText:
      "邀请艺术家与专业导师，展开玻璃艺术、工艺与创作方法的深度课程。",
    imagePending: "图片待上传",
    learnStudio: "了解工作室",
    masterclass: "国际大师班",
    offlineExperience: "线下体验",
    offlineExperienceEntryText:
      "从熔炉到成型，掌握玻璃创作的基础控制技法，带走一件亲手完成的作品。",
    recentEvents: "最近活动",
  },
  en: {
    all: "View All",
    bookExperience: "Book Experience",
    dataPending: "No content yet",
    faculty: "Faculty",
    fallbackHeroTitle: "Qingjing Glass Art Garden",
    masterclassEntryText:
      "Artists and professional mentors lead in-depth courses in glass art, craft, and creative methods.",
    imagePending: "Image pending",
    learnStudio: "About the Studio",
    masterclass: "International Masterclass",
    offlineExperience: "Offline Experience",
    offlineExperienceEntryText:
      "Learn the fundamentals of glass creation from furnace to finished object, and take home a work made by hand.",
    recentEvents: "Recent Events",
  },
} satisfies Record<Locale, Record<string, string>>;

function compactText(value: string | null | undefined) {
  return value?.trim() || "";
}

function programHref(item: HomeCardItem, locale: Locale) {
  if (!item.slug) {
    return null;
  }

  const base =
    item.programType === "international-study"
      ? "international-study"
      : "masterclass";

  return `/${locale}/study/${base}/${item.slug}`;
}

function eventHref(item: HomeCardItem, locale: Locale) {
  if (item.eventType === "open-class") {
    return `/${locale}/events/open-class`;
  }

  if (item.eventType === "activity") {
    return `/${locale}/events/activity`;
  }

  return item.slug
    ? `/${locale}/events/offline-experience/${item.slug}`
    : `/${locale}/events/offline-experience`;
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function EntryCard({
  description,
  href,
  title,
}: {
  description: string;
  href: string;
  title: string;
}) {
  return (
    <Link
      className="glass-card glass-card-hover group min-h-[112px] rounded-[14px] p-4 sm:min-h-[128px] sm:p-5 lg:min-h-[148px] lg:p-7"
      href={href}
    >
      <h2 className="font-title text-[17px] font-normal leading-tight text-primary sm:text-xl lg:text-[24px]">
        {title}
      </h2>
      <p className="mt-2 line-clamp-3 max-w-2xl text-[11px] leading-[1.65] text-secondary sm:text-xs sm:leading-6 lg:mt-3 lg:text-[13px]">
        {description}
      </p>
    </Link>
  );
}

function mapHomeItemToCourseCard(item: HomeCardItem): StudyProgram {
  const description =
    compactText(item.courseIntro) || compactText(item.content) || null;
  const academicSupport = compactText(item.faculty) || null;

  return {
    _id: item._id || item.slug || "home-featured-card",
    academicHost: academicSupport,
    academicSupport,
    coverImage: item.coverImage,
    courseIntro: description,
    description,
    posterImage: item.posterImage || item.coverImage,
    shortDescription: description,
    slug: item.slug,
    title: compactText(item.title) || null,
  };
}

function placeholderProgram(locale: Locale, key: string): StudyProgram {
  return {
    _id: `placeholder-${key}`,
    academicSupport: null,
    courseIntro: copy[locale].offlineExperienceEntryText,
    description: copy[locale].offlineExperienceEntryText,
    shortDescription: copy[locale].offlineExperienceEntryText,
    title: copy[locale].dataPending,
  };
}

function FeaturedSection({
  href,
  items,
  locale,
  title,
  type,
}: {
  href: string;
  items: HomeCardItem[];
  locale: Locale;
  title: string;
  type: "event" | "program";
}) {
  const visibleItems = items.slice(0, 3);
  const placeholderCount = visibleItems.length === 0 ? 3 : 0;

  return (
    <section className="mt-9 lg:mt-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-title text-2xl font-normal leading-tight text-primary lg:text-[28px]">
          {title}
        </h2>
        <Link
          className="glass-button inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs transition"
          href={href}
        >
          {copy[locale].all}
          <ArrowIcon />
        </Link>
      </div>
      <div className="grid max-w-[1280px] gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item, index) => (
          <CourseCard
            href={
              type === "program"
                ? programHref(item, locale)
                : eventHref(item, locale)
            }
            key={item._id || `${title}-${index}`}
            locale={locale}
            program={mapHomeItemToCourseCard(item)}
          />
        ))}
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <CourseCard
            href={null}
            key={`placeholder-${title}-${index}`}
            locale={locale}
            program={placeholderProgram(locale, `${title}-${index}`)}
          />
        ))}
      </div>
    </section>
  );
}

export async function HomePage({ locale }: HomePageProps) {
  const [homePage, siteSettings, fallbackStudyPrograms, fallbackEvents] =
    await Promise.all([
    client.fetch<HomePageData | null>(homePageQuery, { locale }),
    client.fetch<SiteSettingsData | null>(siteSettingsQuery, { locale }),
    client.fetch<HomeCardItem[]>(internationalMasterclassProgramsQuery, {
      locale,
    }),
    client.fetch<HomeCardItem[]>(offlineExperienceEventsQuery, { locale }),
  ]);

  const labels = copy[locale];
  const title =
    compactText(homePage?.heroTitle) ||
    compactText(siteSettings?.siteName) ||
    labels.fallbackHeroTitle;
  const subtitle = compactText(homePage?.heroSubtitle);
  const featuredStudyPrograms =
    homePage?.featuredStudyPrograms?.filter(Boolean) || [];
  const featuredEvents = homePage?.featuredEvents?.filter(Boolean) || [];
  const studyPrograms =
    featuredStudyPrograms.length > 0
      ? featuredStudyPrograms
      : fallbackStudyPrograms.filter(Boolean);
  const events =
    featuredEvents.length > 0 ? featuredEvents : fallbackEvents.filter(Boolean);

  return (
    <AppShell locale={locale}>
      <div className="page-surface">
        <HeroBanner
          actions={[
            {
              href: `/${locale}/about/mission-vision`,
              label: labels.learnStudio,
            },
            {
              href: `/${locale}/events/offline-experience`,
              label: labels.bookExperience,
            },
          ]}
          image={homePage?.heroImage}
          mobileHideText
          subtitle={subtitle}
          title={title}
        />

        <PageContainer minHeight={false} className="py-9 lg:py-10">
          <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            <EntryCard
              description={labels.offlineExperienceEntryText}
              href={`/${locale}/events/offline-experience`}
              title={labels.offlineExperience}
            />
            <EntryCard
              description={labels.masterclassEntryText}
              href={`/${locale}/study/masterclass`}
              title={labels.masterclass}
            />
          </section>

          <FeaturedSection
            href={`/${locale}/study/masterclass`}
            items={studyPrograms}
            locale={locale}
            title={labels.masterclass}
            type="program"
          />
          <FeaturedSection
            href={`/${locale}/events/offline-experience`}
            items={events}
            locale={locale}
            title={labels.recentEvents}
            type="event"
          />
        </PageContainer>
      </div>
    </AppShell>
  );
}

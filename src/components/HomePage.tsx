import type { SanityImageSource } from "@sanity/image-url";
import Link from "next/link";

import type { Locale } from "@/config/navigation";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import {
  homePageQuery,
  internationalMasterclassProgramsQuery,
  offlineExperienceEventsQuery,
  siteSettingsQuery,
} from "@/sanity/queries";

import { AppShell } from "./AppShell";
import { HeroBanner } from "./HeroBanner";
import { PageContainer } from "./PageContainer";

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

function ImageFrame({
  alt,
  image,
  locale,
}: {
  alt: string;
  image: SanityImage;
  locale: Locale;
}) {
  const src = imageUrl(image, 520);

  return (
    <div className="image-placeholder flex aspect-[3/4] w-full shrink-0 items-center justify-center overflow-hidden rounded-[10px] lg:w-[118px]">
      {src ? (
        <img
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          src={src}
        />
      ) : (
        <span className="px-4 text-center text-xs text-muted-token">
          {copy[locale].imagePending}
        </span>
      )}
    </div>
  );
}

function FeaturedCard({
  href,
  item,
  locale,
}: {
  href: string | null;
  item: HomeCardItem;
  locale: Locale;
}) {
  const title = compactText(item.title) || copy[locale].dataPending;
  const excerpt =
    compactText(item.courseIntro) ||
    compactText(item.content) ||
    copy[locale].offlineExperienceEntryText;
  const faculty = compactText(item.faculty);
  const content = (
    <>
      <ImageFrame
        alt={title}
        image={item.posterImage || item.coverImage}
        locale={locale}
      />
      <div className="flex min-w-0 flex-1 flex-col pt-0.5">
        <h3 className="font-title text-lg font-normal leading-snug text-primary">
          {title}
        </h3>
        <p className="mt-2 overflow-hidden text-xs leading-5 text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {excerpt}
        </p>
        {faculty ? (
          <div className="mt-auto pt-5 text-xs leading-5 text-muted-token">
            <p>{copy[locale].faculty}</p>
            <p className="text-secondary">{faculty}</p>
          </div>
        ) : null}
      </div>
    </>
  );
  const className =
    "glass-card glass-card-hover group flex min-h-[174px] flex-col gap-4 rounded-[14px] p-4 lg:flex-row";

  return href ? (
    <Link className={className} href={href}>
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  );
}

function PlaceholderCard({ locale }: { locale: Locale }) {
  return (
    <article className="glass-card flex min-h-[174px] flex-col gap-4 rounded-[14px] border-dashed p-4 lg:flex-row">
      <ImageFrame alt={copy[locale].imagePending} image={null} locale={locale} />
      <div className="flex flex-1 flex-col pt-0.5">
        <h3 className="font-title text-lg font-normal leading-snug text-primary">
          {copy[locale].dataPending}
        </h3>
        <p className="mt-2 text-xs leading-5 text-muted-token">
          {copy[locale].offlineExperienceEntryText}
        </p>
      </div>
    </article>
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
      className="glass-card glass-card-hover group min-h-[148px] rounded-[14px] p-6 lg:p-7"
      href={href}
    >
      <h2 className="font-title text-xl font-normal leading-tight text-primary lg:text-[24px]">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-xs leading-6 text-secondary lg:text-[13px]">
        {description}
      </p>
    </Link>
  );
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
      <div className="grid gap-5 xl:grid-cols-3">
        {visibleItems.map((item, index) => (
          <FeaturedCard
            href={
              type === "program"
                ? programHref(item, locale)
                : eventHref(item, locale)
            }
            item={item}
            key={item._id || `${title}-${index}`}
            locale={locale}
          />
        ))}
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <PlaceholderCard key={`placeholder-${title}-${index}`} locale={locale} />
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
          subtitle={subtitle}
          title={title}
        />

        <PageContainer minHeight={false} className="py-9 lg:py-10">
          <section className="grid gap-5 lg:grid-cols-2">
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

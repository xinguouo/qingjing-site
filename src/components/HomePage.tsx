import type {SanityImageSource} from "@sanity/image-url";
import Link from "next/link";

import type {Locale} from "@/config/navigation";
import {client} from "@/sanity/client";
import {homePageQuery} from "@/sanity/queries";

import {AppShell} from "./AppShell";
import {ArtworkCard, isArtCategorySlug, type Artwork} from "./ArtCategoryPage";
import {HeroBanner, type HeroBannerSlide} from "./HeroBanner";
import {PageContainer} from "./PageContainer";
import {CourseCard, type StudyProgram} from "./StudyPages";

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

type QuickEntry = {
  _key?: string;
  description?: string | null;
  href?: string | null;
  title?: string | null;
};

type HomePageData = {
  featuredArtWorks?: Artwork[] | null;
  featuredArtWorksTitle?: string | null;
  featuredEvents?: HomeCardItem[] | null;
  featuredEventsTitle?: string | null;
  featuredPastEvents?: HomeCardItem[] | null;
  featuredPastEventsTitle?: string | null;
  featuredStudyPrograms?: HomeCardItem[] | null;
  featuredStudyProgramsTitle?: string | null;
  heroImage?: SanityImage;
  heroImages?: HeroBannerSlide[] | null;
  heroSubtitle?: string | null;
  heroTitle?: string | null;
  introText?: string | null;
  introTitle?: string | null;
  quickEntries?: QuickEntry[] | null;
};

type HomePageProps = {
  locale: Locale;
};

function compactText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeHref(href: string | null | undefined, locale: Locale) {
  const value = compactText(href);

  if (!value) {
    return null;
  }

  if (/^https?:\/\//.test(value) || value.startsWith(`/${locale}`)) {
    return value;
  }

  return value.startsWith("/") ? `/${locale}${value}` : `/${locale}/${value}`;
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
    faculty: academicSupport,
    posterImage: item.posterImage || item.coverImage,
    shortDescription: description,
    slug: item.slug,
    title: compactText(item.title) || null,
  };
}

function QuickEntryCard({entry, locale}: {entry: QuickEntry; locale: Locale}) {
  const title = compactText(entry.title);
  const description = compactText(entry.description);
  const href = normalizeHref(entry.href, locale);

  if (!title || !href) {
    return null;
  }

  return (
    <Link
      className="glass-card glass-card-hover group min-h-[112px] rounded-[14px] p-4 sm:min-h-[128px] sm:p-5 lg:min-h-[148px] lg:p-7"
      href={href}
    >
      <h2 className="font-title text-[17px] font-normal leading-tight text-primary sm:text-xl lg:text-[24px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 line-clamp-3 max-w-2xl text-[11px] leading-[1.65] text-secondary sm:text-xs sm:leading-6 lg:mt-3 lg:text-[13px]">
          {description}
        </p>
      ) : null}
    </Link>
  );
}

function QuickEntriesSection({
  entries,
  locale,
}: {
  entries: QuickEntry[];
  locale: Locale;
}) {
  const visibleEntries = entries.filter(
    (entry) => compactText(entry.title) && normalizeHref(entry.href, locale),
  );

  if (visibleEntries.length === 0) {
    return null;
  }

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
      {visibleEntries.map((entry, index) => (
        <QuickEntryCard
          entry={entry}
          key={entry._key || `${entry.href}-${index}`}
          locale={locale}
        />
      ))}
    </section>
  );
}

function CourseSection({
  hrefForItem,
  items,
  locale,
  title,
}: {
  hrefForItem: (item: HomeCardItem, locale: Locale) => string | null;
  items: HomeCardItem[];
  locale: Locale;
  title?: string | null;
}) {
  const visibleItems = items.filter((item) => compactText(item.title));

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section className="mt-9 lg:mt-10">
      {compactText(title) ? (
        <h2 className="mb-5 font-title text-2xl font-normal leading-tight text-primary lg:text-[28px]">
          {compactText(title)}
        </h2>
      ) : null}
      <div className="grid max-w-[1280px] gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item, index) => (
          <CourseCard
            href={hrefForItem(item, locale)}
            key={`${item._id || item.slug || "home-featured-card"}-${index}`}
            locale={locale}
            program={mapHomeItemToCourseCard(item)}
          />
        ))}
      </div>
    </section>
  );
}

function ArtWorksSection({
  artworks,
  locale,
  title,
}: {
  artworks: Artwork[];
  locale: Locale;
  title?: string | null;
}) {
  const visibleArtworks = artworks.filter((artwork) =>
    isArtCategorySlug(artwork.category || artwork.workType || ""),
  );

  if (visibleArtworks.length === 0) {
    return null;
  }

  return (
    <section className="mt-9 lg:mt-10">
      {compactText(title) ? (
        <h2 className="mb-5 font-title text-2xl font-normal leading-tight text-primary lg:text-[28px]">
          {compactText(title)}
        </h2>
      ) : null}
      <div className="grid max-w-[1280px] gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleArtworks.map((artwork, index) => {
          const category = artwork.category || artwork.workType || "";

          if (!isArtCategorySlug(category)) {
            return null;
          }

          return (
            <ArtworkCard
              artwork={artwork}
              category={category}
              includeLocalePrefix
              index={index}
              key={`${artwork._id || artwork.slug || "home-artwork"}-${index}`}
              locale={locale}
            />
          );
        })}
      </div>
    </section>
  );
}

function AboutIntroSection({
  text,
  title,
}: {
  text?: string | null;
  title?: string | null;
}) {
  const heading = compactText(title);
  const body = compactText(text);

  if (!heading && !body) {
    return null;
  }

  return (
    <section className="mt-9 max-w-[900px] lg:mt-10">
      {heading ? (
        <h2 className="font-title text-2xl font-normal leading-tight text-primary lg:text-[28px]">
          {heading}
        </h2>
      ) : null}
      {body ? (
        <p className="mt-4 whitespace-pre-line text-[16px] leading-[1.9] text-secondary lg:text-[18px]">
          {body}
        </p>
      ) : null}
    </section>
  );
}

export async function HomePage({locale}: HomePageProps) {
  let homePage: HomePageData | null = null;

  try {
    homePage = await client
      .withConfig({useCdn: false})
      .fetch<HomePageData | null>(
        homePageQuery,
        {locale},
        {cache: "no-store"},
      );
  } catch (error) {
    console.error("Failed to fetch published home page data from Sanity", error);
  }

  const heroSlides = homePage?.heroImages?.filter(Boolean) || [];
  const heroImage =
    heroSlides[0]?.image || (heroSlides[0] as SanityImage) || homePage?.heroImage;
  const title = compactText(homePage?.heroTitle);
  const subtitle = compactText(homePage?.heroSubtitle);

  return (
    <AppShell locale={locale}>
      <div className="page-surface">
        <HeroBanner
          image={heroImage}
          logoTitleOnly
          mobileHideText
          slides={heroSlides.length ? heroSlides : null}
          subtitle={subtitle}
          title={title}
        />

        <PageContainer minHeight={false} className="py-9 lg:py-10">
          <QuickEntriesSection
            entries={homePage?.quickEntries?.filter(Boolean) || []}
            locale={locale}
          />

          <AboutIntroSection
            text={homePage?.introText}
            title={homePage?.introTitle}
          />

          <CourseSection
            hrefForItem={programHref}
            items={homePage?.featuredStudyPrograms?.filter(Boolean) || []}
            locale={locale}
            title={homePage?.featuredStudyProgramsTitle}
          />

          <CourseSection
            hrefForItem={eventHref}
            items={homePage?.featuredEvents?.filter(Boolean) || []}
            locale={locale}
            title={homePage?.featuredEventsTitle}
          />

          <CourseSection
            hrefForItem={eventHref}
            items={homePage?.featuredPastEvents?.filter(Boolean) || []}
            locale={locale}
            title={homePage?.featuredPastEventsTitle}
          />

          <ArtWorksSection
            artworks={homePage?.featuredArtWorks?.filter(Boolean) || []}
            locale={locale}
            title={homePage?.featuredArtWorksTitle}
          />
        </PageContainer>
      </div>
    </AppShell>
  );
}

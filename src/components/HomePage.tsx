import type { SanityImageSource } from "@sanity/image-url";
import Link from "next/link";

import type { Locale } from "@/config/navigation";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { homePageQuery } from "@/sanity/queries";

import { AppShell } from "./AppShell";
import {
  getArtworkImageSource,
  isArtCategorySlug,
  type Artwork,
} from "./ArtCategoryPage";
import { HeroBanner, type HeroBannerSlide } from "./HeroBanner";
import { HomeCarouselSection } from "./HomeCarouselSection";
import { PageContainer } from "./PageContainer";
import { PastReviewCarousel, type PastReviewItem } from "./PastReviewCarousel";
import { CourseCard, type StudyProgram } from "./StudyPages";
import { glassStyle } from "../../styles/glassStyle";

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

type HomeProduct = {
  _id?: string;
  coverImage?: SanityImage;
  description?: string | null;
  galleryImages?: SanityImage[] | null;
  images?: SanityImage[] | null;
  price?: string | number | null;
  productType?: string | null;
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
  featuredPastEventsTitle?: string | null;
  featuredProducts?: HomeProduct[] | null;
  featuredStudyPrograms?: HomeCardItem[] | null;
  featuredStudyProgramsTitle?: string | null;
  heroCarouselImages?: HeroBannerSlide[] | null;
  heroImage?: SanityImage;
  heroSubtitle?: string | null;
  heroTitle?: string | null;
  pastReviewItems?: PastReviewItem[] | null;
  quickEntries?: QuickEntry[] | null;
};

type HomePageProps = {
  locale: Locale;
};

const homeCopy = {
  zh: {
    all: "全部",
    artWorks: "艺术创作",
    emptyImage: "图片待上传",
    featuredEvents: "最近活动",
    pastReview: "往期回顾",
    featuredProducts: "商品",
    featuredStudyPrograms: "国际大师班",
    masterclassEntryDescription: "专业导师带领的玻璃架上艺术与材料课程及创作研修。",
    masterclassEntryTitle: "国际大师班",
    offlineEntryDescription: "亲手体验玻璃材料与工艺的创作过程。",
    offlineEntryTitle: "线下体验",
    productFallbackDescription: "艺术机构精选作品与衍生内容。",
  },
  en: {
    all: "All",
    artWorks: "Art Creation",
    emptyImage: "Image pending",
    featuredEvents: "Recent Events",
    pastReview: "Past Review",
    featuredProducts: "Products",
    featuredStudyPrograms: "International Masterclass",
    masterclassEntryDescription:
      "Glass easel art and material courses and creative workshops led by professional mentors.",
    masterclassEntryTitle: "International Masterclass",
    offlineEntryDescription:
      "Experience the creative process of glass materials and craft by hand.",
    offlineEntryTitle: "Offline Experience",
    productFallbackDescription:
      "Selected works and derivatives from the art institution.",
  },
} satisfies Record<Locale, Record<string, string>>;

function compactText(value: string | number | null | undefined) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function sectionTitle(title: string | null | undefined, fallback: string) {
  return compactText(title) || fallback;
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

function productHref(item: HomeProduct, locale: Locale) {
  if (!item.slug) {
    return null;
  }

  if (item.productType === "derivatives") {
    return `/${locale}/shop/derivatives/${item.slug}`;
  }

  if (item.productType === "cultural") {
    return `/${locale}/shop?category=cultural`;
  }

  return `/${locale}/shop/artworks/${item.slug}`;
}

function artworkHref(item: Artwork, locale: Locale) {
  const category = item.category || item.workType || "";

  if (!item.slug || !isArtCategorySlug(category)) {
    return null;
  }

  return `/${locale}/art-projects/${category}/${item.slug}`;
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

function defaultQuickEntries(locale: Locale): QuickEntry[] {
  const labels = homeCopy[locale];

  return [
    {
      _key: "offline-experience",
      description: labels.offlineEntryDescription,
      href: "/events/offline-experience",
      title: labels.offlineEntryTitle,
    },
    {
      _key: "masterclass",
      description: labels.masterclassEntryDescription,
      href: "/study/masterclass",
      title: labels.masterclassEntryTitle,
    },
  ];
}

function QuickEntryCard({
  entry,
  locale,
}: {
  entry: QuickEntry;
  locale: Locale;
}) {
  const title = compactText(entry.title);
  const description = compactText(entry.description);
  const href = normalizeHref(entry.href, locale);

  if (!title || !href) {
    return null;
  }

  return (
    <Link
      className="glass-card glass-card-hover group min-h-[96px] rounded-[12px] p-3.5 sm:min-h-[104px] sm:p-4 lg:min-h-[106px] lg:p-5"
      href={href}
    >
      <h2 className="font-title text-[16px] font-normal leading-tight text-primary sm:text-lg lg:text-[21px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 line-clamp-2 max-w-2xl text-[11px] leading-[1.55] text-secondary sm:text-xs sm:leading-5 lg:mt-2 lg:text-[12px]">
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
  const cmsEntries = entries.filter(
    (entry) => compactText(entry.title) && normalizeHref(entry.href, locale),
  );
  const visibleEntries = (
    cmsEntries.length > 0 ? cmsEntries : defaultQuickEntries(locale)
  ).slice(0, 2);

  return (
    <section className="mt-5 lg:mt-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
        {visibleEntries.map((entry, index) => (
          <QuickEntryCard
            entry={entry}
            key={entry._key || `${entry.href}-${index}`}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}

function HomeFeatureCard({
  description,
  href,
  image,
  locale,
  title,
}: {
  description?: string | number | null;
  href?: string | null;
  image?: SanityImage;
  locale: Locale;
  title?: string | null;
}) {
  const labels = homeCopy[locale];
  const cardTitle = compactText(title);
  const cardDescription = compactText(description);
  const src = imageUrl(image, 720);
  const content = (
    <article
      className={`${glassStyle.card} ${glassStyle.cardHover} group flex h-[210px] w-full overflow-hidden rounded-[20px] p-4 transition duration-200 sm:h-[220px] sm:p-5`}
    >
      <div
        className={`${glassStyle.imageFrame} image-placeholder flex h-[168px] w-[118px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[rgba(255,255,255,0.56)] sm:h-[184px] sm:w-[130px] dark:bg-[rgba(255,255,255,0.06)]`}
      >
        {src ? (
          <img
            alt={cardTitle || labels.emptyImage}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            src={src}
          />
        ) : (
          <span className="px-4 text-center text-xs text-muted-token">
            {labels.emptyImage}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col py-0.5 pl-4 pr-1 sm:pl-5">
        {cardTitle ? (
          <h3 className="font-title line-clamp-2 text-[19px] font-normal leading-snug text-primary sm:text-[21px]">
            {cardTitle}
          </h3>
        ) : null}
        {cardDescription ? (
          <p className="mt-2.5 overflow-hidden text-[13px] leading-[1.55] text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {cardDescription}
          </p>
        ) : null}
      </div>
    </article>
  );

  return href ? (
    <Link className="block" href={href}>
      {content}
    </Link>
  ) : (
    content
  );
}

function HomeProductCard({
  item,
  locale,
}: {
  item: HomeProduct;
  locale: Locale;
}) {
  const labels = homeCopy[locale];
  return (
    <HomeFeatureCard
      description={
        compactText(item.description) ||
        compactText(item.price) ||
        labels.productFallbackDescription
      }
      href={productHref(item, locale)}
      image={item.coverImage || item.galleryImages?.[0] || item.images?.[0]}
      locale={locale}
      title={compactText(item.title) || labels.featuredProducts}
    />
  );
}

function HomeArtworkFeatureCard({
  artwork,
  locale,
}: {
  artwork: Artwork;
  locale: Locale;
}) {
  const title =
    compactText(artwork.title) ||
    compactText(locale === "zh" ? artwork.titleZh : artwork.titleEn) ||
    compactText(artwork.titleZh) ||
    compactText(artwork.titleEn);
  const description =
    compactText(artwork.description) ||
    compactText(artwork.dimensions || artwork.size);

  return (
    <HomeFeatureCard
      description={description}
      href={artworkHref(artwork, locale)}
      image={artwork.coverImage || getArtworkImageSource(artwork.images?.[0])}
      locale={locale}
      title={title}
    />
  );
}

function CourseCarousel({
  cardVariant,
  items,
  locale,
  syncLeader = false,
  title,
  viewAllHref,
  hrefForItem,
}: {
  cardVariant: "masterclass" | "event";
  hrefForItem: (item: HomeCardItem, locale: Locale) => string | null;
  items: HomeCardItem[];
  locale: Locale;
  syncLeader?: boolean;
  title: string;
  viewAllHref: string;
}) {
  const cards = items
    .filter((item) => compactText(item.title))
    .slice(0, 8)
    .map((item, index) => (
      <CourseCard
        href={hrefForItem(item, locale)}
        key={`${item._id || item.slug || cardVariant}-${index}`}
        locale={locale}
        program={mapHomeItemToCourseCard(item)}
      />
    ));

  return (
    <HomeCarouselSection
      autoPlay
      cardVariant={cardVariant}
      items={cards}
      itemsPerViewDesktop={2}
      itemsPerViewMobile={1}
      sectionTitle={title}
      syncGroup="home-feature-carousels"
      syncLeader={syncLeader}
      viewAllHref={viewAllHref}
      viewAllLabel={homeCopy[locale].all}
    />
  );
}

function ArtworkCarousel({
  artworks,
  locale,
  title,
}: {
  artworks: Artwork[];
  locale: Locale;
  title: string;
}) {
  const cards = artworks
    .filter((artwork) =>
      isArtCategorySlug(artwork.category || artwork.workType || ""),
    )
    .slice(0, 8)
    .map((artwork, index) => (
      <HomeArtworkFeatureCard
        artwork={artwork}
        key={`${artwork._id || artwork.slug || "home-artwork"}-${index}`}
        locale={locale}
      />
    ));

  return (
    <HomeCarouselSection
      autoPlay
      cardVariant="artwork"
      items={cards}
      itemsPerViewDesktop={2}
      itemsPerViewMobile={1}
      sectionTitle={title}
      syncGroup="home-feature-carousels"
      viewAllHref={`/${locale}/art-creation/sculpture`}
      viewAllLabel={homeCopy[locale].all}
    />
  );
}

function ProductCarousel({
  locale,
  products,
}: {
  locale: Locale;
  products: HomeProduct[];
}) {
  const cards = products
    .filter((item) => compactText(item.title))
    .slice(0, 8)
    .map((item, index) => (
      <HomeProductCard
        item={item}
        key={`${item._id || item.slug || "home-product"}-${index}`}
        locale={locale}
      />
    ));

  return (
    <HomeCarouselSection
      autoPlay
      cardVariant="product"
      items={cards}
      itemsPerViewDesktop={2}
      itemsPerViewMobile={1}
      sectionTitle={homeCopy[locale].featuredProducts}
      syncGroup="home-feature-carousels"
      viewAllHref={`/${locale}/shop`}
      viewAllLabel={homeCopy[locale].all}
    />
  );
}

export async function HomePage({ locale }: HomePageProps) {
  let homePage: HomePageData | null = null;

  try {
    homePage = await client.fetch<HomePageData | null>(
      homePageQuery,
      { locale },
      { cache: "no-store" },
    );
  } catch (error) {
    console.error(
      "Failed to fetch published home page data from Sanity",
      error,
    );
  }

  const heroSlides = homePage?.heroCarouselImages?.filter(Boolean) || [];
  const heroImage =
    heroSlides[0]?.image ||
    (heroSlides[0] as SanityImage) ||
    homePage?.heroImage;
  const title = compactText(homePage?.heroTitle);
  const subtitle = compactText(homePage?.heroSubtitle);

  return (
    <AppShell locale={locale}>
      <div className="page-surface">
        <HeroBanner
          compactDesktop
          image={heroImage}
          logoTitleOnly
          mobileHideText
          slides={heroSlides.length ? heroSlides : null}
          subtitle={subtitle}
          title={title}
        />

        <PageContainer minHeight={false} className="py-6 lg:py-6">
          <QuickEntriesSection
            entries={homePage?.quickEntries?.filter(Boolean) || []}
            locale={locale}
          />

          <section className="mt-7 grid gap-6 lg:mt-8 lg:grid-cols-2">
            <CourseCarousel
              cardVariant="masterclass"
              hrefForItem={programHref}
              items={homePage?.featuredStudyPrograms?.filter(Boolean) || []}
              locale={locale}
              syncLeader
              title={sectionTitle(
                homePage?.featuredStudyProgramsTitle,
                homeCopy[locale].featuredStudyPrograms,
              )}
              viewAllHref={`/${locale}/study/masterclass`}
            />

            <CourseCarousel
              cardVariant="event"
              hrefForItem={eventHref}
              items={homePage?.featuredEvents?.filter(Boolean) || []}
              locale={locale}
              title={sectionTitle(
                homePage?.featuredEventsTitle,
                homeCopy[locale].featuredEvents,
              )}
              viewAllHref={`/${locale}/events/activity`}
            />

            <ArtworkCarousel
              artworks={homePage?.featuredArtWorks?.filter(Boolean) || []}
              locale={locale}
              title={sectionTitle(
                homePage?.featuredArtWorksTitle,
                homeCopy[locale].artWorks,
              )}
            />

            <ProductCarousel
              locale={locale}
              products={homePage?.featuredProducts?.filter(Boolean) || []}
            />
          </section>

          <PastReviewCarousel
            className="mt-8 lg:mt-9"
            items={homePage?.pastReviewItems?.filter(Boolean) || []}
            itemsPerViewDesktop={4}
            itemsPerViewMobile={1}
            locale={locale}
            title={sectionTitle(
              homePage?.featuredPastEventsTitle,
              homeCopy[locale].pastReview,
            )}
          />
        </PageContainer>
      </div>
    </AppShell>
  );
}

import type {SanityImageSource} from "@sanity/image-url";
import Link from "next/link";

import type {Locale} from "@/config/navigation";
import {client} from "@/sanity/client";
import {urlForImage} from "@/sanity/image";
import {homePageQuery} from "@/sanity/queries";

import {AppShell} from "./AppShell";
import {
  getArtworkImageSource,
  isArtCategorySlug,
  type Artwork,
} from "./ArtCategoryPage";
import {HeroBanner, type HeroBannerSlide} from "./HeroBanner";
import {HomeCarouselSection} from "./HomeCarouselSection";
import {PageContainer} from "./PageContainer";
import {CourseCard, type StudyProgram} from "./StudyPages";
import {glassStyle} from "../../styles/glassStyle";

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

type PastReviewItem = {
  _key?: string;
  description?: string | null;
  image?: SanityImage;
  title?: string | null;
  year?: string | null;
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
  heroImage?: SanityImage;
  heroImages?: HeroBannerSlide[] | null;
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
    masterclassEntryDescription: "专业导师带领的玻璃艺术课程与创作研修。",
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
      "Glass art courses and creative workshops led by professional mentors.",
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
  const cmsEntries = entries.filter(
    (entry) => compactText(entry.title) && normalizeHref(entry.href, locale),
  );
  const visibleEntries = (cmsEntries.length > 0
    ? cmsEntries
    : defaultQuickEntries(locale)
  ).slice(0, 2);

  return (
    <section className="mt-8 lg:mt-10">
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
      <div className={`${glassStyle.imageFrame} image-placeholder flex h-[168px] w-[118px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[rgba(255,255,255,0.56)] sm:h-[184px] sm:w-[130px] dark:bg-[rgba(255,255,255,0.06)]`}>
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
  title,
  viewAllHref,
  hrefForItem,
}: {
  cardVariant: "masterclass" | "event";
  hrefForItem: (item: HomeCardItem, locale: Locale) => string | null;
  items: HomeCardItem[];
  locale: Locale;
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
      viewAllHref={`/${locale}/art-creation/glass-art`}
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
      viewAllHref={`/${locale}/shop`}
      viewAllLabel={homeCopy[locale].all}
    />
  );
}

function PastReviewCard({
  item,
  locale,
}: {
  item: PastReviewItem;
  locale: Locale;
}) {
  const labels = homeCopy[locale];
  const title = compactText(item.title);
  const year = compactText(item.year);
  const description = compactText(item.description);
  const src = imageUrl(item.image, 900);
  const hasText = title || year || description;

  return (
    <article className="group relative h-[220px] overflow-hidden rounded-[18px] bg-[rgba(255,255,255,0.08)] sm:h-[250px] lg:h-[280px]">
      {src ? (
        <img
          alt={title || labels.pastReview}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
          loading="lazy"
          src={src}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-token">
          {labels.emptyImage}
        </div>
      )}
      {hasText ? (
        <div className="absolute inset-x-3 bottom-3 rounded-[14px] border border-white/15 bg-black/32 px-4 py-3 text-white shadow-[0_18px_42px_rgba(0,0,0,0.22)] backdrop-blur-md">
          {year ? (
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/62">
              {year}
            </p>
          ) : null}
          {title ? (
            <h3 className="mt-1 line-clamp-1 font-title text-[17px] font-normal leading-snug">
              {title}
            </h3>
          ) : null}
          {description ? (
            <p className="mt-1 line-clamp-2 text-[12px] leading-[1.55] text-white/72">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function PastReviewCarousel({
  items,
  locale,
  title,
}: {
  items: PastReviewItem[];
  locale: Locale;
  title: string;
}) {
  const cards = items
    .filter((item) => item?.image)
    .slice(0, 12)
    .map((item, index) => (
      <PastReviewCard
        item={item}
        key={item._key || `home-past-review-${index}`}
        locale={locale}
      />
    ));

  return (
    <HomeCarouselSection
      autoPlay
      cardVariant="artwork"
      className="mt-12 lg:mt-14"
      items={cards}
      itemsPerViewDesktop={4}
      itemsPerViewMobile={1}
      sectionTitle={title}
      viewAllLabel={homeCopy[locale].all}
    />
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

          <section className="mt-10 grid gap-7 lg:mt-12 lg:grid-cols-2">
            <CourseCarousel
              cardVariant="masterclass"
              hrefForItem={programHref}
              items={homePage?.featuredStudyPrograms?.filter(Boolean) || []}
              locale={locale}
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
            items={homePage?.pastReviewItems?.filter(Boolean) || []}
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

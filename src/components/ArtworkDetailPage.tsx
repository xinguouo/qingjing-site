import type {SanityImageSource} from "@sanity/image-url";
import Link from "next/link";
import {notFound} from "next/navigation";

import type {Locale} from "@/config/navigation";
import {client} from "@/sanity/client";
import {urlForImage} from "@/sanity/image";
import {artWorkBySlugQuery} from "@/sanity/queries";

import {
  artCategoryConfigs,
  fallbackArtworks,
  isArtCategorySlug,
  type ArtCategorySlug,
  type Artwork,
} from "./ArtCategoryPage";
import {AppShell} from "./AppShell";
import {PageContainer} from "./PageContainer";

type SanityImage = SanityImageSource | null | undefined;

type ArtworkDetailPageProps = {
  category?: string;
  includeLocalePrefix?: boolean;
  locale: Locale;
  slug: string;
};

const copy = {
  zh: {
    artist: "作者",
    backPrefix: "返回",
    description: "作品描述",
    emptyDescription: "作品描述待更新。",
    emptyImage: "作品图片待上传",
    size: "尺寸",
    title: "作品名称",
    year: "创作年份",
  },
  en: {
    artist: "Artist",
    backPrefix: "Back to",
    description: "Artwork Description",
    emptyDescription: "Artwork description pending.",
    emptyImage: "Artwork image pending",
    size: "Size",
    title: "Artwork Title",
    year: "Year",
  },
} satisfies Record<Locale, Record<string, string>>;

function compactText(value: string | number | null | undefined) {
  return String(value ?? "").trim();
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

function normalizeCategory(value: string | null | undefined): ArtCategorySlug | null {
  return value && isArtCategorySlug(value) ? value : null;
}

function findFallbackArtwork(
  slug: string,
  category: ArtCategorySlug | null,
  locale: Locale,
) {
  if (category) {
    return (
      fallbackArtworks[category][locale].find((artwork) => artwork.slug === slug) ||
      null
    );
  }

  for (const categorySlug of Object.keys(artCategoryConfigs) as ArtCategorySlug[]) {
    const artwork = fallbackArtworks[categorySlug][locale].find(
      (item) => item.slug === slug,
    );

    if (artwork) {
      return {...artwork, category: categorySlug};
    }
  }

  return null;
}

function categoryLabel(category: ArtCategorySlug, locale: Locale) {
  const config = artCategoryConfigs[category];

  return locale === "en" ? config.titleEn : config.titleZh;
}

function ArtworkHeader({
  backHref,
  backLabel,
  categoryLabel,
  primaryTitle,
  secondaryTitle,
}: {
  backHref: string;
  backLabel: string;
  categoryLabel?: string;
  primaryTitle: string;
  secondaryTitle: string;
}) {
  return (
    <header className="max-w-[940px] border-b border-[var(--border)] pb-7">
      <Link
        className="inline-flex items-center text-[14px] leading-none text-muted-token transition hover:text-primary"
        href={backHref}
      >
        ← {backLabel}
      </Link>
      {categoryLabel ? (
        <p className="detail-meta mt-8 uppercase">
          {categoryLabel}
        </p>
      ) : null}
      <h1 className={categoryLabel ? "zh-title mt-4" : "zh-title mt-8"}>
        {primaryTitle}
      </h1>
      {secondaryTitle ? (
        <p className="en-title mt-3">
          {secondaryTitle}
        </p>
      ) : null}
    </header>
  );
}

function ArtworkMetaList({
  items,
}: {
  items: Array<{label: string; value?: string | number | null}>;
}) {
  const visibleItems = items.filter((item) => compactText(item.value));

  if (!visibleItems.length) {
    return null;
  }

  return (
    <dl className="mt-7 grid max-w-[760px] gap-x-10 gap-y-5 border-b border-[var(--border)] pb-7 sm:grid-cols-3">
      {visibleItems.map((item) => (
        <div key={item.label}>
          <dt className="text-[12px] leading-none text-muted-token">
            {item.label}
          </dt>
          <dd className="mt-2 whitespace-pre-line text-[15px] leading-[1.7] text-primary">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ArtworkMeta({
  artist,
  labels,
  size,
  year,
}: {
  artist?: string | null;
  labels: typeof copy.zh;
  size?: string | null;
  year?: string | number | null;
}) {
  return (
    <ArtworkMetaList
      items={[
        {label: labels.artist, value: artist},
        {label: labels.year, value: year},
        {label: labels.size, value: size},
      ]}
    />
  );
}

function ArtworkDescription({
  description,
  label,
}: {
  description: string;
  label: string;
}) {
  return (
    <section className="mt-8 max-w-[760px]">
      <h2 className="text-[13px] font-medium leading-none text-primary">
        {label}
      </h2>
      <p className="mt-4 whitespace-pre-line text-[14px] leading-[1.95] text-secondary">
        {description}
      </p>
    </section>
  );
}

function ArtworkGallery({
  images,
  label,
  title,
}: {
  images: SanityImage[];
  label: string;
  title: string;
}) {
  if (!images.length) {
    return (
      <section className="mt-12 max-w-[980px]">
        <div className="image-placeholder flex min-h-[420px] items-center justify-center rounded-[18px] border border-[var(--border)] text-xs text-muted-token">
          {label}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 max-w-[980px] space-y-10 lg:space-y-12">
      {images.map((image, index) => {
        const src = imageUrl(image, 1800);

        return (
          <figure
            className="w-full"
            key={index}
          >
            {src ? (
              <img
                alt={`${title} ${index + 1}`}
                className="block h-auto w-full object-contain"
                loading={index === 0 ? "eager" : "lazy"}
                src={src}
              />
            ) : (
              <div className="image-placeholder flex min-h-[420px] w-full items-center justify-center text-xs text-muted-token">
                {label}
              </div>
            )}
          </figure>
        );
      })}
    </section>
  );
}

export function ArtworkDetailLayout({
  backHref,
  backLabel,
  categoryLabel,
  description,
  descriptionLabel,
  emptyImageLabel,
  images,
  locale,
  metaItems,
  primaryTitle,
  secondaryTitle,
}: {
  backHref: string;
  backLabel: string;
  categoryLabel?: string;
  description: string;
  descriptionLabel: string;
  emptyImageLabel: string;
  images: SanityImage[];
  locale: Locale;
  metaItems: Array<{label: string; value?: string | number | null}>;
  primaryTitle: string;
  secondaryTitle: string;
}) {
  return (
    <AppShell locale={locale}>
      <PageContainer className="pb-16 lg:pb-24">
        <ArtworkHeader
          backHref={backHref}
          backLabel={backLabel}
          categoryLabel={categoryLabel}
          primaryTitle={primaryTitle}
          secondaryTitle={secondaryTitle}
        />
        <ArtworkMetaList items={metaItems} />
        {description ? (
          <ArtworkDescription
            description={description}
            label={descriptionLabel}
          />
        ) : null}
        <ArtworkGallery
          images={images}
          label={emptyImageLabel}
          title={primaryTitle}
        />
      </PageContainer>
    </AppShell>
  );
}

export async function ArtworkDetailPage({
  category,
  includeLocalePrefix = true,
  locale,
  slug,
}: ArtworkDetailPageProps) {
  const requestedCategory = normalizeCategory(category);
  const cmsArtwork = await client
    .withConfig({useCdn: false})
    .fetch<Artwork | null>(
      artWorkBySlugQuery,
      {locale, slug},
      {cache: "no-store"},
    );
  const artwork = cmsArtwork || findFallbackArtwork(slug, requestedCategory, locale);

  if (!artwork) {
    notFound();
  }

  const labels = copy[locale];
  const categorySlug =
    normalizeCategory(artwork.category) || requestedCategory || "glass-art";
  const titleZh = compactText(artwork.titleZh);
  const titleEn = compactText(artwork.titleEn);
  const localizedTitle = compactText(artwork.title) || labels.title;
  const primaryTitle =
    locale === "en"
      ? titleEn || localizedTitle || titleZh
      : titleZh || localizedTitle || titleEn;
  const secondaryTitle =
    locale === "en" ? titleZh || "" : titleEn || "";
  const size = compactText(artwork.size || artwork.dimensions);
  const description = compactText(artwork.description) || labels.emptyDescription;
  const images = (artwork.images || []).filter(Boolean);
  const galleryImages = images.length
    ? images
    : artwork.coverImage
      ? [artwork.coverImage]
      : [];
  const prefix = includeLocalePrefix ? `/${locale}` : "";
  const backHref = `${prefix}/art-projects/${categorySlug}`;
  const backLabel = `${labels.backPrefix} ${categoryLabel(categorySlug, locale)}`;

  return (
    <ArtworkDetailLayout
      backHref={backHref}
      backLabel={backLabel}
      description={description}
      descriptionLabel={labels.description}
      emptyImageLabel={labels.emptyImage}
      images={galleryImages}
      locale={locale}
      metaItems={[
        {label: labels.artist, value: artwork.artist},
        {label: labels.year, value: artwork.year},
        {label: labels.size, value: size},
      ]}
      primaryTitle={primaryTitle}
      secondaryTitle={secondaryTitle}
    />
  );
}

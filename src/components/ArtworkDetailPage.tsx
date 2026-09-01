import type {SanityImageSource} from "@sanity/image-url";
import Link from "next/link";
import {notFound} from "next/navigation";

import type {Locale} from "@/config/navigation";
import {
  artCategorySettingsIds,
  artCategorySlugs,
  resolveArtCategoryTitle,
  type ArtCategoryTitleSettings,
} from "@/config/artCategories";
import {getShopCraftCategoryByInput} from "@/config/shopCraftCategories";
import {client} from "@/sanity/client";
import {urlForImage} from "@/sanity/image";
import {
  artCategoryPageSettingsByTypeQuery,
  artWorkBySlugQuery,
} from "@/sanity/queries";

import {
  fallbackArtworks,
  getArtworkImageSource,
  normalizeArtCategorySlug,
  type ArtCategorySlug,
  type Artwork,
  type ArtworkImageEntry,
  type ArtworkVideo,
} from "./ArtCategoryPage";
import {AppShell} from "./AppShell";
import {ArtworkVideoPlayer} from "./ArtworkVideoPlayer";
import {PageContainer} from "./PageContainer";

type SanityImage = SanityImageSource | null | undefined;

type ArtworkGalleryItem = {
  description?: string | null;
  image: SanityImage;
  key?: string;
};

type ArtworkGalleryInput = ArtworkGalleryItem | SanityImage;

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
    size: "尺寸",
    technique: "工艺",
    title: "作品名称",
    year: "创作年份",
  },
  en: {
    artist: "Artist",
    backPrefix: "Back to",
    description: "Artwork Description",
    size: "Size",
    technique: "Technique",
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

function uploadedVideoSource(video: ArtworkVideo) {
  return compactText(video.videoFile?.asset?.url);
}

function videoCaption(video: ArtworkVideo, locale: Locale) {
  const localizedCaption =
    locale === "en"
      ? video.captionEn || video.caption || video.captionZh
      : video.captionZh || video.caption || video.captionEn;

  return compactText(localizedCaption);
}

function hasRenderableVideo(video: ArtworkVideo) {
  return Boolean(uploadedVideoSource(video));
}

function imageIdentity(image: SanityImage) {
  if (!image || typeof image !== "object") {
    return "";
  }

  const asset = "asset" in image ? image.asset : null;

  if (!asset || typeof asset !== "object") {
    return "";
  }

  return (
    ("_ref" in asset && typeof asset._ref === "string" ? asset._ref : "") ||
    ("_id" in asset && typeof asset._id === "string" ? asset._id : "")
  );
}

function artworkImageDescription(entry: ArtworkImageEntry, locale: Locale) {
  if (!entry || typeof entry !== "object" || !("description" in entry)) {
    return imageCaption(entry as SanityImage, locale);
  }

  return compactText(entry.description) || imageCaption(entry.image, locale);
}

function artworkImageKey(entry: ArtworkImageEntry) {
  if (!entry || typeof entry !== "object" || !("_key" in entry)) {
    return "";
  }

  return compactText(entry._key);
}

function mergeArtworkImages(
  coverImage: SanityImage,
  artworkImages: ArtworkImageEntry[] | null | undefined,
  locale: Locale,
) {
  const seen = new Set<string>();
  const merged: ArtworkGalleryItem[] = [];

  if (coverImage) {
    const identity = imageIdentity(coverImage);

    if (identity) {
      seen.add(identity);
    }

    merged.push({
      description: imageCaption(coverImage, locale),
      image: coverImage,
      key: identity || "cover-image",
    });
  }

  (artworkImages || []).forEach((entry) => {
    const image = getArtworkImageSource(entry);

    if (!image) {
      return;
    }

    const identity = imageIdentity(image);

    if (identity && seen.has(identity)) {
      return;
    }

    if (identity) {
      seen.add(identity);
    }

    merged.push({
      description: artworkImageDescription(entry, locale),
      image,
      key: artworkImageKey(entry) || identity,
    });
  });

  return merged;
}

function normalizeCategory(value: string | null | undefined): ArtCategorySlug | null {
  return normalizeArtCategorySlug(value);
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

  for (const categorySlug of artCategorySlugs) {
    const artwork = fallbackArtworks[categorySlug][locale].find(
      (item) => item.slug === slug,
    );

    if (artwork) {
      return {...artwork, category: categorySlug};
    }
  }

  return null;
}

function categoryLabel(
  category: ArtCategorySlug,
  locale: Locale,
  settings?: ArtCategoryTitleSettings | null,
) {
  return resolveArtCategoryTitle(category, locale, settings);
}

function techniqueLabel(technique: string | null | undefined, locale: Locale) {
  const category = getShopCraftCategoryByInput(technique);

  if (!category) {
    return "";
  }

  return locale === "en" ? category.labelEn : category.labelZh;
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
        className="inline-flex items-center gap-2 text-[14px] leading-none text-muted-token transition hover:text-primary"
        href={backHref}
      >
        <span aria-hidden="true">&larr;</span>
        <span>{backLabel}</span>
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
    <dl
      className={`mt-7 grid max-w-[760px] gap-x-10 gap-y-5 border-b border-[var(--border)] pb-7 ${
        visibleItems.length > 3 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"
      }`}
    >
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
  locale,
  title,
}: {
  images: ArtworkGalleryInput[];
  locale: Locale;
  title: string;
}) {
  const visibleImages = images.reduce<ArtworkGalleryItem[]>((items, item) => {
      if (!item || typeof item !== "object") {
        return items;
      }

      if ("image" in item) {
        if (item.image) {
          items.push({
            description:
              compactText(item.description) || imageCaption(item.image, locale),
            image: item.image,
            key: item.key,
          });
        }

        return items;
      }

      const image = item as SanityImage;
      if (image) {
        items.push({description: imageCaption(image, locale), image});
      }

      return items;
    }, []);

  if (!visibleImages.length) {
    return null;
  }

  return (
    <section className="mt-12 max-w-[980px] space-y-10 lg:space-y-12">
      {visibleImages.map((item, index) => {
        const src = imageUrl(item.image, 1800);
        const description = compactText(item.description);

        return (
          <figure
            className="w-full"
            key={item.key || index}
          >
            {src ? (
              <img
                alt={`${title} ${index + 1}`}
                className="block h-auto w-full object-contain"
                loading={index === 0 ? "eager" : "lazy"}
                src={src}
              />
            ) : null}
            {description ? (
              <figcaption className="mt-4 max-w-[760px] whitespace-pre-line text-[13px] leading-[1.8] text-secondary">
                {description}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </section>
  );
}

function ArtworkVideos({
  locale,
  videos,
}: {
  locale: Locale;
  videos?: ArtworkVideo[] | null;
}) {
  const visibleVideos = (videos || []).filter(hasRenderableVideo);

  if (!visibleVideos.length) {
    return null;
  }

  return (
    <section className="mt-12 max-w-[980px] space-y-10 lg:space-y-12">
      {visibleVideos.map((video, index) => {
        const key = video._key || `video-${index}`;
        const caption = videoCaption(video, locale);
        const uploadSrc = uploadedVideoSource(video);

        return (
          <figure
            className="w-full"
            key={key}
          >
            <ArtworkVideoPlayer
              autoplay={video.autoplay}
              loop={video.loop}
              mimeType={video.videoFile?.asset?.mimeType}
              muted={video.muted}
              src={uploadSrc}
            />
            {caption ? (
              <figcaption className="mt-4 max-w-[760px] whitespace-pre-line text-[13px] leading-[1.8] text-secondary">
                {caption}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </section>
  );
}

export function ArtworkDetailLayout({
  artCategorySettings,
  backHref,
  backLabel,
  categoryLabel,
  description,
  descriptionLabel,
  images,
  locale,
  metaItems,
  primaryTitle,
  secondaryTitle,
  videos,
}: {
  artCategorySettings?: ArtCategoryTitleSettings | null;
  backHref: string;
  backLabel: string;
  categoryLabel?: string;
  description: string;
  descriptionLabel: string;
  images: ArtworkGalleryInput[];
  locale: Locale;
  metaItems: Array<{label: string; value?: string | number | null}>;
  primaryTitle: string;
  secondaryTitle: string;
  videos?: ArtworkVideo[] | null;
}) {
  return (
    <AppShell artCategorySettings={artCategorySettings} locale={locale}>
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
        <ArtworkVideos
          locale={locale}
          videos={videos}
        />
        <ArtworkGallery
          images={images}
          locale={locale}
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
    .fetch<Artwork | null>(
      artWorkBySlugQuery,
      {locale, slug},
      {cache: "no-store"},
    )
    .catch(() => null);
  const artwork = cmsArtwork || findFallbackArtwork(slug, requestedCategory, locale);

  if (!artwork) {
    notFound();
  }

  const labels = copy[locale];
  const categorySlug =
    normalizeCategory(artwork.category) || requestedCategory || "sculpture";
  const categorySettings = await client
    .fetch<ArtCategoryTitleSettings | null>(
      artCategoryPageSettingsByTypeQuery,
      {
        locale,
        categorySettingsId: artCategorySettingsIds[categorySlug],
        categoryType: categorySlug,
      },
      {cache: "no-store"},
    )
    .catch(() => null);
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
  const technique =
    categorySlug === "sculpture" ? techniqueLabel(artwork.technique, locale) : "";
  const description = compactText(artwork.description);
  const galleryImages = mergeArtworkImages(
    artwork.coverImage,
    artwork.images,
    locale,
  );
  const prefix = includeLocalePrefix ? `/${locale}` : "";
  const backHref = `${prefix}/art-projects/${categorySlug}`;
  const resolvedCategoryLabel = categoryLabel(
    categorySlug,
    locale,
    categorySettings,
  );
  const backLabel = `${labels.backPrefix} ${resolvedCategoryLabel}`;

  return (
    <ArtworkDetailLayout
      backHref={backHref}
      backLabel={backLabel}
      artCategorySettings={categorySettings}
      categoryLabel={resolvedCategoryLabel}
      description={description}
      descriptionLabel={labels.description}
      images={galleryImages}
      locale={locale}
      metaItems={[
        {label: labels.artist, value: artwork.artist},
        {label: labels.year, value: artwork.year},
        {label: labels.size, value: size},
        {label: labels.technique, value: technique},
      ]}
      primaryTitle={primaryTitle}
      secondaryTitle={secondaryTitle}
      videos={artwork.artworkVideos}
    />
  );
}

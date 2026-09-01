import type {SanityImageSource} from "@sanity/image-url";

import {
  artCategoryFallbacks,
  isArtCategorySlug,
  normalizeArtCategorySlug,
  resolveArtCategoryPageTitles,
  resolveArtCategoryTitle,
  type ArtCategorySlug,
  type ArtCategoryTitleSettings,
} from "@/config/artCategories";
import type {Locale} from "@/config/navigation";
import {client} from "@/sanity/client";
import {
  artCategoryPageSettingsByTypeQuery,
  artWorksByTypeQuery,
} from "@/sanity/queries";

import {AppShell} from "./AppShell";
import {BaseImageCard} from "./BaseImageCard";
import {PageContainer} from "./PageContainer";
import {PageHeader} from "./PageHeader";
import {ArtCategorySortableGrid} from "./ArtCategorySortableGrid";

export type {ArtCategorySlug};

type SanityImage = SanityImageSource | null | undefined;

export type ArtworkImageItem = {
  _key?: string;
  _type?: string;
  description?: string | null;
  descriptionEn?: string | null;
  descriptionZh?: string | null;
  image?: SanityImage;
};

export type ArtworkImageEntry = SanityImage | ArtworkImageItem | null | undefined;

export type ArtworkVideo = {
  _key?: string;
  autoplay?: boolean | null;
  caption?: string | null;
  captionEn?: string | null;
  captionZh?: string | null;
  loop?: boolean | null;
  muted?: boolean | null;
  videoFile?: {
    asset?: {
      _id?: string;
      mimeType?: string | null;
      originalFilename?: string | null;
      url?: string | null;
    } | null;
  } | null;
};

export type Artwork = {
  _id?: string;
  _key?: string;
  artist?: string | null;
  category?: string | null;
  coverImage?: SanityImage;
  description?: string | null;
  dimensions?: string | null;
  images?: ArtworkImageEntry[] | null;
  artworkVideos?: ArtworkVideo[] | null;
  price?: string | null;
  quantity?: string | null;
  size?: string | null;
  slug?: string | null;
  technique?: string | null;
  title?: string | null;
  titleEn?: string | null;
  titleZh?: string | null;
  workType?: string | null;
  year?: number | string | null;
};

type ArtCategoryPageProps = {
  category: ArtCategorySlug;
  includeLocalePrefix?: boolean;
  locale: Locale;
};

export const artCategoryConfigs = artCategoryFallbacks;

const copy = {
  zh: {
    emptyImage: "作品图片待上传",
    fallbackDescription: "作品简介待更新",
  },
  en: {
    emptyImage: "Artwork image pending",
    fallbackDescription: "Artwork description pending",
  },
} satisfies Record<Locale, Record<string, string>>;

export const fallbackArtworks: Record<ArtCategorySlug, Record<Locale, Artwork[]>> = {
  sculpture: {
    zh: [
      {
        _id: "sculpture-01",
        description: "玻璃作品的光影与材料研究。",
        dimensions: "260x430x240mm",
        slug: "sculpture-study-01",
        title: "风过青岚-III",
      },
      {
        _id: "sculpture-02",
        description: "以透明层次呈现自然气息。",
        dimensions: "320x280x180mm",
        slug: "sculpture-study-02",
        title: "野器栗毛芭目",
      },
      {
        _id: "sculpture-03",
        description: "材料边界与光线的结构片段。",
        dimensions: "300x300x220mm",
        slug: "sculpture-study-03",
        title: "层叠之境",
      },
      {
        _id: "sculpture-04",
        description: "热玻璃成型中的流动痕迹。",
        dimensions: "240x360x210mm",
        slug: "sculpture-study-04",
        title: "透明光域",
      },
    ],
    en: [
      {
        _id: "sculpture-01",
        description: "A study of light and material in glass easel art.",
        dimensions: "260x430x240mm",
        slug: "sculpture-study-01",
        title: "Wind Over Green Mist III",
      },
      {
        _id: "sculpture-02",
        description: "Transparent layers carrying a natural breath.",
        dimensions: "320x280x180mm",
        slug: "sculpture-study-02",
        title: "Wild Vessel",
      },
      {
        _id: "sculpture-03",
        description: "Material boundary and fragments of light.",
        dimensions: "300x300x220mm",
        slug: "sculpture-study-03",
        title: "Layered Realm",
      },
      {
        _id: "sculpture-04",
        description: "Flowing traces from hot glass forming.",
        dimensions: "240x360x210mm",
        slug: "sculpture-study-04",
        title: "Transparent Light",
      },
    ],
  },
  "installation-art": {
    zh: [
      {_id: "installation-art-01", description: "空间与玻璃材料的装置实验。", dimensions: "Variable", slug: "installation-art-study-01", title: "场域片段"},
      {_id: "installation-art-02", description: "开放结构中的光线路径。", dimensions: "Variable", slug: "installation-art-study-02", title: "开放结构"},
      {_id: "installation-art-03", description: "以透明材料重塑空间感知。", dimensions: "Variable", slug: "installation-art-study-03", title: "空间之光"},
      {_id: "installation-art-04", description: "悬置关系中的材料边界。", dimensions: "Variable", slug: "installation-art-study-04", title: "悬置之境"},
    ],
    en: [
      {_id: "installation-art-01", description: "Installation study with space and glass.", dimensions: "Variable", slug: "installation-art-study-01", title: "Site Fragment"},
      {_id: "installation-art-02", description: "Light paths inside an open structure.", dimensions: "Variable", slug: "installation-art-study-02", title: "Open Structure"},
      {_id: "installation-art-03", description: "Transparent material reshaping spatial perception.", dimensions: "Variable", slug: "installation-art-study-03", title: "Spatial Light"},
      {_id: "installation-art-04", description: "Material boundaries in a suspended relation.", dimensions: "Variable", slug: "installation-art-study-04", title: "Suspended Field"},
    ],
  },
  "public-art": {
    zh: [
      {_id: "public-art-01", description: "公共空间中的玻璃艺术节点。", dimensions: "Variable", slug: "public-art-study-01", title: "公共节点"},
      {_id: "public-art-02", description: "城市环境里的透明光线。", dimensions: "Variable", slug: "public-art-study-02", title: "城市光线"},
      {_id: "public-art-03", description: "回应场所记忆的作品形态。", dimensions: "Variable", slug: "public-art-study-03", title: "场所之器"},
      {_id: "public-art-04", description: "面向公共观看的透明地标。", dimensions: "Variable", slug: "public-art-study-04", title: "透明地标"},
    ],
    en: [
      {_id: "public-art-01", description: "Glass art node in public space.", dimensions: "Variable", slug: "public-art-study-01", title: "Public Node"},
      {_id: "public-art-02", description: "Transparent light in the urban environment.", dimensions: "Variable", slug: "public-art-study-02", title: "Urban Light"},
      {_id: "public-art-03", description: "A form responding to memory of place.", dimensions: "Variable", slug: "public-art-study-03", title: "Site Vessel"},
      {_id: "public-art-04", description: "A transparent landmark for public viewing.", dimensions: "Variable", slug: "public-art-study-04", title: "Transparent Landmark"},
    ],
  },
};

export {isArtCategorySlug, normalizeArtCategorySlug};

export function getArtworkImageSource(image: ArtworkImageEntry): SanityImage {
  if (!image || typeof image !== "object") {
    return null;
  }

  if ("image" in image) {
    return image.image;
  }

  return image as SanityImage;
}

function compactText(value: string | null | undefined) {
  return value?.trim() || "";
}

export function ArtworkCard({
  artwork,
  category,
  includeLocalePrefix,
  index,
  locale,
}: {
  artwork: Artwork;
  category: ArtCategorySlug;
  includeLocalePrefix: boolean;
  index: number;
  locale: Locale;
}) {
  const labels = copy[locale];
  const title = compactText(artwork.title);
  const categoryTitle = resolveArtCategoryTitle(category, locale);
  const prefix = includeLocalePrefix ? `/${locale}` : "";
  const href = artwork.slug
    ? `${prefix}/art-projects/${category}/${artwork.slug}`
    : `${prefix}/art-projects/${category}`;
  const number = String(index + 1).padStart(2, "0");

  return (
    <BaseImageCard
      emptyLabel={labels.emptyImage}
      href={href}
      image={artwork.coverImage || getArtworkImageSource(artwork.images?.[0])}
      imageAlt={title || categoryTitle}
      overlayClassName="h-[104px] overflow-hidden"
    >
      <p className="text-[11px] leading-none text-[#444] dark:text-white/58">
        {number}
      </p>
      {title ? (
        <h3 className="mt-4 line-clamp-2 text-[15px] font-medium leading-snug">
          {title}
        </h3>
      ) : null}
    </BaseImageCard>
  );
}

export async function ArtCategoryPage({
  category,
  includeLocalePrefix = true,
  locale,
}: ArtCategoryPageProps) {
  const [cmsArtworks, categorySettings] = await Promise.all([
    client
      .fetch<Artwork[]>(
        artWorksByTypeQuery,
        {locale, workType: category},
        {cache: "no-store"},
      )
      .catch(() => []),
    client
      .fetch<ArtCategoryTitleSettings | null>(
        artCategoryPageSettingsByTypeQuery,
        {
          locale,
          categorySettingsId: `artCategory-${category}`,
          categoryType: category,
        },
        {cache: "no-store"},
      )
      .catch(() => null),
  ]);
  const artworks = cmsArtworks.length ? cmsArtworks : fallbackArtworks[category][locale];
  const titles = resolveArtCategoryPageTitles(category, locale, categorySettings);

  return (
    <AppShell artCategorySettings={categorySettings} locale={locale}>
      <PageContainer className="pb-16 lg:pb-20">
        <div className="max-w-[1180px]">
          <PageHeader titleEn={titles.eyebrow} titleZh={titles.title} />
        </div>

        <ArtCategorySortableGrid
          artworks={artworks}
          category={category}
          includeLocalePrefix={includeLocalePrefix}
          locale={locale}
        />
      </PageContainer>
    </AppShell>
  );
}

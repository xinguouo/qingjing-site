import type { SanityImageSource } from "@sanity/image-url";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";

import type { Locale } from "@/config/navigation";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import {
  artDerivativeDetailBySlugQuery,
  artDerivativeDetailsForCardsQuery,
  artDerivativeDetailSlugsQuery,
  artDerivativePackagingPageQuery,
  artworkProductBySlugQuery,
  derivativeProductBySlugQuery,
  productBySlugQuery,
  productDetailBySlugQuery,
  storeOverviewQuery,
} from "@/sanity/queries";

import { AppShell } from "./AppShell";
import { ArtworkDetailLayout } from "./ArtworkDetailPage";
import { ArtworkVideoPlayer } from "./ArtworkVideoPlayer";
import { BaseImageCard } from "./BaseImageCard";
import { ComingSoonPage } from "./ComingSoonPage";
import { PageContainer } from "./PageContainer";
import { PageHeader } from "./PageHeader";
import { glassStyle } from "../../styles/glassStyle";

type SanityImage = SanityImageSource | null | undefined;
type StoreCategory = "artworks" | "derivatives" | "cultural";
type ProductCollectionCategory = "artwork" | "derivative" | "cultural";
type ProductSubcategory =
  "vessel" | "wearable" | "toy" | "ornament" | "object" | "packaging";

type ProductVideo = {
  asset?: {
    _id?: string;
    mimeType?: string | null;
    originalFilename?: string | null;
    url?: string | null;
  } | null;
} | null;

type ProductCollection = {
  _id: string;
  artworkCategory?: string | string[] | null;
  category?: ProductCollectionCategory | null;
  coverImage?: SanityImage;
  craftCategories?: string[] | null;
  craftCategory?: string | string[] | null;
  description?: string | null;
  derivativeCategory?: ProductSubcategory | null;
  galleryImages?: SanityImage[] | null;
  price?: string | number | null;
  productNumber?: string | number | null;
  productType?: StoreCategory | null;
  order?: number | null;
  orderRank?: string | null;
  slug?: string | null;
  subcategory?: ProductSubcategory | null;
  seriesBranchId?: string | null;
  seriesBranchSlug?: string | null;
  seriesBranchTitle?: string | null;
  seriesId?: string | null;
  seriesSlug?: string | null;
  seriesTitle?: string | null;
  title?: string | null;
  video?: ProductVideo;
};

type ArtworkProduct = {
  _id: string;
  coverImage?: SanityImage;
  description?: string | null;
  dimensions?: string | null;
  images?: SanityImage[] | null;
  quantity?: string | null;
  slug?: string | null;
  title?: string | null;
  video?: ProductVideo;
};

type DerivativeProduct = {
  _id: string;
  category?: string | null;
  coverImage?: SanityImage;
  description?: string | null;
  detail?: string | null;
  dimensions?: string | null;
  gallery?: SanityImage[] | null;
  galleryImages?: SanityImage[] | null;
  images?: SanityImage[] | null;
  mainImage?: SanityImage;
  material?: string | null;
  price?: string | null;
  productType?: StoreCategory | null;
  slug?: string | null;
  size?: string | null;
  specification?: string | null;
  title?: string | null;
  titleEn?: string | null;
  titleZh?: string | null;
  video?: ProductVideo;
};

type ProductDetail = {
  _id: string;
  basicInfo?: {
    category?: string | null;
    productNumber?: string | null;
    title?: string | null;
    titleEn?: string | null;
    titleZh?: string | null;
  } | null;
  commerce?: {
    price?: string | null;
  } | null;
  media?: {
    galleryImages?: SanityImage[] | null;
    mainImage?: SanityImage;
    video?: ProductVideo;
  } | null;
  productInfo?: {
    description?: string | null;
    descriptionEn?: string | null;
    descriptionZh?: string | null;
    dimensions?: string | null;
    material?: string | null;
  } | null;
  relatedProducts?: ProductDetailRelated[] | null;
  slug?: string | null;
};

type ProductDetailRelated = {
  _id: string;
  basicInfo?: {
    category?: string | null;
    productNumber?: string | null;
    title?: string | null;
    titleEn?: string | null;
    titleZh?: string | null;
  } | null;
  commerce?: {
    price?: string | null;
  } | null;
  media?: {
    galleryImages?: SanityImage[] | null;
    mainImage?: SanityImage;
  } | null;
  slug?: string | null;
};

type ArtDerivativeDetail = {
  _id: string;
  category?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  descriptionZh?: string | null;
  dimensions?: string | null;
  galleryImages?: SanityImage[] | null;
  mainImage?: SanityImage;
  packagingImages?: SanityImage[] | null;
  slug?: string | null;
  title?: string | null;
  titleEn?: string | null;
  titleZh?: string | null;
  video?: ProductVideo;
};

type ProductCardItem = {
  _id: string;
  artworkCategory?: string | string[] | null;
  category?: ProductCollectionCategory | null;
  craftCategories?: string[] | null;
  description?: string | null;
  image?: SanityImage;
  order?: number | null;
  orderRank?: string | null;
  price?: string | number | null;
  productNumber?: string | number | null;
  slug?: string | null;
  subcategory?: ProductSubcategory | null;
  seriesBranchSlug?: string | null;
  seriesBranchTitle?: string | null;
  seriesSlug?: string | null;
  seriesTitle?: string | null;
  title?: string | null;
};

type ShopSeriesBranch = {
  _id: string;
  order?: number | null;
  seriesId?: string | null;
  slug?: string | null;
  title?: string | null;
  titleEn?: string | null;
  titleZh?: string | null;
};

type ShopSeries = {
  _id: string;
  branches?: ShopSeriesBranch[] | null;
  order?: number | null;
  slug?: string | null;
  title?: string | null;
  titleEn?: string | null;
  titleZh?: string | null;
};

type ArtDerivativePackagingPage = {
  _id?: string;
  description?: string | null;
  descriptionEn?: string | null;
  descriptionZh?: string | null;
  images?: SanityImage[] | null;
  title?: string | null;
  titleEn?: string | null;
  titleZh?: string | null;
};

type StoreOverviewData = {
  artDerivativeDetails?: ProductCollection[] | null;
  artworkDetailProducts?: ProductCollection[] | null;
  cmsProducts?: ProductCollection[] | null;
  packagingPage?: ArtDerivativePackagingPage | null;
  productDocuments?: ProductCollection[] | null;
  seriesItems?: ShopSeries[] | null;
};

type StoreOverviewProps = {
  activeCategory?: StoreCategory;
  artworkCategory?: string | null;
  craftCategory?: string | null;
  includeLocalePrefix?: boolean;
  locale: Locale;
  series?: string | null;
  seriesBranch?: string | null;
  subcategory?: string | null;
};

type StoreDetailProps = {
  includeLocalePrefix?: boolean;
  locale: Locale;
  slug: string;
};

type ShopArtworkDetailProps = StoreDetailProps & {
  category: string;
};

type ArtDerivativeDetailProps = StoreDetailProps & {
  category: string;
};

const copy = {
  zh: {
    artworkBack: "返回在售艺术商品",
    artworkDescription: "作品描述",
    artworks: "在售艺术商品",
    consult: "咨询购买",
    derivatives: "艺术衍生品",
    dimensions: "尺寸",
    emptyImage: "图片待上传",
    emptyList: "该分类内容待更新。",
    gallery: "图片展示",
    price: "价格",
    quantity: "数量",
    specification: "产品规格",
    storeTitle: "商店",
  },
  en: {
    artworkBack: "Back to Available Art Goods",
    artworkDescription: "Artwork Description",
    artworks: "Available Art Goods",
    consult: "Consult",
    derivatives: "Art Derivatives",
    dimensions: "Dimensions",
    emptyImage: "Image pending",
    emptyList: "Content for this category is pending.",
    gallery: "Gallery",
    price: "Price",
    quantity: "Quantity",
    specification: "Specification",
    storeTitle: "Shop",
  },
} satisfies Record<Locale, Record<string, string>>;

const shopArtworkDetailCopy = {
  zh: {
    back: "\u8fd4\u56de\u5546\u5e97",
    dimensions: "\u5546\u54c1\u89c4\u683c",
    emptyImage: "\u56fe\u7247\u5f85\u4e0a\u4f20",
    emptyTitle: "\u5546\u54c1\u8be6\u60c5",
    material: "\u6750\u8d28",
    related: "\u76f8\u5173\u4f5c\u54c1",
  },
  en: {
    back: "Back to Shop",
    dimensions: "Dimensions",
    emptyImage: "Image pending",
    emptyTitle: "Product Detail",
    material: "Material",
    related: "Related Works",
  },
} satisfies Record<Locale, Record<string, string>>;

const artDerivativeDetailCopy = {
  zh: {
    back: "\u8fd4\u56de\u5546\u5e97",
    categoryFallback: "\u827a\u672f\u884d\u751f\u54c1",
    dimensions: "\u5c3a\u5bf8",
    emptyImage: "\u56fe\u7247\u5f85\u4e0a\u4f20",
    emptyTitle: "\u827a\u672f\u884d\u751f\u54c1",
  },
  en: {
    back: "Back to Shop",
    categoryFallback: "Art Derivatives",
    dimensions: "Dimensions",
    emptyImage: "Image pending",
    emptyTitle: "Art Derivative",
  },
} satisfies Record<Locale, Record<string, string>>;

const categoryByStoreCategory: Record<
  StoreCategory,
  ProductCollectionCategory
> = {
  artworks: "artwork",
  cultural: "cultural",
  derivatives: "derivative",
};

const storeCategorySegments: Record<StoreCategory, string> = {
  artworks: "artworks",
  cultural: "cultural-products",
  derivatives: "derivatives",
};

const derivativeSubcategories: Array<{
  id: ProductSubcategory;
  labelEn: string;
  labelZh: string;
}> = [
  { id: "vessel", labelEn: "Vessel", labelZh: "器物" },
  { id: "wearable", labelEn: "Wearable", labelZh: "肖物" },
  { id: "toy", labelEn: "Toy", labelZh: "玩物" },
  { id: "ornament", labelEn: "Ornament", labelZh: "饰物" },
  { id: "object", labelEn: "Object", labelZh: "境物" },
  { id: "packaging", labelEn: "Packaging", labelZh: "包装" },
];

const craftCategoryOptions = [
  { id: "glass-casting", labelEn: "Glass Casting", labelZh: "玻璃铸造" },
  { id: "glass-blowing", labelEn: "Glass Blowing", labelZh: "玻璃吹制" },
  { id: "lampworking", labelEn: "Lampworking", labelZh: "玻璃灯工" },
  { id: "cold-working", labelEn: "Cold Working", labelZh: "玻璃冷加工" },
  { id: "glass-mosaic", labelEn: "Glass Mosaic", labelZh: "玻璃马赛克" },
  { id: "stained-glass", labelEn: "Stained Glass", labelZh: "玻璃镶嵌" },
  { id: "glass-painting", labelEn: "Glass Painting", labelZh: "玻璃绘画" },
] as const;

type CraftCategory = (typeof craftCategoryOptions)[number]["id"];

const artworkProductCategories = [
  "\u88ab\u5b50\u690d\u7269",
  "\u4f4e\u6816\u751f\u7269",
  "\u6d6e\u6e38\u751f\u7269",
  "\u8568\u7c7b\u690d\u7269",
  "\u6606\u866b",
  "\u88f8\u5b50\u690d\u7269",
  "\u9e1f\u7c7b",
  "\u6e38\u6cf3\u52a8\u7269",
  "\u5176\u4ed6",
] as const;

const defaultSeriesSlug = "wanwu-sheng";
const filterTextNavClass =
  "flex gap-x-8 overflow-x-auto whitespace-nowrap pb-1 text-[13px] text-muted-token [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";
const filterGroupTitleClass =
  "mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-token";
const craftButtonBaseClass =
  "relative flex h-9 shrink-0 items-center overflow-hidden rounded-[10px] border px-4 text-[13px] leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[6px] transition before:pointer-events-none before:absolute before:inset-x-2 before:top-px before:h-px before:bg-white/45 before:opacity-50";
const craftButtonIdleClass =
  "border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.045)] text-muted-token hover:border-[rgba(255,255,255,0.32)] hover:bg-[rgba(255,255,255,0.08)] hover:text-primary";
const craftButtonActiveClass =
  "border-[rgba(255,255,255,0.42)] bg-[rgba(255,255,255,0.14)] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.36),0_8px_24px_rgba(0,0,0,0.12)] before:opacity-80";

function compactText(value: string | number | null | undefined) {
  return typeof value === "number" ? String(value) : value?.trim() || "";
}

function formatProductNumber(value: string | number | null | undefined) {
  const number = compactText(value);

  if (!number) {
    return "";
  }

  return /^\d+$/.test(number) ? number.padStart(2, "0") : number;
}

function productNumberValue(value: string | number | null | undefined) {
  const number = Number(compactText(value));
  return Number.isFinite(number) ? number : Number.POSITIVE_INFINITY;
}

function canonicalDocumentId(value: string | null | undefined) {
  return compactText(value)
    .replace(/^drafts\./, "")
    .replace(/^versions\.[^.]+\./, "");
}

function artworkProductIdentityKeys(item: ProductCollection) {
  const keys = [];
  const documentId = canonicalDocumentId(item._id);
  const slug = compactText(item.slug);
  const productNumber = compactText(item.productNumber);

  if (documentId) {
    keys.push(`id:${documentId}`);
  }

  if (slug) {
    keys.push(`slug:${slug}`);
  }

  if (productNumber) {
    keys.push(`number:${formatProductNumber(productNumber)}`);
  }

  return keys;
}

function uniqueArtworkProductsByIdentity(items: ProductCollection[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const keys = artworkProductIdentityKeys(item);

    if (keys.some((key) => seen.has(key))) {
      return false;
    }

    keys.forEach((key) => seen.add(key));
    return true;
  });
}

function formatYuanPrice(value: string | number | null | undefined) {
  const price = compactText(value);

  if (!price) {
    return "";
  }

  const normalized = price
    .replace(/^¥\s*/, "")
    .replace(/\s*元$/, "")
    .trim();
  return normalized ? `¥ ${normalized} 元` : "";
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

function productVideoSrc(video?: ProductVideo) {
  return compactText(video?.asset?.url);
}

function ProductVideo({video}: {video?: ProductVideo}) {
  const src = productVideoSrc(video);

  if (!src) {
    return null;
  }

  return (
    <div className="w-full">
      <ArtworkVideoPlayer
        mimeType={video?.asset?.mimeType}
        src={src}
      />
    </div>
  );
}

function routePrefix(locale: Locale, includeLocalePrefix: boolean) {
  return includeLocalePrefix ? `/${locale}` : "";
}

function categoryHref(
  category: StoreCategory,
  locale: Locale,
  includeLocalePrefix: boolean,
  subcategory?: ProductSubcategory | null,
) {
  const params = new URLSearchParams({
    category: storeCategorySegments[category],
  });

  if (subcategory) {
    params.set("subcategory", subcategory);
  }

  return `${routePrefix(locale, includeLocalePrefix)}/shop?${params.toString()}`;
}

function shopFilterHref({
  category,
  craftCategory,
  includeLocalePrefix,
  locale,
  series,
  seriesBranch,
  subcategory,
}: {
  category: StoreCategory;
  craftCategory?: string | null;
  includeLocalePrefix: boolean;
  locale: Locale;
  series?: string | null;
  seriesBranch?: string | null;
  subcategory?: ProductSubcategory | null;
}) {
  const params = new URLSearchParams({
    category: storeCategorySegments[category],
  });

  if (craftCategory) {
    params.set("craftCategory", craftCategory);
  }

  if (series) {
    params.set("series", series);
  }

  if (series && seriesBranch) {
    params.set("seriesBranch", seriesBranch);
  }

  if (category === "derivatives" && subcategory) {
    params.set("subcategory", subcategory);
  }

  return `${routePrefix(locale, includeLocalePrefix)}/shop?${params.toString()}`;
}

function productHref(
  category: StoreCategory,
  slug: string | null | undefined,
  locale: Locale,
  includeLocalePrefix: boolean,
) {
  const base = `${routePrefix(locale, includeLocalePrefix)}/shop/${
    storeCategorySegments[category]
  }`;
  return slug ? `${base}/${slug}` : null;
}

function isProductSubcategory(
  value: string | null | undefined,
): value is ProductSubcategory {
  return derivativeSubcategories.some((item) => item.id === value);
}

function isCraftCategory(value: string | null | undefined): value is CraftCategory {
  return craftCategoryOptions.some((item) => item.id === value);
}

function isArtworkProductCategory(value: string | null | undefined) {
  return artworkProductCategories.some(
    (item) =>
      item === value ||
      (value === "\u4f4e\u77ee\u751f\u7269" &&
        item === "\u4f4e\u6816\u751f\u7269"),
  );
}

function normalizeArtworkProductCategory(value: string | null | undefined) {
  const category = compactText(value);

  if (category === "\u4f4e\u77ee\u751f\u7269") {
    return "\u4f4e\u6816\u751f\u7269";
  }

  return category;
}

function normalizeCategories(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeArtworkProductCategory(item)).filter(Boolean);
  }

  const category = normalizeArtworkProductCategory(value);
  return category ? [category] : [];
}

function normalizeCraftCategories(
  value: string | string[] | null | undefined,
  projected?: string[] | null,
) {
  const values = Array.isArray(projected) && projected.length ? projected : value;

  if (Array.isArray(values)) {
    return values.map(compactText).filter(Boolean);
  }

  const category = compactText(values);
  return category ? [category] : [];
}

function subcategoryLabel(
  subcategory: ProductSubcategory | null | undefined,
  locale: Locale,
) {
  const option = derivativeSubcategories.find(
    (item) => item.id === subcategory,
  );
  return option ? (locale === "zh" ? option.labelZh : option.labelEn) : "";
}

function FilterGroupTitle({
  children,
}: {
  children: string;
}) {
  return <p className={filterGroupTitleClass}>{children}</p>;
}

function categoryDisplay(item: ProductCardItem, locale: Locale) {
  if (item.category === "derivative" && item.subcategory) {
    return subcategoryLabel(item.subcategory, locale);
  }

  if (item.category === "artwork") {
    return (
      compactText(item.seriesBranchTitle) ||
      normalizeCategories(item.artworkCategory)[0] ||
      compactText(item.description)
    );
  }

  return compactText(item.description);
}

export function GalleryCardFrame(props: ComponentProps<typeof BaseImageCard>) {
  return <BaseImageCard {...props} />;
}

export function ProductCard({
  href,
  index,
  item,
  locale,
}: {
  href: string | null;
  index: number;
  item: ProductCardItem;
  locale: Locale;
}) {
  const labels = copy[locale];
  const title = compactText(item.title) || labels.storeTitle;
  const category = categoryDisplay(item, locale);
  const number =
    item.category === "artwork"
      ? formatProductNumber(item.productNumber)
      : String(index + 1).padStart(2, "0");

  return (
    <BaseImageCard
      emptyLabel={labels.emptyImage}
      href={href}
      image={item.image}
      imageAlt={title}
      overlayClassName="h-[104px] overflow-hidden"
    >
      <div className="h-full min-w-0">
        <p className="text-[11px] leading-none text-[#444] dark:text-white/58">
          {number || "\u00a0"}
        </p>
        <p className="mt-3 line-clamp-1 min-h-[12px] text-[12px] leading-none text-[#555] dark:text-white/64">
          {category || "\u00a0"}
        </p>
        <h3 className="mt-2 line-clamp-2 text-[15px] font-medium leading-snug">
          {title}
        </h3>
      </div>
    </BaseImageCard>
  );
}

function LegacyInlineShopProductCard({
  category,
  emptyLabel,
  href,
  image,
  index,
  title,
}: {
  category: string;
  emptyLabel: string;
  href: string | null;
  image: SanityImage;
  index: string;
  title: string;
}) {
  const src = imageUrl(image, 760);
  const content = (
    <article className="group w-full min-w-0">
      <div className="flex w-full items-center justify-center bg-white dark:bg-[#111]">
        {src ? (
          <img
            alt={title}
            className="block h-auto w-full object-contain transition duration-300 group-hover:opacity-90"
            loading="lazy"
            src={src}
          />
        ) : (
          <div className="image-placeholder flex min-h-[180px] w-full items-center justify-center px-4 py-10 text-center text-xs text-muted-token">
            {emptyLabel}
          </div>
        )}
      </div>
      <div className="pt-3.5 [&>p:nth-child(2)]:hidden">
        <p className="text-[11px] leading-none text-[#777] dark:text-white/52">
          {index}
        </p>
        <p className="text-[11px] leading-none text-[#777] dark:text-white/52">
          {index} ·
        </p>
        {category ? (
          <p className="mt-2 line-clamp-1 text-[12px] leading-none text-[#777] dark:text-white/56">
            {category}
          </p>
        ) : null}
        <h3 className="mt-2 line-clamp-2 font-title text-[15px] font-normal leading-snug text-primary">
          {title}
        </h3>
      </div>
    </article>
  );

  if (!href) {
    return (
      <div className="block w-full max-w-[320px] min-w-0 cursor-default sm:max-w-[200px]">
        {content}
      </div>
    );
  }

  return (
    <Link
      className="block w-full max-w-[320px] min-w-0 cursor-pointer sm:max-w-[200px]"
      href={href}
    >
      {content}
    </Link>
  );
}

function StoreTabs({
  activeCategory,
  activeCraftCategory,
  activeSeries,
  activeSeriesBranch,
  includeLocalePrefix,
  locale,
}: {
  activeCategory: StoreCategory;
  activeCraftCategory?: CraftCategory | null;
  activeSeries?: string | null;
  activeSeriesBranch?: string | null;
  includeLocalePrefix: boolean;
  locale: Locale;
}) {
  const labels = copy[locale];
  const tabs: Array<{ id: StoreCategory; label: string }> = [
    { id: "artworks", label: labels.artworks },
    { id: "derivatives", label: labels.derivatives },
  ];

  return (
    <nav className="flex flex-wrap gap-x-9 gap-y-3 text-[14px] text-muted-token">
      {tabs.map((tab) => {
        const isActive = tab.id === activeCategory;

        return (
          <Link
            className={`relative pb-3 transition ${
              isActive ? "text-primary" : "hover:text-primary"
            }`}
            href={shopFilterHref({
              category: tab.id,
              craftCategory: activeCraftCategory,
              includeLocalePrefix,
              locale,
              series: activeSeries,
              seriesBranch: activeSeriesBranch,
            })}
            key={tab.id}
          >
            {tab.label}
            {isActive ? (
              <span className="absolute bottom-0 left-0 h-px w-full bg-primary" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function DerivativeSubcategoryTabs({
  activeCraftCategory,
  activeSeries,
  activeSeriesBranch,
  activeSubcategory,
  includeLocalePrefix,
  locale,
}: {
  activeCraftCategory?: CraftCategory | null;
  activeSeries?: string | null;
  activeSeriesBranch?: string | null;
  activeSubcategory?: ProductSubcategory | null;
  includeLocalePrefix: boolean;
  locale: Locale;
}) {
  const allLabel = locale === "zh" ? "全部" : "All";
  const title = locale === "zh" ? "产品类型" : "Product Type";

  return (
    <div className="mt-5">
      <FilterGroupTitle>{title}</FilterGroupTitle>
      <nav className={filterTextNavClass}>
        <Link
          className={`relative shrink-0 pb-3 transition ${
            !activeSubcategory ? "text-primary" : "hover:text-primary"
          }`}
          href={shopFilterHref({
            category: "derivatives",
            craftCategory: activeCraftCategory,
            includeLocalePrefix,
            locale,
            series: activeSeries,
            seriesBranch: activeSeriesBranch,
          })}
        >
          {allLabel}
          {!activeSubcategory ? (
            <span className="absolute bottom-0 left-0 h-px w-full bg-primary" />
          ) : null}
        </Link>
        {derivativeSubcategories.map((item) => {
          const isActive = activeSubcategory === item.id;

          return (
            <Link
              className={`relative shrink-0 pb-3 transition ${
                isActive ? "text-primary" : "hover:text-primary"
              }`}
              href={shopFilterHref({
                category: "derivatives",
                craftCategory: activeCraftCategory,
                includeLocalePrefix,
                locale,
                series: activeSeries,
                seriesBranch: activeSeriesBranch,
                subcategory: item.id,
              })}
              key={item.id}
            >
              {locale === "zh" ? item.labelZh : item.labelEn}
              {isActive ? (
                <span className="absolute bottom-0 left-0 h-px w-full bg-primary" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function CraftCategoryTabs({
  activeCategory,
  activeCraftCategory,
  activeSeries,
  activeSeriesBranch,
  activeSubcategory,
  includeLocalePrefix,
  locale,
}: {
  activeCategory: StoreCategory;
  activeCraftCategory?: CraftCategory | null;
  activeSeries?: string | null;
  activeSeriesBranch?: string | null;
  activeSubcategory?: ProductSubcategory | null;
  includeLocalePrefix: boolean;
  locale: Locale;
}) {
  const allLabel = locale === "zh" ? "全部" : "All";
  const title = locale === "zh" ? "玻璃工艺" : "Glass Craft";

  return (
    <div className="mt-7">
      <FilterGroupTitle>{title}</FilterGroupTitle>
      <nav className="flex gap-3 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <Link
          className={`${craftButtonBaseClass} ${
            !activeCraftCategory ? craftButtonActiveClass : craftButtonIdleClass
          }`}
          href={shopFilterHref({
            category: activeCategory,
            includeLocalePrefix,
            locale,
            series: activeSeries,
            seriesBranch: activeSeriesBranch,
            subcategory: activeSubcategory,
          })}
        >
          {allLabel}
        </Link>
        {craftCategoryOptions.map((item) => {
          const isActive = activeCraftCategory === item.id;

          return (
            <Link
              className={`${craftButtonBaseClass} ${
                isActive ? craftButtonActiveClass : craftButtonIdleClass
              }`}
              href={shopFilterHref({
                category: activeCategory,
                craftCategory: item.id,
                includeLocalePrefix,
                locale,
                series: activeSeries,
                seriesBranch: activeSeriesBranch,
                subcategory: activeSubcategory,
              })}
              key={item.id}
            >
              {locale === "zh" ? item.labelZh : item.labelEn}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SeriesTabs({
  activeCategory,
  activeCraftCategory,
  activeSeries,
  activeSubcategory,
  includeLocalePrefix,
  locale,
  seriesItems,
}: {
  activeCategory: StoreCategory;
  activeCraftCategory?: CraftCategory | null;
  activeSeries?: string | null;
  activeSubcategory?: ProductSubcategory | null;
  includeLocalePrefix: boolean;
  locale: Locale;
  seriesItems: ShopSeries[];
}) {
  const allLabel = locale === "zh" ? "全部系列" : "All Series";
  const title = locale === "zh" ? "作品系列" : "Series";

  return (
    <div className="mt-5">
      <FilterGroupTitle>{title}</FilterGroupTitle>
      <nav className={filterTextNavClass}>
        <Link
          className={`relative shrink-0 pb-3 transition ${
            !activeSeries ? "text-primary" : "hover:text-primary"
          }`}
          href={shopFilterHref({
            category: activeCategory,
            craftCategory: activeCraftCategory,
            includeLocalePrefix,
            locale,
            subcategory: activeSubcategory,
          })}
        >
          {allLabel}
          {!activeSeries ? (
            <span className="absolute bottom-0 left-0 h-px w-full bg-primary" />
          ) : null}
        </Link>
        {seriesItems.map((item) => {
          const slug = compactText(item.slug);
          const seriesTitle = compactText(item.title) || compactText(item.titleZh);
          const isActive = activeSeries === slug;

          if (!slug || !seriesTitle) {
            return null;
          }

          return (
            <Link
              className={`relative shrink-0 pb-3 transition ${
                isActive ? "text-primary" : "hover:text-primary"
              }`}
              href={shopFilterHref({
                category: activeCategory,
                craftCategory: activeCraftCategory,
                includeLocalePrefix,
                locale,
                series: slug,
                subcategory: activeSubcategory,
              })}
              key={item._id}
            >
              {seriesTitle}
              {isActive ? (
                <span className="absolute bottom-0 left-0 h-px w-full bg-primary" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SeriesBranchTabs({
  activeCategory,
  activeCraftCategory,
  activeSeries,
  activeSeriesBranch,
  activeSubcategory,
  branches,
  includeLocalePrefix,
  locale,
}: {
  activeCategory: StoreCategory;
  activeCraftCategory?: CraftCategory | null;
  activeSeries: string;
  activeSeriesBranch?: string | null;
  activeSubcategory?: ProductSubcategory | null;
  branches: ShopSeriesBranch[];
  includeLocalePrefix: boolean;
  locale: Locale;
}) {
  const allLabel = locale === "zh" ? "全部" : "All";
  const title = locale === "zh" ? "系列分支" : "Series Branch";

  if (!branches.length) {
    return null;
  }

  return (
    <div className="mt-5">
      <FilterGroupTitle>{title}</FilterGroupTitle>
      <nav className={filterTextNavClass}>
        <Link
          className={`relative shrink-0 pb-3 transition ${
            !activeSeriesBranch ? "text-primary" : "hover:text-primary"
          }`}
          href={shopFilterHref({
            category: activeCategory,
            craftCategory: activeCraftCategory,
            includeLocalePrefix,
            locale,
            series: activeSeries,
            subcategory: activeSubcategory,
          })}
        >
          {allLabel}
          {!activeSeriesBranch ? (
            <span className="absolute bottom-0 left-0 h-px w-full bg-primary" />
          ) : null}
        </Link>
        {branches.map((branch) => {
          const slug = compactText(branch.slug);
          const branchTitle = compactText(branch.title) || compactText(branch.titleZh);
          const isActive = activeSeriesBranch === slug;

          if (!slug || !branchTitle) {
            return null;
          }

          return (
            <Link
              className={`relative shrink-0 pb-3 transition ${
                isActive ? "text-primary" : "hover:text-primary"
              }`}
              href={shopFilterHref({
                category: activeCategory,
                craftCategory: activeCraftCategory,
                includeLocalePrefix,
                locale,
                series: activeSeries,
                seriesBranch: slug,
                subcategory: activeSubcategory,
              })}
              key={branch._id}
            >
              {branchTitle}
              {isActive ? (
                <span className="absolute bottom-0 left-0 h-px w-full bg-primary" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function mapProduct(item: ProductCollection): ProductCardItem {
  return {
    _id: item._id,
    artworkCategory: item.artworkCategory,
    category:
      item.productType === "artworks"
        ? "artwork"
        : item.productType === "derivatives"
          ? "derivative"
          : item.category,
    craftCategories: normalizeCraftCategories(item.craftCategory, item.craftCategories),
    description: item.description,
    image: item.coverImage || item.galleryImages?.[0],
    order: item.order,
    orderRank: item.orderRank,
    price: item.price,
    productNumber: item.productNumber,
    slug: item.slug,
    subcategory: item.subcategory || item.derivativeCategory,
    seriesBranchSlug: item.seriesBranchSlug,
    seriesBranchTitle: item.seriesBranchTitle,
    seriesSlug: item.seriesSlug,
    seriesTitle: item.seriesTitle,
    title: item.title,
  };
}

function PackagingPageContent({
  fallbackTitle,
  page,
}: {
  fallbackTitle: string;
  page?: ArtDerivativePackagingPage | null;
}) {
  const title = compactText(page?.title) || fallbackTitle;
  const description = compactText(page?.description);
  const images = (page?.images || [])
    .map((image) => ({
      image,
      src: imageUrl(image, 1800),
    }))
    .filter((item) => item.src);

  if (!description && !images.length) {
    return null;
  }

  return (
    <section className="mt-9 max-w-[980px] lg:mt-10">
      <h2 className="font-title text-[32px] font-normal leading-tight text-primary sm:text-[38px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 whitespace-pre-line text-[16px] leading-[1.9] text-secondary">
          {description}
        </p>
      ) : null}
      {images.length ? (
        <div className="mt-10 space-y-8">
          {images.map((item, index) => (
            <img
              alt={`${title} ${index + 1}`}
              className="block h-auto w-full max-w-full object-contain"
              key={`${title}-image-${index}`}
              loading="lazy"
              src={item.src || ""}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export async function StoreOverview({
  activeCategory = "artworks",
  artworkCategory,
  craftCategory,
  includeLocalePrefix = true,
  locale,
  series,
  seriesBranch,
  subcategory,
}: StoreOverviewProps) {
  const storeData = await client
    .fetch<StoreOverviewData>(
      storeOverviewQuery,
      { locale },
      { cache: "no-store" },
    )
    .catch(() => null);
  const cmsProducts = storeData?.cmsProducts || [];
  const productDocuments = storeData?.productDocuments || [];
  const artDerivativeDetails = storeData?.artDerivativeDetails || [];
  const artworkDetailProducts = storeData?.artworkDetailProducts || [];
  const packagingPage = storeData?.packagingPage || null;
  const seriesItems = storeData?.seriesItems || [];
  const labels = copy[locale];
  const activeSubcategory =
    activeCategory === "derivatives" && isProductSubcategory(subcategory)
      ? subcategory
      : null;
  const activeCraftCategory = isCraftCategory(craftCategory) ? craftCategory : null;
  const legacyArtworkBranch =
    activeCategory === "artworks" && isArtworkProductCategory(artworkCategory)
      ? normalizeArtworkProductCategory(artworkCategory)
      : null;
  const requestedSeries = compactText(series);
  const activeSeriesSlug =
    requestedSeries ||
    (legacyArtworkBranch && seriesItems.some((item) => item.slug === defaultSeriesSlug)
      ? defaultSeriesSlug
      : "");
  const activeSeriesItem = seriesItems.find(
    (item) => compactText(item.slug) === activeSeriesSlug,
  );
  const activeBranchFromLegacy = legacyArtworkBranch
    ? (activeSeriesItem?.branches || []).find(
        (branch) => compactText(branch.titleZh) === legacyArtworkBranch,
      )
    : null;
  const requestedSeriesBranch = compactText(seriesBranch);
  const activeSeriesBranchSlug =
    activeSeriesItem &&
    (activeSeriesItem.branches || []).some(
      (branch) => compactText(branch.slug) === requestedSeriesBranch,
    )
      ? requestedSeriesBranch
      : compactText(activeBranchFromLegacy?.slug);
  const source =
    activeCategory === "artworks"
      ? artworkDetailProducts
      : [
          ...cmsProducts,
          ...productDocuments,
          ...(activeCategory === "derivatives" ? artDerivativeDetails : []),
        ];
  const activeCollectionCategory = categoryByStoreCategory[activeCategory];
  const sortedItems = source
    .filter((item) => {
      if (item.productType) {
        return item.productType === activeCategory;
      }

      return item.category === activeCollectionCategory;
    })
    .filter((item) =>
      activeCraftCategory
        ? normalizeCraftCategories(item.craftCategory, item.craftCategories).includes(
            activeCraftCategory,
          )
        : true,
    )
    .filter((item) =>
      activeSeriesSlug ? compactText(item.seriesSlug) === activeSeriesSlug : true,
    )
    .filter((item) =>
      activeSeriesSlug && activeSeriesBranchSlug
        ? compactText(item.seriesBranchSlug) === activeSeriesBranchSlug
        : true,
    )
    .filter((item) =>
      activeCategory === "derivatives" && activeSubcategory
        ? item.subcategory === activeSubcategory
        : true,
    )
    .sort((a, b) => {
      if (activeCategory === "artworks") {
        const numberDiff =
          productNumberValue(a.productNumber) -
          productNumberValue(b.productNumber);

        if (numberDiff !== 0) {
          return numberDiff;
        }
      }

      const rankA = compactText(a.orderRank);
      const rankB = compactText(b.orderRank);

      if (rankA || rankB) {
        return (rankA || "zzzzzzzzzz").localeCompare(
          rankB || "zzzzzzzzzz",
        );
      }

      const orderA = typeof a.order === "number" ? a.order : 0;
      const orderB = typeof b.order === "number" ? b.order : 0;
      const orderDiff = orderA - orderB;

      if (orderDiff !== 0) {
        return orderDiff;
      }

      return compactText(a.title).localeCompare(
        compactText(b.title),
        "zh-Hans",
      );
    });
  const items = (activeCategory === "artworks"
    ? uniqueArtworkProductsByIdentity(sortedItems)
    : sortedItems
  ).map(mapProduct);
  return (
    <AppShell locale={locale}>
      <PageContainer className="pb-16 lg:pb-20">
        <header className="max-w-[1180px] border-b border-[var(--border)] pb-5">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.36em] text-muted-token">
                SHOP
              </p>
              <h1 className="font-title mt-3 text-[32px] font-normal leading-[1.12] text-primary sm:text-[38px] lg:text-[44px]">
                {labels.storeTitle}
              </h1>
            </div>
            <StoreTabs
              activeCategory={activeCategory}
              activeCraftCategory={activeCraftCategory}
              activeSeries={activeSeriesSlug}
              activeSeriesBranch={activeSeriesBranchSlug}
              includeLocalePrefix={includeLocalePrefix}
              locale={locale}
            />
          </div>

          <CraftCategoryTabs
            activeCategory={activeCategory}
            activeCraftCategory={activeCraftCategory}
            activeSeries={activeSeriesSlug}
            activeSeriesBranch={activeSeriesBranchSlug}
            activeSubcategory={activeSubcategory}
            includeLocalePrefix={includeLocalePrefix}
            locale={locale}
          />
          <SeriesTabs
            activeCategory={activeCategory}
            activeCraftCategory={activeCraftCategory}
            activeSeries={activeSeriesSlug}
            activeSubcategory={activeSubcategory}
            includeLocalePrefix={includeLocalePrefix}
            locale={locale}
            seriesItems={seriesItems}
          />
          {activeSeriesItem ? (
            <SeriesBranchTabs
              activeCategory={activeCategory}
              activeCraftCategory={activeCraftCategory}
              activeSeries={activeSeriesSlug}
              activeSeriesBranch={activeSeriesBranchSlug}
              activeSubcategory={activeSubcategory}
              branches={activeSeriesItem.branches || []}
              includeLocalePrefix={includeLocalePrefix}
              locale={locale}
            />
          ) : null}
          {activeCategory === "derivatives" ? (
            <DerivativeSubcategoryTabs
              activeCraftCategory={activeCraftCategory}
              activeSeries={activeSeriesSlug}
              activeSeriesBranch={activeSeriesBranchSlug}
              activeSubcategory={activeSubcategory}
              includeLocalePrefix={includeLocalePrefix}
              locale={locale}
            />
          ) : null}
        </header>

        {activeCategory === "derivatives" &&
        activeSubcategory === "packaging" ? (
          <PackagingPageContent
            fallbackTitle={
              locale === "en" ? "Packaging" : "\u5305\u88c5"
            }
            page={packagingPage}
          />
        ) : (
          <section className="mt-9 max-w-[1180px] lg:mt-10">
            {items.length ? (
            <div className="grid justify-items-start gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {items.map((item, index) => (
                <ProductCard
                  href={productHref(
                    activeCategory,
                    item.slug,
                    locale,
                    includeLocalePrefix,
                  )}
                  index={index}
                  item={item}
                  key={item._id}
                  locale={locale}
                />
              ))}
            </div>
            ) : (
            <p className="text-[15px] leading-8 text-secondary">
              {labels.emptyList}
            </p>
            )}
          </section>
        )}
      </PageContainer>
    </AppShell>
  );
}

function DetailImage({
  image,
  label,
  locale,
  priority = false,
  title,
}: {
  image: SanityImage;
  label: string;
  locale: Locale;
  priority?: boolean;
  title: string;
}) {
  const src = imageUrl(image, priority ? 1800 : 900);
  const caption = imageCaption(image, locale);

  return (
    <figure>
      <div className="flex w-full items-center justify-center rounded-[18px] border border-[var(--border)] bg-[rgba(255,255,255,0.42)] p-4 dark:bg-[rgba(255,255,255,0.04)]">
        {src ? (
          <img
            alt={title}
            className="max-h-[640px] w-full object-contain"
            loading={priority ? "eager" : "lazy"}
            src={src}
          />
        ) : (
          <div className="image-placeholder flex min-h-[340px] w-full items-center justify-center text-xs text-muted-token">
            {label}
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 max-w-[720px] whitespace-pre-line text-[13px] leading-[1.8] text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  const text = compactText(value);

  if (!text) {
    return null;
  }

  return (
    <div className="border-b border-[var(--border)] py-4 last:border-b-0">
      <p className="text-[12px] uppercase tracking-[0.22em] text-muted-token">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-line text-[15px] leading-[1.75] text-primary">
        {text}
      </p>
    </div>
  );
}

function artDerivativeTitle(product: ArtDerivativeDetail, locale: Locale) {
  const titleZh = compactText(product.titleZh);
  const titleEn = compactText(product.titleEn);

  return locale === "en" ? titleEn || titleZh : titleZh || titleEn;
}

function artDerivativeSecondaryTitle(
  product: ArtDerivativeDetail,
  locale: Locale,
) {
  const titleZh = compactText(product.titleZh);
  const titleEn = compactText(product.titleEn);
  const primary = artDerivativeTitle(product, locale);
  const secondary = locale === "en" ? titleZh : titleEn;

  return secondary && secondary !== primary ? secondary : "";
}

function ArtDerivativeMainImage({
  image,
  label,
  title,
}: {
  image: SanityImage;
  label: string;
  title: string;
}) {
  const src = imageUrl(image, 1800);

  return (
    <div className="flex min-h-[360px] w-full items-center justify-center bg-white px-4 py-12 dark:bg-[#111] sm:min-h-[440px] sm:px-8 lg:min-h-[520px] lg:py-16">
      {src ? (
        <img
          alt={title}
          className="max-h-[620px] w-full max-w-[900px] object-contain"
          loading="eager"
          src={src}
        />
      ) : (
        <div className="image-placeholder flex min-h-[320px] w-full max-w-[900px] items-center justify-center rounded-[12px] text-xs text-muted-token">
          {label}
        </div>
      )}
    </div>
  );
}

function PackagingImagesSection({
  images,
  title,
}: {
  images?: SanityImage[] | null;
  title: string;
}) {
  const validImages = (images || [])
    .map((image) => ({
      image,
      src: imageUrl(image, 1800),
    }))
    .filter((item) => item.src);

  if (!validImages.length) {
    return null;
  }

  return (
    <section className="mt-16 space-y-8 lg:mt-20">
      <h2 className="font-title text-[28px] font-normal leading-tight text-primary sm:text-[32px]">
        Packaging
      </h2>
      <div className="space-y-8">
        {validImages.map((item, index) => (
          <img
            alt={`${title} packaging ${index + 1}`}
            className="block h-auto w-full max-w-full object-contain"
            key={`${title}-packaging-${index}`}
            loading="lazy"
            src={item.src || ""}
          />
        ))}
      </div>
    </section>
  );
}

export async function DerivativeDetailPage({
  category,
  includeLocalePrefix = true,
  locale,
  slug,
}: ArtDerivativeDetailProps) {
  if (category !== "derivatives" && category !== "art-derivatives") {
    notFound();
  }

  const product = await client
    .withConfig({ useCdn: false })
    .fetch<ArtDerivativeDetail | null>(
      artDerivativeDetailBySlugQuery,
      { locale, slug },
      { cache: "no-store" },
    );

  if (!product) {
    notFound();
  }

  const labels = artDerivativeDetailCopy[locale];
  const title = artDerivativeTitle(product, locale) || labels.emptyTitle;
  const secondaryTitle = artDerivativeSecondaryTitle(product, locale);
  const categoryLabel =
    compactText(product.category) || labels.categoryFallback;
  const dimensions = compactText(product.dimensions);
  const description = compactText(product.description);
  const mainImage = product.mainImage || product.galleryImages?.[0];
  const backHref = `${routePrefix(locale, includeLocalePrefix)}/shop`;

  return (
    <AppShell locale={locale}>
      <PageContainer className="pb-16 lg:pb-20">
        <article className="max-w-[1160px]">
          <Link
            className="inline-flex text-[14px] leading-none text-muted-token transition hover:text-primary"
            href={backHref}
          >
            ← {labels.back}
          </Link>

          <header className="mt-14 max-w-[720px] border-b border-[var(--border)] pb-8 sm:mt-16">
            <p className="detail-meta uppercase">{categoryLabel}</p>
            <h1 className="zh-title mt-8">{title}</h1>
            {secondaryTitle ? (
              <p className="en-title mt-3">{secondaryTitle}</p>
            ) : null}
          </header>

          <section className="mt-5 max-w-[760px]">
            {dimensions ? <p className="detail-meta">{dimensions}</p> : null}
            {description ? (
              <p className="mt-9 whitespace-pre-line text-[15px] leading-[1.9] text-secondary">
                {description}
              </p>
            ) : null}
          </section>

          <section className="mt-16 space-y-8 lg:mt-20">
            <ProductVideo video={product.video} />
            <ArtDerivativeMainImage
              image={mainImage}
              label={labels.emptyImage}
              title={title}
            />
          </section>

          <PackagingImagesSection
            images={product.packagingImages}
            title={title}
          />
        </article>
      </PageContainer>
    </AppShell>
  );
}

function productDetailTitle(
  product: ProductDetail | ProductDetailRelated,
  locale: Locale,
) {
  const titleZh = compactText(product.basicInfo?.titleZh);
  const titleEn = compactText(product.basicInfo?.titleEn);

  return locale === "en" ? titleEn || titleZh : titleZh || titleEn;
}

function productDetailSecondaryTitle(product: ProductDetail, locale: Locale) {
  const titleZh = compactText(product.basicInfo?.titleZh);
  const titleEn = compactText(product.basicInfo?.titleEn);
  const primary = productDetailTitle(product, locale);
  const secondary = locale === "en" ? titleZh : titleEn;

  return secondary && secondary !== primary ? secondary : "";
}

function productDetailCategoryLine(
  product: ProductDetail | ProductDetailRelated,
) {
  const number = formatProductNumber(product.basicInfo?.productNumber);
  const category = compactText(product.basicInfo?.category);

  return [number, category].filter(Boolean).join(" · ");
}

function productDetailImages(product: ProductDetail) {
  const images = [
    product.media?.mainImage,
    ...(product.media?.galleryImages || []),
  ].filter(Boolean);

  return images.length ? images : [null];
}

function productDetailRelatedImage(product: ProductDetailRelated) {
  return product.media?.mainImage || product.media?.galleryImages?.[0];
}

function ShopArtworkImage({
  image,
  label,
  locale,
  priority = false,
  title,
}: {
  image: SanityImage;
  label: string;
  locale: Locale;
  priority?: boolean;
  title: string;
}) {
  const src = imageUrl(image, priority ? 1500 : 1100);
  const caption = imageCaption(image, locale);

  return (
    <figure>
      <div className="overflow-hidden rounded-[12px] bg-[#ededeb] dark:bg-white/[0.04]">
        {src ? (
          <img
            alt={title}
            className="block h-auto w-full object-contain"
            loading={priority ? "eager" : "lazy"}
            src={src}
          />
        ) : (
          <div className="image-placeholder flex min-h-[360px] items-center justify-center px-6 text-center text-xs text-muted-token">
            {label}
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 max-w-[720px] whitespace-pre-line text-[13px] leading-[1.8] text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function ShopArtworkRelatedCard({
  includeLocalePrefix,
  locale,
  product,
}: {
  includeLocalePrefix: boolean;
  locale: Locale;
  product: ProductDetailRelated;
}) {
  const labels = shopArtworkDetailCopy[locale];
  const title = productDetailTitle(product, locale) || labels.emptyTitle;
  const price = formatYuanPrice(product.commerce?.price);
  const image = productDetailRelatedImage(product);
  const src = imageUrl(image, 520);
  const href = `${routePrefix(locale, includeLocalePrefix)}/shop/artworks/${
    product.slug || ""
  }`;

  return (
    <Link className="group block min-w-0" href={href}>
      <article className="overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--card)] shadow-[0_12px_28px_rgba(0,0,0,0.055)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(0,0,0,0.075)]">
        <div className="image-placeholder flex aspect-[1.12] items-center justify-center overflow-hidden bg-[#ececea] dark:bg-white/[0.04]">
          {src ? (
            <img
              alt={title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
              loading="lazy"
              src={src}
            />
          ) : (
            <span className="px-4 text-center text-[11px] text-muted-token">
              {labels.emptyImage}
            </span>
          )}
        </div>
        <div className="px-4 py-3.5">
          <h3 className="line-clamp-1 text-[14px] font-medium leading-snug text-primary">
            {title}
          </h3>
          {price ? (
            <p className="mt-1.5 text-[12px] leading-none text-muted-token">
              {price}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}

export async function ShopArtworkDetailPage({
  category,
  includeLocalePrefix = true,
  locale,
  slug,
}: ShopArtworkDetailProps) {
  if (category !== "artworks" && category !== "available-artworks") {
    notFound();
  }

  const product = await client
    .withConfig({ useCdn: false })
    .fetch<ProductDetail | null>(
      productDetailBySlugQuery,
      { locale, slug },
      { cache: "no-store" },
    );

  if (!product) {
    notFound();
  }

  const labels = shopArtworkDetailCopy[locale];
  const title = productDetailTitle(product, locale) || labels.emptyTitle;
  const secondaryTitle = productDetailSecondaryTitle(product, locale);
  const categoryLine = productDetailCategoryLine(product);
  const description = compactText(product.productInfo?.description);
  const dimensions = compactText(product.productInfo?.dimensions);
  const material = compactText(product.productInfo?.material);
  const price = formatYuanPrice(product.commerce?.price);
  const images = productDetailImages(product);
  const relatedProducts =
    product.relatedProducts?.filter((item) => item.slug) || [];
  const backHref = `${routePrefix(locale, includeLocalePrefix)}/shop`;

  return (
    <AppShell locale={locale}>
      <PageContainer className="pb-16 lg:pb-20">
        <div className="max-w-[1160px]">
          <Link
            className="inline-flex text-[14px] leading-none text-muted-token transition hover:text-primary"
            href={backHref}
          >
            ← {labels.back}
          </Link>

          <section className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,630px)_minmax(340px,390px)] lg:items-start lg:gap-14 xl:gap-16">
            <div className="grid gap-4">
              <ProductVideo video={product.media?.video} />
              {images.map((image, index) => (
                <ShopArtworkImage
                  image={image}
                  key={index}
                  label={labels.emptyImage}
                  locale={locale}
                  priority={index === 0}
                  title={`${title} ${index + 1}`}
                />
              ))}
            </div>

            <aside className="lg:sticky lg:top-[88px]">
              <div className="border-b border-[var(--border)] pb-7">
                {categoryLine ? (
                  <p className="detail-meta uppercase">{categoryLine}</p>
                ) : null}
                <h1 className="zh-title mt-7">{title}</h1>
                {secondaryTitle ? (
                  <p className="en-title mt-3">{secondaryTitle}</p>
                ) : null}
              </div>

              <div className="border-b border-[var(--border)] py-7">
                {dimensions ? (
                  <p className="detail-meta">{dimensions}</p>
                ) : null}
                {material ? (
                  <div className="mt-8">
                    <p className="detail-meta">{labels.material}</p>
                    <p className="mt-3 text-[16px] leading-none text-primary">
                      {material}
                    </p>
                  </div>
                ) : null}
                {description ? (
                  <p className="mt-8 whitespace-pre-line text-[15px] leading-[1.9] text-secondary">
                    {description}
                  </p>
                ) : null}
              </div>

              {price ? (
                <div className="border-b border-[var(--border)] py-7">
                  <p className="font-title text-[32px] font-normal leading-none text-primary lg:text-[38px]">
                    {price}
                  </p>
                </div>
              ) : null}

              {relatedProducts.length ? (
                <section className="pt-7">
                  <h2 className="text-[15px] font-normal leading-none text-muted-token">
                    {labels.related}
                  </h2>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    {relatedProducts.slice(0, 4).map((related) => (
                      <ShopArtworkRelatedCard
                        includeLocalePrefix={includeLocalePrefix}
                        key={related._id}
                        locale={locale}
                        product={related}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>
          </section>
        </div>
      </PageContainer>
    </AppShell>
  );
}

export async function ArtworkProductDetailPage({
  includeLocalePrefix = true,
  locale,
  slug,
}: StoreDetailProps) {
  const product = await client
    .withConfig({ useCdn: false })
    .fetch<ArtworkProduct | null>(
      artworkProductBySlugQuery,
      { locale, slug },
      { cache: "no-store" },
    );

  if (!product) {
    notFound();
  }

  const labels = copy[locale];
  const title = compactText(product.title) || labels.artworks;
  const description = compactText(product.description);
  const images = (product.images || []).filter(Boolean);
  const mainImage = product.coverImage || images[0];
  const backHref = categoryHref("artworks", locale, includeLocalePrefix);

  return (
    <AppShell locale={locale}>
      <PageContainer className="pb-16 lg:pb-20">
        <div className="max-w-[1120px]">
          <Link
            className="inline-flex text-[14px] leading-none text-muted-token transition hover:text-primary"
            href={backHref}
          >
            ← {labels.artworkBack}
          </Link>
          <div className="mt-8 max-w-[760px]">
            <PageHeader titleEn="ARTWORK PRODUCT" titleZh={title} />
          </div>
        </div>

        <section className="mt-10 grid max-w-[1120px] gap-8 lg:grid-cols-[minmax(0,760px)_280px] lg:items-start">
          <div className="grid gap-5">
            <ProductVideo video={product.video} />
            <DetailImage
              image={mainImage}
              label={labels.emptyImage}
              locale={locale}
              priority
              title={title}
            />
            {images.length > 1 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {images.slice(1).map((image, index) => (
                  <DetailImage
                    image={image}
                    key={index}
                    label={labels.emptyImage}
                    locale={locale}
                    title={`${title} ${index + 2}`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <aside className="glass-card rounded-[22px] p-6">
            <h2 className="font-title text-[26px] font-normal leading-tight text-primary">
              {title}
            </h2>
            <div className="mt-5">
              <InfoRow label={labels.dimensions} value={product.dimensions} />
              <InfoRow label={labels.quantity} value={product.quantity} />
            </div>
          </aside>
        </section>

        {description ? (
          <section className="mt-12 max-w-[760px] border-t border-[var(--border)] pt-8">
            <h2 className="font-title text-[26px] font-normal leading-tight text-primary lg:text-[32px]">
              {labels.artworkDescription}
            </h2>
            <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.9] text-secondary">
              {description}
            </p>
          </section>
        ) : null}
      </PageContainer>
    </AppShell>
  );
}

export async function DerivativeProductDetailPage({
  includeLocalePrefix = true,
  locale,
  slug,
}: StoreDetailProps) {
  const productDocument = await client
    .withConfig({ useCdn: false })
    .fetch<DerivativeProduct | null>(
      productBySlugQuery,
      { locale, slug },
      { cache: "no-store" },
    );
  const legacyProduct =
    productDocument?.productType === "derivatives"
      ? null
      : await client
          .withConfig({ useCdn: false })
          .fetch<DerivativeProduct | null>(
            artDerivativeDetailBySlugQuery,
            { locale, slug },
            { cache: "no-store" },
          );
  const derivativeProduct =
    productDocument?.productType === "derivatives" || legacyProduct
      ? null
      : await client
          .withConfig({ useCdn: false })
          .fetch<DerivativeProduct | null>(
            derivativeProductBySlugQuery,
            { locale, slug },
            { cache: "no-store" },
          );
  const product =
    productDocument?.productType === "derivatives"
      ? productDocument
      : legacyProduct || derivativeProduct;

  if (!product) {
    notFound();
  }

  const labels = copy[locale];
  const titleZh = compactText(product.titleZh);
  const titleEn = compactText(product.titleEn);
  const localizedTitle = compactText(product.title) || labels.derivatives;
  const title =
    locale === "en"
      ? titleEn || localizedTitle || titleZh
      : titleZh || localizedTitle || titleEn;
  const secondaryTitle = locale === "en" ? titleZh || "" : titleEn || "";
  const description = compactText(product.description || product.detail);
  const gallery = (
    product.gallery ||
    product.galleryImages ||
    product.images ||
    []
  ).filter(Boolean);
  const mainImage = product.mainImage || product.coverImage || gallery[0];
  const images = [
    mainImage,
    ...gallery.filter((image) => image && image !== mainImage),
  ].filter(Boolean);
  const specification =
    product.specification || product.dimensions || product.size;
  const backHref = `${routePrefix(locale, includeLocalePrefix)}/shop?category=derivatives`;
  const descriptionLabel =
    locale === "zh" ? "\u4ea7\u54c1\u63cf\u8ff0" : "Description";
  const sizeLabel = locale === "zh" ? "\u5c3a\u5bf8" : "Size";

  return (
    <ArtworkDetailLayout
      backHref={backHref}
      backLabel={labels.storeTitle}
      categoryLabel={labels.derivatives}
      description={description}
      descriptionLabel={descriptionLabel}
      images={images}
      locale={locale}
      metaItems={[{ label: sizeLabel, value: specification }]}
      primaryTitle={title}
      secondaryTitle={secondaryTitle}
      videos={
        product.video
          ? [
              {
                videoFile: product.video,
              },
            ]
          : null
      }
    />
  );
}

export function CulturalProductComingSoonPage({
  locale: _locale,
}: {
  locale?: Locale;
} = {}) {
  return (
    <ComingSoonPage pageTitleEn="Cultural Products" pageTitleZh="文创品" />
  );
}

import type {SanityImageSource} from "@sanity/image-url";
import Link from "next/link";
import {notFound} from "next/navigation";
import type {ComponentProps} from "react";

import type {Locale} from "@/config/navigation";
import {client} from "@/sanity/client";
import {urlForImage} from "@/sanity/image";
import {
  artDerivativeDetailBySlugQuery,
  artDerivativeDetailsForCardsQuery,
  artDerivativeDetailSlugsQuery,
  artworkProductBySlugQuery,
  derivativeProductBySlugQuery,
  productBySlugQuery,
  productDetailBySlugQuery,
  productDetailsForCardsQuery,
  productCollectionsQuery,
  productsQuery,
} from "@/sanity/queries";

import {AppShell} from "./AppShell";
import {ArtworkDetailLayout} from "./ArtworkDetailPage";
import {BaseImageCard} from "./BaseImageCard";
import {ComingSoonPage} from "./ComingSoonPage";
import {PageContainer} from "./PageContainer";
import {PageHeader} from "./PageHeader";
import {glassStyle} from "../../styles/glassStyle";

type SanityImage = SanityImageSource | null | undefined;
type StoreCategory = "artworks" | "derivatives" | "cultural";
type ProductCollectionCategory = "artwork" | "derivative" | "cultural";
type ProductSubcategory =
  | "vessel"
  | "wearable"
  | "toy"
  | "ornament"
  | "object"
  | "packaging";

type ProductCollection = {
  _id: string;
  category?: ProductCollectionCategory | null;
  coverImage?: SanityImage;
  description?: string | null;
  derivativeCategory?: ProductSubcategory | null;
  galleryImages?: SanityImage[] | null;
  price?: string | number | null;
  productType?: StoreCategory | null;
  slug?: string | null;
  subcategory?: ProductSubcategory | null;
  title?: string | null;
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
  slug?: string | null;
  title?: string | null;
  titleEn?: string | null;
  titleZh?: string | null;
};

type ProductCardItem = {
  _id: string;
  category?: ProductCollectionCategory | null;
  description?: string | null;
  image?: SanityImage;
  price?: string | number | null;
  slug?: string | null;
  subcategory?: ProductSubcategory | null;
  title?: string | null;
};

type StoreOverviewProps = {
  activeCategory?: StoreCategory;
  includeLocalePrefix?: boolean;
  locale: Locale;
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

const categoryByStoreCategory: Record<StoreCategory, ProductCollectionCategory> = {
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
  {id: "vessel", labelEn: "Vessel", labelZh: "器物"},
  {id: "wearable", labelEn: "Wearable", labelZh: "肖物"},
  {id: "toy", labelEn: "Toy", labelZh: "玩物"},
  {id: "ornament", labelEn: "Ornament", labelZh: "饰物"},
  {id: "object", labelEn: "Object", labelZh: "境物"},
  {id: "packaging", labelEn: "Packaging", labelZh: "包装"},
];

const fallbackProducts: Record<Locale, ProductCollection[]> = {
  zh: [
    {
      _id: "product-collection-artwork-01",
      category: "artwork",
      description: "被子植物",
      price: "¥18000",
      slug: "glass-artwork-study",
      title: "野器栗毛芭目",
    },
    {
      _id: "product-collection-artwork-02",
      category: "artwork",
      description: "玻璃艺术",
      price: "¥12000",
      slug: "transparent-light-study",
      title: "风过青岚",
    },
    {
      _id: "product-collection-artwork-03",
      category: "artwork",
      description: "玻璃艺术",
      price: "¥15000",
      slug: "layered-glass-study",
      title: "层叠之境",
    },
    {
      _id: "product-collection-artwork-04",
      category: "artwork",
      description: "玻璃艺术",
      price: "¥16000",
      slug: "mist-glass-study",
      title: "雾色器形",
    },
    {
      _id: "product-collection-derivative-01",
      category: "derivative",
      description: "器物",
      price: "¥880",
      slug: "glass-vessel-study",
      subcategory: "vessel",
      title: "玻璃器物",
    },
    {
      _id: "product-collection-derivative-02",
      category: "derivative",
      description: "肖物",
      price: "¥680",
      slug: "glass-wearable-study",
      subcategory: "wearable",
      title: "玻璃肖物",
    },
    {
      _id: "product-collection-derivative-03",
      category: "derivative",
      description: "玩物",
      price: "¥580",
      slug: "glass-toy-study",
      subcategory: "toy",
      title: "玻璃玩物",
    },
    {
      _id: "product-collection-derivative-04",
      category: "derivative",
      description: "饰物",
      price: "¥780",
      slug: "glass-ornament-study",
      subcategory: "ornament",
      title: "玻璃饰物",
    },
    {
      _id: "product-collection-cultural-01",
      category: "cultural",
      description: "文创品",
      price: "¥128",
      slug: "cultural-study-01",
      title: "清境文创产品",
    },
    {
      _id: "product-collection-cultural-02",
      category: "cultural",
      description: "文创品",
      price: "¥168",
      slug: "cultural-study-02",
      title: "玻璃花园纪念品",
    },
    {
      _id: "product-collection-cultural-03",
      category: "cultural",
      description: "文创品",
      price: "¥98",
      slug: "cultural-study-03",
      title: "艺术出版物",
    },
    {
      _id: "product-collection-cultural-04",
      category: "cultural",
      description: "文创品",
      price: "¥138",
      slug: "cultural-study-04",
      title: "清境手册",
    },
  ],
  en: [
    {
      _id: "product-collection-artwork-01",
      category: "artwork",
      description: "Artwork",
      price: "¥18000",
      slug: "glass-artwork-study",
      title: "Wild Vessel",
    },
    {
      _id: "product-collection-artwork-02",
      category: "artwork",
      description: "Artwork",
      price: "¥12000",
      slug: "transparent-light-study",
      title: "Wind Over Green Mist",
    },
    {
      _id: "product-collection-artwork-03",
      category: "artwork",
      description: "Artwork",
      price: "¥15000",
      slug: "layered-glass-study",
      title: "Layered Realm",
    },
    {
      _id: "product-collection-artwork-04",
      category: "artwork",
      description: "Artwork",
      price: "¥16000",
      slug: "mist-glass-study",
      title: "Mist Vessel",
    },
    {
      _id: "product-collection-derivative-01",
      category: "derivative",
      description: "Vessel",
      price: "¥880",
      slug: "glass-vessel-study",
      subcategory: "vessel",
      title: "Glass Vessel",
    },
    {
      _id: "product-collection-derivative-02",
      category: "derivative",
      description: "Wearable",
      price: "¥680",
      slug: "glass-wearable-study",
      subcategory: "wearable",
      title: "Glass Wearable",
    },
    {
      _id: "product-collection-derivative-03",
      category: "derivative",
      description: "Toy",
      price: "¥580",
      slug: "glass-toy-study",
      subcategory: "toy",
      title: "Glass Toy",
    },
    {
      _id: "product-collection-derivative-04",
      category: "derivative",
      description: "Ornament",
      price: "¥780",
      slug: "glass-ornament-study",
      subcategory: "ornament",
      title: "Glass Ornament",
    },
    {
      _id: "product-collection-cultural-01",
      category: "cultural",
      description: "Cultural",
      price: "¥128",
      slug: "cultural-study-01",
      title: "Qingjing Cultural Product",
    },
    {
      _id: "product-collection-cultural-02",
      category: "cultural",
      description: "Cultural",
      price: "¥168",
      slug: "cultural-study-02",
      title: "Glass Garden Souvenir",
    },
    {
      _id: "product-collection-cultural-03",
      category: "cultural",
      description: "Cultural",
      price: "¥98",
      slug: "cultural-study-03",
      title: "Art Publication",
    },
    {
      _id: "product-collection-cultural-04",
      category: "cultural",
      description: "Cultural",
      price: "¥138",
      slug: "cultural-study-04",
      title: "Qingjing Booklet",
    },
  ],
};

function compactText(value: string | number | null | undefined) {
  return typeof value === "number" ? String(value) : value?.trim() || "";
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

function routePrefix(locale: Locale, includeLocalePrefix: boolean) {
  return includeLocalePrefix ? `/${locale}` : "";
}

function categoryHref(
  category: StoreCategory,
  locale: Locale,
  includeLocalePrefix: boolean,
  subcategory?: ProductSubcategory | null,
) {
  const params = new URLSearchParams({category: storeCategorySegments[category]});

  if (subcategory) {
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

function isProductSubcategory(value: string | null | undefined): value is ProductSubcategory {
  return derivativeSubcategories.some((item) => item.id === value);
}

function subcategoryLabel(
  subcategory: ProductSubcategory | null | undefined,
  locale: Locale,
) {
  const option = derivativeSubcategories.find((item) => item.id === subcategory);
  return option ? (locale === "zh" ? option.labelZh : option.labelEn) : "";
}

function categoryDisplay(item: ProductCardItem, locale: Locale) {
  if (item.category === "derivative" && item.subcategory) {
    return subcategoryLabel(item.subcategory, locale);
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
  const price = compactText(item.price);
  const number = String(index + 1).padStart(2, "0");

  if (item.category === "derivative") {
    return (
      <DerivativeProductCard
        category={category}
        emptyLabel={labels.emptyImage}
        href={href}
        image={item.image}
        index={number}
        price={price}
        title={title}
      />
    );
  }

  return (
    <BaseImageCard
      emptyLabel={labels.emptyImage}
      href={href}
      image={item.image}
      imageAlt={title}
    >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] leading-none text-[#444] dark:text-white/58">
                {number} ·
              </p>
              {category ? (
                <p className="mt-3 line-clamp-1 text-[12px] leading-none text-[#555] dark:text-white/64">
                  {category}
                </p>
              ) : null}
              <h3 className="mt-2 line-clamp-2 text-[15px] font-medium leading-snug">
                {title}
              </h3>
            </div>
            {price ? (
              <p className="shrink-0 text-[13px] leading-none text-[#333] dark:text-white/78">
                {price}
              </p>
            ) : null}
          </div>
    </BaseImageCard>
  );
}

function DerivativeProductCard({
  category,
  emptyLabel,
  href,
  image,
  index,
  price,
  title,
}: {
  category: string;
  emptyLabel: string;
  href: string | null;
  image: SanityImage;
  index: string;
  price: string;
  title: string;
}) {
  return (
    <BaseImageCard
      emptyLabel={emptyLabel}
      href={href}
      image={image}
      imageAlt={title}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] leading-none text-[#444] dark:text-white/58">
            {index}
          </p>
          {category ? (
            <p className="mt-3 line-clamp-1 text-[12px] leading-none text-[#555] dark:text-white/64">
              {category}
            </p>
          ) : null}
          <h3 className="mt-2 line-clamp-2 text-[15px] font-medium leading-snug">
            {title}
          </h3>
        </div>
        {price ? (
          <p className="shrink-0 text-[13px] leading-none text-[#333] dark:text-white/78">
            {price}
          </p>
        ) : null}
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
  includeLocalePrefix,
  locale,
}: {
  activeCategory: StoreCategory;
  includeLocalePrefix: boolean;
  locale: Locale;
}) {
  const labels = copy[locale];
  const tabs: Array<{id: StoreCategory; label: string}> = [
    {id: "artworks", label: labels.artworks},
    {id: "derivatives", label: labels.derivatives},
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
            href={categoryHref(tab.id, locale, includeLocalePrefix)}
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
  activeSubcategory,
  includeLocalePrefix,
  locale,
}: {
  activeSubcategory?: ProductSubcategory | null;
  includeLocalePrefix: boolean;
  locale: Locale;
}) {
  return (
    <nav className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-muted-token">
      {derivativeSubcategories.map((item) => {
        const isActive = activeSubcategory === item.id;

        return (
          <Link
            className={`relative pb-3 transition ${
              isActive ? "text-primary" : "hover:text-primary"
            }`}
            href={categoryHref("derivatives", locale, includeLocalePrefix, item.id)}
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
  );
}

function mapProduct(item: ProductCollection): ProductCardItem {
  return {
    _id: item._id,
    category:
      item.productType === "artworks"
        ? "artwork"
        : item.productType === "derivatives"
          ? "derivative"
          : item.category,
    description: item.description,
    image: item.coverImage || item.galleryImages?.[0],
    price: item.price,
    slug: item.slug,
    subcategory: item.subcategory || item.derivativeCategory,
    title: item.title,
  };
}

export async function StoreOverview({
  activeCategory = "artworks",
  includeLocalePrefix = true,
  locale,
  subcategory,
}: StoreOverviewProps) {
  const [cmsProducts, productDocuments, artDerivativeDetails, artworkDetailProducts] = await Promise.all([
    client
      .withConfig({useCdn: false})
      .fetch<ProductCollection[]>(
        productCollectionsQuery,
        {locale},
        {cache: "no-store"},
      ),
    client
      .withConfig({useCdn: false})
      .fetch<ProductCollection[]>(
        productsQuery,
        {locale},
        {cache: "no-store"},
      ),
    client
      .withConfig({useCdn: false})
      .fetch<ProductCollection[]>(
        artDerivativeDetailsForCardsQuery,
        {locale},
        {cache: "no-store"},
      ),
    client
      .withConfig({useCdn: false})
      .fetch<ProductCollection[]>(
        productDetailsForCardsQuery,
        {locale},
        {cache: "no-store"},
      ),
  ]);
  const labels = copy[locale];
  const activeSubcategory =
    activeCategory === "derivatives"
      ? isProductSubcategory(subcategory)
        ? subcategory
        : "vessel"
      : null;
  const cmsSource = [
    ...(activeCategory === "artworks" ? artworkDetailProducts : []),
    ...cmsProducts,
    ...productDocuments,
    ...(activeCategory === "derivatives" ? artDerivativeDetails : []),
  ];
  const source = cmsSource.length ? cmsSource : fallbackProducts[locale];
  const activeCollectionCategory = categoryByStoreCategory[activeCategory];
  const items = source
    .filter((item) => {
      if (item.productType) {
        return item.productType === activeCategory;
      }

      return item.category === activeCollectionCategory;
    })
    .filter((item) =>
      activeCategory === "derivatives" && activeSubcategory
        ? item.subcategory === activeSubcategory
        : true,
    )
    .map(mapProduct);
  const isDerivativeView = activeCategory === "derivatives";

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
              includeLocalePrefix={includeLocalePrefix}
              locale={locale}
            />
          </div>

          {activeCategory === "derivatives" ? (
            <DerivativeSubcategoryTabs
              activeSubcategory={activeSubcategory}
              includeLocalePrefix={includeLocalePrefix}
              locale={locale}
            />
          ) : null}
        </header>

        <section className={`mt-9 lg:mt-10 ${isDerivativeView ? "max-w-[1180px]" : "max-w-[1120px]"}`}>
          {items.length ? (
            <div
              className={
                isDerivativeView
                  ? "grid justify-items-start gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                  : "grid justify-items-start gap-6 sm:grid-cols-2 xl:grid-cols-4"
              }
            >
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
      </PageContainer>
    </AppShell>
  );
}

function DetailImage({
  image,
  label,
  priority = false,
  title,
}: {
  image: SanityImage;
  label: string;
  priority?: boolean;
  title: string;
}) {
  const src = imageUrl(image, priority ? 1800 : 900);

  return (
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
  );
}

function InfoRow({label, value}: {label: string; value?: string | number | null}) {
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

function artDerivativeSecondaryTitle(product: ArtDerivativeDetail, locale: Locale) {
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
    .withConfig({useCdn: false})
    .fetch<ArtDerivativeDetail | null>(
      artDerivativeDetailBySlugQuery,
      {locale, slug},
      {cache: "no-store"},
    );

  if (!product) {
    notFound();
  }

  const labels = artDerivativeDetailCopy[locale];
  const title = artDerivativeTitle(product, locale) || labels.emptyTitle;
  const secondaryTitle = artDerivativeSecondaryTitle(product, locale);
  const categoryLabel = compactText(product.category) || labels.categoryFallback;
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
            <p className="detail-meta uppercase">
              {categoryLabel}
            </p>
            <h1 className="zh-title mt-8">
              {title}
            </h1>
            {secondaryTitle ? (
              <p className="en-title mt-3">
                {secondaryTitle}
              </p>
            ) : null}
          </header>

          <section className="mt-5 max-w-[760px]">
            {dimensions ? (
              <p className="detail-meta">
                {dimensions}
              </p>
            ) : null}
            {description ? (
              <p className="mt-9 whitespace-pre-line text-[15px] leading-[1.9] text-secondary">
                {description}
              </p>
            ) : null}
          </section>

          <section className="mt-16 lg:mt-20">
            <ArtDerivativeMainImage
              image={mainImage}
              label={labels.emptyImage}
              title={title}
            />
          </section>
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

function productDetailCategoryLine(product: ProductDetail | ProductDetailRelated) {
  const number = compactText(product.basicInfo?.productNumber);
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
  priority = false,
  title,
}: {
  image: SanityImage;
  label: string;
  priority?: boolean;
  title: string;
}) {
  const src = imageUrl(image, priority ? 1500 : 1100);

  return (
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
  const price = compactText(product.commerce?.price);
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
    .withConfig({useCdn: false})
    .fetch<ProductDetail | null>(
      productDetailBySlugQuery,
      {locale, slug},
      {cache: "no-store"},
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
  const price = compactText(product.commerce?.price);
  const images = productDetailImages(product);
  const relatedProducts = product.relatedProducts?.filter((item) => item.slug) || [];
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
              {images.map((image, index) => (
                <ShopArtworkImage
                  image={image}
                  key={index}
                  label={labels.emptyImage}
                  priority={index === 0}
                  title={`${title} ${index + 1}`}
                />
              ))}
            </div>

            <aside className="lg:sticky lg:top-[88px]">
              <div className="border-b border-[var(--border)] pb-7">
                {categoryLine ? (
                  <p className="detail-meta uppercase">
                    {categoryLine}
                  </p>
                ) : null}
                <h1 className="zh-title mt-7">
                  {title}
                </h1>
                {secondaryTitle ? (
                  <p className="en-title mt-3">
                    {secondaryTitle}
                  </p>
                ) : null}
              </div>

              <div className="border-b border-[var(--border)] py-7">
                {dimensions ? (
                  <p className="detail-meta">
                    {dimensions}
                  </p>
                ) : null}
                {material ? (
                  <div className="mt-8">
                    <p className="detail-meta">
                      {labels.material}
                    </p>
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
    .withConfig({useCdn: false})
    .fetch<ArtworkProduct | null>(
      artworkProductBySlugQuery,
      {locale, slug},
      {cache: "no-store"},
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
          <div>
            <DetailImage
              image={mainImage}
              label={labels.emptyImage}
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
    .withConfig({useCdn: false})
    .fetch<DerivativeProduct | null>(
      productBySlugQuery,
      {locale, slug},
      {cache: "no-store"},
    );
  const legacyProduct = productDocument?.productType === "derivatives" ? null : await client
    .withConfig({useCdn: false})
    .fetch<DerivativeProduct | null>(
      artDerivativeDetailBySlugQuery,
      {locale, slug},
      {cache: "no-store"},
    );
  const derivativeProduct = productDocument?.productType === "derivatives" || legacyProduct ? null : await client
    .withConfig({useCdn: false})
    .fetch<DerivativeProduct | null>(
      derivativeProductBySlugQuery,
      {locale, slug},
      {cache: "no-store"},
    );
  const product = productDocument?.productType === "derivatives" ? productDocument : legacyProduct || derivativeProduct;

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
  const secondaryTitle =
    locale === "en" ? titleZh || "" : titleEn || "";
  const description = compactText(product.description || product.detail);
  const gallery = (product.gallery || product.galleryImages || product.images || []).filter(Boolean);
  const mainImage = product.mainImage || product.coverImage || gallery[0];
  const images = [
    mainImage,
    ...gallery.filter((image) => image && image !== mainImage),
  ].filter(Boolean);
  const specification = product.specification || product.dimensions || product.size;
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
      emptyImageLabel={labels.emptyImage}
      images={images}
      locale={locale}
      metaItems={[
        {label: sizeLabel, value: specification},
      ]}
      primaryTitle={title}
      secondaryTitle={secondaryTitle}
    />
  );
}

export function CulturalProductComingSoonPage({
  locale: _locale,
}: {
  locale?: Locale;
} = {}) {
  return (
    <ComingSoonPage
      pageTitleEn="Cultural Products"
      pageTitleZh="文创品"
    />
  );
}

import type {SanityImageSource} from "@sanity/image-url";
import {NextRequest} from "next/server";

import {
  getNavigationHref,
  navigationGroupLabels,
  navigationItems,
  type Locale,
  type NavigationGroup,
} from "@/config/navigation";
import {client} from "@/sanity/client";
import {urlForImage} from "@/sanity/image";
import {siteSearchContentQuery} from "@/sanity/queries";

export const dynamic = "force-dynamic";

type SearchKind = "page" | "artwork" | "event" | "course" | "product" | "person";

type SearchCandidate = {
  id: string;
  kind: SearchKind;
  title: string;
  titleZh?: string | null;
  titleEn?: string | null;
  description?: string | null;
  href: string;
  image?: SanityImageSource | null;
  primaryFields: Array<string | number | null | undefined>;
  secondaryFields?: Array<string | number | null | undefined>;
  descriptionFields?: Array<unknown>;
};

type SearchResult = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  href: string;
  thumbnailUrl: string | null;
};

type SearchContent = {
  artworks?: Array<Record<string, unknown>>;
  events?: Array<Record<string, unknown>>;
  studyPrograms?: Array<Record<string, unknown>>;
  experienceCourses?: Array<Record<string, unknown>>;
  offlineWorkshops?: Array<Record<string, unknown>>;
  productDetails?: Array<Record<string, unknown>>;
  products?: Array<Record<string, unknown>>;
  derivativeProducts?: Array<Record<string, unknown>>;
  artDerivativeDetails?: Array<Record<string, unknown>>;
  artworkProducts?: Array<Record<string, unknown>>;
  teamMembers?: Array<Record<string, unknown>>;
  artists?: Array<Record<string, unknown>>;
};

const extraPageItems = [
  {
    labelZh: "\u96d5\u5851\u827a\u672f",
    labelEn: "Sculpture Art",
    href: "/art-creation/sculpture-art",
    group: "artCreation" as NavigationGroup,
    keywordsZh: "\u827a\u672f\u521b\u4f5c \u96d5\u5851 \u73bb\u7483",
    keywordsEn: "art creation sculpture glass artwork",
  },
];

const artCategoryLabels: Record<string, {zh: string; en: string}> = {
  "glass-art": {zh: "\u73bb\u7483\u827a\u672f", en: "Glass Art"},
  "installation-art": {zh: "\u88c5\u7f6e\u827a\u672f", en: "Installation Art"},
  "public-art": {zh: "\u516c\u5171\u827a\u672f", en: "Public Art"},
  "sculpture-art": {zh: "\u96d5\u5851\u827a\u672f", en: "Sculpture Art"},
};

const typeLabels: Record<SearchKind, {zh: string; en: string}> = {
  page: {zh: "\u9875\u9762", en: "Page"},
  artwork: {zh: "\u827a\u672f\u4f5c\u54c1", en: "Artwork"},
  event: {zh: "\u6d3b\u52a8", en: "Event"},
  course: {zh: "\u8bfe\u7a0b", en: "Course"},
  product: {zh: "\u5546\u54c1", en: "Product"},
  person: {zh: "\u827a\u672f\u5bb6", en: "Artist"},
};

function compactText(value: unknown): string {
  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return "";
}

function textFrom(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return compactText(value);
  }

  if (Array.isArray(value)) {
    return value.map(textFrom).filter(Boolean).join(" ");
  }

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;

    if (typeof objectValue.text === "string") {
      return objectValue.text;
    }

    if (Array.isArray(objectValue.children)) {
      return textFrom(objectValue.children);
    }
  }

  return "";
}

function normalizeSearchText(value: unknown): string {
  return textFrom(value).toLocaleLowerCase().replace(/\s+/g, "");
}

function getString(item: Record<string, unknown>, key: string) {
  return compactText(item[key]);
}

function getImage(item: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = item[key] as SanityImageSource | null | undefined;

    if (value) {
      return value;
    }
  }

  return null;
}

function getThumbnailUrl(image?: SanityImageSource | null) {
  if (!image) {
    return null;
  }

  try {
    return urlForImage(image).width(96).height(96).fit("crop").auto("format").url();
  } catch {
    return null;
  }
}

function prefixHref(locale: Locale, href: string) {
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

function typeLabel(kind: SearchKind, locale: Locale) {
  const label = typeLabels[kind];
  return locale === "zh" ? label.zh : label.en;
}

function artCategoryLabel(category: string, locale: Locale) {
  const label = artCategoryLabels[category];
  return label ? (locale === "zh" ? label.zh : label.en) : category;
}

function eventTypeLabel(eventType: string, locale: Locale) {
  if (eventType === "open-class") {
    return locale === "zh" ? "\u827a\u672f\u516c\u5f00\u8bfe" : "Art Open Class";
  }

  if (eventType === "activity") {
    return locale === "zh" ? "\u827a\u672f\u6d3b\u52a8" : "Art Activity";
  }

  return locale === "zh" ? "\u7ebf\u4e0b\u4f53\u9a8c" : "Offline Experience";
}

function productTypeFor(item: Record<string, unknown>) {
  const productType = getString(item, "productType");

  if (["derivatives", "art-derivatives", "art-merchandise"].includes(productType)) {
    return "derivatives";
  }

  if (["artworks", "available-artworks"].includes(productType)) {
    return "artworks";
  }

  return productType;
}

function productHref(item: Record<string, unknown>, locale: Locale) {
  const slug = getString(item, "slug");

  if (!slug) {
    return null;
  }

  return productTypeFor(item) === "derivatives"
    ? `/${locale}/shop/derivatives/${slug}`
    : `/${locale}/shop/artworks/${slug}`;
}

function studyHref(item: Record<string, unknown>, locale: Locale) {
  const slug = getString(item, "slug");

  if (!slug) {
    return null;
  }

  return getString(item, "programType") === "international-study"
    ? `/${locale}/study/international-study/${slug}`
    : `/${locale}/study/masterclass/${slug}`;
}

function eventHref(item: Record<string, unknown>, locale: Locale) {
  const eventType = getString(item, "eventType");

  if (eventType === "open-class") {
    return `/${locale}/events/open-class`;
  }

  if (eventType === "activity") {
    return `/${locale}/events/activity`;
  }

  const slug = getString(item, "slug");
  return slug
    ? `/${locale}/events/offline-experience/${slug}`
    : `/${locale}/events/offline-experience`;
}

function pageCandidates(locale: Locale): SearchCandidate[] {
  const navPages = navigationItems.map((item) => {
    const groupLabel = navigationGroupLabels[item.group];
    const title = locale === "zh" ? item.labelZh : item.labelEn;
    const group = locale === "zh" ? groupLabel.labelZh : groupLabel.labelEn;

    return {
      id: `page:${item.href}`,
      kind: "page" as SearchKind,
      title,
      titleZh: item.labelZh,
      titleEn: item.labelEn,
      description: group,
      href: getNavigationHref(item, locale),
      primaryFields: [item.labelZh, item.labelEn],
      secondaryFields: [groupLabel.labelZh, groupLabel.labelEn, item.group],
    };
  });

  const extraPages = extraPageItems.map((item) => {
    const groupLabel = navigationGroupLabels[item.group];

    return {
      id: `page:${item.href}`,
      kind: "page" as SearchKind,
      title: locale === "zh" ? item.labelZh : item.labelEn,
      titleZh: item.labelZh,
      titleEn: item.labelEn,
      description: locale === "zh" ? groupLabel.labelZh : groupLabel.labelEn,
      href: prefixHref(locale, item.href),
      primaryFields: [item.labelZh, item.labelEn],
      secondaryFields: [
        groupLabel.labelZh,
        groupLabel.labelEn,
        item.keywordsZh,
        item.keywordsEn,
      ],
    };
  });

  return [...navPages, ...extraPages];
}

function candidatesFromContent(data: SearchContent, locale: Locale) {
  const candidates: SearchCandidate[] = [...pageCandidates(locale)];

  (data.artworks || []).forEach((item) => {
    const category = getString(item, "category");
    const slug = getString(item, "slug");

    if (!slug || !category) {
      return;
    }

    candidates.push({
      id: `artwork:${getString(item, "_id")}`,
      kind: "artwork",
      title: getString(item, "title"),
      titleZh: getString(item, "titleZh"),
      titleEn: getString(item, "titleEn"),
      description: [getString(item, "artist"), getString(item, "year")]
        .filter(Boolean)
        .join(" · ") || artCategoryLabel(category, locale),
      href: `/${locale}/art-projects/${category}/${slug}`,
      image: getImage(item, "coverImage"),
      primaryFields: [item.titleZh as string, item.titleEn as string],
      secondaryFields: [
        item.artist as string,
        item.year as string,
        category,
        artCategoryLabel(category, "zh"),
        artCategoryLabel(category, "en"),
      ],
      descriptionFields: [item.descriptionZh, item.descriptionEn, item.description],
    });
  });

  (data.events || []).forEach((item) => {
    const eventType = getString(item, "eventType");

    candidates.push({
      id: `event:${getString(item, "_id")}`,
      kind: "event",
      title: getString(item, "title"),
      titleZh: getString(item, "titleZh"),
      titleEn: getString(item, "titleEn"),
      description: eventTypeLabel(eventType, locale),
      href: eventHref(item, locale),
      image: getImage(item, "coverImage", "posterImage"),
      primaryFields: [item.titleZh as string, item.titleEn as string],
      secondaryFields: [
        eventType,
        eventTypeLabel(eventType, "zh"),
        eventTypeLabel(eventType, "en"),
        item.facultyZh as string,
        item.facultyEn as string,
      ],
      descriptionFields: [
        item.courseIntroZh,
        item.courseIntroEn,
        item.contentZh,
        item.contentEn,
      ],
    });
  });

  (data.studyPrograms || []).forEach((item) => {
    const href = studyHref(item, locale);

    if (!href) {
      return;
    }

    candidates.push({
      id: `study:${getString(item, "_id")}`,
      kind: "course",
      title: getString(item, "title"),
      titleZh: getString(item, "titleZh"),
      titleEn: getString(item, "titleEn"),
      description: getString(item, "academicHost") || getString(item, "teacherTeam"),
      href,
      image: getImage(item, "heroImage", "coverImage"),
      primaryFields: [item.titleZh as string, item.titleEn as string],
      secondaryFields: [
        item.programType as string,
        item.academicHostZh as string,
        item.academicHostEn as string,
        item.teacherTeamZh as string,
        item.teacherTeamEn as string,
      ],
      descriptionFields: [item.courseIntroZh, item.courseIntroEn],
    });
  });

  (data.experienceCourses || []).forEach((item) => {
    const slug = getString(item, "slug");

    if (!slug) {
      return;
    }

    candidates.push({
      id: `experience:${getString(item, "_id")}`,
      kind: "course",
      title: getString(item, "title"),
      titleZh: getString(item, "titleZh"),
      titleEn: getString(item, "titleEn"),
      description: getString(item, "teacher") || getString(item, "academicSupport"),
      href: `/${locale}/events/offline-experience/${slug}`,
      image: getImage(item, "heroImage", "coverImage"),
      primaryFields: [item.titleZh as string, item.titleEn as string],
      secondaryFields: [
        item.teacher as string,
        item.academicSupport as string,
        item.category as string,
      ],
      descriptionFields: [item.descriptionZh, item.descriptionEn],
    });
  });

  (data.offlineWorkshops || []).forEach((item) => {
    const slug = getString(item, "slug");

    if (!slug) {
      return;
    }

    candidates.push({
      id: `workshop:${getString(item, "_id")}`,
      kind: "course",
      title: getString(item, "title"),
      titleZh: getString(item, "titleZh"),
      titleEn: getString(item, "titleEn"),
      description: getString(item, "tag") || getString(item, "category"),
      href: `/${locale}/events/offline-workshop/${slug}`,
      image: getImage(item, "coverImage"),
      primaryFields: [item.titleZh as string, item.titleEn as string],
      secondaryFields: [
        item.tagZh as string,
        item.tagEn as string,
        item.category as string,
      ],
      descriptionFields: [item.shortDescriptionZh, item.shortDescriptionEn],
    });
  });

  [
    ...(data.productDetails || []),
    ...(data.products || []),
    ...(data.derivativeProducts || []),
    ...(data.artDerivativeDetails || []),
    ...(data.artworkProducts || []),
  ].forEach((item) => {
    const href = productHref(item, locale);

    if (!href) {
      return;
    }

    const productNumber = getString(item, "productNumber");
    const category =
      getString(item, "category") ||
      getString(item, "artworkCategory") ||
      getString(item, "derivativeCategory") ||
      getString(item, "subcategory");
    const description = [
      productNumber
        ? `${locale === "zh" ? "\u7f16\u53f7" : "No."} ${productNumber}`
        : "",
      category,
    ]
      .filter(Boolean)
      .join(" · ");

    candidates.push({
      id: `product:${getString(item, "_id")}`,
      kind: "product",
      title: getString(item, "title"),
      titleZh: getString(item, "titleZh"),
      titleEn: getString(item, "titleEn"),
      description,
      href,
      image: getImage(item, "coverImage"),
      primaryFields: [item.titleZh as string, item.titleEn as string],
      secondaryFields: [
        productNumber,
        category,
        item.artworkCategory as string,
        item.derivativeCategory as string,
        item.subcategory as string,
      ],
      descriptionFields: [item.descriptionZh, item.descriptionEn, item.description],
    });
  });

  (data.teamMembers || []).forEach((item) => {
    const slug = getString(item, "slug");

    if (!slug) {
      return;
    }

    candidates.push({
      id: `team:${getString(item, "_id")}`,
      kind: "person",
      title: getString(item, "name"),
      titleZh: getString(item, "nameZh"),
      titleEn: getString(item, "nameEn"),
      description: getString(item, "role"),
      href: `/${locale}/about/team/${slug}`,
      image: getImage(item, "portrait"),
      primaryFields: [item.nameZh as string, item.nameEn as string],
      secondaryFields: [item.roleZh as string, item.roleEn as string],
      descriptionFields: [item.shortBioZh, item.shortBioEn, item.bioZh, item.bioEn],
    });
  });

  (data.artists || []).forEach((item) => {
    const slug = getString(item, "slug");

    if (!slug) {
      return;
    }

    candidates.push({
      id: `artist:${getString(item, "_id")}`,
      kind: "person",
      title: getString(item, "name"),
      titleZh: getString(item, "nameZh"),
      titleEn: getString(item, "nameEn"),
      description: getString(item, "title"),
      href: `/${locale}/about/artists/${slug}`,
      image: getImage(item, "portrait"),
      primaryFields: [item.nameZh as string, item.nameEn as string],
      secondaryFields: [item.titleZh as string, item.titleEn as string],
      descriptionFields: [item.bioZh, item.bioEn],
    });
  });

  return candidates;
}

function scoreCandidate(candidate: SearchCandidate, query: string) {
  const normalizedQuery = normalizeSearchText(query);
  const titleValues = [
    candidate.title,
    candidate.titleZh,
    candidate.titleEn,
  ].filter(Boolean);
  const primaryValues = [
    ...titleValues,
    ...candidate.primaryFields,
  ].filter(Boolean);
  const secondaryValues = candidate.secondaryFields?.filter(Boolean) || [];
  const descriptionValues = candidate.descriptionFields?.filter(Boolean) || [];
  let score = 0;

  for (const value of titleValues) {
    const text = normalizeSearchText(value);

    if (text === normalizedQuery) {
      score = Math.max(score, 1000);
    } else if (text.includes(normalizedQuery)) {
      score = Math.max(score, 760);
    }
  }

  for (const value of primaryValues) {
    const text = normalizeSearchText(value);

    if (text === normalizedQuery) {
      score = Math.max(score, 880);
    } else if (text.includes(normalizedQuery)) {
      score = Math.max(score, 640);
    }
  }

  for (const value of secondaryValues) {
    const text = normalizeSearchText(value);

    if (text === normalizedQuery) {
      score = Math.max(score, 560);
    } else if (text.includes(normalizedQuery)) {
      score = Math.max(score, 420);
    }
  }

  for (const value of descriptionValues) {
    if (normalizeSearchText(value).includes(normalizedQuery)) {
      score = Math.max(score, 180);
    }
  }

  return score;
}

function toResult(candidate: SearchCandidate, locale: Locale): SearchResult {
  return {
    id: candidate.id,
    type: typeLabel(candidate.kind, locale),
    title: candidate.title || (locale === "zh" ? "\u672a\u547d\u540d" : "Untitled"),
    description: candidate.description || null,
    href: candidate.href,
    thumbnailUrl: getThumbnailUrl(candidate.image),
  };
}

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const query = compactText(searchParams.get("q")).slice(0, 80);
  const locale = searchParams.get("locale") === "en" ? "en" : "zh";

  if (!query) {
    return Response.json({results: []}, {headers: {"Cache-Control": "no-store"}});
  }

  const data = await client
    .withConfig({useCdn: false})
    .fetch<SearchContent>(
      siteSearchContentQuery,
      {locale},
      {cache: "no-store"},
    );
  const seen = new Set<string>();
  const results = candidatesFromContent(data, locale)
    .map((candidate) => ({
      candidate,
      score: scoreCandidate(candidate, query),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title))
    .filter(({candidate}) => {
      if (seen.has(candidate.href)) {
        return false;
      }

      seen.add(candidate.href);
      return true;
    })
    .slice(0, 12)
    .map(({candidate}) => toResult(candidate, locale));

  return Response.json(
    {results},
    {headers: {"Cache-Control": "no-store"}},
  );
}

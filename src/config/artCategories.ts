import type {Locale} from "./navigation";

export type ArtCategorySlug =
  | "sculpture"
  | "installation-art"
  | "public-art";

export type ArtCategoryTitle = {
  titleEn: string;
  titleZh: string;
};

export type ArtCategoryTitleSettings = {
  _id?: string | null;
  categoryType?: string | null;
  titleEn?: string | null;
  titleZh?: string | null;
};

export type ArtCategoryTitleMap = Partial<
  Record<ArtCategorySlug, ArtCategoryTitleSettings>
>;

export const artCategorySlugs: ArtCategorySlug[] = [
  "sculpture",
  "installation-art",
  "public-art",
];

export const artCategorySettingsIds: Record<ArtCategorySlug, string> = {
  sculpture: "artCategory-sculpture",
  "installation-art": "artCategory-installation-art",
  "public-art": "artCategory-public-art",
};

export const artCategoryFallbacks: Record<ArtCategorySlug, ArtCategoryTitle> = {
  sculpture: {
    titleEn: "GLASS EASEL ART",
    titleZh: "玻璃架上艺术",
  },
  "installation-art": {
    titleEn: "GLASS INSTALLATION ART",
    titleZh: "玻璃装置艺术",
  },
  "public-art": {
    titleEn: "GLASS PUBLIC ART",
    titleZh: "玻璃公共艺术",
  },
};

export function artCategoryFallbackLabel(category: ArtCategorySlug) {
  const fallback = artCategoryFallbacks[category];

  return `${fallback.titleZh} / ${fallback.titleEn}`;
}

export function compactArtCategoryTitle(value: string | null | undefined) {
  return value?.trim() || "";
}

export function isArtCategorySlug(value: string): value is ArtCategorySlug {
  return artCategorySlugs.includes(value as ArtCategorySlug);
}

function isArtCategoryTitleSettings(
  settings: ArtCategoryTitleSettings | ArtCategoryTitleMap,
): settings is ArtCategoryTitleSettings {
  return Object.prototype.hasOwnProperty.call(settings, "categoryType");
}

export function normalizeArtCategorySlug(
  value: string | null | undefined,
): ArtCategorySlug | null {
  if (!value) {
    return null;
  }

  if (value === "glass-art" || value === "sculpture-art") {
    return "sculpture";
  }

  return isArtCategorySlug(value) ? value : null;
}

export function resolveArtCategorySettingsMap(
  settings:
    | ArtCategoryTitleSettings
    | ArtCategoryTitleSettings[]
    | ArtCategoryTitleMap
    | null
    | undefined,
): ArtCategoryTitleMap {
  if (!settings) {
    return {};
  }

  if (Array.isArray(settings)) {
    return settings.reduce<ArtCategoryTitleMap>((acc, item) => {
      const categoryType = compactArtCategoryTitle(item.categoryType || "");

      if (isArtCategorySlug(categoryType) && !acc[categoryType]) {
        acc[categoryType] = item;
      }

      return acc;
    }, {});
  }

  if (isArtCategoryTitleSettings(settings)) {
    const categoryType = compactArtCategoryTitle(settings.categoryType || "");

    return isArtCategorySlug(categoryType) ? {[categoryType]: settings} : {};
  }

  return settings;
}

function resolveArtCategorySettings(
  category: ArtCategorySlug,
  settings?: ArtCategoryTitleSettings | ArtCategoryTitleMap | null,
) {
  if (settings && isArtCategoryTitleSettings(settings)) {
    return settings;
  }

  const settingsMap = resolveArtCategorySettingsMap(settings);

  return settingsMap[category];
}

export function resolveArtCategoryTitle(
  category: ArtCategorySlug,
  locale: Locale,
  settings?: ArtCategoryTitleSettings | ArtCategoryTitleMap | null,
) {
  const item = resolveArtCategorySettings(category, settings);
  const fallback = artCategoryFallbacks[category];
  const titleZh = compactArtCategoryTitle(item?.titleZh) || fallback.titleZh;
  const titleEn = compactArtCategoryTitle(item?.titleEn) || fallback.titleEn;

  return locale === "en" ? titleEn : titleZh;
}

export function resolveArtCategoryPageTitles(
  category: ArtCategorySlug,
  locale: Locale,
  settings?: ArtCategoryTitleSettings | ArtCategoryTitleMap | null,
) {
  const item = resolveArtCategorySettings(category, settings);
  const fallback = artCategoryFallbacks[category];
  const titleZh = compactArtCategoryTitle(item?.titleZh) || fallback.titleZh;
  const titleEn = compactArtCategoryTitle(item?.titleEn) || fallback.titleEn;

  return {
    eyebrow: locale === "zh" ? titleEn : null,
    title: locale === "en" ? titleEn : titleZh,
  };
}

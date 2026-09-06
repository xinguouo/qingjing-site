import type { Locale } from "./navigation";

export type PageTitleKey = "advancedStudy" | "offlineExperience";

export type PageTitleSetting = {
  pageTitleEn?: string | null;
  pageTitleZh?: string | null;
};

export type PageTitleMap = Partial<Record<PageTitleKey, PageTitleSetting>>;

export const pageTitleFallbacks: Record<
  PageTitleKey,
  { pageTitleEn: string; pageTitleZh: string }
> = {
  advancedStudy: {
    pageTitleEn: "Advanced Study",
    pageTitleZh: "\u9ad8\u7ea7\u7814\u5b66",
  },
  offlineExperience: {
    pageTitleEn: "Offline Experience",
    pageTitleZh: "\u7ebf\u4e0b\u4f53\u9a8c",
  },
};

function compactText(value: string | null | undefined) {
  return value?.trim() || "";
}

export function resolvePageTitle(
  key: PageTitleKey,
  locale: Locale,
  titles?: PageTitleMap | null,
) {
  const setting = titles?.[key];
  const fallback = pageTitleFallbacks[key];

  return (
    compactText(locale === "zh" ? setting?.pageTitleZh : setting?.pageTitleEn) ||
    compactText(locale === "zh" ? fallback.pageTitleZh : fallback.pageTitleEn)
  );
}

export function backToPageLabel(
  key: PageTitleKey,
  locale: Locale,
  titles?: PageTitleMap | null,
) {
  const title = resolvePageTitle(key, locale, titles);

  return locale === "zh" ? `\u8fd4\u56de${title}` : `Back to ${title}`;
}

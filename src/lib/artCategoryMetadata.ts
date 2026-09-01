import type {Metadata} from "next";

import {
  artCategorySettingsIds,
  resolveArtCategoryTitle,
  type ArtCategorySlug,
  type ArtCategoryTitleSettings,
} from "@/config/artCategories";
import type {Locale} from "@/config/navigation";
import {client} from "@/sanity/client";
import {artCategoryPageSettingsByTypeQuery} from "@/sanity/queries";

export async function generateArtCategoryMetadata(
  category: ArtCategorySlug,
  locale: Locale,
): Promise<Metadata> {
  const settings = await client
    .fetch<ArtCategoryTitleSettings | null>(
      artCategoryPageSettingsByTypeQuery,
      {
        locale,
        categorySettingsId: artCategorySettingsIds[category],
        categoryType: category,
      },
      {cache: "no-store"},
    )
    .catch(() => null);
  const title = resolveArtCategoryTitle(category, locale, settings);
  const siteName = locale === "zh" ? "清镜玻璃花园" : "Qingjing Glass Garden";

  return {
    title: `${title} | ${siteName}`,
  };
}

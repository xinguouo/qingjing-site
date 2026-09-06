import type { ReactNode } from "react";

import type {
  ArtCategoryTitleMap,
  ArtCategoryTitleSettings,
} from "@/config/artCategories";
import type { Locale } from "@/config/navigation";
import type { PageTitleMap } from "@/config/pageTitles";
import { client } from "@/sanity/client";
import { pageTitlesQuery, sidebarLogoQuery } from "@/sanity/queries";

import { AppShellClient } from "./AppShellClient";
import type { SidebarLogoImages } from "./Logo";

type AppShellProps = {
  artCategorySettings?:
    | ArtCategoryTitleSettings
    | ArtCategoryTitleSettings[]
    | ArtCategoryTitleMap
    | null;
  children: ReactNode;
  initialLogoImages?: SidebarLogoImages | null;
  initialPageTitles?: PageTitleMap | null;
  locale: Locale;
};

async function getGlobalLogoImages() {
  try {
    return await client
      .withConfig({ useCdn: false })
      .fetch<SidebarLogoImages | null>(
        sidebarLogoQuery,
        {},
        { next: { revalidate: 60 } },
      );
  } catch (error) {
    console.error("Failed to fetch global sidebar logo", error);
    return null;
  }
}

async function getGlobalPageTitles() {
  try {
    return await client
      .withConfig({ useCdn: false })
      .fetch<PageTitleMap | null>(
        pageTitlesQuery,
        {},
        { next: { revalidate: 60 } },
      );
  } catch (error) {
    console.error("Failed to fetch global page titles", error);
    return null;
  }
}

export async function AppShell({
  artCategorySettings,
  children,
  initialLogoImages,
  initialPageTitles,
  locale,
}: AppShellProps) {
  const [globalLogoImages, globalPageTitles] = await Promise.all([
    getGlobalLogoImages(),
    getGlobalPageTitles(),
  ]);

  return (
    <AppShellClient
      artCategorySettings={artCategorySettings}
      initialLogoImages={globalLogoImages || initialLogoImages}
      initialPageTitles={globalPageTitles || initialPageTitles}
      locale={locale}
    >
      {children}
    </AppShellClient>
  );
}

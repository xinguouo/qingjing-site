"use client";

import { useEffect, useState, type ReactNode } from "react";

import type {ArtCategoryTitleMap, ArtCategoryTitleSettings} from "@/config/artCategories";
import type { Locale } from "@/config/navigation";
import type { PageTitleMap } from "@/config/pageTitles";

import { DesktopSidebar } from "./DesktopSidebar";
import { FloatingThemeControl } from "./FloatingThemeControl";
import type { SidebarLogoImages } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { TopBar } from "./TopBar";
import {useArtCategorySettings} from "./useArtCategorySettings";

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

export function AppShell({
  artCategorySettings,
  children,
  initialLogoImages,
  initialPageTitles,
  locale,
}: AppShellProps) {
  const resolvedArtCategorySettings =
    useArtCategorySettings(artCategorySettings);
  const [logoImages, setLogoImages] = useState<
    SidebarLogoImages | null | undefined
  >(initialLogoImages);
  const [pageTitles, setPageTitles] = useState<PageTitleMap | null | undefined>(
    initialPageTitles,
  );

  useEffect(() => {
    let active = true;

    fetch("/api/sidebar-logo", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : undefined))
      .then((data: SidebarLogoImages | null) => {
        if (active && data !== undefined) {
          setLogoImages(data);
        }
      })
      .catch(() => {
        if (active && initialLogoImages !== undefined) {
          setLogoImages(initialLogoImages);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetch("/api/page-titles", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : undefined))
      .then((data: PageTitleMap | null) => {
        if (active && data !== undefined) {
          setPageTitles(data);
        }
      })
      .catch(() => {
        if (active && initialPageTitles !== undefined) {
          setPageTitles(initialPageTitles);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app-shell min-h-screen overflow-x-hidden">
      <MobileNavigation
        artCategorySettings={resolvedArtCategorySettings}
        locale={locale}
        logoImages={logoImages}
        pageTitles={pageTitles}
      />
      <DesktopSidebar
        artCategorySettings={resolvedArtCategorySettings}
        locale={locale}
        logoImages={logoImages}
        pageTitles={pageTitles}
      />
      <div className="min-h-screen min-w-0 lg:ml-[232px]">
        <TopBar
          artCategorySettings={resolvedArtCategorySettings}
          locale={locale}
          pageTitles={pageTitles}
        />
        <main className="min-w-0 w-full max-w-full">{children}</main>
      </div>
      <FloatingThemeControl locale={locale} />
    </div>
  );
}

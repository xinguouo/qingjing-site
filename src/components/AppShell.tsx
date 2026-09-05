"use client";

import { useEffect, useState, type ReactNode } from "react";

import type {ArtCategoryTitleMap, ArtCategoryTitleSettings} from "@/config/artCategories";
import type { Locale } from "@/config/navigation";

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
  locale: Locale;
};

export function AppShell({
  artCategorySettings,
  children,
  initialLogoImages,
  locale,
}: AppShellProps) {
  const resolvedArtCategorySettings =
    useArtCategorySettings(artCategorySettings);
  const [logoImages, setLogoImages] = useState<
    SidebarLogoImages | null | undefined
  >(initialLogoImages);

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

  return (
    <div className="app-shell min-h-screen overflow-x-hidden">
      <MobileNavigation
        artCategorySettings={resolvedArtCategorySettings}
        locale={locale}
        logoImages={logoImages}
      />
      <DesktopSidebar
        artCategorySettings={resolvedArtCategorySettings}
        locale={locale}
        logoImages={logoImages}
      />
      <div className="min-h-screen min-w-0 lg:ml-[232px]">
        <TopBar
          artCategorySettings={resolvedArtCategorySettings}
          locale={locale}
        />
        <main className="min-w-0 w-full max-w-full">{children}</main>
      </div>
      <FloatingThemeControl locale={locale} />
    </div>
  );
}

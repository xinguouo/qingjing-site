"use client";

import type { ReactNode } from "react";

import type {ArtCategoryTitleMap, ArtCategoryTitleSettings} from "@/config/artCategories";
import type { Locale } from "@/config/navigation";

import { DesktopSidebar } from "./DesktopSidebar";
import { FloatingThemeControl } from "./FloatingThemeControl";
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
  locale: Locale;
};

export function AppShell({ artCategorySettings, children, locale }: AppShellProps) {
  const resolvedArtCategorySettings =
    useArtCategorySettings(artCategorySettings);

  return (
    <div className="app-shell min-h-screen overflow-x-hidden">
      <MobileNavigation
        artCategorySettings={resolvedArtCategorySettings}
        locale={locale}
      />
      <DesktopSidebar
        artCategorySettings={resolvedArtCategorySettings}
        locale={locale}
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

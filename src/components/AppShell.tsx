"use client";

import type { SanityImageSource } from "@sanity/image-url";
import { useEffect, useState, type ReactNode } from "react";

import type { Locale } from "@/config/navigation";
import { client } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";

import { DesktopSidebar } from "./DesktopSidebar";
import { FloatingThemeControl } from "./FloatingThemeControl";
import { MobileNavigation } from "./MobileNavigation";
import { TopBar } from "./TopBar";

type AppShellProps = {
  children: ReactNode;
  locale: Locale;
};

type AppShellSiteSettings = {
  logo?: SanityImageSource | null;
  siteName?: string | null;
};

export function AppShell({ children, locale }: AppShellProps) {
  const [siteSettings, setSiteSettings] =
    useState<AppShellSiteSettings | null>(null);

  useEffect(() => {
    let isMounted = true;

    client
      .withConfig({ useCdn: false })
      .fetch<AppShellSiteSettings | null>(
        siteSettingsQuery,
        { locale },
        { cache: "no-store" },
      )
      .then((settings) => {
        if (isMounted) {
          setSiteSettings(settings);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSiteSettings(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [locale]);

  return (
    <div className="app-shell min-h-screen overflow-x-hidden">
      <MobileNavigation
        locale={locale}
        logo={siteSettings?.logo}
        siteName={siteSettings?.siteName}
      />
      <DesktopSidebar
        locale={locale}
        logo={siteSettings?.logo}
        siteName={siteSettings?.siteName}
      />
      <div className="min-h-screen min-w-0 lg:ml-[232px]">
        <TopBar locale={locale} />
        <main className="min-w-0 w-full max-w-full">{children}</main>
      </div>
      <FloatingThemeControl locale={locale} />
    </div>
  );
}

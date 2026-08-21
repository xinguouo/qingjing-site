"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  isNavigationItemActive,
  navigationItems,
  type Locale,
} from "@/config/navigation";

import { ThemeToggle } from "./ThemeToggle";
import { SiteSearch } from "./SiteSearch";

type TopBarProps = {
  locale: Locale;
};

function getCurrentPageTitle(pathname: string, locale: Locale) {
  if (/^\/(zh|en)\/about\/(artists|team)\/[^/]+/.test(pathname)) {
    return locale === "zh" ? "\u56e2\u961f\u6210\u5458\u8be6\u60c5" : "Team Member Detail";
  }

  const activeItem = navigationItems.find((item) =>
    isNavigationItemActive(item, pathname),
  );

  if (activeItem) {
    return locale === "zh" ? activeItem.labelZh : activeItem.labelEn;
  }

  return locale === "zh" ? "\u9996\u9875" : "Home";
}

function getLanguageHref(pathname: string, locale: Locale) {
  const targetLocale = locale === "zh" ? "en" : "zh";

  if (pathname === "/zh" || pathname === "/en" || pathname === "/") {
    return `/${targetLocale}`;
  }

  if (pathname.startsWith("/zh/") || pathname.startsWith("/en/")) {
    return pathname.replace(/^\/(zh|en)/, `/${targetLocale}`);
  }

  return `/${targetLocale}${pathname}`;
}

export function TopBar({ locale }: TopBarProps) {
  const pathname = usePathname();
  const title = getCurrentPageTitle(pathname, locale);
  const languageHref = getLanguageHref(pathname, locale);

  return (
    <header className="topbar-shell relative z-[60] hidden h-[62px] items-center justify-between overflow-visible border-b px-6 lg:flex">
      <p className="text-sm text-muted-token">{title}</p>
      <SiteSearch locale={locale} />
      <div className="flex items-center gap-2">
        <Link
          className="glass-button flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-[11px] transition"
          href={languageHref}
        >
          {locale === "zh" ? "\u4e2d" : "EN"}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}

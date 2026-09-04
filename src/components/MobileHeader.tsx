"use client";

import type { SanityImageSource } from "@sanity/image-url";
import type { Locale } from "@/config/navigation";

import { Logo, type SidebarLogoImages } from "./Logo";
import { SiteSearch } from "./SiteSearch";

type MobileHeaderProps = {
  locale: Locale;
  logo?: SanityImageSource | null;
  logoImages?: SidebarLogoImages | null;
  onMenuClick: () => void;
  siteName?: string | null;
};

const labels = {
  menuZh: "\u83dc\u5355",
};

export function MobileHeader({
  locale,
  logo,
  logoImages,
  onMenuClick,
  siteName,
}: MobileHeaderProps) {
  return (
    <header className="topbar-shell sticky top-0 z-[60] flex h-16 w-full items-center justify-between gap-3 overflow-visible border-b px-5 lg:hidden">
      <Logo
        className="shrink min-w-0"
        image={logo}
        images={logoImages}
        locale={locale}
        siteName={siteName}
        variant="mobile"
      />
      <SiteSearch
        controlClassName="glass-control flex h-10 min-w-0 items-center rounded-full px-3 text-xs text-muted-token"
        locale={locale}
        variant="mobile"
      />
      <button
        className="glass-button flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full px-4 text-sm font-medium"
        onClick={onMenuClick}
        type="button"
      >
        {locale === "zh" ? labels.menuZh : "Menu"}
      </button>
    </header>
  );
}

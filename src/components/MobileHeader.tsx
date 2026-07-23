"use client";

import type { SanityImageSource } from "@sanity/image-url";
import type { Locale } from "@/config/navigation";

import { Logo } from "./Logo";

type MobileHeaderProps = {
  locale: Locale;
  logo?: SanityImageSource | null;
  onMenuClick: () => void;
  siteName?: string | null;
};

const labels = {
  menuZh: "\u83dc\u5355",
};

export function MobileHeader({
  locale,
  logo,
  onMenuClick,
  siteName,
}: MobileHeaderProps) {
  return (
    <header className="topbar-shell sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b px-5 lg:hidden">
      <Logo image={logo} locale={locale} siteName={siteName} variant="mobile" />
      <button
        className="glass-button flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-medium"
        onClick={onMenuClick}
        type="button"
      >
        {locale === "zh" ? labels.menuZh : "Menu"}
      </button>
    </header>
  );
}

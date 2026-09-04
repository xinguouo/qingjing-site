"use client";

import type { SanityImageSource } from "@sanity/image-url";
import { useState } from "react";

import type {ArtCategoryTitleMap} from "@/config/artCategories";
import type { Locale } from "@/config/navigation";

import type { SidebarLogoImages } from "./Logo";
import { MobileDrawer } from "./MobileDrawer";
import { MobileHeader } from "./MobileHeader";

type MobileNavigationProps = {
  artCategorySettings?: ArtCategoryTitleMap;
  locale: Locale;
  logo?: SanityImageSource | null;
  logoImages?: SidebarLogoImages | null;
  siteName?: string | null;
};

export function MobileNavigation({
  artCategorySettings,
  locale,
  logo,
  logoImages,
  siteName,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MobileHeader
        locale={locale}
        logo={logo}
        logoImages={logoImages}
        onMenuClick={() => setIsOpen(true)}
        siteName={siteName}
      />
      <MobileDrawer
        artCategorySettings={artCategorySettings}
        isOpen={isOpen}
        locale={locale}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

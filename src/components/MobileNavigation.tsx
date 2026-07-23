"use client";

import type { SanityImageSource } from "@sanity/image-url";
import { useState } from "react";

import type { Locale } from "@/config/navigation";

import { MobileDrawer } from "./MobileDrawer";
import { MobileHeader } from "./MobileHeader";

type MobileNavigationProps = {
  locale: Locale;
  logo?: SanityImageSource | null;
  siteName?: string | null;
};

export function MobileNavigation({
  locale,
  logo,
  siteName,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MobileHeader
        locale={locale}
        logo={logo}
        onMenuClick={() => setIsOpen(true)}
        siteName={siteName}
      />
      <MobileDrawer
        isOpen={isOpen}
        locale={locale}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

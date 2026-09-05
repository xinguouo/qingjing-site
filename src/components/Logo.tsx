"use client";

import type { SanityImageSource } from "@sanity/image-url";
import Link from "next/link";
import { useMemo } from "react";

import type { Locale } from "@/config/navigation";
import { urlForImage } from "@/sanity/image";
import { useTheme } from "./ThemeProvider";

type LogoProps = {
  className?: string;
  image?: SanityImageSource | null;
  images?: SidebarLogoImages | null;
  locale: Locale;
  siteName?: string | null;
  variant?: "desktop" | "mobile";
};

export type SidebarLogoImages = {
  blackSidebarLogo?: SanityImageSource | null;
  blackSidebarLogoUrl?: string | null;
  whiteSidebarLogo?: SanityImageSource | null;
  whiteSidebarLogoUrl?: string | null;
};

const publicLogoSources = [
  "/logo.png",
  "/logo.svg",
  "/qingjing-logo.png",
  "/qingjing-logo.svg",
  "/brand-logo.png",
  "/brand-logo.svg",
];

const labels = {
  brandZh: "\u6e05\u955c\u73bb\u7483\u82b1\u56ed",
  brandEn: "QINGJING\nGLASS ART\nGARDEN",
};

function getSanityLogoUrl(image: SanityImageSource | null | undefined) {
  if (!image) {
    return null;
  }

  try {
    return urlForImage(image).width(360).auto("format").url();
  } catch {
    return null;
  }
}

export function Logo({
  className = "",
  image,
  images,
  locale,
  siteName,
  variant = "desktop",
}: LogoProps) {
  const { mode, mounted } = useTheme();
  const shouldUseWhiteLogo = mounted ? mode === "dark" : true;
  const preferredLogo = shouldUseWhiteLogo
    ? images?.whiteSidebarLogo
    : images?.blackSidebarLogo;
  const fallbackLogo = shouldUseWhiteLogo
    ? images?.blackSidebarLogo
    : images?.whiteSidebarLogo;
  const preferredLogoUrl = shouldUseWhiteLogo
    ? images?.whiteSidebarLogoUrl
    : images?.blackSidebarLogoUrl;
  const fallbackLogoUrl = shouldUseWhiteLogo
    ? images?.blackSidebarLogoUrl
    : images?.whiteSidebarLogoUrl;
  const preferredSanityUrl = useMemo(
    () => preferredLogoUrl || getSanityLogoUrl(preferredLogo || image),
    [image, preferredLogo, preferredLogoUrl],
  );
  const fallbackSanityUrl = useMemo(
    () => fallbackLogoUrl || getSanityLogoUrl(fallbackLogo),
    [fallbackLogo, fallbackLogoUrl],
  );
  const sanityUrl = preferredSanityUrl || fallbackSanityUrl;
  const logoRequestFinished = images !== undefined;
  const imageSrc = sanityUrl
    ? sanityUrl
    : logoRequestFinished
      ? publicLogoSources[0]
      : null;
  const homeHref = locale === "en" ? "/en" : "/zh";

  const textFallback = (
    <span className="flex min-w-0 items-center gap-2.5 text-primary">
      <span
        className={`whitespace-nowrap font-semibold leading-none tracking-normal ${
          variant === "mobile" ? "text-lg" : "text-[18px]"
        }`}
      >
        {siteName?.trim() || labels.brandZh}
      </span>
      <span
        className={`whitespace-pre-line font-medium uppercase leading-[0.98] tracking-[0.03em] ${
          variant === "mobile" ? "hidden text-[7px] sm:block" : "text-[7px]"
        }`}
      >
        {labels.brandEn}
      </span>
    </span>
  );

  return (
    <Link
      aria-label={locale === "zh" ? "\u8fd4\u56de\u9996\u9875" : "Back home"}
      className={`flex min-w-0 items-center ${className}`}
      href={homeHref}
    >
      {!imageSrc && !logoRequestFinished ? (
        <span
          aria-hidden="true"
          className={`block ${
            variant === "mobile" ? "h-9 w-[190px]" : "h-9 w-[178px]"
          }`}
        />
      ) : imageSrc ? (
        <img
          alt={siteName?.trim() || labels.brandZh}
          className={`h-auto w-auto object-contain object-left ${
            variant === "mobile" ? "max-h-10 max-w-[210px]" : "max-h-10 max-w-[188px]"
          }`}
          src={imageSrc}
        />
      ) : (
        textFallback
      )}
    </Link>
  );
}

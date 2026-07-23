"use client";

import type { SanityImageSource } from "@sanity/image-url";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Locale } from "@/config/navigation";
import { urlForImage } from "@/sanity/image";

type LogoProps = {
  className?: string;
  image?: SanityImageSource | null;
  locale: Locale;
  siteName?: string | null;
  variant?: "desktop" | "mobile";
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
  locale,
  siteName,
  variant = "desktop",
}: LogoProps) {
  const [sanityFailed, setSanityFailed] = useState(false);
  const [publicIndex, setPublicIndex] = useState(0);
  const sanityUrl = useMemo(() => getSanityLogoUrl(image), [image]);
  const shouldUseSanity = Boolean(sanityUrl && !sanityFailed);
  const publicSrc = publicLogoSources[publicIndex];
  const imageSrc = shouldUseSanity ? sanityUrl : publicSrc;
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
      {imageSrc ? (
        <img
          alt={siteName?.trim() || labels.brandZh}
          className={`w-auto object-contain transition-[filter] duration-200 dark:brightness-0 dark:contrast-200 dark:invert ${
            variant === "mobile" ? "max-h-9 max-w-[190px]" : "max-h-9 max-w-[178px]"
          }`}
          onError={() => {
            if (shouldUseSanity) {
              setSanityFailed(true);
              return;
            }

            setPublicIndex((index) => index + 1);
          }}
          src={imageSrc}
        />
      ) : (
        textFallback
      )}
    </Link>
  );
}

import type {SanityImageSource} from "@sanity/image-url";
import Link from "next/link";

import {urlForImage} from "@/sanity/image";
import {glassStyle} from "../../styles/glassStyle";

type SanityImage = SanityImageSource | null | undefined;

type HeroBannerAction = {
  href: string;
  label: string;
};

type HeroBannerProps = {
  actions?: HeroBannerAction[];
  eyebrow?: string | null;
  image?: SanityImage;
  mobileHideText?: boolean;
  showIndicators?: boolean;
  subtitle?: string | null;
  title: string;
};

function imageUrl(image: SanityImage, width: number) {
  if (!image) {
    return null;
  }

  try {
    return urlForImage(image).width(width).auto("format").url();
  } catch {
    return null;
  }
}

export function HeroBanner({
  actions = [],
  eyebrow,
  image,
  mobileHideText = false,
  showIndicators = true,
  subtitle,
  title,
}: HeroBannerProps) {
  const heroImage = imageUrl(image, 1800);
  const mobileBottomLayout = mobileHideText
    ? "items-end pb-14 pt-24 md:items-stretch md:pb-8 md:pt-24 lg:pt-[280px]"
    : "pb-8 pt-24 lg:pt-[280px]";
  const textVisibility = mobileHideText ? "hidden md:block" : "";
  const actionLayout = mobileHideText
    ? "mt-0 flex-nowrap justify-center gap-3 md:mt-5 md:flex-wrap md:justify-start"
    : "mt-5 flex-wrap gap-3";
  const actionSizing = mobileHideText
    ? "px-4 py-2.5 text-[13px] sm:px-5 sm:text-sm"
    : "px-5 py-2.5 text-sm";

  return (
    <section className={`${glassStyle.banner} home-hero relative isolate flex min-h-[390px] overflow-hidden px-5 sm:px-8 lg:min-h-[510px] lg:px-[60px] lg:pb-8 ${mobileBottomLayout}`}>
      {heroImage ? (
        <img
          alt={title}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          src={heroImage}
        />
      ) : null}
      <div className="home-hero-overlay absolute inset-0 -z-10" />
      <div className={`${glassStyle.bannerRefraction} absolute inset-0 -z-10`} />

      <div className="w-full max-w-[980px]">
        {eyebrow ? (
          <p className="mb-3 text-[10px] uppercase tracking-[0.36em] text-muted-token">
            {eyebrow}
          </p>
        ) : null}
        <h1 className={`${textVisibility} font-title max-w-[720px] text-[40px] font-normal leading-[1.08] text-primary sm:text-[50px] lg:text-[64px]`}>
          {title}
        </h1>
        {subtitle ? (
          <p className={`${textVisibility} mt-4 max-w-xl text-sm leading-7 text-secondary lg:text-base`}>
            {subtitle}
          </p>
        ) : null}
        {actions.length > 0 ? (
          <div className={`flex ${actionLayout}`}>
            {actions.map((action, index) => (
              <Link
                className={`${glassStyle.button} rounded-full ${actionSizing} transition ${
                  index === 0
                    ? "glass-button-primary"
                    : "glass-button-secondary"
                }`}
                href={action.href}
                key={`${action.href}-${action.label}`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {showIndicators ? (
        <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-4 lg:flex">
          <span className="h-0.5 w-12 rounded-full bg-[var(--soft-foreground)]" />
          <span className="h-0.5 w-12 rounded-full bg-[var(--glass-border)]" />
          <span className="h-0.5 w-12 rounded-full bg-[var(--glass-border)]" />
        </div>
      ) : null}
    </section>
  );
}

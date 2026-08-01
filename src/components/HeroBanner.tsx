"use client";

import type {SanityImageSource} from "@sanity/image-url";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";

import {urlForImage} from "@/sanity/image";
import {glassStyle} from "../../styles/glassStyle";

type SanityImage = SanityImageSource | null | undefined;

export type HeroBannerSlide = {
  alt?: string | null;
  image?: SanityImage;
  titleColorMode?: "white" | "black" | string | null;
  titleLogo?: SanityImage;
  titleLogoBlack?: SanityImage;
  titleLogoWhite?: SanityImage;
};

type HeroBannerAction = {
  href: string;
  label: string;
};

type HeroBannerProps = {
  actions?: HeroBannerAction[];
  eyebrow?: string | null;
  image?: SanityImage;
  images?: SanityImage[] | null;
  mobileHideText?: boolean;
  showIndicators?: boolean;
  slides?: HeroBannerSlide[] | null;
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

type HeroBannerSlideWithUrls = HeroBannerSlide & {
  imageUrl: string;
  titleLogoBlackUrl: string | null;
  titleLogoUrl: string | null;
  titleLogoWhiteUrl: string | null;
};

function hasSlideImageUrl(
  slide: HeroBannerSlide & {
    imageUrl: string | null;
    titleLogoBlackUrl: string | null;
    titleLogoUrl: string | null;
    titleLogoWhiteUrl: string | null;
  },
): slide is HeroBannerSlideWithUrls {
  return Boolean(slide.imageUrl);
}

function getTitleLogo(slide: HeroBannerSlideWithUrls | undefined) {
  if (!slide) {
    return {className: "", url: null};
  }

  const colorMode = slide.titleColorMode === "white" ? "white" : "black";

  if (colorMode === "white") {
    if (slide.titleLogoWhiteUrl) {
      return {className: "", url: slide.titleLogoWhiteUrl};
    }

    if (slide.titleLogoBlackUrl) {
      return {className: "brightness-0 invert", url: slide.titleLogoBlackUrl};
    }

    if (slide.titleLogoUrl) {
      return {className: "brightness-0 invert", url: slide.titleLogoUrl};
    }

    return {className: "", url: null};
  }

  if (slide.titleLogoBlackUrl) {
    return {className: "", url: slide.titleLogoBlackUrl};
  }

  if (slide.titleLogoWhiteUrl) {
    return {className: "brightness-0", url: slide.titleLogoWhiteUrl};
  }

  return {className: "", url: slide.titleLogoUrl};
}

export function HeroBanner({
  actions = [],
  eyebrow,
  image,
  images,
  mobileHideText = false,
  showIndicators = true,
  slides,
  subtitle,
  title,
}: HeroBannerProps) {
  const heroSlides = useMemo(
    () => {
      const sourceSlides: HeroBannerSlide[] =
        slides?.filter((slide) => Boolean(slide?.image)) ||
        images?.filter(Boolean).map((item) => ({image: item} satisfies HeroBannerSlide)) ||
        (image ? [{image} satisfies HeroBannerSlide] : []);

      return sourceSlides
        .map((slide) => ({
          ...slide,
          imageUrl: imageUrl(slide.image, 1800),
          titleLogoBlackUrl: imageUrl(slide.titleLogoBlack, 1000),
          titleLogoUrl: imageUrl(slide.titleLogo, 1000),
          titleLogoWhiteUrl: imageUrl(slide.titleLogoWhite, 1000),
        }))
        .filter(hasSlideImageUrl);
    },
    [image, images, slides],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasCarousel = heroSlides.length > 1;
  const currentSlide = heroSlides[currentIndex];
  const titleLogo = getTitleLogo(currentSlide);

  useEffect(() => {
    setCurrentIndex(0);
  }, [heroSlides.length]);

  useEffect(() => {
    if (!hasCarousel) {
      setCurrentIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [hasCarousel, heroSlides]);

  const mobileBottomLayout = mobileHideText
    ? "items-end pb-14 pt-24 md:items-stretch md:pb-8 md:pt-24 lg:pt-[280px]"
    : "pb-8 pt-24 lg:pt-[280px]";
  const textVisibility = mobileHideText ? "hidden md:block" : "";
  const actionLayout = mobileHideText
    ? "mt-0 flex-nowrap justify-start gap-3 md:mt-5 md:flex-wrap"
    : "mt-5 flex-wrap gap-3";
  const actionSizing = mobileHideText
    ? "px-4 py-2.5 text-[13px] sm:px-5 sm:text-sm"
    : "px-5 py-2.5 text-sm";

  return (
    <section className={`${glassStyle.banner} home-hero relative isolate flex min-h-[390px] overflow-hidden px-5 sm:px-8 lg:min-h-[510px] lg:px-[60px] lg:pb-8 ${mobileBottomLayout}`}>
      {heroSlides.map((heroSlide, index) => (
        <img
          alt={heroSlide.alt || title}
          className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          key={`${heroSlide.imageUrl}-${index}`}
          src={heroSlide.imageUrl}
        />
      ))}
      <div className="home-hero-overlay absolute inset-0 -z-10" />
      <div className={`${glassStyle.bannerRefraction} absolute inset-0 -z-10`} />

      <div className="w-full max-w-[980px]">
        {eyebrow ? (
          <p className="mb-3 text-[10px] uppercase tracking-[0.36em] text-muted-token">
            {eyebrow}
          </p>
        ) : null}
        {titleLogo.url ? (
          <img
            alt={title}
            className={`${textVisibility} hero-logo block h-auto max-h-[120px] w-auto max-w-[min(78vw,560px)] object-contain ${titleLogo.className}`}
            src={titleLogo.url}
          />
        ) : (
          <h1 className={`${textVisibility} font-title max-w-[720px] text-[40px] font-normal leading-[1.08] text-primary sm:text-[50px] lg:text-[64px]`}>
            {title}
          </h1>
        )}
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

      {showIndicators && hasCarousel ? (
        <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 lg:flex">
          {heroSlides.map((heroSlide, index) => (
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full transition ${
                index === currentIndex
                  ? "bg-[var(--soft-foreground)]"
                  : "bg-[var(--glass-border)]"
              }`}
              key={`indicator-${heroSlide.imageUrl}-${index}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

"use client";

import type { SanityImageSource } from "@sanity/image-url";
import { useEffect, useState } from "react";

import type { Locale } from "@/config/navigation";
import { urlForImage } from "@/sanity/image";

type SanityImage = SanityImageSource | null | undefined;

export type PastReviewItem = {
  _key?: string;
  description?: string | null;
  image?: SanityImage;
  title?: string | null;
  year?: string | null;
};

type PastReviewCarouselProps = {
  className?: string;
  items: PastReviewItem[];
  itemsPerViewDesktop?: number;
  itemsPerViewMobile?: number;
  locale: Locale;
  title: string;
};

const copy = {
  zh: {
    emptyImage: "图片待上传",
    next: "下一张",
    previous: "上一张",
  },
  en: {
    emptyImage: "Image pending",
    next: "Next",
    previous: "Previous",
  },
} satisfies Record<Locale, Record<string, string>>;

function compactText(value: string | null | undefined) {
  return value?.trim() || "";
}

function imageUrl(image: SanityImage, width: number) {
  if (!image) {
    return null;
  }

  try {
    return urlForImage(image)
      .width(width)
      .height(Math.round(width * 0.75))
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return null;
  }
}

function getCircularItem(items: PastReviewItem[], index: number) {
  if (items.length === 0) {
    return null;
  }

  return items[(index + items.length) % items.length];
}

export function PastReviewCarousel({
  className = "",
  items,
  locale,
  title,
}: PastReviewCarouselProps) {
  const labels = copy[locale];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const visibleItems = items.filter((item) => item?.image);
  const canSlide = visibleItems.length > 1;
  const currentItem = getCircularItem(visibleItems, currentIndex);
  const previousItem = getCircularItem(visibleItems, currentIndex - 1);
  const nextItem = getCircularItem(visibleItems, currentIndex + 1);

  const goTo = (nextIndex: number) => {
    if (!visibleItems.length) {
      return;
    }

    setCurrentIndex((nextIndex + visibleItems.length) % visibleItems.length);
  };

  const pauseBriefly = () => {
    setIsPaused(true);
    window.setTimeout(() => setIsPaused(false), 5000);
  };

  useEffect(() => {
    setCurrentIndex((index) =>
      Math.min(index, Math.max(visibleItems.length - 1, 0)),
    );
  }, [visibleItems.length]);

  useEffect(() => {
    if (!canSlide || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % visibleItems.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [canSlide, isPaused, visibleItems.length]);

  if (!currentItem) {
    return null;
  }

  const currentSrc = imageUrl(currentItem.image, 1200);
  const previousSrc = imageUrl(previousItem?.image, 760);
  const nextSrc = imageUrl(nextItem?.image, 760);
  const titleText = compactText(currentItem.title);
  const year = compactText(currentItem.year);
  const description = compactText(currentItem.description);
  const hasText = titleText || year || description;

  return (
    <section className={className}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-title text-2xl font-normal leading-tight text-primary lg:text-[28px]">
          {title}
        </h2>
        {canSlide ? (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              aria-label={labels.previous}
              className="glass-button flex h-8 w-8 items-center justify-center rounded-full text-secondary transition hover:text-primary"
              onClick={() => {
                pauseBriefly();
                goTo(currentIndex - 1);
              }}
              type="button"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              aria-label={labels.next}
              className="glass-button flex h-8 w-8 items-center justify-center rounded-full text-secondary transition hover:text-primary"
              onClick={() => {
                pauseBriefly();
                goTo(currentIndex + 1);
              }}
              type="button"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        ) : null}
      </div>

      <div
        className="relative mx-auto max-w-[920px] py-2 md:py-5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {canSlide && previousSrc ? (
          <button
            aria-label={labels.previous}
            className="group absolute left-0 top-1/2 z-0 hidden aspect-[4/3] w-[38%] -translate-y-1/2 overflow-hidden rounded-[18px] opacity-45 shadow-[0_24px_55px_rgba(0,0,0,0.26)] transition duration-500 hover:opacity-65 md:block"
            onClick={() => {
              pauseBriefly();
              goTo(currentIndex - 1);
            }}
            type="button"
          >
            <img
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
              loading="lazy"
              src={previousSrc}
            />
            <span className="absolute inset-0 bg-black/28" />
          </button>
        ) : null}

        {canSlide && nextSrc ? (
          <button
            aria-label={labels.next}
            className="group absolute right-0 top-1/2 z-0 hidden aspect-[4/3] w-[38%] -translate-y-1/2 overflow-hidden rounded-[18px] opacity-45 shadow-[0_24px_55px_rgba(0,0,0,0.26)] transition duration-500 hover:opacity-65 md:block"
            onClick={() => {
              pauseBriefly();
              goTo(currentIndex + 1);
            }}
            type="button"
          >
            <img
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
              loading="lazy"
              src={nextSrc}
            />
            <span className="absolute inset-0 bg-black/28" />
          </button>
        ) : null}

        <a
          className="group relative z-10 mx-auto block aspect-[4/3] w-full max-w-[620px] overflow-hidden rounded-[20px] bg-[rgba(255,255,255,0.08)] shadow-[0_28px_72px_rgba(0,0,0,0.32)]"
          href={currentSrc || undefined}
          key={currentItem._key || currentSrc || currentIndex}
          rel="noreferrer"
          target={currentSrc ? "_blank" : undefined}
        >
          {currentSrc ? (
            <img
              alt={titleText || title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.018]"
              loading="lazy"
              src={currentSrc}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-token">
              {labels.emptyImage}
            </div>
          )}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/38 via-black/4 to-white/8" />
          {hasText ? (
            <div className="absolute inset-x-4 bottom-4 rounded-[14px] border border-white/15 bg-black/30 px-4 py-3 text-white shadow-[0_18px_42px_rgba(0,0,0,0.22)] backdrop-blur-md">
              {year ? (
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/62">
                  {year}
                </p>
              ) : null}
              {titleText ? (
                <h3 className="mt-1 line-clamp-1 font-title text-[18px] font-normal leading-snug">
                  {titleText}
                </h3>
              ) : null}
              {description ? (
                <p className="mt-1 line-clamp-2 text-[12px] leading-[1.55] text-white/72">
                  {description}
                </p>
              ) : null}
            </div>
          ) : null}
        </a>
      </div>
    </section>
  );
}

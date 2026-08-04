"use client";

import type { SanityImageSource } from "@sanity/image-url";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Locale } from "@/config/navigation";
import { urlForImage } from "@/sanity/image";

type SanityImage = SanityImageSource | null | undefined;

export type PastReviewItem = {
  _key?: string;
  description?: string | null;
  image?: SanityImage;
  subtitle?: string | null;
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
    next: "下一项",
    previous: "上一项",
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
      .height(Math.round(width * 0.5625))
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return null;
  }
}

function PastReviewCard({
  isActive,
  item,
  labels,
  titleFallback,
}: {
  isActive: boolean;
  item: PastReviewItem;
  labels: (typeof copy)[Locale];
  titleFallback: string;
}) {
  const src = imageUrl(item.image, isActive ? 1200 : 920);
  const itemTitle = compactText(item.title);
  const itemSubtitle = compactText(item.subtitle) || compactText(item.year);
  const itemDescription = compactText(item.description);
  const hasText = itemTitle || itemDescription || itemSubtitle;

  return (
    <a
      className={`group relative block aspect-video min-w-0 overflow-hidden rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.07)] shadow-[0_24px_72px_rgba(0,0,0,0.26)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-white/18 hover:shadow-[0_30px_82px_rgba(0,0,0,0.34)] ${
        isActive ? "scale-100 opacity-100" : "scale-[0.88] opacity-58"
      }`}
      href={src || undefined}
      rel="noreferrer"
      target={src ? "_blank" : undefined}
    >
      {src ? (
        <img
          alt={itemTitle || titleFallback}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.018]"
          loading="lazy"
          src={src}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-token">
          {labels.emptyImage}
        </div>
      )}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/58 via-black/14 to-white/6" />

      {hasText ? (
        <div className="absolute inset-x-4 bottom-4 max-w-[88%] rounded-[16px] border border-white/14 bg-black/34 px-4 py-3 text-white shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-md md:inset-x-5 md:bottom-5 md:max-w-[82%]">
          {itemSubtitle ? (
            <p className="mb-1 line-clamp-1 text-[10px] uppercase tracking-[0.16em] text-white/54">
              {itemSubtitle}
            </p>
          ) : null}
          {itemTitle ? (
            <h3 className="line-clamp-1 font-title text-[17px] font-normal leading-snug text-white lg:text-[19px]">
              {itemTitle}
            </h3>
          ) : null}
          {itemDescription ? (
            <p className="mt-1 line-clamp-2 text-[12px] leading-[1.55] text-white/72 lg:text-[13px]">
              {itemDescription}
            </p>
          ) : null}
        </div>
      ) : null}
    </a>
  );
}

export function PastReviewCarousel({
  className = "",
  items,
  locale,
  title,
}: PastReviewCarouselProps) {
  const labels = copy[locale];
  const visibleItems = useMemo(
    () => items.filter((item) => item?.image),
    [items],
  );
  const canSlide = visibleItems.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: false,
    duration: 34,
    loop: canSlide,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<number | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const pauseBriefly = () => {
    setIsPaused(true);

    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      setIsPaused(false);
      resumeTimerRef.current = null;
    }, 5000);
  };

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    emblaApi.reInit({
      align: "center",
      containScroll: false,
      duration: 34,
      loop: canSlide,
    });
  }, [canSlide, emblaApi, visibleItems.length]);

  useEffect(() => {
    if (!emblaApi || !canSlide || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => window.clearInterval(timer);
  }, [canSlide, emblaApi, isPaused]);

  useEffect(
    () => () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
    },
    [],
  );

  if (visibleItems.length === 0) {
    return null;
  }

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
                emblaApi?.scrollPrev();
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
                emblaApi?.scrollNext();
              }}
              type="button"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        ) : null}
      </div>

      <div
        className="mx-auto w-full max-w-[1320px] py-2 md:py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-5 flex items-center md:-ml-7 lg:-ml-8">
            {visibleItems.map((item, index) => (
              <div
                className="min-w-0 flex-[0_0_86%] pl-5 sm:flex-[0_0_68%] md:flex-[0_0_48%] md:pl-7 lg:flex-[0_0_34%] lg:pl-8"
                key={item._key || index}
              >
                <PastReviewCard
                  isActive={index === selectedIndex}
                  item={item}
                  labels={labels}
                  titleFallback={title}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

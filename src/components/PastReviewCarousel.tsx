"use client";

import type {SanityImageSource} from "@sanity/image-url";
import {useEffect, useState} from "react";

import type {Locale} from "@/config/navigation";
import {urlForImage} from "@/sanity/image";

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
    next: "下一组",
    previous: "上一组",
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
    return urlForImage(image).width(width).auto("format").url();
  } catch {
    return null;
  }
}

export function PastReviewCarousel({
  className = "",
  items,
  itemsPerViewDesktop = 3,
  itemsPerViewMobile = 1,
  locale,
  title,
}: PastReviewCarouselProps) {
  const labels = copy[locale];
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerViewDesktop);
  const visibleItems = items.filter((item) => item?.image);
  const pageCount = Math.max(1, Math.ceil(visibleItems.length / itemsPerPage));
  const canSlide = pageCount > 1;

  const goToPage = (nextPage: number) => {
    setCurrentPage((nextPage + pageCount) % pageCount);
  };

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(
        window.matchMedia("(max-width: 639px)").matches
          ? itemsPerViewMobile
          : itemsPerViewDesktop,
      );
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [itemsPerViewDesktop, itemsPerViewMobile]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    if (!canSlide || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      goToPage(currentPage + 1);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [canSlide, currentPage, isPaused, pageCount]);

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
                setIsPaused(true);
                goToPage(currentPage - 1);
                window.setTimeout(() => setIsPaused(false), 5000);
              }}
              type="button"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              aria-label={labels.next}
              className="glass-button flex h-8 w-8 items-center justify-center rounded-full text-secondary transition hover:text-primary"
              onClick={() => {
                setIsPaused(true);
                goToPage(currentPage + 1);
                window.setTimeout(() => setIsPaused(false), 5000);
              }}
              type="button"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        ) : null}
      </div>

      <div
        className="overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{transform: `translateX(-${currentPage * 100}%)`}}
        >
          {Array.from({length: pageCount}).map((_, pageIndex) => {
            const pageItems = visibleItems.slice(
              pageIndex * itemsPerPage,
              pageIndex * itemsPerPage + itemsPerPage,
            );

            return (
              <div
                className="grid w-full shrink-0 gap-5"
                key={pageIndex}
                style={{
                  gridTemplateColumns: `repeat(${Math.min(
                    itemsPerPage,
                    pageItems.length || 1,
                  )}, minmax(0, 1fr))`,
                }}
              >
                {pageItems.map((item, index) => {
                  const src = imageUrl(item.image, 1100);
                  const titleText = compactText(item.title);
                  const year = compactText(item.year);
                  const description = compactText(item.description);
                  const hasText = titleText || year || description;

                  return (
                    <a
                      className="group relative block overflow-hidden rounded-[18px] bg-[rgba(255,255,255,0.08)]"
                      href={src || undefined}
                      key={item._key || `${src || "review"}-${index}`}
                      rel="noreferrer"
                      target={src ? "_blank" : undefined}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        {src ? (
                          <img
                            alt={titleText || title}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                            loading="lazy"
                            src={src}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-token">
                            {labels.emptyImage}
                          </div>
                        )}
                      </div>
                      {hasText ? (
                        <div className="absolute inset-x-3 bottom-3 rounded-[14px] border border-white/15 bg-black/32 px-4 py-3 text-white shadow-[0_18px_42px_rgba(0,0,0,0.22)] backdrop-blur-md">
                          {year ? (
                            <p className="text-[11px] uppercase tracking-[0.18em] text-white/62">
                              {year}
                            </p>
                          ) : null}
                          {titleText ? (
                            <h3 className="mt-1 line-clamp-1 font-title text-[17px] font-normal leading-snug">
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
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

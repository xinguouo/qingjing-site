"use client";

import Link from "next/link";
import {type ReactNode, useEffect, useState} from "react";

type HomeCarouselSectionProps = {
  autoPlay?: boolean;
  cardVariant: "masterclass" | "event" | "artwork" | "product";
  className?: string;
  items: ReactNode[];
  itemsPerViewDesktop?: number;
  itemsPerViewMobile?: number;
  sectionTitle: string;
  viewAllHref?: string | null;
  viewAllLabel: string;
};

const variantSpacing = {
  artwork: "gap-5",
  event: "gap-5",
  masterclass: "gap-5",
  product: "gap-5",
} satisfies Record<HomeCarouselSectionProps["cardVariant"], string>;

export function HomeCarouselSection({
  autoPlay = true,
  cardVariant,
  className = "",
  items,
  itemsPerViewDesktop = 2,
  itemsPerViewMobile = 1,
  sectionTitle,
  viewAllHref,
  viewAllLabel,
}: HomeCarouselSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerViewDesktop);
  const visibleItems = items.filter(Boolean);
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
    if (!autoPlay || !canSlide || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      goToPage(currentPage + 1);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [autoPlay, canSlide, currentPage, isPaused, pageCount]);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section className={className}>
      <div className="mb-4 flex items-center justify-between gap-4 lg:mb-4">
        <h2 className="font-title text-2xl font-normal leading-tight text-primary lg:text-[28px]">
          {sectionTitle}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          {canSlide ? (
            <div className="hidden items-center gap-1.5 md:flex">
              <button
                aria-label="Previous"
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
                aria-label="Next"
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
          {viewAllHref ? (
            <Link
              className="glass-button inline-flex items-center rounded-full px-3 py-1.5 text-xs text-secondary transition hover:text-primary"
              href={viewAllHref}
            >
              {viewAllLabel}
            </Link>
          ) : null}
        </div>
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
                className={`grid w-full shrink-0 ${variantSpacing[cardVariant]}`}
                key={pageIndex}
                style={{
                  gridTemplateColumns: `repeat(${Math.min(
                    itemsPerPage,
                    pageItems.length || 1,
                  )}, minmax(0, 1fr))`,
                }}
              >
                {pageItems.map((item, index) => (
                  <div className="min-w-0" key={index}>
                    {item}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

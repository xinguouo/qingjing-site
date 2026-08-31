"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type HomeCarouselSectionProps = {
  autoPlay?: boolean;
  cardVariant: "masterclass" | "event" | "artwork" | "product";
  className?: string;
  items: ReactNode[];
  itemsPerViewDesktop?: number;
  itemsPerViewMobile?: number;
  sectionTitle: string;
  syncGroup?: string;
  syncLeader?: boolean;
  viewAllHref?: string | null;
  viewAllLabel: string;
};

const variantSpacing = {
  artwork: "gap-5",
  event: "gap-5",
  masterclass: "gap-5",
  product: "gap-5",
} satisfies Record<HomeCarouselSectionProps["cardVariant"], string>;

const autoPlayDelay = 6000;
const transitionDuration = 1500;
const manualPauseDuration = 6500;
const carouselAdvanceEvent = "qingjing-home-carousel-advance";
const carouselPauseEvent = "qingjing-home-carousel-pause";

type CarouselAdvanceDetail = {
  direction: 1 | -1;
  group: string;
};

type CarouselPauseDetail = {
  group: string;
  paused: boolean;
};

export function HomeCarouselSection({
  autoPlay = true,
  cardVariant,
  className = "",
  items,
  itemsPerViewDesktop = 2,
  itemsPerViewMobile = 1,
  sectionTitle,
  syncGroup,
  syncLeader = false,
  viewAllHref,
  viewAllLabel,
}: HomeCarouselSectionProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerViewDesktop);
  const resumeTimerRef = useRef<number | null>(null);
  const visibleItems = items.filter(Boolean);
  const pageCount = Math.max(1, Math.ceil(visibleItems.length / itemsPerPage));
  const canSlide = pageCount > 1;

  const goToPage = useCallback(
    (nextPage: number) => {
      setCurrentPage((nextPage + pageCount) % pageCount);
    },
    [pageCount],
  );

  const shiftPage = useCallback(
    (direction: 1 | -1) => {
      setCurrentPage((page) => (page + direction + pageCount) % pageCount);
    },
    [pageCount],
  );

  const dispatchAdvance = useCallback(
    (direction: 1 | -1) => {
      if (!syncGroup) {
        shiftPage(direction);
        return;
      }

      window.dispatchEvent(
        new CustomEvent<CarouselAdvanceDetail>(carouselAdvanceEvent, {
          detail: { direction, group: syncGroup },
        }),
      );
    },
    [shiftPage, syncGroup],
  );

  const dispatchPause = useCallback(
    (paused: boolean) => {
      if (!syncGroup) {
        setIsPaused(paused);
        return;
      }

      window.dispatchEvent(
        new CustomEvent<CarouselPauseDetail>(carouselPauseEvent, {
          detail: { group: syncGroup, paused },
        }),
      );
    },
    [syncGroup],
  );

  const pauseBriefly = useCallback(() => {
    dispatchPause(true);

    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      dispatchPause(false);
      resumeTimerRef.current = null;
    }, manualPauseDuration);
  }, [dispatchPause]);

  const handleViewAllClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        !viewAllHref ||
        /^https?:\/\//.test(viewAllHref) ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      router.push(viewAllHref);
    },
    [router, viewAllHref],
  );

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
    if (!syncGroup) {
      return;
    }

    const handleAdvance = (event: Event) => {
      const { detail } = event as CustomEvent<CarouselAdvanceDetail>;

      if (detail?.group === syncGroup) {
        shiftPage(detail.direction);
      }
    };

    const handlePause = (event: Event) => {
      const { detail } = event as CustomEvent<CarouselPauseDetail>;

      if (detail?.group === syncGroup) {
        setIsPaused(detail.paused);
      }
    };

    window.addEventListener(carouselAdvanceEvent, handleAdvance);
    window.addEventListener(carouselPauseEvent, handlePause);

    return () => {
      window.removeEventListener(carouselAdvanceEvent, handleAdvance);
      window.removeEventListener(carouselPauseEvent, handlePause);
    };
  }, [shiftPage, syncGroup]);

  useEffect(() => {
    if (!autoPlay || isPaused || (syncGroup && !syncLeader)) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (syncGroup) {
        dispatchAdvance(1);
        return;
      }

      goToPage(currentPage + 1);
    }, autoPlayDelay);

    return () => window.clearTimeout(timer);
  }, [
    autoPlay,
    currentPage,
    dispatchAdvance,
    goToPage,
    isPaused,
    syncGroup,
    syncLeader,
  ]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section className={`relative min-w-0 ${className}`}>
      <div className="relative z-20 mb-4 flex items-center justify-between gap-4 lg:mb-4">
        <h2 className="font-title text-2xl font-normal leading-tight text-primary lg:text-[28px]">
          {sectionTitle}
        </h2>
        <div className="relative z-30 flex shrink-0 items-center gap-2">
          {canSlide ? (
            <div className="hidden items-center gap-1.5 md:flex">
              <button
                aria-label="Previous"
                className="glass-button flex h-8 w-8 items-center justify-center rounded-full text-secondary transition hover:text-primary"
                onClick={() => {
                  pauseBriefly();
                  dispatchAdvance(-1);
                }}
                type="button"
              >
                <span aria-hidden="true">&larr;</span>
              </button>
              <button
                aria-label="Next"
                className="glass-button flex h-8 w-8 items-center justify-center rounded-full text-secondary transition hover:text-primary"
                onClick={() => {
                  pauseBriefly();
                  dispatchAdvance(1);
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
              onClick={handleViewAllClick}
            >
              {viewAllLabel}
            </Link>
          ) : null}
        </div>
      </div>

      <div
        className="relative z-0 overflow-hidden"
        onMouseEnter={() => dispatchPause(true)}
        onMouseLeave={() => dispatchPause(false)}
      >
        <div
          className="flex transition-transform ease-in-out"
          style={{
            transform: `translateX(-${currentPage * 100}%)`,
            transitionDuration: `${transitionDuration}ms`,
          }}
        >
          {Array.from({ length: pageCount }).map((_, pageIndex) => {
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

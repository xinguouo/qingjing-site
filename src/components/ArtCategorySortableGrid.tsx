"use client";

import {useEffect, useMemo, useRef, useState} from "react";

import type {Locale} from "@/config/navigation";

import {
  ArtworkCard,
  type ArtCategorySlug,
  type Artwork,
} from "./ArtCategoryPage";

type SortMode = "default" | "az" | "za";

type ArtCategorySortableGridProps = {
  artworks: Artwork[];
  category: ArtCategorySlug;
  enableSorting?: boolean;
  includeLocalePrefix: boolean;
  locale: Locale;
};

const labels = {
  zh: {
    az: "A-Z",
    default: "默认排序",
    sort: "排序",
    za: "Z-A",
  },
  en: {
    az: "A-Z",
    default: "Default",
    sort: "Sort",
    za: "Z-A",
  },
} satisfies Record<Locale, Record<SortMode | "sort", string>>;

const sortOptions: SortMode[] = ["default", "az", "za"];

function artworkTitle(artwork: Artwork) {
  return (artwork.title || artwork.titleZh || artwork.titleEn || "").trim();
}

function SortDropdown({
  category,
  labels,
  onChange,
  value,
}: {
  category: ArtCategorySlug;
  labels: Record<SortMode | "sort", string>;
  onChange: (value: SortMode) => void;
  value: SortMode;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        aria-controls={`${category}-sort-menu`}
        aria-expanded={open}
        className="group inline-flex min-h-9 min-w-[124px] items-center justify-between gap-3 rounded-full border border-white/15 bg-white/10 px-4 text-left text-[13px] text-primary shadow-[0_12px_34px_rgba(0,0,0,0.16)] outline-none backdrop-blur-xl transition duration-200 hover:border-white/25 hover:bg-white/16 hover:shadow-[0_16px_42px_rgba(0,0,0,0.22)] dark:bg-white/[0.075] dark:text-white/86"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span>{labels[value]}</span>
        <span
          aria-hidden="true"
          className={`text-[10px] text-secondary transition duration-200 ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      <div
        className={`absolute left-0 top-[calc(100%+8px)] z-20 w-[150px] overflow-hidden rounded-xl border border-white/15 bg-[#151515]/88 py-1 shadow-[0_18px_54px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition duration-200 ease-out dark:bg-[#151515]/82 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1.5 opacity-0"
        }`}
        id={`${category}-sort-menu`}
        role="menu"
      >
        {sortOptions.map((option) => (
          <button
            className={`flex h-10 w-full items-center px-4 text-left text-[13px] transition duration-150 ${
              option === value
                ? "bg-white/13 text-white"
                : "text-white/72 hover:bg-white/10 hover:text-white"
            }`}
            key={option}
            onClick={() => {
              onChange(option);
              setOpen(false);
            }}
            role="menuitemradio"
            type="button"
          >
            {labels[option]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ArtCategorySortableGrid({
  artworks,
  category,
  enableSorting = false,
  includeLocalePrefix,
  locale,
}: ArtCategorySortableGridProps) {
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const copy = labels[locale];
  const sortedArtworks = useMemo(() => {
    if (sortMode === "default") {
      return artworks;
    }

    return [...artworks].sort((a, b) => {
      const result = artworkTitle(a).localeCompare(artworkTitle(b), locale, {
        numeric: true,
        sensitivity: "base",
      });

      return sortMode === "az" ? result : -result;
    });
  }, [artworks, locale, sortMode]);

  return (
    <>
      {enableSorting ? (
        <div className="mt-7 flex items-center gap-3 text-[13px] text-secondary">
          <span>{copy.sort}</span>
          <SortDropdown
            category={category}
            labels={copy}
            onChange={setSortMode}
            value={sortMode}
          />
        </div>
      ) : null}

      <section className="mt-9 max-w-[1180px] lg:mt-10">
        <div className="grid justify-items-start gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {sortedArtworks.map((artwork, index) => (
            <ArtworkCard
              artwork={artwork}
              category={category}
              includeLocalePrefix={includeLocalePrefix}
              index={index}
              key={artwork._id || artwork._key || artwork.slug || `${category}-${index}`}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </>
  );
}

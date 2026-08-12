"use client";

import type {Locale} from "@/config/navigation";

import {
  ArtworkCard,
  type ArtCategorySlug,
  type Artwork,
} from "./ArtCategoryPage";

type ArtCategorySortableGridProps = {
  artworks: Artwork[];
  category: ArtCategorySlug;
  includeLocalePrefix: boolean;
  locale: Locale;
};

export function ArtCategorySortableGrid({
  artworks,
  category,
  includeLocalePrefix,
  locale,
}: ArtCategorySortableGridProps) {
  return (
    <section className="mt-9 max-w-[1180px] lg:mt-10">
      <div className="grid justify-items-start gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {artworks.map((artwork, index) => (
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
  );
}

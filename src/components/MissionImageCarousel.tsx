"use client";

import type {SanityImageSource} from "@sanity/image-url";
import {useEffect, useMemo, useState} from "react";

import {urlForImage} from "@/sanity/image";

type SanityImage = SanityImageSource | null | undefined;

type MissionImageCarouselProps = {
  alt: string;
  className?: string;
  images?: SanityImage[] | null;
  label: string;
  priority?: boolean;
  width?: number;
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

export function MissionImageCarousel({
  alt,
  className = "",
  images,
  label,
  priority = false,
  width = 1800,
}: MissionImageCarouselProps) {
  const slides = useMemo(
    () =>
      (images || [])
        .map((image) => ({
          image,
          src: imageUrl(image, width),
        }))
        .filter((slide): slide is {image: SanityImage; src: string} =>
          Boolean(slide.src),
        ),
    [images, width],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasCarousel = slides.length > 1;

  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (!hasCarousel) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [hasCarousel, slides.length]);

  return (
    <div
      className={`image-placeholder relative flex items-center justify-center overflow-hidden rounded-[14px] ${className}`}
    >
      {slides.length ? (
        slides.map((slide, index) => (
          <img
            alt={alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            key={`${slide.src}-${index}`}
            loading={priority && index === 0 ? "eager" : "lazy"}
            src={slide.src}
          />
        ))
      ) : (
        <span className="px-5 text-center text-xs text-muted-token">
          {label}
        </span>
      )}

      {hasCarousel ? (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2.5">
          {slides.map((slide, index) => (
            <button
              aria-label={`Show mission image ${index + 1}`}
              className={`h-2 w-2 rounded-full transition ${
                index === currentIndex
                  ? "bg-white shadow-[0_0_10px_rgba(0,0,0,0.18)] dark:bg-[var(--soft-foreground)]"
                  : "bg-white/48 hover:bg-white/78 dark:bg-white/30 dark:hover:bg-white/56"
              }`}
              key={`mission-indicator-${slide.src}-${index}`}
              onClick={() => setCurrentIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

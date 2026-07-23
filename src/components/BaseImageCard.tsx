import type {SanityImageSource} from "@sanity/image-url";
import Link from "next/link";
import type {ReactNode} from "react";

import {urlForImage} from "@/sanity/image";

import {glassStyle} from "../../styles/glassStyle";

type SanityImage = SanityImageSource | null | undefined;

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

export function BaseImageCard({
  aspectClassName = "aspect-[4/5]",
  children,
  emptyLabel,
  href,
  image,
  imageAlt,
}: {
  aspectClassName?: string;
  children: ReactNode;
  emptyLabel: string;
  href: string | null;
  image: SanityImage;
  imageAlt: string;
}) {
  const src = imageUrl(image, 900);

  const article = (
    <article className={`${glassStyle.mediaCard} relative w-full overflow-hidden rounded-[20px] bg-[#d8d8d3] dark:bg-[#1d1d1b]`}>
      <div className={`${glassStyle.imageFrame} image-placeholder flex ${aspectClassName} w-full items-center justify-center overflow-hidden`}>
        {src ? (
          <img
            alt={imageAlt}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            loading="lazy"
            src={src}
          />
        ) : (
          <span className="px-5 text-center text-xs text-muted-token">
            {emptyLabel}
          </span>
        )}
      </div>

      <div className={`${glassStyle.overlay} absolute inset-x-2.5 bottom-2.5 rounded-[14px] border border-white/65 bg-white/68 px-3 py-2.5 text-[#222] shadow-[0_12px_28px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.78)] dark:border-white/14 dark:bg-black/34 dark:text-white/88`}>
        {children}
      </div>
    </article>
  );

  if (!href) {
    return (
      <div className="group block w-full max-w-[320px] min-w-0 cursor-default sm:max-w-[280px] xl:max-w-[252px]">
        {article}
      </div>
    );
  }

  return (
    <Link
      className="group block w-full max-w-[320px] min-w-0 cursor-pointer sm:max-w-[280px] xl:max-w-[252px]"
      href={href}
    >
      {article}
    </Link>
  );
}

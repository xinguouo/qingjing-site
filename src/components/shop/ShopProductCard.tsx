import type {SanityImageSource} from "@sanity/image-url";
import Link from "next/link";

import {urlForImage} from "@/sanity/image";

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

export function ShopProductCard({
  category,
  emptyLabel,
  href,
  image,
  index,
  title,
}: {
  category: string;
  emptyLabel: string;
  href: string | null;
  image: SanityImage;
  index: string;
  title: string;
}) {
  const src = imageUrl(image, 760);
  const content = (
    <article className="w-full min-w-0">
      <div className="flex w-full items-center justify-center bg-white dark:bg-[#111]">
        {src ? (
          <img
            alt={title}
            className="block h-auto w-full object-contain"
            loading="lazy"
            src={src}
          />
        ) : (
          <div className="image-placeholder flex min-h-[180px] w-full items-center justify-center px-4 py-10 text-center text-xs text-muted-token">
            {emptyLabel}
          </div>
        )}
      </div>

      <div className="pt-3.5">
        <p className="text-[12px] leading-none text-[#777] dark:text-white/52">
          {index}
        </p>
        {category ? (
          <p className="mt-2 line-clamp-1 text-[12px] leading-none text-[#8a8a8a] dark:text-white/56">
            {category}
          </p>
        ) : null}
        <h3 className="mt-2 line-clamp-2 font-title text-[16px] font-normal leading-snug text-primary">
          {title}
        </h3>
      </div>
    </article>
  );

  if (!href) {
    return (
      <div className="block w-full max-w-[320px] min-w-0 cursor-default sm:max-w-[200px]">
        {content}
      </div>
    );
  }

  return (
    <Link
      className="block w-full max-w-[320px] min-w-0 cursor-pointer sm:max-w-[200px]"
      href={href}
    >
      {content}
    </Link>
  );
}

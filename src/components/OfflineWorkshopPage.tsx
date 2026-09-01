import type {SanityImageSource} from "@sanity/image-url";
import Link from "next/link";

import type {Locale} from "@/config/navigation";
import {client} from "@/sanity/client";
import {urlForImage} from "@/sanity/image";
import {offlineWorkshopsQuery} from "@/sanity/queries";

import {AppShell} from "./AppShell";
import {PageContainer} from "./PageContainer";
import {PageHeader} from "./PageHeader";

type SanityImage = SanityImageSource | null | undefined;

type OfflineWorkshop = {
  _id: string;
  category?: string | null;
  contact?: string | null;
  coverImage?: SanityImage;
  price?: string | null;
  schedule?: string | null;
  shortDescription?: string | null;
  slug?: string | null;
  tag?: string | null;
  title?: string | null;
};

type OfflineWorkshopPageProps = {
  locale: Locale;
};

const copy = {
  zh: {
    emptyImage: "海报待上传",
    eyebrow: "OFFLINE WORKSHOP",
    intro:
      "探索玻璃材料与工艺的创作过程，通过亲手制作体验玻璃材料的独特魅力。",
    reserve: "立即预约",
    sectionTitle: "精选体验",
    tagFallback: "手作体验",
    title: "线下体验",
  },
  en: {
    emptyImage: "Poster pending",
    eyebrow: "OFFLINE WORKSHOP",
    intro:
      "Explore the glassmaking process through hands-on workshops and experience the unique material charm of glass.",
    reserve: "Book Now",
    sectionTitle: "Featured Experiences",
    tagFallback: "Workshop",
    title: "Offline Experience",
  },
} satisfies Record<Locale, Record<string, string>>;

const fallbackWorkshops: Record<Locale, OfflineWorkshop[]> = {
  zh: [
    {
      _id: "offline-workshop-glass-mosaic",
      category: "玻璃马赛克",
      price: "¥380",
      schedule: "周一至周日开放",
      shortDescription:
        "从玻璃材料认识开始，通过拼贴、组合等方式完成个人作品。",
      slug: "glass-mosaic-handmade",
      tag: "手作体验",
      title: "玻璃手作马赛克",
    },
    {
      _id: "offline-workshop-glass-painting",
      category: "玻璃彩绘",
      price: "¥380",
      schedule: "周一至周日开放",
      shortDescription:
        "在透明玻璃表面进行图案绘制，体验色彩与光线的变化。",
      slug: "glass-painting-handmade",
      tag: "手作体验",
      title: "玻璃彩绘手作",
    },
    {
      _id: "offline-workshop-lampworking",
      category: "玻璃灯工",
      price: "¥380",
      schedule: "周一至周日开放",
      shortDescription:
        "在专业指导下认识火焰与玻璃的关系，完成小型灯工作品。",
      slug: "lampworking-handmade",
      tag: "手作体验",
      title: "玻璃灯工手作体验",
    },
    {
      _id: "offline-workshop-glass-blowing",
      category: "玻璃吹制",
      price: "¥380",
      schedule: "周一至周日开放",
      shortDescription:
        "观察并体验热玻璃吹制流程，感受玻璃从熔融到成型的过程。",
      slug: "glass-blowing-handmade",
      tag: "手作体验",
      title: "玻璃吹制手作体验",
    },
  ],
  en: [
    {
      _id: "offline-workshop-glass-mosaic",
      category: "Glass Mosaic",
      price: "¥380",
      schedule: "Open Monday to Sunday",
      shortDescription:
        "Start with glass materials and complete a personal work through collage and composition.",
      slug: "glass-mosaic-handmade",
      tag: "Workshop",
      title: "Glass Mosaic Workshop",
    },
    {
      _id: "offline-workshop-glass-painting",
      category: "Glass Painting",
      price: "¥380",
      schedule: "Open Monday to Sunday",
      shortDescription:
        "Paint patterns on transparent glass and experience the shift of color and light.",
      slug: "glass-painting-handmade",
      tag: "Workshop",
      title: "Glass Painting Workshop",
    },
    {
      _id: "offline-workshop-lampworking",
      category: "Lampworking",
      price: "¥380",
      schedule: "Open Monday to Sunday",
      shortDescription:
        "Learn the relationship between flame and glass with guided small-scale lampworking.",
      slug: "lampworking-handmade",
      tag: "Workshop",
      title: "Lampworking Experience",
    },
    {
      _id: "offline-workshop-glass-blowing",
      category: "Glass Blowing",
      price: "¥380",
      schedule: "Open Monday to Sunday",
      shortDescription:
        "Observe and experience hot glass blowing from molten glass to final form.",
      slug: "glass-blowing-handmade",
      tag: "Workshop",
      title: "Glass Blowing Experience",
    },
  ],
};

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

export function EventCard({
  locale,
  workshop,
}: {
  locale: Locale;
  workshop: OfflineWorkshop;
}) {
  const labels = copy[locale];
  const title = compactText(workshop.title) || labels.title;
  const description = compactText(workshop.shortDescription);
  const tag = compactText(workshop.tag) || labels.tagFallback;
  const schedule = compactText(workshop.schedule);
  const price = compactText(workshop.price);
  const href = workshop.slug
    ? `/${locale}/events/offline-workshop/${workshop.slug}`
    : `/${locale}/events/offline-experience`;
  const src = imageUrl(workshop.coverImage, 720);

  return (
    <Link className="group block min-w-0" href={href}>
      <article className="event-card-interactive flex h-full min-h-[430px] flex-col overflow-hidden rounded-[18px] border border-transparent bg-transparent">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-[rgba(255,255,255,0.58)] shadow-[0_10px_22px_rgba(0,0,0,0.035)] dark:bg-[rgba(255,255,255,0.06)]">
          {src ? (
            <img
              alt={title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
              loading="lazy"
              src={src}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center border border-[var(--border)] text-xs text-muted-token">
              {labels.emptyImage}
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            <span className="bg-white/92 px-3 py-1 text-[12px] leading-none text-primary shadow-sm dark:bg-black/55 dark:text-white/86">
              {tag}
            </span>
            {workshop.category ? (
              <span className="bg-black/86 px-3 py-1 text-[12px] leading-none text-white shadow-sm dark:bg-white/16">
                {workshop.category}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-title line-clamp-2 text-[21px] font-normal leading-tight text-primary">
              {title}
            </h3>
            {price ? (
              <p className="shrink-0 text-[20px] leading-tight text-secondary">
                {price}
              </p>
            ) : null}
          </div>

          {description ? (
            <p className="mt-3 line-clamp-3 text-[14px] leading-[1.7] text-secondary">
              {description}
            </p>
          ) : null}

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5 text-[13px]">
            <span className="line-clamp-1 text-muted-token">{schedule}</span>
            <span className="shrink-0 font-medium text-primary">
              {labels.reserve} →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export async function OfflineWorkshopPage({locale}: OfflineWorkshopPageProps) {
  const workshops = await client
    .withConfig({useCdn: false})
    .fetch<OfflineWorkshop[]>(
      offlineWorkshopsQuery,
      {locale},
      {cache: "no-store"},
    );
  const labels = copy[locale];
  const items = workshops.length ? workshops : fallbackWorkshops[locale];

  return (
    <AppShell locale={locale}>
      <PageContainer className="pb-16 lg:pb-20">
        <div className="max-w-[1120px]">
          <PageHeader titleEn={labels.eyebrow} titleZh={labels.title} />
          <p className="mt-5 max-w-[620px] text-[15px] leading-[1.85] text-secondary">
            {labels.intro}
          </p>
        </div>

        <section className="mt-10 max-w-[1280px] lg:mt-12">
          <h2 className="font-title text-[26px] font-normal leading-tight text-primary lg:text-[32px]">
            {labels.sectionTitle}
          </h2>
          <div className="mt-7 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((workshop) => (
              <EventCard
                key={workshop._id}
                locale={locale}
                workshop={workshop}
              />
            ))}
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}

import type { SanityImageSource } from "@sanity/image-url";
import Link from "next/link";

import type { Locale } from "@/config/navigation";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import {
  advancedStudyPageQuery,
  advancedStudyProgramsQuery,
  internationalMasterclassProgramsQuery,
  studyMasterclassPageQuery,
  studyProgramBySlugQuery,
} from "@/sanity/queries";

import { AppShell } from "./AppShell";
import { HeroBanner } from "./HeroBanner";
import { PageContainer } from "./PageContainer";
import { PageHeader } from "./PageHeader";
import { PastReviewCarousel, type PastReviewItem } from "./PastReviewCarousel";
import { glassStyle } from "../../styles/glassStyle";

type SanityImage = SanityImageSource | null | undefined;

export type StudyProgram = {
  _id: string;
  academicHost?: string | null;
  academicSupport?: string | null;
  courseIntro?: string | null;
  courseSection?: "featured" | "past" | null;
  coverImage?: SanityImage;
  description?: string | null;
  faculty?: string | null;
  posterImage?: SanityImage;
  programType?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  title?: string | null;
};

type CourseTeacher = {
  _id?: string;
  bio?: string | null;
  name?: string | null;
  portrait?: SanityImage;
  role?: string | null;
  slug?: string | null;
};

type StudyProgramDetail = StudyProgram & {
  accommodation?: string | null;
  academicHost?: string | null;
  academicAffairs?: string | null;
  certificate?: string | null;
  contactInfo?: string | null;
  content?: DetailValue;
  courseImages?: SanityImage[] | null;
  courseModules?: CourseModule[] | null;
  fileResources?: FileResource[] | null;
  heroImage?: SanityImage;
  programType?: string | null;
  relatedCourses?: StudyProgram[] | null;
  registrationPayment?: string | null;
  targetAudience?: string | null;
  teacherTeam?: string | null;
  titleEn?: string | null;
  titleZh?: string | null;
};

type FileResource = {
  _key?: string;
  externalUrl?: string | null;
  file?: {
    asset?: {
      _id?: string;
      mimeType?: string | null;
      originalFilename?: string | null;
      size?: number | null;
      url?: string | null;
    } | null;
  } | null;
  title?: string | null;
  type?: string | null;
};

type CourseModule = {
  _key?: string;
  description?: string | null;
  images?: SanityImage[] | null;
  number?: string | null;
  title?: string | null;
};

type CourseScheduleItem = {
  _key?: string;
  description?: string | null;
  images?: SanityImage[] | null;
  title?: string | null;
};

type CourseTeacherItem = {
  _key?: string;
  description?: string | null;
  image?: SanityImage;
  name?: string | null;
  role?: string | null;
};

type CourseFeatureItem = {
  _key?: string;
  description?: string | null;
  title?: string | null;
};

type PortableTextSpan = {
  _key?: string;
  _type?: string;
  marks?: string[];
  text?: string;
};

type PortableTextBlock = {
  _key?: string;
  _type?: string;
  children?: PortableTextSpan[];
  listItem?: string;
  level?: number;
  markDefs?: Array<{
    _key?: string;
    _type?: string;
    href?: string;
  }>;
  style?: string;
};

type DetailValue = string | PortableTextBlock[] | null | undefined;

type StudyPageProps = {
  locale: Locale;
};

type StudyMasterclassPageData = {
  pastReviewItems?: PastReviewItem[] | null;
  pastReviewTitle?: string | null;
};

type AdvancedStudyPageData = {
  pageTitleEn?: string | null;
  pageTitleZh?: string | null;
  pastReviewItems?: PastReviewItem[] | null;
  pastReviewTitle?: string | null;
};

function masterclassPastReviewFallback(
  programs: StudyProgram[],
): PastReviewItem[] {
  return programs
    .map((program, index) => {
      const image = program.coverImage || program.posterImage;

      if (!image) {
        return null;
      }

      return {
        _key: `masterclass-review-${program._id || program.slug || index}`,
        description: program.shortDescription || program.description || null,
        image,
        title: program.title || null,
      } satisfies PastReviewItem;
    })
    .filter(Boolean) as PastReviewItem[];
}

const copy = {
  zh: {
    academicHost: "\u5b66\u672f\u4e3b\u6301",
    academicAffairs: "\u6559\u52a1\u4fe1\u606f",
    academicSupport: "\u5b66\u672f\u652f\u6301",
    accommodation: "\u98df\u5bbf\u53ca\u5176\u4ed6",
    advancedStudyBack: "\u8fd4\u56de\u9ad8\u7ea7\u7814\u5b66",
    advancedStudyEyebrow: "ADVANCED STUDY",
    advancedStudyTitle: "\u9ad8\u7ea7\u7814\u5b66",
    assistant: "\u8bfe\u7a0b\u52a9\u6559",
    downloadFile: "\u4e0b\u8f7d\u6587\u4ef6",
    empty: "\u5185\u5bb9\u5f85\u66f4\u65b0",
    courseName: "\u8bfe\u7a0b\u540d\u79f0",
    educationInfo: "\u6559\u80b2\u4fe1\u606f",
    featuredCourses: "\u7cbe\u9009\u8bfe\u7a0b",
    instructorLabel:
      "\u5b66\u672f\u4e3b\u6301 / \u6388\u8bfe\u6559\u5e08\u56e2\u961f",
    location: "\u6388\u8bfe\u5730\u70b9",
    contact: "\u8054\u7cfb\u65b9\u5f0f",
    courseModules: "\u8bfe\u7a0b\u8bbe\u7f6e",
    courseGoal: "\u8bfe\u7a0b\u76ee\u6807",
    courseIntro: "\u8bfe\u7a0b\u4ecb\u7ecd",
    courseTime: "\u8bfe\u7a0b\u65f6\u95f4",
    courseType: "\u8bfe\u7a0b\u7c7b\u578b",
    courseDuration: "\u8bfe\u7a0b\u5468\u671f",
    classSize: "\u62db\u751f\u4eba\u6570",
    gallery: "\u8bfe\u7a0b\u56fe\u7247",
    imagePending: "\u56fe\u7247\u5f85\u4e0a\u4f20",
    openFile: "\u67e5\u770b\u6587\u4ef6",
    masterclassEyebrow: "INTERNATIONAL MASTERCLASS",
    masterclassTitle: "\u56fd\u9645\u5927\u5e08\u73ed",
    pastCourses: "\u5f80\u671f\u8bfe\u7a0b",
    pastReview: "\u5f80\u671f\u56de\u987e",
    price: "\u8bfe\u7a0b\u8d39\u7528",
    registrationMethod: "\u62a5\u540d\u65b9\u5f0f",
    registrationPayment: "\u62a5\u540d\u53ca\u7f34\u8d39\u65b9\u5f0f",
    registrationQr: "\u62a5\u540d\u4e8c\u7ef4\u7801",
    relatedCourses: "\u66f4\u591a\u8bfe\u7a0b",
    resources: "\u8bfe\u7a0b\u8d44\u6599",
    schedule: "\u6559\u5b66\u5b89\u6392",
    targetAudience: "\u9002\u5408\u4eba\u7fa4",
    teacherTeam: "\u6388\u8bfe\u6559\u5e08\u56e2\u961f",
    certificate: "\u7ed3\u4e1a\u8bc1\u4e66",
    teacher: "\u6388\u8bfe\u6559\u5e08",
  },
  en: {
    academicHost: "Academic Host",
    academicAffairs: "Academic Affairs",
    academicSupport: "Academic Support",
    accommodation: "Accommodation and Others",
    advancedStudyBack: "Back to Advanced Study",
    advancedStudyEyebrow: "ADVANCED STUDY",
    advancedStudyTitle: "Advanced Study",
    assistant: "Assistant",
    contact: "Contact",
    courseModules: "Course Setting",
    courseGoal: "Course Goals",
    courseIntro: "Course Introduction",
    courseTime: "Course Time",
    courseType: "Course Type",
    courseDuration: "Course Duration",
    classSize: "Class Size",
    courseName: "Course Name",
    downloadFile: "Download File",
    educationInfo: "Education Info",
    empty: "Content pending",
    featuredCourses: "Featured Courses",
    gallery: "Course Gallery",
    instructorLabel: "Academic Host / Faculty",
    imagePending: "Image pending",
    openFile: "View File",
    location: "Location",
    masterclassEyebrow: "INTERNATIONAL MASTERCLASS",
    masterclassTitle: "International Masterclass",
    pastCourses: "Past Courses",
    pastReview: "Past Review",
    price: "Price",
    registrationMethod: "Registration Method",
    registrationPayment: "Registration and Payment",
    registrationQr: "Registration QR Code",
    relatedCourses: "More Courses",
    resources: "Course Resources",
    schedule: "Schedule",
    targetAudience: "Target Audience",
    teacher: "Teacher",
    teacherTeam: "Teaching Team",
    certificate: "Certificate",
  },
} satisfies Record<Locale, Record<string, string>>;

function compactText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function hasPortableText(value: DetailValue) {
  if (Array.isArray(value)) {
    return value.some((block) =>
      block.children?.some((child) => compactText(child.text)),
    );
  }

  if (typeof value === "string") {
    return Boolean(compactText(value));
  }

  return false;
}

function portableChildrenText(block: PortableTextBlock) {
  return (
    block.children
      ?.map((child) => child.text || "")
      .join("")
      .trim() || ""
  );
}

function hasDetailValue(value: DetailValue) {
  if (Array.isArray(value)) {
    return value.some((block) => compactText(portableChildrenText(block)));
  }

  return Boolean(compactText(value));
}

function renderPortableChildren(block: PortableTextBlock) {
  return (block.children || []).map((child, index) => {
    const text = child.text || "";
    const key = child._key || index;
    const linkMark = child.marks
      ?.map((mark) => block.markDefs?.find((definition) => definition._key === mark))
      .find((definition) => definition?._type === "link" && definition.href);

    let content = <span>{text}</span>;

    if (child.marks?.includes("strong")) {
      content = (
        <strong className="font-medium text-primary" key={key}>
          {text}
        </strong>
      );
    }

    if (child.marks?.includes("em")) {
      content = <em>{text}</em>;
    }

    if (linkMark?.href) {
      return (
        <Link
          className="text-primary underline decoration-current/35 underline-offset-4 transition hover:decoration-current"
          href={linkMark.href}
          key={key}
          rel="noreferrer"
          target={linkMark.href.startsWith("http") ? "_blank" : undefined}
        >
          {content}
        </Link>
      );
    }

    return <span key={key}>{content}</span>;
  });
}

function firstTextLine(value: string | null | undefined) {
  return (
    compactText(value)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean) || ""
  );
}

function preferRichText(
  richText: DetailValue,
  fallback: DetailValue,
): DetailValue {
  return hasPortableText(richText) ? richText : fallback;
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

function imageCaption(image: SanityImage, locale: Locale) {
  if (!image || typeof image !== "object") {
    return "";
  }

  const imageWithCaption = image as {
    caption?: string | null;
    captionEn?: string | null;
    captionZh?: string | null;
  };

  return compactText(
    locale === "en"
      ? imageWithCaption.captionEn ||
          imageWithCaption.caption ||
          imageWithCaption.captionZh
      : imageWithCaption.captionZh ||
          imageWithCaption.caption ||
          imageWithCaption.captionEn,
  );
}

function CourseCardPoster({
  image,
  label,
  title,
}: {
  image: SanityImage;
  label: string;
  title: string;
}) {
  const src = imageUrl(image, 680);

  return (
    <div
      className={`${glassStyle.imageFrame} image-placeholder flex h-[168px] w-[118px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[rgba(255,255,255,0.56)] sm:h-[184px] sm:w-[130px] dark:bg-[rgba(255,255,255,0.06)]`}
    >
      {src ? (
        <img
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
          src={src}
        />
      ) : (
        <span className="px-4 text-center text-xs text-muted-token">
          {label}
        </span>
      )}
    </div>
  );
}

export function CourseCard({
  href,
  locale,
  metaLabel,
  metaValue,
  program,
  hrefPrefix = "/study/masterclass",
}: {
  href?: string | null;
  locale: Locale;
  metaLabel?: string | null;
  metaValue?: string | null;
  program: StudyProgram;
  hrefPrefix?: string;
}) {
  const labels = copy[locale];
  const title = compactText(program.title) || labels.empty;
  const intro = compactText(
    program.shortDescription || program.description || program.courseIntro,
  );
  const academicSupport = firstTextLine(
    metaValue ||
      program.academicSupport ||
      program.academicHost ||
      program.faculty,
  );
  const academicSupportLabel = compactText(metaLabel) || labels.academicSupport;
  const cardHref =
    href === undefined
      ? program.slug
        ? `/${locale}${hrefPrefix}/${program.slug}`
        : null
      : href;
  const content = (
    <>
      <CourseCardPoster
        image={program.posterImage || program.coverImage}
        label={labels.imagePending}
        title={title}
      />
      <div className="flex min-w-0 flex-1 flex-col py-0.5 pl-4 pr-1 sm:pl-5">
        <h3 className="font-title line-clamp-2 text-[19px] font-normal leading-snug text-primary sm:text-[21px]">
          {title}
        </h3>
        {academicSupport ? (
          <div className="mt-3">
            <p className="text-[13px] leading-none text-muted-token">
              {academicSupportLabel}
            </p>
            <p className="mt-2 line-clamp-1 text-[14px] leading-[1.55] text-primary">
              {academicSupport}
            </p>
          </div>
        ) : null}
        {intro ? (
          <p className="mt-auto overflow-hidden pt-4 text-[13px] leading-[1.6] text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {intro}
          </p>
        ) : null}
      </div>
    </>
  );
  const className = `${glassStyle.card} ${glassStyle.cardHover} group flex h-[210px] w-full overflow-hidden rounded-[20px] p-4 transition duration-200 sm:h-[220px] sm:p-5`;

  return cardHref ? (
    <Link className={className} href={cardHref}>
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  );
}

function ProgramSection({
  hrefPrefix,
  locale,
  programs,
  title,
}: {
  hrefPrefix?: string;
  locale: Locale;
  programs: StudyProgram[];
  title: string;
}) {
  if (programs.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 lg:mt-12">
      <h2 className="font-title text-[26px] font-normal leading-tight text-primary lg:text-[32px]">
        {title}
      </h2>
      <div className="mt-5 grid max-w-[1280px] gap-5 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => (
          <CourseCard
            hrefPrefix={hrefPrefix}
            key={program._id}
            locale={locale}
            program={program}
          />
        ))}
      </div>
    </section>
  );
}

function DetailPoster({
  image,
  label,
  title,
}: {
  image: SanityImage;
  label: string;
  title: string;
}) {
  const src = imageUrl(image, 900);

  return (
    <div className="image-placeholder flex aspect-[3/4] w-full max-w-[310px] items-center justify-center overflow-hidden rounded-[18px] bg-[rgba(255,255,255,0.58)] dark:bg-[rgba(255,255,255,0.06)]">
      {src ? (
        <img
          alt={title}
          className="h-full w-full object-contain"
          loading="eager"
          src={src}
        />
      ) : (
        <span className="px-5 text-center text-xs text-muted-token">
          {label}
        </span>
      )}
    </div>
  );
}

function DetailText({
  className = "",
  text,
}: {
  className?: string;
  text: DetailValue;
}) {
  if (Array.isArray(text)) {
    const blocks = text.filter((block) => portableChildrenText(block));

    if (!blocks.length) {
      return null;
    }

    return (
      <div
        className={`space-y-3 text-[15px] leading-[1.85] text-secondary ${className}`}
      >
        {blocks.map((block, index) => {
          const children = renderPortableChildren(block);

          if (block.listItem) {
            const marker =
              block.listItem === "number" ? `${index + 1}.` : "-";

            return (
              <p
                className="pl-5 [text-indent:-1.25rem]"
                key={block._key || index}
              >
                <span className="pr-2">{marker}</span>
                {children}
              </p>
            );
          }

          if (block.style === "h2" || block.style === "h3" || block.style === "h4") {
            return (
              <h3
                className="pt-2 text-[16px] font-medium leading-7 text-primary"
                key={block._key || index}
              >
                {children}
              </h3>
            );
          }

          return (
            <p className="whitespace-pre-line" key={block._key || index}>
              {children}
            </p>
          );
        })}
      </div>
    );
  }

  const value = compactText(text);

  if (!value) {
    return null;
  }

  return (
    <p
      className={`whitespace-pre-line text-[15px] leading-[1.85] text-secondary ${className}`}
    >
      {value}
    </p>
  );
}

function CourseMetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-[var(--border)] bg-[rgba(255,255,255,0.42)] px-4 py-3 dark:bg-[rgba(255,255,255,0.04)]">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-token">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-line text-[14px] leading-6 text-secondary">
        {value}
      </p>
    </div>
  );
}

function CourseTextSection({
  title,
  value,
}: {
  title: string;
  value: string | null | undefined;
}) {
  const text = compactText(value);

  if (!text) {
    return null;
  }

  return (
    <section className="grid gap-4 border-t border-[var(--border)] pt-6 lg:grid-cols-[128px_minmax(0,1fr)]">
      <h2 className="font-title text-[20px] font-normal leading-snug text-primary">
        {title}
      </h2>
      <DetailText text={text} />
    </section>
  );
}

function TeacherCard({
  faculty,
  label,
  locale,
  teacher,
}: {
  faculty?: string | null;
  label: string;
  locale: Locale;
  teacher?: CourseTeacher | null;
}) {
  const name = compactText(teacher?.name);
  const role = compactText(teacher?.role);
  const bio = compactText(teacher?.bio);
  const facultyText = compactText(faculty);

  if (!name && !facultyText) {
    return null;
  }

  const portrait = imageUrl(teacher?.portrait, 520);
  const href = teacher?.slug ? `/${locale}/about/team/${teacher.slug}` : null;
  const content = (
    <article className="glass-card glass-card-hover flex flex-col gap-5 rounded-[22px] p-5 sm:flex-row sm:items-start lg:p-6">
      <div className="image-placeholder flex aspect-[4/5] w-full max-w-[160px] shrink-0 items-center justify-center overflow-hidden rounded-[16px]">
        {portrait ? (
          <img
            alt={name || label}
            className="h-full w-full object-cover"
            src={portrait}
          />
        ) : (
          <span className="px-3 text-center text-xs text-muted-token">
            {label}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-token">
          {label}
        </p>
        <h3 className="font-title mt-3 text-[24px] font-normal leading-snug text-primary">
          {name || facultyText}
        </h3>
        {role ? (
          <p className="mt-2 text-[14px] leading-6 text-muted-token">{role}</p>
        ) : null}
        {bio || (!name && facultyText) ? (
          <DetailText
            className="mt-4 max-w-[760px]"
            text={bio || facultyText}
          />
        ) : null}
      </div>
    </article>
  );

  return href ? (
    <Link className="block" href={href}>
      {content}
    </Link>
  ) : (
    content
  );
}

function CourseGallery({
  images,
  label,
  locale,
}: {
  images: SanityImage[];
  label: string;
  locale: Locale;
}) {
  const visibleImages = images
    .map((image) => ({
      caption: imageCaption(image, locale),
      src: imageUrl(image, 900),
    }))
    .filter((item): item is {caption: string; src: string} =>
      Boolean(item.src),
    );

  if (visibleImages.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 lg:mt-12">
      <h2 className="font-title text-[26px] font-normal leading-tight text-primary lg:text-[32px]">
        {label}
      </h2>
      <div className="mt-6 columns-1 gap-5 sm:columns-2 xl:columns-3">
        {visibleImages.map((item, index) => (
          <figure className="mb-5 break-inside-avoid" key={item.src}>
            <img
              alt={`${label} ${index + 1}`}
              className="w-full rounded-[18px] border border-[var(--border)] bg-[var(--card)] shadow-[0_14px_34px_rgba(0,0,0,0.055)]"
              loading="lazy"
              src={item.src}
            />
            {item.caption ? (
              <figcaption className="mt-3 whitespace-pre-line text-[13px] leading-[1.8] text-secondary">
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

function RegistrationInfo({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-3">
      {items.map((item) => (
        <article
          className="glass-card rounded-[18px] p-5 lg:p-6"
          key={item.label}
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-token">
            {item.label}
          </p>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-secondary">
            {item.value}
          </p>
        </article>
      ))}
    </section>
  );
}

function MasterclassHero({
  image,
  labels,
  titleEn,
  titleZh,
}: {
  image: SanityImage;
  labels: (typeof copy)[Locale];
  titleEn: string;
  titleZh: string;
}) {
  const subtitle =
    titleEn && titleEn !== titleZh && titleEn !== labels.masterclassEyebrow
      ? titleEn
      : null;

  return (
    <HeroBanner
      eyebrow={labels.masterclassEyebrow}
      image={image}
      subtitle={subtitle}
      title={titleZh || titleEn || labels.masterclassTitle}
    />
  );
}

function CourseInfoList({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-0">
      {items.map((item) => (
        <div
          className="border-b border-[var(--border)] py-4 first:border-t lg:py-5"
          key={item.label}
        >
          <p className="text-[10px] tracking-[0.18em] text-muted-token">
            {item.label}
          </p>
          <p className="mt-2 whitespace-pre-line text-[13px] leading-[1.7] text-primary">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function RelatedPrograms({
  includeLocalePrefix = true,
  labels,
  locale,
  programs,
}: {
  includeLocalePrefix?: boolean;
  labels: (typeof copy)[Locale];
  locale: Locale;
  programs?: StudyProgram[] | null;
}) {
  const items = (programs || []).filter((program) => program.slug);

  if (!items.length) {
    return null;
  }

  return (
    <section className="border-t border-[var(--border)] pt-6">
      <h2 className="font-title text-[20px] font-normal leading-tight text-primary">
        {labels.relatedCourses}
      </h2>
      <div className="mt-4 grid gap-3">
        {items.slice(0, 3).map((program) => {
          const title = compactText(program.title) || labels.empty;
          const src = imageUrl(program.coverImage || program.posterImage, 420);
          const href = `${includeLocalePrefix ? `/${locale}` : ""}/study/masterclass/${program.slug}`;

          return (
            <Link
              className="group grid grid-cols-[74px_minmax(0,1fr)] gap-3 rounded-[14px] border border-[var(--border)] bg-[rgba(255,255,255,0.4)] p-2.5 transition hover:border-primary/25 dark:bg-[rgba(255,255,255,0.04)]"
              href={href}
              key={program._id}
            >
              <div className="image-placeholder flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[10px]">
                {src ? (
                  <img
                    alt={title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                    src={src}
                  />
                ) : (
                  <span className="px-2 text-center text-[10px] text-muted-token">
                    {labels.imagePending}
                  </span>
                )}
              </div>
              <div className="min-w-0 py-1">
                <h3 className="font-title line-clamp-2 text-[16px] font-normal leading-snug text-primary">
                  {title}
                </h3>
                {program.shortDescription ? (
                  <p className="mt-2 line-clamp-2 text-[12px] leading-[1.55] text-secondary">
                    {program.shortDescription}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function DetailSection({
  title,
  value,
}: {
  title: string;
  value: DetailValue;
}) {
  const text = Array.isArray(value)
    ? hasPortableText(value)
      ? value
      : null
    : compactText(value);

  if (!text) {
    return null;
  }

  return (
    <section>
      <h2 className="font-title text-[22px] font-normal leading-tight text-primary">
        {title}
      </h2>
      <DetailText className="mt-4 max-w-[720px]" text={text} />
    </section>
  );
}

function CourseIntroduction({
  labels,
  title,
  value,
}: {
  labels: (typeof copy)[Locale];
  title?: string | null;
  value: DetailValue;
}) {
  return (
    <DetailSection
      title={compactText(title) || labels.courseIntro}
      value={value}
    />
  );
}

function AcademicSupport({
  labels,
  name,
  profile,
  value,
}: {
  labels: (typeof copy)[Locale];
  name: string | null | undefined;
  profile?: CourseTeacher | null;
  value: DetailValue;
}) {
  const supportName = compactText(name);
  const role = compactText(profile?.role);
  const bio = Array.isArray(value)
    ? hasPortableText(value)
      ? value
      : null
    : compactText(value);
  const portrait = imageUrl(profile?.portrait, 420);

  if (!supportName && !bio && !portrait) {
    return null;
  }

  return (
    <section>
      <h2 className="font-title text-[22px] font-normal leading-tight text-primary">
        {labels.academicHost}
      </h2>
      <div className="mt-5 flex max-w-[760px] flex-col gap-4 sm:flex-row sm:items-start">
        {portrait ? (
          <div className="image-placeholder w-[112px] shrink-0 overflow-hidden rounded-[16px]">
            <img
              alt={supportName || labels.academicHost}
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
              src={portrait}
            />
          </div>
        ) : null}
        <div className="min-w-0">
          {supportName ? (
            <p className="text-[15px] font-medium leading-7 text-primary">
              {supportName}
            </p>
          ) : null}
          {role ? (
            <p className="mt-1 text-[13px] leading-6 text-muted-token">
              {role}
            </p>
          ) : null}
          <DetailText className="mt-3 max-w-[650px]" text={bio} />
        </div>
      </div>
    </section>
  );
}

function TeacherTeam({
  fallbackText,
  labels,
  teachers,
}: {
  fallbackText?: string | null;
  labels: (typeof copy)[Locale];
  teachers?: CourseTeacherItem[] | null;
}) {
  const items = (teachers || []).filter(
    (teacher) =>
      compactText(teacher.name) ||
      compactText(teacher.role) ||
      compactText(teacher.description) ||
      teacher.image,
  );
  const fallback = compactText(fallbackText);

  if (!items.length && !fallback) {
    return null;
  }

  return (
    <section>
      <h2 className="font-title text-[22px] font-normal leading-tight text-primary">
        {labels.teacherTeam}
      </h2>
      {items.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {items.map((teacher, index) => {
            const name = compactText(teacher.name);
            const role = compactText(teacher.role);
            const description = compactText(teacher.description);
            const src = imageUrl(teacher.image, 520);

            return (
              <article
                className="glass-card flex gap-4 rounded-[18px] p-4"
                key={teacher._key || `${name}-${index}`}
              >
                <div className="image-placeholder flex h-[92px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-[12px]">
                  {src ? (
                    <img
                      alt={name || role || labels.teacher}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      src={src}
                    />
                  ) : (
                    <span className="px-2 text-center text-[10px] text-muted-token">
                      {labels.teacher}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  {role ? (
                    <p className="text-[11px] leading-5 text-muted-token">
                      {role}
                    </p>
                  ) : null}
                  {name ? (
                    <h3 className="font-title mt-1 text-[19px] font-normal leading-snug text-primary">
                      {name}
                    </h3>
                  ) : null}
                  {description ? (
                    <p className="mt-2 line-clamp-3 text-[13px] leading-[1.7] text-secondary">
                      {description}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <DetailText className="mt-4 max-w-[720px]" text={fallback} />
      )}
    </section>
  );
}

function ModuleImageGrid({
  images,
  locale,
  title,
}: {
  images: SanityImage[] | null | undefined;
  locale: Locale;
  title: string;
}) {
  const visibleImages = (images || [])
    .map((image) => ({
      caption: imageCaption(image, locale),
      src: imageUrl(image, 760),
    }))
    .filter((item): item is {caption: string; src: string} =>
      Boolean(item.src),
    );

  if (!visibleImages.length) {
    return null;
  }

  return (
    <div className="mt-5 grid gap-2.5 sm:grid-cols-3 lg:max-w-[640px]">
      {visibleImages.map((item, index) => (
        <figure key={`${item.src}-${index}`}>
          <img
            alt={`${title} ${index + 1}`}
            className="aspect-[4/3] w-full rounded-[4px] bg-[#211f1c] object-cover"
            loading="lazy"
            src={item.src}
          />
          {item.caption ? (
            <figcaption className="mt-2 whitespace-pre-line text-[12px] leading-[1.7] text-secondary">
              {item.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

function CourseScheduleBlock({
  index,
  locale,
  module,
}: {
  index: number;
  locale: Locale;
  module: CourseScheduleItem | CourseModule;
}) {
  const number =
    "number" in module && module.number
      ? compactText(module.number)
      : String(index + 1).padStart(2, "0");
  const title = compactText(module.title);
  const description = compactText(module.description);

  if (!number && !title && !description && !module.images?.length) {
    return null;
  }

  return (
    <article className="grid gap-4 border-t border-[var(--border)] py-7 sm:grid-cols-[50px_minmax(0,1fr)] lg:py-8">
      <p className="text-[12px] leading-7 text-muted-token">{number}</p>
      <div className="min-w-0">
        {title ? (
          <h3 className="text-[15px] font-semibold leading-7 text-primary">
            {title}
          </h3>
        ) : null}
        {description ? (
          <p className="mt-1 max-w-[660px] whitespace-pre-line text-[13px] leading-[1.8] text-secondary">
            {description}
          </p>
        ) : null}
        <ModuleImageGrid
          images={module.images}
          locale={locale}
          title={title || number}
        />
      </div>
    </article>
  );
}

function CourseWideImage({
  image,
  title,
}: {
  image: SanityImage;
  title: string;
}) {
  const src = imageUrl(image, 1280);

  if (!src) {
    return null;
  }

  return (
    <div className="mt-2 max-w-[760px] overflow-hidden rounded-[4px] bg-[#211f1c]">
      <img
        alt={title}
        className="aspect-[16/7] w-full object-cover"
        loading="lazy"
        src={src}
      />
    </div>
  );
}

function CourseModulesSection({
  labels,
  locale,
  modules,
}: {
  labels: (typeof copy)[Locale];
  locale: Locale;
  modules: Array<CourseScheduleItem | CourseModule>;
}) {
  if (!modules.length) {
    return null;
  }

  return (
    <section>
      <h2 className="font-title text-[24px] font-normal leading-tight text-primary">
        {labels.courseModules}
      </h2>
      <div className="mt-5">
        {modules.map((module, index) => (
          <CourseScheduleBlock
            index={index}
            key={module._key || `${index}-${module.title || "schedule"}`}
            locale={locale}
            module={module}
          />
        ))}
      </div>
    </section>
  );
}

function CourseDetailTextSection({
  title,
  value,
}: {
  title: string;
  value: DetailValue;
}) {
  const text = Array.isArray(value)
    ? hasPortableText(value)
      ? value
      : null
    : compactText(value);

  if (!text) {
    return null;
  }

  return (
    <section className="border-t border-[var(--border)] pt-8 first:border-t-0 first:pt-0">
      <h2 className="font-title text-[24px] font-normal leading-tight text-primary">
        {title}
      </h2>
      <DetailText
        className="mt-4 max-w-[780px] text-[16px] leading-[1.95]"
        text={text}
      />
    </section>
  );
}

function CourseIntroSection({
  labels,
  value,
}: {
  labels: (typeof copy)[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.courseIntro} value={value} />;
}

function AcademicHostSection({
  labels,
  value,
}: {
  labels: (typeof copy)[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.academicHost} value={value} />;
}

function TeacherTeamSection({
  labels,
  value,
}: {
  labels: (typeof copy)[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.teacherTeam} value={value} />;
}

function TargetAudienceSection({
  labels,
  value,
}: {
  labels: (typeof copy)[Locale];
  value: DetailValue;
}) {
  return (
    <CourseDetailTextSection title={labels.targetAudience} value={value} />
  );
}

function AcademicAffairsSection({
  labels,
  value,
}: {
  labels: (typeof copy)[Locale];
  value: DetailValue;
}) {
  return (
    <CourseDetailTextSection title={labels.academicAffairs} value={value} />
  );
}

function AccommodationSection({
  labels,
  value,
}: {
  labels: (typeof copy)[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.accommodation} value={value} />;
}

function CertificateSection({
  labels,
  value,
}: {
  labels: (typeof copy)[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.certificate} value={value} />;
}

function RegistrationPaymentSection({
  labels,
  value,
}: {
  labels: (typeof copy)[Locale];
  value: DetailValue;
}) {
  return (
    <CourseDetailTextSection title={labels.registrationPayment} value={value} />
  );
}

function ContactInfoSection({
  labels,
  value,
}: {
  labels: (typeof copy)[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.contact} value={value} />;
}

function fileUrl(resource: FileResource) {
  return compactText(resource.externalUrl) || compactText(resource.file?.asset?.url);
}

type CourseFileLabels = {
  downloadFile: string;
  openFile: string;
  resources: string;
};

function fileName(resource: FileResource, labels: CourseFileLabels) {
  return (
    compactText(resource.title) ||
    compactText(resource.file?.asset?.originalFilename) ||
    labels.resources
  );
}

function fileTypeLabel(resource: FileResource) {
  const explicitType = compactText(resource.type).toUpperCase();
  const mimeType = compactText(resource.file?.asset?.mimeType);
  const name = compactText(resource.file?.asset?.originalFilename);

  if (explicitType) {
    return explicitType;
  }

  if (mimeType.includes("pdf") || name.toLowerCase().endsWith(".pdf")) {
    return "PDF";
  }

  if (mimeType || name) {
    return mimeType || name.split(".").pop()?.toUpperCase() || "FILE";
  }

  return "LINK";
}

function AdvancedStudyImages({
  images,
  locale,
  title,
}: {
  images?: SanityImage[] | null;
  locale: Locale;
  title: string;
}) {
  const visibleImages = (images || [])
    .map((image) => ({
      caption: imageCaption(image, locale),
      src: imageUrl(image, 1400),
    }))
    .filter((item): item is { caption: string; src: string } =>
      Boolean(item.src),
    );

  if (!visibleImages.length) {
    return null;
  }

  return (
    <section className="mt-10 space-y-8 lg:mt-12">
      {visibleImages.map((item, index) => (
        <figure className="mx-auto max-w-full text-center" key={`${item.src}-${index}`}>
          <img
            alt={`${title} ${index + 1}`}
            className="mx-auto h-auto max-w-full rounded-[14px] border border-[var(--border)] bg-[var(--card)]"
            loading="lazy"
            src={item.src}
          />
          {item.caption ? (
            <figcaption className="mx-auto mt-3 max-w-[760px] whitespace-pre-line text-left text-[13px] leading-[1.8] text-secondary">
              {item.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </section>
  );
}

function AdvancedStudyFiles({
  labels,
  resources,
}: {
  labels: CourseFileLabels;
  resources?: FileResource[] | null;
}) {
  const items = (resources || [])
    .map((resource) => ({ resource, url: fileUrl(resource) }))
    .filter((item) => item.url);

  if (!items.length) {
    return null;
  }

  return (
    <section className="mt-10 border-t border-[var(--border)] pt-8 lg:mt-12">
      <h2 className="font-title text-[24px] font-normal leading-tight text-primary">
        {labels.resources}
      </h2>
      <div className="mt-5 space-y-5">
        {items.map(({ resource, url }, index) => {
          const title = fileName(resource, labels);
          const type = fileTypeLabel(resource);
          const key = resource._key || `${url}-${index}`;

          return (
            <article className="rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5" key={key}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="break-words text-[15px] font-medium leading-6 text-primary">
                    {title}
                  </h3>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-muted-token">
                    {type}
                  </p>
                </div>
                <div className="flex shrink-0 gap-4 text-[13px] text-muted-token">
                  <Link
                    className="transition hover:text-primary"
                    href={url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {labels.openFile}
                  </Link>
                  {resource.file?.asset?.url ? (
                    <Link
                      className="transition hover:text-primary"
                      download
                      href={resource.file.asset.url}
                    >
                      {labels.downloadFile}
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function CourseDetailContent({
  backHref,
  backLabel,
  content,
  fileLabels,
  images,
  locale,
  resources,
  title,
}: {
  backHref: string;
  backLabel: string;
  content?: DetailValue;
  fileLabels: CourseFileLabels;
  images?: SanityImage[] | null;
  locale: Locale;
  resources?: FileResource[] | null;
  title: string;
}) {
  return (
    <PageContainer className="pb-16 lg:pb-20">
      <Link
        className="inline-flex items-center gap-2 text-[14px] leading-none text-muted-token transition hover:text-primary"
        href={backHref}
      >
        <span aria-hidden="true">&larr;</span>
        <span>{backLabel}</span>
      </Link>

      <article className="mt-10 max-w-[980px]">
        <h1 className="font-title text-[34px] font-normal leading-tight text-primary lg:text-[48px]">
          {title}
        </h1>
        {hasDetailValue(content) ? (
          <DetailText
            className="mt-8 max-w-[860px] text-[16px] leading-[1.95]"
            text={content}
          />
        ) : null}
        <AdvancedStudyImages images={images} locale={locale} title={title} />
        <AdvancedStudyFiles labels={fileLabels} resources={resources} />
      </article>
    </PageContainer>
  );
}

export async function AdvancedStudyPage({ locale }: StudyPageProps) {
  const [programs, pageData] = await Promise.all([
    client.fetch<StudyProgram[]>(
      advancedStudyProgramsQuery,
      { locale },
      { cache: "no-store" },
    ),
    client.fetch<AdvancedStudyPageData | null>(
      advancedStudyPageQuery,
      { locale },
      { cache: "no-store" },
    ),
  ]);
  const labels = copy[locale];
  const pageTitleZh = compactText(pageData?.pageTitleZh) || labels.advancedStudyTitle;
  const pageTitleEn = compactText(pageData?.pageTitleEn) || labels.advancedStudyEyebrow;
  const pastReviewItems =
    pageData?.pastReviewItems?.filter(Boolean) || masterclassPastReviewFallback(programs);

  return (
    <AppShell locale={locale}>
      <PageContainer>
        <PageHeader
          titleEn={pageTitleEn}
          titleZh={pageTitleZh}
        />

        <ProgramSection
          hrefPrefix="/study/advanced-study"
          locale={locale}
          programs={programs}
          title={labels.featuredCourses}
        />

        <PastReviewCarousel
          className="mt-10 lg:mt-12"
          items={pastReviewItems}
          itemsPerViewDesktop={3}
          itemsPerViewMobile={1}
          locale={locale}
          title={compactText(pageData?.pastReviewTitle) || labels.pastReview}
        />
      </PageContainer>
    </AppShell>
  );
}

export async function AdvancedStudyDetailPage({
  locale,
  slug,
}: StudyPageProps & {
  slug: string;
}) {
  const program = await client.fetch<StudyProgramDetail | null>(
    studyProgramBySlugQuery,
    { locale, slug },
    { cache: "no-store" },
  );
  const labels = copy[locale];
  const item = program?.programType === "advanced-study" ? program : null;
  const title = compactText(item?.title) || labels.empty;
  const content = item?.content || item?.courseIntro || item?.description;

  return (
    <AppShell locale={locale}>
      <CourseDetailContent
        backHref={`/${locale}/study/advanced-study`}
        backLabel={labels.advancedStudyBack}
        content={content}
        fileLabels={labels}
        images={item?.courseImages}
        locale={locale}
        resources={item?.fileResources}
        title={title}
      />
    </AppShell>
  );
}

export async function MasterclassPage({ locale }: StudyPageProps) {
  const [programs, pageData] = await Promise.all([
    client.fetch<StudyProgram[]>(
      internationalMasterclassProgramsQuery,
      { locale },
      { cache: "no-store" },
    ),
    client.fetch<StudyMasterclassPageData | null>(
      studyMasterclassPageQuery,
      { locale },
      { cache: "no-store" },
    ),
  ]);
  const labels = copy[locale];
  const featuredPrograms = programs.filter(
    (program) => program.courseSection !== "past",
  );
  const pastPrograms = programs.filter(
    (program) => program.courseSection === "past",
  );
  const configuredPastReviews =
    pageData?.pastReviewItems?.filter(Boolean) || [];
  const pastReviewItems = configuredPastReviews.length
    ? configuredPastReviews
    : masterclassPastReviewFallback(programs);

  return (
    <AppShell locale={locale}>
      <PageContainer>
        <PageHeader
          titleEn={labels.masterclassEyebrow}
          titleZh={labels.masterclassTitle}
        />

        {programs.length > 0 ? (
          <>
            <ProgramSection
              locale={locale}
              programs={featuredPrograms}
              title={labels.featuredCourses}
            />
            <ProgramSection
              locale={locale}
              programs={pastPrograms}
              title={labels.pastCourses}
            />
          </>
        ) : (
          <div className="glass-card mt-8 rounded-[18px] p-6 text-sm leading-7 text-muted-token">
            {labels.empty}
          </div>
        )}

        <PastReviewCarousel
          className="mt-10 lg:mt-12"
          items={pastReviewItems}
          itemsPerViewDesktop={3}
          itemsPerViewMobile={1}
          locale={locale}
          title={compactText(pageData?.pastReviewTitle) || labels.pastReview}
        />
      </PageContainer>
    </AppShell>
  );
}

export async function MasterclassDetailPage({
  locale,
  slug,
}: StudyPageProps & {
  slug: string;
}) {
  const program = await client.fetch<StudyProgramDetail | null>(
    studyProgramBySlugQuery,
    { locale, slug },
    { cache: "no-store" },
  );
  const labels = copy[locale];
  const isMasterclass = program?.programType === "international-masterclass";
  const item = isMasterclass ? program : null;
  const title = compactText(item?.title) || labels.empty;
  const titleZh = compactText(item?.titleZh) || title;
  const titleEn = compactText(item?.titleEn) || titleZh;
  const intro = item?.courseIntro || item?.description;
  const courseModules =
    item?.courseModules?.filter(
      (module) =>
        compactText(module.title) ||
        compactText(module.description) ||
        module.images?.length,
    ) || [];
  const registrationPayment = item?.registrationPayment;
  const contactInfo = item?.contactInfo;
  const heroImage = item?.heroImage;

  return (
    <AppShell locale={locale}>
      <div className="page-surface">
        <MasterclassHero
          image={heroImage}
          labels={labels}
          titleEn={titleEn}
          titleZh={titleZh}
        />

        <PageContainer
          minHeight={false}
          className="pb-14 pt-9 lg:pb-16 lg:pt-11"
        >
          <div className="grid max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(240px,3fr)] lg:items-start lg:gap-12">
            <div className="min-w-0 space-y-10">
              <CourseIntroSection labels={labels} value={intro} />
              <AcademicHostSection labels={labels} value={item?.academicHost} />
              <TeacherTeamSection labels={labels} value={item?.teacherTeam} />
              <CourseModulesSection
                labels={labels}
                locale={locale}
                modules={courseModules}
              />
              <div className="space-y-9">
                <TargetAudienceSection
                  labels={labels}
                  value={item?.targetAudience}
                />
                <AcademicAffairsSection
                  labels={labels}
                  value={item?.academicAffairs}
                />
                <AccommodationSection
                  labels={labels}
                  value={item?.accommodation}
                />
                <CertificateSection labels={labels} value={item?.certificate} />
                <RegistrationPaymentSection
                  labels={labels}
                  value={registrationPayment}
                />
                <ContactInfoSection labels={labels} value={contactInfo} />
              </div>
            </div>

            <aside className="order-last lg:sticky lg:top-[88px] lg:pt-1">
              <RelatedPrograms
                labels={labels}
                locale={locale}
                programs={item?.relatedCourses}
              />
            </aside>
          </div>
        </PageContainer>
      </div>
    </AppShell>
  );
}

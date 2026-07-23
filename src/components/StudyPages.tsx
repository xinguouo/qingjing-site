import type { SanityImageSource } from "@sanity/image-url";
import Link from "next/link";

import type { Locale } from "@/config/navigation";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import {
  internationalMasterclassProgramsQuery,
  studyProgramBySlugQuery,
} from "@/sanity/queries";

import { AppShell } from "./AppShell";
import { HeroBanner } from "./HeroBanner";
import { PageContainer } from "./PageContainer";
import { PageHeader } from "./PageHeader";
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
  courseModules?: CourseModule[] | null;
  heroImage?: SanityImage;
  programType?: string | null;
  relatedCourses?: StudyProgram[] | null;
  registrationPayment?: string | null;
  targetAudience?: string | null;
  teacherTeam?: string | null;
  titleEn?: string | null;
  titleZh?: string | null;
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
  style?: string;
};

type DetailValue = string | PortableTextBlock[] | null | undefined;

type StudyPageProps = {
  locale: Locale;
};

const copy = {
  zh: {
    academicHost: "\u5b66\u672f\u4e3b\u6301",
    academicAffairs: "\u6559\u52a1\u4fe1\u606f",
    academicSupport: "\u5b66\u672f\u652f\u6301",
    accommodation: "\u98df\u5bbf\u53ca\u5176\u4ed6",
    assistant: "\u8bfe\u7a0b\u52a9\u6559",
    empty: "\u5185\u5bb9\u5f85\u66f4\u65b0",
    courseName: "\u8bfe\u7a0b\u540d\u79f0",
    educationInfo: "\u6559\u80b2\u4fe1\u606f",
    featuredCourses: "\u7cbe\u9009\u8bfe\u7a0b",
    instructorLabel: "\u5b66\u672f\u4e3b\u6301 / \u6388\u8bfe\u6559\u5e08\u56e2\u961f",
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
    masterclassEyebrow: "INTERNATIONAL MASTERCLASS",
    masterclassTitle: "\u56fd\u9645\u5927\u5e08\u73ed",
    pastCourses: "\u5f80\u671f\u8bfe\u7a0b",
    price: "\u8bfe\u7a0b\u8d39\u7528",
    registrationMethod: "\u62a5\u540d\u65b9\u5f0f",
    registrationPayment: "\u62a5\u540d\u53ca\u7f34\u8d39\u65b9\u5f0f",
    registrationQr: "\u62a5\u540d\u4e8c\u7ef4\u7801",
    relatedCourses: "\u66f4\u591a\u8bfe\u7a0b",
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
    educationInfo: "Education Info",
    empty: "Content pending",
    featuredCourses: "Featured Courses",
    gallery: "Course Gallery",
    instructorLabel: "Academic Host / Faculty",
    imagePending: "Image pending",
    location: "Location",
    masterclassEyebrow: "INTERNATIONAL MASTERCLASS",
    masterclassTitle: "International Masterclass",
    pastCourses: "Past Courses",
    price: "Price",
    registrationMethod: "Registration Method",
    registrationPayment: "Registration and Payment",
    registrationQr: "Registration QR Code",
    relatedCourses: "More Courses",
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

function firstTextLine(value: string | null | undefined) {
  return compactText(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) || "";
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
    <div className={`${glassStyle.imageFrame} image-placeholder flex h-[168px] w-[118px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[rgba(255,255,255,0.56)] sm:h-[184px] sm:w-[130px] dark:bg-[rgba(255,255,255,0.06)]`}>
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
  locale,
  program,
  hrefPrefix = "/study/masterclass",
}: {
  locale: Locale;
  program: StudyProgram;
  hrefPrefix?: string;
}) {
  const labels = copy[locale];
  const title = compactText(program.title) || labels.empty;
  const intro = compactText(
    program.shortDescription || program.description || program.courseIntro,
  );
  const academicSupport = firstTextLine(
    program.academicSupport || program.academicHost || program.faculty,
  );
  const href = program.slug ? `/${locale}${hrefPrefix}/${program.slug}` : null;
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
        {intro ? (
          <p className="mt-2.5 overflow-hidden text-[13px] leading-[1.55] text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {intro}
          </p>
        ) : null}
        {academicSupport ? (
          <div className="mt-auto pt-3.5">
            <p className="text-[13px] leading-none text-muted-token">
              {labels.academicSupport}
            </p>
            <p className="mt-2 line-clamp-1 text-[14px] leading-[1.55] text-primary">
              {academicSupport}
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
  const className =
    `${glassStyle.card} ${glassStyle.cardHover} group flex h-[210px] w-full overflow-hidden rounded-[20px] p-4 transition duration-200 sm:h-[220px] sm:p-5`;

  return href ? (
    <Link className={className} href={href}>
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  );
}

function ProgramSection({
  locale,
  programs,
  title,
}: {
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
          <CourseCard key={program._id} locale={locale} program={program} />
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
      <div className={`space-y-3 text-[15px] leading-[1.85] text-secondary ${className}`}>
        {blocks.map((block, index) => {
          const value = portableChildrenText(block);

          if (block.listItem) {
            return (
              <p className="pl-5 [text-indent:-1.25rem]" key={block._key || index}>
                <span className="pr-2">·</span>
                {value}
              </p>
            );
          }

          if (block.style === "h3" || block.style === "h4") {
            return (
              <h3
                className="pt-2 text-[16px] font-medium leading-7 text-primary"
                key={block._key || index}
              >
                {value}
              </h3>
            );
          }

          return (
            <p className="whitespace-pre-line" key={block._key || index}>
              {value}
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
    <p className={`whitespace-pre-line text-[15px] leading-[1.85] text-secondary ${className}`}>
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
          <img alt={name || label} className="h-full w-full object-cover" src={portrait} />
        ) : (
          <span className="px-3 text-center text-xs text-muted-token">{label}</span>
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
          <DetailText className="mt-4 max-w-[760px]" text={bio || facultyText} />
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
}: {
  images: SanityImage[];
  label: string;
}) {
  const urls = images
    .map((image) => imageUrl(image, 900))
    .filter((src): src is string => Boolean(src));

  if (urls.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 lg:mt-12">
      <h2 className="font-title text-[26px] font-normal leading-tight text-primary lg:text-[32px]">
        {label}
      </h2>
      <div className="mt-6 columns-1 gap-5 sm:columns-2 xl:columns-3">
        {urls.map((src, index) => (
          <img
            alt={`${label} ${index + 1}`}
            className="mb-5 w-full break-inside-avoid rounded-[18px] border border-[var(--border)] bg-[var(--card)] shadow-[0_14px_34px_rgba(0,0,0,0.055)]"
            key={src}
            loading="lazy"
            src={src}
          />
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
        <article className="glass-card rounded-[18px] p-5 lg:p-6" key={item.label}>
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
  labels: typeof copy[Locale];
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
  labels: typeof copy[Locale];
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
  const text = Array.isArray(value) ? (hasPortableText(value) ? value : null) : compactText(value);

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
  labels: typeof copy[Locale];
  title?: string | null;
  value: DetailValue;
}) {
  return <DetailSection title={compactText(title) || labels.courseIntro} value={value} />;
}

function AcademicSupport({
  labels,
  name,
  profile,
  value,
}: {
  labels: typeof copy[Locale];
  name: string | null | undefined;
  profile?: CourseTeacher | null;
  value: DetailValue;
}) {
  const supportName = compactText(name);
  const role = compactText(profile?.role);
  const bio = Array.isArray(value) ? (hasPortableText(value) ? value : null) : compactText(value);
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
  labels: typeof copy[Locale];
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
  title,
}: {
  images: SanityImage[] | null | undefined;
  title: string;
}) {
  const urls = (images || [])
    .map((image) => imageUrl(image, 760))
    .filter((src): src is string => Boolean(src));

  if (!urls.length) {
    return null;
  }

  return (
    <div className="mt-5 grid gap-2.5 sm:grid-cols-3 lg:max-w-[640px]">
      {urls.map((src, index) => (
        <img
          alt={`${title} ${index + 1}`}
          className="aspect-[4/3] w-full rounded-[4px] bg-[#211f1c] object-cover"
          key={`${src}-${index}`}
          loading="lazy"
          src={src}
        />
      ))}
    </div>
  );
}

function CourseScheduleBlock({
  index,
  module,
}: {
  index: number;
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
        <ModuleImageGrid images={module.images} title={title || number} />
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
  modules,
}: {
  labels: typeof copy[Locale];
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
  const text = Array.isArray(value) ? (hasPortableText(value) ? value : null) : compactText(value);

  if (!text) {
    return null;
  }

  return (
    <section className="border-t border-[var(--border)] pt-8 first:border-t-0 first:pt-0">
      <h2 className="font-title text-[24px] font-normal leading-tight text-primary">
        {title}
      </h2>
      <DetailText className="mt-4 max-w-[780px] text-[16px] leading-[1.95]" text={text} />
    </section>
  );
}

function CourseIntroSection({
  labels,
  value,
}: {
  labels: typeof copy[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.courseIntro} value={value} />;
}

function AcademicHostSection({
  labels,
  value,
}: {
  labels: typeof copy[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.academicHost} value={value} />;
}

function TeacherTeamSection({
  labels,
  value,
}: {
  labels: typeof copy[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.teacherTeam} value={value} />;
}

function TargetAudienceSection({
  labels,
  value,
}: {
  labels: typeof copy[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.targetAudience} value={value} />;
}

function AcademicAffairsSection({
  labels,
  value,
}: {
  labels: typeof copy[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.academicAffairs} value={value} />;
}

function AccommodationSection({
  labels,
  value,
}: {
  labels: typeof copy[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.accommodation} value={value} />;
}

function CertificateSection({
  labels,
  value,
}: {
  labels: typeof copy[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.certificate} value={value} />;
}

function RegistrationPaymentSection({
  labels,
  value,
}: {
  labels: typeof copy[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.registrationPayment} value={value} />;
}

function ContactInfoSection({
  labels,
  value,
}: {
  labels: typeof copy[Locale];
  value: DetailValue;
}) {
  return <CourseDetailTextSection title={labels.contact} value={value} />;
}

export async function MasterclassPage({ locale }: StudyPageProps) {
  const programs = await client
    .withConfig({ useCdn: false })
    .fetch<StudyProgram[]>(
      internationalMasterclassProgramsQuery,
      { locale },
      { cache: "no-store" },
    );
  const labels = copy[locale];
  const featuredPrograms = programs.filter(
    (program) => program.courseSection !== "past",
  );
  const pastPrograms = programs.filter(
    (program) => program.courseSection === "past",
  );

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
  const program = await client
    .withConfig({ useCdn: false })
    .fetch<StudyProgramDetail | null>(
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
                <CertificateSection
                  labels={labels}
                  value={item?.certificate}
                />
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

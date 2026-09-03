import type { SanityImageSource } from "@sanity/image-url";
import type { ReactNode } from "react";
import Link from "next/link";

import type { Locale } from "@/config/navigation";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import {
  aboutMissionPageQuery,
  artistBySlugQuery,
  contactPageQuery,
  teamMemberBySlugQuery,
  teamMembersQuery,
  teamPageQuery,
} from "@/sanity/queries";

import { AppShell } from "./AppShell";
import { MissionImageCarousel } from "./MissionImageCarousel";
import { PageContainer } from "./PageContainer";
import { PageHeader } from "./PageHeader";

type SanityImage = SanityImageSource | null | undefined;

type AboutMissionPageData = {
  body?: string | null;
  image?: SanityImage;
  missionImages?: SanityImage[] | null;
  pageTitleEn?: string | null;
  pageTitleZh?: string | null;
};

type ContactAddress = {
  content?: string | null;
  mapImage?: SanityImage;
  title?: string | null;
};

type ContactPhone = {
  _key?: string;
  number?: string | null;
};

type ContactEmail = {
  _key?: string;
  email?: string | null;
};

type ContactPageData = {
  address?: ContactAddress | null;
  emails?: ContactEmail[] | null;
  openingHours?: string | null;
  phones?: ContactPhone[] | null;
  pageTitleEn?: string | null;
  pageTitleZh?: string | null;
};

type PageTitleData = {
  pageTitleEn?: string | null;
  pageTitleZh?: string | null;
};

type TeamMember = {
  _id: string;
  name?: string | null;
  portrait?: SanityImage;
  role?: string | null;
  slug?: string | null;
};

type TeamProfile = {
  _id?: string;
  birthDateText?: string | null;
  bio?: string | null;
  detailPageTitleEn?: string | null;
  detailPageTitleZh?: string | null;
  exhibitions?: string | null;
  gender?: string | null;
  honors?: string | null;
  honorsCollections?: string | null;
  name?: string | null;
  portrait?: SanityImage;
  profileTitle?: string | null;
  publications?: string | null;
  researchProjects?: string | null;
  role?: string | null;
  slug?: string | null;
  title?: string | null;
  writings?: string | null;
};

type PageProps = {
  locale: Locale;
};

const copy = {
  zh: {
    address: "\u5730\u5740",
    contact: "\u8054\u7cfb\u6211\u4eec",
    contactEyebrow: "CONTACT",
    email: "\u90ae\u7bb1",
    empty: "\u5185\u5bb9\u5f85\u66f4\u65b0",
    exhibitions: "\u8fd1\u671f\u5c55\u89c8",
    honors: "\u8363\u8a89\u548c\u6536\u85cf",
    imagePending: "\u56fe\u7247\u5f85\u4e0a\u4f20",
    mapPending: "\u5730\u56fe\u5f85\u8865\u5145",
    mission: "\u4f7f\u547d\u613f\u666f",
    missionEyebrow: "MISSION & VISION",
    openingHours: "\u5f00\u653e\u65f6\u95f4",
    openingHoursValue: "\u5468\u4e8c\u81f3\u5468\u65e5 10:00 - 18:00",
    phone: "\u7535\u8bdd",
    publications: "\u51fa\u7248",
    team: "\u56e2\u961f\u6210\u5458",
    teamBack: "\u8fd4\u56de\u56e2\u961f\u6210\u5458",
    teamEyebrow: "OUR TEAM",
    teamProfile: "\u56e2\u961f\u6210\u5458\u8be6\u60c5",
  },
  en: {
    address: "Address",
    contact: "Contact",
    contactEyebrow: "CONTACT",
    email: "Email",
    empty: "Content pending",
    exhibitions: "Recent Exhibitions",
    honors: "Honors & Collections",
    imagePending: "Image pending",
    mapPending: "Map pending",
    mission: "Mission & Vision",
    missionEyebrow: "MISSION & VISION",
    openingHours: "Opening Hours",
    openingHoursValue: "Tue - Sun 10:00 - 18:00",
    phone: "Phone",
    publications: "Publications",
    team: "Team Members",
    teamBack: "Back to Team Members",
    teamEyebrow: "OUR TEAM",
    teamProfile: "Team Profile",
  },
} satisfies Record<Locale, Record<string, string>>;

function compactText(value: string | null | undefined) {
  return value?.trim() || "";
}

function textOrEmpty(value: string | null | undefined, locale: Locale) {
  return compactText(value) || copy[locale].empty;
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

function AboutPageShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    <AppShell locale={locale}>
      <PageContainer>{children}</PageContainer>
    </AppShell>
  );
}

function ImageFrame({
  alt,
  className = "",
  fit = "cover",
  image,
  label,
  priority = false,
  width = 1200,
}: {
  alt: string;
  className?: string;
  fit?: "contain" | "cover";
  image: SanityImage;
  label: string;
  priority?: boolean;
  width?: number;
}) {
  const src = imageUrl(image, width);

  return (
    <div
      className={`image-placeholder flex items-center justify-center overflow-hidden rounded-[14px] ${className}`}
    >
      {src ? (
        <img
          alt={alt}
          className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
          loading={priority ? "eager" : "lazy"}
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

function TextBlock({
  className = "",
  text,
}: {
  className?: string;
  text: string;
}) {
  return (
    <div
      className={`whitespace-pre-line text-[15px] leading-[1.85] text-secondary ${className}`}
    >
      {text}
    </div>
  );
}

function MissionContentSection({ text }: { text: string }) {
  return (
    <section className="w-full text-left">
      <TextBlock
        className="text-[20px] leading-[2] text-secondary"
        text={text}
      />
    </section>
  );
}

export async function MissionVisionPage({ locale }: PageProps) {
  const missionPage = await client.fetch<AboutMissionPageData | null>(
    aboutMissionPageQuery,
    { locale },
    { cache: "no-store" },
  );
  const labels = copy[locale];
  const titleZh = compactText(missionPage?.pageTitleZh) || labels.empty;
  const titleEn = compactText(missionPage?.pageTitleEn);
  const body = textOrEmpty(missionPage?.body, locale);
  const missionImageItems = missionPage?.missionImages?.filter(Boolean) || [];
  const missionImages = missionImageItems.length
    ? missionImageItems
    : [missionPage?.image].filter(Boolean);

  return (
    <AboutPageShell locale={locale}>
      <PageHeader titleEn={titleEn} titleZh={titleZh} />

      <section className="mt-8 lg:mt-9">
        <MissionContentSection text={body} />

        <div className="mt-10 flex justify-center lg:mt-12">
          <MissionImageCarousel
            alt={titleZh}
            className="w-fit max-w-full"
            images={missionImages}
            label={labels.imagePending}
            priority
            width={1800}
          />
        </div>
      </section>
    </AboutPageShell>
  );
}

function TeamMemberCard({
  member,
  locale,
}: {
  member: TeamMember;
  locale: Locale;
}) {
  const labels = copy[locale];
  const name = compactText(member.name) || labels.empty;
  const role = compactText(member.role);
  const detailSlug = compactText(member.slug);
  const href = detailSlug ? `/${locale}/about/team/${detailSlug}` : null;
  const content = (
    <>
      <ImageFrame
        alt={name}
        className="team-member-card__image h-full w-full rounded-[13px]"
        image={member.portrait}
        label={labels.imagePending}
        width={760}
      />
      <div className="team-member-card__panel absolute inset-x-3 bottom-3 rounded-[11px] p-3 sm:p-3.5">
        <h2 className="font-title text-[15px] font-normal leading-tight text-primary">
          {name}
        </h2>
        {role ? (
          <p className="mt-1 text-[11px] leading-4 text-muted-token">{role}</p>
        ) : null}
      </div>
    </>
  );

  return href ? (
    <Link
      className="team-member-card relative block aspect-[0.78] w-full max-w-[260px] overflow-hidden rounded-[13px] sm:max-w-none"
      href={href}
    >
      {content}
    </Link>
  ) : (
    <article className="team-member-card relative aspect-[0.78] w-full max-w-[260px] overflow-hidden rounded-[13px] sm:max-w-none">
      {content}
    </article>
  );
}

export async function TeamPage({ locale }: PageProps) {
  const [teamPage, teamMembers] = await Promise.all([
    client.fetch<PageTitleData | null>(teamPageQuery, {}, { cache: "no-store" }),
    client.fetch<TeamMember[]>(teamMembersQuery, { locale }, { cache: "no-store" }),
  ]);
  const labels = copy[locale];
  const titleZh = compactText(teamPage?.pageTitleZh) || labels.empty;
  const titleEn = compactText(teamPage?.pageTitleEn);
  const members = teamMembers.length
    ? teamMembers
    : Array.from({ length: 8 }).map((_, index) => ({
        _id: `placeholder-${index}`,
        name: labels.empty,
      }));

  return (
    <AboutPageShell locale={locale}>
      <PageHeader titleEn={titleEn} titleZh={titleZh} />

      <section className="mt-8 grid justify-start gap-5 sm:grid-cols-[repeat(2,minmax(0,240px))] lg:mt-9 lg:grid-cols-[repeat(3,minmax(0,232px))] xl:grid-cols-[repeat(4,minmax(0,236px))]">
        {members.map((member) => (
          <TeamMemberCard key={member._id} locale={locale} member={member} />
        ))}
      </section>
    </AboutPageShell>
  );
}

function ProfileSection({
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
    <section className="mt-7 grid gap-4 lg:mt-8 lg:grid-cols-[82px_minmax(0,1fr)]">
      <h2 className="shrink-0 pt-1 text-xs font-normal tracking-[0.28em] text-muted-token">
        {title}
      </h2>
      <div className="border-t border-[var(--border)] pt-4">
        <TextBlock className="max-w-[980px]" text={text} />
      </div>
    </section>
  );
}

function joinProfileMeta({
  birthDateText,
  gender,
  locale,
}: {
  birthDateText?: string | null;
  gender?: string | null;
  locale: Locale;
}) {
  const parts = [compactText(gender), compactText(birthDateText)].filter(Boolean);

  return parts.join(locale === "zh" ? " " : " \u00b7 ");
}

export async function ArtistProfilePage({
  locale,
  slug,
}: PageProps & {
  slug: string;
}) {
  const teamMember = await client.fetch<TeamProfile | null>(
    teamMemberBySlugQuery,
    { locale, slug },
    { cache: "no-store" },
  );
  const artist =
    teamMember ||
    (await client.fetch<TeamProfile | null>(artistBySlugQuery, {
      locale,
      slug,
    }));
  const labels = copy[locale];
  const defaultArtistProfileTitle = copy[locale].empty;
  const name = compactText(artist?.name) || `${defaultArtistProfileTitle}: ${slug}`;
  const identity = compactText(artist?.role);
  const primaryRole = compactText(artist?.profileTitle) || compactText(artist?.title);
  const profileMeta = joinProfileMeta({
    birthDateText: artist?.birthDateText,
    gender: artist?.gender,
    locale,
  });
  const bio = textOrEmpty(artist?.bio, locale);
  const pageTitleZh =
    compactText(artist?.detailPageTitleZh) || labels.empty;
  const pageTitleEn = compactText(artist?.detailPageTitleEn);
  const honorsCollectionsLabel =
    locale === "zh" ? "\u8363\u8a89\u548c\u6536\u85cf" : "Honors & Collections";
  const researchProjectsLabel =
    locale === "zh" ? "\u8bfe\u9898" : "Research Projects";
  const writingsLabel =
    locale === "zh" ? "\u8457\u4f5c" : "Writings";
  const publicationsLabel =
    labels.publications || (locale === "zh" ? "\u51fa\u7248" : "Publications");
  const exhibitionsLabel =
    labels.exhibitions || (locale === "zh" ? "\u5c55\u89c8" : "Exhibitions");
  const roleLines = [identity, primaryRole !== identity ? primaryRole : ""].filter(Boolean);

  return (
    <AboutPageShell locale={locale}>
      <Link
        className="mb-8 inline-flex items-center gap-2 text-[14px] leading-none text-muted-token transition hover:text-primary"
        href={`/${locale}/about/team`}
      >
        <span aria-hidden="true">&larr;</span>
        <span>{labels.teamBack}</span>
      </Link>

      <PageHeader titleEn={pageTitleEn} titleZh={pageTitleZh} />

      <section className="mt-6 grid items-start gap-5 md:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:mt-7 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:gap-5">
        <ImageFrame
          alt={name}
          className="aspect-[4/5] w-full max-w-[300px] md:max-w-none"
          image={artist?.portrait}
          label={labels.imagePending}
          priority
          width={760}
        />
        <article className="glass-card min-w-0 w-full self-start rounded-[24px] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-7 shadow-[0_14px_34px_rgba(0,0,0,0.055),inset_0_1px_0_rgba(255,255,255,0.42)] backdrop-blur-xl sm:p-7 lg:p-8 dark:shadow-[0_18px_42px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <h2 className="font-title text-[28px] font-normal leading-tight text-primary lg:text-[32px]">
            {name}
          </h2>
          {profileMeta ? (
            <p className="mt-3 text-[13px] leading-5 text-muted-token">
              {profileMeta}
            </p>
          ) : null}
          {roleLines.length ? (
            <div className="mt-4 space-y-1 text-[14px] leading-6 text-secondary">
              {roleLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ) : null}
          <TextBlock className="mt-7 max-w-full break-words" text={bio} />
        </article>
      </section>

      <ProfileSection
        title={honorsCollectionsLabel}
        value={artist?.honorsCollections || artist?.honors}
      />
      <ProfileSection
        title={researchProjectsLabel}
        value={artist?.researchProjects}
      />
      <ProfileSection title={writingsLabel} value={artist?.writings} />
      <ProfileSection title={publicationsLabel} value={artist?.publications} />
      <ProfileSection title={exhibitionsLabel} value={artist?.exhibitions} />
    </AboutPageShell>
  );
}

function ContactIcon({
  name,
}: {
  name: "clock" | "link" | "mail" | "map" | "phone";
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };
  const icons = {
    clock: (
      <>
        <circle cx="12" cy="12" r="8" {...common} />
        <path d="M12 7v5l3 2" {...common} />
      </>
    ),
    mail: (
      <>
        <rect x="4" y="6" width="16" height="12" rx="2" {...common} />
        <path d="m4.5 8 7.5 5.5L19.5 8" {...common} />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1L10.6 5.3" {...common} />
        <path d="M14 11a5 5 0 0 0-7.1 0l-1.4 1.4a5 5 0 0 0 7.1 7.1l.8-.8" {...common} />
      </>
    ),
    map: (
      <>
        <path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11z" {...common} />
        <circle cx="12" cy="10" r="2.2" {...common} />
      </>
    ),
    phone: (
      <path
        d="M8.5 5.5 6.6 7.4c-.8.8-.7 2.2.2 4.1a17 17 0 0 0 5.7 5.7c1.9.9 3.3 1 4.1.2l1.9-1.9-3-3-1.6 1.5c-.7-.3-1.5-.9-2.3-1.6-.7-.8-1.3-1.6-1.6-2.3l1.5-1.6-3-3z"
        {...common}
      />
    ),
  };

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
}

function ContactInfoCard({
  children,
  flush = false,
  icon,
  label,
  value,
}: {
  children?: ReactNode;
  flush?: boolean;
  icon: "clock" | "mail" | "map" | "phone";
  label: string;
  value: string;
}) {
  return (
    <article
      className={`glass-card rounded-[14px] ${flush ? "overflow-hidden" : "p-4 sm:p-5 lg:p-6"}`}
    >
      <div className={flush ? "p-4 sm:p-5 lg:p-6" : undefined}>
        <div className="text-muted-token">
          <ContactIcon name={icon} />
        </div>
        <p className="mt-3 text-[14px] font-normal leading-none text-[#888888] dark:text-white/55">
          {label}
        </p>
        <p className="mt-3 whitespace-pre-line text-[16px] leading-[1.8] text-[#333333] dark:text-white/75">
          {value}
        </p>
      </div>
      {children}
    </article>
  );
}

function MapImage({
  alt,
  label,
  src,
}: {
  alt: string;
  label: string;
  src: string | null;
}) {
  if (!src) {
    return (
      <div className="image-placeholder mx-4 mb-4 flex min-h-[260px] items-center justify-center rounded-[12px] px-5 py-8 sm:mx-5 lg:mx-6 lg:mb-6">
        <span className="text-center text-xs text-muted-token">{label}</span>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 overflow-hidden rounded-[12px] bg-[var(--card)] sm:mx-5 lg:mx-6 lg:mb-6">
      <img
        alt={alt}
        className="block h-auto max-h-[360px] w-full object-contain sm:max-h-[420px] lg:max-h-[500px]"
        loading="lazy"
        src={src}
      />
    </div>
  );
}

function ContactAddressCard({
  address,
  labels,
  locale,
}: {
  address: ContactAddress | null | undefined;
  labels: {
    address: string;
    imagePending: string;
    mapPending: string;
  };
  locale: Locale;
}) {
  const title = compactText(address?.title) || labels.address;
  const content = textOrEmpty(address?.content, locale);
  const mapImage = imageUrl(address?.mapImage, 1100);

  return (
    <ContactInfoCard flush icon="map" label={title} value={content}>
      <MapImage alt={title} label={labels.mapPending} src={mapImage} />
    </ContactInfoCard>
  );
}

export async function ContactPage({ locale }: PageProps) {
  const contactPage = await client.fetch<ContactPageData | null>(
    contactPageQuery,
    { locale },
    { cache: "no-store" },
  );
  const labels =
    locale === "zh"
      ? {
          address: "\u5730\u5740",
          contact: "\u8054\u7cfb\u6211\u4eec",
          email: "\u90ae\u7bb1",
          empty: "\u5185\u5bb9\u5f85\u66f4\u65b0",
          imagePending: "\u56fe\u7247\u5f85\u4e0a\u4f20",
          mapPending: "\u5730\u56fe\u5f85\u8865\u5145",
          openingHours: "\u5f00\u653e\u65f6\u95f4",
          openingHoursValue: "\u5468\u4e8c\u81f3\u5468\u65e5 10:00 - 18:00",
          phone: "\u7535\u8bdd",
        }
      : {
          address: "Address",
          contact: "Contact",
          email: "Email",
          empty: "Content pending",
          imagePending: "Image pending",
          mapPending: "Map pending",
          openingHours: "Opening Hours",
          openingHoursValue: "Tue - Sun 10:00 - 18:00",
          phone: "Phone",
        };
  const titleZh = compactText(contactPage?.pageTitleZh) || labels.empty;
  const titleEn = compactText(contactPage?.pageTitleEn);
  const phones = contactPage?.phones?.filter((item) => compactText(item.number)) || [];
  const emails = contactPage?.emails?.filter((item) => compactText(item.email)) || [];
  const openingHours = compactText(contactPage?.openingHours) || labels.openingHoursValue;

  return (
    <AboutPageShell locale={locale}>
      <PageHeader titleEn={titleEn} titleZh={titleZh} />

      <section className="mt-8 grid gap-5 lg:mt-9 xl:grid-cols-[minmax(0,660px)_minmax(320px,1fr)]">
        <ContactAddressCard
          address={contactPage?.address}
          labels={labels}
          locale={locale}
        />

        <div className="grid content-start gap-5">
          <ContactInfoCard
            icon="phone"
            label={labels.phone}
            value={
              phones.length
                ? phones.map((phone) => compactText(phone.number)).join("\n")
                : labels.empty
            }
          />
          <ContactInfoCard
            icon="mail"
            label={labels.email}
            value={
              emails.length
                ? emails.map((email) => compactText(email.email)).join("\n")
                : labels.empty
            }
          />
          <ContactInfoCard
            icon="clock"
            label={labels.openingHours}
            value={openingHours}
          />
        </div>
      </section>
    </AboutPageShell>
  );
}

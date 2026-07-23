import { CmsReadCheckPage } from "@/components/CmsReadCheckPage";
import { client } from "@/sanity/client";
import {
  artWorkBySlugQuery,
  eventBySlugQuery,
  studyProgramBySlugQuery,
} from "@/sanity/queries";

import type { Locale } from "@/config/navigation";

type DetailReadModel = {
  _id?: string;
  eventType?: string | null;
  programType?: string | null;
  slug?: string | null;
  title?: string | null;
  workType?: string | null;
};

type DetailReadCheckProps = {
  expectedType: string;
  fallbackTitle: string;
  locale: Locale;
  slug: string;
};

function DetailStatus({
  item,
  slug,
  typeLabel,
}: {
  item: DetailReadModel | null;
  slug: string;
  typeLabel: string;
}) {
  return (
    <dl className="grid gap-3 text-sm text-[#4a4a4a] sm:grid-cols-2">
      <div>
        <dt className="text-[#9a9a9a]">slug</dt>
        <dd className="mt-1">{item?.slug || slug}</dd>
      </div>
      <div>
        <dt className="text-[#9a9a9a]">type</dt>
        <dd className="mt-1">{typeLabel}</dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-[#9a9a9a]">title</dt>
        <dd className="mt-1">{item?.title || "placeholder"}</dd>
      </div>
    </dl>
  );
}

export async function StudyProgramDetailReadCheckPage({
  expectedType,
  fallbackTitle,
  locale,
  slug,
}: DetailReadCheckProps) {
  const program = await client.fetch<DetailReadModel | null>(
    studyProgramBySlugQuery,
    { locale, slug },
  );
  const isExpectedType = program?.programType === expectedType;
  const item = isExpectedType ? program : null;

  return (
    <CmsReadCheckPage
      count={item ? 1 : 0}
      eyebrow={`Sanity check / studyProgram slug + programType=${expectedType}`}
      isEmpty={!item}
      locale={locale}
      title={item?.title || fallbackTitle}
    >
      <DetailStatus item={item} slug={slug} typeLabel={expectedType} />
    </CmsReadCheckPage>
  );
}

export async function EventDetailReadCheckPage({
  expectedType,
  fallbackTitle,
  locale,
  slug,
}: DetailReadCheckProps) {
  const event = await client.fetch<DetailReadModel | null>(eventBySlugQuery, {
    locale,
    slug,
  });
  const isExpectedType = event?.eventType === expectedType;
  const item = isExpectedType ? event : null;

  return (
    <CmsReadCheckPage
      count={item ? 1 : 0}
      eyebrow={`Sanity check / event slug + eventType=${expectedType}`}
      isEmpty={!item}
      locale={locale}
      title={item?.title || fallbackTitle}
    >
      <DetailStatus item={item} slug={slug} typeLabel={expectedType} />
    </CmsReadCheckPage>
  );
}

export async function ArtWorkDetailReadCheckPage({
  expectedType,
  fallbackTitle,
  locale,
  slug,
}: DetailReadCheckProps) {
  const work = await client.fetch<DetailReadModel | null>(artWorkBySlugQuery, {
    locale,
    slug,
  });
  const isExpectedType = work?.workType === expectedType;
  const item = isExpectedType ? work : null;

  return (
    <CmsReadCheckPage
      count={item ? 1 : 0}
      eyebrow={`Sanity check / artWork slug + workType=${expectedType}`}
      isEmpty={!item}
      locale={locale}
      title={item?.title || fallbackTitle}
    >
      <DetailStatus item={item} slug={slug} typeLabel={expectedType} />
    </CmsReadCheckPage>
  );
}

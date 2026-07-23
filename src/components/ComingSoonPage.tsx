"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/config/navigation";

import { AppShell } from "./AppShell";
import { PageContainer } from "./PageContainer";

type ComingSoonPageProps = {
  titleZh?: string;
  titleEn?: string;
  descriptionZh?: string;
  descriptionEn?: string;
  pageTitleZh?: string;
  pageTitleEn?: string;
};

const defaultCopy = {
  eyebrow: "COMING SOON",
  titleZh: "敬请期待",
  titleEn: "Coming Soon",
  descriptionZh: "该功能正在筹备中，更多精彩内容即将开放。",
  descriptionEn:
    "This section is currently under preparation. Stay tuned for upcoming updates.",
  backHomeZh: "返回首页",
  backHomeEn: "Back Home",
};

function getLocale(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "zh";
}

function localizedHref(href: string, locale: Locale) {
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

export function ComingSoonPage({
  descriptionEn,
  descriptionZh,
  pageTitleEn: _pageTitleEn,
  pageTitleZh: _pageTitleZh,
  titleEn,
  titleZh,
}: ComingSoonPageProps) {
  const pathname = usePathname();
  const locale = getLocale(pathname);
  const resolvedTitleZh = titleZh || defaultCopy.titleZh;
  const resolvedTitleEn = titleEn || defaultCopy.titleEn;
  const title = locale === "zh" ? resolvedTitleZh : resolvedTitleEn || resolvedTitleZh;
  const description =
    locale === "zh"
      ? descriptionZh || defaultCopy.descriptionZh
      : descriptionEn || descriptionZh || defaultCopy.descriptionEn;

  return (
    <AppShell locale={locale}>
      <PageContainer className="flex min-h-[calc(100vh-62px)] items-center justify-center py-16 sm:py-20 lg:py-24">
        <section className="relative isolate flex w-full max-w-[760px] flex-col items-center overflow-hidden rounded-[32px] px-6 py-16 text-center sm:px-12 sm:py-20 lg:w-[60%] lg:min-w-[680px]">
          <div className="absolute left-1/2 top-1/2 -z-10 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--glass-border)] bg-[radial-gradient(circle_at_34%_26%,rgba(255,255,255,0.34),transparent_30%),radial-gradient(circle_at_64%_72%,rgba(210,224,220,0.16),transparent_40%),var(--glass-bg)] opacity-60 blur-[0.2px] shadow-[var(--glass-shadow)] backdrop-blur-xl dark:opacity-40 sm:h-[440px] sm:w-[440px]" />
          <div className="absolute left-1/2 top-1/2 -z-10 h-[260px] w-[260px] -translate-x-[58%] -translate-y-[48%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_68%)] blur-2xl dark:bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_68%)]" />

          <p className="en-title text-[12px] uppercase text-muted-token sm:text-[13px]">
            {defaultCopy.eyebrow}
          </p>
          <h1 className="font-title mt-5 text-[42px] font-normal leading-tight text-primary sm:text-[52px] lg:text-[56px]">
            {title}
          </h1>
          <p className="mt-6 max-w-[520px] whitespace-pre-line text-[16px] leading-[1.9] text-secondary sm:text-[17px]">
            {description}
          </p>

          <Link
            className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-[#111111] px-8 text-[14px] font-medium text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)] transition hover:bg-[#2a2a2a] dark:bg-white/90 dark:text-[#171717] dark:hover:bg-white"
            href={localizedHref("/", locale)}
          >
            {locale === "zh" ? defaultCopy.backHomeZh : defaultCopy.backHomeEn}
          </Link>
        </section>
      </PageContainer>
    </AppShell>
  );
}

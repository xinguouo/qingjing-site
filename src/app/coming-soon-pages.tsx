import { ComingSoonPage } from "@/components/ComingSoonPage";
import type { Locale } from "@/config/navigation";

type ComingSoonRouteProps = {
  locale?: Locale;
};

export function ResidencyComingSoon({
  locale = "zh",
}: ComingSoonRouteProps = {}) {
  return (
    <ComingSoonPage
      locale={locale}
      pageTitleZh={"\u9a7b\u5730\u8ba1\u5212"}
      pageTitleEn="Residency Program"
    />
  );
}

export function ResidentArtistsComingSoon({
  locale = "zh",
}: ComingSoonRouteProps = {}) {
  return (
    <ComingSoonPage
      locale={locale}
      pageTitleZh={"\u9a7b\u5730\u827a\u672f\u5bb6"}
      pageTitleEn="Resident Artists"
    />
  );
}

export function ResidencyApplicationComingSoon({
  locale = "zh",
}: ComingSoonRouteProps = {}) {
  return (
    <ComingSoonPage
      locale={locale}
      pageTitleZh={"\u9a7b\u5730\u7533\u8bf7"}
      pageTitleEn="Residency Application"
    />
  );
}

export function InternationalStudyComingSoon({
  locale = "zh",
}: ComingSoonRouteProps = {}) {
  return (
    <ComingSoonPage
      locale={locale}
      pageTitleZh={"\u56fd\u9645\u7814\u5b66"}
      pageTitleEn="International Study"
    />
  );
}

export function MasterWorkshopComingSoon({
  locale = "zh",
}: ComingSoonRouteProps = {}) {
  return (
    <ComingSoonPage
      locale={locale}
      pageTitleZh={"\u5927\u5e08\u7814\u4fee\u73ed"}
      pageTitleEn="Master Workshop"
    />
  );
}

export function AdvancedStudyComingSoon({
  locale = "zh",
}: ComingSoonRouteProps = {}) {
  return (
    <ComingSoonPage
      locale={locale}
      pageTitleZh={"\u9ad8\u7ea7\u7814\u5b66"}
      pageTitleEn="Advanced Study"
    />
  );
}

export function OpenClassComingSoon({
  locale = "zh",
}: ComingSoonRouteProps = {}) {
  return (
    <ComingSoonPage
      locale={locale}
      pageTitleZh={"\u827a\u672f\u516c\u5f00\u8bfe"}
      pageTitleEn="Art Open Class"
    />
  );
}

export function ActivitiesComingSoon({
  locale = "zh",
}: ComingSoonRouteProps = {}) {
  return (
    <ComingSoonPage
      locale={locale}
      pageTitleZh={"\u827a\u672f\u6d3b\u52a8"}
      pageTitleEn="Art Activity"
    />
  );
}

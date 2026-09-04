"use client";

import type { SanityImageSource } from "@sanity/image-url";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type {ArtCategoryTitleMap} from "@/config/artCategories";
import {
  getNavigationHref,
  getNavigationLabel,
  isNavigationItemActive,
  navigationGroupLabels,
  navigationGroupOrder,
  navigationItems,
  type Locale,
} from "@/config/navigation";

import { Logo, type SidebarLogoImages } from "./Logo";
import { SidebarNavIcon } from "./SidebarNavIcon";

type DesktopSidebarProps = {
  artCategorySettings?: ArtCategoryTitleMap;
  locale: Locale;
  logo?: SanityImageSource | null;
  logoImages?: SidebarLogoImages | null;
  siteName?: string | null;
};

const labels = {
  copyright: "\u00a9 2026 \u6e05\u955c\u73bb\u7483\u82b1\u56ed",
  preparingZh: "\u7b79\u5907\u4e2d",
};

export function DesktopSidebar({
  artCategorySettings,
  locale,
  logo,
  logoImages,
  siteName,
}: DesktopSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar-shell fixed inset-y-0 left-0 z-30 hidden w-[232px] flex-col border-r lg:flex">
      <div className="flex h-[62px] items-center border-b border-[var(--border)] px-8">
        <Logo image={logo} images={logoImages} locale={locale} siteName={siteName} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-8">
        {navigationGroupOrder.map((group) => {
          const items = navigationItems.filter((item) => item.group === group);

          if (items.length === 0) {
            return null;
          }

          const groupLabel = navigationGroupLabels[group];

          return (
            <div className="mb-5 last:mb-0" key={group}>
              {group !== "home" ? (
                <p className="mb-2.5 px-3 text-xs font-medium tracking-[0.06em] text-muted-token">
                  {locale === "zh" ? groupLabel.labelZh : groupLabel.labelEn}
                </p>
              ) : null}

              <div className="flex flex-col gap-2">
                {items.map((item) => {
                  const isActive = isNavigationItemActive(item, pathname);
                  const isComingSoon = item.status === "comingSoon";

                  return (
                    <Link
                      className={`group relative flex min-h-[42px] items-center gap-2.5 rounded-full px-3 pr-4 transition-colors ${
                        isActive
                          ? "sidebar-nav-item-active"
                          : isComingSoon
                            ? "sidebar-nav-item"
                            : "sidebar-nav-item"
                      }`}
                      href={getNavigationHref(item, locale)}
                      key={item.href}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          isActive
                            ? "sidebar-icon !text-primary"
                            : "sidebar-icon !text-[#444444] group-hover:!text-[#333333] dark:!text-[var(--soft-foreground)] dark:group-hover:!text-[var(--foreground)]"
                        }`}
                      >
                        <SidebarNavIcon href={item.href} size={18} />
                      </span>

                      <span
                        className={`min-w-0 flex-1 font-medium ${
                          isActive
                            ? ""
                            : "text-[#444444] group-hover:text-[#333333] dark:text-[var(--soft-foreground)] dark:group-hover:text-[var(--foreground)]"
                        } ${
                          locale === "zh"
                            ? "text-sm leading-none"
                            : "text-xs leading-tight"
                        }`}
                      >
                        {getNavigationLabel(item, locale, artCategorySettings)}
                      </span>

                      {isComingSoon ? (
                        <span className="glass-control shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium text-muted-token">
                          {locale === "zh" ? labels.preparingZh : "Soon"}
                        </span>
                      ) : null}

                      {isActive ? (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--muted-foreground)]" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] px-6 py-4 text-center text-[10px] tracking-[0.12em] text-muted-token">
        {labels.copyright}
      </div>
    </aside>
  );
}

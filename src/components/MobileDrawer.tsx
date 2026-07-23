"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  getNavigationHref,
  isNavigationItemActive,
  navigationGroupLabels,
  navigationGroupOrder,
  navigationItems,
  type Locale,
} from "@/config/navigation";

import { SidebarNavIcon } from "./SidebarNavIcon";

type MobileDrawerProps = {
  isOpen: boolean;
  locale: Locale;
  onClose: () => void;
};

const labels = {
  brandZh: "\u6e05\u955c\u73bb\u7483\u82b1\u56ed",
  closeZh: "\u5173\u95ed\u83dc\u5355",
  preparingZh: "\u7b79\u5907\u4e2d",
};

export function MobileDrawer({ isOpen, locale, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        aria-label={locale === "zh" ? labels.closeZh : "Close menu"}
        className={`absolute inset-0 bg-black/45 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        type="button"
      />
      <aside
        className={`sidebar-shell absolute right-0 top-0 h-full w-[min(88vw,360px)] overflow-y-auto border-l px-6 py-6 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-5">
          <div>
            <p className="text-lg font-semibold text-primary">{labels.brandZh}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-token">
              Qingjing
            </p>
          </div>
          <button
            className="glass-button flex h-11 w-11 items-center justify-center rounded-full text-xl leading-none"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>
        <nav className="mt-8 flex flex-col gap-7">
          {navigationGroupOrder.map((group) => {
            const items = navigationItems.filter((item) => item.group === group);

            if (items.length === 0) {
              return null;
            }

            const groupLabel = navigationGroupLabels[group];

            return (
              <div key={group}>
                <p className="mb-3 px-2 text-xs uppercase tracking-[0.22em] text-muted-token">
                  {locale === "zh" ? groupLabel.labelZh : groupLabel.labelEn}
                </p>
                <div className="flex flex-col gap-3">
                  {items.map((item) => {
                    const isActive = isNavigationItemActive(item, pathname);
                    const isComingSoon = item.status === "comingSoon";

                    return (
                      <Link
                        className={`group flex min-h-11 items-center gap-3 rounded-full px-5 text-base shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition-colors ${
                          isActive
                            ? "sidebar-nav-item-active"
                            : isComingSoon
                              ? "glass-button"
                              : "glass-button"
                        }`}
                        href={getNavigationHref(item, locale)}
                        key={item.href}
                        onClick={onClose}
                      >
                        <span
                          className={`sidebar-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                            isActive
                              ? "!text-primary"
                              : "!text-[#444444] group-hover:!text-[#333333] dark:!text-[var(--soft-foreground)] dark:group-hover:!text-[var(--foreground)]"
                          }`}
                        >
                          <SidebarNavIcon href={item.href} size={20} />
                        </span>
                        <span
                          className={`min-w-0 flex-1 ${
                            isActive
                              ? ""
                              : "text-[#444444] group-hover:text-[#333333] dark:text-[var(--soft-foreground)] dark:group-hover:text-[var(--foreground)]"
                          }`}
                        >
                          {locale === "zh" ? item.labelZh : item.labelEn}
                        </span>
                        {isComingSoon ? (
                          <span className="glass-control shrink-0 rounded-full px-2 py-1 text-[11px] text-muted-token">
                            {locale === "zh" ? labels.preparingZh : "Soon"}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}

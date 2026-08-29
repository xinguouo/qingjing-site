"use client";

import type { ReactNode } from "react";

import type { Locale } from "@/config/navigation";

import { DesktopSidebar } from "./DesktopSidebar";
import { FloatingThemeControl } from "./FloatingThemeControl";
import { MobileNavigation } from "./MobileNavigation";
import { TopBar } from "./TopBar";

type AppShellProps = {
  children: ReactNode;
  locale: Locale;
};

export function AppShell({ children, locale }: AppShellProps) {
  return (
    <div className="app-shell min-h-screen overflow-x-hidden">
      <MobileNavigation locale={locale} />
      <DesktopSidebar locale={locale} />
      <div className="min-h-screen min-w-0 lg:ml-[232px]">
        <TopBar locale={locale} />
        <main className="min-w-0 w-full max-w-full">{children}</main>
      </div>
      <FloatingThemeControl locale={locale} />
    </div>
  );
}

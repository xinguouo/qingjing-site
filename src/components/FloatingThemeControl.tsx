"use client";

import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/config/navigation";

import { useTheme, type ColorTheme } from "@/components/ThemeProvider";

type FloatingThemeControlProps = {
  locale: Locale;
};

const themeLabelsZh: Record<ColorTheme["id"], string> = {
  mist: "\u4e91\u96fe\u767d",
  "warm-gray": "\u6708\u5f71\u7070",
  beige: "\u6696\u7802\u8272",
  "glass-blue": "\u7409\u7483\u84dd",
  "celadon-green": "\u9752\u74f7\u7eff",
  "dark-glass": "\u6df1\u591c\u58a8\u8272",
};

function PaletteOrbIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d="M7.9 10.7c1.5-3.1 5.4-4.3 8.4-2.5M16.5 13.4c-1.3 3-5.1 4.4-8.2 2.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
      <path
        d="M9.2 8.8h.01M14.9 9.4h.01M16 15.4h.01M8.6 14.6h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function ThemeOption({
  active,
  locale,
  onSelect,
  theme,
}: {
  active: boolean;
  locale: Locale;
  onSelect: () => void;
  theme: ColorTheme;
}) {
  return (
    <button
      aria-pressed={active}
      className={`group flex w-full items-center gap-3 rounded-full border px-3 py-2 text-left transition ${
        active
          ? "border-[var(--glass-edge)] bg-[var(--glass-bg-strong)] text-primary shadow-[inset_0_1px_0_var(--glass-highlight)]"
          : "border-transparent text-secondary hover:border-[var(--glass-border)] hover:bg-[var(--glass-bg)] hover:text-primary"
      }`}
      onClick={onSelect}
      type="button"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(0,0,0,0.08)]"
        style={{ backgroundColor: theme.swatch }}
      />
      <span className="min-w-0">
        <span className="block text-[13px] leading-none">
          {locale === "zh" ? themeLabelsZh[theme.id] : theme.nameEn}
        </span>
        <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-muted-token">
          {theme.swatch}
        </span>
      </span>
    </button>
  );
}

export function FloatingThemeControl({ locale }: FloatingThemeControlProps) {
  const { colorTheme, colorThemes, setColorTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("pointerdown", handlePointerDown);
    }

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div
      className="fixed right-4 top-1/2 z-[80] -translate-y-1/2 sm:right-5"
      ref={panelRef}
    >
      <div className="flex items-center justify-end gap-3">
        <div
          className={`theme-control-panel glass-panel w-[min(250px,calc(100vw-92px))] origin-right rounded-[22px] p-3 transition duration-200 ${
            open
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none translate-x-3 opacity-0"
          }`}
        >
          <div className="px-2 pb-2 pt-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-token">
              {locale === "zh" ? "\u754c\u9762\u4e3b\u9898" : "Interface Theme"}
            </p>
            <p className="mt-2 text-[13px] leading-5 text-secondary">
              {locale === "zh"
                ? "\u9009\u62e9\u66f4\u9002\u5408\u6d4f\u89c8\u7684\u73bb\u7483\u8272\u8c03\u3002"
                : "Choose a quiet glass tone for the site."}
            </p>
          </div>
          <div className="mt-2 grid gap-1">
            {colorThemes.map((theme) => (
              <ThemeOption
                active={theme.id === colorTheme}
                key={theme.id}
                locale={locale}
                onSelect={() => setColorTheme(theme.id)}
                theme={theme}
              />
            ))}
          </div>
        </div>

        <button
          aria-expanded={open}
          aria-label={locale === "zh" ? "\u8c03\u6574\u754c\u9762\u4e3b\u9898" : "Adjust interface theme"}
          className="theme-control-button glass-button group relative flex h-12 w-12 items-center justify-center rounded-full text-primary transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--border)]"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span className="absolute inset-[5px] rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.92),transparent_28%),radial-gradient(circle_at_68%_78%,rgba(190,210,206,0.42),transparent_34%)] opacity-70 transition group-hover:opacity-95 dark:bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_70%_78%,rgba(205,220,214,0.16),transparent_36%)]" />
          <span className="relative">
            <PaletteOrbIcon />
          </span>
        </button>
      </div>
    </div>
  );
}

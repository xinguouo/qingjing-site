"use client";

import { useTheme } from "./ThemeProvider";

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
      <path
        d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8 8 0 1 0 20 15.5z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2M12 19.5v2M4.8 4.8l1.4 1.4M17.8 17.8l1.4 1.4M2.5 12h2M19.5 12h2M4.8 19.2l1.4-1.4M17.8 6.2l1.4-1.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { mode, mounted, toggleMode } = useTheme();
  const isDark = mounted && mode === "dark";

  return (
    <button
      aria-label={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      className="glass-button flex h-8 w-8 items-center justify-center rounded-full text-muted-token transition"
      onClick={toggleMode}
      type="button"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

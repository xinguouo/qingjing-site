"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

export type ColorThemeId =
  | "mist"
  | "warm-gray"
  | "beige"
  | "glass-blue"
  | "celadon-green"
  | "dark-glass";

export type ColorTheme = {
  id: ColorThemeId;
  nameZh: string;
  nameEn: string;
  swatch: string;
};

type ThemeContextValue = {
  colorTheme: ColorThemeId;
  colorThemes: ColorTheme[];
  mode: ThemeMode;
  mounted: boolean;
  setColorTheme: (theme: ColorThemeId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const modeStorageKey = "qingjing-theme";
const colorStorageKey = "qingjing-color-theme";

export const colorThemes: ColorTheme[] = [
  { id: "mist", nameZh: "雾白", nameEn: "Mist White", swatch: "#F8F7F3" },
  { id: "warm-gray", nameZh: "暖灰", nameEn: "Warm Gray", swatch: "#EDE9E3" },
  { id: "beige", nameZh: "砂岩", nameEn: "Beige", swatch: "#DDD2C4" },
  { id: "glass-blue", nameZh: "浅青玻璃", nameEn: "Glass Blue", swatch: "#DDE8E8" },
  { id: "dark-glass", nameZh: "深夜墨色", nameEn: "Dark Glass", swatch: "#1C1C1C" },
  { id: "celadon-green", nameZh: "\u9752\u74f7\u7eff", nameEn: "Celadon Green", swatch: "#E4ECE4" },
];

const colorThemeIds = new Set<ColorThemeId>(colorThemes.map((theme) => theme.id));

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isColorTheme(value: string | null): value is ColorThemeId {
  return Boolean(value && colorThemeIds.has(value as ColorThemeId));
}

function getStoredMode(): ThemeMode | null {
  const stored = window.localStorage.getItem(modeStorageKey);

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return null;
}

function getStoredColorTheme(): ColorThemeId {
  const stored = window.localStorage.getItem(colorStorageKey);
  return isColorTheme(stored) ? stored : "dark-glass";
}

function applyTheme(mode: ThemeMode, colorTheme: ColorThemeId) {
  const root = document.documentElement;

  root.classList.toggle("dark", mode === "dark");
  root.classList.toggle("light", mode === "light");
  colorThemes.forEach((theme) => {
    root.classList.toggle(`theme-${theme.id}`, theme.id === colorTheme);
  });
  root.style.colorScheme = mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [colorTheme, setColorThemeState] = useState<ColorThemeId>("dark-glass");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialColorTheme = getStoredColorTheme();
    const initialMode = getStoredMode() ?? "dark";
    const normalizedColorTheme =
      initialMode === "dark"
        ? "dark-glass"
        : initialColorTheme === "dark-glass"
          ? "mist"
          : initialColorTheme;

    setColorThemeState(normalizedColorTheme);
    setModeState(initialMode);
    applyTheme(initialMode, normalizedColorTheme);
    setMounted(true);
  }, []);

  function persist(nextMode: ThemeMode, nextColorTheme: ColorThemeId) {
    setModeState(nextMode);
    setColorThemeState(nextColorTheme);
    applyTheme(nextMode, nextColorTheme);
    window.localStorage.setItem(modeStorageKey, nextMode);
    window.localStorage.setItem(colorStorageKey, nextColorTheme);
  }

  function setMode(nextMode: ThemeMode) {
    const nextColorTheme =
      nextMode === "light" && colorTheme === "dark-glass" ? "mist" : colorTheme;
    persist(nextMode, nextColorTheme);
  }

  function setColorTheme(nextColorTheme: ColorThemeId) {
    persist(nextColorTheme === "dark-glass" ? "dark" : "light", nextColorTheme);
  }

  const value = useMemo(
    () => ({
      colorTheme,
      colorThemes,
      mode,
      mounted,
      setColorTheme,
      setMode,
      toggleMode: () => setMode(mode === "light" ? "dark" : "light"),
    }),
    [colorTheme, mode, mounted],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

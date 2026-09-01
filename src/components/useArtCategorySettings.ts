"use client";

import {useEffect, useState} from "react";

import {
  resolveArtCategorySettingsMap,
  type ArtCategoryTitleMap,
  type ArtCategoryTitleSettings,
} from "@/config/artCategories";

export function useArtCategorySettings(
  initialSettings?:
    | ArtCategoryTitleSettings
    | ArtCategoryTitleSettings[]
    | ArtCategoryTitleMap
    | null,
) {
  const [settings, setSettings] = useState<ArtCategoryTitleMap>(() =>
    resolveArtCategorySettingsMap(initialSettings),
  );

  useEffect(() => {
    let isMounted = true;

    fetch("/api/art-category-settings", {cache: "no-store"})
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setSettings(resolveArtCategorySettingsMap(data));
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  return settings;
}

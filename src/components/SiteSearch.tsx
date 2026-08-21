"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import type {Locale} from "@/config/navigation";

type SiteSearchProps = {
  controlClassName?: string;
  locale: Locale;
  variant?: "desktop" | "mobile";
};

type SearchResult = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  href: string;
  thumbnailUrl: string | null;
};

const labels = {
  loading: {zh: "\u641c\u7d22\u4e2d...", en: "Searching..."},
  noResults: {zh: "\u6ca1\u6709\u627e\u5230\u76f8\u5173\u5185\u5bb9", en: "No results found"},
  placeholder: {
    zh: "\u641c\u7d22\u9875\u9762\u3001\u6d3b\u52a8\u3001\u827a\u672f\u5bb6\u3001\u8bfe\u7a0b\u3001\u827a\u672f\u4f5c\u54c1\u3001\u5546\u54c1...",
    en: "Search pages, events, artists, courses, artworks, products...",
  },
};

function compactText(value: string | null | undefined) {
  return value?.trim() || "";
}

export function SiteSearch({
  controlClassName = "glass-control flex h-9 w-[min(360px,34vw)] items-center rounded-full px-4 text-xs text-muted-token",
  locale,
  variant = "desktop",
}: SiteSearchProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const trimmedQuery = compactText(query);
  const placeholder = labels.placeholder[locale];
  const shouldShowPanel = isFocused && Boolean(trimmedQuery);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!trimmedQuery) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setIsLoading(true);

      fetch(
        `/api/search?q=${encodeURIComponent(trimmedQuery)}&locale=${locale}`,
        {signal: controller.signal},
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Search request failed");
          }

          return response.json() as Promise<{results?: SearchResult[]}>;
        })
        .then((data) => {
          setResults(data.results || []);
          setHasSearched(true);
        })
        .catch((error) => {
          if ((error as Error).name !== "AbortError") {
            setResults([]);
            setHasSearched(true);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [locale, trimmedQuery]);

  const panelContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="px-4 py-4 text-[12px] leading-5 text-muted-token">
          {labels.loading[locale]}
        </div>
      );
    }

    if (!results.length && hasSearched) {
      return (
        <div className="px-4 py-4 text-[12px] leading-5 text-muted-token">
          {labels.noResults[locale]}
        </div>
      );
    }

    return (
      <div className="max-h-[min(68vh,520px)] overflow-y-auto py-2">
        {results.map((result) => (
          <Link
            className="group flex min-h-[68px] gap-3 px-3 py-2.5 transition hover:bg-black/[0.035] dark:hover:bg-white/[0.055]"
            href={result.href}
            key={`${result.id}-${result.href}`}
            onClick={() => {
              setIsFocused(false);
              setQuery("");
            }}
          >
            {result.thumbnailUrl ? (
              <img
                alt=""
                className="h-11 w-11 shrink-0 rounded-[8px] object-cover"
                loading="lazy"
                src={result.thumbnailUrl}
              />
            ) : (
              <span className="glass-control flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] text-[10px] text-muted-token">
                {result.type.slice(0, 2)}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] leading-none text-muted-token">
                {result.type}
              </span>
              <span className="mt-1.5 block truncate text-[14px] font-medium leading-5 text-primary">
                {result.title}
              </span>
              {result.description ? (
                <span className="mt-0.5 block truncate text-[12px] leading-5 text-secondary">
                  {result.description}
                </span>
              ) : null}
            </span>
          </Link>
        ))}
      </div>
    );
  }, [hasSearched, isLoading, locale, results]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setQuery(value);

    if (!compactText(value)) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setResults([]);
    setIsLoading(true);
    setHasSearched(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
      return;
    }

    if (event.key === "Enter" && results[0]) {
      event.preventDefault();
      setIsFocused(false);
      setQuery("");
      router.push(results[0].href);
    }
  }

  return (
    <div
      className={`relative isolate overflow-visible ${
        variant === "mobile" ? "z-[70] h-10 min-w-0 flex-1" : "z-[70] h-9"
      }`}
      ref={rootRef}
    >
      <div className={controlClassName}>
        <input
          aria-label={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-xs text-primary outline-none placeholder:text-muted-token"
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          type="search"
          value={query}
        />
      </div>
      {shouldShowPanel ? (
        <div
          className={`glass-card !absolute top-[calc(100%+8px)] z-[80] overflow-hidden rounded-[16px] border border-[var(--border)] shadow-[0_24px_70px_rgba(0,0,0,0.16)] ${
            variant === "mobile"
              ? "left-1/2 w-[min(92vw,420px)] -translate-x-1/2"
              : "left-0 w-[min(420px,calc(100vw-280px))]"
          }`}
        >
          {panelContent}
        </div>
      ) : null}
    </div>
  );
}

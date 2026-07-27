export type Locale = "zh" | "en";

export type NavigationStatus = "live" | "comingSoon";

export type NavigationGroup =
  | "home"
  | "about"
  | "residency"
  | "study"
  | "offlineExperience"
  | "events"
  | "artCreation"
  | "shop";

export type NavigationItem = {
  labelZh: string;
  labelEn: string;
  href: string;
  icon: string;
  group: NavigationGroup;
  status: NavigationStatus;
  activePathPrefixes?: string[];
};

export const navigationGroupLabels: Record<
  NavigationGroup,
  { labelZh: string; labelEn: string }
> = {
  home: { labelZh: "\u9996\u9875", labelEn: "Home" },
  about: { labelZh: "\u5173\u4e8e\u6211\u4eec", labelEn: "About Us" },
  residency: {
    labelZh: "\u9a7b\u5730\u8ba1\u5212",
    labelEn: "Residency Program",
  },
  study: { labelZh: "\u7814\u5b66", labelEn: "Study" },
  offlineExperience: {
    labelZh: "\u7ebf\u4e0b\u4f53\u9a8c",
    labelEn: "Offline Experience",
  },
  events: { labelZh: "\u827a\u672f\u6d3b\u52a8", labelEn: "Art Events" },
  artCreation: {
    labelZh: "\u827a\u672f\u521b\u4f5c",
    labelEn: "Art Creation",
  },
  shop: { labelZh: "\u5546\u5e97", labelEn: "Shop" },
};

export const navigationGroupOrder: NavigationGroup[] = [
  "home",
  "about",
  "residency",
  "study",
  "offlineExperience",
  "events",
  "artCreation",
  "shop",
];

export const navigationItems: NavigationItem[] = [
  {
    labelZh: "\u9996\u9875",
    labelEn: "Home",
    href: "/",
    icon: "home",
    group: "home",
    status: "live",
  },
  {
    labelZh: "\u4f7f\u547d\u613f\u666f",
    labelEn: "Mission & Vision",
    href: "/about/mission-vision",
    icon: "target",
    group: "about",
    status: "live",
  },
  {
    labelZh: "\u56e2\u961f\u6210\u5458",
    labelEn: "Team Members",
    href: "/about/team",
    icon: "users",
    group: "about",
    status: "live",
    activePathPrefixes: ["/about/artists/"],
  },
  {
    labelZh: "\u8054\u7cfb\u6211\u4eec",
    labelEn: "Contact",
    href: "/about/contact",
    icon: "mail",
    group: "about",
    status: "live",
  },
  {
    labelZh: "\u9a7b\u5730\u827a\u672f\u5bb6",
    labelEn: "Resident Artists",
    href: "/residency/artists",
    icon: "artist",
    group: "residency",
    status: "comingSoon",
  },
  {
    labelZh: "\u9a7b\u5730\u7533\u8bf7",
    labelEn: "Residency Application",
    href: "/residency/application",
    icon: "file",
    group: "residency",
    status: "comingSoon",
  },
  {
    labelZh: "\u56fd\u9645\u5927\u5e08\u73ed",
    labelEn: "International Masterclass",
    href: "/study/masterclass",
    icon: "study",
    group: "study",
    status: "live",
  },
  {
    labelZh: "\u56fd\u9645\u7814\u5b66",
    labelEn: "International Study",
    href: "/study/international-study",
    icon: "globe",
    group: "study",
    status: "comingSoon",
  },
  {
    labelZh: "\u7ebf\u4e0b\u4f53\u9a8c",
    labelEn: "Offline Experience",
    href: "/events/offline-experience",
    icon: "spark",
    group: "offlineExperience",
    status: "live",
    activePathPrefixes: ["/events/offline-workshop/"],
  },
  {
    labelZh: "\u827a\u672f\u516c\u5f00\u8bfe",
    labelEn: "Art Open Class",
    href: "/events/open-class",
    icon: "book",
    group: "events",
    status: "comingSoon",
  },
  {
    labelZh: "\u6d3b\u52a8",
    labelEn: "Activity",
    href: "/events/activity",
    icon: "calendar",
    group: "events",
    status: "comingSoon",
  },
  {
    labelZh: "\u73bb\u7483\u827a\u672f",
    labelEn: "Glass Art",
    href: "/art-creation/glass-art",
    icon: "glass",
    group: "artCreation",
    status: "live",
    activePathPrefixes: ["/art-projects/glass-art"],
  },
  {
    labelZh: "\u88c5\u7f6e\u827a\u672f",
    labelEn: "Installation Art",
    href: "/art-creation/installation-art",
    icon: "install",
    group: "artCreation",
    status: "live",
    activePathPrefixes: ["/art-projects/installation-art"],
  },
  {
    labelZh: "\u516c\u5171\u827a\u672f",
    labelEn: "Public Art",
    href: "/art-creation/public-art",
    icon: "museum",
    group: "artCreation",
    status: "live",
    activePathPrefixes: ["/art-projects/public-art"],
  },
  {
    labelZh: "\u5546\u5e97",
    labelEn: "Shop",
    href: "/store",
    icon: "bag",
    group: "shop",
    status: "live",
    activePathPrefixes: ["/shop"],
  },
];

export function getNavigationHref(item: NavigationItem, locale: Locale) {
  return item.href === "/" ? `/${locale}` : `/${locale}${item.href}`;
}

export function normalizePathForNavigation(pathname: string) {
  if (pathname === "/en" || pathname === "/zh") {
    return "/";
  }

  if (pathname.startsWith("/en/") || pathname.startsWith("/zh/")) {
    return pathname.replace(/^\/(en|zh)/, "");
  }

  return pathname;
}

export function isNavigationItemActive(item: NavigationItem, pathname: string) {
  const normalizedPath = normalizePathForNavigation(pathname);

  if (item.href === "/") {
    return normalizedPath === "/";
  }

  return (
    normalizedPath === item.href || normalizedPath.startsWith(`${item.href}/`)
    || item.activePathPrefixes?.some((prefix) =>
      normalizedPath.startsWith(prefix),
    )
  );
}

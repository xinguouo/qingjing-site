export const internalPageTargets = [
  { title: "\u9996\u9875 / Home", value: "home", href: "/" },
  {
    title: "\u4f7f\u547d\u613f\u666f / Mission & Vision",
    value: "mission-vision",
    href: "/about/mission-vision",
  },
  {
    title: "\u56e2\u961f\u6210\u5458 / Team Members",
    value: "team",
    href: "/about/team",
  },
  {
    title: "\u8054\u7cfb\u6211\u4eec / Contact",
    value: "contact",
    href: "/about/contact",
  },
  {
    title: "\u9ad8\u7ea7\u7814\u5b66 / Advanced Study",
    value: "advanced-study",
    href: "/study/advanced-study",
  },
  {
    title: "\u5927\u5e08\u7814\u4fee\u73ed / Masterclass",
    value: "masterclass",
    href: "/study/masterclass",
  },
  {
    title: "\u7ebf\u4e0b\u4f53\u9a8c / Offline Experience",
    value: "offline-experience",
    href: "/events/offline-experience",
  },
  {
    title: "\u827a\u672f\u516c\u5f00\u8bfe / Open Class",
    value: "open-class",
    href: "/events/open-class",
  },
  {
    title: "\u827a\u672f\u6d3b\u52a8 / Art Activity",
    value: "activity",
    href: "/events/activity",
  },
  {
    title: "\u827a\u672f\u521b\u4f5c / Art Creation",
    value: "art-creation",
    href: "/art-creation/sculpture",
  },
  {
    title: "\u73bb\u7483\u67b6\u4e0a\u827a\u672f / Glass Easel Art",
    value: "art-sculpture",
    href: "/art-creation/sculpture",
  },
  {
    title: "\u73bb\u7483\u88c5\u7f6e\u827a\u672f / Glass Installation Art",
    value: "art-installation",
    href: "/art-creation/installation-art",
  },
  {
    title: "\u73bb\u7483\u516c\u5171\u827a\u672f / Glass Public Art",
    value: "art-public",
    href: "/art-creation/public-art",
  },
  { title: "\u5546\u5e97 / Shop", value: "shop", href: "/shop" },
  {
    title: "\u5728\u552e\u827a\u672f\u5546\u54c1 / Available Art Goods",
    value: "shop-artworks",
    href: "/shop",
  },
  {
    title: "\u827a\u672f\u884d\u751f\u54c1 / Art Derivatives",
    value: "shop-derivatives",
    href: "/shop?category=derivatives",
  },
] as const;

export type InternalPageTarget = (typeof internalPageTargets)[number]["value"];

export const internalPageTargetOptions = internalPageTargets.map(
  ({ title, value }) => ({ title, value }),
);

export function internalPageHref(
  target: string | null | undefined,
  locale: "zh" | "en",
) {
  const page = internalPageTargets.find((item) => item.value === target);

  if (!page) {
    return null;
  }

  if (page.href === "/") {
    return `/${locale}`;
  }

  return `/${locale}${page.href}`;
}

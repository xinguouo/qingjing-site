import type { NavigationItem } from "@/config/navigation";

type SidebarNavIconProps = {
  href: NavigationItem["href"];
  size?: 18 | 20;
};

const sidebarIconByHref: Record<string, string> = {
  "/": "/icons/sidebar/home.svg",
  "/about/mission-vision": "/icons/sidebar/mission-vision.svg",
  "/about/team": "/icons/sidebar/team.svg",
  "/about/contact": "/icons/sidebar/contact.svg",
  "/residency/artists": "/icons/sidebar/residency-artists.svg",
  "/residency/application": "/icons/sidebar/residency-application.svg",
  "/study/master-workshop": "/icons/sidebar/masterclass.svg",
  "/study/masterclass": "/icons/sidebar/masterclass.svg",
  "/study/advanced-study": "/icons/sidebar/international-study.svg",
  "/study/international-study": "/icons/sidebar/international-study.svg",
  "/events/offline-experience": "/icons/sidebar/offline-experience.svg",
  "/events/open-class": "/icons/sidebar/open-class.svg",
  "/events/activity": "/icons/sidebar/activity.svg",
  "/art-creation/sculpture": "/icons/sidebar/sculpture.svg",
  "/art-creation/installation-art": "/icons/sidebar/installation-art.svg",
  "/art-creation/public-art": "/icons/sidebar/public-art.svg",
  "/store": "/icons/sidebar/shop.svg",
  "/shop": "/icons/sidebar/shop.svg",
};

export function SidebarNavIcon({ href, size = 18 }: SidebarNavIconProps) {
  const iconUrl = sidebarIconByHref[href] || sidebarIconByHref["/"];

  return (
    <span
      aria-hidden="true"
      className="block shrink-0 bg-current"
      style={{
        height: size,
        mask: `url(${iconUrl}) center / contain no-repeat`,
        WebkitMask: `url(${iconUrl}) center / contain no-repeat`,
        width: size,
      }}
    />
  );
}

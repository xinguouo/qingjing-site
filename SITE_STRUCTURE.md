# SITE_STRUCTURE.md

This document defines the confirmed Phase 1 information architecture for the Qingjing website.

## Global Rules

- All public pages must support `/zh` and `/en` routes.
- Desktop uses a left sidebar navigation plus a top search bar.
- Mobile uses a top navigation bar plus a drawer menu.
- Mobile must not show the full desktop sidebar.
- The left sidebar and mobile drawer only show navigation column pages.
- Detail pages must not appear in `src/config/navigation.ts`.
- Detail pages must only be entered by clicking cards from their parent list page.
- All pages must support desktop and mobile responsive layouts.

## Left Sidebar Navigation

The left sidebar navigation must be exactly:

```text
首页
- 首页

关于我们
- 使命愿景
- 团队介绍
- 联系我们

驻地计划
- 驻地艺术家
- 驻地申请

研学
- 国际大师班
- 国际研学

活动
- 线下体验
- 艺术公开课
- 活动

艺术创作
- 玻璃艺术
- 装置艺术
- 公共艺术
- 雕塑艺术

商店
- 商店
```

## Navigation Pages

These pages may appear in the desktop sidebar and mobile drawer.

| Group Zh | Group En | Page Zh | Page En | Status | Zh Route | En Route |
| --- | --- | --- | --- | --- | --- | --- |
| 首页 | Home | 首页 | Home | live | `/zh` | `/en` |
| 关于我们 | About Us | 使命愿景 | Mission & Vision | live | `/zh/about/mission-vision` | `/en/about/mission-vision` |
| 关于我们 | About Us | 团队介绍 | Team | live | `/zh/about/team` | `/en/about/team` |
| 关于我们 | About Us | 联系我们 | Contact Us | live | `/zh/about/contact` | `/en/about/contact` |
| 驻地计划 | Residency Program | 驻地艺术家 | Resident Artists | comingSoon | `/zh/residency/artists` | `/en/residency/artists` |
| 驻地计划 | Residency Program | 驻地申请 | Residency Application | comingSoon | `/zh/residency/application` | `/en/residency/application` |
| 研学 | Study | 国际大师班 | International Masterclass | live | `/zh/study/masterclass` | `/en/study/masterclass` |
| 研学 | Study | 国际研学 | International Study | comingSoon | `/zh/study/international-study` | `/en/study/international-study` |
| 活动 | Events | 线下体验 | Offline Experience | live | `/zh/events/offline-experience` | `/en/events/offline-experience` |
| 活动 | Events | 艺术公开课 | Art Open Class | comingSoon | `/zh/events/open-class` | `/en/events/open-class` |
| 活动 | Events | 活动 | Activity | comingSoon | `/zh/events/activity` | `/en/events/activity` |
| 艺术创作 | Art Creation | 玻璃艺术 | Glass Art | live | `/zh/art-creation/glass-art` | `/en/art-creation/glass-art` |
| 艺术创作 | Art Creation | 装置艺术 | Installation Art | live | `/zh/art-creation/installation-art` | `/en/art-creation/installation-art` |
| 艺术创作 | Art Creation | 公共艺术 | Public Art | live | `/zh/art-creation/public-art` | `/en/art-creation/public-art` |
| 艺术创作 | Art Creation | 雕塑艺术 | Sculpture Art | live | `/zh/art-creation/sculpture-art` | `/en/art-creation/sculpture-art` |
| 商店 | Shop | 商店 | Shop | live | `/zh/shop` | `/en/shop` |

## Detail Pages

These pages must not appear in the left sidebar navigation or mobile drawer.

| Parent Page Zh | Parent Page En | Detail Zh | Detail En | Status | Zh Route | En Route | Entry Point |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 团队介绍 | Team | 艺术家个人介绍 | Artist Profile | live | `/zh/about/artists/[slug]` | `/en/about/artists/[slug]` | Team list card |
| 国际大师班 | International Masterclass | 课程详情 | Masterclass Detail | live | `/zh/study/masterclass/[slug]` | `/en/study/masterclass/[slug]` | Masterclass list card |
| 国际研学 | International Study | 课程介绍 | International Study Course Detail | comingSoon | `/zh/study/international-study/[slug]` | `/en/study/international-study/[slug]` | International Study list card |
| 线下体验 | Offline Experience | 活动详情 | Offline Experience Detail | live | `/zh/events/offline-experience/[slug]` | `/en/events/offline-experience/[slug]` | Offline Experience list card |
| 玻璃艺术 | Glass Art | 作品详情 | Artwork Detail | live | `/zh/art-creation/glass-art/[slug]` | `/en/art-creation/glass-art/[slug]` | Glass Art work card |
| 装置艺术 | Installation Art | 作品详情 | Artwork Detail | live | `/zh/art-creation/installation-art/[slug]` | `/en/art-creation/installation-art/[slug]` | Installation Art work card |
| 公共艺术 | Public Art | 作品详情 | Artwork Detail | live | `/zh/art-creation/public-art/[slug]` | `/en/art-creation/public-art/[slug]` | Public Art work card |
| 雕塑艺术 | Sculpture Art | 作品详情 | Artwork Detail | live | `/zh/art-creation/sculpture-art/[slug]` | `/en/art-creation/sculpture-art/[slug]` | Sculpture Art work card |
| 商店 | Shop | 商品详情 | Product Detail | live | `/zh/shop/[slug]` | `/en/shop/[slug]` | Product card |

## Implementation Notes

- `DesktopSidebar` and `MobileDrawer` must read the same `src/config/navigation.ts`.
- `live` navigation items link to real pages.
- `comingSoon` navigation items are clickable and must render `ComingSoonPage`.
- `comingSoon` routes must not 404.
- Current-page active state must work for both navigation pages and detail pages.
- Chinese pages show Chinese navigation labels.
- English pages show English navigation labels.
- Art creation content uses Sanity `artWork`; legacy `artProject` can remain only for data compatibility.

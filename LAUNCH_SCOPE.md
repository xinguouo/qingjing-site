# LAUNCH_SCOPE.md

This document defines the confirmed Phase 1 launch scope for the Qingjing website.

## Global Launch Rules

- Black content = `live`: real page, reads Sanity CMS content.
- Gray content = `comingSoon`: renders `ComingSoonPage`.
- All pages must support `/zh` and `/en`.
- All pages must support desktop and mobile responsive layouts.
- Desktop uses the left sidebar navigation plus a top search bar.
- Mobile uses a top navigation bar plus a drawer menu.
- Detail pages are not shown in the left sidebar navigation or mobile drawer.
- Detail pages can only be reached from cards on their parent listing/category page.
- ComingSoon pages must show: `该内容暂未开放，敬请期待`.
- ComingSoon pages must not return 404.

## Phase 1 Live Pages

| Section Zh | Section En | Page Zh | Page En | Type | Zh Route | En Route | Content Source | Sidebar |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 首页 | Home | 首页 | Home | Navigation page | `/zh` | `/en` | Sanity: `homePage`, `siteSettings` | Yes |
| 关于我们 | About Us | 使命愿景 | Mission & Vision | Navigation page | `/zh/about/mission-vision` | `/en/about/mission-vision` | Sanity: `aboutPage` | Yes |
| 关于我们 | About Us | 团队介绍 | Team | Navigation page | `/zh/about/team` | `/en/about/team` | Sanity: `teamMember`, `artist` | Yes |
| 关于我们 | About Us | 艺术家个人介绍 | Artist Profile | Detail page | `/zh/about/artists/[slug]` | `/en/about/artists/[slug]` | Sanity: `artist` | No |
| 关于我们 | About Us | 联系我们 | Contact Us | Navigation page | `/zh/about/contact` | `/en/about/contact` | Sanity: `siteSettings`, `aboutPage` | Yes |
| 研学 | Study | 国际大师班 | International Masterclass | Navigation page | `/zh/study/masterclass` | `/en/study/masterclass` | Sanity: `studyProgram` where `programType == "international-masterclass"` | Yes |
| 研学 | Study | 国际大师班课程详情 | International Masterclass Detail | Detail page | `/zh/study/masterclass/[slug]` | `/en/study/masterclass/[slug]` | Sanity: `studyProgram` | No |
| 活动 | Events | 线下体验 | Offline Experience | Navigation page | `/zh/events/offline-experience` | `/en/events/offline-experience` | Sanity: `event` where `eventType == "offline-experience"` | Yes |
| 活动 | Events | 线下体验活动详情 | Offline Experience Detail | Detail page | `/zh/events/offline-experience/[slug]` | `/en/events/offline-experience/[slug]` | Sanity: `event` | No |
| 艺术创作 | Art Creation | 玻璃艺术 | Glass Art | Navigation page | `/zh/art-creation/glass-art` | `/en/art-creation/glass-art` | Sanity: `artWork` where `workType == "glass-art"` | Yes |
| 艺术创作 | Art Creation | 玻璃艺术作品详情 | Glass Art Detail | Detail page | `/zh/art-creation/glass-art/[slug]` | `/en/art-creation/glass-art/[slug]` | Sanity: `artWork` | No |
| 艺术创作 | Art Creation | 装置艺术 | Installation Art | Navigation page | `/zh/art-creation/installation-art` | `/en/art-creation/installation-art` | Sanity: `artWork` where `workType == "installation-art"` | Yes |
| 艺术创作 | Art Creation | 装置艺术作品详情 | Installation Art Detail | Detail page | `/zh/art-creation/installation-art/[slug]` | `/en/art-creation/installation-art/[slug]` | Sanity: `artWork` | No |
| 艺术创作 | Art Creation | 公共艺术 | Public Art | Navigation page | `/zh/art-creation/public-art` | `/en/art-creation/public-art` | Sanity: `artWork` where `workType == "public-art"` | Yes |
| 艺术创作 | Art Creation | 公共艺术作品详情 | Public Art Detail | Detail page | `/zh/art-creation/public-art/[slug]` | `/en/art-creation/public-art/[slug]` | Sanity: `artWork` | No |
| 艺术创作 | Art Creation | 雕塑艺术 | Sculpture Art | Navigation page | `/zh/art-creation/sculpture-art` | `/en/art-creation/sculpture-art` | Sanity: `artWork` where `workType == "sculpture-art"` | Yes |
| 艺术创作 | Art Creation | 雕塑艺术作品详情 | Sculpture Art Detail | Detail page | `/zh/art-creation/sculpture-art/[slug]` | `/en/art-creation/sculpture-art/[slug]` | Sanity: `artWork` | No |
| 商店 | Shop | 商店 | Shop | Navigation page | `/zh/shop` | `/en/shop` | Sanity: `product` | Yes |
| 商店 | Shop | 商品详情 | Product Detail | Detail page | `/zh/shop/[slug]` | `/en/shop/[slug]` | Sanity: `product` | No |

## Phase 1 ComingSoon Pages

| Section Zh | Section En | Page Zh | Page En | Type | Zh Route | En Route | Phase 1 Behavior | Sidebar |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 驻地计划 | Residency Program | 驻地艺术家 | Resident Artists | Navigation page | `/zh/residency/artists` | `/en/residency/artists` | Render `ComingSoonPage` | Yes |
| 驻地计划 | Residency Program | 驻地申请 | Residency Application | Navigation page | `/zh/residency/application` | `/en/residency/application` | Render `ComingSoonPage` | Yes |
| 研学 | Study | 国际研学 | International Study | Navigation page | `/zh/study/international-study` | `/en/study/international-study` | Render `ComingSoonPage` | Yes |
| 研学 | Study | 国际研学课程介绍 | International Study Course Detail | Detail page | `/zh/study/international-study/[slug]` | `/en/study/international-study/[slug]` | Render `ComingSoonPage`; must not 404 | No |
| 活动 | Events | 艺术公开课 | Art Open Class | Navigation page | `/zh/events/open-class` | `/en/events/open-class` | Render `ComingSoonPage` | Yes |
| 活动 | Events | 活动 | Activity | Navigation page | `/zh/events/activity` | `/en/events/activity` | Render `ComingSoonPage` | Yes |

## Navigation Status

### live

- 首页
- 使命愿景
- 团队介绍
- 联系我们
- 国际大师班
- 线下体验
- 玻璃艺术
- 装置艺术
- 公共艺术
- 雕塑艺术
- 商店

### comingSoon

- 驻地艺术家
- 驻地申请
- 国际研学
- 艺术公开课
- 活动

## Detail Page Entry Rules

- Detail pages must not appear in `src/config/navigation.ts`.
- Live detail pages must be entered from list cards.
- ComingSoon detail routes must render `ComingSoonPage` and must not 404.

## Implementation Notes

- `DesktopSidebar` and `MobileDrawer` must read the same `src/config/navigation.ts`.
- Chinese pages show Chinese navigation labels.
- English pages show English navigation labels.
- Current-page active state must be correct for navigation pages and detail pages.
- Legacy `artProject` may remain for existing Sanity data compatibility, but Phase 1 art creation uses `artWork`.

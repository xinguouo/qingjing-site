# COMPONENT_REUSE_PLAN.md

This document describes how to reuse frontend components across Phase 1 pages using the Figma templates in `public/figma-reference`.

## Reuse Principles

- Build from shared components before creating page-specific code.
- Preserve the Figma template structure for each page family.
- Keep `DesktopSidebar`, `MobileHeader`, `MobileDrawer`, `TopBar`, and `SearchBar` shared across all public pages.
- Keep detail pages out of navigation.
- Use template variants only where `FIGMA_TEMPLATE_MAP.md` allows it.

## Shell Components

| Component | Current Status | Used By | Reuse Rule |
| --- | --- | --- | --- |
| `AppShell` | Exists | All public pages and `ComingSoonPage` | Owns desktop sidebar, mobile nav, desktop top bar, and page content slot |
| `DesktopSidebar` | Exists | Desktop public pages | Reads `src/config/navigation.ts`; never hardcode page lists elsewhere |
| `MobileHeader` | Exists | Mobile public pages | Compact brand + menu button only |
| `MobileDrawer` | Exists | Mobile public pages | Reads same navigation data as sidebar |
| `TopBar` | Planned extraction from `AppShell` | Desktop pages | Should contain page context, `SearchBar`, and utility controls |
| `SearchBar` | Planned extraction from `AppShell` | Desktop TopBar, possibly mobile drawer | Pill input/control, no heavy search UI unless implemented later |

## Page Composition Components

| Component | Template Source | Used By | Notes |
| --- | --- | --- | --- |
| `PageHeader` | All inner Figma templates | All listing and detail pages | Eyebrow, large title, intro, divider |
| `SectionBlock` | All templates | Long pages | Handles vertical rhythm and max-width |
| `HeroMedia` | `home-desktop.png`, about templates | Home, mission, detail intro sections | Image-led hero with stable aspect ratio |
| `DetailHeader` | Detail templates | Artist, study, event, art work, shop detail | Title, metadata, primary image or gallery entry |
| `DetailBody` | `study-masterclass-detail-desktop.png` | Study/event detail | Long content sections, image/text rhythm |
| `ImageGallery` | Art/shop/detail templates | Art work, product, event, study outcomes | Must preserve image-specific ratio rules |
| `ShareButton` | TopBar/detail utility | Detail pages | Small, quiet utility button |

## Card Components

| Component | Direct Template | Data Type | Primary Routes |
| --- | --- | --- | --- |
| `ProgramCard` | `study-masterclass-desktop.png` | `studyProgram` | `/zh/study/masterclass`, `/en/study/masterclass` |
| `EventCard` | `events-offline-experience-desktop.png`, `events-overview-desktop.png` | `event` | `/zh/events/offline-experience`, `/en/events/offline-experience` |
| `WorkCard` | `art-creation-glass-art-desktop.png` | `artWork` | Art creation category pages |
| `ProductCard` | `shop-overview-desktop.png` | `product` | `/zh/shop`, `/en/shop` |
| `PersonCard` | `about-team-desktop.png` | `teamMember`, `artist` | `/zh/about/team`, `/en/about/team` |

## Route To Component Plan

### Home

| Route | Template | Components |
| --- | --- | --- |
| `/zh`, `/en` | `home-desktop.png` | `AppShell`, `PageHeader` or home hero variant, `HeroMedia`, `ProgramCard`, `EventCard`, `WorkCard`, `ProductCard` |

### About

| Route | Template | Components |
| --- | --- | --- |
| `/zh/about/mission-vision`, `/en/about/mission-vision` | `about-mission-vision-desktop.png` | `AppShell`, `PageHeader`, `HeroMedia`, `SectionBlock` |
| `/zh/about/team`, `/en/about/team` | `about-team-desktop.png` | `AppShell`, `PageHeader`, `PersonCard` |
| `/zh/about/artists/[slug]`, `/en/about/artists/[slug]` | `about-artist-profile-desktop.png` | `AppShell`, `DetailHeader`, `ImageGallery`, `DetailBody`, `ShareButton` |
| `/zh/about/contact`, `/en/about/contact` | `about-contact-desktop.png` | `AppShell`, `PageHeader`, contact info cards, map/media card |

### Study

| Route | Template | Components |
| --- | --- | --- |
| `/zh/study/masterclass`, `/en/study/masterclass` | `study-masterclass-desktop.png` | `AppShell`, `PageHeader`, `ProgramCard` |
| `/zh/study/masterclass/[slug]`, `/en/study/masterclass/[slug]` | `study-masterclass-detail-desktop.png` | `AppShell`, `DetailHeader`, `ImageGallery`, `DetailBody`, `ShareButton` |
| `/zh/study/international-study`, `/en/study/international-study` | `ComingSoonPage` in Phase 1 | `ComingSoonPage`; later `ProgramCard` variant |
| `/zh/study/international-study/[slug]`, `/en/study/international-study/[slug]` | `ComingSoonPage` in Phase 1 | `ComingSoonPage`; later study detail variant |

### Events

| Route | Template | Components |
| --- | --- | --- |
| `/zh/events/offline-experience`, `/en/events/offline-experience` | `events-offline-experience-desktop.png` | `AppShell`, `PageHeader`, `EventCard` |
| `/zh/events/offline-experience/[slug]`, `/en/events/offline-experience/[slug]` | `study-masterclass-detail-desktop.png` variant | `AppShell`, `DetailHeader`, `ImageGallery`, `DetailBody`, `ShareButton` |
| `/zh/events/open-class`, `/en/events/open-class` | `ComingSoonPage` in Phase 1 | `ComingSoonPage`; later `events-overview-desktop.png` variant |
| `/zh/events/activity`, `/en/events/activity` | `ComingSoonPage` in Phase 1 | `ComingSoonPage`; later `events-overview-desktop.png` variant |

### Art Creation

| Route | Template | Components |
| --- | --- | --- |
| `/zh/art-creation/glass-art`, `/en/art-creation/glass-art` | `art-creation-glass-art-desktop.png` | `AppShell`, `PageHeader`, `WorkCard` |
| `/zh/art-creation/installation-art`, `/en/art-creation/installation-art` | Glass art listing variant | `AppShell`, `PageHeader`, `WorkCard` |
| `/zh/art-creation/public-art`, `/en/art-creation/public-art` | Glass art listing variant | `AppShell`, `PageHeader`, `WorkCard` |
| `/zh/art-creation/sculpture-art`, `/en/art-creation/sculpture-art` | Glass art listing variant | `AppShell`, `PageHeader`, `WorkCard` |
| `/zh/art-creation/*/[slug]`, `/en/art-creation/*/[slug]` | `art-creation-glass-art-detail-desktop.png` | `AppShell`, `DetailHeader`, `ImageGallery`, `ShareButton` |

### Shop

| Route | Template | Components |
| --- | --- | --- |
| `/zh/shop`, `/en/shop` | `shop-overview-desktop.png` | `AppShell`, `PageHeader`, `ProductCard` |
| `/zh/shop/[slug]`, `/en/shop/[slug]` with `available-artworks` | `shop-available-artwork-detail-desktop.png` | `ShopAvailableArtworkDetailTemplate`, `ProductGallery`, `ProductInfoPanel`, `ShareButton` |
| `/zh/shop/[slug]`, `/en/shop/[slug]` with `art-derivatives` | `shop-art-derivative-detail-desktop.png` | `ShopArtDerivativeDetailTemplate`, `ProductGallery`, `ProductInfoPanel`, `ShareButton` |
| `/zh/shop/[slug]`, `/en/shop/[slug]` with `cultural-products` | `shop-product-detail-desktop.png` | `ShopCulturalProductDetailTemplate`, `ProductGallery`, `ProductInfoPanel`, `ShareButton` |

## Shop Detail Template Selection

Product detail pages must choose the template by `product.productType`.

| Product Type | Template Component | Figma Source |
| --- | --- | --- |
| `available-artworks` | `ShopAvailableArtworkDetailTemplate` | `shop-available-artwork-detail-desktop.png` |
| `art-derivatives` | `ShopArtDerivativeDetailTemplate` | `shop-art-derivative-detail-desktop.png` |
| `cultural-products` | `ShopCulturalProductDetailTemplate` | `shop-product-detail-desktop.png` |

Do not collapse these into one generic shop detail template unless the type-specific visual differences are preserved.

## Component Data Contracts

### ProgramCard

Uses `studyProgram`: title, slug, coverImage, posterImage, courseIntro, fees, faculty, outcomes.

### EventCard

Uses `event`: title, slug, eventType, coverImage, posterImage, content, galleryImages.

### WorkCard

Uses `artWork`: title, slug, workType, images, description, size.

Do not show author, year, material, code, price, or collection info for `artWork`.

### ProductCard

Uses `product`: title, slug, productType, derivativeCategory, coverImage, images, price, size, description, stockStatus.

### ImageGallery

Accepts image arrays from Sanity image fields. It must support one image, many images, missing images, poster images, artwork images, and product images.

### ShareButton

Accepts a URL and label. It should be usable in TopBar or detail pages.

## Extraction Order

1. Keep `AppShell`, `DesktopSidebar`, `MobileHeader`, and `MobileDrawer` as shell foundation.
2. Extract `TopBar` and `SearchBar` from `AppShell`.
3. Build `PageHeader`, `SectionBlock`, and common button/tag primitives.
4. Build card components: `ProgramCard`, `EventCard`, `WorkCard`, `ProductCard`, `PersonCard`.
5. Build `ImageGallery`, `DetailHeader`, `DetailBody`, and `ShareButton`.
6. Build shop detail templates split by product type.
7. Implement pages by composing these components against the mapped Figma template.

## Implementation Boundary

This is a reuse plan only. Do not implement page code from this document unless a separate task asks for it.

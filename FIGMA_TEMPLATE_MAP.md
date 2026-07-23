# FIGMA_TEMPLATE_MAP.md

This document maps the exported Figma page templates in `public/figma-reference` to the Phase 1 Qingjing website routes.

These images are not loose visual references. They are project-level page design templates. Future pages should reuse their layout structure, card systems, spacing, typography hierarchy, navigation treatment, and responsive behavior.

## Available Figma Templates

| Figma File | Template Role |
| --- | --- |
| `home-desktop.png` | Home page template |
| `about-mission-vision-desktop.png` | About / Mission & Vision page template |
| `about-team-desktop.png` | About / Team listing page template |
| `about-artist-profile-desktop.png` | Artist profile detail page template |
| `about-contact-desktop.png` | Contact page template |
| `study-masterclass-desktop.png` | Study / Masterclass listing page template |
| `study-masterclass-detail-desktop.png` | Study program detail page template |
| `events-offline-experience-desktop.png` | Offline experience event listing page template |
| `events-overview-desktop.png` | General events listing/overview template |
| `art-creation-glass-art-desktop.png` | Art creation category listing template |
| `art-creation-glass-art-detail-desktop.png` | Art work detail template |
| `shop-overview-desktop.png` | Shop overview/listing template |
| `shop-available-artwork-detail-desktop.png` | Available artwork product detail template |
| `shop-art-derivative-detail-desktop.png` | Art derivative product detail template |
| `shop-product-detail-desktop.png` | General product/cultural product detail template |

## Direct Template Mapping

These routes should follow the matching Figma file directly.

| Page | Zh Route | En Route | Figma Template | Notes |
| --- | --- | --- | --- | --- |
| Home | `/zh` | `/en` | `home-desktop.png` | Direct home template |
| Mission & Vision | `/zh/about/mission-vision` | `/en/about/mission-vision` | `about-mission-vision-desktop.png` | Direct about content template |
| Team | `/zh/about/team` | `/en/about/team` | `about-team-desktop.png` | Direct team/card listing template |
| Artist Profile | `/zh/about/artists/[slug]` | `/en/about/artists/[slug]` | `about-artist-profile-desktop.png` | Detail page; not in sidebar |
| Contact | `/zh/about/contact` | `/en/about/contact` | `about-contact-desktop.png` | Direct contact template |
| International Masterclass | `/zh/study/masterclass` | `/en/study/masterclass` | `study-masterclass-desktop.png` | Direct study listing template |
| International Masterclass Detail | `/zh/study/masterclass/[slug]` | `/en/study/masterclass/[slug]` | `study-masterclass-detail-desktop.png` | Detail page; not in sidebar |
| Offline Experience | `/zh/events/offline-experience` | `/en/events/offline-experience` | `events-offline-experience-desktop.png` | Direct event listing template |
| Offline Experience Detail | `/zh/events/offline-experience/[slug]` | `/en/events/offline-experience/[slug]` | `study-masterclass-detail-desktop.png` | Reuse detail/content sections for event detail until a dedicated event detail template exists |
| Glass Art | `/zh/art-creation/glass-art` | `/en/art-creation/glass-art` | `art-creation-glass-art-desktop.png` | Direct art work listing template |
| Glass Art Detail | `/zh/art-creation/glass-art/[slug]` | `/en/art-creation/glass-art/[slug]` | `art-creation-glass-art-detail-desktop.png` | Detail page; not in sidebar |
| Shop | `/zh/shop` | `/en/shop` | `shop-overview-desktop.png` | Direct shop listing template |

## Variant Template Mapping

These routes do not have a one-to-one Figma export, but must reuse an existing template as a controlled variant.

| Page | Zh Route | En Route | Base Template | Variant Rule |
| --- | --- | --- | --- | --- |
| Resident Artists | `/zh/residency/artists` | `/en/residency/artists` | `about-team-desktop.png` | Phase 1 shows `ComingSoonPage`; when live, reuse team/person listing structure |
| Residency Application | `/zh/residency/application` | `/en/residency/application` | `about-contact-desktop.png` | Phase 1 shows `ComingSoonPage`; when live, reuse contact/inquiry page structure |
| International Study | `/zh/study/international-study` | `/en/study/international-study` | `study-masterclass-desktop.png` | Phase 1 shows `ComingSoonPage`; when live, reuse study listing layout |
| International Study Detail | `/zh/study/international-study/[slug]` | `/en/study/international-study/[slug]` | `study-masterclass-detail-desktop.png` | Phase 1 shows `ComingSoonPage`; detail page stays out of sidebar |
| Art Open Class | `/zh/events/open-class` | `/en/events/open-class` | `events-overview-desktop.png` | Phase 1 shows `ComingSoonPage`; when live, use event overview/listing variant |
| Activity | `/zh/events/activity` | `/en/events/activity` | `events-overview-desktop.png` | Phase 1 shows `ComingSoonPage`; when live, use event overview/listing variant |
| Installation Art | `/zh/art-creation/installation-art` | `/en/art-creation/installation-art` | `art-creation-glass-art-desktop.png` | Swap copy/content/category only; preserve art listing system |
| Installation Art Detail | `/zh/art-creation/installation-art/[slug]` | `/en/art-creation/installation-art/[slug]` | `art-creation-glass-art-detail-desktop.png` | Detail page variant |
| Public Art | `/zh/art-creation/public-art` | `/en/art-creation/public-art` | `art-creation-glass-art-desktop.png` | Swap copy/content/category only; preserve art listing system |
| Public Art Detail | `/zh/art-creation/public-art/[slug]` | `/en/art-creation/public-art/[slug]` | `art-creation-glass-art-detail-desktop.png` | Detail page variant |
| Sculpture Art | `/zh/art-creation/sculpture-art` | `/en/art-creation/sculpture-art` | `art-creation-glass-art-desktop.png` | Swap copy/content/category only; preserve art listing system |
| Sculpture Art Detail | `/zh/art-creation/sculpture-art/[slug]` | `/en/art-creation/sculpture-art/[slug]` | `art-creation-glass-art-detail-desktop.png` | Detail page variant |

## Shop Detail Template Split

The shop detail route is dynamic: `/zh/shop/[slug]` and `/en/shop/[slug]`.

The detail template must be selected by `productType`.

| Product Type | Chinese Meaning | Detail Template | Rule |
| --- | --- | --- | --- |
| `available-artworks` | 在售艺术作品 | `shop-available-artwork-detail-desktop.png` | Use for one-off artwork/product objects with artwork-led imagery |
| `art-derivatives` | 艺术衍生品 | `shop-art-derivative-detail-desktop.png` | Use for derivative products; may further vary by `derivativeCategory` |
| `cultural-products` | 文创产品 | `shop-product-detail-desktop.png` | Use as the current cultural product/general merchandise detail template |

`shop-product-detail-desktop.png` is a fallback only for general product detail. It must not replace the more specific available-artwork or art-derivative detail templates.

## Reusable Components To Abstract

These components should be abstracted from the Figma templates before implementing page-specific variations:

- `AppShell`: desktop sidebar, top search bar, mobile top navigation, mobile drawer.
- `SidebarNavigation`: grouped navigation with active state and comingSoon state.
- `PageHeader`: large page title, bilingual hierarchy, section intro.
- `HeroMedia`: full-width or feature image treatment used by home and content pages.
- `SectionBlock`: constrained content band with consistent vertical rhythm.
- `ContentCard`: reusable card for people, events, study programs, artworks, and products.
- `ImageGrid`: responsive image grid for art work, product, event, and study outcomes.
- `DetailHeader`: detail page title, metadata area, and primary image/gallery entry.
- `DetailBody`: long-form bilingual content sections with consistent spacing.
- `ProductGallery`: shop-specific image gallery.
- `ProductInfoPanel`: price, size, stock status, and product details.
- `ComingSoonPage`: gray/white deferred-page template inside `AppShell`.

## Pages Without Dedicated Figma Templates

These pages currently do not have a dedicated Figma export and must be completed by reusing existing templates.

| Page | Route | Required Base Template |
| --- | --- | --- |
| Resident Artists | `/zh/residency/artists`, `/en/residency/artists` | `about-team-desktop.png` when live; `ComingSoonPage` in Phase 1 |
| Residency Application | `/zh/residency/application`, `/en/residency/application` | `about-contact-desktop.png` when live; `ComingSoonPage` in Phase 1 |
| International Study | `/zh/study/international-study`, `/en/study/international-study` | `study-masterclass-desktop.png` when live; `ComingSoonPage` in Phase 1 |
| International Study Detail | `/zh/study/international-study/[slug]`, `/en/study/international-study/[slug]` | `study-masterclass-detail-desktop.png` when live; `ComingSoonPage` in Phase 1 |
| Art Open Class | `/zh/events/open-class`, `/en/events/open-class` | `events-overview-desktop.png` when live; `ComingSoonPage` in Phase 1 |
| Activity | `/zh/events/activity`, `/en/events/activity` | `events-overview-desktop.png` when live; `ComingSoonPage` in Phase 1 |
| Event Detail | `/zh/events/offline-experience/[slug]`, `/en/events/offline-experience/[slug]` | `study-masterclass-detail-desktop.png` until a dedicated event detail template exists |
| Installation/Public/Sculpture Art Listing | `/zh/art-creation/*`, `/en/art-creation/*` | `art-creation-glass-art-desktop.png` |
| Installation/Public/Sculpture Art Detail | `/zh/art-creation/*/[slug]`, `/en/art-creation/*/[slug]` | `art-creation-glass-art-detail-desktop.png` |

## Responsive Rules

- Desktop must preserve the template system: left sidebar, top search bar, large whitespace, strict card rhythm, and image-led composition.
- Mobile must translate the same template system into top navigation plus drawer; full desktop sidebar must not appear.
- Cards should collapse predictably to one column on mobile.
- Detail page image galleries must preserve artwork/product legibility and avoid aggressive cropping.
- Typography hierarchy should follow the Figma templates before introducing new font sizes or weights.
- Spacing should be reused from the closest matching template instead of being invented per page.

## Implementation Boundary

This document is a template map only.

Do not implement page code from this file directly unless a separate implementation task asks for it.

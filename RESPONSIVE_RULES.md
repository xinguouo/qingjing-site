# RESPONSIVE_RULES.md

This document defines responsive behavior for the Qingjing frontend component system.

The desktop Figma templates in `public/figma-reference` are the primary layout source. Mobile behavior is derived from those templates and the current Phase 1 shell requirements.

## Breakpoints

| Range | Rule |
| --- | --- |
| `< 640px` | Mobile |
| `640px to 1023px` | Large mobile / tablet |
| `>= 1024px` | Desktop shell with sidebar |
| `>= 1280px` | Wide desktop content rhythm |

The current shell uses `lg` as the breakpoint where desktop sidebar appears.

## Shell Responsiveness

### Desktop

- Show `DesktopSidebar`.
- Hide `MobileHeader` and `MobileDrawer`.
- Main content uses `lg:pl-80`.
- TopBar remains visible above page content.
- SearchBar is visible in TopBar.
- Desktop pages can use multi-column grids.

### Mobile

- Hide `DesktopSidebar`.
- Show `MobileHeader`.
- Show `MobileDrawer` only when opened.
- Do not show the full sidebar on mobile.
- Search may be hidden, simplified, or moved into drawer.
- Main content starts below the sticky mobile header.

## Page Spacing

| Area | Desktop | Mobile |
| --- | --- | --- |
| Main horizontal padding | 80px to 96px | 20px to 24px |
| Tablet horizontal padding | 40px to 56px | 20px to 24px |
| Page header top spacing | 72px to 96px | 40px to 56px |
| Section spacing | 96px to 140px | 56px to 80px |
| Card grid gap | 32px to 48px | 16px to 24px |
| Detail section gap | 80px to 120px | 48px to 72px |

## Grid Rules

### Desktop

- Team/person grids may use 4 columns.
- Event poster grids may use 3 or 4 columns depending on density.
- Shop grids may use 3 columns with large product cards.
- Art work grids may use 2 or 3 columns depending on image scale.
- Course/program layouts should use horizontal cards: image left, content right.
- Detail pages may use two-column hero/info layouts when the Figma template does.

### Tablet

- 4 columns collapse to 2 columns.
- 3 columns collapse to 2 columns.
- Wide horizontal cards may remain horizontal if text still has room.
- Avoid compressed three-column layouts.

### Mobile

- Default to one column.
- Compact product/art grids may use two columns only when cards remain legible.
- Program cards become vertical: image top, content below.
- Event cards become one-column poster-first cards unless using a compact poster-only grid.
- Detail pages stack media, title, info panel, and body sections vertically.

## Image Ratio Rules

### Global

- Never distort images.
- Use an aspect-ratio container when the layout needs a stable frame.
- Use neutral gray placeholders for missing images.
- Do not crop important artwork, poster, or product detail images.

### Poster Images

Poster images must not be cropped.

- Use `object-contain`.
- Preferred frames: `3:4`, `4:5`, or a portrait frame from the event template.
- Background can be white or soft gray.
- This applies to event posters and study/event poster-like images.

### Artwork Images

Artwork images keep original proportions.

- Detail pages: use `object-contain` or natural image sizing.
- Listing pages: use a stable card frame only if the artwork remains readable.
- Do not force all artwork into the same crop when it changes the work.

### Product Images

- Product listing cards may use `object-cover` only if the product remains clear.
- Product detail galleries should use `object-contain` or preserve natural ratio.
- Available artwork product detail follows artwork image rules.
- Art derivative product detail supports multiple object angles.
- Cultural product detail uses the general product gallery template.

### People Images

- Team/person cards can use portrait frames around `1:1.25`.
- Faces must not be cropped aggressively.

### Hero Images

- Home and large content heroes may use wide frames around `16:6` to `16:8`.
- Cropping is acceptable only when it preserves the page subject.

## Component Responsive Rules

### DesktopSidebar

- Desktop only.
- Fixed left.
- Width `320px`.
- Full height.
- Groups remain vertically stacked.

### MobileHeader

- Mobile/tablet only below `lg`.
- Sticky top.
- Height `64px`.
- Menu button remains at least `44px` tall.

### MobileDrawer

- Mobile/tablet only below `lg`.
- Width `min(88vw, 360px)`.
- Navigation groups stack vertically.
- Detail pages do not appear as drawer items.

### TopBar

- Desktop only by default.
- Height around `80px`.
- SearchBar must not squeeze page title or utility buttons.

### SearchBar

- Desktop width target around `520px`.
- Collapse or hide on mobile.
- If shown in drawer, use full drawer width.

### PageHeader

- Desktop H1: 56px to 64px.
- Mobile H1: 36px to 44px.
- Divider spans content width.
- Intro text max width should keep line length readable.

### ProgramCard

- Desktop: horizontal card.
- Tablet: horizontal or stacked based on width.
- Mobile: stacked card.
- Poster images inside program content use `object-contain`.

### EventCard

- Desktop: multi-card row.
- Mobile: one column, or two-column poster grid only for compact browsing.
- Poster image always uses `object-contain`.

### WorkCard

- Desktop: multi-card row.
- Mobile: one column, or two columns if image and title remain legible.
- Work image keeps original proportions.

### ProductCard

- Desktop: 3-column shop grid.
- Tablet: 2 columns.
- Mobile: 1 column by default, 2 columns only for compact product browse variants.

### ImageGallery

- Desktop: may use hero image plus thumbnail grid, masonry-like rhythm, or two-column gallery based on template.
- Mobile: primary image first, thumbnails or secondary images below.
- All gallery controls must be touch-friendly.

### ComingSoonPage

- Desktop: centered large panel inside `AppShell`.
- Mobile: single-column card stack below `MobileHeader`.
- Buttons stack on narrow screens.

### ShareButton

- Icon-only controls remain at least `40px`.
- If label is shown on mobile, use a pill button and allow wrapping outside the icon.

## Shop Detail Responsive Rules

### ShopAvailableArtworkDetailTemplate

- Desktop: large artwork media area with secondary info panel.
- Mobile: artwork first, then title/info/CTA.
- Preserve artwork image proportions.

### ShopArtDerivativeDetailTemplate

- Desktop: product gallery and info panel can sit side by side.
- Mobile: gallery first, info below.
- Support several product angles without cropping.

### ShopCulturalProductDetailTemplate

- Desktop: balanced product media and detail content.
- Mobile: single-column product narrative.
- Product image should remain legible, not poster-cropped.

## Text And Overflow

- No horizontal scrolling at common viewport widths.
- Long English words and Chinese text must wrap naturally.
- Buttons should not clip text.
- Card titles may wrap to two or more lines if needed.
- Do not use viewport-width based font scaling.

## Validation Checklist

Before marking a page complete:

- Desktop shows sidebar and TopBar.
- Mobile shows top header and drawer, not full sidebar.
- Card grids collapse correctly.
- Poster images use `object-contain`.
- Artwork images preserve original proportions.
- Product detail template matches `productType`.
- No visible overlap between text, cards, buttons, and images.
- No horizontal scroll.

## Implementation Boundary

This document defines responsive behavior only. Do not implement page code from this document unless a separate task asks for it.

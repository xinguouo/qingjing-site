# DESIGN_SYSTEM.md

This document defines the Qingjing frontend design system extracted from the Figma page templates in `public/figma-reference` and mapped in `FIGMA_TEMPLATE_MAP.md`.

The Figma exports are the source of truth for Phase 1 page composition. They are not loose inspiration images.

## Visual Direction

Qingjing uses a gray-white minimalist system for an art institution and glass-art context:

- Quiet white and soft gray surfaces.
- Large whitespace and restrained typography.
- Fixed desktop sidebar as the primary identity anchor.
- Thin borders, rounded cards, and light shadows.
- Image-led layouts that let artworks, products, posters, and people carry the page.
- No loud gradients, no decorative blobs, no unrelated illustration system.

## Figma Template Set

| Template | Size | Primary Use |
| --- | --- | --- |
| `home-desktop.png` | 2670 x 4488 | Home |
| `about-mission-vision-desktop.png` | 2671 x 1863 | Mission & Vision |
| `about-team-desktop.png` | 2671 x 1863 | Team listing |
| `about-artist-profile-desktop.png` | 2670 x 3230 | Artist detail |
| `about-contact-desktop.png` | 2671 x 1863 | Contact |
| `study-masterclass-desktop.png` | 2671 x 1863 | Program listing |
| `study-masterclass-detail-desktop.png` | 2670 x 13572 | Long study/event detail |
| `events-offline-experience-desktop.png` | 2671 x 2738 | Event listing |
| `events-overview-desktop.png` | 2671 x 2738 | General event listing variant |
| `art-creation-glass-art-desktop.png` | 2670 x 2140 | Art work category listing |
| `art-creation-glass-art-detail-desktop.png` | 2671 x 2664 | Art work detail |
| `shop-overview-desktop.png` | 2670 x 2140 | Shop listing |
| `shop-available-artwork-detail-desktop.png` | 2671 x 3120 | Available artwork product detail |
| `shop-art-derivative-detail-desktop.png` | 2670 x 2140 | Art derivative product detail |
| `shop-product-detail-desktop.png` | 2671 x 2730 | Cultural/general product detail |

## Design Tokens

The implementation source for shared tokens is `styles/design-tokens.ts`.
CSS variables are exposed in `src/app/globals.css` with the `--ds-*` prefix.

Core layout tokens:

| Token | Value | Use |
| --- | --- | --- |
| `--ds-layout-sidebar` | `220px` | Desktop sidebar width target |
| `--ds-layout-content-max` | `1280px` | Maximum content working width |
| `--ds-layout-content-padding-desktop` | `64px` | Desktop content side padding |
| `--ds-layout-content-padding-tablet` | `32px` | Tablet content side padding |
| `--ds-layout-content-padding-mobile` | `20px` | Mobile content side padding |
| `--ds-layout-card-gap` | `24px` | Default grid/card gap |

### Color

| Token | Hex | Use |
| --- | --- | --- |
| `--ds-background` | `#FFFFFF` | Main page background |
| `--ds-text-primary` | `#222222` | Main text and title color |
| `--ds-text-secondary` | `#666666` | Body and secondary text |
| `--ds-border` | `#E8E8E8` | Borders and dividers |
| `--color-page-soft` | `#FBFBFB` | Quiet page bands |
| `--color-sidebar` | `#F8F8F8` | Desktop sidebar and drawer background |
| `--color-control` | `#F5F5F5` | Search bar and icon button surface |
| `--color-control-alt` | `#F7F7F7` | Secondary card panels |
| `--color-placeholder` | `#D8D6D1` | Missing image placeholders |

Do not introduce a strong brand accent unless a Figma template shows it through actual page imagery.

### Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-pill` | `999px` | Navigation pills, buttons, tags |
| `--ds-radius-small` | `8px` | Small controls and tight media |
| `--ds-radius-medium` | `16px` | Standard cards |
| `--ds-radius-large` | `24px` | Detail panels and large cards |

### Border And Shadow

| Token | Value |
| --- | --- |
| `--ds-border` | `#E8E8E8` |
| `--ds-shadow-soft` | `0 14px 34px rgba(0, 0, 0, 0.055)` |
| `--glass-shadow` | Liquid glass card/control shadow |

Use shadow sparingly. Most depth should come from whitespace, border, and image scale.

## Typography

Titles use `Noto Serif SC` through the shared `.font-title` utility and the `--font-noto-serif-sc` token. This applies to Chinese and English hero titles, page titles, section titles, card titles, and detail titles so the site keeps the quiet serif character from the Figma templates.

Body text, sidebar navigation, topbar text, search placeholder, buttons, forms, metadata, and card descriptions remain in the current sans-serif stack.

| Role | Desktop | Mobile | Notes |
| --- | --- | --- | --- |
| Home hero title | 72px to 88px | 44px to 56px | Large, quiet, not condensed |
| Page H1 | 48px to 56px | 34px to 44px | Use `.ds-page-title` through `PageHeader` |
| Page eyebrow | 12px to 14px | 12px | `letter-spacing: 0.25em` |
| Section H2 | 32px to 36px | 28px | Use `.ds-section-title` |
| Card title | 22px to 28px | 20px to 24px | Cards and detail headings |
| Body | 16px to 18px | 16px | `line-height: 1.8` |
| Caption/meta | 14px to 15px | 14px | Muted color |
| Eyebrow | 12px to 14px | 12px | Uppercase English uses wide tracking |

Do not scale font size with viewport width. Use breakpoint-based sizes.

## Layout Shell

### DesktopSidebar

The sidebar is the desktop navigation signature and must remain visually consistent:

- Fixed left side, visible from `lg` and up.
- Width target: `220px`.
- Background: `#F8F8F8`.
- Right border: `1px solid #E6E6E6`.
- Brand block height: about `112px`.
- Navigation groups use muted small labels.
- Navigation items use pill rows with circular icon slots.
- Active item uses `#EDEDED` background, dark text, soft shadow, and a small active dot.
- ComingSoon items remain clickable but muted and show a small `Soon` or `筹备中` pill.

### TopBar

Desktop content area must include a top bar:

- Height: about `80px`.
- Border-bottom: `1px solid #E6E6E6`.
- Left: current area label or contextual title.
- Center/right: `SearchBar`.
- Right: circular utility controls such as language or share.

### SearchBar

- Height: `44px` to `52px`.
- Width: `520px` target, responsive max around `38vw`.
- Background: `#F7F7F7`.
- Border: `1px solid #E6E6E6`.
- Radius: pill.
- Text color: muted.

### MobileHeader

- Visible below `lg`.
- Sticky top.
- Height: `64px`.
- Background: `white` with subtle blur.
- Bottom border: `1px solid #E6E6E6`.
- Left: brand name and compact English subtitle.
- Right: pill menu button.

### MobileDrawer

- Visible below `lg`.
- Opens from right.
- Width: `min(88vw, 360px)`.
- Background: `#F8F8F8`.
- Left border, soft shadow, vertical grouped navigation.
- Must read the same `navigation.ts` as `DesktopSidebar`.

## Page Title Area

All content pages should use a reusable `PageHeader` pattern:

- Eyebrow or English section label in muted gray.
- Large Chinese or localized title.
- Optional intro text constrained to readable width.
- Thin divider below the title block.
- Top spacing after TopBar: `72px` to `96px` desktop, `40px` to `56px` mobile.

## Card System

All cards preserve the gray-white system:

- White or soft-gray background.
- Thin border.
- Radius `20px` to `28px`.
- Light shadow only when needed.
- Clear image area with stable aspect ratio.
- Text never overlaps unintentionally.

### ProgramCard

Based on `study-masterclass-desktop.png`.

- Horizontal card on desktop: image left, content right.
- Image ratio: `4:3`, `object-cover` acceptable for general program covers.
- Poster image, if displayed as a poster, must use `object-contain`.
- Mobile stacks image above text.
- Shows title, intro, optional fee/faculty/outcome summary, and CTA.

### EventCard

Based on `events-offline-experience-desktop.png` and `events-overview-desktop.png`.

- Poster-led card.
- Poster ratio: `3:4` or `4:5`.
- Poster images must not be cropped. Use `object-contain`.
- Metadata and CTA sit below or beside poster depending on template.
- Desktop grid may use multiple cards per row.
- Mobile uses one column, or two columns only for compact poster grids.

### WorkCard

Based on `art-creation-glass-art-desktop.png`.

- Image-led artwork card.
- Work images keep original proportions whenever possible.
- Listing cards may use a stable frame, but the image itself should use `object-contain` if cropping would harm the work.
- Shows only work title, size, image, and short description.
- Do not display author, year, material, code, price, or collection fields for `artWork`.

### ProductCard

Based on `shop-overview-desktop.png`.

- Image first, product info below.
- Product list images may use `object-cover` for clean grids if product remains legible.
- Product detail images should use `object-contain` or preserve original ratio.
- Shows title, price, size, stock status, and short description.

## Detail Templates

### ImageGallery

- Used by artist, study, event, art work, and product detail pages.
- Must support mixed image counts.
- Detail galleries preserve image legibility.
- Artwork images keep original proportions.
- Poster images use `object-contain`.
- Product galleries should avoid aggressive cropping.

### ShopAvailableArtworkDetailTemplate

Use for `productType == "available-artworks"` with `shop-available-artwork-detail-desktop.png`.

- Artwork/product image is the primary visual.
- Larger image gallery and quieter purchase/inquiry info.
- Preserve original image proportions.
- Use price and size, but do not visually treat it like commodity grid merchandise.

### ShopArtDerivativeDetailTemplate

Use for `productType == "art-derivatives"` with `shop-art-derivative-detail-desktop.png`.

- Product object is primary.
- Supports `derivativeCategory`: vessel, wearable, toy, ornament, object, packaging.
- More compact product information panel than available artworks.
- Gallery should support multiple product angles.

### ShopCulturalProductDetailTemplate

Use for `productType == "cultural-products"` with `shop-product-detail-desktop.png`.

- General product detail structure.
- Balanced image and information layout.
- Suitable for repeatable cultural products and merchandise.

## Utility Components

### ComingSoonPage

- Uses `AppShell`.
- Gray-white minimal page.
- Large whitespace, rounded cards, thin borders, light shadow.
- Chinese copy:
  - `该内容暂未开放`
  - `敬请期待，更多精彩内容正在准备中。`
- English copy:
  - `This section is not available yet.`
  - `More content is coming soon.`
- Buttons: Back Home, Browse Other Content.

### ShareButton

- Circular or pill button.
- Use simple icon plus accessible label.
- Same visual family as TopBar controls.
- Border `#E6E6E6`, background `#F5F5F5` or white.
- Height/width `40px` to `44px` for icon-only.
- Must not create a large colored social-share block.

## Image Rules

- Poster images must use `object-contain`.
- Artwork images keep original proportions.
- Product detail images avoid cropping.
- Listing cards may use `object-cover` only when the subject remains readable.
- Missing images use neutral gray placeholders.
- Do not distort images with forced width and height without an aspect-ratio container.

## Implementation Boundary

This document defines the component system. It is not a request to implement page code by itself.

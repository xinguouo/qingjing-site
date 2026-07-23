# Development Todo

This document breaks the website development into manageable phases. The goal is to avoid building the full website at once while still preparing a solid bilingual, CMS-driven foundation.

## Current Status

Completed:

- Next.js + TypeScript + Tailwind CSS project exists.
- Sanity CMS is installed.
- Sanity Studio is available at `/studio`.
- Basic `siteSettings` and `project` schemas exist.
- Figma desktop references are available for several key pages.

Not yet complete:

- Final copy and images.
- Final CMS schema set.
- Bilingual routing implementation.
- Frontend page templates.
- Mobile design references.
- Production deployment configuration.

## Guiding Rules

- Build in phases.
- Keep pages CMS-driven.
- Use placeholders until final content is ready.
- Preserve existing Next.js, TypeScript, Tailwind, ESLint, and Sanity configuration.
- Verify desktop and mobile for every completed page.
- Prefer reusable page templates and content components.

## Phase 1: Foundation

Priority: Highest

Goals:

- Establish bilingual route structure.
- Prepare shared layout and content querying patterns.
- Expand Sanity schemas only enough to support the first real pages.

Tasks:

1. Confirm language strategy: Chinese default routes plus `/en` routes.
2. Add reusable localized Sanity objects:
   - `localizedString`
   - `localizedText`
   - `localizedBlockContent`
   - `imageWithAlt`
   - `seoFields`
3. Update `siteSettings` to use bilingual fields.
4. Add `homePage` schema.
5. Add `aboutPage`, `person`, and `artist` schemas.
6. Add Sanity GROQ query helpers.
7. Decide fallback behavior when English content is missing.
8. Create placeholder content in Sanity Studio.

Deliverable:

- CMS has enough structure to power the homepage and About pages.
- No full frontend page build yet unless this phase is explicitly approved.

## Phase 2: Global Frontend Shell

Priority: High

Goals:

- Build the site frame before detailed pages.
- Make navigation, footer, language switching, and responsive behavior reliable.

Tasks:

1. Create global header/navigation.
2. Create mobile menu.
3. Create footer with contact/social placeholders.
4. Add language-aware links.
5. Add shared layout spacing and typography tokens.
6. Confirm image handling from Sanity.
7. Add basic loading and not-found states.
8. Test desktop and mobile breakpoints.

Deliverable:

- A navigable shell with placeholder routes and responsive navigation.

## Phase 3: Home and About

Priority: High

Why first:

- These pages have the strongest Figma coverage.
- They establish visual language for the rest of the site.

Tasks:

1. Implement homepage using `home-desktop.png` as reference.
2. Implement About overview or section routing.
3. Implement Mission Vision page/section.
4. Implement Team listing.
5. Implement Artist profile template.
6. Implement Contact page.
7. Pull all text/images from Sanity with placeholders.
8. Check mobile adaptation manually.

Figma references:

- `home-desktop.png`
- `about-mission-vision-desktop.png`
- `about-team-desktop.png`
- `about-artist-profile-desktop.png`
- `about-contact-desktop.png`

Deliverable:

- Home and About areas are functional with placeholder CMS content.

## Phase 4: Events and Shop

Priority: Medium High

Why next:

- Events and Shop have Figma references.
- They introduce listing/detail patterns reused elsewhere.

Tasks:

1. Add `eventCategory` and `event` schemas.
2. Add `productCategory` and `product` schemas.
3. Implement Events overview.
4. Implement Event detail shell.
5. Implement Shop overview.
6. Implement Product detail shell.
7. Add category filters only if simple and stable.
8. Keep commerce as inquiry-only for now.

Figma references:

- `events-overview-desktop.png`
- `shop-overview-desktop.png`
- `shop-product-detail-desktop.png`

Deliverable:

- Events and Shop can display CMS-managed placeholder content.

## Phase 5: Study

Priority: Medium

Tasks:

1. Add `courseProgram`, `course`, `space`, `galleryItem`, and faculty-related fields.
2. Implement Study overview shell.
3. Implement International Masterclass page using available reference.
4. Add course/program listing template.
5. Add faculty listing template.
6. Add outcomes gallery.
7. Use placeholder content for fees and schedules.

Figma reference:

- `study-masterclass-desktop.png`

Deliverable:

- Study section supports masterclass and future study program content.

## Phase 6: Residency

Priority: Medium

Tasks:

1. Add `residencyPage`, `service`, and residency-specific artist fields.
2. Implement Residency overview.
3. Implement Resident Artists listing.
4. Reuse Artist profile template.
5. Implement Application info page.
6. Implement Space, Requirements, Fees and Rules, Services pages.
7. Decide whether application is contact CTA or real form.

Deliverable:

- Residency section is informational and CMS-driven.

## Phase 7: Art Projects

Priority: Medium

Tasks:

1. Rename or extend existing `project` schema into `artProject`.
2. Add `artProjectCategory`.
3. Implement Art Projects overview.
4. Implement Public Art / Glass category page.
5. Implement Custom Artworks page.
6. Implement Art Project detail.
7. Reuse gallery/detail components from Shop and Events.

Deliverable:

- Art Projects can display project case studies and custom artwork information.

## Phase 8: CMS Preview and Publishing Workflow

Priority: Later

Tasks:

1. Add draft preview mode.
2. Add Sanity webhooks for revalidation.
3. Add editor guidance/descriptions in schemas.
4. Add required-field validation.
5. Add document ordering where needed.
6. Add preview cards for better Studio editing.

Deliverable:

- Editors can confidently preview and publish content.

## Phase 9: Production Readiness

Priority: Later

Tasks:

1. Configure production environment variables.
2. Configure Sanity CORS for local and production domains.
3. Add image domain configuration if using `next/image` with Sanity CDN.
4. Run production build.
5. Check Core Web Vitals basics.
6. Add sitemap and robots.
7. Add metadata for bilingual SEO.
8. Test all primary routes on desktop and mobile.
9. Deploy to Vercel or selected host.

Deliverable:

- Website is ready for public launch.

## Suggested First Implementation Sprint

Scope:

- Bilingual CMS objects.
- Updated `siteSettings`.
- `homePage`.
- `aboutPage`.
- `person`.
- `artist`.
- Global navigation shell.

Avoid in first sprint:

- Checkout/payment.
- Complex forms.
- Advanced filtering.
- Full Residency, Study, Art Projects, and Shop completion.
- Pixel-perfect implementation of every page.

## Open Questions

1. Should English routes use `/en/...` or a language switch without route prefix?
2. Should the default language be Chinese for all visitors?
3. Will Shop require online checkout, or only inquiry/contact?
4. Will Residency Application require a real form, downloadable PDF, or contact CTA?
5. Should Events support registration/payment?
6. Who will enter placeholder content into Sanity Studio?
7. Are mobile Figma references coming later, or should mobile be designed responsively from desktop references?

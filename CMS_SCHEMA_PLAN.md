# CMS Schema Plan

This document describes the Sanity CMS content model needed for the website. The goal is to support bilingual content, image-heavy pages, reusable artists/people, and incremental development.

## CMS Principles

- All public page content should eventually come from Sanity.
- Chinese and English should be stored in structured localized fields.
- Placeholder content is acceptable until final copy and images are ready.
- Reusable content types should be preferred over copying the same content across pages.
- Start with a practical minimal schema, then expand as pages become real.

## Localization Strategy

Recommended field pattern:

```ts
{
  zh: '中文内容',
  en: 'English content'
}
```

Use this for:

- Titles.
- Subtitles.
- Rich text body.
- Image alt text.
- CTA labels.
- SEO metadata.

Recommended reusable object types:

| Object Type | Purpose |
| --- | --- |
| `localizedString` | Short bilingual text |
| `localizedText` | Longer bilingual plain text |
| `localizedSlug` | Optional later if English URLs need different slugs |
| `localizedBlockContent` | Bilingual rich text |
| `imageWithAlt` | Image with bilingual alt text and caption |
| `seoFields` | SEO title, description, OG image |
| `cta` | Link label and target |

## Existing Schemas

Current project already has a basic Sanity setup:

- `siteSettings`
- `project`

These should be evolved rather than deleted. The existing `project` type can either become `artProject` or remain as a generic project type after naming is confirmed.

## Global Content Types

### `siteSettings`

Purpose:

- Global website identity and contact basics.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Site name |
| `description` | `localizedText` | Global description |
| `logo` | `imageWithAlt` | Optional |
| `defaultSeo` | `seoFields` | Site-wide fallback SEO |
| `navigation` | array of nav items | Optional if nav should be CMS-managed |
| `socialLinks` | array | Instagram, WeChat, Xiaohongshu, etc. |
| `contact` | reference to `contactInfo` | Shared contact data |

### `contactInfo`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `address` | `localizedText` | Bilingual address |
| `mapImage` | `imageWithAlt` | Placeholder before map integration |
| `mapUrl` | url | External map link |
| `phone` | string | Optional |
| `email` | string | Optional |
| `openingHours` | `localizedText` | Optional |
| `contactBody` | `localizedBlockContent` | Additional contact notes |

## Page Content Types

### `homePage`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `heroTitle` | `localizedString` | Placeholder first |
| `heroSubtitle` | `localizedText` | Placeholder first |
| `heroImage` | `imageWithAlt` | Required later |
| `intro` | `localizedBlockContent` | Institution intro |
| `featuredSections` | array of cards | Links to primary columns |
| `featuredEvents` | references to `event` | Optional |
| `featuredProjects` | references to `artProject` | Optional |
| `featuredProducts` | references to `product` | Optional |
| `seo` | `seoFields` | Page SEO |

### `aboutPage`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `hero` | object | Title, subtitle, image |
| `missionVision` | `localizedBlockContent` | Mission and vision |
| `teamIntro` | `localizedBlockContent` | Team section intro |
| `featuredTeam` | references to `person` | Team members |
| `featuredArtists` | references to `artist` | Artist profiles |
| `contactSection` | reference to `contactInfo` | Contact content |
| `seo` | `seoFields` | Page SEO |

### `residencyPage`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `hero` | object | Title, subtitle, image |
| `overview` | `localizedBlockContent` | Program introduction |
| `residentArtists` | references to `artist` | Current/past residents |
| `applicationInfo` | `localizedBlockContent` | Application details |
| `spaceInfo` | references to `space` | Residency spaces |
| `requirements` | `localizedBlockContent` | Application conditions |
| `feesAndRules` | `localizedBlockContent` | Fees and usage rules |
| `services` | references to `service` | Other services |
| `seo` | `seoFields` | Page SEO |

### `studyPage`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `hero` | object | Title, subtitle, image |
| `overview` | `localizedBlockContent` | Study intro |
| `programs` | references to `courseProgram` | Masterclass, study trips |
| `teachingSpaces` | references to `space` | Teaching spaces |
| `courses` | references to `course` | Course list |
| `fees` | `localizedBlockContent` | Pricing |
| `faculty` | references to `person` | Teachers |
| `outcomes` | references to `galleryItem` | Student/project results |
| `seo` | `seoFields` | Page SEO |

### `eventsPage`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `hero` | object | Title, subtitle, image |
| `intro` | `localizedBlockContent` | Events intro |
| `featuredEvents` | references to `event` | Optional |
| `seo` | `seoFields` | Page SEO |

### `artProjectsPage`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `hero` | object | Title, subtitle, image |
| `intro` | `localizedBlockContent` | Project intro |
| `featuredProjects` | references to `artProject` | Optional |
| `seo` | `seoFields` | Page SEO |

### `shopPage`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `hero` | object | Title, subtitle, image |
| `intro` | `localizedBlockContent` | Shop intro |
| `featuredProducts` | references to `product` | Optional |
| `purchaseNotice` | `localizedBlockContent` | Inquiry / purchase rules |
| `seo` | `seoFields` | Page SEO |

## Reusable Entity Types

### `person`

Used for:

- Team members.
- Faculty.
- General collaborators.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | `localizedString` | Display name |
| `slug` | slug | Shared route identifier |
| `role` | `localizedString` | Role/title |
| `personType` | string options | Team, faculty, collaborator |
| `portrait` | `imageWithAlt` | Optional |
| `bio` | `localizedBlockContent` | Biography |
| `links` | array | Website/social links |
| `orderRank` | number | Manual sorting |

### `artist`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | `localizedString` | Artist name |
| `slug` | slug | Route identifier |
| `portrait` | `imageWithAlt` | Artist photo |
| `bio` | `localizedBlockContent` | Artist introduction |
| `nationality` | `localizedString` | Optional |
| `residencyStatus` | string options | Current, past, invited |
| `residencyPeriod` | object | Start/end date |
| `works` | references to `artProject` or `product` | Optional |
| `gallery` | array of `imageWithAlt` | Portfolio images |
| `seo` | `seoFields` | Profile SEO |

### `space`

Used for:

- Residency space.
- Teaching space.
- Event space.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Space name |
| `slug` | slug | Optional detail route |
| `spaceType` | string options | Residency, teaching, event |
| `summary` | `localizedText` | Short description |
| `body` | `localizedBlockContent` | Details |
| `gallery` | array of `imageWithAlt` | Images |
| `capacity` | string | Optional |
| `facilities` | array of localized strings | Optional |

### `service`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Service name |
| `summary` | `localizedText` | Short description |
| `body` | `localizedBlockContent` | Full details |
| `image` | `imageWithAlt` | Optional |

## Program Types

### `courseProgram`

Used for:

- International masterclass.
- International study.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Program title |
| `slug` | slug | Route identifier |
| `programType` | string options | Masterclass, international study |
| `heroImage` | `imageWithAlt` | Optional |
| `summary` | `localizedText` | List card text |
| `body` | `localizedBlockContent` | Program details |
| `courses` | references to `course` | Optional |
| `faculty` | references to `person` | Optional |
| `spaces` | references to `space` | Optional |
| `fees` | `localizedBlockContent` | Pricing |
| `outcomes` | references to `galleryItem` | Optional |
| `published` | boolean | Visibility |

### `course`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Course title |
| `slug` | slug | Optional route |
| `summary` | `localizedText` | Short text |
| `body` | `localizedBlockContent` | Course content |
| `poster` | `imageWithAlt` | Optional |
| `faculty` | references to `person` | Teachers |
| `fee` | `localizedString` | Simple pricing first |
| `schedule` | `localizedText` | Placeholder schedule |
| `published` | boolean | Visibility |

## Event Types

### `eventCategory`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Offline experience, public class, general |
| `slug` | slug | Category URL |
| `description` | `localizedText` | Optional |

### `event`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Event name |
| `slug` | slug | Detail route |
| `category` | reference to `eventCategory` | Required |
| `poster` | `imageWithAlt` | Activity poster |
| `summary` | `localizedText` | Card text |
| `body` | `localizedBlockContent` | Activity content |
| `courseContent` | `localizedBlockContent` | Optional |
| `eventDate` | datetime | Required later |
| `location` | `localizedString` | Optional |
| `space` | reference to `space` | Teaching/event space |
| `fee` | `localizedString` | Pricing |
| `faculty` | references to `person` | Optional |
| `gallery` | array of `imageWithAlt` | Outcomes/images |
| `published` | boolean | Visibility |
| `seo` | `seoFields` | Detail SEO |

## Art Project Types

### `artProjectCategory`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Public art glass, custom artworks |
| `slug` | slug | Category URL |
| `description` | `localizedText` | Optional |

### `artProject`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Project/product title |
| `slug` | slug | Detail route |
| `category` | reference to `artProjectCategory` | Optional |
| `summary` | `localizedText` | Card text |
| `coverImage` | `imageWithAlt` | Listing image |
| `gallery` | array of `imageWithAlt` | Detail images |
| `body` | `localizedBlockContent` | Full story |
| `artists` | references to `artist` | Optional |
| `materials` | `localizedString` | Glass/material info |
| `dimensions` | string | Optional |
| `year` | number | Optional |
| `commissionInfo` | `localizedBlockContent` | Custom artwork details |
| `published` | boolean | Visibility |
| `seo` | `seoFields` | Detail SEO |

## Shop Types

### `productCategory`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Artworks, derivatives, cultural products |
| `slug` | slug | Category URL |
| `description` | `localizedText` | Optional |

### `product`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Product name |
| `slug` | slug | Detail route |
| `category` | reference to `productCategory` | Required |
| `summary` | `localizedText` | Card text |
| `coverImage` | `imageWithAlt` | Listing image |
| `gallery` | array of `imageWithAlt` | Detail images |
| `description` | `localizedBlockContent` | Product detail |
| `priceText` | `localizedString` | Use text first, not payment logic |
| `availability` | string options | Available, sold, inquiry only |
| `materials` | `localizedString` | Optional |
| `dimensions` | string | Optional |
| `artist` | reference to `artist` | Optional |
| `inquiryCta` | `cta` | Contact/purchase inquiry |
| `published` | boolean | Visibility |
| `seo` | `seoFields` | Detail SEO |

## Media and Gallery Types

### `galleryItem`

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `localizedString` | Optional |
| `image` | `imageWithAlt` | Required |
| `description` | `localizedText` | Optional |
| `relatedProgram` | reference | Optional |
| `relatedEvent` | reference | Optional |
| `relatedProject` | reference | Optional |

## Development Priority for Schemas

Phase 1:

- Localized field objects.
- `siteSettings`.
- `homePage`.
- `aboutPage`.
- `person`.
- `artist`.
- Improve existing `project` or rename to `artProject`.

Phase 2:

- `eventCategory`.
- `event`.
- `productCategory`.
- `product`.
- `space`.

Phase 3:

- `residencyPage`.
- `studyPage`.
- `courseProgram`.
- `course`.
- `service`.
- `galleryItem`.

Phase 4:

- Preview mode.
- Visual editing.
- Webhook revalidation.
- Advanced search/filtering fields.
- E-commerce integration fields if checkout is required.

import { defineField, defineType } from "sanity";

import { imageCaptionFields } from "./imageCaptionFields";

export const homePage = defineType({
  name: "homePage",
  title: "首页 / Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "首页首屏 / Hero", default: true },
    { name: "intro", title: "简介区 / Intro" },
    { name: "quick", title: "快速入口 / Quick Entries" },
    { name: "featured", title: "首页推荐 / Featured" },
    { name: "legacy", title: "旧字段 / Legacy" },
  ],
  fields: [
    defineField({
      name: "heroTitleZh",
      title: "主标题（中文） / Hero Title Zh",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroTitleEn",
      title: "主标题（英文） / Hero Title En",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroSubtitleZh",
      title: "副标题（中文） / Hero Subtitle Zh",
      type: "text",
      group: "hero",
      rows: 2,
    }),
    defineField({
      name: "heroSubtitleEn",
      title: "副标题（英文） / Hero Subtitle En",
      type: "text",
      group: "hero",
      rows: 2,
    }),
    defineField({
      name: "heroImage",
      title: "首页主图 / Hero Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: imageCaptionFields,
      hidden: true,
    }),
    defineField({
      name: "heroImages",
      title: "首页主视觉轮播图 / Hero Carousel Images",
      type: "array",
      group: "hero",
      of: [
        defineField({
          name: "heroCarouselImage",
          title: "首页 Banner 图片 / Hero Banner Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "替代文字 / Alt Text",
              type: "string",
            }),
            ...imageCaptionFields,
            defineField({
              name: "titleLogoWhite",
              title: "白色标题 PNG / White Title Logo",
              type: "image",
              description: "上传透明底白色单色 PNG，用于深色 Banner 图片。",
              options: { hotspot: false },
            }),
            defineField({
              name: "titleLogoBlack",
              title: "黑色标题 PNG / Black Title Logo",
              type: "image",
              description: "上传透明底黑色单色 PNG，用于浅色 Banner 图片。",
              options: { hotspot: false },
            }),
            defineField({
              name: "titleLogo",
              title: "标题 PNG（旧字段，兼容） / Legacy Title Logo",
              type: "image",
              description:
                "旧版单色 PNG 字段，仅用于兼容已有数据。新内容请使用 White / Black Title Logo。",
              options: { hotspot: false },
              hidden: true,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "introTitleZh",
      title: "介绍标题（中文） / Intro Title Zh",
      type: "string",
      group: "intro",
    }),
    defineField({
      name: "introTitleEn",
      title: "介绍标题（英文） / Intro Title En",
      type: "string",
      group: "intro",
    }),
    defineField({
      name: "introTextZh",
      title: "介绍正文（中文） / Intro Text Zh",
      type: "text",
      group: "intro",
      rows: 4,
    }),
    defineField({
      name: "introTextEn",
      title: "介绍正文（英文） / Intro Text En",
      type: "text",
      group: "intro",
      rows: 4,
    }),
    defineField({
      name: "quickEntries",
      title: "快速入口卡片 / Quick Entry Cards",
      type: "array",
      group: "quick",
      of: [
        defineField({
          name: "quickEntry",
          title: "快速入口 / Quick Entry",
          type: "object",
          fields: [
            defineField({
              name: "titleZh",
              title: "标题（中文） / Title Zh",
              type: "string",
            }),
            defineField({
              name: "titleEn",
              title: "标题（英文） / Title En",
              type: "string",
            }),
            defineField({
              name: "descriptionZh",
              title: "描述（中文） / Description Zh",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "descriptionEn",
              title: "描述（英文） / Description En",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "href",
              title: "链接 / Link",
              type: "string",
              description:
                "填写站内路径，例如 /events/offline-experience 或完整 URL。",
            }),
          ],
          preview: {
            select: {
              title: "titleZh",
              subtitle: "href",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "featuredStudyProgramsTitleZh",
      title: "国际大师班区块标题（中文） / Masterclass Section Title Zh",
      type: "string",
      group: "featured",
    }),
    defineField({
      name: "featuredStudyProgramsTitleEn",
      title: "国际大师班区块标题（英文） / Masterclass Section Title En",
      type: "string",
      group: "featured",
    }),
    defineField({
      name: "featuredStudyPrograms",
      title: "精选研学 / Featured Study Programs",
      type: "array",
      group: "featured",
      of: [{ type: "reference", to: [{ type: "studyProgram" }] }],
    }),
    defineField({
      name: "featuredEventsTitleZh",
      title: "最新活动区块标题（中文） / Latest Events Section Title Zh",
      type: "string",
      group: "featured",
    }),
    defineField({
      name: "featuredEventsTitleEn",
      title: "最新活动区块标题（英文） / Latest Events Section Title En",
      type: "string",
      group: "featured",
    }),
    defineField({
      name: "featuredEvents",
      title: "精选活动 / Featured Events",
      type: "array",
      group: "featured",
      of: [{ type: "reference", to: [{ type: "event" }] }],
    }),
    defineField({
      name: "featuredPastEventsTitleZh",
      title: "往期回顾区块标题（中文） / Past Review Section Title Zh",
      type: "string",
      group: "featured",
    }),
    defineField({
      name: "featuredPastEventsTitleEn",
      title: "往期回顾区块标题（英文） / Past Review Section Title En",
      type: "string",
      group: "featured",
    }),
    defineField({
      name: "featuredPastEvents",
      title: "往期回顾 / Past Review",
      type: "array",
      group: "featured",
      of: [{ type: "reference", to: [{ type: "event" }] }],
    }),
    defineField({
      name: "pastReviewItems",
      title: "往期回顾图片 / Past Review Images",
      type: "array",
      group: "featured",
      of: [
        defineField({
          name: "pastReviewItem",
          title: "回顾图片 / Review Image",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "图片 / Image",
              type: "image",
              options: { hotspot: true },
              fields: imageCaptionFields,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "titleZh",
              title: "标题（中文，可选） / Title Zh",
              type: "string",
            }),
            defineField({
              name: "titleEn",
              title: "标题（英文，可选） / Title En",
              type: "string",
              description: "If empty, fallback to Chinese content.",
            }),
            defineField({
              name: "year",
              title: "年份（可选） / Year",
              type: "string",
            }),
            defineField({
              name: "descriptionZh",
              title: "简短描述（中文，可选） / Description Zh",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "descriptionEn",
              title: "简短描述（英文，可选） / Description En",
              type: "text",
              rows: 2,
              description: "If empty, fallback to Chinese content.",
            }),
          ],
          preview: {
            select: {
              title: "titleZh",
              subtitle: "year",
              media: "image",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "回顾图片",
                subtitle,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "featuredArtWorksTitleZh",
      title: "艺术创作推荐区块标题（中文） / Art Creation Section Title Zh",
      type: "string",
      group: "featured",
    }),
    defineField({
      name: "featuredArtWorksTitleEn",
      title: "艺术创作推荐区块标题（英文） / Art Creation Section Title En",
      type: "string",
      group: "featured",
    }),
    defineField({
      name: "featuredArtWorks",
      title: "精选艺术作品 / Featured Art Works",
      type: "array",
      group: "featured",
      of: [
        {
          type: "reference",
          to: [{ type: "artWork" }, { type: "artProject" }],
        },
      ],
    }),
    defineField({
      name: "featuredProducts",
      title: "精选商品 / Featured Products",
      type: "array",
      group: "featured",
      of: [
        {
          type: "reference",
          to: [
            { type: "product" },
            { type: "productDetail" },
            { type: "artDerivativeDetail" },
            { type: "productCollection" },
            { type: "artworkProduct" },
            { type: "derivativeProduct" },
            { type: "culturalProduct" },
          ],
        },
      ],
    }),
    defineField({
      name: "featuredResidency",
      title: "精选驻地计划（旧字段） / Featured Residency Legacy",
      type: "reference",
      to: [{ type: "residencyPage" }],
      group: "legacy",
      hidden: true,
    }),
    defineField({
      name: "featuredArtProjects",
      title: "精选艺术项目（旧字段） / Featured Art Projects Legacy",
      type: "array",
      of: [{ type: "reference", to: [{ type: "artProject" }] }],
      group: "legacy",
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "heroTitleZh",
      subtitle: "heroTitleEn",
      media: "heroImages.0",
    },
  },
});

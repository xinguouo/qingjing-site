import { defineField, defineType } from "sanity";

import { imageCaptionFields } from "./imageCaptionFields";

export const studyMasterclassPage = defineType({
  name: "studyMasterclassPage",
  title: "国际大师班页面 / International Masterclass Page",
  type: "document",
  groups: [{ name: "review", title: "往期回顾 / Past Review", default: true }],
  fields: [
    defineField({
      name: "pastReviewTitleZh",
      title: "往期回顾标题（中文） / Past Review Title Zh",
      type: "string",
      group: "review",
    }),
    defineField({
      name: "pastReviewTitleEn",
      title: "往期回顾标题（英文） / Past Review Title En",
      type: "string",
      group: "review",
      description: "If empty, fallback to Chinese content.",
    }),
    defineField({
      name: "pastReviewItems",
      title: "往期回顾图片 / Past Review Images",
      type: "array",
      group: "review",
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
              title: "时间（可选） / Time",
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
  ],
  preview: {
    prepare: () => ({
      title: "国际大师班页面 / International Masterclass Page",
    }),
  },
});

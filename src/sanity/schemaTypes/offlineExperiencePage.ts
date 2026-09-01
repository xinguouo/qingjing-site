import { defineField, defineType } from "sanity";

import { imageCaptionFields } from "./imageCaptionFields";

export const offlineExperiencePage = defineType({
  name: "offlineExperiencePage",
  title: "线下体验页面 / Offline Experience Page",
  type: "document",
  groups: [
    { name: "page", title: "页面标题 / Page Title", default: true },
    { name: "courses", title: "课程卡片 / Courses" },
    { name: "review", title: "往期回顾 / Past Review" },
  ],
  fields: [
    defineField({
      name: "pageTitleZh",
      title: "页面标题（中文） / Page Title (Chinese)",
      type: "string",
      group: "page",
    }),
    defineField({
      name: "pageTitleEn",
      title: "Page Title (English)",
      type: "string",
      group: "page",
    }),
    defineField({
      name: "courses",
      title: "课程 / Courses",
      type: "array",
      group: "courses",
      of: [
        defineField({
          name: "offlineExperienceCourse",
          title: "体验课程 / Experience Course",
          type: "object",
          fields: [
            defineField({
              name: "titleZh",
              title: "课程名称（中文） / Title (Chinese)",
              type: "string",
            }),
            defineField({
              name: "titleEn",
              title: "Course Title (English)",
              type: "string",
            }),
            defineField({
              name: "coverImage",
              title: "课程图片 / Cover Image",
              type: "image",
              options: { hotspot: true },
              fields: imageCaptionFields,
            }),
            defineField({
              name: "descriptionZh",
              title: "课程简介（中文） / Description (Chinese)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "descriptionEn",
              title: "Course Description (English)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "supportTeacher",
              title: "学术支持 / Support Teacher",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "titleZh",
              subtitle: "supportTeacher",
              media: "coverImage",
            },
          },
        }),
      ],
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
      title: "线下体验页面 / Offline Experience Page",
    }),
  },
});

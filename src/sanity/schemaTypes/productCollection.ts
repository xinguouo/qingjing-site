import { defineField, defineType } from "sanity";

import { imageCaptionFields } from "./imageCaptionFields";

import { artworkProductCategoryOptions } from "./artworkProductCategories";

export const productCollection = defineType({
  name: "productCollection",
  title: "商店商品集合 / Product Collection",
  type: "document",
  groups: [
    { name: "basic", title: "基础信息 / Basic", default: true },
    { name: "media", title: "图片 / Images" },
    { name: "content", title: "内容 / Content" },
    { name: "admin", title: "后台管理 / Admin" },
  ],
  fields: [
    defineField({
      name: "titleZh",
      title: "商品名称（中文） / Title (Chinese)",
      type: "string",
      group: "basic",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Title (English)",
      type: "string",
      group: "basic",
    }),
    defineField({
      name: "slug",
      title: "链接标识 / Slug",
      type: "slug",
      group: "basic",
      options: { source: "titleEn", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "一级分类 / Category",
      type: "string",
      group: "basic",
      options: {
        list: [
          { title: "在售艺术商品 / Artwork", value: "artwork" },
          { title: "艺术衍生品 / Derivative", value: "derivative" },
          { title: "文创品 / Cultural", value: "cultural" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subcategory",
      title: "艺术衍生品二级分类 / Derivative Subcategory",
      type: "string",
      group: "basic",
      options: {
        list: [
          { title: "器物 / Vessel", value: "vessel" },
          { title: "肖物 / Wearable", value: "wearable" },
          { title: "玩物 / Toy", value: "toy" },
          { title: "饰物 / Ornament", value: "ornament" },
          { title: "境物 / Object", value: "object" },
          { title: "包装 / Packaging", value: "packaging" },
        ],
      },
      hidden: ({ parent }) => parent?.category !== "derivative",
    }),
    defineField({
      name: "artworkCategory",
      title: "商品分类 / Category",
      type: "string",
      group: "basic",
      options: {
        list: artworkProductCategoryOptions,
        layout: "dropdown",
      },
      hidden: ({ parent }) => parent?.category !== "artwork",
    }),
    defineField({
      name: "productNumber",
      title: "商品编号 / Product Number",
      type: "string",
      group: "basic",
      hidden: ({ parent }) => parent?.category !== "artwork",
    }),
    defineField({
      name: "coverImage",
      title: "封面图片 / Cover Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: imageCaptionFields,
    }),
    defineField({
      name: "galleryImages",
      title: "展示图片 / Gallery Images",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true }, fields: imageCaptionFields }],
    }),
    defineField({
      name: "video",
      title: "商品视频 / Product Video",
      type: "file",
      group: "media",
      options: {
        accept: "video/mp4,video/webm",
      },
    }),
    defineField({
      name: "descriptionZh",
      title: "描述（中文） / Description (Chinese)",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (English)",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "price",
      title: "价格 / Price",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "status",
      title: "展示状态 / Status",
      type: "string",
      group: "admin",
      options: {
        list: [
          { title: "展示 / Visible", value: "visible" },
          { title: "暂不展示 / Hidden", value: "hidden" },
        ],
        layout: "radio",
      },
      initialValue: "visible",
    }),
    defineField({
      name: "order",
      title: "排序 / Order",
      type: "number",
      group: "admin",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "排序 / Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "titleZh",
      subtitle: "category",
      media: "coverImage",
    },
  },
});

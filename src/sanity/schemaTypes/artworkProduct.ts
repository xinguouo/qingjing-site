import { defineField, defineType } from "sanity";

import { artworkProductCategoryOptions } from "./artworkProductCategories";

export const artworkProduct = defineType({
  name: "artworkProduct",
  title: "在售艺术作品 / Artwork Product",
  type: "document",
  groups: [
    { name: "basic", title: "基础信息 / Basic", default: true },
    { name: "media", title: "图片 / Images" },
    { name: "content", title: "作品信息 / Artwork Info" },
    { name: "admin", title: "后台管理 / Admin" },
  ],
  fields: [
    defineField({
      name: "titleZh",
      title: "作品名称（中文） / Title (Chinese)",
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
      name: "artworkCategory",
      title: "商品分类 / Category",
      type: "string",
      group: "basic",
      options: {
        list: artworkProductCategoryOptions,
        layout: "dropdown",
      },
    }),
    defineField({
      name: "productNumber",
      title: "商品编号 / Product Number",
      type: "string",
      group: "basic",
    }),
    defineField({
      name: "images",
      title: "作品图片 / Artwork Images",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "dimensions",
      title: "尺寸 / Dimensions",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "quantity",
      title: "数量 / Quantity",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "descriptionZh",
      title: "描述（中文） / Description (Chinese)",
      type: "text",
      rows: 5,
      group: "content",
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (English)",
      type: "text",
      rows: 5,
      group: "content",
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
      subtitle: "dimensions",
      media: "images.0",
    },
  },
});

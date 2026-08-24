import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

import { imageCaptionFields } from "./imageCaptionFields";

import { artworkProductCategoryOptions } from "./artworkProductCategories";
import { shopTaxonomyFields } from "./shopTaxonomy";

export const productDetail = defineType({
  name: "productDetail",
  title: "在售艺术商品详情 / Product Detail",
  type: "document",
  groups: [
    { name: "basic", title: "基础信息 / Basic Info", default: true },
    { name: "product", title: "商品信息 / Product Info" },
    { name: "commerce", title: "价格 / Commerce" },
    { name: "media", title: "图片 / Media" },
    { name: "related", title: "相关作品 / Related Products" },
    { name: "admin", title: "后台管理 / Admin" },
  ],
  fields: [
    orderRankField({ type: "productDetail", hidden: true }),
    defineField({
      name: "slug",
      title: "链接标识 / Slug",
      type: "slug",
      group: "basic",
      options: { source: "basicInfo.titleEn", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "basicInfo",
      title: "基础信息 / Basic Info",
      type: "object",
      group: "basic",
      fields: [
        defineField({
          name: "category",
          title: "商品分类 / Product Category",
          type: "string",
          options: {
            list: artworkProductCategoryOptions,
            layout: "dropdown",
          },
        }),
        defineField({
          name: "productNumber",
          title: "商品编号 / Product Number",
          type: "string",
        }),
        defineField({
          name: "titleZh",
          title: "商品名称（中文） / Title (Chinese)",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "titleEn",
          title: "Title (English)",
          type: "string",
        }),
      ],
    }),
    ...shopTaxonomyFields("basic"),
    defineField({
      name: "productInfo",
      title: "商品信息 / Product Info",
      type: "object",
      group: "product",
      fields: [
        defineField({
          name: "dimensions",
          title: "商品规格 / Dimensions",
          type: "string",
        }),
        defineField({
          name: "material",
          title: "材质 / Material",
          type: "string",
        }),
        defineField({
          name: "descriptionZh",
          title: "作品描述（中文） / Description (Chinese)",
          type: "text",
          rows: 5,
        }),
        defineField({
          name: "descriptionEn",
          title: "Description (English)",
          type: "text",
          rows: 5,
        }),
      ],
    }),
    defineField({
      name: "commerce",
      title: "价格 / Commerce",
      type: "object",
      group: "commerce",
      fields: [
        defineField({
          name: "price",
          title: "价格 / Price",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "media",
      title: "图片 / Media",
      type: "object",
      group: "media",
      fields: [
        defineField({
          name: "mainImage",
          title: "主图 / Main Image",
          type: "image",
          options: { hotspot: true },
          fields: imageCaptionFields,
        }),
        defineField({
          name: "galleryImages",
          title: "商品图片 / Gallery Images",
          type: "array",
          of: [{ type: "image", options: { hotspot: true }, fields: imageCaptionFields }],
        }),
        defineField({
          name: "video",
          title: "商品视频 / Product Video",
          type: "file",
          options: {
            accept: "video/mp4,video/webm",
          },
        }),
      ],
    }),
    defineField({
      name: "relatedProducts",
      title: "相关作品 / Related Products",
      type: "array",
      group: "related",
      of: [{ type: "reference", to: [{ type: "productDetail" }] }],
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
    orderRankOrdering,
    {
      title: "排序 / Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      media: "media.mainImage",
      number: "basicInfo.productNumber",
      subtitle: "basicInfo.category",
      title: "basicInfo.titleZh",
    },
    prepare({ media, number, subtitle, title }) {
      return {
        title,
        subtitle: [number, subtitle].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});

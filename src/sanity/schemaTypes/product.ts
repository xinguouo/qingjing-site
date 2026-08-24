import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

import { imageCaptionFields } from "./imageCaptionFields";

import { artworkProductCategoryOptions } from "./artworkProductCategories";
import { shopTaxonomyFields } from "./shopTaxonomy";

const derivativeProductTypes = [
  "derivatives",
  "art-derivatives",
  "art-merchandise",
];

function isDerivativeProduct(parent?: Record<string, unknown>) {
  return derivativeProductTypes.includes(String(parent?.productType || ""));
}

export const product = defineType({
  name: "product",
  title: "商品 / Product",
  type: "document",
  groups: [
    { name: "basic", title: "基础信息 / Basic", default: true },
    { name: "media", title: "图片 / Media" },
    { name: "content", title: "详情内容 / Content" },
    { name: "commerce", title: "价格与库存 / Commerce" },
    { name: "admin", title: "后台管理 / Admin" },
    { name: "import", title: "导入审核 / Import Review" },
    { name: "legacy", title: "旧字段 / Legacy" },
  ],
  fields: [
    orderRankField({ type: "product", hidden: true }),
    defineField({
      name: "titleZh",
      title: "商品标题（中文） / Title Zh",
      type: "string",
      group: "basic",
    }),
    defineField({
      name: "titleEn",
      title: "商品标题（英文） / Title En",
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
      name: "productType",
      title: "商品类型 / Product Type",
      type: "string",
      group: "basic",
      options: {
        list: [
          {
            title: "在售艺术作品 / Available Artworks",
            value: "available-artworks",
          },
          { title: "艺术衍生品 / Art Derivatives", value: "derivatives" },
          { title: "文创产品 / Cultural Products", value: "cultural-products" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "derivativeCategory",
      title: "产品类型 / Product Type",
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
        layout: "dropdown",
      },
      hidden: ({ parent }) =>
        !["derivatives", "art-derivatives", "art-merchandise"].includes(
          parent?.productType,
        ),
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
      hidden: ({ parent }) =>
        !["available-artworks", "artworks"].includes(parent?.productType),
    }),
    defineField({
      name: "productNumber",
      title: "商品编号 / Product Number",
      type: "string",
      group: "basic",
      hidden: ({ parent }) =>
        !["available-artworks", "artworks"].includes(parent?.productType),
    }),
    ...shopTaxonomyFields("basic", {
      seriesBranchHidden: ({ parent }) => isDerivativeProduct(parent),
      seriesHidden: ({ parent }) => isDerivativeProduct(parent),
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
      name: "images",
      title: "商品图片 / Images",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true }, fields: imageCaptionFields }],
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
      name: "price",
      title: "价格 / Price",
      type: "number",
      group: "commerce",
    }),
    defineField({
      name: "size",
      title: "尺寸 / Size",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "dimensions",
      title: "尺寸（导入字段） / Dimensions",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "material",
      title: "材质 / Material",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "descriptionZh",
      title: "简介（中文） / Description Zh",
      type: "text",
      group: "content",
      rows: 4,
    }),
    defineField({
      name: "descriptionEn",
      title: "简介（英文） / Description En",
      type: "text",
      group: "content",
      rows: 4,
    }),
    defineField({
      name: "detailZh",
      title: "详情（中文） / Detail Zh",
      type: "text",
      group: "content",
      rows: 7,
    }),
    defineField({
      name: "detailEn",
      title: "详情（英文） / Detail En",
      type: "text",
      group: "content",
      rows: 7,
    }),
    defineField({
      name: "stockStatus",
      title: "库存状态 / Stock Status",
      type: "string",
      group: "commerce",
      options: {
        list: [
          { title: "可购买 / Available", value: "available" },
          { title: "已售罄 / Sold Out", value: "sold-out" },
          { title: "预订 / Preorder", value: "preorder" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "sourceUrl",
      title: "旧站来源链接 / Source URL",
      type: "url",
      group: "import",
    }),
    defineField({
      name: "importSource",
      title: "导入来源 / Import Source",
      type: "string",
      group: "import",
      initialValue: "old-qingjing-site",
      readOnly: true,
    }),
    defineField({
      name: "needsReview",
      title: "需要人工审核 / Needs Review",
      type: "boolean",
      group: "import",
      initialValue: true,
    }),
    defineField({
      name: "importNotes",
      title: "导入备注 / Import Notes",
      type: "text",
      group: "import",
      rows: 4,
    }),
    defineField({
      name: "materialZh",
      title: "材料（旧字段，中文） / Material Zh Legacy",
      type: "string",
      group: "legacy",
      hidden: true,
    }),
    defineField({
      name: "materialEn",
      title: "材料（旧字段，英文） / Material En Legacy",
      type: "string",
      group: "legacy",
      hidden: true,
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
      title: "titleZh",
      subtitle: "productType",
      media: "coverImage",
    },
  },
});

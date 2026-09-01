import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

import {
  artCategoryFallbackLabel,
  type ArtCategorySlug,
} from "../../config/artCategories";
import { SHOP_CRAFT_CATEGORIES } from "../../config/shopCraftCategories";
import { imageCaptionFields } from "./imageCaptionFields";

import { ArtworkImagesInput } from "../components/ArtworkImagesInput";

const artProjectCategoryTitles: Record<string, string> = {
  sculpture: artCategoryFallbackLabel("sculpture"),
  "installation-art": artCategoryFallbackLabel("installation-art"),
  "public-art": artCategoryFallbackLabel("public-art"),
};

const artProjectCategoryOptions = (
  ["sculpture", "installation-art", "public-art"] satisfies ArtCategorySlug[]
).map((value) => ({
  title: artCategoryFallbackLabel(value),
  value,
}));

const techniqueOptions = SHOP_CRAFT_CATEGORIES.map((item) => ({
  title: `${item.labelZh} / ${item.labelEn}`,
  value: item.value,
}));

export const artProject = defineType({
  name: "artProject",
  title: "艺术作品 / Art Project",
  type: "document",
  groups: [
    { name: "basic", title: "基础信息 / Basic", default: true },
    { name: "media", title: "作品图片 / Images" },
    { name: "content", title: "作品信息 / Artwork Info" },
    { name: "admin", title: "后台管理 / Admin" },
  ],
  fields: [
    orderRankField({ type: "artProject", hidden: true }),
    defineField({
      name: "titleZh",
      title: "作品名称（中文） / Title (Chinese)",
      type: "string",
      group: "basic",
    }),
    defineField({
      name: "titleEn",
      title: "Artwork Title (English)",
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
      title: "作品分类 / Category",
      type: "string",
      group: "basic",
      options: {
        list: artProjectCategoryOptions,
        layout: "radio",
      },
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
      title: "作品图片 / Artwork Images",
      type: "array",
      group: "media",
      components: {
        input: ArtworkImagesInput,
      },
      of: [
        defineField({
          name: "artworkImage",
          title: "作品图片 / Artwork Image",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "图片 / Image",
              type: "image",
              options: { hotspot: true },
              fields: imageCaptionFields,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "图片说明（旧字段） / Description Legacy",
              type: "text",
              rows: 3,
              hidden: true,
            }),
            defineField({
              name: "descriptionZh",
              title: "图片说明（中文） / Description (Chinese)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "descriptionEn",
              title: "图片说明（英文） / Description (English)",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: "description",
              titleZh: "descriptionZh",
              titleEn: "descriptionEn",
              media: "image",
            },
            prepare({ title, titleZh, titleEn, media }) {
              return {
                title: titleZh || titleEn || title || "Artwork image",
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "artworkVideos",
      title: "作品视频 / Artwork Videos",
      type: "array",
      group: "media",
      of: [
        defineField({
          name: "artworkVideo",
          title: "作品视频 / Artwork Video",
          type: "object",
          fields: [
            defineField({
              name: "videoFile",
              title: "上传视频文件 / Video File",
              type: "file",
              options: {
                accept: "video/mp4,video/webm",
              },
            }),
            defineField({
              name: "posterImage",
              title: "视频封面图 / Poster Image",
              type: "image",
              options: { hotspot: true },
              fields: imageCaptionFields,
              hidden: true,
            }),
            defineField({
              name: "captionZh",
              title: "视频说明（中文） / Caption (Chinese)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "captionEn",
              title: "视频说明（英文） / Caption (English)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "autoplay",
              title: "是否自动播放 / Autoplay",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "muted",
              title: "是否静音 / Muted",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "loop",
              title: "是否循环播放 / Loop",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              captionZh: "captionZh",
              captionEn: "captionEn",
            },
            prepare({ captionZh, captionEn }) {
              return {
                title: captionZh || captionEn || "Artwork video",
                subtitle: "Uploaded video",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "artist",
      title: "作者 / Artist",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "year",
      title: "创作年份 / Year",
      type: "number",
      group: "content",
    }),
    defineField({
      name: "size",
      title: "尺寸 / Size",
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
      title: "作品描述（中文） / Description (Chinese)",
      type: "text",
      group: "content",
      rows: 5,
    }),
    defineField({
      name: "descriptionEn",
      title: "Artwork Description (English)",
      type: "text",
      group: "content",
      rows: 5,
    }),
    defineField({
      name: "materialZh",
      title: "作品材质（中文） / Material (Chinese)",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "materialEn",
      title: "作品材质（英文） / Material (English)",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "techniqueZh",
      title: "工艺 / Technique",
      type: "string",
      group: "content",
      hidden: ({ parent }) => parent?.category !== "sculpture",
      options: {
        list: techniqueOptions,
        layout: "dropdown",
      },
    }),
    defineField({
      name: "techniqueEn",
      title: "旧英文工艺（保留数据，不再用于前台） / Legacy Technique (English)",
      type: "string",
      group: "content",
      hidden: true,
    }),
    defineField({
      name: "isFeatured",
      title: "是否精选 / Is Featured",
      type: "boolean",
      group: "admin",
      initialValue: false,
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
      subtitle: "category",
      media: "coverImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle:
          typeof subtitle === "string"
            ? artProjectCategoryTitles[subtitle] || subtitle
            : subtitle,
        media,
      };
    },
  },
});

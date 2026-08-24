import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'
import {imageCaptionFields} from './imageCaptionFields'
import {shopCraftCategoryFields} from './shopTaxonomy'

export const derivativeProduct = defineType({
  name: 'derivativeProduct',
  title: '艺术衍生品 / Derivative Product',
  type: 'document',
  groups: [
    {name: 'basic', title: '基础信息 / Basic', default: true},
    {name: 'media', title: '图片 / Images'},
    {name: 'content', title: '产品内容 / Product Content'},
    {name: 'commerce', title: '价格 / Price'},
    {name: 'import', title: '导入审核 / Import Review'},
    {name: 'admin', title: '后台管理 / Admin'},
  ],
  fields: [
    orderRankField({type: 'derivativeProduct', hidden: true}),
    defineField({
      name: 'titleZh',
      title: '产品名称（中文） / Title (Chinese)',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: '链接标识 / Slug',
      type: 'slug',
      group: 'basic',
      options: {source: 'titleEn', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'derivativeCategory',
      title: '产品类型 / Product Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: '器物 / Vessel', value: 'vessel'},
          {title: '肖物 / Wearable', value: 'wearable'},
          {title: '玩物 / Toy', value: 'toy'},
          {title: '饰物 / Ornament', value: 'ornament'},
          {title: '境物 / Object', value: 'object'},
          {title: '包装 / Packaging', value: 'packaging'},
        ],
        layout: 'dropdown',
      },
    }),
    ...shopCraftCategoryFields('basic'),
    defineField({
      name: 'coverImage',
      title: '封面图片 / Cover Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: imageCaptionFields,
    }),
    defineField({
      name: 'gallery',
      title: '产品图片 / Gallery',
      type: 'array',
      group: 'media',
      of: [{type: 'image', options: {hotspot: true}, fields: imageCaptionFields}],
    }),
    defineField({
      name: 'video',
      title: '商品视频 / Product Video',
      type: 'file',
      group: 'media',
      options: {
        accept: 'video/mp4,video/webm',
      },
    }),
    defineField({
      name: 'descriptionZh',
      title: '产品介绍（中文） / Description (Chinese)',
      type: 'text',
      rows: 5,
      group: 'content',
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description (English)',
      type: 'text',
      rows: 5,
      group: 'content',
    }),
    defineField({
      name: 'specificationZh',
      title: '产品规格（中文） / Specification (Chinese)',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'specificationEn',
      title: 'Specification (English)',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'price',
      title: '价格 / Price',
      type: 'string',
      group: 'commerce',
    }),
    defineField({
      name: 'sourceUrl',
      title: '旧站来源链接 / Source URL',
      type: 'url',
      group: 'import',
    }),
    defineField({
      name: 'importSource',
      title: '导入来源 / Import Source',
      type: 'string',
      group: 'import',
      initialValue: 'old-qingjing-site',
      readOnly: true,
    }),
    defineField({
      name: 'needsReview',
      title: '需要人工审核 / Needs Review',
      type: 'boolean',
      group: 'import',
      initialValue: true,
    }),
    defineField({
      name: 'importNotes',
      title: '导入备注 / Import Notes',
      type: 'text',
      group: 'import',
      rows: 4,
    }),
    defineField({
      name: 'order',
      title: '排序 / Order',
      type: 'number',
      group: 'admin',
      initialValue: 0,
    }),
  ],
  orderings: [
    orderRankOrdering,
    {
      title: '排序 / Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'titleZh',
      subtitle: 'price',
      media: 'coverImage',
    },
  },
})

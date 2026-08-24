import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'
import {imageCaptionFields} from './imageCaptionFields'
import {shopTaxonomyFields} from './shopTaxonomy'

export const artDerivativeDetail = defineType({
  name: 'artDerivativeDetail',
  title: '艺术衍生品详情 / Art Derivative Detail',
  type: 'document',
  groups: [
    {name: 'basic', title: '基础信息 / Basic Info', default: true},
    {name: 'content', title: '作品信息 / Content'},
    {name: 'media', title: '图片 / Media'},
    {name: 'admin', title: '后台管理 / Admin'},
  ],
  fields: [
    orderRankField({type: 'artDerivativeDetail', hidden: true}),
    defineField({
      name: 'titleZh',
      title: '标题（中文） / Title (Chinese)',
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
      name: 'category',
      title: '产品类型 / Product Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: '器物 / Vessel', value: '器物'},
          {title: '肖物 / Wearable', value: '肖物'},
          {title: '玩物 / Toy', value: '玩物'},
          {title: '饰物 / Ornament', value: '饰物'},
          {title: '境物 / Object', value: '境物'},
          {title: '包装 / Packaging', value: '包装'},
        ],
      },
    }),
    ...shopTaxonomyFields('basic'),
    defineField({
      name: 'dimensions',
      title: '尺寸 / Dimensions',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'descriptionZh',
      title: '描述（中文） / Description (Chinese)',
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
      name: 'mainImage',
      title: '主图 / Main Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: imageCaptionFields,
    }),
    defineField({
      name: 'galleryImages',
      title: '作品图片 / Gallery Images',
      type: 'array',
      group: 'media',
      of: [{type: 'image', options: {hotspot: true}, fields: imageCaptionFields}],
    }),
    defineField({
      name: 'packagingImages',
      title: '包装图片 / Packaging Images',
      type: 'array',
      group: 'media',
      of: [{type: 'image', options: {hotspot: true}}],
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
      media: 'mainImage',
      subtitle: 'category',
      title: 'titleZh',
    },
  },
})

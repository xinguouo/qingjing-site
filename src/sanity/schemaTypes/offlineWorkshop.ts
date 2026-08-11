import {defineField, defineType} from 'sanity'
import {imageCaptionFields} from './imageCaptionFields'

export const offlineWorkshop = defineType({
  name: 'offlineWorkshop',
  title: '线下体验 / Offline Workshop',
  type: 'document',
  groups: [
    {name: 'basic', title: '基础信息 / Basic', default: true},
    {name: 'card', title: '列表卡片 / Card'},
    {name: 'detail', title: '详情信息 / Detail'},
    {name: 'admin', title: '后台管理 / Admin'},
  ],
  fields: [
    defineField({
      name: 'titleZh',
      title: '标题（中文） / Title (Chinese)',
      type: 'string',
      group: 'basic',
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
      name: 'coverImage',
      title: '海报图片 / Cover Image',
      type: 'image',
      group: 'card',
      options: {hotspot: true},
      fields: imageCaptionFields,
    }),
    defineField({
      name: 'shortDescriptionZh',
      title: '体验简介（中文） / Short Description (Chinese)',
      type: 'text',
      group: 'card',
      rows: 3,
    }),
    defineField({
      name: 'shortDescriptionEn',
      title: 'Short Description (English)',
      type: 'text',
      group: 'card',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: '体验分类 / Category',
      type: 'string',
      group: 'card',
      options: {
        list: [
          {title: '玻璃马赛克 / Glass Mosaic', value: 'glass-mosaic'},
          {title: '玻璃彩绘 / Glass Painting', value: 'glass-painting'},
          {title: '玻璃灯工 / Lampworking', value: 'lampworking'},
          {title: '玻璃吹制 / Glass Blowing', value: 'glass-blowing'},
        ],
      },
    }),
    defineField({
      name: 'tagZh',
      title: '标签（中文） / Tag (Chinese)',
      type: 'string',
      group: 'card',
      initialValue: '手作体验',
    }),
    defineField({
      name: 'tagEn',
      title: 'Tag (English)',
      type: 'string',
      group: 'card',
      initialValue: 'Workshop',
    }),
    defineField({
      name: 'suitableAudienceZh',
      title: '适合人群（中文） / Suitable Audience (Chinese)',
      type: 'text',
      group: 'detail',
      rows: 3,
    }),
    defineField({
      name: 'suitableAudienceEn',
      title: 'Suitable Audience (English)',
      type: 'text',
      group: 'detail',
      rows: 3,
    }),
    defineField({
      name: 'scheduleZh',
      title: '开放时间（中文） / Schedule (Chinese)',
      type: 'string',
      group: 'card',
    }),
    defineField({
      name: 'scheduleEn',
      title: 'Schedule (English)',
      type: 'string',
      group: 'card',
    }),
    defineField({
      name: 'price',
      title: '体验价格 / Price',
      type: 'string',
      group: 'card',
    }),
    defineField({
      name: 'contact',
      title: '联系方式 / Contact',
      type: 'string',
      group: 'detail',
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
    {
      title: '排序 / Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'titleZh',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
})

import {defineField, defineType} from 'sanity'
import {imageCaptionFields} from './imageCaptionFields'

export const culturalProduct = defineType({
  name: 'culturalProduct',
  title: '文创产品 / Cultural Product',
  type: 'document',
  groups: [
    {name: 'basic', title: '基础信息 / Basic', default: true},
    {name: 'media', title: '图片 / Image'},
    {name: 'admin', title: '后台管理 / Admin'},
  ],
  fields: [
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
      name: 'image',
      title: '产品图片 / Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: imageCaptionFields,
    }),
    defineField({
      name: 'category',
      title: '分类 / Category',
      type: 'string',
      group: 'basic',
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
      media: 'image',
    },
  },
})

import {defineField, defineType} from 'sanity'
import {imageCaptionFields} from './imageCaptionFields'

export const aboutMissionPage = defineType({
  name: 'aboutMissionPage',
  title: '使命愿景 / Mission & Vision',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitleZh',
      title: '页面标题（中文） / Page Title (Chinese)',
      type: 'string',
      initialValue: '使命愿景',
    }),
    defineField({
      name: 'pageTitleEn',
      title: 'Page Title (English)',
      type: 'string',
      initialValue: 'MISSION & VISION',
    }),
    defineField({
      name: 'bodyZh',
      title: '正文（中文） / Body (Chinese)',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'bodyEn',
      title: 'Body (English)',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'image',
      title: '图片 / Image',
      type: 'image',
      options: {hotspot: true},
      fields: imageCaptionFields,
    }),
    defineField({
      name: 'order',
      title: '排序 / Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'pageTitleZh',
      subtitle: 'pageTitleEn',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || '使命愿景 / Mission & Vision',
        subtitle,
        media,
      }
    },
  },
})

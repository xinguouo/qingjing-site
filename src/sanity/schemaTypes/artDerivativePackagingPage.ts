import {defineField, defineType} from 'sanity'

export const artDerivativePackagingPage = defineType({
  name: 'artDerivativePackagingPage',
  title: '包装页面 / Packaging Page',
  type: 'document',
  fields: [
    defineField({
      name: 'titleZh',
      title: '标题（中文） / Title Zh',
      type: 'string',
      initialValue: '包装',
    }),
    defineField({
      name: 'titleEn',
      title: '标题（英文） / Title En',
      type: 'string',
      initialValue: 'Packaging',
    }),
    defineField({
      name: 'descriptionZh',
      title: '包装描述（中文） / Packaging Description Zh',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'descriptionEn',
      title: '包装描述（英文） / Packaging Description En',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'images',
      title: '包装图片 / Packaging Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
  ],
  preview: {
    select: {
      title: 'titleZh',
      media: 'images.0',
    },
  },
})

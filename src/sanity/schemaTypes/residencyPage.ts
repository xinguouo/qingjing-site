import {defineField, defineType} from 'sanity'

export const residencyPage = defineType({
  name: 'residencyPage',
  title: '驻地计划',
  type: 'document',
  fields: [
    defineField({name: 'titleZh', title: '标题（中文）', type: 'string'}),
    defineField({name: 'titleEn', title: '标题（英文）', type: 'string'}),
    defineField({name: 'introZh', title: '介绍（中文）', type: 'text', rows: 5}),
    defineField({name: 'introEn', title: '介绍（英文）', type: 'text', rows: 5}),
    defineField({
      name: 'coverImage',
      title: '封面图片',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'spaceTitleZh', title: '空间标题（中文）', type: 'string'}),
    defineField({name: 'spaceTitleEn', title: '空间标题（英文）', type: 'string'}),
    defineField({
      name: 'spaceDescriptionZh',
      title: '空间描述（中文）',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'spaceDescriptionEn',
      title: '空间描述（英文）',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'spaceImages',
      title: '空间图片',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'applicationRequirementsZh',
      title: '申请条件（中文）',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'applicationRequirementsEn',
      title: '申请条件（英文）',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'feesAndRulesZh',
      title: '费用及使用规范（中文）',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'feesAndRulesEn',
      title: '费用及使用规范（英文）',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'additionalServicesZh',
      title: '其他服务（中文）',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'additionalServicesEn',
      title: '其他服务（英文）',
      type: 'text',
      rows: 6,
    }),
  ],
  preview: {
    select: {
      title: 'titleZh',
      subtitle: 'titleEn',
      media: 'coverImage',
    },
  },
})

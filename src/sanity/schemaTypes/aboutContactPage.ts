import {defineField, defineType} from 'sanity'

export const aboutContactPage = defineType({
  name: 'aboutContactPage',
  title: '联系我们 / Contact',
  type: 'document',
  groups: [
    {name: 'copy', title: '页面文案 / Page Copy', default: true},
    {name: 'contact', title: '联系方式 / Contact Info'},
  ],
  fields: [
    defineField({
      name: 'titleZh',
      title: '标题（中文） / Title Zh',
      type: 'string',
      group: 'copy',
    }),
    defineField({
      name: 'titleEn',
      title: '标题（英文） / Title En',
      type: 'string',
      group: 'copy',
    }),
    defineField({
      name: 'introZh',
      title: '介绍文案（中文） / Intro Zh',
      type: 'text',
      group: 'copy',
      rows: 4,
    }),
    defineField({
      name: 'introEn',
      title: '介绍文案（英文） / Intro En',
      type: 'text',
      group: 'copy',
      rows: 4,
    }),
    defineField({
      name: 'email',
      title: '联系邮箱 / Contact Email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'phone',
      title: '联系电话 / Contact Phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'addressZh',
      title: '联系地址（中文） / Address Zh',
      type: 'text',
      group: 'contact',
      rows: 2,
    }),
    defineField({
      name: 'addressEn',
      title: '联系地址（英文） / Address En',
      type: 'text',
      group: 'contact',
      rows: 2,
    }),
    defineField({
      name: 'socialLinks',
      title: '社交链接 / Social Links',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: '平台 / Platform',
              type: 'string',
            }),
            defineField({
              name: 'label',
              title: '显示名称 / Display Label',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: '链接 / URL',
              type: 'url',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: '地图嵌入链接 / Map Embed URL',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'mapImage',
      title: '地图图片 / Map Image',
      type: 'image',
      group: 'contact',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      title: 'titleZh',
      subtitle: 'titleEn',
    },
    prepare({title, subtitle}) {
      return {
        title: title || '联系我们 / Contact',
        subtitle,
      }
    },
  },
})

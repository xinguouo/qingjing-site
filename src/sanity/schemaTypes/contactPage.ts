import {defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: '联系我们 / Contact',
  type: 'document',
  groups: [
    {name: 'title', title: '页面标题 / Page Title', default: true},
    {name: 'address', title: '地址 / Address'},
    {name: 'contact', title: '联系方式 / Contact Info'},
  ],
  fields: [
    defineField({
      name: 'pageTitleZh',
      title: '页面标题（中文） / Page Title (Chinese)',
      type: 'string',
      group: 'title',
      initialValue: '联系我们',
    }),
    defineField({
      name: 'pageTitleEn',
      title: 'Page Title (English)',
      type: 'string',
      group: 'title',
      initialValue: 'CONTACT',
    }),
    defineField({
      name: 'address',
      title: '地址 / Address',
      type: 'object',
      group: 'address',
      fields: [
        defineField({
          name: 'titleZh',
          title: '地址标题（中文） / Address Title (Chinese)',
          type: 'string',
        }),
        defineField({
          name: 'titleEn',
          title: 'Address Title (English)',
          type: 'string',
        }),
        defineField({
          name: 'contentZh',
          title: '地址内容（中文） / Address Content (Chinese)',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'contentEn',
          title: 'Address Content (English)',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'mapImage',
          title: '地图图片 / Map Image',
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),
    defineField({
      name: 'phones',
      title: '电话 / Phone',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          title: '电话 / Phone',
          fields: [
            defineField({
              name: 'numberZh',
              title: '电话（中文） / Phone (Chinese)',
              type: 'string',
            }),
            defineField({
              name: 'numberEn',
              title: 'Phone (English)',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'numberZh',
              subtitle: 'numberEn',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'emails',
      title: '邮箱 / Email',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          title: '邮箱 / Email',
          fields: [
            defineField({
              name: 'email',
              title: '邮箱 / Email',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'email',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'openingHoursZh',
      title: '开放时间（中文） / Opening Hours (Chinese)',
      type: 'text',
      group: 'contact',
      rows: 3,
    }),
    defineField({
      name: 'openingHoursEn',
      title: 'Opening Hours (English)',
      type: 'text',
      group: 'contact',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'pageTitleZh',
      subtitle: 'pageTitleEn',
    },
    prepare({title, subtitle}) {
      return {
        title: title || '联系我们 / Contact',
        subtitle,
      }
    },
  },
})

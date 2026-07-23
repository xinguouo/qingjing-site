import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '网站设置 / Site Settings',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: '基础信息 Basic',
      default: true,
    },
    {
      name: 'logo',
      title: 'Logo',
    },
    {
      name: 'contact',
      title: '联系方式 Contact',
    },
    {
      name: 'footer',
      title: '页脚 Footer',
    },
    {
      name: 'social',
      title: '社交链接 Social Links',
    },
  ],
  fields: [
    defineField({
      name: 'siteNameZh',
      title: '网站名称（中文）',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteNameEn',
      title: 'Site Name (English)',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo 图片 / Logo Image',
      type: 'image',
      group: 'logo',
      options: {hotspot: true},
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
      title: '联系地址（中文）',
      type: 'text',
      group: 'contact',
      rows: 2,
    }),
    defineField({
      name: 'addressEn',
      title: 'Contact Address (English)',
      type: 'text',
      group: 'contact',
      rows: 2,
    }),
    defineField({
      name: 'footerTextZh',
      title: '页脚文字（中文）',
      type: 'text',
      group: 'footer',
      rows: 2,
    }),
    defineField({
      name: 'footerTextEn',
      title: 'Footer Text (English)',
      type: 'text',
      group: 'footer',
      rows: 2,
    }),
    defineField({
      name: 'socialLinks',
      title: '社交链接 / Social Links',
      type: 'array',
      group: ['contact', 'social'],
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: '平台 / Platform',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: '显示名称 / Display Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: '链接 / URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
            prepare({title, subtitle}) {
              return {
                title: title || '社交链接',
                subtitle,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'siteNameZh',
      subtitle: 'siteNameEn',
      media: 'logo',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || '网站设置 / Site Settings',
        subtitle: subtitle || 'Basic, Logo, Contact, Footer, Social Links',
        media,
      }
    },
  },
})

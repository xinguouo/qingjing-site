import {defineField, defineType} from 'sanity'

export const artWork = defineType({
  name: 'artWork',
  title: '艺术作品 / Art Work',
  type: 'document',
  groups: [
    {name: 'basic', title: '基础信息 / Basic', default: true},
    {name: 'display', title: '前台展示 / Frontend Display'},
    {name: 'admin', title: '后台管理 / Admin'},
  ],
  fields: [
    defineField({
      name: 'titleZh',
      title: '作品名称（中文） / Title Zh',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'titleEn',
      title: '作品名称（英文） / Title En',
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
      name: 'workType',
      title: '作品类型 / Work Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: '玻璃艺术 / Glass Art', value: 'glass-art'},
          {title: '装置艺术 / Installation Art', value: 'installation-art'},
          {title: '公共艺术 / Public Art', value: 'public-art'},
          {title: '雕塑艺术 / Sculpture Art', value: 'sculpture-art'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: '作品图片 / Images',
      type: 'array',
      group: 'display',
      of: [
        defineField({
          name: 'artworkImage',
          title: '作品图片 / Artwork Image',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: '图片 / Image',
              type: 'image',
              options: {hotspot: true},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: '图片说明 / Image Description',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: 'description',
              media: 'image',
            },
            prepare({title, media}) {
              return {
                title: title || 'Artwork image',
                media,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'descriptionZh',
      title: '描述话语（中文） / Description Zh',
      type: 'text',
      group: 'display',
      rows: 4,
    }),
    defineField({
      name: 'descriptionEn',
      title: '描述话语（英文） / Description En',
      type: 'text',
      group: 'display',
      rows: 4,
    }),
    defineField({
      name: 'size',
      title: '尺寸 / Size',
      type: 'string',
      group: 'display',
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
      subtitle: 'workType',
      media: 'images.0.image',
      legacyMedia: 'images.0',
    },
    prepare({title, subtitle, media, legacyMedia}) {
      return {
        title,
        subtitle,
        media: media || legacyMedia,
      }
    },
  },
})

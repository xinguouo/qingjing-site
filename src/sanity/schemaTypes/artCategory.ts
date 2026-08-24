import {defineField, defineType} from 'sanity'
import {imageCaptionFields} from './imageCaptionFields'

export const artCategory = defineType({
  name: 'artCategory',
  title: '艺术项目分类 / Art Category',
  type: 'document',
  groups: [
    {name: 'basic', title: '分类信息 / Category', default: true},
    {name: 'artworks', title: '作品列表 / Artworks'},
    {name: 'admin', title: '后台管理 / Admin'},
  ],
  fields: [
    defineField({
      name: 'titleZh',
      title: '分类标题（中文） / Title (Chinese)',
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
      name: 'categoryType',
      title: '分类类型 / Category Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: '雕塑 / Sculpture', value: 'sculpture'},
          {title: '装置艺术 / Installation Art', value: 'installation-art'},
          {title: '公共艺术 / Public Art', value: 'public-art'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artworks',
      title: '作品列表 / Artworks',
      type: 'array',
      group: 'artworks',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'titleZh',
              title: '作品名称（中文） / Title (Chinese)',
              type: 'string',
            }),
            defineField({
              name: 'titleEn',
              title: 'Title (English)',
              type: 'string',
            }),
            defineField({
              name: 'slug',
              title: '作品链接标识 / Slug',
              type: 'slug',
              options: {source: 'titleEn', maxLength: 96},
            }),
            defineField({
              name: 'images',
              title: '作品图片 / Images',
              type: 'array',
              of: [{type: 'image', options: {hotspot: true}, fields: imageCaptionFields}],
            }),
            defineField({
              name: 'dimensions',
              title: '尺寸信息 / Dimensions',
              type: 'string',
            }),
            defineField({
              name: 'descriptionZh',
              title: '作品简介（中文） / Description (Chinese)',
              type: 'text',
              rows: 4,
            }),
            defineField({
              name: 'descriptionEn',
              title: 'Description (English)',
              type: 'text',
              rows: 4,
            }),
          ],
          preview: {
            select: {
              title: 'titleZh',
              subtitle: 'dimensions',
              media: 'images.0',
            },
            prepare({title, subtitle, media}) {
              return {
                title: title || '作品 / Artwork',
                subtitle,
                media,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'order',
      title: '排序 / Order',
      type: 'number',
      group: 'admin',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'titleZh',
      subtitle: 'categoryType',
    },
  },
})

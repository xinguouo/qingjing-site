import {defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: '项目',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '项目标题',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '项目链接标识',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: '项目简介',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: '封面图片',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: '图片替代文字',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'published',
      title: '是否发布',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: '项目正文',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
      media: 'coverImage',
    },
  },
})

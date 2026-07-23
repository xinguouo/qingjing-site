import {defineField, defineType} from 'sanity'

export const offlineExperiencePage = defineType({
  name: 'offlineExperiencePage',
  title: '线下体验页面 / Offline Experience Page',
  type: 'document',
  groups: [
    {name: 'page', title: '页面标题 / Page Title', default: true},
    {name: 'banner', title: 'Banner'},
    {name: 'courses', title: '课程卡片 / Courses'},
  ],
  fields: [
    defineField({
      name: 'pageTitleZh',
      title: '页面标题（中文） / Page Title (Chinese)',
      type: 'string',
      group: 'page',
    }),
    defineField({
      name: 'pageTitleEn',
      title: 'Page Title (English)',
      type: 'string',
      group: 'page',
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner 图片 / Banner Image',
      type: 'image',
      group: 'banner',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bannerTitleZh',
      title: 'Banner 标题（中文） / Banner Title (Chinese)',
      type: 'string',
      group: 'banner',
    }),
    defineField({
      name: 'bannerTitleEn',
      title: 'Banner Title (English)',
      type: 'string',
      group: 'banner',
    }),
    defineField({
      name: 'courses',
      title: '课程 / Courses',
      type: 'array',
      group: 'courses',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'titleZh',
              title: '课程名称（中文） / Title (Chinese)',
              type: 'string',
            }),
            defineField({
              name: 'titleEn',
              title: 'Course Title (English)',
              type: 'string',
            }),
            defineField({
              name: 'coverImage',
              title: '课程图片 / Cover Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'descriptionZh',
              title: '课程简介（中文） / Description (Chinese)',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'descriptionEn',
              title: 'Course Description (English)',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'supportTeacher',
              title: '学术支持 / Support Teacher',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'titleZh',
              subtitle: 'supportTeacher',
              media: 'coverImage',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: '线下体验页面 / Offline Experience Page',
    }),
  },
})

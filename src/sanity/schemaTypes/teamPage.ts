import {defineField, defineType} from 'sanity'

export const teamPage = defineType({
  name: 'teamPage',
  title: '团队成员 / Team Members',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitleZh',
      title: '页面标题（中文） / Page Title (Chinese)',
      type: 'string',
      initialValue: '团队成员',
    }),
    defineField({
      name: 'pageTitleEn',
      title: 'Page Title (English)',
      type: 'string',
      initialValue: 'OUR TEAM',
    }),
  ],
  preview: {
    select: {
      title: 'pageTitleZh',
      subtitle: 'pageTitleEn',
    },
    prepare({title, subtitle}) {
      return {
        title: title || '团队成员 / Team Members',
        subtitle,
      }
    },
  },
})

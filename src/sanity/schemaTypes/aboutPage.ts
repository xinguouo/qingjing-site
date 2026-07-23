import {defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: '关于我们 / About Page',
  type: 'document',
  groups: [
    {
      name: 'mission',
      title: '使命愿景 / Mission & Vision',
    },
    {
      name: 'team',
      title: '团队介绍文案 / Team Intro',
    },
    {
      name: 'contact',
      title: '联系我们 / Contact',
    },
  ],
  fieldsets: [
    {
      name: 'missionFields',
      title: '使命愿景 / Mission & Vision',
      options: {collapsible: false},
    },
    {
      name: 'teamIntroFields',
      title: '团队介绍文案 / Team Intro',
      options: {collapsible: false},
    },
    {
      name: 'contactFields',
      title: '联系我们 / Contact',
      options: {collapsible: false},
    },
  ],
  fields: [
    defineField({
      name: 'missionTitleZh',
      title: '使命愿景标题（中文）',
      type: 'string',
      group: 'mission',
      fieldset: 'missionFields',
    }),
    defineField({
      name: 'missionTitleEn',
      title: 'Mission & Vision Title (English)',
      type: 'string',
      group: 'mission',
      fieldset: 'missionFields',
    }),
    defineField({
      name: 'missionTextZh',
      title: '使命愿景正文（中文）',
      type: 'text',
      group: 'mission',
      fieldset: 'missionFields',
      rows: 5,
    }),
    defineField({
      name: 'missionTextEn',
      title: 'Mission & Vision Body (English)',
      type: 'text',
      group: 'mission',
      fieldset: 'missionFields',
      rows: 5,
    }),
    defineField({
      name: 'missionImage',
      title: '使命愿景图片 / Mission & Vision Image',
      type: 'image',
      group: 'mission',
      fieldset: 'missionFields',
      options: {hotspot: true},
    }),
    defineField({
      name: 'teamIntroZh',
      title: '团队介绍文案（中文）',
      type: 'text',
      group: 'team',
      fieldset: 'teamIntroFields',
      rows: 4,
    }),
    defineField({
      name: 'teamIntroEn',
      title: 'Team Intro (English)',
      type: 'text',
      group: 'team',
      fieldset: 'teamIntroFields',
      rows: 4,
    }),
    defineField({
      name: 'contactTitleZh',
      title: '联系我们标题（中文）',
      type: 'string',
      group: 'contact',
      fieldset: 'contactFields',
    }),
    defineField({
      name: 'contactTitleEn',
      title: 'Contact Title (English)',
      type: 'string',
      group: 'contact',
      fieldset: 'contactFields',
    }),
    defineField({
      name: 'contactTextZh',
      title: '联系我们介绍文案（中文）',
      type: 'text',
      group: 'contact',
      fieldset: 'contactFields',
      rows: 4,
    }),
    defineField({
      name: 'contactTextEn',
      title: 'Contact Intro Text (English)',
      type: 'text',
      group: 'contact',
      fieldset: 'contactFields',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      media: 'missionImage',
    },
    prepare({media}) {
      return {
        title: '关于我们页面内容 / About Page Content',
        subtitle: '使命愿景、团队介绍文案、联系我们 / Mission, Team Intro, Contact',
        media,
      }
    },
  },
})

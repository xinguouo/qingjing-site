import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'
import {imageCaptionFields} from './imageCaptionFields'

const richTextField = (name: string, title: string, group: string) =>
  defineField({
    name,
    title,
    type: 'array',
    group,
    of: [
      {
        type: 'block',
        styles: [
          {title: 'Normal', value: 'normal'},
          {title: 'Heading 2', value: 'h2'},
          {title: 'Heading 3', value: 'h3'},
        ],
        lists: [
          {title: 'Bullet', value: 'bullet'},
          {title: 'Numbered', value: 'number'},
        ],
        marks: {
          decorators: [
            {title: 'Strong', value: 'strong'},
            {title: 'Emphasis', value: 'em'},
          ],
        },
      },
    ],
  })

const fileResourceField = (group: string) =>
  defineField({
    name: 'fileResources',
    title: '文件资源 / File Resources',
    type: 'array',
    group,
    of: [
      defineField({
        name: 'fileResource',
        title: '文件资源 / File Resource',
        type: 'object',
        fields: [
          defineField({
            name: 'titleZh',
            title: '文件名称（中文） / Title (Chinese)',
            type: 'string',
          }),
          defineField({
            name: 'titleEn',
            title: 'File Title (English)',
            type: 'string',
          }),
          defineField({
            name: 'file',
            title: '上传文件 / Uploaded File',
            type: 'file',
          }),
          defineField({
            name: 'externalUrl',
            title: '外部文件链接 / External File URL',
            type: 'url',
          }),
          defineField({
            name: 'type',
            title: '文件类型 / File Type',
            type: 'string',
            options: {
              list: [
                {title: 'PDF', value: 'pdf'},
                {title: 'PPT / PPTX', value: 'ppt'},
                {title: 'DOC / DOCX', value: 'doc'},
                {title: 'XLS / XLSX', value: 'xls'},
                {title: 'Other', value: 'other'},
              ],
              layout: 'dropdown',
            },
          }),
        ],
        preview: {
          select: {
            title: 'titleZh',
            subtitle: 'type',
          },
          prepare({title, subtitle}) {
            return {
              title: title || '文件资源 / File Resource',
              subtitle,
            }
          },
        },
      }),
    ],
  })

export const experienceCourse = defineType({
  name: 'experienceCourse',
  title: '线下体验课程 / Experience Course',
  type: 'document',
  groups: [
    {name: 'basic', title: '基础信息 / Basic', default: true},
    {name: 'media', title: '图片 / Media'},
    {name: 'content', title: '课程内容 / Content'},
    {name: 'detail', title: '详情信息 / Detail'},
    {name: 'admin', title: '后台管理 / Admin'},
  ],
  fields: [
    orderRankField({type: 'experienceCourse', hidden: true}),
    defineField({
      name: 'titleZh',
      title: '课程名称（中文） / Title (Chinese)',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'titleEn',
      title: 'Course Title (English)',
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
      name: 'category',
      title: '体验分类 / Category',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: '玻璃马赛克 / Glass Mosaic', value: 'glass-mosaic'},
          {title: '玻璃彩绘 / Glass Painting', value: 'glass-painting'},
          {title: '玻璃灯工 / Lampworking', value: 'lampworking'},
          {title: '玻璃吹制 / Glass Blowing', value: 'glass-blowing'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'heroImage',
      title: 'Banner 主视觉图片 / Hero Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: imageCaptionFields,
    }),
    defineField({
      name: 'coverImage',
      title: '课程海报 / Cover Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: imageCaptionFields,
    }),
    defineField({
      name: 'galleryImages',
      title: '课程图片 / Gallery Images',
      type: 'array',
      group: 'media',
      of: [{type: 'image', options: {hotspot: true}, fields: imageCaptionFields}],
    }),
    defineField({
      name: 'descriptionZh',
      title: '课程简介（中文） / Description (Chinese)',
      type: 'text',
      group: 'content',
      rows: 5,
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Course Description (English)',
      type: 'text',
      group: 'content',
      rows: 5,
    }),
    richTextField('contentZh', '正文（中文） / Content (Chinese)', 'content'),
    richTextField('contentEn', 'Content (English)', 'content'),
    defineField({
      name: 'courseImages',
      title: '课程图片 / Course Images',
      type: 'array',
      group: 'media',
      of: [{type: 'image', options: {hotspot: true}, fields: imageCaptionFields}],
    }),
    fileResourceField('content'),
    defineField({
      name: 'teacher',
      title: '学术主持 / Teacher',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'suitableAudience',
      title: '适合人群 / Suitable Audience',
      type: 'text',
      group: 'detail',
      rows: 3,
    }),
    defineField({
      name: 'schedule',
      title: '开放时间 / Schedule',
      type: 'string',
      group: 'detail',
    }),
    defineField({
      name: 'location',
      title: '活动地点 / Location',
      type: 'string',
      group: 'detail',
    }),
    defineField({
      name: 'contact',
      title: '联系方式 / Contact',
      type: 'text',
      group: 'detail',
      rows: 3,
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
    orderRankOrdering,
    {
      title: '排序 / Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'titleZh',
      media: 'coverImage',
    },
    prepare({title, media}) {
      return {
        title,
        subtitle: '线下体验 / Offline Experience',
        media,
      }
    },
  },
})

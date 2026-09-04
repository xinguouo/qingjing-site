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
          annotations: [
            {
              name: 'link',
              title: 'Link',
              type: 'object',
              fields: [
                defineField({
                  name: 'href',
                  title: 'URL',
                  type: 'url',
                }),
              ],
            },
          ],
        },
      },
    ],
  })

const fileResourcesField = (group: string) =>
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
            title: '文件标题（中文） / File Title (Chinese)',
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
            title: '外部链接 / External URL',
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
    {name: 'title', title: '课程名称 / Title', default: true},
    {name: 'card', title: '课程卡片 / Card'},
    {name: 'content', title: '文本 / Content'},
    {name: 'images', title: '图片组件 / Images'},
    {name: 'files', title: '文件链接 / Files'},
  ],
  fields: [
    orderRankField({type: 'experienceCourse', hidden: true}),
    defineField({
      name: 'titleZh',
      title: '课程名称（中文） / Course Title (Chinese)',
      type: 'string',
      group: 'title',
    }),
    defineField({
      name: 'titleEn',
      title: 'Course Title (English)',
      type: 'string',
      group: 'title',
    }),
    defineField({
      name: 'slug',
      title: '页面链接 / Slug',
      type: 'slug',
      group: 'title',
      options: {source: 'titleEn', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: '卡片封面图 / Cover Image',
      type: 'image',
      group: 'card',
      options: {hotspot: true},
      fields: imageCaptionFields,
    }),
    defineField({
      name: 'descriptionZh',
      title: '卡片简介（中文，可选） / Card Summary (Chinese)',
      type: 'text',
      rows: 3,
      group: 'card',
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Card Summary (English)',
      type: 'text',
      rows: 3,
      group: 'card',
    }),
    richTextField('contentZh', '正文（中文） / Content (Chinese)', 'content'),
    richTextField('contentEn', 'Content (English)', 'content'),
    defineField({
      name: 'courseImages',
      title: '课程图片 / Course Images',
      type: 'array',
      group: 'images',
      of: [{type: 'image', options: {hotspot: true}, fields: imageCaptionFields}],
    }),
    fileResourcesField('files'),
    defineField({
      name: 'order',
      title: '排序 / Order',
      type: 'number',
      hidden: true,
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

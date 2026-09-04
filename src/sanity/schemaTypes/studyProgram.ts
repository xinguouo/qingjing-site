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
            name: 'file',
            title: '上传文件 / Uploaded File',
            type: 'file',
          }),
        ],
        preview: {
          select: {
            title: 'file.asset.originalFilename',
          },
          prepare({title}) {
            return {
              title: title || '文件资源 / File Resource',
            }
          },
        },
      }),
    ],
  })

export const studyProgram = defineType({
  name: 'studyProgram',
  title: '高级研学课程 / Advanced Study Course',
  type: 'document',
  groups: [
    {name: 'title', title: '课程名称 / Title', default: true},
    {name: 'card', title: '课程卡片 / Card'},
    {name: 'content', title: '文本 / Content'},
    {name: 'images', title: '图片组件 / Images'},
    {name: 'files', title: '文件链接 / Files'},
  ],
  fields: [
    orderRankField({type: 'studyProgram', hidden: true}),
    defineField({
      name: 'titleZh',
      title: '课程名称（中文） / Course Title (Chinese)',
      type: 'string',
      group: 'title',
      validation: (rule) => rule.required(),
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
      name: 'cardDescriptionZh',
      title: '卡片简介（中文，可选） / Card Summary (Chinese)',
      type: 'text',
      rows: 3,
      group: 'card',
    }),
    defineField({
      name: 'cardDescriptionEn',
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
      name: 'programType',
      title: '项目类型 / Program Type',
      type: 'string',
      hidden: true,
      options: {
        list: [
          {title: '国际大师班', value: 'international-masterclass'},
          {title: '高级研学', value: 'advanced-study'},
        ],
      },
      initialValue: 'advanced-study',
      validation: (rule) => rule.required(),
    }),
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
      subtitle: 'programType',
      media: 'coverImage',
    },
  },
})

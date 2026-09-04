import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'
import {imageCaptionFields} from './imageCaptionFields'

const textField = (name: string, title: string, group: string, rows = 6) =>
  defineField({
    name,
    title,
    type: 'text',
    rows,
    group,
  })

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

export const studyProgram = defineType({
  name: 'studyProgram',
  title: '国际大师班课程',
  type: 'document',
  groups: [
    {name: 'basic', title: '基础信息', default: true},
    {name: 'intro', title: '课程介绍'},
    {name: 'host', title: '学术主持'},
    {name: 'teachers', title: '授课教师团队'},
    {name: 'modules', title: '课程设置'},
    {name: 'audience', title: '招生对象'},
    {name: 'academicAffairs', title: '教务信息'},
    {name: 'accommodation', title: '食宿及其他'},
    {name: 'certificate', title: '结业证书'},
    {name: 'registration', title: '报名及缴费方式'},
    {name: 'contact', title: '联系方式'},
    {name: 'advancedDetail', title: '高级研学详情 / Advanced Study Detail'},
    {name: 'related', title: '更多课程'},
    {name: 'admin', title: '后台管理'},
  ],
  fields: [
    orderRankField({type: 'studyProgram', hidden: true}),
    defineField({
      name: 'titleZh',
      title: '课程名称',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: '英文标题',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: '页面链接',
      type: 'slug',
      group: 'basic',
      options: {source: 'titleEn', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Banner 图片',
      type: 'image',
      group: 'basic',
      options: {hotspot: true},
      fields: imageCaptionFields,
    }),
    defineField({
      name: 'coverImage',
      title: '卡片封面 / Cover Image',
      type: 'image',
      group: 'basic',
      options: {hotspot: true},
      fields: imageCaptionFields,
    }),
    textField('cardDescriptionZh', '卡片简介（中文） / Card Description (Chinese)', 'basic', 3),
    textField('cardDescriptionEn', 'Card Description (English)', 'basic', 3),

    textField('courseIntroZh', '课程介绍（中文）', 'intro', 8),
    textField('courseIntroEn', 'Course Introduction (English)', 'intro', 8),

    textField('academicHostZh', '学术主持（中文）', 'host', 5),
    textField('academicHostEn', 'Academic Host (English)', 'host', 5),

    textField('teacherTeamZh', '授课教师团队（中文）', 'teachers', 7),
    textField('teacherTeamEn', 'Teaching Team (English)', 'teachers', 7),

    defineField({
      name: 'courseModules',
      title: '课程设置',
      type: 'array',
      group: 'modules',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'moduleNumber', title: '序号', type: 'string'}),
            defineField({name: 'moduleTitleZh', title: '模块标题（中文）', type: 'string'}),
            defineField({
              name: 'moduleTitleEn',
              title: 'Module Title (English)',
              type: 'string',
            }),
            defineField({
              name: 'moduleContentZh',
              title: '模块介绍（中文）',
              type: 'text',
              rows: 5,
            }),
            defineField({
              name: 'moduleContentEn',
              title: 'Module Content (English)',
              type: 'text',
              rows: 5,
            }),
            defineField({
              name: 'moduleImages',
              title: '模块图片',
              type: 'array',
              of: [{type: 'image', options: {hotspot: true}, fields: imageCaptionFields}],
            }),
          ],
          preview: {
            select: {title: 'moduleTitleZh', subtitle: 'moduleNumber', media: 'moduleImages.0'},
            prepare({title, subtitle, media}) {
              return {title: title || '课程模块', subtitle, media}
            },
          },
        },
      ],
    }),

    textField('targetAudienceZh', '招生对象（中文）', 'audience', 5),
    textField('targetAudienceEn', 'Target Audience (English)', 'audience', 5),

    textField('academicAffairsZh', '教务信息（中文）', 'academicAffairs', 5),
    textField('academicAffairsEn', 'Academic Affairs (English)', 'academicAffairs', 5),

    textField('accommodationZh', '食宿及其他（中文）', 'accommodation', 5),
    textField('accommodationEn', 'Accommodation and Others (English)', 'accommodation', 5),

    textField('certificateZh', '结业证书（中文）', 'certificate', 5),
    textField('certificateEn', 'Certificate (English)', 'certificate', 5),

    textField('registrationPaymentZh', '报名及缴费方式（中文）', 'registration', 6),
    textField('registrationPaymentEn', 'Registration and Payment (English)', 'registration', 6),

    textField('contactInfoZh', '联系方式（中文）', 'contact', 5),
    textField('contactInfoEn', 'Contact Info (English)', 'contact', 5),

    richTextField('contentZh', '正文（中文） / Content (Chinese)', 'advancedDetail'),
    richTextField('contentEn', 'Content (English)', 'advancedDetail'),
    defineField({
      name: 'courseImages',
      title: '课程图片 / Course Images',
      type: 'array',
      group: 'advancedDetail',
      of: [{type: 'image', options: {hotspot: true}, fields: imageCaptionFields}],
    }),
    defineField({
      name: 'fileResources',
      title: '文件资源 / File Resources',
      type: 'array',
      group: 'advancedDetail',
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
    }),

    defineField({
      name: 'relatedCourses',
      title: '更多课程',
      type: 'array',
      group: 'related',
      of: [
        {
          type: 'reference',
          to: [{type: 'studyProgram'}],
          options: {
            filter: ({document}) => ({
              filter: '_id != $currentId',
              params: {currentId: document._id},
            }),
          },
        },
      ],
    }),

    defineField({
      name: 'programType',
      title: '项目类型',
      type: 'string',
      group: 'admin',
      hidden: true,
      options: {
        list: [
          {title: '国际大师班', value: 'international-masterclass'},
          {title: '高级研学', value: 'advanced-study'},
        ],
        layout: 'radio',
      },
      initialValue: 'advanced-study',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'courseSection',
      title: '列表分组',
      type: 'string',
      group: 'admin',
      options: {
        list: [
          {title: '精选课程', value: 'featured'},
          {title: '往期课程', value: 'past'},
        ],
        layout: 'radio',
      },
      initialValue: 'featured',
    }),
    defineField({
      name: 'order',
      title: '排序',
      type: 'number',
      group: 'admin',
      initialValue: 0,
    }),
  ],
  orderings: [
    orderRankOrdering,
    {
      title: '排序',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'titleZh',
      subtitle: 'programType',
      media: 'heroImage',
    },
  },
})

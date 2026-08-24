import {defineField, defineType} from 'sanity'
import {imageCaptionFields} from './imageCaptionFields'

import {ArtworkImagesInput} from '../components/ArtworkImagesInput'

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
          {title: '雕塑 / Sculpture', value: 'sculpture'},
          {title: '装置艺术 / Installation Art', value: 'installation-art'},
          {title: '公共艺术 / Public Art', value: 'public-art'},
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
      components: {
        input: ArtworkImagesInput,
      },
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
              fields: imageCaptionFields,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: '图片说明（旧字段） / Image Description Legacy',
              type: 'text',
              rows: 3,
              hidden: true,
            }),
            defineField({
              name: 'descriptionZh',
              title: '图片说明（中文） / Description (Chinese)',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'descriptionEn',
              title: '图片说明（英文） / Description (English)',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: 'description',
              titleZh: 'descriptionZh',
              titleEn: 'descriptionEn',
              media: 'image',
            },
            prepare({title, titleZh, titleEn, media}) {
              return {
                title: titleZh || titleEn || title || 'Artwork image',
                media,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'artworkVideos',
      title: '作品视频 / Artwork Videos',
      type: 'array',
      group: 'display',
      of: [
        defineField({
          name: 'artworkVideo',
          title: '作品视频 / Artwork Video',
          type: 'object',
          fields: [
            defineField({
              name: 'videoFile',
              title: '上传视频文件 / Video File',
              type: 'file',
              options: {
                accept: 'video/mp4,video/webm',
              },
            }),
            defineField({
              name: 'posterImage',
              title: '视频封面图 / Poster Image',
              type: 'image',
              options: {hotspot: true},
              fields: imageCaptionFields,
              hidden: true,
            }),
            defineField({
              name: 'captionZh',
              title: '视频说明（中文） / Caption (Chinese)',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'captionEn',
              title: '视频说明（英文） / Caption (English)',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'autoplay',
              title: '是否自动播放 / Autoplay',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'muted',
              title: '是否静音 / Muted',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'loop',
              title: '是否循环播放 / Loop',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              captionZh: 'captionZh',
              captionEn: 'captionEn',
            },
            prepare({captionZh, captionEn}) {
              return {
                title: captionZh || captionEn || 'Artwork video',
                subtitle: 'Uploaded video',
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

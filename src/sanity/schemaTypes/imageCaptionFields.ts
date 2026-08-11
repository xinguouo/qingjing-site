import {defineField} from 'sanity'

export const imageCaptionFields = [
  defineField({
    name: 'captionZh',
    title: '图片描述（中文） / Image Caption (Chinese)',
    type: 'text',
    rows: 2,
  }),
  defineField({
    name: 'captionEn',
    title: '图片描述（英文） / Image Caption (English)',
    type: 'text',
    rows: 2,
  }),
]

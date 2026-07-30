import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'

export const artProject = defineType({
  name: 'artProject',
  title: '鑹烘湳浣滃搧 / Art Project',
  type: 'document',
  groups: [
    {name: 'basic', title: '鍩虹淇℃伅 / Basic', default: true},
    {name: 'media', title: '浣滃搧鍥剧墖 / Images'},
    {name: 'content', title: '浣滃搧淇℃伅 / Artwork Info'},
    {name: 'legacy', title: '鏃у瓧娈靛吋瀹?/ Legacy'},
    {name: 'import', title: '瀵煎叆瀹℃牳 / Import Review'},
    {name: 'admin', title: '鍚庡彴绠＄悊 / Admin'},
  ],
  fields: [
    orderRankField({type: 'artProject', hidden: true}),
    defineField({
      name: 'titleZh',
      title: '浣滃搧鍚嶇О锛堜腑鏂囷級 / Title (Chinese)',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'titleEn',
      title: 'Artwork Title (English)',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: '閾炬帴鏍囪瘑 / Slug',
      type: 'slug',
      group: 'basic',
      options: {source: 'titleEn', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: '浣滃搧鍒嗙被 / Category',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: '鐜荤拑鑹烘湳 / Glass Art', value: 'glass-art'},
          {title: '瑁呯疆鑹烘湳 / Installation Art', value: 'installation-art'},
          {title: '鍏叡鑹烘湳 / Public Art', value: 'public-art'},
          {title: '闆曞鑹烘湳 / Sculpture Art', value: 'sculpture-art'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'coverImage',
      title: '灏侀潰鍥剧墖 / Cover Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
    }),
    defineField({
      name: 'galleryImages',
      title: '浣滃搧鍥剧墖 / Artwork Images',
      type: 'array',
      group: 'media',
      of: [
        defineField({
          name: 'artworkImage',
          title: '浣滃搧鍥剧墖 / Artwork Image',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: '鍥剧墖 / Image',
              type: 'image',
              options: {hotspot: true},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: '鍥剧墖璇存槑 / Description',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: 'description',
              media: 'image',
            },
            prepare({title, media}) {
              return {
                title: title || 'Artwork image',
                media,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'artist',
      title: '浣滆€?/ Artist',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'year',
      title: '鍒涗綔骞翠唤 / Year',
      type: 'number',
      group: 'content',
    }),
    defineField({
      name: 'size',
      title: '灏哄 / Size',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'quantity',
      title: '鏁伴噺 / Quantity',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'descriptionZh',
      title: '浣滃搧鎻忚堪锛堜腑鏂囷級 / Description (Chinese)',
      type: 'text',
      group: 'content',
      rows: 5,
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Artwork Description (English)',
      type: 'text',
      group: 'content',
      rows: 5,
    }),
    defineField({
      name: 'price',
      title: '浠锋牸锛堟棫瀛楁锛屼笉鍦ㄨ壓鏈綔鍝佽鎯呭睍绀猴級 / Price Legacy',
      type: 'string',
      group: 'legacy',
    }),
    defineField({
      name: 'projectType',
      title: '鏃ч」鐩被鍨?/ Project Type Legacy',
      type: 'string',
      group: 'legacy',
      options: {
        list: [
          {title: '鍏叡鑹烘湳 / Public Art', value: 'public-art'},
          {title: '鑹烘湳浣滃搧瀹氬埗 / Custom Art', value: 'custom-art'},
          {title: '鐜荤拑鑹烘湳 / Glass Art', value: 'glass-art'},
          {title: '瑁呯疆鑹烘湳 / Installation Art', value: 'installation-art'},
          {title: '闆曞鑹烘湳 / Sculpture Art', value: 'sculpture-art'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'materialZh',
      title: '作品材质（中文） / Material (Chinese)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'materialEn',
      title: '作品材质（英文） / Material (English)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'techniqueZh',
      title: '作品工艺（中文） / Technique (Chinese)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'techniqueEn',
      title: '作品工艺（英文） / Technique (English)',
      type: 'string',
      group: 'content',
    }),
    defineField({name: 'locationZh', title: '鍦扮偣锛堟棫瀛楁锛?/ Location Zh Legacy', type: 'string', group: 'legacy'}),
    defineField({name: 'locationEn', title: 'Location En Legacy', type: 'string', group: 'legacy'}),
    defineField({name: 'detailZh', title: '璇︽儏锛堟棫瀛楁锛?/ Detail Zh Legacy', type: 'text', group: 'legacy', rows: 7}),
    defineField({name: 'detailEn', title: 'Detail En Legacy', type: 'text', group: 'legacy', rows: 7}),
    defineField({
      name: 'images',
      title: '鏃ч」鐩浘鐗?/ Images Legacy',
      type: 'array',
      group: 'legacy',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'isFeatured',
      title: '鏄惁绮鹃€?/ Is Featured',
      type: 'boolean',
      group: 'admin',
      initialValue: false,
    }),
    defineField({
      name: 'sourceUrl',
      title: '鏃х珯鏉ユ簮閾炬帴 / Source URL',
      type: 'url',
      group: 'import',
    }),
    defineField({
      name: 'importSource',
      title: '瀵煎叆鏉ユ簮 / Import Source',
      type: 'string',
      group: 'import',
    }),
    defineField({
      name: 'needsReview',
      title: '闇€瑕佷汉宸ュ鏍?/ Needs Review',
      type: 'boolean',
      group: 'import',
      initialValue: false,
    }),
    defineField({
      name: 'importNotes',
      title: '瀵煎叆澶囨敞 / Import Notes',
      type: 'text',
      group: 'import',
      rows: 4,
    }),
    defineField({
      name: 'order',
      title: '鎺掑簭 / Order',
      type: 'number',
      group: 'admin',
      initialValue: 0,
    }),
  ],
  orderings: [
    orderRankOrdering,
    {
      title: '鎺掑簭 / Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'titleZh',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
})

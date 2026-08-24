import {defineField, defineType} from 'sanity'

type ShopTaxonomyHiddenCallback = (context: {
  document?: Record<string, unknown>
  parent?: Record<string, unknown>
}) => boolean

type ShopTaxonomyFieldOptions = {
  seriesBranchHidden?: ShopTaxonomyHiddenCallback
  seriesHidden?: ShopTaxonomyHiddenCallback
}

export const shopCraftCategoryOptions = [
  {title: '玻璃铸造 / Glass Casting', value: 'glass-casting'},
  {title: '玻璃吹制 / Glass Blowing', value: 'glass-blowing'},
  {title: '玻璃灯工 / Lampworking', value: 'lampworking'},
  {title: '玻璃冷加工 / Cold Working', value: 'cold-working'},
  {title: '玻璃马赛克 / Glass Mosaic', value: 'glass-mosaic'},
  {title: '玻璃镶嵌 / Stained Glass', value: 'stained-glass'},
  {title: '玻璃绘画 / Glass Painting', value: 'glass-painting'},
]

export const shopSeries = defineType({
  name: 'shopSeries',
  title: '商品系列 / Product Series',
  type: 'document',
  fields: [
    defineField({
      name: 'titleZh',
      title: '系列名称（中文） / Title Zh',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: '系列名称（英文） / Title En',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: '链接标识 / Slug',
      type: 'slug',
      options: {source: 'titleEn', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'branches',
      title: '系列分支 / Series Branches',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'shopSeriesBranch'}],
        },
      ],
    }),
    defineField({
      name: 'order',
      title: '排序 / Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      subtitle: 'slug.current',
      title: 'titleZh',
    },
  },
})

export const shopSeriesBranch = defineType({
  name: 'shopSeriesBranch',
  title: '商品系列分支 / Product Series Branch',
  type: 'document',
  fields: [
    defineField({
      name: 'titleZh',
      title: '分支名称（中文） / Title Zh',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: '分支名称（英文） / Title En',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: '链接标识 / Slug',
      type: 'slug',
      options: {source: 'titleEn', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'series',
      title: '所属系列 / Series',
      type: 'reference',
      to: [{type: 'shopSeries'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: '排序 / Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      series: 'series.titleZh',
      title: 'titleZh',
    },
    prepare({series, title}) {
      return {
        title,
        subtitle: series,
      }
    },
  },
})

export function shopCraftCategoryField(group = 'basic') {
  return defineField({
    name: 'craftCategory',
    title: '玻璃工艺 / Craft Category',
    type: 'array',
    group,
    of: [{type: 'string'}],
    options: {
      list: shopCraftCategoryOptions,
      layout: 'tags',
    },
  })
}

export function shopCraftCategoryFields(group = 'basic') {
  return [shopCraftCategoryField(group)]
}

export function shopTaxonomyFields(group = 'basic', options: ShopTaxonomyFieldOptions = {}) {
  return [
    shopCraftCategoryField(group),
    defineField({
      name: 'series',
      title: '作品系列 / Series',
      type: 'reference',
      group,
      hidden: options.seriesHidden,
      to: [{type: 'shopSeries'}],
    }),
    defineField({
      name: 'seriesBranch',
      title: '系列分支 / Series Branch',
      type: 'reference',
      group,
      hidden: options.seriesBranchHidden,
      to: [{type: 'shopSeriesBranch'}],
      options: {
        filter: ({document}) => {
          const seriesRef = (document as {series?: {_ref?: string}})?.series?._ref

          return seriesRef
            ? {filter: 'series._ref == $seriesRef', params: {seriesRef}}
            : {filter: 'defined(series._ref)'}
        },
      },
    }),
  ]
}

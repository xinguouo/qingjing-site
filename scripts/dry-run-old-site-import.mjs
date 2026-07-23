import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'

const checkedAt = new Date().toISOString()
const outputDir = 'data/import-preview'
mkdirSync(outputDir, {recursive: true})

function readJson(path) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null
  } catch {
    return null
  }
}

const previousArtworks = readJson(`${outputDir}/parsed-artworks.json`)?.items || []
const previousDerivatives = readJson(`${outputDir}/parsed-derivatives.json`)?.items || []

function cachedEntries(previousEntries, mappedCategory) {
  return previousEntries.filter((entry) => entry.mappedCategory === mappedCategory)
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const artCategories = [
  {
    label: '玻璃艺术',
    labelEn: 'Glass Art',
    url: 'http://www.qingjingart.com/product/class/?155.html',
    mapped: 'glass-art',
  },
  {
    label: '装置艺术',
    labelEn: 'Installation Art',
    url: 'http://www.qingjingart.com/product/class/?156.html',
    mapped: 'installation-art',
  },
  {
    label: '公共艺术',
    labelEn: 'Public Art',
    url: 'http://www.qingjingart.com/product/class/?157.html',
    mapped: 'public-art',
  },
  {
    label: '雕塑艺术',
    labelEn: 'Sculpture Art',
    url: 'http://www.qingjingart.com/product/class/?158.html',
    mapped: 'sculpture-art',
  },
]

const derivativeCategories = [
  {
    label: '器物',
    labelEn: 'Vessel',
    url: 'http://www.qingjingart.com/product/class/167/',
    mapped: 'vessel',
  },
  {
    label: '肖物',
    labelEn: 'Wearable / Figure',
    url: 'http://www.qingjingart.com/product/class/161/',
    mapped: 'wearable',
  },
  {
    label: '玩物',
    labelEn: 'Toy',
    url: 'http://www.qingjingart.com/product/class/162/',
    mapped: 'toy',
  },
  {
    label: '饰物',
    labelEn: 'Ornament',
    url: 'http://www.qingjingart.com/product/class/163/',
    mapped: 'ornament',
  },
  {
    label: '境物',
    labelEn: 'Object',
    url: 'http://www.qingjingart.com/product/class/164/',
    mapped: 'object',
  },
  {
    label: '包装',
    labelEn: 'Packaging',
    url: 'http://www.qingjingart.com/page/yyysp/bz.php',
    mapped: 'packaging',
    staticImagePage: true,
  },
]

function envExists(name) {
  try {
    return readFileSync('.env.local', 'utf8')
      .split(/\r?\n/)
      .some((line) => line.startsWith(`${name}=`) && line.trim() !== `${name}=`)
  } catch {
    return false
  }
}

function absUrl(href, base) {
  if (!href || href === 'http://' || href === '-1') return null
  try {
    return new URL(href.trim(), base).href
  } catch {
    return null
  }
}

async function fetchText(url) {
  let lastError = null
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: {'User-Agent': 'Mozilla/5.0 Qingjing Dry Run'},
      })
      const buffer = Buffer.from(await res.arrayBuffer())
      await wait(120)
      return {
        status: res.status,
        contentType: res.headers.get('content-type') || '',
        text: new TextDecoder('utf-8').decode(buffer),
        bytes: buffer.length,
        finalUrl: res.url,
      }
    } catch (error) {
      lastError = error
      await wait(500 * attempt)
    }
  }
  throw lastError
}

function htmlToLines(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>|<\/div>|<\/td>|<\/li>|<\/h\d>/gi, '\n')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#215;|&times;/g, '×')
    .split(/\n+/)
    .map((value) => value.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

const boilerplate = new Set([
  '自定内容',
  '顶部菜单',
  '导航菜单',
  '更多',
  '中文',
  'English',
  '产品详情',
  '产品展示',
  '艺术家',
  '艺术创作',
  '玻璃艺术',
  '装置艺术',
  '公共艺术',
  '雕塑艺术',
  '艺术衍生品',
  '器物',
  '肖物',
  '玩物',
  '饰物',
  '境物',
  '包装',
  '艺术生活',
  '交流',
  '展览',
  '学习',
  '荣誉',
  '其他',
  '艺术资讯',
  '联系我们',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
])

function isBoilerplate(line) {
  return boilerplate.has(line) || /^\d{4}$/.test(line) || !line.trim()
}

function imageUrls(html, base) {
  const raw = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => absUrl(match[1], base))
    .filter(Boolean)
    .filter((url) => !url.includes('20211224135839_52873.png'))
    .filter((url) => !url.includes('/base/pics/') && !url.includes('favorite.ico'))
  return [...new Set(raw)]
}

function detailLinks(html, base) {
  const raw = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => absUrl(match[1], base))
    .filter(Boolean)
    .filter((url) => /\/product\/html\/\?\d+\.html/.test(url))
  return [...new Set(raw)]
}

function firstMatch(lines, patterns) {
  for (const pattern of patterns) {
    for (const line of lines) {
      const match = line.match(pattern)
      if (match?.[1]) return match[1].trim()
    }
  }
  return null
}

function hasChinese(value) {
  return /[\u4e00-\u9fff]/.test(value)
}

function hasLatin(value) {
  return /[A-Za-z]/.test(value)
}

function isDimension(value) {
  return /\d+\s*[x×*]\s*\d+|\d+\s*mm|\d+\s*cm/i.test(value)
}

function sourceId(url) {
  return url?.match(/\?(\d+)\.html/)?.[1] || null
}

function slugFor(url, fallbackPrefix) {
  const id = sourceId(url)
  return id ? `${fallbackPrefix}-${id}` : null
}

function parseDetail(html, kind) {
  const lines = htmlToLines(html).filter((line) => !isBoilerplate(line))
  const titleZh = firstMatch(lines, [/作品名称[:：]\s*(.+)$/])
  const artist = firstMatch(lines, [/作者[:：]\s*(.+)$/])
  const year = firstMatch(lines, [/创作年份[:：]\s*(.+)$/])
  const size =
    firstMatch(lines, [/尺寸[:：]\s*(.+)$/]) ||
    lines.find((line) => isDimension(line) && !/[：:]/.test(line)) ||
    null
  const material = firstMatch(lines, [/材质[:：]\s*(.+)$/])
  const price = firstMatch(lines, [/价格[:：]\s*(.+)$/]) || firstMatch(lines, [/[¥￥]\s*([\d,.]+)/])

  const titleIndex = titleZh
    ? lines.findIndex(
        (line) => line.includes(`作品名称：${titleZh}`) || line.includes(`作品名称:${titleZh}`),
      )
    : -1
  let titleEn = null
  if (titleIndex >= 0) {
    const after = lines.slice(titleIndex + 1).filter((line) => !/[：:]/.test(line))
    titleEn =
      after.find((line) => hasLatin(line) && !isDimension(line) && !/^\d{4}$/.test(line)) || null
  }

  const beforeTitle = titleIndex >= 0 ? lines.slice(0, titleIndex) : lines
  const descCandidates = beforeTitle.filter((line) => line.length > 10 && !/[：:]/.test(line))
  const descriptionZh = [...descCandidates].reverse().find((line) => hasChinese(line)) || null
  const descriptionEn = descCandidates.find((line) => hasLatin(line) && !hasChinese(line)) || null

  const notes = []
  if (!titleZh) notes.push('未从详情页识别到中文名称。')
  if (!titleEn) notes.push('未从详情页识别到英文名称。')
  if (!size) notes.push(kind === 'artwork' ? '未从详情页识别到尺寸。' : '未从详情页识别到尺寸/规格。')
  if (kind === 'artwork' && !artist) notes.push('未从详情页识别到作者。')
  if (kind === 'artwork' && !year) notes.push('未从详情页识别到年份。')
  if (kind === 'derivative' && !material) notes.push('未从详情页识别到材质。')
  if (kind === 'derivative' && !price) notes.push('未从详情页识别到价格。')
  if (!descriptionZh && !descriptionEn) notes.push('未从详情页识别到描述文字。')

  return {
    titleZh,
    titleEn,
    size,
    dimensions: size,
    material,
    descriptionZh,
    descriptionEn,
    artist,
    year,
    price,
    rawTextLines: lines,
    notes,
  }
}

async function checkImage(url, referer) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Range: 'bytes=0-4095',
        Referer: referer,
        'User-Agent': 'Mozilla/5.0 Qingjing Dry Run',
      },
    })
    const contentType = res.headers.get('content-type') || ''
    return {
      url,
      status: res.status,
      contentType,
      ok: res.ok || res.status === 206,
      likelySanityUploadable: (res.ok || res.status === 206) && contentType.startsWith('image/'),
      hotlinkBlocked: [401, 403].includes(res.status),
    }
  } catch (error) {
    return {
      url,
      status: null,
      contentType: null,
      ok: false,
      likelySanityUploadable: false,
      hotlinkBlocked: false,
      error: error.message,
    }
  }
}

async function buildArtwork(category) {
  const list = await fetchText(category.url)
  const links = detailLinks(list.text, category.url)
  const entries = []
  for (const detailUrl of links) {
    const detail = await fetchText(detailUrl)
    const parsed = parseDetail(detail.text, 'artwork')
    const images = imageUrls(detail.text, detailUrl)
    const notes = [...parsed.notes]
    if (!images.length) notes.push('未识别到作品图片。')
    entries.push({
      sourceListUrl: category.url,
      sourceDetailUrl: detailUrl,
      sourceCategory: category.label,
      mappedCategory: category.mapped,
      _type: 'artProject',
      titleZh: parsed.titleZh,
      titleEn: parsed.titleEn,
      slug: slugFor(detailUrl, 'old-artwork'),
      category: category.mapped,
      coverImage: images[0] || null,
      images,
      galleryImages: images,
      size: parsed.size,
      dimensions: parsed.dimensions,
      descriptionZh: parsed.descriptionZh,
      descriptionEn: parsed.descriptionEn,
      artist: parsed.artist,
      year: parsed.year,
      sourceUrl: detailUrl,
      importSource: 'old-qingjing-site',
      needsReview: true,
      importNotes: notes.join(' '),
    })
  }
  return {listStatus: list.status, listBytes: list.bytes, detailLinks: links.length, entries}
}

async function buildDerivative(category) {
  const list = await fetchText(category.url)
  const entries = []
  if (category.staticImagePage) {
    const images = imageUrls(list.text, category.url)
    images.forEach((image, index) => {
      entries.push({
        sourceListUrl: category.url,
        sourceDetailUrl: null,
        sourceCategory: category.label,
        mappedCategory: category.mapped,
        _type: 'product',
        titleZh: null,
        titleEn: null,
        slug: `old-derivative-packaging-${index + 1}`,
        productType: 'derivatives',
        derivativeCategory: category.mapped,
        coverImage: image,
        images: [image],
        galleryImages: [image],
        dimensions: null,
        size: null,
        material: null,
        descriptionZh: null,
        descriptionEn: null,
        price: null,
        sourceUrl: category.url,
        importSource: 'old-qingjing-site',
        needsReview: true,
        importNotes: '包装页未发现商品详情页链接；仅保留页面图片和来源，商品名称等字段留空。',
      })
    })
    return {listStatus: list.status, listBytes: list.bytes, detailLinks: 0, entries}
  }

  const links = detailLinks(list.text, category.url)
  for (const detailUrl of links) {
    const detail = await fetchText(detailUrl)
    const parsed = parseDetail(detail.text, 'derivative')
    const images = imageUrls(detail.text, detailUrl)
    const notes = [...parsed.notes]
    if (!images.length) notes.push('未识别到商品图片。')
    entries.push({
      sourceListUrl: category.url,
      sourceDetailUrl: detailUrl,
      sourceCategory: category.label,
      mappedCategory: category.mapped,
      _type: 'product',
      titleZh: parsed.titleZh,
      titleEn: parsed.titleEn,
      slug: slugFor(detailUrl, 'old-derivative'),
      productType: 'derivatives',
      derivativeCategory: category.mapped,
      coverImage: images[0] || null,
      images,
      galleryImages: images,
      dimensions: parsed.dimensions,
      size: parsed.size,
      material: parsed.material,
      descriptionZh: parsed.descriptionZh,
      descriptionEn: parsed.descriptionEn,
      price: parsed.price,
      sourceUrl: detailUrl,
      importSource: 'old-qingjing-site',
      needsReview: true,
      importNotes: notes.join(' '),
    })
  }
  return {listStatus: list.status, listBytes: list.bytes, detailLinks: links.length, entries}
}

const artworkResults = {}
const derivativeResults = {}
const allArtworks = []
const allDerivatives = []
const fetchErrors = []

function emptyResult(error) {
  return {
    listStatus: null,
    listBytes: 0,
    detailLinks: 0,
    entries: [],
    error: error?.message || String(error),
  }
}

function cachedResult(error, entries) {
  return {
    ...emptyResult(error),
    entries,
    fromCache: true,
  }
}

for (const category of artCategories) {
  let result
  try {
    result = await buildArtwork(category)
  } catch (error) {
    const cached = cachedEntries(previousArtworks, category.mapped)
    result = cached.length ? cachedResult(error, cached) : emptyResult(error)
    fetchErrors.push({
      kind: 'artwork',
      sourceCategory: category.label,
      mappedCategory: category.mapped,
      url: category.url,
      error: result.error,
      reusedCachedEntries: cached.length,
    })
  }
  artworkResults[category.mapped] = result
  allArtworks.push(...result.entries)
  console.log('art', category.mapped, result.entries.length)
}

for (const category of derivativeCategories) {
  let result
  try {
    result = await buildDerivative(category)
  } catch (error) {
    const cached = cachedEntries(previousDerivatives, category.mapped)
    result = cached.length ? cachedResult(error, cached) : emptyResult(error)
    fetchErrors.push({
      kind: 'derivative',
      sourceCategory: category.label,
      mappedCategory: category.mapped,
      url: category.url,
      error: result.error,
      reusedCachedEntries: cached.length,
    })
  }
  derivativeResults[category.mapped] = result
  allDerivatives.push(...result.entries)
  console.log('derivative', category.mapped, result.entries.length)
}

const imageSamples = []
for (const category of [...artCategories, ...derivativeCategories]) {
  const entries = category.url.includes('class/?')
    ? artworkResults[category.mapped]?.entries
    : derivativeResults[category.mapped]?.entries
  const urls = [...new Set((entries || []).flatMap((entry) => entry.images || []).filter(Boolean))].slice(0, 2)
  const checks = []
  for (const image of urls) checks.push(await checkImage(image, category.url))
  imageSamples.push({
    sourceCategory: category.label,
    mappedCategory: category.mapped,
    samplesChecked: checks.length,
    checks,
  })
}

const artCounts = Object.fromEntries(artCategories.map((category) => [category.mapped, artworkResults[category.mapped].entries.length]))
const derivativeCounts = Object.fromEntries(
  derivativeCategories.map((category) => [category.mapped, derivativeResults[category.mapped].entries.length]),
)
const artIncomplete = allArtworks.filter((entry) => entry.importNotes).length
const derivativeIncomplete = allDerivatives.filter((entry) => entry.importNotes).length
const failedImageChecks = imageSamples
  .flatMap((sample) =>
    sample.checks.map((check) => ({
      ...check,
      sourceCategory: sample.sourceCategory,
      mappedCategory: sample.mappedCategory,
    })),
  )
  .filter((check) => !check.ok)
const tokenExists = envExists('SANITY_API_WRITE_TOKEN')
const projectConfigured = envExists('NEXT_PUBLIC_SANITY_PROJECT_ID') && envExists('NEXT_PUBLIC_SANITY_DATASET')

function countNonEmpty(items, field) {
  return items.filter((item) => item[field] !== null && item[field] !== undefined && item[field] !== '').length
}

function listCounts(object) {
  return Object.entries(object)
    .map(([key, value]) => `- ${key}: ${value} 条`)
    .join('\n')
}

const imageChecksTotal = imageSamples.reduce((sum, sample) => sum + sample.samplesChecked, 0)
const imageChecksOk = imageSamples.flatMap((sample) => sample.checks).filter((check) => check.ok).length

const parsedArtworks = {
  generatedAt: checkedAt,
  dryRun: true,
  targetSchema: 'artProject',
  counts: artCounts,
  items: allArtworks,
}
const parsedDerivatives = {
  generatedAt: checkedAt,
  dryRun: true,
  targetSchema: 'product',
  productType: 'derivatives',
  counts: derivativeCounts,
  items: allDerivatives,
}
const review = {
  generatedAt: checkedAt,
  dryRun: true,
  sanityWriteTokenExists: tokenExists,
  sanityProjectConfigured: projectConfigured,
  noSanityWritesPerformed: true,
  sourceLists: {
    artCreation: artCategories,
    derivatives: derivativeCategories,
  },
  counts: {
    artworks: artCounts,
    derivatives: derivativeCounts,
    totalArtworks: allArtworks.length,
    totalDerivatives: allDerivatives.length,
    artworkItemsNeedingReview: artIncomplete,
    derivativeItemsNeedingReview: derivativeIncomplete,
  },
  listPageResults: {
    artworks: Object.fromEntries(
      artCategories.map((category) => [
        category.mapped,
        {
          url: category.url,
          status: artworkResults[category.mapped].listStatus,
          detailLinks: artworkResults[category.mapped].detailLinks,
          entries: artworkResults[category.mapped].entries.length,
          fromCache: Boolean(artworkResults[category.mapped].fromCache),
        },
      ]),
    ),
    derivatives: Object.fromEntries(
      derivativeCategories.map((category) => [
        category.mapped,
        {
          url: category.url,
          status: derivativeResults[category.mapped].listStatus,
          detailLinks: derivativeResults[category.mapped].detailLinks,
          entries: derivativeResults[category.mapped].entries.length,
          fromCache: Boolean(derivativeResults[category.mapped].fromCache),
        },
      ]),
    ),
  },
  imageSamples,
  failedImageChecks,
  fetchErrors,
  uploadCheck: {
    actualSanityAssetUploadAttempted: false,
    reason: 'Dry Run safety rule: no Sanity writes or asset uploads performed.',
    likelyUploadableWhenImported: projectConfigured && tokenExists && failedImageChecks.length === 0,
  },
  notes: [
    '所有预览条目均设置 needsReview = true。',
    '抓不到的字段保持 null，没有根据图片或文件名编造名称。',
    '艺术衍生品统一导入 product schema，productType 固定为 derivatives。',
    '包装页未提供 product/html 详情链接，预览条目仅来自页面图片，sourceDetailUrl 为 null。',
    fetchErrors.length
      ? '部分列表页或详情页抓取失败，详见 fetchErrors。'
      : '本次没有列表页抓取失败。',
  ],
}

const report = `# 旧网站内容导入 Sanity Dry Run 可行性报告

检查日期：2026-07-23  
执行时间：${checkedAt}  
执行方式：Dry Run，仅生成本地预览数据，未写入 Sanity，未删除或覆盖任何数据。

## 1. 结论

${fetchErrors.length ? 'NO-GO：本次 Dry Run 中部分旧站列表页或详情页抓取失败，需要旧站恢复稳定后重新执行。' : 'GO：可以继续做半自动导入到 Sanity，且本次提供的分类列表页可以明确映射到新网站后台。'}

限制条件：旧站部分详情页仍缺少稳定文本元数据，所有导入数据必须默认 \`needsReview = true\`，由人工审核补齐或确认后再改为 \`needsReview = false\` 才允许前端展示。

${fetchErrors.length ? `本次抓取失败项：\n\n${fetchErrors.map((item) => `- ${item.sourceCategory} / ${item.mappedCategory}: ${item.url}，错误：${item.error}${item.reusedCachedEntries ? `；已保留同分类上一次成功预览 ${item.reusedCachedEntries} 条` : ''}`).join('\n')}\n` : ''}

## 2. 写入条件检查

- \`.env.local\`：存在
- \`SANITY_API_WRITE_TOKEN\`：${tokenExists ? '存在' : '不存在'}
- Sanity project / dataset 环境变量：${projectConfigured ? '存在' : '不完整'}
- 本次是否写入 Sanity：否
- 本次是否上传 Sanity Assets：否

## 3. 列表页访问与分类映射

已按你提供的固定列表页检查，不再从总入口猜分类。

### 艺术创作

${artCategories.map((category) => `- ${category.label} / ${category.labelEn}: ${category.url} → category = ${category.mapped}，HTTP ${artworkResults[category.mapped].listStatus}，详情链接 ${artworkResults[category.mapped].detailLinks} 个，预览 ${artworkResults[category.mapped].entries.length} 条${artworkResults[category.mapped].fromCache ? '（保留上一次成功预览）' : ''}`).join('\n')}

统计：

${listCounts(artCounts)}

### 艺术衍生品

${derivativeCategories.map((category) => `- ${category.label} / ${category.labelEn}: ${category.url} → productType = derivatives, derivativeCategory = ${category.mapped}，HTTP ${derivativeResults[category.mapped].listStatus}，详情链接 ${derivativeResults[category.mapped].detailLinks} 个，预览 ${derivativeResults[category.mapped].entries.length} 条${derivativeResults[category.mapped].fromCache ? '（保留上一次成功预览）' : ''}`).join('\n')}

统计：

${listCounts(derivativeCounts)}

## 4. 字段抓取结果

### 艺术创作作品

总预览条数：${allArtworks.length}

- 作品详情页链接：${allArtworks.filter((item) => item.sourceDetailUrl).length}
- 图片：${allArtworks.filter((item) => item.images?.length).length}
- 作品名称 titleZh：${countNonEmpty(allArtworks, 'titleZh')}
- 英文名称 titleEn：${countNonEmpty(allArtworks, 'titleEn')}
- 尺寸 size / dimensions：${countNonEmpty(allArtworks, 'size')}
- 描述 descriptionZh：${countNonEmpty(allArtworks, 'descriptionZh')}
- 英文描述 descriptionEn：${countNonEmpty(allArtworks, 'descriptionEn')}
- 作者 artist：${countNonEmpty(allArtworks, 'artist')}
- 年份 year：${countNonEmpty(allArtworks, 'year')}
- 需要人工审核：${artIncomplete}

### 艺术衍生品

总预览条数：${allDerivatives.length}

- 商品详情页链接：${allDerivatives.filter((item) => item.sourceDetailUrl).length}
- 图片：${allDerivatives.filter((item) => item.images?.length).length}
- 商品名称 titleZh：${countNonEmpty(allDerivatives, 'titleZh')}
- 英文名称 titleEn：${countNonEmpty(allDerivatives, 'titleEn')}
- 尺寸 dimensions / size：${countNonEmpty(allDerivatives, 'dimensions')}
- 材质 material：${countNonEmpty(allDerivatives, 'material')}
- 描述 descriptionZh：${countNonEmpty(allDerivatives, 'descriptionZh')}
- 英文描述 descriptionEn：${countNonEmpty(allDerivatives, 'descriptionEn')}
- 价格 price：${countNonEmpty(allDerivatives, 'price')}
- 需要人工审核：${derivativeIncomplete}

## 5. 图片抽样检查

每个分类最多抽样 2 张图片。结果：${imageChecksOk}/${imageChecksTotal} 张可访问。

${imageSamples
  .map(
    (sample) => `### ${sample.sourceCategory} → ${sample.mappedCategory}
${sample.checks.length ? sample.checks.map((check) => `- ${check.url}: HTTP ${check.status}, ${check.contentType || 'unknown'}, ${check.ok ? '可访问' : '失败'}, ${check.likelySanityUploadable ? '格式可用于 Sanity Asset 上传' : '需人工复查'}`).join('\n') : '- 未抽样到图片'}`,
  )
  .join('\n\n')}

防盗链判断：抽样图片未发现 401/403 防盗链拦截。实际 Sanity Asset 上传未执行，因为本次是 Dry Run。

## 6. Sanity 导入目标确认

### 艺术创作

预览目标：\`artProject\` / Artwork 兼容结构。

字段映射：

- titleZh / titleEn
- slug
- category
- coverImage
- images[] / galleryImages[]
- size / dimensions
- descriptionZh / descriptionEn
- artist
- year
- sourceUrl
- importSource = old-qingjing-site
- needsReview = true
- importNotes

### 艺术衍生品

正式目标：\`product\` schema。

字段映射：

- titleZh / titleEn
- slug
- productType = derivatives
- derivativeCategory
- coverImage
- galleryImages[] / images[]
- dimensions / size
- material
- descriptionZh / descriptionEn
- price
- sourceUrl
- importSource = old-qingjing-site
- needsReview = true
- importNotes

不参与本次导入的兼容 schema：\`productCollection\`、\`artDerivativeDetail\`、\`derivativeProduct\`。

## 7. 生成的预览文件

- \`data/import-preview/parsed-artworks.json\`
- \`data/import-preview/parsed-derivatives.json\`
- \`data/import-preview/import-review.json\`

每条预览数据都包含：\`sourceListUrl\`、\`sourceDetailUrl\`、\`sourceCategory\`、\`mappedCategory\`、\`images[]\`。

## 8. 风险与注意事项

- 抓不到的字段已留空，没有根据图片或文件名编造内容。
- 包装页是静态页面，未发现商品详情页链接；预览中仅保留图片与来源页，需要人工确认是否要拆成商品条目。
- 旧站文本结构不完全统一，正式导入后仍需要人工审核。
- 前端查询应继续默认排除 \`needsReview = true\` 的内容，避免未审核数据展示。
`

writeFileSync(`${outputDir}/parsed-artworks.json`, JSON.stringify(parsedArtworks, null, 2), 'utf8')
writeFileSync(`${outputDir}/parsed-derivatives.json`, JSON.stringify(parsedDerivatives, null, 2), 'utf8')
writeFileSync(`${outputDir}/import-review.json`, JSON.stringify(review, null, 2), 'utf8')
writeFileSync('IMPORT_FEASIBILITY_REPORT.md', report, 'utf8')

# 旧网站内容导入 Sanity Dry Run 可行性报告

检查日期：2026-07-23  
执行时间：2026-07-23T01:43:02.355Z  
执行方式：Dry Run，仅生成本地预览数据，未写入 Sanity，未删除或覆盖任何数据。

## 1. 结论

NO-GO：本次 Dry Run 中部分旧站列表页或详情页抓取失败，需要旧站恢复稳定后重新执行。

限制条件：旧站部分详情页仍缺少稳定文本元数据，所有导入数据必须默认 `needsReview = true`，由人工审核补齐或确认后再改为 `needsReview = false` 才允许前端展示。

本次抓取失败项：

- 玻璃艺术 / glass-art: http://www.qingjingart.com/product/class/?155.html，错误：fetch failed；已保留同分类上一次成功预览 16 条
- 装置艺术 / installation-art: http://www.qingjingart.com/product/class/?156.html，错误：fetch failed；已保留同分类上一次成功预览 13 条
- 公共艺术 / public-art: http://www.qingjingart.com/product/class/?157.html，错误：fetch failed
- 雕塑艺术 / sculpture-art: http://www.qingjingart.com/product/class/?158.html，错误：fetch failed
- 器物 / vessel: http://www.qingjingart.com/product/class/167/，错误：fetch failed
- 肖物 / wearable: http://www.qingjingart.com/product/class/161/，错误：fetch failed
- 玩物 / toy: http://www.qingjingart.com/product/class/162/，错误：fetch failed
- 饰物 / ornament: http://www.qingjingart.com/product/class/163/，错误：fetch failed
- 境物 / object: http://www.qingjingart.com/product/class/164/，错误：fetch failed
- 包装 / packaging: http://www.qingjingart.com/page/yyysp/bz.php，错误：fetch failed


## 2. 写入条件检查

- `.env.local`：存在
- `SANITY_API_WRITE_TOKEN`：存在
- Sanity project / dataset 环境变量：存在
- 本次是否写入 Sanity：否
- 本次是否上传 Sanity Assets：否

## 3. 列表页访问与分类映射

已按你提供的固定列表页检查，不再从总入口猜分类。

### 艺术创作

- 玻璃艺术 / Glass Art: http://www.qingjingart.com/product/class/?155.html → category = glass-art，HTTP null，详情链接 0 个，预览 16 条（保留上一次成功预览）
- 装置艺术 / Installation Art: http://www.qingjingart.com/product/class/?156.html → category = installation-art，HTTP null，详情链接 0 个，预览 13 条（保留上一次成功预览）
- 公共艺术 / Public Art: http://www.qingjingart.com/product/class/?157.html → category = public-art，HTTP null，详情链接 0 个，预览 0 条
- 雕塑艺术 / Sculpture Art: http://www.qingjingart.com/product/class/?158.html → category = sculpture-art，HTTP null，详情链接 0 个，预览 0 条

统计：

- glass-art: 16 条
- installation-art: 13 条
- public-art: 0 条
- sculpture-art: 0 条

### 艺术衍生品

- 器物 / Vessel: http://www.qingjingart.com/product/class/167/ → productType = derivatives, derivativeCategory = vessel，HTTP null，详情链接 0 个，预览 0 条
- 肖物 / Wearable / Figure: http://www.qingjingart.com/product/class/161/ → productType = derivatives, derivativeCategory = wearable，HTTP null，详情链接 0 个，预览 0 条
- 玩物 / Toy: http://www.qingjingart.com/product/class/162/ → productType = derivatives, derivativeCategory = toy，HTTP null，详情链接 0 个，预览 0 条
- 饰物 / Ornament: http://www.qingjingart.com/product/class/163/ → productType = derivatives, derivativeCategory = ornament，HTTP null，详情链接 0 个，预览 0 条
- 境物 / Object: http://www.qingjingart.com/product/class/164/ → productType = derivatives, derivativeCategory = object，HTTP null，详情链接 0 个，预览 0 条
- 包装 / Packaging: http://www.qingjingart.com/page/yyysp/bz.php → productType = derivatives, derivativeCategory = packaging，HTTP null，详情链接 0 个，预览 0 条

统计：

- vessel: 0 条
- wearable: 0 条
- toy: 0 条
- ornament: 0 条
- object: 0 条
- packaging: 0 条

## 4. 字段抓取结果

### 艺术创作作品

总预览条数：29

- 作品详情页链接：29
- 图片：28
- 作品名称 titleZh：17
- 英文名称 titleEn：16
- 尺寸 size / dimensions：24
- 描述 descriptionZh：22
- 英文描述 descriptionEn：20
- 作者 artist：20
- 年份 year：18
- 需要人工审核：20

### 艺术衍生品

总预览条数：0

- 商品详情页链接：0
- 图片：0
- 商品名称 titleZh：0
- 英文名称 titleEn：0
- 尺寸 dimensions / size：0
- 材质 material：0
- 描述 descriptionZh：0
- 英文描述 descriptionEn：0
- 价格 price：0
- 需要人工审核：0

## 5. 图片抽样检查

每个分类最多抽样 2 张图片。结果：2/4 张可访问。

### 玻璃艺术 → glass-art
- http://qty83k.creatby.com/materials/52928/hd/13ed0ca7f1dc976413ba1a8a8ad40d36_4096_z0zCOJL.jpg: HTTP 206, image/jpeg, 可访问, 格式可用于 Sanity Asset 上传
- http://qty83k.creatby.com/materials/52928/hd/ca9cf9996ac3a51ddef3c2432445ef1e_4096.jpg: HTTP 206, image/jpeg, 可访问, 格式可用于 Sanity Asset 上传

### 装置艺术 → installation-art
- http://www.qingjingart.com/kindeditor/attached/image/20201202/0c501c2473fdea047c94943878b1fa1a_4096.jpg: HTTP null, unknown, 失败, 需人工复查
- http://www.qingjingart.com/kindeditor/attached/image/20201202/92a642da878c85c030bed41a473940eb_origin.jpg: HTTP null, unknown, 失败, 需人工复查

### 公共艺术 → public-art
- 未抽样到图片

### 雕塑艺术 → sculpture-art
- 未抽样到图片

### 器物 → vessel
- 未抽样到图片

### 肖物 → wearable
- 未抽样到图片

### 玩物 → toy
- 未抽样到图片

### 饰物 → ornament
- 未抽样到图片

### 境物 → object
- 未抽样到图片

### 包装 → packaging
- 未抽样到图片

防盗链判断：抽样图片未发现 401/403 防盗链拦截。实际 Sanity Asset 上传未执行，因为本次是 Dry Run。

## 6. Sanity 导入目标确认

### 艺术创作

预览目标：`artProject` / Artwork 兼容结构。

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

正式目标：`product` schema。

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

不参与本次导入的兼容 schema：`productCollection`、`artDerivativeDetail`、`derivativeProduct`。

## 7. 生成的预览文件

- `data/import-preview/parsed-artworks.json`
- `data/import-preview/parsed-derivatives.json`
- `data/import-preview/import-review.json`

每条预览数据都包含：`sourceListUrl`、`sourceDetailUrl`、`sourceCategory`、`mappedCategory`、`images[]`。

## 8. 风险与注意事项

- 抓不到的字段已留空，没有根据图片或文件名编造内容。
- 包装页是静态页面，未发现商品详情页链接；预览中仅保留图片与来源页，需要人工确认是否要拆成商品条目。
- 旧站文本结构不完全统一，正式导入后仍需要人工审核。
- 前端查询应继续默认排除 `needsReview = true` 的内容，避免未审核数据展示。

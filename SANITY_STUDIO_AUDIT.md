# Sanity Studio Audit

本审查只记录当前后台结构问题和整理建议，不修改代码、不删除数据、不新增 document type。

## 1. 当前 Sanity Studio 左侧结构现状

当前 `sanity.config.ts` 使用 `structureTool({structure})`，左侧结构由 `src/sanity/structure.ts` 自定义。

当前左侧主要入口为：

| 入口 | 对应 schema / document | 当前状态 |
| --- | --- | --- |
| 网站设置 / Site Settings | `siteSettings` singleton, `documentId = siteSettings` | 正式需要 |
| 首页 / Home Page | `homePage` singleton, `documentId = homePage` | 正式需要 |
| 关于我们 / About Page | `aboutPage` singleton, `documentId = aboutPage` | 正式需要，但结构有误导 |
| 关于我们 > 使命愿景 | 同一个 `aboutPage` singleton | 伪分组入口，实际打开完整 aboutPage 文档 |
| 关于我们 > 团队介绍介绍文案 / Team Intro | 同一个 `aboutPage` singleton | 伪分组入口，命名重复且右侧标题易误导 |
| 关于我们 > 联系我们 > 联系页标题和介绍文案 | 同一个 `aboutPage` singleton | 伪分组入口，实际打开完整 aboutPage 文档 |
| 关于我们 > 联系我们 > 邮箱、电话、地址、社交链接 | `siteSettings` singleton | 正式需要，但嵌套在 About 下会和全站设置重复 |
| 团队成员 / Team Members | `teamMember` list | 正式需要 |
| 艺术家 / Artists | `artist` list | 正式需要 |
| 研学项目 / Study Programs | `studyProgram` list | 正式需要，但 live/comingSoon 混在一起 |
| 活动 / Events | `event` list | 正式需要，但 live/comingSoon 混在一起 |
| 艺术作品 / Art Works | `artWork` list | 正式需要 |
| 商品 / Products | `product` list | 正式需要 |
| 驻地计划（暂不上线） / Residency Deferred | `residencyPage` singleton | 暂不上线，需要保留，但不应在主编辑流里突出 |
| 艺术项目（旧数据兼容） / Art Project Legacy | `artProject` list | 旧兼容，不应默认展示 |

另外，`src/sanity/schemaTypes/project.ts` 存在，但未注册到 `schemaTypes`，当前不会出现在 Studio 左侧。

## 2. 正式上线需要的入口

这些入口应作为后台主编辑区，按网站真实栏目组织，而不是按开发 schema 名称堆叠：

| 网站栏目 | 后台入口建议 | 使用 schema |
| --- | --- | --- |
| 全站设置 | 网站设置 | `siteSettings` |
| 首页 | 首页 | `homePage` |
| 关于我们 - 使命愿景 | 关于我们 > 使命愿景 | `aboutPage` |
| 关于我们 - 团队介绍文案 | 关于我们 > 团队介绍文案 | `aboutPage` |
| 关于我们 - 团队成员 | 关于我们 > 团队成员 | `teamMember` |
| 关于我们 - 艺术家详情 | 关于我们 > 艺术家 | `artist` |
| 关于我们 - 联系我们 | 关于我们 > 联系我们 | `aboutPage` + `siteSettings` |
| 研学 - 国际大师班 | 研学 > 国际大师班 | `studyProgram` where `programType = international-masterclass` |
| 活动 - 线下体验 | 活动 > 线下体验 | `event` where `eventType = offline-experience` |
| 艺术创作 | 艺术创作 > 玻璃艺术 / 装置艺术 / 公共艺术 / 雕塑艺术 | `artWork` filtered by `workType` |
| 商店 | 商店 > 全部商品 / 在售艺术作品 / 艺术衍生品 / 文创产品 | `product` filtered by `productType` |

## 3. 暂不上线但需要保留的入口

这些内容属于 Phase 1 comingSoon 或后续阶段内容。需要保留数据能力，但建议收纳到“暂不上线内容 / Deferred Content”分组，不要和正式上线入口并列：

| 内容 | 当前 schema / 字段 | 建议 |
| --- | --- | --- |
| 驻地计划 | `residencyPage` | 保留，但从主列表移到“暂不上线内容” |
| 驻地艺术家 | `artist.isResidentArtist` | 保留筛选字段，不作为主入口突出 |
| 国际研学 | `studyProgram.programType = international-study` | 保留，可放入“暂不上线内容 > 国际研学” |
| 艺术公开课 | `event.eventType = open-class` | 保留，可放入“暂不上线内容 > 艺术公开课” |
| 活动 | `event.eventType = activity` | 保留，可放入“暂不上线内容 > 活动” |

## 4. 旧兼容，不应该默认展示的入口

这些入口或字段用于兼容旧数据，不应出现在默认主编辑流：

| 项目 | 当前位置 | 问题 | 建议 |
| --- | --- | --- | --- |
| `artProject` document type | `schemaTypes` 已注册，`structure.ts` 左侧默认显示 | 与 `artWork` 并存，编辑者容易误填旧模型 | 移入“旧数据兼容 / Legacy Data”，默认折叠或放在最底部 |
| `homePage.featuredArtProjects` | `homePage` legacy group，hidden | 已隐藏，处理合理 | 继续隐藏 |
| `homePage.featuredResidency` | `homePage` legacy group，hidden | 已隐藏，处理合理 | 继续隐藏 |
| `artist.isTeamMember`, `artist.roleZh`, `artist.roleEn` | `artist` legacy group，hidden | 已隐藏，处理合理 | 继续隐藏 |
| `event.date`, `event.locationZh`, `event.locationEn`, `event.isFeatured` | `event` legacy group | 旧字段仍在 schema 中 | 如已 hidden 可保留；如果未 hidden，建议隐藏或移入 Legacy group |
| `product.materialZh`, `product.materialEn` | `product` legacy group | 旧字段不应影响新商品填写 | 保持隐藏或放入 Legacy group |
| `project` schema file | 文件存在但未注册 | 不显示，但容易让开发侧误判 | 后续可标注为 unused schema file，不在 Studio 暴露 |

## 5. About Page 当前 structure 是否指向错误

结论：当前更像是 structure 设计造成的“标题误导”，不是新增了错误 document type。

当前 `structure.ts` 中：

- “使命愿景 / Mission & Vision”
- “团队介绍介绍文案 / Team Intro”
- “联系页标题和介绍文案 / Contact Page Copy”

这几个入口都打开同一个 `aboutPage` singleton：

```ts
.schemaType('aboutPage')
.documentId('aboutPage')
```

因此它们不是独立页面文档，也不是只显示某个 field group 的编辑界面。点击“团队介绍介绍文案 / Team Intro”时，右侧仍然打开完整 `aboutPage` 文档。

同时，`aboutPage` 的 `preview.select.title` 当前选择的是：

```ts
title: 'missionTitleZh'
```

如果 `missionTitleZh` 填了“使命愿景”，Sanity 文档标题区域就会显示“使命愿景”。这会让编辑者误以为 Team Intro 入口指向了 Mission & Vision。

建议：

1. 不要把同一个 singleton 简单复制成多个 `S.document().documentId('aboutPage')` 入口，除非可以明确让右侧只聚焦对应 group。
2. 如果继续使用一个 `aboutPage` singleton，右侧文档标题应固定为“关于我们页面内容 / About Page Content”，不要用 `missionTitleZh` 作为文档大标题。
3. 左侧可保留“关于我们”一级入口，右侧通过 Sanity groups 显示：使命愿景、团队介绍、联系我们。
4. 如果确实要左侧显示“使命愿景 / 团队介绍文案 / 联系我们”，需要进一步实现能明确说明“这些入口打开的是同一个 aboutPage 文档”的结构，或使用自定义 document views / instruction panes，避免误导。

## 6. Schema 后台命名清晰度

| Schema | 当前命名情况 | 审查判断 |
| --- | --- | --- |
| `siteSettings` | 分组为基础信息、Logo、联系方式、页脚、社交链接 | 较清楚；可继续作为全站设置 singleton |
| `homePage` | 分组为 Hero、Intro、Featured、Legacy | 基本清楚；但首页当前前端已不展示 intro，建议后续把“简介区 / Intro”标注为可选或暂不展示 |
| `aboutPage` | 分组为使命愿景、团队介绍、联系我们 | 字段分组清楚；structure 伪入口和 preview title 导致后台体验混乱 |
| `teamMember` | 卡片内容、详情关联、后台管理 | 清楚 |
| `artist` | 基础信息、简介与经历、详情分区、筛选状态、旧字段、后台管理 | 清楚；legacy hidden 处理合理 |
| `studyProgram` | 基础信息、图片、列表卡片、详情内容、后台管理 | 清楚；但 live 国际大师班和 comingSoon 国际研学混在一个列表中，建议 structure 过滤分组 |
| `event` | 基础信息、图片、列表卡片、详情内容、旧字段、后台管理 | 基本清楚；但 live 线下体验和 comingSoon 艺术公开课/活动混在一个列表中，建议 structure 过滤分组 |
| `artWork` | 基础信息、前台展示、后台管理 | 清楚，且符合 artWork 前端只展示作品名称、尺寸、图片、描述话语的限制 |
| `product` | 基础信息、图片、详情内容、价格与库存、后台管理、旧字段 | 清楚；`derivativeCategory` hidden 逻辑应继续保留 |
| `residencyPage` | 当前无 groups，字段是平铺的 | 暂不上线内容可保留，但不适合默认主入口；如后续启用，建议补 groups |
| `artProject` | 旧模型字段较多，且包含 material/year/location/detail 等 | 旧兼容，不应默认展示 |

## 7. 建议整理后的 Sanity Studio 左侧结构

建议以网站实际栏目组织：

```text
内容管理 / Content

全站设置 / Site Settings
- 基础信息
- Logo
- 联系方式
- 页脚
- 社交链接

首页 / Home

关于我们 / About
- 使命愿景
- 团队介绍文案
- 团队成员
- 艺术家
- 联系我们
  - 联系页标题和介绍文案
  - 联系方式（邮箱、电话、地址、社交链接）

研学 / Study
- 国际大师班
- 国际研学（暂不上线）

活动 / Events
- 线下体验
- 艺术公开课（暂不上线）
- 活动（暂不上线）

艺术创作 / Art Creation
- 玻璃艺术
- 装置艺术
- 公共艺术
- 雕塑艺术

商店 / Shop
- 全部商品
- 在售艺术作品
- 艺术衍生品
- 文创产品

暂不上线内容 / Deferred Content
- 驻地计划
- 驻地艺术家
- 驻地申请

旧数据兼容 / Legacy Data
- Art Project Legacy
```

更具体的 structure 建议：

| 区域 | 建议实现 |
| --- | --- |
| About singleton | 保留一个 `aboutPage` document，不新增 `contactPage` |
| About 子入口 | 如无自定义 group focus，避免多个子入口都直接打开同一个 document 后造成标题误导 |
| Team Intro 命名 | 改为“团队介绍文案 / Team Intro”，去掉重复的“介绍介绍” |
| Contact | “联系我们”入口下同时提供 `aboutPage` 文案和 `siteSettings` 联系方式入口，但标题应明确二者都是现有 singleton |
| Study | 使用 `S.documentTypeList('studyProgram').filter(...)` 分出国际大师班和国际研学 |
| Events | 使用 `S.documentTypeList('event').filter(...)` 分出线下体验、艺术公开课、活动 |
| Art Creation | 使用 `S.documentTypeList('artWork').filter(...)` 按 `workType` 分组 |
| Shop | 使用 `S.documentTypeList('product').filter(...)` 按 `productType` 分组 |
| Deferred / Legacy | 不删除数据，只从默认主编辑流移到底部折叠或低优先级区域 |

## 8. 结论

当前后台混乱的核心不是字段缺失，而是 Studio structure 和 document preview 的信息架构没有完全匹配网站栏目：

1. `aboutPage` 被拆成多个左侧入口，但实际都打开同一个 singleton。
2. `aboutPage` 的文档标题来自 `missionTitleZh`，导致 Team Intro / Contact 入口右侧显示“使命愿景”。
3. `residencyPage` 和 `artProject` 直接暴露在主列表，使正式编辑入口和暂缓/旧兼容入口混在一起。
4. `studyProgram`、`event`、`artWork`、`product` 目前按 schema 展示，尚未按网站栏目过滤组织。

建议下一步只优化 `src/sanity/structure.ts` 和必要的 schema preview/title，不删除任何数据，不新增 document type。

# CMS_CONTENT_MAPPING.md

本文档根据 `PAGE_CONTENT_STRUCTURE.md` 检查当前 Sanity CMS schema 与 Figma 高保真页面内容构成的对应关系。  
本文件只做映射与差异记录，不删除已有数据，不修改代码，不修改 schema。

## 0. 总体结论

- 当前 `homePage`, `aboutPage`, `teamMember`, `artist`, `studyProgram`, `event`, `artWork`, `product`, `siteSettings` 能覆盖 Phase 1 多数基础展示内容。
- 高保真里没有展示的字段，不要求前端强制展示。
- 后台管理字段可以保留，只用于排序、筛选、兼容旧数据或 CMS 管理。
- `artWork` 前端展示必须收窄为：作品名称、尺寸、数量不一的图片、描述话语。
- `product` 详情页必须根据 `productType` 区分三套模板：`available-artworks`, `art-derivatives`, `cultural-products`。

## 1. 全局 Shell / 站点设置

| 页面范围 | 模块 | 读取 schema | 字段 | 前端展示 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 全站 | Sidebar 品牌 | `siteSettings` | `siteNameZh`, `siteNameEn`, `logo` | 是 | sidebar 视觉以 `sidebar-desktop.png` 为准 |
| 全站 | Footer copyright | `siteSettings` | `footerTextZh`, `footerTextEn` | 可展示 | 高保真 sidebar 底部显示 copyright |
| 联系页 / 课程详情联系区 | 联系方式 | `siteSettings` | `email`, `phone`, `addressZh`, `addressEn` | 是 | 联系页明确展示；课程详情可复用 |
| 全站 | 社交链接 | `siteSettings` | `socialLinks` | 前端可不展示 | 高保真未展示 |
| 全站 | 导航 | `src/config/navigation.ts` | label, route, status | 是 | 不来自 Sanity |
| 全站 | 搜索、语言、主题按钮 | 前端状态 / 固定文案 | - | 是 | 不来自 Sanity |

**建议补充字段**

| 建议字段 | 归属 schema | 原因 |
| --- | --- | --- |
| `openingHoursZh`, `openingHoursEn` | `siteSettings` | 联系页高保真展示开放时间 |
| `mapImage` | `siteSettings` 或 `aboutPage` | 联系页高保真展示路线地图图片 |

## 2. 首页

**Route**

- `/zh`
- `/en`

**读取 schema**

- `homePage`
- `siteSettings`
- 关联：`studyProgram`, `event`, `artWork`, `product`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Hero 标题 | `homePage` | `heroTitleZh`, `heroTitleEn` | 是 | 是 | En 为空 fallback 到 Zh |
| Hero 副标题 | `homePage` | `heroSubtitleZh`, `heroSubtitleEn` | 可展示 | 否 | 高保真不明显，可为空 |
| Hero 图片 | `homePage` | `heroImage` | 可展示 | 否 | 高保真是灰色 hero/slider 区 |
| 简介区 | `homePage` | `introTitleZh`, `introTitleEn`, `introTextZh`, `introTextEn` | 是 | 否 | 当前只支持一组 intro |
| 推荐课程 | `homePage` -> `studyProgram` | `featuredStudyPrograms[]`, `titleZh/En`, `slug`, `posterImage`, `courseIntroZh/En`, `facultyZh/En` | 是 | 否 | 对应首页“国际大师班”卡片 |
| 推荐活动 | `homePage` -> `event` | `featuredEvents[]`, `titleZh/En`, `slug`, `posterImage`, `contentZh/En`, `courseIntroZh/En`, `facultyZh/En` | 是 | 否 | 对应首页“最近活动”卡片 |
| 推荐艺术作品 | `homePage` -> `artWork` | `featuredArtWorks[]` | 前端可不展示 | 否 | 高保真当前未明确展示 |
| 推荐商品 | `homePage` -> `product` | `featuredProducts[]` | 前端可不展示 | 否 | 高保真当前未明确展示 |

**建议补充字段**

| 建议字段 | 原因 |
| --- | --- |
| `heroCtas[]` | 高保真 hero 有“了解工作室”“预约体验”按钮 |
| `heroSlides[]` | 如需真实轮播，需要多图、多标题、多 CTA |
| `introCards[]` | 高保真首页出现两张简介卡，当前 `homePage` 只有一组 intro |

**后台管理 / 兼容字段**

| 字段 | 判断 |
| --- | --- |
| `featuredResidency` | 旧字段，前端不展示 |
| `featuredArtProjects` | 旧字段，前端不展示；仅兼容旧数据 |

## 3. 关于我们

### 3.1 使命愿景页

**Route**

- `/zh/about/mission-vision`
- `/en/about/mission-vision`

**读取 schema**

- `aboutPage`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 页面标题 | `aboutPage` | `missionTitleZh`, `missionTitleEn` | 是 | 是 | 可作为 H1 |
| 使命图片 | `aboutPage` | `missionImage` | 是 | 否 | 无图时 placeholder |
| 使命正文 | `aboutPage` | `missionTextZh`, `missionTextEn` | 是 | 是 | 中英文按 locale 读取 |

**前端可不展示**

| 字段 | 判断 |
| --- | --- |
| `teamIntroZh`, `teamIntroEn` | 团队页可用，本页不展示 |
| `contactTitleZh`, `contactTitleEn`, `contactTextZh`, `contactTextEn` | 联系页可用，本页不展示 |

### 3.2 团队介绍页

**Route**

- `/zh/about/team`
- `/en/about/team`

**读取 schema**

- `aboutPage`
- `teamMember`
- 可关联 `artist`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 页面标题 | `aboutPage` / 前端配置 | `teamIntroZh`, `teamIntroEn` 或固定标题 | 可展示 | 否 | 高保真标题可固定 |
| 团队成员列表 | `teamMember` | document list ordered by `order` | 是 | 是 | 高保真 4 列人员卡 |
| 成员姓名 | `teamMember` | `nameZh`, `nameEn` | 是 | 是 | 卡片主文本 |
| 成员角色 | `teamMember` | `roleZh`, `roleEn` | 是 | 否 | 高保真展示 |
| 成员简介 | `teamMember` | `bioZh`, `bioEn` | 是 | 否 | 高保真展示短简介 |
| 成员肖像 | `teamMember` | `portrait` | 是 | 否 | 无图时 placeholder |
| 艺术家详情入口 | `teamMember` -> `artist` | `linkedArtist.slug` | 是 | 否 | 有关联时卡片可点击 |

**后台管理字段**

| 字段 | 判断 |
| --- | --- |
| `teamMember.order` | 仅排序，不直接展示 |

### 3.3 艺术家个人介绍页

**Route**

- `/zh/about/artists/[slug]`
- `/en/about/artists/[slug]`

**读取 schema**

- `artist`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| slug 查询 | `artist` | `slug` | 不直接展示 | 是 | 根据 route slug 读取详情 |
| 艺术家姓名 | `artist` | `nameZh`, `nameEn` | 是 | 是 | 详情主标题 |
| 艺术家头衔 | `artist` | `titleZh`, `titleEn` | 是 | 否 | 高保真信息卡展示 |
| 简介 / 履历 | `artist` | `bioZh`, `bioEn`, `educationExperienceZh`, `educationExperienceEn` | 是 | 否 | 可按设计组合展示 |
| 肖像 | `artist` | `portrait` | 是 | 否 | 左侧头像 |
| 荣誉和收藏 | `artist` | `honorsZh`, `honorsEn` | 是 | 否 | 高保真分区 |
| 出版 | `artist` | `publicationsZh`, `publicationsEn` | 是 | 否 | 高保真分区 |
| 近期展览 | `artist` | `exhibitionsZh`, `exhibitionsEn` | 是 | 否 | 高保真分区 |

**后台管理字段**

| 字段 | 判断 |
| --- | --- |
| `isTeamArtist` | 筛选团队艺术家，不直接展示 |
| `isResidentArtist` | 筛选驻地艺术家，不直接展示 |
| `order` | 排序，不直接展示 |
| `isTeamMember`, `roleZh`, `roleEn` | 旧兼容字段，不展示 |

### 3.4 联系我们页

**Route**

- `/zh/about/contact`
- `/en/about/contact`

**读取 schema**

- `aboutPage`
- `siteSettings`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 页面标题 | `aboutPage` | `contactTitleZh`, `contactTitleEn` | 是 | 是 | 也可前端固定 |
| 地址 | `siteSettings` | `addressZh`, `addressEn` | 是 | 是 | 高保真展示地址卡 |
| 电话 | `siteSettings` | `phone` | 是 | 否 | 高保真展示电话卡 |
| 邮箱 | `siteSettings` | `email` | 是 | 否 | 高保真展示邮箱卡 |
| 联系说明 | `aboutPage` | `contactTextZh`, `contactTextEn` | 前端可不展示 | 否 | 高保真未明显展示长文 |

**建议补充字段**

| 建议字段 | 原因 |
| --- | --- |
| `mapImage` | 高保真展示路线地图图片 |
| `openingHoursZh`, `openingHoursEn` | 高保真展示开放时间 |

**前端可不展示**

| 字段 | 判断 |
| --- | --- |
| `siteSettings.socialLinks` | 高保真未展示 |

## 4. 研学

### 4.1 国际大师班列表页

**Route**

- `/zh/study/masterclass`
- `/en/study/masterclass`

**读取 schema**

- `studyProgram`

**查询条件**

- `programType == "international-masterclass"`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 页面标题 | 前端配置 / `studyProgram.programType` | 固定标题 | 是 | 是 | 高保真显示国际大师班 |
| 课程列表 | `studyProgram` | documents by `programType` ordered by `order` | 是 | 是 | 高保真 3 列卡片 |
| 课程标题 | `studyProgram` | `titleZh`, `titleEn` | 是 | 是 | 卡片标题 |
| 海报图 | `studyProgram` | `posterImage` | 是 | 否 | poster 不裁切 |
| 课程简介 | `studyProgram` | `courseIntroZh`, `courseIntroEn` | 是 | 否 | 卡片摘要 |
| 学术主持 / 师资 | `studyProgram` | `facultyZh`, `facultyEn` | 是 | 否 | 目前为文本 |
| 详情入口 | `studyProgram` | `slug` | 不直接展示 | 是 | 卡片点击使用 |

**建议补充字段**

| 建议字段 | 原因 |
| --- | --- |
| `programStatus` or `programGroup` | 高保真有“精选课程”“往期课程”两个分区 |
| `hostZh`, `hostEn` 或教师引用 | 高保真卡片有“学术主持”，当前只能从 `faculty` 文本中取 |

**前端可不展示**

| 字段 | 判断 |
| --- | --- |
| `coverImage` | 列表页不明显展示 |
| `teachingSpaceZh/En`, `feesZh/En`, `outcomesZh/En`, `outcomeImages` | 列表页不展示 |
| `programType`, `order` | 筛选 / 排序字段，不直接展示 |

### 4.2 国际大师班详情页

**Route**

- `/zh/study/masterclass/[slug]`
- `/en/study/masterclass/[slug]`

**读取 schema**

- `studyProgram`
- `siteSettings`

**查询条件**

- `slug.current == $slug`
- 建议校验 `programType == "international-masterclass"`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Detail hero | `studyProgram` | `titleZh`, `titleEn`, `coverImage` | 是 | 是 | 高保真顶部 hero |
| 课程介绍 | `studyProgram` | `courseIntroZh`, `courseIntroEn` | 是 | 是 | 主正文 |
| 学术主持 / 授课教师团队 | `studyProgram` | `facultyZh`, `facultyEn` | 是 | 否 | 当前为文本 |
| 教学空间 | `studyProgram` | `teachingSpaceZh`, `teachingSpaceEn` | 可展示 | 否 | schema 有，详情页可展示 |
| 费用 / 报名缴费 | `studyProgram` | `feesZh`, `feesEn` | 可展示 | 否 | 只能部分覆盖高保真缴费分区 |
| 成果说明 | `studyProgram` | `outcomesZh`, `outcomesEn` | 可展示 | 否 | 可作为成果相关内容 |
| 成果图片 | `studyProgram` | `outcomeImages` | 可展示 | 否 | 不能完整替代课程设置结构 |
| 联系方式 | `siteSettings` | `phone`, `email`, `addressZh`, `addressEn` | 可展示 | 否 | 高保真底部联系方式 |

**建议补充字段**

| 建议字段 | 原因 |
| --- | --- |
| `courseSchedule[]` | 高保真有多段课程设置，每段包含编号、标题、说明、图片 |
| `teachers[]` | 如果授课教师要结构化展示，当前 `faculty` 文本不够 |
| `admissionAudienceZh/En` | 高保真有招生对象分区 |
| `academicInfoZh/En` | 高保真有教务信息分区 |
| `accommodationZh/En` | 高保真有食宿及其他分区 |
| `certificateZh/En` | 高保真有结业证书分区 |
| `registrationMethodZh/En` | 高保真有报名及缴费方式分区，`fees` 不能完全覆盖 |
| `relatedPrograms[]` | 高保真右侧有推荐/相关课程侧栏 |

**后台管理字段**

| 字段 | 判断 |
| --- | --- |
| `programType` | 详情页校验和列表筛选，不直接展示 |
| `order` | 排序，不直接展示 |

### 4.3 国际研学 Coming Soon

**Route**

- `/zh/study/international-study`
- `/en/study/international-study`
- `/zh/study/international-study/[slug]`
- `/en/study/international-study/[slug]`

**读取 schema**

- Phase 1 不读取 Sanity 内容

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Coming Soon 标题 | 前端固定 | - | 是 | 是 | 不读取 CMS |
| Coming Soon 说明 | 前端固定 | - | 是 | 是 | 不读取 CMS |
| 返回首页 / 浏览其他内容 | 前端 route | - | 是 | 是 | 不读取 CMS |

**前端可不展示**

| 字段 | 判断 |
| --- | --- |
| `studyProgram` where `programType == "international-study"` | Phase 1 comingSoon，不展示 |

## 5. 活动

### 5.1 线下体验列表页

**Route**

- `/zh/events/offline-experience`
- `/en/events/offline-experience`

**读取 schema**

- `event`

**查询条件**

- `eventType == "offline-experience"`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Hero 推荐活动 | `event` | `titleZh`, `titleEn`, `coverImage`, `slug` | 可展示 | 否 | 高保真顶部像活动轮播 |
| Hero CTA | - | - | 是 | 否 | 建议前端固定或 CMS 补充 |
| 活动列表 | `event` | documents by `eventType` ordered by `order` | 是 | 是 | 高保真 3 列卡片 |
| 活动标题 | `event` | `titleZh`, `titleEn` | 是 | 是 | 卡片标题 |
| 活动海报 | `event` | `posterImage` | 是 | 否 | poster 不裁切 |
| 活动简介 | `event` | `contentZh/En` or `courseIntroZh/En` | 是 | 否 | 二选一作为卡片摘要 |
| 主持 / 师资 | `event` | `facultyZh`, `facultyEn` | 是 | 否 | 当前为文本 |
| 详情入口 | `event` | `slug` | 不直接展示 | 是 | 卡片点击使用 |

**建议补充字段**

| 建议字段 | 原因 |
| --- | --- |
| `heroCtas[]` | 高保真 hero 有“了解详情”“预约体验” |
| `eventTags[]` | `events-overview` 高保真卡片有“手作工坊”“热门推荐”等标签 |
| `structuredPrice` | 若卡片必须显示 `¥380`，当前 `feesZh/En` 是文本，不适合统一价格 |
| `openingTimeZh/En` | `events-overview` 卡片有开放时间 |

**前端可不展示**

| 字段 | 判断 |
| --- | --- |
| `teachingSpaceZh/En`, `feesZh/En`, `outcomesZh/En`, `galleryImages` | 列表页不展示或只在详情展示 |
| `eventType`, `order` | 筛选 / 排序字段，不直接展示 |
| `date`, `locationZh/En`, `isFeatured` | 旧隐藏字段，不强制展示 |

### 5.2 线下体验详情页

**Route**

- `/zh/events/offline-experience/[slug]`
- `/en/events/offline-experience/[slug]`

**读取 schema**

- `event`

**查询条件**

- `slug.current == $slug`
- 建议校验 `eventType == "offline-experience"`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 详情标题 / hero | `event` | `titleZh`, `titleEn`, `coverImage` | 是 | 是 | 无专门 Figma，可参考课程详情 |
| 活动内容 | `event` | `contentZh`, `contentEn` | 是 | 是 | 活动详情核心正文 |
| 活动介绍 | `event` | `courseIntroZh`, `courseIntroEn` | 可展示 | 否 | 视详情设计 |
| 教学空间 | `event` | `teachingSpaceZh`, `teachingSpaceEn` | 可展示 | 否 | 视详情设计 |
| 费用 | `event` | `feesZh`, `feesEn` | 可展示 | 否 | 视详情设计 |
| 师资 / 主持 | `event` | `facultyZh`, `facultyEn` | 可展示 | 否 | 视详情设计 |
| 成果 | `event` | `outcomesZh`, `outcomesEn` | 可展示 | 否 | 视详情设计 |
| 图片 gallery | `event` | `galleryImages` | 可展示 | 否 | schema 支持 |

### 5.3 艺术公开课 Coming Soon

**Route**

- `/zh/events/open-class`
- `/en/events/open-class`

**读取 schema**

- Phase 1 不读取 Sanity 内容

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Coming Soon | 前端固定 | - | 是 | 是 | 不读取 CMS |

**前端可不展示**

| 字段 | 判断 |
| --- | --- |
| `event` where `eventType == "open-class"` | Phase 1 comingSoon，不展示 |

### 5.4 活动 Coming Soon

**Route**

- `/zh/events/activity`
- `/en/events/activity`

**读取 schema**

- Phase 1 不读取 Sanity 内容

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Coming Soon | 前端固定 | - | 是 | 是 | 不读取 CMS |

**前端可不展示**

| 字段 | 判断 |
| --- | --- |
| `event` where `eventType == "activity"` | Phase 1 comingSoon，不展示 |

## 6. 艺术创作

### 6.1 艺术创作列表页

**Routes**

- `/zh/art-creation/glass-art`, `/en/art-creation/glass-art`
- `/zh/art-creation/installation-art`, `/en/art-creation/installation-art`
- `/zh/art-creation/public-art`, `/en/art-creation/public-art`
- `/zh/art-creation/sculpture-art`, `/en/art-creation/sculpture-art`

**读取 schema**

- `artWork`

**查询条件**

- `workType == "glass-art"`
- `workType == "installation-art"`
- `workType == "public-art"`
- `workType == "sculpture-art"`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 页面标题 | 前端配置 / `artWork.workType` | fixed title by route | 是 | 是 | 不需要 CMS 单页配置 |
| 作品列表 | `artWork` | documents by `workType` ordered by `order` | 是 | 是 | 高保真 4 列深色卡 |
| 作品名称 | `artWork` | `titleZh`, `titleEn` | 是 | 是 | 允许 En fallback Zh |
| 作品图片 | `artWork` | `images[]`, usually `images[0]` for card | 是 | 否 | 无图显示 placeholder |
| 作品尺寸 | `artWork` | `size` | 可展示 | 否 | 高保真列表未明确展示，详情必须支持 |
| 描述话语 | `artWork` | `descriptionZh`, `descriptionEn` | 前端可不展示 | 否 | 列表页可不展示，详情页展示 |
| 详情入口 | `artWork` | `slug` | 不直接展示 | 是 | 卡片点击使用 |

**artWork 前端展示限制**

| 内容 | 是否展示 | 说明 |
| --- | --- | --- |
| 作品名称 | 是 | `titleZh`, `titleEn` |
| 尺寸 | 是 | `size` |
| 数量不一的图片 | 是 | `images[]` |
| 描述话语 | 是 | `descriptionZh`, `descriptionEn` |
| 作者 | 不展示 | 高保真曾出现，但不符合已确认 artWork 限制 |
| 年份 | 不展示 | 高保真曾出现，但不符合已确认 artWork 限制 |
| 材质 | 不展示 | 不在当前 artWork 允许展示范围 |
| 编号 | 不展示或前端序号 | 不建议新增为 artWork 展示字段 |
| 价格 | 不展示 | 价格应由 `product` 承载，不属于 `artWork` |
| 收藏信息 | 不展示 | 不在当前 artWork 允许展示范围 |

**后台管理字段**

| 字段 | 判断 |
| --- | --- |
| `workType` | 筛选字段，可在卡片上作为分类展示；不是详情核心内容 |
| `order` | 排序，不直接展示 |

### 6.2 艺术创作详情页

**Routes**

- `/zh/art-creation/glass-art/[slug]`, `/en/art-creation/glass-art/[slug]`
- `/zh/art-creation/installation-art/[slug]`, `/en/art-creation/installation-art/[slug]`
- `/zh/art-creation/public-art/[slug]`, `/en/art-creation/public-art/[slug]`
- `/zh/art-creation/sculpture-art/[slug]`, `/en/art-creation/sculpture-art/[slug]`

**读取 schema**

- `artWork`

**查询条件**

- `slug.current == $slug`
- 建议校验当前 route 对应 `workType`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 作品名称 | `artWork` | `titleZh`, `titleEn` | 是 | 是 | 详情标题 |
| 尺寸 | `artWork` | `size` | 是 | 否 | 高保真展示 |
| 描述话语 | `artWork` | `descriptionZh`, `descriptionEn` | 是 | 否 | 高保真展示 |
| 图片 gallery | `artWork` | `images[]` | 是 | 是 | 数量不固定，保持原比例 |
| 返回父栏目 | 前端 route | - | 是 | 是 | 不来自 CMS |

**不建议补充到 artWork 的高保真差异**

| 高保真出现内容 | 判断 |
| --- | --- |
| 作者 | 不建议补充到 `artWork`，已确认前端不展示 |
| 创作年份 | 不建议补充到 `artWork`，已确认前端不展示 |
| 价格 | 不建议补充到 `artWork`，应使用 `product` |
| 编号 | 不建议作为 `artWork` 必需字段 |

## 7. 商店

### 7.1 商店总览页

**Route**

- `/zh/shop`
- `/en/shop`

**读取 schema**

- `product`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 商品一级 tabs | `product` | `productType` | 是 | 是 | `available-artworks`, `art-derivatives`, `cultural-products` |
| 衍生品二级 tabs | `product` | `derivativeCategory` | 是 | 否 | 仅 `art-derivatives` 使用 |
| 商品列表 | `product` | documents ordered by `order` | 是 | 是 | 可按 tabs 过滤 |
| 商品标题 | `product` | `titleZh`, `titleEn` | 是 | 是 | 卡片标题 |
| 商品图片 | `product` | `coverImage`, `images[]` | 是 | 否 | 优先 `coverImage`，无则 `images[0]` |
| 商品价格 | `product` | `price` | 是 | 否 | 高保真列表展示价格 |
| 商品分类 | `product` | `productType`, `derivativeCategory` | 是 | 是/否 | 分类标签或 tabs |
| 详情入口 | `product` | `slug` | 不直接展示 | 是 | 点击进入详情 |

**建议补充字段**

| 建议字段 | 原因 |
| --- | --- |
| `displayCode` | 高保真卡片显示类似“01”；也可以前端用列表序号，不一定需要 CMS |

**前端可不展示**

| 字段 | 判断 |
| --- | --- |
| `descriptionZh/En`, `detailZh/En`, `size`, `stockStatus` | 列表页不展示 |
| `order` | 排序，不直接展示 |
| `materialZh/En` | 旧隐藏字段，不展示 |

### 7.2 商品详情：available-artworks

**Route**

- `/zh/shop/[slug]`
- `/en/shop/[slug]`

**条件**

- `productType == "available-artworks"`

**读取 schema**

- `product`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 商品标题 | `product` | `titleZh`, `titleEn` | 是 | 是 | 中文标题 + 英文副标题 |
| 商品 gallery | `product` | `images[]`, `coverImage` | 是 | 是 | 左侧多图 |
| 尺寸 | `product` | `size` | 是 | 否 | 信息卡展示 |
| 商品描述 | `product` | `descriptionZh`, `descriptionEn`, `detailZh`, `detailEn` | 是 | 否 | 可按摘要/详情分区 |
| 价格 | `product` | `price` | 是 | 否 | 高保真展示价格 |
| 商品类型 | `product` | `productType` | 用于模板选择 | 是 | 不一定直接展示 |
| 返回商店 | 前端 route | - | 是 | 是 | 不来自 CMS |

**建议补充字段**

| 建议字段 | 原因 |
| --- | --- |
| `artist` reference to `artist` 或 `artistNameZh/En` | 高保真右侧信息卡展示艺术家 |
| `relatedProducts[]` | 高保真展示相关作品 |
| `displayCode` | 高保真展示编号/分类样式 |

**前端可不展示**

| 字段 | 判断 |
| --- | --- |
| `stockStatus` | 高保真未明显展示 |
| `derivativeCategory` | 不适用于 available artwork |

### 7.3 商品详情：art-derivatives

**Route**

- `/zh/shop/[slug]`
- `/en/shop/[slug]`

**条件**

- `productType == "art-derivatives"`

**读取 schema**

- `product`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 商品类型标签 | `product` | `productType` | 是 | 是 | 高保真显示艺术衍生品 |
| 商品标题 | `product` | `titleZh`, `titleEn` | 是 | 是 | 中文标题 + 英文副标题 |
| 尺寸 | `product` | `size` | 是 | 否 | 高保真展示 |
| 商品描述 | `product` | `descriptionZh`, `descriptionEn`, `detailZh`, `detailEn` | 是 | 否 | 单栏文字 |
| 商品图片 | `product` | `images[]`, `coverImage` | 是 | 是 | 单栏大图 |
| 衍生品分类 | `product` | `derivativeCategory` | 前端可不展示 | 否 | 用于列表筛选，高保真详情未明显展示 |
| 返回商店 | 前端 route | - | 是 | 是 | 不来自 CMS |

**前端可不展示**

| 字段 | 判断 |
| --- | --- |
| `price` | 高保真 art-derivatives 详情未展示 |
| `stockStatus` | 高保真未展示 |

### 7.4 商品详情：cultural-products

**Route**

- `/zh/shop/[slug]`
- `/en/shop/[slug]`

**条件**

- `productType == "cultural-products"`

**读取 schema**

- `product`

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 顶部 hero / slider | `product` | `coverImage`, `images[]` | 是 | 否 | 高保真顶部大 hero |
| 商品标题 | `product` | `titleZh`, `titleEn` | 是 | 是 | 高保真正文标题 |
| 正文说明 | `product` | `descriptionZh`, `descriptionEn`, `detailZh`, `detailEn` | 是 | 否 | 高保真长段文字 |
| 相关作品卡片 | `product` | related product `coverImage`, `images[]`, `titleZh/En` | 可展示 | 否 | 需要来源策略 |
| 商品类型 | `product` | `productType` | 用于模板选择 | 是 | 不一定直接展示 |

**建议补充字段**

| 建议字段 | 原因 |
| --- | --- |
| `designerZh`, `designerEn` | 高保真文创详情展示设计师 |
| `relatedProducts[]` | 高保真展示相关作品 |
| `heroSlides[]` | 如果 hero 需要多图轮播和指示器 |

**前端可不展示**

| 字段 | 判断 |
| --- | --- |
| `price` | 高保真 cultural-products 详情未展示 |
| `size` | 高保真未展示 |
| `stockStatus` | 高保真未展示 |
| `derivativeCategory` | 不适用于 cultural products |

## 8. Coming Soon 页面

**Routes**

- `/zh/residency/artists`, `/en/residency/artists`
- `/zh/residency/application`, `/en/residency/application`
- `/zh/study/international-study`, `/en/study/international-study`
- `/zh/study/international-study/[slug]`, `/en/study/international-study/[slug]`
- `/zh/events/open-class`, `/en/events/open-class`
- `/zh/events/activity`, `/en/events/activity`

**读取 schema**

- Phase 1 不读取 Sanity 内容

| 模块 | 读取 schema | 字段 | 前端展示 | 必须 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Coming Soon 标题 | 前端固定 | - | 是 | 是 | 中文：该内容暂未开放 |
| Coming Soon 说明 | 前端固定 | - | 是 | 是 | 中文：敬请期待，更多精彩内容正在准备中。 |
| 按钮 | 前端 route | - | 是 | 是 | 返回首页、浏览其他内容 |

## 9. 建议补充字段汇总

这些字段只是在 CMS 后续完善时建议考虑；本次不修改 schema。

| Schema | 建议补充字段 | 来源页面 | 原因 |
| --- | --- | --- | --- |
| `siteSettings` 或 `aboutPage` | `mapImage` | 联系我们 | 高保真展示路线地图 |
| `siteSettings` | `openingHoursZh`, `openingHoursEn` | 联系我们 | 高保真展示开放时间 |
| `homePage` | `heroCtas[]` | 首页 | Hero 有两个 CTA |
| `homePage` | `heroSlides[]` | 首页 | 如果实现真实轮播 |
| `homePage` | `introCards[]` | 首页 | 高保真显示两张简介卡 |
| `studyProgram` | `programStatus` / `programGroup` | 国际大师班列表 | 精选课程 / 往期课程分组 |
| `studyProgram` | `hostZh`, `hostEn` 或教师引用 | 国际大师班列表/详情 | 学术主持需要结构化展示 |
| `studyProgram` | `courseSchedule[]` | 国际大师班详情 | 多段课程设置 |
| `studyProgram` | `teachers[]` | 国际大师班详情 | 授课教师团队结构化 |
| `studyProgram` | `admissionAudienceZh/En` | 国际大师班详情 | 招生对象 |
| `studyProgram` | `academicInfoZh/En` | 国际大师班详情 | 教务信息 |
| `studyProgram` | `accommodationZh/En` | 国际大师班详情 | 食宿及其他 |
| `studyProgram` | `certificateZh/En` | 国际大师班详情 | 结业证书 |
| `studyProgram` | `registrationMethodZh/En` | 国际大师班详情 | 报名及缴费方式 |
| `studyProgram` | `relatedPrograms[]` | 国际大师班详情 | 右侧推荐课程 |
| `event` | `heroCtas[]` | 线下体验列表 | Hero CTA |
| `event` | `eventTags[]` | 活动卡片 | 手作工坊、热门推荐等标签 |
| `event` | `structuredPrice` | 活动卡片 | 卡片价格展示 |
| `event` | `openingTimeZh/En` | 活动卡片 | 开放时间 |
| `product` | `displayCode` | 商店列表/详情 | 高保真编号 |
| `product` | `artist` 或 `artistNameZh/En` | 在售艺术作品详情 | 艺术家信息卡 |
| `product` | `designerZh`, `designerEn` | 文创产品详情 | 设计师 |
| `product` | `relatedProducts[]` | 商品详情 | 相关作品 |
| `product` | `heroSlides[]` | 文创产品详情 | Hero 轮播 |

## 10. 不建议为 artWork 补充的字段

根据当前已确认规则，`artWork` 前端只展示作品名称、尺寸、数量不一的图片、描述话语。  
以下高保真中曾出现的内容不建议进入 `artWork` 前端展示，也不建议作为本阶段 `artWork` schema 补充项。

| 字段/内容 | 原因 |
| --- | --- |
| 作者 | 已超出 artWork 前端展示范围 |
| 年份 | 已超出 artWork 前端展示范围 |
| 材质 | 已超出 artWork 前端展示范围 |
| 编号 | 可用前端序号处理，不应成为必需内容 |
| 价格 | 应由 `product` 承载 |
| 收藏信息 | 已超出 artWork 前端展示范围 |


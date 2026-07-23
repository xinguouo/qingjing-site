# PAGE_CONTENT_STRUCTURE.md

本文档根据 `public/figma-reference` 中的高保真页面整理页面内容结构。  
原则：页面内容构成以高保真图片里实际出现的内容为准，不凭空新增模块；如果 Sanity 已有字段但高保真未展示，标记为“前端可不展示”；如果高保真展示了内容但当前后台没有字段，标记为“CMS 待补充”。

## 全局页面外壳

所有 desktop 高保真图都出现以下全局结构。它们不是每个页面的业务内容，但实现页面时需要统一复用。

| 模块 | 内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| Desktop sidebar 品牌区 | `siteNameZh`, `siteNameEn`, `logo` | `siteSettings` | 是 | sidebar 视觉以 `sidebar-desktop.png` 为准 |
| Desktop sidebar 导航 | 导航中文/英文名、route、active 状态 | `src/config/navigation.ts` | 是 | 不来自 Sanity；详情页不出现在导航里 |
| Topbar 页面名 / breadcrumb | 当前页面标题、父级标题 | 页面配置 / route | 是 | 部分 Figma breadcrumb 有错误，实施时以实际 route 为准 |
| Search bar | placeholder 文案 | 前端固定 | 否 | 高保真出现“搜索页面、活动、艺术家...” |
| 语言按钮 / 主题按钮 | 当前 locale、主题状态 | 前端状态 | 否 | 不来自 Sanity |
| Footer copyright | `footerTextZh`, `footerTextEn` 或固定年份文案 | `siteSettings` | 否 | 高保真 sidebar 底部出现 copyright |

## 1. 首页

**Route**

- `/zh`
- `/en`

**Figma**

- `home-desktop.png`

### 页面显示模块

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| Hero 标题 | `heroTitleZh`, `heroTitleEn` | `homePage` | 是 | 高保真显示大标题“清镜玻璃花园” |
| Hero 副标题 | `heroSubtitleZh`, `heroSubtitleEn` | `homePage` | 否 | 高保真 hero 区有大面积内容区，但副标题不明显 |
| Hero 图片 / 轮播背景 | `heroImage` | `homePage` | 否 | 高保真为灰色大图/轮播占位 |
| Hero CTA | 了解工作室、预约体验 | CMS 待补充 | 否 | 当前无 CTA 文案/链接字段，也可前端固定 |
| Hero 轮播指示器 | 当前 slide / slide 数量 | CMS 待补充 | 否 | 如果只使用单张 `heroImage`，可前端不展示轮播 |
| 简介区卡片 | `introTitleZh`, `introTitleEn`, `introTextZh`, `introTextEn` | `homePage` | 否 | 高保真显示两张简介卡；当前 schema 只能支持一组 intro，第二张 CMS 待补充 |
| 推荐课程 | `featuredStudyPrograms[]` -> `studyProgram.title*`, `posterImage`, `courseIntro*`, `faculty*`, `slug` | `homePage`, `studyProgram` | 否 | 高保真显示“国际大师班”卡片区 |
| 推荐活动 | `featuredEvents[]` -> `event.title*`, `posterImage`, `content*`/`courseIntro*`, `faculty*`, `slug` | `homePage`, `event` | 否 | 高保真显示“最近活动”卡片区 |

### 后台有字段但高保真未明确展示

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `featuredArtWorks` | `homePage` | 前端可不展示，或等待更完整首页高保真确认 |
| `featuredProducts` | `homePage` | 前端可不展示，或等待更完整首页高保真确认 |

## 2. 关于我们

### 2.1 使命愿景页

**Route**

- `/zh/about/mission-vision`
- `/en/about/mission-vision`

**Figma**

- `about-mission-vision-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 页面标题区 | `missionTitleZh`, `missionTitleEn` | `aboutPage` | 是 | 高保真显示 eyebrow `MISSION & VISION` + 中文标题 |
| 分割线 | 无 | 前端固定 | 否 | 视觉元素 |
| 大图卡片 | `missionImage` | `aboutPage` | 否 | 高保真显示大横图区域 |
| 使命愿景正文 | `missionTextZh`, `missionTextEn` | `aboutPage` | 是 | 高保真显示中英文正文 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `teamIntroZh`, `teamIntroEn` | `aboutPage` | 本页不展示 |
| `contactTitleZh`, `contactTitleEn`, `contactTextZh`, `contactTextEn` | `aboutPage` | 本页不展示 |

### 2.2 团队介绍页

**Route**

- `/zh/about/team`
- `/en/about/team`

**Figma**

- `about-team-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 页面标题区 | 页面固定标题；可辅以 `teamIntroZh`, `teamIntroEn` | `aboutPage` / 前端配置 | 是 | 高保真显示 `OUR TEAM` + 团队介绍 |
| 团队成员网格 | `teamMember[]` | `teamMember` | 是 | 高保真为 4 列人员卡 |
| 成员肖像 | `portrait` | `teamMember` | 否 | 无图片时需要 placeholder |
| 成员姓名 | `nameZh`, `nameEn` | `teamMember` | 是 | 卡片中显示 |
| 成员角色 | `roleZh`, `roleEn` | `teamMember` | 否 | 卡片中显示“空间主理人”等 |
| 成员简介 | `bioZh`, `bioEn` | `teamMember` | 否 | 卡片中显示短简介 |
| 进入艺术家详情 | `linkedArtist` -> `artist.slug` | `teamMember`, `artist` | 否 | 仅有关联艺术家时可点击 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `order` | `teamMember` | 前端用于排序，不直接展示 |

### 2.3 艺术家个人介绍页

**Route**

- `/zh/about/artists/[slug]`
- `/en/about/artists/[slug]`

**Figma**

- `about-artist-profile-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 页面标题区 | 页面固定标题 / breadcrumb | 前端配置 | 是 | 高保真显示“团队介绍 | 艺术家介绍” |
| 艺术家头像 | `portrait` | `artist` | 否 | 左侧大图 |
| 艺术家姓名 | `nameZh`, `nameEn` | `artist` | 是 | 信息卡主标题 |
| 艺术家头衔 | `titleZh`, `titleEn` | `artist` | 否 | 信息卡中显示 |
| 艺术家简介 / 履历 | `bioZh`, `bioEn`, `educationExperienceZh`, `educationExperienceEn` | `artist` | 否 | 高保真信息卡中为多行履历文字 |
| 荣誉和收藏 | `honorsZh`, `honorsEn` | `artist` | 否 | 独立横线分区 |
| 出版 | `publicationsZh`, `publicationsEn` | `artist` | 否 | 独立横线分区 |
| 近期展览 | `exhibitionsZh`, `exhibitionsEn` | `artist` | 否 | 独立横线分区 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `isTeamArtist`, `isResidentArtist` | `artist` | 用于筛选，不直接展示 |
| `order` | `artist` | 用于排序，不直接展示 |

### 2.4 联系我们页

**Route**

- `/zh/about/contact`
- `/en/about/contact`

**Figma**

- `about-contact-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 页面标题区 | `contactTitleZh`, `contactTitleEn` 或页面固定标题 | `aboutPage` | 是 | 高保真显示 `CONTACT` + 联系我们 |
| 地址卡片 | `addressZh`, `addressEn` | `siteSettings` | 是 | 高保真显示地址 |
| 路线地图图片 | 地图/路线图 image | CMS 待补充 | 否 | 当前无 map image 字段 |
| 电话卡片 | `phone` | `siteSettings` | 否 | 高保真显示电话 |
| 邮件卡片 | `email` | `siteSettings` | 否 | 高保真显示邮箱 |
| 开放时间卡片 | opening hours | CMS 待补充 | 否 | 当前无开放时间字段 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `contactTextZh`, `contactTextEn` | `aboutPage` | 高保真未明显展示长文，前端可不展示 |
| `socialLinks` | `siteSettings` | 高保真未展示，前端可不展示 |

## 3. 研学

### 3.1 国际大师班列表页

**Route**

- `/zh/study/masterclass`
- `/en/study/masterclass`

**Figma**

- `study-masterclass-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 页面标题区 | 页面固定标题；`programType = international-masterclass` | `studyProgram` / 前端配置 | 是 | 高保真显示 `INTERNATIONAL MASTERCLASS` + 国际大师班 |
| 精选课程分区 | course group/status | CMS 待补充 | 否 | 当前无“精选课程”分组字段 |
| 往期课程分区 | course group/status | CMS 待补充 | 否 | 当前无“往期课程”分组字段 |
| 课程卡片列表 | `studyProgram[]` filtered by `programType` | `studyProgram` | 是 | 高保真为 3 列横向卡 |
| 海报图 | `posterImage` | `studyProgram` | 否 | 高保真卡片使用 poster，需完整展示 |
| 课程标题 | `titleZh`, `titleEn` | `studyProgram` | 是 | 卡片主标题 |
| 课程简介 | `courseIntroZh`, `courseIntroEn` | `studyProgram` | 否 | 卡片短文 |
| 学术主持 | `facultyZh`, `facultyEn` | `studyProgram` | 否 | 当前为文本字段；如需单独主持人字段则 CMS 待补充 |
| 详情入口 | `slug` | `studyProgram` | 是 | 点击卡片进入详情 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `coverImage` | `studyProgram` | 列表页未明确使用，前端可不展示 |
| `teachingSpaceZh/En`, `feesZh/En`, `outcomesZh/En`, `outcomeImages` | `studyProgram` | 列表页不展示 |

### 3.2 国际大师班详情页

**Route**

- `/zh/study/masterclass/[slug]`
- `/en/study/masterclass/[slug]`

**Figma**

- `study-masterclass-detail-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| Detail hero | `titleZh`, `titleEn`, `coverImage` | `studyProgram` | 是 | 高保真顶部为深色 hero + 大标题 |
| 课程介绍 | `courseIntroZh`, `courseIntroEn` | `studyProgram` | 是 | 正文主分区 |
| 学术主持 | `facultyZh`, `facultyEn` | `studyProgram` | 否 | 当前只能用文本承载 |
| 授课教师团队 | `facultyZh`, `facultyEn` 或教师列表 | `studyProgram` / CMS 待补充 | 否 | 若需要结构化教师卡，CMS 待补充 |
| 课程设置 | 结构化课程安排、每节标题、说明、图片 | CMS 待补充 | 否 | 当前 `outcomes/outcomeImages` 不能完整表达高保真多段课程设置 |
| 招生对象 | admission audience | CMS 待补充 | 否 | 高保真出现独立分区 |
| 教务信息 | academic/admin info | CMS 待补充 | 否 | 高保真出现独立分区 |
| 食宿及其他 | accommodation info | CMS 待补充 | 否 | 高保真出现独立分区 |
| 结业证书 | certificate info | CMS 待补充 | 否 | 高保真出现独立分区 |
| 报名及缴费方式 | `feesZh`, `feesEn` + registration method | `studyProgram` / CMS 待补充 | 否 | `fees` 只能部分支持 |
| 联系方式 | `phone`, `email`, `addressZh/En` | `siteSettings` | 否 | 可读取站点设置 |
| 右侧推荐/相关课程 | related programs | CMS 待补充 | 否 | 高保真右侧有侧栏卡片 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `programType` | `studyProgram` | 用于筛选和校验，不直接展示 |
| `order` | `studyProgram` | 用于排序，不直接展示 |

### 3.3 国际研学 Coming Soon

**Route**

- `/zh/study/international-study`
- `/en/study/international-study`
- `/zh/study/international-study/[slug]`
- `/en/study/international-study/[slug]`

**Figma**

- 无专门 Coming Soon 高保真

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| Coming Soon 标题 | 固定文案 | 前端固定 | 是 | 中文：该内容暂未开放；英文：This section is not available yet. |
| Coming Soon 说明 | 固定文案 | 前端固定 | 是 | 不读取 Sanity |
| 返回首页按钮 | locale route | 前端固定 | 是 | 不读取 Sanity |
| 浏览其他内容按钮 | route | 前端固定 | 是 | 不读取 Sanity |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `studyProgram` where `programType = international-study` | `studyProgram` | Phase 1 Coming Soon，不展示 CMS 内容 |

## 4. 活动

### 4.1 线下体验列表页

**Route**

- `/zh/events/offline-experience`
- `/en/events/offline-experience`

**Figma**

- `events-offline-experience-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| Hero 标题 | `titleZh`, `titleEn` 或页面固定 hero 内容 | `event` / CMS 待补充 | 否 | 高保真 hero 显示“玻璃马赛克”，像推荐活动轮播 |
| Hero 图片 / 轮播背景 | `coverImage` | `event` | 否 | 可使用精选线下体验活动 |
| Hero CTA | 了解详情、预约体验 | CMS 待补充 | 否 | 当前无 CTA 字段 |
| Hero 轮播指示器 | 当前 slide / slide 数量 | CMS 待补充 | 否 | 如果非轮播可不展示 |
| 页面标题区 | 页面固定标题；`eventType = offline-experience` | `event` / 前端配置 | 是 | 高保真显示 `ON-SITE EXPERIENCE EVENT` + 线下体验 |
| 活动卡片列表 | `event[]` filtered by `eventType` | `event` | 是 | 高保真为 3 列横向卡 |
| 活动 poster | `posterImage` | `event` | 否 | 需完整展示 |
| 活动标题 | `titleZh`, `titleEn` | `event` | 是 | 卡片主标题 |
| 活动简介 | `contentZh/En` 或 `courseIntroZh/En` | `event` | 否 | 卡片短文 |
| 学术主持 / 主办人 | `facultyZh`, `facultyEn` | `event` | 否 | 当前为文本字段 |
| 详情入口 | `slug` | `event` | 是 | 点击卡片进入详情 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `teachingSpaceZh/En`, `feesZh/En`, `outcomesZh/En`, `galleryImages` | `event` | 列表页不展示 |

### 4.2 线下体验详情页

**Route**

- `/zh/events/offline-experience/[slug]`
- `/en/events/offline-experience/[slug]`

**Figma**

- 无专门线下体验详情高保真；可参考 `study-masterclass-detail-desktop.png` 的长内容结构，但需要独立设计确认。

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 详情标题 / hero | `titleZh`, `titleEn`, `coverImage` | `event` | 是 | 参考课程详情结构 |
| 活动内容 | `contentZh`, `contentEn` | `event` | 是 | 活动详情核心正文 |
| 教学空间 | `teachingSpaceZh`, `teachingSpaceEn` | `event` | 否 | 高保真没有专门 event detail，但 schema 有 |
| 课程/活动介绍 | `courseIntroZh`, `courseIntroEn` | `event` | 否 | 视详情设计使用 |
| 费用 | `feesZh`, `feesEn` | `event` | 否 | 视详情设计使用 |
| 师资/主持 | `facultyZh`, `facultyEn` | `event` | 否 | 视详情设计使用 |
| 成果 | `outcomesZh`, `outcomesEn` | `event` | 否 | 视详情设计使用 |
| 图片 gallery | `galleryImages` | `event` | 否 | schema 支持 |

### 4.3 艺术公开课 Coming Soon

**Route**

- `/zh/events/open-class`
- `/en/events/open-class`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| Coming Soon 标题 | 固定文案 | 前端固定 | 是 | 不读取 Sanity |
| Coming Soon 说明 | 固定文案 | 前端固定 | 是 | 不读取 Sanity |
| 返回首页 / 浏览其他内容按钮 | route | 前端固定 | 是 | 不读取 Sanity |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `event` where `eventType = open-class` | `event` | Phase 1 Coming Soon，不展示 CMS 内容 |

### 4.4 活动 Coming Soon

**Route**

- `/zh/events/activity`
- `/en/events/activity`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| Coming Soon 标题 | 固定文案 | 前端固定 | 是 | 不读取 Sanity |
| Coming Soon 说明 | 固定文案 | 前端固定 | 是 | 不读取 Sanity |
| 返回首页 / 浏览其他内容按钮 | route | 前端固定 | 是 | 不读取 Sanity |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `event` where `eventType = activity` | `event` | Phase 1 Coming Soon，不展示 CMS 内容 |

## 5. 艺术创作

### 5.1 玻璃艺术列表页

**Route**

- `/zh/art-creation/glass-art`
- `/en/art-creation/glass-art`

**Figma**

- `art-creation-glass-art-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 页面标题区 | 页面固定标题；`workType = glass-art` | `artWork` / 前端配置 | 是 | 高保真显示 `GLASS ART` + 玻璃艺术 |
| 作品卡片列表 | `artWork[]` filtered by `workType` | `artWork` | 是 | 高保真为 4 列深色图片卡 |
| 作品图片 | `images[0]` | `artWork` | 否 | 图片为主视觉 |
| 作品名称 | `titleZh`, `titleEn` | `artWork` | 是 | 卡片显示 |
| 作品分类 | `workType` | `artWork` | 是 | 卡片出现类似分类文案 |
| 作品尺寸 | `size` | `artWork` | 否 | schema 有，列表图未明显展示 |
| 详情入口 | `slug` | `artWork` | 是 | 点击卡片进入详情 |
| 编号 | 序号或编号字段 | CMS 待补充 | 否 | 高保真显示“01”；可由前端列表序号生成 |
| 价格 | 价格字段 | CMS 待补充 | 否 | 高保真显示价格，但与当前 artWork 既定限制冲突；更建议不在 artWork 前端展示 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `descriptionZh`, `descriptionEn` | `artWork` | 列表页可不展示，详情页展示 |
| `order` | `artWork` | 排序用，不直接展示 |

### 5.2 玻璃艺术详情页

**Route**

- `/zh/art-creation/glass-art/[slug]`
- `/en/art-creation/glass-art/[slug]`

**Figma**

- `art-creation-glass-art-detail-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 返回父栏目 | 父级 route | 前端固定 | 是 | 高保真显示“← 玻璃艺术” |
| 作品标题 | `titleZh`, `titleEn` | `artWork` | 是 | 中文标题 + 英文副标题 |
| 尺寸 | `size` | `artWork` | 否 | 高保真展示 |
| 描述话语 | `descriptionZh`, `descriptionEn` | `artWork` | 否 | 高保真展示 |
| 图片 gallery | `images[]` | `artWork` | 是 | 纵向大图，保持原比例 |
| 作者 | author | CMS 待补充 | 否 | 高保真出现，但此前 artWork 明确不增加作者字段；前端应谨慎处理 |
| 创作年份 | year | CMS 待补充 | 否 | 高保真出现，但此前 artWork 明确不增加年份字段；前端应谨慎处理 |

### 5.3 装置艺术列表页

**Route**

- `/zh/art-creation/installation-art`
- `/en/art-creation/installation-art`

**Figma**

- 复用 `art-creation-glass-art-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 页面标题区 | 页面固定标题；`workType = installation-art` | `artWork` / 前端配置 | 是 | 复用玻璃艺术列表范式 |
| 作品卡片列表 | `artWork[]` filtered by `workType` | `artWork` | 是 | 4 列深色图片卡 |
| 图片、标题、分类、slug | `images[0]`, `titleZh/En`, `workType`, `slug` | `artWork` | 是 | 同玻璃艺术列表 |
| 编号 / 价格 | 序号或价格字段 | CMS 待补充 | 否 | 同玻璃艺术列表，价格与 artWork 限制冲突 |

### 5.4 装置艺术详情页

**Route**

- `/zh/art-creation/installation-art/[slug]`
- `/en/art-creation/installation-art/[slug]`

**Figma**

- 复用 `art-creation-glass-art-detail-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 返回父栏目 | 父级 route | 前端固定 | 是 | 返回装置艺术 |
| 作品标题、尺寸、描述、图片 gallery | `titleZh/En`, `size`, `descriptionZh/En`, `images[]` | `artWork` | 是 | 按 `workType = installation-art` 校验 |
| 作者 / 年份 | author, year | CMS 待补充 | 否 | 高保真出现但与 artWork 限制冲突 |

### 5.5 公共艺术列表页

**Route**

- `/zh/art-creation/public-art`
- `/en/art-creation/public-art`

**Figma**

- 复用 `art-creation-glass-art-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 页面标题区 | 页面固定标题；`workType = public-art` | `artWork` / 前端配置 | 是 | 复用玻璃艺术列表范式 |
| 作品卡片列表 | `artWork[]` filtered by `workType` | `artWork` | 是 | 4 列深色图片卡 |
| 图片、标题、分类、slug | `images[0]`, `titleZh/En`, `workType`, `slug` | `artWork` | 是 | 同玻璃艺术列表 |
| 编号 / 价格 | 序号或价格字段 | CMS 待补充 | 否 | 同玻璃艺术列表，价格与 artWork 限制冲突 |

### 5.6 公共艺术详情页

**Route**

- `/zh/art-creation/public-art/[slug]`
- `/en/art-creation/public-art/[slug]`

**Figma**

- 复用 `art-creation-glass-art-detail-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 返回父栏目 | 父级 route | 前端固定 | 是 | 返回公共艺术 |
| 作品标题、尺寸、描述、图片 gallery | `titleZh/En`, `size`, `descriptionZh/En`, `images[]` | `artWork` | 是 | 按 `workType = public-art` 校验 |
| 作者 / 年份 | author, year | CMS 待补充 | 否 | 高保真出现但与 artWork 限制冲突 |

### 5.7 雕塑艺术列表页

**Route**

- `/zh/art-creation/sculpture-art`
- `/en/art-creation/sculpture-art`

**Figma**

- 复用 `art-creation-glass-art-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 页面标题区 | 页面固定标题；`workType = sculpture-art` | `artWork` / 前端配置 | 是 | 复用玻璃艺术列表范式 |
| 作品卡片列表 | `artWork[]` filtered by `workType` | `artWork` | 是 | 4 列深色图片卡 |
| 图片、标题、分类、slug | `images[0]`, `titleZh/En`, `workType`, `slug` | `artWork` | 是 | 同玻璃艺术列表 |
| 编号 / 价格 | 序号或价格字段 | CMS 待补充 | 否 | 同玻璃艺术列表，价格与 artWork 限制冲突 |

### 5.8 雕塑艺术详情页

**Route**

- `/zh/art-creation/sculpture-art/[slug]`
- `/en/art-creation/sculpture-art/[slug]`

**Figma**

- 复用 `art-creation-glass-art-detail-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 返回父栏目 | 父级 route | 前端固定 | 是 | 返回雕塑艺术 |
| 作品标题、尺寸、描述、图片 gallery | `titleZh/En`, `size`, `descriptionZh/En`, `images[]` | `artWork` | 是 | 按 `workType = sculpture-art` 校验 |
| 作者 / 年份 | author, year | CMS 待补充 | 否 | 高保真出现但与 artWork 限制冲突 |

## 6. 商店

### 6.1 商店总览页

**Route**

- `/zh/shop`
- `/en/shop`

**Figma**

- `shop-overview-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 页面标题区 | 页面固定标题 | 前端配置 | 是 | 高保真显示 `SHOP` + 商店 |
| 商品一级分类 tabs | `productType` | `product` | 是 | 在售艺术商品 / 艺术衍生品 / 文创品 |
| 衍生品二级分类 tabs | `derivativeCategory` | `product` | 否 | 仅 `productType = art-derivatives` 时展示 |
| 商品卡片列表 | `product[]` | `product` | 是 | 高保真为 4 列深色商品卡 |
| 商品图片 | `coverImage` 或 `images[0]` | `product` | 否 | 图片主视觉 |
| 商品标题 | `titleZh`, `titleEn` | `product` | 是 | 卡片显示 |
| 商品价格 | `price` | `product` | 否 | 卡片显示 |
| 商品分类 | `productType`, `derivativeCategory` | `product` | 是 | 卡片可显示分类 |
| 商品编号 | 序号或编号字段 | CMS 待补充 | 否 | 高保真显示类似“01” |
| 详情入口 | `slug` | `product` | 是 | 点击卡片进入对应详情模板 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `descriptionZh/En`, `detailZh/En`, `size`, `stockStatus` | `product` | 列表页可不展示 |

### 6.2 在售艺术作品详情页

**Route**

- `/zh/shop/[slug]`
- `/en/shop/[slug]`
- 条件：`productType = available-artworks`

**Figma**

- `shop-available-artwork-detail-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 返回商店 | 父级 route | 前端固定 | 是 | 高保真显示“← 商店” |
| 左侧图片 gallery | `images[]`, `coverImage` | `product` | 是 | 多张大图纵向展示 |
| 商品编号 / 分类 | 编号字段；`productType` | `product` / CMS 待补充 | 否 | 编号 CMS 待补充或前端序号 |
| 商品标题 | `titleZh`, `titleEn` | `product` | 是 | 中文标题 + 英文/拉丁名样式 |
| 尺寸信息卡 | `size` | `product` | 否 | 高保真右侧信息卡 |
| 艺术家信息卡 | artist reference / artistName | CMS 待补充 | 否 | 高保真展示艺术家，当前 product 无字段 |
| 商品描述 | `descriptionZh`, `descriptionEn`, `detailZh`, `detailEn` | `product` | 否 | 高保真右侧正文 |
| 价格 | `price` | `product` | 否 | 高保真显示价格 |
| 相关作品 | related products | CMS 待补充 | 否 | 也可由前端自动查询同类商品 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `stockStatus` | `product` | 高保真未明显展示，前端可不展示 |
| `derivativeCategory` | `product` | 不适用于 `available-artworks` |

### 6.3 艺术衍生品详情页

**Route**

- `/zh/shop/[slug]`
- `/en/shop/[slug]`
- 条件：`productType = art-derivatives`

**Figma**

- `shop-art-derivative-detail-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 返回商店 | 父级 route | 前端固定 | 是 | 高保真显示“← 商店” |
| 商品类型标签 | `productType` | `product` | 是 | 高保真显示“艺术衍生品” |
| 商品标题 | `titleZh`, `titleEn` | `product` | 是 | 中文标题 + 英文副标题 |
| 尺寸 | `size` | `product` | 否 | 高保真展示 |
| 商品描述 | `descriptionZh`, `descriptionEn`, `detailZh`, `detailEn` | `product` | 否 | 高保真展示一段正文 |
| 大图 | `images[]` 或 `coverImage` | `product` | 是 | 单栏大图，保持原比例 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `price` | `product` | 高保真未展示，前端可不展示 |
| `stockStatus` | `product` | 高保真未展示，前端可不展示 |
| `derivativeCategory` | `product` | 高保真未明显展示，前端可不展示或仅用于列表筛选 |

### 6.4 文创产品详情页

**Route**

- `/zh/shop/[slug]`
- `/en/shop/[slug]`
- 条件：`productType = cultural-products`

**Figma**

- `shop-product-detail-desktop.png`

| 模块 | 需要的内容字段 | 对应 Sanity schema | 必须填写 | 备注 |
| --- | --- | --- | --- | --- |
| 顶部 hero / slider | `coverImage`, `images[]` | `product` | 否 | 高保真顶部为大灰色 hero/slider 区 |
| Hero 轮播指示器 | slide 状态 | CMS 待补充 | 否 | 如果不做轮播可前端不展示 |
| 商品标题 | `titleZh`, `titleEn` | `product` | 是 | 高保真显示“流动之光” |
| 设计师 | designer | CMS 待补充 | 否 | 当前 product 无设计师字段 |
| 正文说明 | `descriptionZh`, `descriptionEn`, `detailZh`, `detailEn` | `product` | 否 | 高保真展示长段文字 |
| 相关作品 | related products | CMS 待补充 | 否 | 也可由前端自动查询 |
| 相关作品卡片图片 | `coverImage` / `images[0]` from related products | `product` | 否 | 如果使用自动相关商品可支持 |
| 相关作品卡片标题 | `titleZh`, `titleEn` from related products | `product` | 否 | 如果使用自动相关商品可支持 |

**前端可不展示**

| 字段 | Schema | 判断 |
| --- | --- | --- |
| `price` | `product` | 高保真未展示，前端可不展示 |
| `size` | `product` | 高保真未展示，前端可不展示 |
| `stockStatus` | `product` | 高保真未展示，前端可不展示 |
| `derivativeCategory` | `product` | 不适用于 `cultural-products` |


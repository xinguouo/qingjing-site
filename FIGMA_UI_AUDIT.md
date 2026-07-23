# FIGMA_UI_AUDIT.md

本文件审计 `public/figma-reference` 中已导出的 Figma 高保真页面。  
这些图片是本项目真实 UI 范式，但图片之间存在若干不统一点。本文只记录图片中实际出现的内容，不新增页面内容，不修改页面代码、Sanity schema 或路由。

## 1. 已存在高保真图片

| 文件名 | 尺寸 | 对应页面 / route | 用法判断 |
| --- | --- | --- | --- |
| `sidebar-desktop.png` | 432 x 2140 | 全站 desktop sidebar | sidebar 唯一视觉基准 |
| `home-desktop.png` | 2670 x 4488 | `/zh`, `/en` | 首页直接范式 |
| `about-mission-vision-desktop.png` | 2671 x 1863 | `/zh/about/mission-vision`, `/en/about/mission-vision` | 使命愿景直接范式 |
| `about-team-desktop.png` | 2671 x 1863 | `/zh/about/team`, `/en/about/team` | 团队介绍直接范式 |
| `about-artist-profile-desktop.png` | 2670 x 3230 | `/zh/about/artists/[slug]`, `/en/about/artists/[slug]` | 艺术家详情直接范式 |
| `about-contact-desktop.png` | 2671 x 1863 | `/zh/about/contact`, `/en/about/contact` | 联系我们直接范式 |
| `study-masterclass-desktop.png` | 2671 x 1863 | `/zh/study/masterclass`, `/en/study/masterclass` | 国际大师班列表直接范式 |
| `study-masterclass-detail-desktop.png` | 2670 x 13572 | `/zh/study/masterclass/[slug]`, `/en/study/masterclass/[slug]` | 大师班详情直接范式；可作为国际研学详情变体 |
| `events-offline-experience-desktop.png` | 2671 x 2738 | `/zh/events/offline-experience`, `/en/events/offline-experience` | 线下体验直接范式 |
| `events-overview-desktop.png` | 2671 x 2738 | `/zh/events/activity`, `/en/events/activity` 或活动列表变体 | 有明显旧导航/错误 breadcrumb，仅可参考活动卡片局部 |
| `art-creation-glass-art-desktop.png` | 2670 x 2140 | `/zh/art-creation/glass-art`, `/en/art-creation/glass-art` | 玻璃艺术列表直接范式；装置/公共/雕塑艺术复用变体 |
| `art-creation-glass-art-detail-desktop.png` | 2671 x 2664 | `/zh/art-creation/glass-art/[slug]`, `/en/art-creation/glass-art/[slug]` | 艺术作品详情范式；装置/公共/雕塑艺术详情复用变体 |
| `shop-overview-desktop.png` | 2670 x 2140 | `/zh/shop`, `/en/shop` | 商店列表直接范式 |
| `shop-available-artwork-detail-desktop.png` | 2671 x 3120 | `/zh/shop/[slug]`, `/en/shop/[slug]` where `productType = available-artworks` | 在售艺术作品详情模板 |
| `shop-art-derivative-detail-desktop.png` | 2670 x 2140 | `/zh/shop/[slug]`, `/en/shop/[slug]` where `productType = art-derivatives` | 艺术衍生品详情模板 |
| `shop-product-detail-desktop.png` | 2671 x 2730 | `/zh/shop/[slug]`, `/en/shop/[slug]` where `productType = cultural-products` | 文创产品详情模板 |

## 2. 图片与页面 route 判断

### 直接使用范式

| 页面 | Zh route | En route | Figma 图片 |
| --- | --- | --- | --- |
| 首页 | `/zh` | `/en` | `home-desktop.png` |
| 使命愿景 | `/zh/about/mission-vision` | `/en/about/mission-vision` | `about-mission-vision-desktop.png` |
| 团队介绍 | `/zh/about/team` | `/en/about/team` | `about-team-desktop.png` |
| 艺术家个人介绍 | `/zh/about/artists/[slug]` | `/en/about/artists/[slug]` | `about-artist-profile-desktop.png` |
| 联系我们 | `/zh/about/contact` | `/en/about/contact` | `about-contact-desktop.png` |
| 国际大师班 | `/zh/study/masterclass` | `/en/study/masterclass` | `study-masterclass-desktop.png` |
| 国际大师班详情 | `/zh/study/masterclass/[slug]` | `/en/study/masterclass/[slug]` | `study-masterclass-detail-desktop.png` |
| 线下体验 | `/zh/events/offline-experience` | `/en/events/offline-experience` | `events-offline-experience-desktop.png` |
| 玻璃艺术 | `/zh/art-creation/glass-art` | `/en/art-creation/glass-art` | `art-creation-glass-art-desktop.png` |
| 玻璃艺术详情 | `/zh/art-creation/glass-art/[slug]` | `/en/art-creation/glass-art/[slug]` | `art-creation-glass-art-detail-desktop.png` |
| 商店 | `/zh/shop` | `/en/shop` | `shop-overview-desktop.png` |

### 复用变体

| 页面 | Route | 复用图片 | 变体规则 |
| --- | --- | --- | --- |
| 装置艺术 / 公共艺术 / 雕塑艺术列表 | `/zh/art-creation/*`, `/en/art-creation/*` | `art-creation-glass-art-desktop.png` | 替换标题、分类和内容，保留 4 列深色作品卡 |
| 装置艺术 / 公共艺术 / 雕塑艺术详情 | `/zh/art-creation/*/[slug]`, `/en/art-creation/*/[slug]` | `art-creation-glass-art-detail-desktop.png` | 替换作品内容，保留大留白和纵向 gallery |
| 国际研学 | `/zh/study/international-study`, `/en/study/international-study` | `study-masterclass-desktop.png` | Phase 1 ComingSoon；未来上线时复用课程列表 |
| 国际研学详情 | `/zh/study/international-study/[slug]`, `/en/study/international-study/[slug]` | `study-masterclass-detail-desktop.png` | Phase 1 ComingSoon；未来上线时复用课程详情 |
| 艺术公开课 / 活动 | `/zh/events/open-class`, `/zh/events/activity` and `/en/...` | `events-overview-desktop.png` | Phase 1 ComingSoon；该图存在旧导航和错误 breadcrumb，只能参考活动卡片局部 |
| 线下体验详情 | `/zh/events/offline-experience/[slug]`, `/en/events/offline-experience/[slug]` | 暂无专门 Figma | 可临时参考 `study-masterclass-detail-desktop.png` 的长内容分区，但需要独立确认 |

### 暂无 Figma 图片

| 页面 | Route | 当前判断 |
| --- | --- | --- |
| 驻地艺术家 | `/zh/residency/artists`, `/en/residency/artists` | Phase 1 ComingSoon，无专门 Figma |
| 驻地申请 | `/zh/residency/application`, `/en/residency/application` | Phase 1 ComingSoon，无专门 Figma |
| Coming Soon 页面 | 所有 comingSoon routes | 无高保真图片；只能沿用现有灰白极简规范 |
| Mobile 页面 | 所有 routes | 未发现 mobile 高保真图片；mobile 规则缺失，需要从 desktop 范式响应式推导 |

## 3. 重复出现的设计元素

### Sidebar

- `sidebar-desktop.png` 是唯一应采纳的 sidebar 视觉基准。
- 共同特征：432px 宽、左侧固定、白/浅灰背景、顶部品牌、分组标题、圆形 icon、active 胶囊背景、右侧 active 小圆点、底部 copyright。
- 多数页面图使用同一套 sidebar，但 `events-overview-desktop.png` 和 `shop-product-detail-desktop.png` 中出现旧栏目文案，例如“艺术项目”“艺术作品定制”“在线艺术作品”“文创产品”，与当前 SITE_STRUCTURE 不一致。
- 实施时 sidebar 文字必须来自 `src/config/navigation.ts`，不要从个别 Figma 图片中复制旧文案。

### Topbar

- 所有 desktop 图都有顶部横条。
- 左侧通常显示当前页面名或面包屑，例如“团队介绍”“团队介绍 | 艺术家介绍”“商店 | 商品详情”。
- 中央为圆角 search bar。
- 右侧为语言切换和主题按钮；部分图片额外出现调色盘按钮。
- 不统一：部分页面 breadcrumb 文案明显错误，例如 `events-overview-desktop.png` 顶部显示“商品详情”，`art-creation-glass-art-detail-desktop.png` 顶部显示“商店 | 商品详情”。

### Search Bar

- 位置：desktop 顶部居中。
- 形态：浅灰圆角胶囊，左侧搜索 icon，占位文案为“搜索页面、活动、艺术家...”。
- 尺寸在页面间基本一致，但横向位置受内容宽度影响略有差异。

### 页面标题区

- 常见结构：小号英文 uppercase eyebrow + 大号中文标题 + 下方细线。
- 出现页面：使命愿景、团队介绍、联系我们、国际大师班、玻璃艺术、商店。
- 不统一：首页和线下体验使用大 hero 标题；课程详情使用深色 hero 标题；商品详情根据类型使用完全不同标题结构。

### 卡片

- 灰白内容卡：使命愿景、联系信息、首页 intro 卡使用白底、细边框、轻阴影、大圆角。
- 人员卡：团队页使用 4 列，高图像区域，底部白色浮层显示姓名、角色、简介。
- 课程/活动横向卡：大师班和线下体验使用 3 列横向卡，左侧 poster，右侧标题/简介/主持人。
- 活动 overview 卡：4 列海报卡，显示标签、价格、开放时间、预约按钮。
- 艺术/商店深色卡：4 列，整卡图片为主，底部半透明深色信息浮层。
- 不统一：圆角、阴影、图片比例、卡片信息密度在不同模板中差异较大，应按页面类型分别抽象，不要强行合并为一个 Card。

### 图片区域

- 首页 hero 是大面积灰色占位/轮播区域。
- 使命愿景使用大横图置于白色大卡片内。
- 团队卡为竖向人物图区域。
- 课程/活动卡中的 poster 需要完整展示，不应裁切。
- 艺术/商品列表卡图片可铺满卡片，但应注意作品识别度。
- 艺术作品详情和艺术衍生品详情的大图应保持作品原比例和大留白。

### 按钮

- 首页和线下体验 hero 使用黑色主按钮 + 白色次按钮。
- 活动 overview 卡底部有“立即预约 ->”文本按钮。
- 其他页面按钮较少。
- 不统一：按钮半径、大小、是否带箭头、是否为胶囊样式尚未统一。

### 标签

- 活动 overview 卡有“手作工坊”“热门推荐”等标签。
- 商店列表有 productType tab：在售艺术商品 / 艺术衍生品 / 文创品。
- 商店列表有 derivativeCategory tab：器物 / 肖物 / 玩物 / 饰物 / 境物 / 包装。
- 艺术/商店深色卡上有“01 · 被子植物”一类编号/分类文案。

### 内容分区

- 艺术家详情使用横线分区标题：荣誉和收藏、出版、近期展览。
- 课程详情使用长页面分区：课程介绍、学术主持、授课教师团队、课程设置、招生对象、教务信息、食宿及其他、结业证书、报名及缴费方式、联系方式。
- 首页使用精选区块：国际大师班、最近活动等。
- 商店/商品详情根据商品类型差异很大。

### 详情页 Gallery

- 艺术作品详情：纵向大图 gallery，图片保持原比例，页面大留白。
- 在售艺术作品详情：左侧纵向多图 gallery，右侧 sticky-like 信息栏。
- 艺术衍生品详情：单栏图文，大图在标题信息下方。
- 文创产品详情：顶部大 hero/slider + 正文 + 相关作品。

### 商品详情模板

- `available-artworks`：左侧 gallery + 右侧商品信息、价格、相关作品。
- `art-derivatives`：单栏图文，更像艺术作品/衍生品展示页，未显示价格和购买区域。
- `cultural-products`：顶部 hero slider、正文说明、相关作品。
- 三类商品详情不能共用一套模板。

### Coming Soon 页面

- `public/figma-reference` 中没有 Coming Soon 高保真图片。
- 只能按既有规则延续灰白极简风格、AppShell、圆角卡片、细线边框、轻阴影。

## 4. 高保真中不统一的地方

| 项目 | 观察 | 审计判断 |
| --- | --- | --- |
| 字体大小 | 首页 hero、活动 hero、普通页面标题、商品详情标题差异明显 | 需要建立明确 typography token；页面类型可有差异，但同类页面应统一 |
| 标题层级 | 普通栏目页使用 eyebrow + H1 + divider；首页/线下体验使用 hero；详情页多种结构 | 需要按 `ListingPageHeader`、`HeroHeader`、`DetailHeader` 分开规范 |
| 页面左右边距 | 普通页面内容左起点约在 sidebar 后 90px；首页和 hero 类页面使用更宽内容区 | 需要统一 content container，不同 hero 可例外 |
| 卡片圆角 | 信息卡、人员卡、课程卡、深色商品卡圆角不同 | 应定义卡片类型，不要混用 |
| 图片比例 | poster、人员图、作品图、商品图、hero 图比例均不同 | 需要按组件定义比例；poster 必须 object-contain，作品图保持原比例 |
| 按钮样式 | 黑色主按钮、白色次按钮、文字箭头按钮、tab 下划线样式并存 | 需要定义 PrimaryButton、SecondaryButton、TextArrowButton、TabButton |
| Sidebar | 多数图接近一致，但部分图存在旧栏目文案或旧分组名 | 以 `sidebar-desktop.png` 和 `src/config/navigation.ts` 为准 |
| 页面顶部留白 | 普通标题页顶部留白较一致；hero 类页面顶部大块灰色区域；详情页差异大 | 需要按页面类型定义 top spacing |
| Grid 栏数 | Team 4 列，Study/Event 横向卡 3 列，Art/Shop 4 列，Activity overview 4 列 | 需要按卡片类型固定 desktop 栏数；mobile 未提供 |
| Mobile 适配 | 未发现 mobile 高保真图片 | mobile 规则缺失；需要从文档规则推导：顶部导航 + drawer，不显示完整 sidebar |
| Topbar breadcrumb | 部分图片 breadcrumb 错误或沿用旧文案 | 实施时必须由 route/页面配置生成，不能照抄错误图层 |
| 调色盘按钮 | 只在部分图出现 | 是否为全站功能未统一，需要产品确认；不可默认全站新增 |

## 5. 页面内容与 CMS 字段审计

### 首页

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| 首页主标题“清镜玻璃花园” | `homePage.heroTitleZh/En`, `siteSettings.siteNameZh/En` | 可支持 |
| hero 副标题/轮播图 | `homePage.heroSubtitleZh/En`, `homePage.heroImage` | 可支持；图片中当前是灰色占位 |
| CTA：了解工作室、预约体验 | 无专门 CTA 字段 | CMS 可能需要补充字段，或前端固定文案 |
| 首页 intro 两张卡 | `introTitleZh/En`, `introTextZh/En` 只能支持一组 intro | Figma 展示两张卡；CMS 可能需要补充多 intro 卡字段 |
| 国际大师班精选 | `featuredStudyPrograms` | 可支持 |
| 最近活动精选 | `featuredEvents` | 可支持 |
| featuredArtWorks / featuredProducts | CMS 有字段，但截图首屏未明显展示 | 可能不需要前端首屏展示，或在更下方展示 |

### 使命愿景

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| 英文 eyebrow、中文标题 | `aboutPage.missionTitleZh/En` | 可支持 |
| 大图 | `aboutPage.missionImage` | 可支持 |
| 中英文使命正文 | `missionTextZh/En` | 可支持 |
| 其他 about 字段 | `teamIntroZh/En`, `contactTitleZh/En`, `contactTextZh/En` | 本页可能不需要前端展示 |

### 团队介绍

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| 团队页标题 | 可由页面固定标题或 `aboutPage.teamIntroZh/En` 辅助 | 可支持 |
| 人员姓名 | `teamMember.nameZh/En` | 可支持 |
| 人员角色 | `teamMember.roleZh/En` | 可支持 |
| 人员简介 | `teamMember.bioZh/En` | 可支持 |
| 人员肖像 | `teamMember.portrait` | 可支持 |
| 点击进入艺术家详情 | `teamMember.linkedArtist` | 可支持 |

### 艺术家详情

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| 艺术家姓名、头衔、生平简介 | `artist.nameZh/En`, `titleZh/En`, `bioZh/En` | 可支持 |
| 肖像 | `artist.portrait` | 可支持 |
| 教育/履历长文本 | `educationExperienceZh/En` | 可支持 |
| 荣誉和收藏 | `honorsZh/En` | 可支持 |
| 出版 | `publicationsZh/En` | 可支持 |
| 近期展览 | `exhibitionsZh/En` | 可支持 |
| `isTeamArtist`, `isResidentArtist`, `order` | CMS 管理字段 | 可能不需要前端展示 |

### 联系我们

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| 地址 | `siteSettings.addressZh/En` | 可支持 |
| 电话 | `siteSettings.phone` | 可支持 |
| 邮件 | `siteSettings.email` | 可支持 |
| 地图图片/路线图 | 无专门 map image 字段 | CMS 可能需要补充字段 |
| 开放时间 | 无专门 openingHours 字段 | CMS 可能需要补充字段 |
| 联系页说明文字 | `aboutPage.contactTextZh/En` | 可支持，但截图中未明显展示长文 |
| socialLinks | `siteSettings.socialLinks` | 截图中未展示，可能不需要前端展示 |

### 国际大师班列表

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| 课程标题 | `studyProgram.titleZh/En` | 可支持 |
| 课程 slug | `studyProgram.slug` | 路由支持 |
| poster 图片 | `studyProgram.posterImage` | 可支持；前端应 object-contain |
| 简介 | `studyProgram.courseIntroZh/En` | 可支持 |
| 学术主持/教师名 | `studyProgram.facultyZh/En` | 可支持为文本，但没有单独 host 字段 |
| 精选课程 / 往期课程分组 | 无明确字段 | CMS 可能需要补充字段，或按 order/业务规则分组 |
| `coverImage`, `teachingSpace`, `fees`, `outcomes`, `outcomeImages` | CMS 有字段 | 列表页可能不需要全部展示 |

### 国际大师班详情

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| 详情 hero 标题 | `studyProgram.titleZh/En`, `coverImage` | 可支持 |
| 课程介绍 | `courseIntroZh/En` | 可支持 |
| 学术主持 / 授课教师团队 | `facultyZh/En` | 可支持为文本 |
| 课程设置、多段课程安排、每段图片 | 当前只有 `outcomesZh/En`, `outcomeImages` | CMS 可能需要补充结构化课程安排字段 |
| 招生对象 | 无专门字段 | CMS 可能需要补充字段 |
| 教务信息 | 无专门字段 | CMS 可能需要补充字段 |
| 食宿及其他 | 无专门字段 | CMS 可能需要补充字段 |
| 结业证书 | 无专门字段 | CMS 可能需要补充字段 |
| 报名及缴费方式 | `feesZh/En` 只能部分支持 | CMS 可能需要补充报名方式字段 |
| 联系方式 | 可从 `siteSettings` 读取 | 可支持 |
| 右侧推荐课程/侧栏 | 无明确引用字段 | CMS 可能需要补充 related programs 字段，或前端自动查询 |

### 线下体验 / 活动

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| hero 标题、轮播、CTA | `event.titleZh/En`, `coverImage` 可部分支持 | CTA 无专门字段 |
| 活动列表标题 | 页面固定标题 | 可支持 |
| eventType 分类 | `event.eventType` | 可支持 |
| 活动 poster | `event.posterImage` | 可支持；前端应 object-contain |
| 活动简介 | `event.contentZh/En` 或 `courseIntroZh/En` | 可支持 |
| 学术主持/教师名 | `event.facultyZh/En` | 可支持为文本 |
| 价格 | `event.feesZh/En` 为文本 | 可部分支持；若要卡片上显示 `¥380`，CMS 可能需要结构化价格字段 |
| 开放时间/日期 | 旧字段 `date` 被隐藏，无开放时间字段 | CMS 可能需要补充字段 |
| 标签：手作工坊、热门推荐 | 无专门字段 | CMS 可能需要补充标签字段 |
| gallery | `event.galleryImages` | 可支持详情页 |

### 艺术创作列表

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| 作品标题 | `artWork.titleZh/En` | 可支持 |
| 分类 | `artWork.workType` | 可支持 |
| 图片 | `artWork.images` | 可支持 |
| 描述 | `artWork.descriptionZh/En` | 可支持 |
| 尺寸 | `artWork.size` | 可支持 |
| 编号“01” | 无字段 | CMS 可能需要补充字段，或前端用列表序号；但不应作为 artWork 固定字段前置新增 |
| 价格“¥18000” | `artWork` 明确没有价格字段 | 与已确认 artWork 约束冲突；应移除前端展示或改由 shop/product 承载 |

### 艺术作品详情

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| 作品名称 | `artWork.titleZh/En` | 可支持 |
| 英文副标题 | `titleEn` 可支持 | 可支持 |
| 尺寸 | `artWork.size` | 可支持 |
| 描述话语 | `descriptionZh/En` | 可支持 |
| 多张作品图 | `artWork.images` | 可支持；保持原比例 |
| 作者 | 无字段，且此前 artWork 不允许作者字段 | 与已确认 artWork 约束冲突；不应前端展示 |
| 创作年份 | 无字段，且此前 artWork 不允许年份字段 | 与已确认 artWork 约束冲突；不应前端展示 |
| breadcrumb“商店 | 商品详情” | 不属于此页面 | Figma 文案错误，应改为艺术创作详情语境 |

### 商店列表

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| productType tabs | `product.productType` | 可支持 |
| derivativeCategory tabs | `product.derivativeCategory` | 可支持，仅 art-derivatives |
| 商品标题 | `product.titleZh/En` | 可支持 |
| 商品图片 | `coverImage`, `images` | 可支持 |
| 价格 | `product.price` | 可支持 |
| 分类/编号 | `productType`, `derivativeCategory` 可部分支持；编号无字段 | 编号可前端序号或 CMS 可能补充字段 |
| 库存状态 | `stockStatus` | CMS 有字段，但截图列表未展示；可能不需要列表展示 |

### 商品详情：available-artworks

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| 商品名、中英文名 | `titleZh/En` | 可支持 |
| 图片 gallery | `images` | 可支持 |
| 尺寸 | `size` | 可支持 |
| 描述 | `descriptionZh/En`, `detailZh/En` | 可支持 |
| 价格 | `price` | 可支持 |
| 艺术家 | 无字段 | CMS 可能需要补充 artist reference 或 artistName 字段 |
| 相关作品 | 无字段 | CMS 可能需要补充 relatedProducts，或前端自动查询 |
| 编号/分类 | 无编号字段；分类可由 `productType` 支持 | 编号 CMS 可能需要补充，或前端不展示 |
| 库存状态 | `stockStatus` | CMS 有字段，但截图未明显展示；可能不需要前端展示 |

### 商品详情：art-derivatives

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| 类型“艺术衍生品” | `productType` | 可支持 |
| 商品名、中英文名 | `titleZh/En` | 可支持 |
| 尺寸 | `size` | 可支持 |
| 描述 | `descriptionZh/En`, `detailZh/En` | 可支持 |
| 大图 | `images` 或 `coverImage` | 可支持；保持原比例 |
| derivativeCategory | `derivativeCategory` | CMS 有字段，但详情图未明显展示；可能不需要详情页展示 |
| 价格 | `price` | CMS 有字段，但详情图未展示；可能不需要该模板展示 |
| 库存状态 | `stockStatus` | CMS 有字段，但详情图未展示；可能不需要该模板展示 |

### 商品详情：cultural-products

| Figma 展示内容 | 现有 CMS 字段 | 判断 |
| --- | --- | --- |
| hero/slider 图片 | `coverImage`, `images` | 可支持 |
| 标题 | `titleZh/En` | 可支持 |
| 设计师 | 无字段 | CMS 可能需要补充 designer 字段 |
| 正文 | `descriptionZh/En`, `detailZh/En` | 可支持 |
| 相关作品 | 无字段 | CMS 可能需要补充 relatedProducts，或前端自动查询 |
| 价格/尺寸/库存 | CMS 有字段，但截图未展示 | 可能不需要该模板展示 |

## 6. 商店详情页专项判断

商店详情页必须按 `productType` 切换模板：

| productType | Figma 图片 | 布局结论 |
| --- | --- | --- |
| `available-artworks` | `shop-available-artwork-detail-desktop.png` | 双栏详情：左 gallery，右信息面板，显示价格和相关作品 |
| `art-derivatives` | `shop-art-derivative-detail-desktop.png` | 单栏作品式详情：标题、尺寸、描述、大图；价格和库存未出现 |
| `cultural-products` | `shop-product-detail-desktop.png` | hero/slider + 正文 + 相关作品；价格和库存未出现 |

因此：

- `ShopAvailableArtworkDetailTemplate` 不能复用 `ShopArtDerivativeDetailTemplate`。
- `ShopArtDerivativeDetailTemplate` 不能默认显示价格/库存，除非后续设计确认。
- `ShopCulturalProductDetailTemplate` 需要支持 hero/slider 和相关作品区域。
- 当前 product schema 能覆盖基础商品信息，但相关作品、艺术家、设计师等高保真中出现的内容目前没有对应字段。

## 7. 优先统一建议

1. 全站 desktop sidebar 以 `sidebar-desktop.png` 为唯一视觉标准，文案以 `src/config/navigation.ts` 为唯一数据源。
2. Topbar 统一 search bar、语言按钮、主题按钮；调色盘按钮是否全站出现需要确认。
3. 统一页面标题组件，但允许三类标题：普通栏目标题、hero 标题、详情标题。
4. Card 不做单一万能组件，应分为 TeamCard、ProgramCard、EventCard、WorkCard、ProductCard。
5. 图片规则必须按类型定义：poster 不裁切，作品图保持原比例，商品/艺术列表卡可铺满但需保证主体可见。
6. 先解决 Figma 与 CMS 的冲突：尤其 artWork 页面中出现的作者、年份、价格、编号，与当前 artWork 限制不一致。
7. Mobile 高保真缺失，实施前需要建立 mobile 响应式规则：顶部导航 + 抽屉菜单，不显示完整 sidebar。

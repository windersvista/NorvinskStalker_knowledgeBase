# 知识库主页改造探索报告（面向 AI 内容增长的未来）

> 研究日期：2026-09-16
> 研究对象：`windersvista/NorvinskStalker_knowledgeBase` 站点主页（VitePress 1.1.4 / nolebase 模板衍生）
> 研究方法：三路后台调查（本地盘点 exp-2、官方能力调研 lib-2、设计方向探索 des-1）合并，关键能力声明由主终端对本机 `vitepress@1.1.4` 源码逐项复核。
> 文档位置：`docs/research/`（今日新建，沿用仓库 `YYYY-MM-DD-slug.md` 命名惯例；`docs/**` 已被 `srcExclude` 排除，不随站点发布）。

---

## 1. 结论摘要

**问题**：站点未来 AI 方向内容比重将持续增大，现在以塔科夫整合包为主的页面与内容呈现方式需要改变；如何修改主页以符合未来需要？

**回答（要点）**：

1. **现状是单品牌单叙事**：主页 8 个 actions 中前 5 个指向站内塔科夫内容（含 4 个整合包下载页）、后 3 个为站外链接；4 个 features 全部塔科夫向；导航仅"主页/笔记/最近更新"三项。**AI 内容（⑥我与AI + copilot，合计 28 页）在主页没有任何入口。**
2. **官方能力足够支撑改造**：v1.1.4 提供 **9 个 `home-*` 布局插槽**、自定义 `layout`（`false` / `page` / 组件名）、CSS 变量品牌定制、nav 分组与多 sidebar。官方**没有**现成的"多板块门户"模板，需要组合实现（详见 §3）。
3. **设计方向四选一**（§4）：**A 单主页双板块（保守）/ B 门户化主页（推荐）/ C 品牌中性化（激进）/ D 新增 AI 独立首页（分区第二主页）**。推荐 **B，并把 C 的"hero 文案中性化"作为可选项吸收**；若想先低成本验证，A 可作过渡。
4. **需 Overseer 拍板 5 个决策点**（§5）：品牌归属、AI 内容组织形态、首页范式转变、课程上线节奏、nav 是否增项。
5. **附带发现需修复**：`docsMetadata.json` 已过期（目录名与磁盘脱节，需 `pnpm run update` 重生成）；`site.webmanifest` 残留旧品牌名"猫音知识库"；默认 hero 的隐藏依赖 CSS（改造时需保持或重构）。

---

## 2. 现状盘点（事实）

### 2.1 主页实现

| 项 | 事实 | 出处 |
|---|---|---|
| 布局 | `layout: home`、`sidebar: false` | `index.md:2-3` |
| 标题 | `title: Norvinsk Stalker`；`titleTemplate: 诺文斯克，你始终无法逃离的世界` | `index.md:5-6` |
| hero | `name: g~Nj$3J2^`（乱码串，被 HeroTerminal 当作 SESSION ID 彩蛋）；`text`/`tagline` 为塔科夫文案；`image: /logo.png` | `index.md:9-14` |
| actions（8 个） | 前 5 个站内（整合包指南合集 + 4 个下载页），后 3 个站外（B站 / 爱发电 / GitHub） | `index.md:15-39` |
| features（4 个） | 全部塔科夫向（单机化 / MOD / SPT 版本 / 版本选择向导） | `index.md:41-55` |
| 自定义组件 | `<HomePage />`（创作者区，渲染 VPTeamMembers） | `index.md:58`；`theme/components/HomePage.vue` |
| 视觉接管 | `HeroTerminal` 经 `home-hero-before` 插槽挂载，渲染 logo / 启动日志 / 大标题 / 警示条纹 / 按钮阵列 | `theme/index.ts:66-68`；`HeroTerminal.vue` |
| 默认 hero | `.VPHomeHero` 由 CSS 整体隐藏（`display:none`），视觉上**无重复**；该机制依赖 CSS 隐藏，属脆弱点 | `styles/main.css:35-42` |
| 主题插槽使用 | 共 6 处：`home-hero-before`、`doc-top`、`doc-footer-before`、`nav-bar-content-after`、`nav-screen-content-after`、`not-found` | `theme/index.ts:63-87` |
| nav | 主页 / 笔记 / 最近更新（3 项） | `config.ts:300-304` |
| 搜索 | 本地搜索（local provider），自定义渲染含 frontmatter tags | `config.ts:234-299` |

> **修正记录**：设计调查初稿曾报告"默认 VPHero 仍在渲染、hero 整组重复"，经主终端复核为**误判**——`.VPHomeHero` 由 `main.css:40-42` 的 `display:none` 整体隐藏（初稿依据 dist HTML 源码判断，未考虑 CSS 隐藏）。`frontmatter.hero` 仍被 HeroTerminal 消费为数据源，这是当前"数据与渲染分离"的刻意设计。

### 2.2 内容格局（`笔记/`）

| 分类 | 页数 | 占比 | 明细 |
|---|---:|---:|---|
| 塔科夫相关 | 97 | 23.5% | {0}ModPack Download 9、①更新计划 4、②安装技术 3、③游戏指南 15、④故事背景 19、⑤整合包运维 47 |
| AI 相关 | 28 | 6.8% | ⑥我与AI 13、copilot 15 |
| 其他 | 288 | 69.7% | ⑦摘抄和杂谈 287、⑧骑行运动 1 |
| 合计 | 413 | 100% | 不含 `笔记/index.md` |

- **⑥我与AI 现有文件**：AI 大模型概念汇总、Opencode preferences、Matt Pocock 工作流蒸馏报告、视频文案稿（6 个）、逐字稿（4 个）等。
- **其他散落 AI 内容**：`其他话题文档/企业级AI知识库助手…….pdf`（非 md）；⑤整合包运维中标题含"AI"的文件为游戏内 AI/BOT 机制，仍属塔科夫。
- **主页入口对应**：8 个 actions 与 4 个 features 全部塔科夫/站外，**AI 零入口**；`/toc` 最近更新为全局混排，两类受众互相干扰。

### 2.3 品牌资产与既有约束

- **站点身份**：`siteName = 'Norvinsk Stalker知识库'`、`siteDescription = '《诺文斯克潜行者》知识库'`（`metadata/index.ts:1-17`）；域名 `www.samuel-curious-meow.games`。
- **品牌视觉**：琥珀 `#e8b04b` + 锈红 `#b03a26` 军事终端风（`styles/vars.css:87-88` 等）；Black Ops One 字体（`styles/main.css:10-16`）；logo / og / favicon 全套塔科夫化（`public/`）。
- **上次重设计约束**：2026-07-26 主题重设计的 YAGNI 条款明确"不重排首页内容结构（hero actions、features 文案保持现状）"——本次改造将正式突破该约束。
- **过期/遗留**：
  - `docsMetadata.json` 与当前目录名脱节（残留 `⑤AI、整合包、MOD运维用文档`、`⑦课程：我是如何搭建塔科夫整合包的？` 等旧名），需 `pnpm run update` 重生成；
  - `site.webmanifest:2-4` 仍为旧品牌名"猫音知识库"，`theme_color/background_color` 为 `#ffffff`，未随深色主题同步。

---

## 3. 官方能力（v1.1.4，已源码核实）

### 3.1 home 布局 schema

- **hero**：`name / text / tagline / image / actions`；image 支持字符串或 `{src, alt}` / `{light, dark, alt}`（`types/default-theme.d.ts`）。
- **actions**：`{ theme?: 'brand' | 'alt', text, link, target?, rel? }`（`VPHero.vue:7-8`；target/rel 自 v1.0.0-rc.41 起支持）。
- **features**：`{ icon?, title, details, link?, linkText?, rel?, target? }`；icon 支持字符串（emoji/HTML）或图片对象（`VPFeatures.vue:9-17`、`VPFeature.vue:18-37`）。
- 官方文档：vitepress.dev → "Default Theme Home Page"。

### 3.2 布局插槽（9 个，本机逐项核实）

`home-hero-before`、`home-hero-info-before`、`home-hero-info`、`home-hero-info-after`、`home-hero-actions-after`、`home-hero-image`、`home-hero-after`、`home-features-before`、`home-features-after`（`VPContent.vue:30-36`、`VPHero.vue:30/31/38/53/59` 等）。当前主题仅使用 `home-hero-before`。

- 官方文档同列表：vitepress.dev → "Extending the Default Theme > Layout Slots"。
- **v2.0-alpha 陷阱**：`home-hero-actions-before-actions` 插槽仅存在于 v2.0.0-alpha.17+，v1.1.x **不可用**（勿被官网最新文档误导）。

### 3.3 自定义主页

- `layout: false`：完全自定义落地页（无导航/侧栏/页脚），官方文档 "No Layout"；源码 `Layout.vue` 的 `frontmatter.layout !== false` 分支。
- `layout: page`：空白页（Markdown 正常解析，无默认样式）。
- `layout: 组件名`：frontmatter 指定组件，主题内全局注册即可（`VPContent.vue:42-43` 的 `:is="frontmatter.layout"`）。
- **多 home 页**：按页 frontmatter 独立判断，无站点级限制（`VPContent.vue:29`）——方向 D 技术可行。

### 3.4 组件与导航扩展

- Markdown 中可直接使用组件（局部导入或全局注册；本仓库另有 `unplugin-vue-components` 自动注册 `theme/components`）。
- nav 支持嵌套 `items`；sidebar 支持按路径多组（官方文档 "Default Theme Config" / "Sidebar"）。
- 首页作为"多板块门户"：**官方无现成章节或模板**，需组合上述能力自行实现。

### 3.5 品牌定制

- CSS 变量：`--vp-c-brand-*`、`--vp-home-hero-name-*`、`--vp-font-family-*` 等（官方文档 "Customizing CSS" / "Using Different Fonts"）。
- 官方推荐覆盖方式：主题入口导入自定义 CSS；高级场景可用 Vite alias 覆盖内部组件。

### 3.6 版本差异

- v1.1.4 与 v1.6.4 在主页布局/插槽能力上**基本一致**；差异集中在外围（nav 自定义组件、部分 i18n、View Transitions 文档示例）。
- 若未来升级 VitePress，需另行评估兼容性；本报告结论均以 1.1.4 为准。

---

## 4. 设计方向（四选一）

| 方案 | 结构 | 技术要点 | 优点 | 风险与代价 |
|---|---|---|---|---|
| **A 单主页双板块**（保守） | HeroTerminal 保留 → 双板块入口区（塔科夫 / AI）→ features 改 2+2 混合 → 最近更新 → 创作者区 | 新增 `HomeSections.vue`；板块数据入 frontmatter 或独立 ts | 改动最小、老用户无感、AI 获得对等入口 | 塔科夫视觉仍主导，AI 像"附属板块"；代价小 |
| **B 门户化主页**（推荐） | Hero 极简（站名 + 一句话定位）→ 板块卡片网格（下载/指南/游戏/故事/AI/课程预告/杂谈/骑行，可插拔）→ 全局最近更新横条 → 支持作者收尾区 | 板块数据抽成配置（`.vitepress/homeSections.ts` 或 metadata 扩展）；卡片组件循环渲染；nav 同步加 AI 入口 | 内容驱动、可插拔，抗"AI 比重继续涨"的演变；首页从"下载列表"变"地图" | 老用户下载路径 +1 步（首卡强调缓解）；代价中 |
| **C 品牌中性化**（激进） | Hero 改"Samuel 的知识库"；最近更新提首位；栏目两栏（游戏整合包 / AI 与效率）；features 改"正在做的事" | 改 metadata（siteName/siteDescription）、config head（keywords/og 全量）、HeroTerminal 大改 | 为 AI 长期增长清出品牌空间；与域名对齐 | 塔科夫用户识别度下降；联动面大（metadata/head/og/logo/404/分享）；品牌属用户级决策 |
| **D 独立 AI 首页** | `/` 保持（顺手修复）→ `/ai`（或 `⑥我与AI/index.md`）新 home 页；nav 加"AI" | 第二个 `layout: home` 页（§3.3）；HeroTerminal 参数化复用 | 两类受众各得完整首页；AI 课程有专属落地页 | 双首页长期维护；默认落地仍是塔科夫页；品牌割裂加剧 |

**推荐排序：B > A > D > C。**

理由：内容板块已有 8+ 组且 AI 比重明确在涨，B 的门户结构是唯一不因内容继续演变而返工的形态，且下载转化可通过首卡强调保住；A 可作低成本过渡验证；D 适合 AI 内容规模更大的下阶段；C 的核心（品牌中性化）不依赖结构，可部分吸收进 B（hero 文案中性化、siteName 微调），完整执行需先过品牌决策关。

---

## 5. 需要 Overseer 拍板的决策点

1. **品牌归属**：站点主身份是否从"诺文斯克/塔科夫"改为"Samuel 的个人知识库"？（影响 siteName / og / 域名级文案）
2. **AI 内容组织**：⑥我与AI 维持单分组，还是升级为大板块（独立 nav 项 + 可能独立首页）？课程（6 课 + 6 速查表）采用何种目录形态？
3. **首页范式**：接受从"下载列表式"变为"板块门户式"吗？（老用户下载路径 +1 步 vs 信息架构清晰）
4. **AI 课程上线节奏**：课程未上线期间，首页 AI 卡挂"预告态"占位，还是等课程上线再挂卡？
5. **nav 是否增项**：是否接受 nav 从 3 项变 4 项（加 AI 入口）？

> **关联挂起事项**：课程迁移决策（测验处理 / 存放位置 / 转换范围）仍未拍板，与本报告 §5.2、§5.4 联动。先例参考：`docsMetadata.json` 残留旧目录名 `⑦课程：我是如何搭建塔科夫整合包的？`，说明"课程"作为顶级分组曾有先例。

---

## 6. 风险与注意事项

1. **白名单陷阱（本仓库特有）**：新组件（如 HomeSections）若要在 Markdown 中使用，必须加入 `config.ts:16-23` 的 `allowedMarkdownComponents`，否则会被 `escapeUnsafeAngleBrackets` 转义为文本。
2. **`docsMetadata.json` 已过期**：任何涉及 `笔记/` 的改动后需跑 `pnpm run update`（`docs:dev`/`docs:build` 会自动执行）。
3. **默认 hero 隐藏依赖 CSS**：改造 Hero 时需保持 `.VPHomeHero` 隐藏规则或重构数据策略（`frontmatter.hero` 同时是 HeroTerminal 的数据源）。
4. **品牌改动联动面大**：siteName / og / logo / manifest / 404 / 分享文案需成套更新；`site.webmanifest` 目前已是欠账。
5. **版本锁定 1.1.4**：不可用 v2.0-alpha 特性；升级需另行评估。
6. **视觉与内容占比脱节**：塔科夫页数仍约 24%（含"其他"中的塔科夫元素则更多），品牌中性化宜渐进推进。

---

## 7. 来源与复核记录

### 本地文件（仓库内）

- `index.md:2-58`（主页全部结构）；`.vitepress/theme/components/HomePage.vue`、`HeroTerminal.vue`；`.vitepress/theme/index.ts:63-87`；`.vitepress/styles/main.css:10-16, 35-42`、`vars.css:62-70, 87-88, 125-132`；`.vitepress/config.ts:16-23, 234-304`；`metadata/index.ts`；`.vitepress/creators.ts`；`public/` 品牌资产；`docs/superpowers/specs/2026-07-26-tarkov-theme-redesign-design.md`、`plans/2026-07-26-tarkov-theme-redesign.md`（YAGNI 条款）。
- 本机依赖源码（vitepress@1.1.4）：`dist/client/theme-default/components/VPHero.vue:7-8, 30/31/38/53/59`、`VPContent.vue:19/24/29/30-36/42-43`、`VPFeatures.vue:9-17`、`VPFeature.vue:18-37`、`Layout.vue`、`types/default-theme.d.ts`；`dist/node/serve-CXVdC751.js:37049/37084`（github-alerts 规则，另案）。
- 内容统计：`笔记/` 全目录扫描（413 个 md；分类见 §2.2）。

### 官方文档（外部）

- VitePress Docs — Default Theme Home Page：https://vitepress.dev/reference/default-theme-home-page
- VitePress Docs — Extending the Default Theme（Layout Slots / Customizing CSS / Different Fonts / Overriding Components）：https://vitepress.dev/guide/extending-default-theme
- VitePress Docs — Using Vue in Markdown：https://vitepress.dev/guide/using-vue
- VitePress Docs — Default Theme Layout（No Layout / Page / Custom Layout）：https://vitepress.dev/reference/default-theme-layout
- VitePress Docs — Default Theme Config / Sidebar（nav 分组、多 sidebar）：https://vitepress.dev/reference/default-theme-config
- vuejs/vitepress 源码（v1.1.4 与 v1.6.4 tag）与 CHANGELOG（`home-hero-actions-before-actions` 为 v2.0.0-alpha.17+ 特性）。
- nolebase-template（上游模板主页形态，`makerjackie/nolebase-template`）。

### 主终端复核记录（本报告关键声明）

| 复核项 | 结果 | 证据 |
|---|---|---|
| HeroAction 接口字段 | 确认（theme 仅 brand/alt） | `VPHero.vue:7-8` |
| 9 个 `home-*` 插槽存在于 1.1.4 | 确认 | `VPContent.vue:30-36`、`VPHero.vue:30/31/38/53/59` |
| `home-hero-actions-before-actions` 不存在于 1.1.x | 确认 | 同上，v2.0-alpha.17+ 才有 |
| 自定义 `layout: 组件名` 支持 | 确认 | `VPContent.vue:42-43` |
| 默认 hero 视觉重复 | **证伪**（CSS 隐藏，无视觉重复） | `styles/main.css:35-42` |
| 多 home 页支持 | 确认（按页 frontmatter 判断） | `VPContent.vue:19/29` |

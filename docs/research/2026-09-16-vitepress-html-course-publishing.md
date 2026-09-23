# VitePress 站点发布原始 HTML 与课程上线研究报告

> 研究日期：2026-09-16
> 研究对象：`windersvista/NorvinskStalker_knowledgeBase`（VitePress 站点）与 `Video_script_repository/我的OCvibecoding环境视频/教学`（课程档案）
> 研究方式：两路后台调查（本地仓库侦察 + 官方第一手来源调查）合并，并由主终端对本机实际安装的 `vitepress@1.1.4` 做源码级复核。
> 文档位置说明：仓库原有站点类文档存放于 `docs/superpowers/{plans,specs}/`（`YYYY-MM-DD-slug.md`），无 research 分类；本文按该命名惯例新建 `docs/research/` 存放。`docs/**` 已被 `srcExclude` 排除，不会随站点发布。
> **方向修订（2026-09-16，Overseer 澄清）**：目标为**将课程并入 `笔记/` Markdown 体系**（侧边栏/toc/搜索），而非 `public/` 原样托管。§5 的推荐方案不代表最终方向；Markdown 迁移方案将另行成文。

---

## 1. 结论摘要

**问题一：知识库网站现在支持直接部署 HTML 吗？**

支持，但机制是"放进 `public/` 目录"，而不是"放进源码目录"：

- `public/` 下的文件会在构建时**原样复制到产物根目录**并公开访问（VitePress 官方机制，见 §4.1）。
- 两个必须注意的本地约束：
  1. 从站点页面**链接**到这些 HTML 时，必须给链接加 `target` 属性（如 `{target="_self"}`），否则点击会被 VitePress 的 SPA 客户端路由拦截并显示 404（已对本机 1.1.4 源码逐行验证，见 §4.2）。直接输入 URL 或新标签页打开不受影响。
  2. 本仓库对 Markdown 中的原始 HTML 有**标签白名单**（`a/br/details/img/kbd/span/summary`）。`<iframe>` 不在白名单内，会被转义为纯文本；若要 iframe 嵌入，需先修改配置（见 §4.5）。

**问题二：如果不能，要怎么做？**

上述机制已可行，无需绕路。若追求其他形态（iframe 嵌入 / 全站原生 Markdown / 独立部署再外链），见 §5 备选方案与代价对比。

**问题三：课程怎么放上去让别人也能看到？**

推荐三步（详见 §5.3）：

1. 把整个 `教学/` 复制为 `public/teaching/`，保持内部目录结构不变——课程完全自包含（仅依赖本地 CSS/JS，无 CDN），复制后内部相对链接全部有效。
2. 在顶部导航（`.vitepress/config.ts:300-304`）加一个 `target: '_self'` 的入口；另在 `笔记/` 下建一个落地页，使其进入侧边栏与"最近更新"。
3. 提交到 `main`，Netlify 自动构建部署；线上访问 `https://www.samuel-curious-meow.games/teaching/index.html` 验证。

课程规模：21 个文件、约 177 KB，对仓库和构建负担可忽略。

---

## 2. 站点现状（本地事实）

| 项 | 事实 | 出处 |
|---|---|---|
| 框架 | VitePress，nolebase 模板衍生（upstream: `makerjackie/nolebase-template`） | `git remote -v` |
| 实际版本 | **1.1.4**（锁定）；`package.json` 声明 `^1.0.2` | `pnpm-lock.yaml:3515`；`node_modules/.pnpm/vitepress@1.1.4_.../package.json` |
| `srcDir` | 未设置（默认项目根目录） | `.vitepress/config.ts:107-339` |
| `base` | 未设置（默认 `/`）——与生产自定义域名根路径一致 | 同上 |
| `outDir` | 未设置（默认 `.vitepress/dist`） | 同上 |
| `cleanUrls` | 未设置（默认 `false`） | 同上 |
| `srcExclude` | `['**/node_modules/**', '**/dist/**', 'docs/**']`——`docs/` 不参与构建 | `.vitepress/config.ts:122` |
| `ignoreDeadLinks` | `true`——死链不会导致构建失败 | `.vitepress/config.ts:125` |
| Markdown HTML 白名单 | `a, br, details, img, kbd, span, summary` + 自定义组件白名单；其余 `<...>` 被转义 | `.vitepress/config.ts:15-23, 25-105, 313-316` |
| 顶部导航 | 硬编码：主页 `/`、笔记 `/笔记/`、最近更新 `/toc` | `.vitepress/config.ts:300-304` |
| 侧边栏 | 由 `scripts/update.ts` 扫描 `笔记/**/*.md` 生成 `.vitepress/docsMetadata.json` | `scripts/update.ts:14-15`；`.vitepress/config.ts:13, 305` |
| 构建脚本 | `docs:dev` / `docs:build` 先跑 `pnpm update`（再生成 sidebar），后跑 vitepress | `package.json:21-29` |
| 包管理器 | pnpm@11.5.2 | `package.json:11` |
| 生产部署 | **Netlify**：push `main` → `pnpm docs:build` → `netlify deploy --dir .vitepress/dist --prod` | `.github/workflows/production-deployment.yaml` |
| 生产域名 | `https://www.samuel-curious-meow.games`（自定义域名，根路径） | `metadata/index.ts:15-17`；`public/_redirects`（Netlify 配置） |
| GitHub Pages 工作流 | 手动触发（`workflow_dispatch`），环境 URL 硬编码为上游模板的 `nolebase.github.io/nolebase`，与本仓库不匹配——判定为模板残留，非当前生产路径 | `.github/workflows/production-deployment-to-github-pages.yaml:23, 57-66` |
| `public/` 现有内容 | 字体（`fonts/`）、logo/favicon/og 图、`site.webmanifest`、`诺文斯克潜行者难度分级明细表.jpg`、`_redirects` 等 | `public/` 目录；构建产物 `.vitepress/dist/fonts/` 已验证存在 |
| 主题扩展 | `extends: DefaultTheme` + 插槽；无 iframe/embed 类组件 | `.vitepress/theme/index.ts:62-87` |
| 站内原始 HTML 先例 | 仅 `笔记/md-format-check-report/md-format-check-report.html`（游离文件，未走站点页面体系） | 仓库搜索结果 |

---

## 3. 课程档案现状（`教学/`）

| 项 | 事实 |
|---|---|
| 路径 | `E:\云文件\GitHub\Video_script_repository\我的OCvibecoding环境视频\教学\` |
| 规模 | 21 个文件，181,642 bytes（约 177 KB） |
| 结构 | `index.html`（课程总览）；`lessons/` 6 课 + 模板；`reference/` 6 张速查表 + 模板；`assets/lesson.css`（720 行）、`assets/quiz.js`（230 行）；`learning-records/` 1 个 md；`MISSION.md` / `NOTES.md` / `RESOURCES.md` |
| 自包含性 | **完全自包含**：无 CDN、无外部字体、无外部 JS。CSS/JS 均以 `../assets/...` 相对路径引用；课程间链接为相对路径；未发现 `file:///`、`E:\` 等绝对路径；未引用 `教学/` 以外的本地资源 |
| 离线能力 | `assets/lesson.css:6-8` 声明"离线可用、file:// 直接打开" |
| 外部链接 | 课程内仅有指向官方文档/GitHub/Discord 的 HTTPS 外链，发布后不受影响 |
| 发布相关说明 | `MISSION.md` / `NOTES.md` / `RESOURCES.md` 均未提及课程打算如何发布/托管 |

**含义**：课程目录整体复制到 `public/` 任意子目录后，所有内部相对链接、样式与测验脚本都将继续工作，无需改写。

---

## 4. 机制分析（官方来源 + 本机源码验证）

### 4.1 `public/` 目录机制（官方支持）

- `public/` 下文件**原样复制**到构建产物根目录，dev 时以 `/` 提供，构建后位于 `dist/` 根；引用时使用根绝对路径（`public/icon.png` → `/icon.png`），`base` 会自动拼接，无需手动处理。
  - 官方原文："Assets placed in `public` will be copied to the root of the output directory as-is."（VitePress Docs, Asset Handling > The Public Directory）
  - 官方原文："Static asset references are automatically adjusted for the base..."（同上, Base URL）
- 源码佐证（本机 1.1.4 与上游 main 一致）：构建时 `cp(publicDir, config.outDir, { recursive: true })`。
- 该机制不限制扩展名，`.html` 文件同样被复制。本仓库已有先例：`public/fonts/` 在 `dist/fonts/` 中确认存在。

### 4.2 SPA 路由拦截与 `target` 绕过（关键坑，已本机验证）

- 本机 `vitepress@1.1.4` 源码 `dist/client/app/router.js:113-134`：点击事件监听器会拦截**同源**且 `treatAsHtml(pathname)` 为真的 `<a>` 链接，并交由 SPA 路由加载对应页面模块。
- `dist/client/shared.js:118-134`：`treatAsHtml()` 对扩展名不在已知列表（css/js/png/...）中的路径返回 `true`。`.html` 不在列表内 → **指向静态 HTML 的链接会被拦截**。
- 拦截条件包含 `!target`（`router.js:122` 取 `const { target } = link;`，`:132` 判断 `!target &&`）→ **任何非空 `target` 属性都会跳过拦截，走浏览器整页导航**。
- 若被拦截且目标不是 VitePress 注册路由：`loadPageModule()` 返回空 → 抛出 `Page not found` → 渲染 404 组件（`router.js:39-41`）。
- 官方推荐写法（VitePress Docs, Routing > Linking to Non-VitePress Pages）：

  ```md
  [课程入口](/teaching/index.html){target="_self"}

  <a href="/teaching/index.html" target="_self">课程入口</a>
  ```

- 导航/侧边栏同样支持：`VPNavBarMenuLink.vue:26`、`VPSidebarItem.vue:78`、`VPLink.vue:28` 均传递 `item.target`；类型定义 `types/default-theme.d.ts:167-180` 已包含 `target?: string`（1.1.4 即有；调查初稿中"1.6.3+ 才支持"的说法经本机复核修正）。
- 注意：此坑是**运行时**的（点击才 404），不是构建期的；直接输入 URL、新标签页打开、或 `target="_blank"` 均正常。

### 4.3 死链检查

- 本仓库已设 `ignoreDeadLinks: true`（`.vitepress/config.ts:125`），死链不阻断构建。
- 双保险：1.1.4 的死链检查本身也豁免 public 中的 HTML——`dist/node/serve-CXVdC751.js:38357` 判断 `fs.existsSync(path.resolve(dir, publicDir, `${resolved}.html`))`，存在即不计死链（与上游 v1.6.3 逻辑一致）。

### 4.4 `base` 路径

- 本仓库 `base` 未设置（默认 `/`），生产为自定义域名根路径（`www.samuel-curious-meow.games`），因此根绝对路径 `/teaching/index.html` 直接可用。
- 官方规则：若部署在子路径（如 GitHub Pages 项目站点 `/<repo>/`），需设 `base: '/<repo>/'`，届时 markdown 内仍写 `/teaching/index.html`，`base` 由框架自动拼接。
- 若将来启用 GitHub Pages 工作流：除 `base` 外，gh-pages 分支部署会经 Jekyll 处理，需加 `.nojekyll`（或改用 artifact 部署方式）；当前生产（Netlify）不受此影响。

### 4.5 本仓库特有约束：Markdown HTML 白名单

- `.vitepress/config.ts:25-105` 的自定义规则 `escapeUnsafeAngleBrackets` 会在 Markdown 解析前把白名单外的 `<tag>` 转义为 `&lt;tag&gt;`。
- 白名单：`a, br, details, img, kbd, span, summary`（`:15`）+ 六个自定义组件（`:16-23`）。
- 影响：
  - `<iframe>` 嵌入方案**默认不可用**（会被显示为文本）。如需 iframe，必须把 `'iframe'` 加入 `:15` 白名单（附带风险评估：iframe 属性同样放行，属可控改动）。
  - `<a href="..." target="_self">` 可用（`a` 在白名单内）。
  - Markdown 链接属性语法 `[文本](/path){target="_self"}` 不受此规则影响（属 markdown-it 语法，非原始 HTML）。

### 4.6 部署管道现状

- 生产：push `main` → `.github/workflows/production-deployment.yaml` → Netlify 生产部署（`netlify deploy --dir .vitepress/dist --prod`）。新增的 `public/` 文件随 `dist/` 一起上线。
- GitHub Pages 工作流为模板残留（手动触发、URL 指向上游模板），除非明确启用，否则不构成发布路径。若启用需处理 §4.4 的 `base`/Jekyll 问题。

---

## 5. 方案对比与推荐

### 5.1 方案对比

| 方案 | 做法 | 官方支持度 | 代价 / 风险 |
|---|---|---|---|
| **A. `public/` 原样托管 + 站内链接（推荐）** | 课程复制为 `public/teaching/`；nav 或落地页用 `target` 链接 | 高（官方 public 机制 + 官方 target 写法） | 需注意 `target` 必须加；课程与站点视觉独立 |
| B. iframe 嵌入 | 同上 + 在 Markdown 页面内 `<iframe src="/teaching/index.html">` | 中（无官方 iframe 嵌入本地页的专门示例） | 需改白名单（`:15`）；iframe 不继承主题；移动端高度/滚动需调优 |
| C. 转为 Markdown | 6 课 + 6 速查表改写为 `.md` | 高（站点原生路径） | 工作量大；测验交互（`quiz.js`）需重写；丢失现有单文件形态 |
| D. 课程独立部署 + 外链 | 在 `Video_script_repository` 侧开 Pages/Netlify，站点外链 | 高（GitHub Pages 官方支持项目站点） | 内容不在知识库站内；多维护一个部署 |

### 5.2 推荐组合：A（主）+ 站内入口（辅）

推荐理由：改动最小、机制全部官方且已在本机版本验证、课程零改写、177 KB 体量无压力。

### 5.3 推荐实施步骤

1. **复制课程**
   - 源：`E:\云文件\GitHub\Video_script_repository\我的OCvibecoding环境视频\教学\`
   - 目标：`E:\云文件\GitHub\NorvinskStalker_knowledgeBase\public\teaching\`（建议 ASCII 目录名，避免 URL 百分号编码；内部结构保持原样）
   - 建议同时记录来源仓库的 commit hash，便于将来同步更新。

2. **加入口（二选一或组合）**
   - 导航入口：在 `.vitepress/config.ts:300-304` 的 `nav` 数组中加：

     ```ts
     { text: '教学课程', link: '/teaching/index.html', target: '_self' },
     ```

     （不加 `target` 会在点击时被 SPA 路由拦截 → 404。）
   - 落地页：在 `笔记/` 下新增 `教学课程.md`，正文用官方写法链接课程首页：

     ```md
     [进入课程](/teaching/index.html){target="_self"}
     ```

     运行 `pnpm update` 后该页自动进入侧边栏与 `toc.md`（"最近更新"）。

3. **本地验证**
   - `pnpm docs:dev`：访问 `/teaching/index.html`，检查样式、课间跳转、测验脚本；从落地页/nav 点击链接，确认整页导航（地址栏变化、无 404）。
   - `pnpm docs:build`：确认 `.vitepress/dist/teaching/` 存在且文件齐全。

4. **发布**
   - 提交到 `main` → Netlify 自动构建部署 → 线上验证 `https://www.samuel-curious-meow.games/teaching/index.html` 及课程内部跳转。

5. **发布前内容审查（重要）**
   - 课程正文含本机路径文本（如 `C:\Users\Winde\...`、`E:\云文件\...`），均在 `<code>`/正文中而非链接，但公开后可见——建议通读确认是否脱敏。
   - `教学/index.html` 以文本形式链接 `MISSION.md`、`NOTES.md`、`RESOURCES.md`——这些 `.md` 会以原始文件被浏览器显示/下载；建议决定保留、转为 HTML 或移除链接。
   - `learning-records/`（学习记录）是否随站公开需明确决定。

---

## 6. 风险与注意事项

1. **漏加 `target` 是最主要故障模式**：构建通过（`ignoreDeadLinks: true`），但点击链接 404。验收时必须实测点击。
2. **白名单转义**：Markdown 中任何非白名单原始 HTML 标签会被显示为文本；iframe 方案需先改 `.vitepress/config.ts:15`。
3. **中文文件名 URL**：课程内文件名含中文，浏览器会百分号编码，功能正常；如需整洁 URL 可在未来重命名（需同步改内部相对链接）。
4. **视觉与导航割裂**：课程页为独立静态页，无站点主题、无返回知识库的导航（仅第 6 课有返回总览链接）。建议由站内落地页承担"入口 + 返回路径"的说明职责。
5. **双仓库维护**：课程在 `Video_script_repository` 演进，复制到本仓库后需手动同步；建议记录来源 commit 并在课程更新时重新复制。
6. **GitHub Pages 残留工作流**：若未来启用，需处理 `base` 与 `.nojekyll`；当前 Netlify 路径不受影响。

---

## 7. 验证记录

本机 `vitepress@1.1.4`（`pnpm-lock.yaml` 锁定版本）源码级复核结果：

| 验证项 | 结果 | 证据 |
|---|---|---|
| SPA 点击拦截逻辑 | 存在；非空 `target` 绕过 | `dist/client/app/router.js:113-134`（`:122` 取 `link.target`，`:132` `!target &&`） |
| `.html` 链接会被拦截 | 是（故必须 `target`） | `dist/client/shared.js:118-134` `treatAsHtml`（`.html` 不在已知扩展列表） |
| 死链豁免 public HTML | 存在 | `dist/node/serve-CXVdC751.js:38357` |
| nav/sidebar `target` 传递 | 1.1.4 已支持 | `VPNavBarMenuLink.vue:26`、`VPSidebarItem.vue:78`、`VPLink.vue:28` |
| `NavItemWithLink.target` 类型 | 已类型化 | `types/default-theme.d.ts:167-180`（`target?: string`） |

未能从第一手来源证实（如实标注）：

- GitHub Pages 官方文档未找到"访问 `/foo/` 自动返回 `/foo/index.html`"的独立明确条款（属静态托管通用行为）。
- VitePress 官方文档无"iframe 嵌入本地 public HTML 页面"的专门示例或限制说明。
- nolebase 模板 README 未提及自定义页面/原始 HTML/嵌入外部内容等主题。

---

## 8. 来源清单

### 官方文档（外部）

- VitePress Docs — Asset Handling: The Public Directory / Base URL：https://vitepress.dev/guide/asset-handling
- VitePress Docs — Routing: Linking to Non-VitePress Pages：https://vitepress.dev/guide/routing#linking-to-non-vitepress-pages
- VitePress Docs — Site Config: `base` / `ignoreDeadLinks`：https://vitepress.dev/reference/site-config
- VitePress Docs — Deploy: GitHub Pages：https://vitepress.dev/guide/deploy#github-pages
- GitHub Docs — About GitHub Pages / Creating a GitHub Pages site（静态文件发布、静态生成器与 Jekyll 说明）：https://docs.github.com/en/pages
- vuejs/vitepress 源码（v1.6.3 及 main 分支）与 issue #5042 维护者回复：https://github.com/vuejs/vitepress
- makerjackie/nolebase-template README：https://github.com/makerjackie/nolebase-template

### 本地文件（仓库内）

- `.vitepress/config.ts:15-23, 25-105, 122, 125, 300-304, 313-329`（白名单/转义/排除/nav/markdown 配置）
- `.vitepress/theme/index.ts:62-87`（主题扩展方式）
- `scripts/update.ts:14-15`（`笔记/` 扫描与 sidebar 生成）
- `metadata/index.ts:10, 15-17`（仓库链接、生产域名）
- `package.json:11, 21-29, 77`（pnpm、脚本、版本声明）；`pnpm-lock.yaml:3515`（锁定 1.1.4）
- `.github/workflows/production-deployment.yaml`（Netlify 生产部署）；`.github/workflows/production-deployment-to-github-pages.yaml`（模板残留）
- `public/_redirects`（Netlify 配置）
- 本机依赖源码：`node_modules/.pnpm/vitepress@1.1.4_.../dist/client/app/router.js`、`dist/client/shared.js`、`dist/node/serve-CXVdC751.js`、`dist/client/theme-default/components/*.vue`、`types/default-theme.d.ts`

### 课程侧（外部目录）

- `Video_script_repository/我的OCvibecoding环境视频/教学/`：`index.html`、`lessons/*.html`（0001-0006 + 模板）、`reference/*.html`、`assets/lesson.css:6-8`、`assets/quiz.js`、`MISSION.md`、`NOTES.md`、`RESOURCES.md`、`learning-records/`

# 塔科夫风主题重设计 · 设计文档

> 日期： 2026-07-26 | 状态： 待用户审查 | 项目： NorvinskStalker_knowledgeBase

## 1. 背景与目标

本站是基于 VitePress + Nólëbase 主题 + UnoCSS 的个人知识库，通过 Vercel 部署。当前主题为通用模板风格（天蓝/紫色渐变、精灵字体 tengwar），与站点内容（离线版逃离塔科夫 SPT 单机化整合包）气质严重不符。

**目标**： 将全站视觉重设计为「军用终端 × 塔科夫硬核军事」混合风格（头脑风暴中已确认的 A+B 方案），同时：

- 不破坏 VitePress 主题结构与 nolebase 插件体系
- 不影响 Vercel 部署（纯样式层 + 静态资源改动）
- 不改动任何 `笔记/` 下的 markdown 内容

视觉基准： `.superpowers/brainstorm/ps-1785076597/content/style-hybrid-v2.html`（已获用户确认的高保真 mockup）。

## 2. 设计系统

### 2.1 调色板（深色为主）

| Token | 值 | 用途 |
|---|---|---|
| `--nv-bg` | `#0e0f0b` | 页面底色（近黑带绿调） |
| `--nv-panel` | `#14160f` | 卡片/侧边栏底色 |
| `--nv-line` | `#2a3320` | 边框（暗橄榄） |
| `--nv-text` | `#c9d1b1` | 正文 |
| `--nv-khaki` | `#cbb58a` | 标题/强调文字 |
| `--nv-muted` | `#8fa66a` | 次要文字/终端绿 |
| `--nv-amber` | `#e8b04b` | 主品牌色：链接、激活态、终端磷光 |
| `--nv-rust` | `#b03a26` | 主行动按钮（锈红） |

### 2.2 浅色模式（简化版 · 已确认）

军事文件/战术图纸风：卡其纸色底（`#e8e2d0` 系）、深橄榄文字（`#2e3324` 系）、品牌色降饱和（深琥珀 `#9a6b1e`、锈红不变）。只映射同一组 CSS 变量，不做额外装饰（无扫描线、无光晕）。

### 2.3 字体（已确认：引入字体文件）

- 引入 **Black Ops One**（Google Fonts，OFL 许可，仅拉丁字形）woff2 放入 `public/fonts/`，`font-display: swap`，用于首页 hero 标题等拉丁文装饰标题
- 中文一律使用系统字体栈，不强行 stencil
- 终端元素（按钮、代码块、侧栏标记、tagline）使用等宽字体栈 `Consolas, 'Courier New', monospace`
- 移除现有 tengwar 精灵字体及其 `@font-face`

### 2.4 标志性视觉元素

- **扫描线**： 全局 `body::after` 固定定位叠加 `repeating-linear-gradient`，浓度约 `rgba(0,0,0,.12)`，`pointer-events: none`；仅深色模式启用；不影响文本选择与交互
- **警示条纹**： 45° 琥珀/底色斜纹，用于 hero 分隔带、features 卡片顶部、warning/danger 自定义容器左边条
- **闪烁光标**： hero 标题尾部方块光标，CSS `steps(1)` 动画；`prefers-reduced-motion` 时禁用
- **琥珀光晕**： hero 标题与 logo 图的 text-shadow/box-shadow 柔光（替代现有紫色渐变光晕）

## 3. 改动清单

### 修改

1. **`.vitepress/styles/vars.css`** — 整体重写：
   - 定义 2.1 的 `--nv-*` 调色板（`:root` 深色 + `html:not(.dark)` 浅色映射）
   - 映射 VitePress 变量： `--vp-c-brand-*` → amber 系；`--vp-c-bg*`、`--vp-c-text-*`、`--vp-c-divider` 等 → 塔科夫系；`--vp-home-hero-name-background` / `--vp-home-hero-image-background-image` → 琥珀光晕；`--vp-custom-block-{tip,warning,danger}-*` 重配色
2. **`.vitepress/styles/main.css`** — 大幅重写：
   - 删除： discord/github 定向按钮样式、tengwar `@font-face`、旧 hero 字体规则
   - 保留： VPTeamMembers 高度修复等无害兼容性补丁
   - 新增： Black Ops One `@font-face`、扫描线 overlay、hero 标题/tagline/按钮（brand=锈红，alt=琥珀描边）、features 卡片（终端边框+条纹顶边）、文档页定制（`>` 前缀 h1、琥珀链接、终端风代码块、警示条纹 custom container、侧栏激活态）
3. **`index.md`** — 仅 frontmatter 微调： hero 图片 `alt` 修正（现为 "Vitest"）；hero.name 保持现状（`g~Nj$3J2^` glitch 字符符合塔科夫气质，予以保留，字体回退链自动处理缺字形）
4. **`.vitepress/config.ts`** — 仅三处低风险微调： `appearance` 设为 `'dark'`（首次访问默认深色，保留切换器，体现"深色为主"）；`theme-color` meta 从 `#ffffff` 改为 `#0e0f0b`；footer 版权文案改为 `<a class="footer-cc-link" target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> © Samuel是不是好奇猫`（保留 CC 链接与 heart 符号行）

### 新增

5. **`public/fonts/black-ops-one-latin.woff2`** — 从 Google Fonts 下载的拉丁子集（约 20-30KB）

### 不动

- `笔记/`、`视图/`、`metadata/`、`scripts/`、sidebar 数据、构建/部署配置（`vite.config.ts`、`netlify.toml`、Vercel 设置）、所有 markdown 内容、UnoCSS 配置

## 4. 风险与边界情况

| 风险 | 对策 |
|---|---|
| 字体加载失败/缺字形 | 完整回退链 `'Black Ops One', 'Arial Black', Impact, sans-serif`；`font-display: swap` |
| 扫描线降低代码块可读性 | 浓度控制在 0.12 以下；本地 dev 逐页目检 |
| 浅色模式对比度不达标 | 简化版配色人工核对正文/链接/按钮对比度（WCAG AA 目标） |
| 动效影响敏感用户 | `prefers-reduced-motion: reduce` 下禁用光标闪烁 |
| nolebase 插件注入的组件（目录、更新日志、阅读增强等）颜色冲突 | 这些组件大多消费 `--vp-c-*` 变量，变量映射自动覆盖；dev 目检逐个确认 |

## 5. 验证计划

1. `pnpm dev` 本地检查： 首页（深/浅）、文档页（深/浅）、`toc.md`、插件页（最近更新/Git 日志）、移动端宽度（640px/390px）
2. `pnpm build` 构建成功（All-Clear）
3. 确认无配置层改动 → Vercel 部署行为不变

## 6. 明确不做（YAGNI）

- 不改动 Vue 组件与主题结构，不新增 JS 特效（ glitch 动画、雨滴等）
- 不更换搜索、OG 图生成等插件
- 不重排首页内容结构（hero actions、features 文案保持现状）

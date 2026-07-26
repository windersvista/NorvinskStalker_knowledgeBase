# 塔科夫风主题重设计 · 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 VitePress 知识库视觉重设计为「军用终端 × 塔科夫硬核军事」混合风格，纯样式层改动，不破坏结构与部署。

**Architecture:** 仅改动 `.vitepress/styles/` 两个 CSS 文件 + `config.ts` 三处常量 + `index.md` 一处 alt + 新增一个 woff2 字体文件。设计基准见 `docs/superpowers/specs/2026-07-26-tarkov-theme-redesign-design.md`，视觉 mockup 见 `.superpowers/brainstorm/ps-1785076597/content/style-hybrid-v2.html`。

**Tech Stack:** VitePress 1.x 默认主题（CSS 变量覆盖）、纯 CSS（无预处理器）、Black Ops One 字体（OFL）。

## Global Constraints

- **禁止自动 git commit** — 用户全局规则：未经明确要求不提交。所有任务以"验证通过"为终点，不做 commit 步骤。
- 不修改 `笔记/` 下任何 markdown、不修改 `.vitepress/theme/index.ts` 及组件、不修改部署配置。
- 调色板（值必须与设计文档一致）： 深 `--nv-bg:#0e0f0b` `--nv-bg-soft:#14160f` `--nv-bg-mute:#191b12` `--nv-line:#2a3320` `--nv-text-1:#d3d9c2` `--nv-text-2:#a8b391` `--nv-text-3:#8fa66a` `--nv-khaki:#cbb58a` `--nv-amber:#e8b04b` `--nv-rust:#b03a26`
- 浅色模式只做简化军事文件风（无扫描线、无光晕）。
- 扫描线浓度 ≤ `rgba(0,0,0,0.12)`，仅深色模式。
- 所有 CSS 注释使用简体中文。

---

### Task 1: 下载并安装 Black Ops One 字体

**Files:**
- Create: `public/fonts/black-ops-one-latin-regular.woff2`

**Interfaces:**
- Consumes: 无
- Produces: 字体文件路径 `/fonts/black-ops-one-latin-regular.woff2`（public 目录会被 VitePress 原样拷贝到站点根，供 Task 3 的 `@font-face` 引用）

- [ ] **Step 1: 用 google-webfonts-helper API 下载 latin 子集 woff2**

在仓库根目录的 PowerShell 执行：

```powershell
$zip = "D:\Temp\opencode\black-ops-one.zip"
Invoke-WebRequest -Uri "https://gwfh.mranftl.com/api/fonts/black-ops-one?download=zip&subsets=latin&variants=regular&formats=woff2" -OutFile $zip
Expand-Archive -Path $zip -DestinationPath "D:\Temp\opencode\black-ops-one" -Force
New-Item -ItemType Directory -Force -Path "public\fonts" | Out-Null
Copy-Item "D:\Temp\opencode\black-ops-one\black-ops-one-latin-regular.woff2" "public\fonts\"
```

- [ ] **Step 2: 验证文件就位且非空**

Run: `Get-Item "public\fonts\black-ops-one-latin-regular.woff2" | Select-Object Name, Length`
Expected: `Length` 约 10000-30000 字节（若 API 失败，报告用户改用 fonts.google.com 手动下载，不要静默跳过）

---

### Task 2: 重写 `.vitepress/styles/vars.css`（调色板与 VitePress 变量映射）

**Files:**
- Modify: `.vitepress/styles/vars.css`（整体替换，120 行 → 新文件）

**Interfaces:**
- Consumes: 无
- Produces: `--nv-*` 调色板变量与全部被覆盖的 `--vp-*` 变量，供 Task 3 的 `main.css` 及 VitePress/nolebase 组件消费

- [ ] **Step 1: 整体替换 vars.css 为以下内容**

```css
/**
 * Norvinsk Stalker · 塔科夫军事终端主题变量
 *
 * 深色（默认）：军用终端 —— 近黑绿底 + 磷光琥珀 + 卡其
 * 浅色（简化）：军事文件 —— 卡其纸底 + 深橄榄 + 深琥珀
 *
 * 变量语义说明（与 VitePress 默认主题一致）：
 * - XXX-1：文字级颜色（链接、强调文字）
 * - XXX-2：按钮 hover 底色
 * - XXX-3：按钮实底（其上为白色/浅色文字，需保证对比度）
 * - XXX-soft：半透明浅底（徽章、自定义容器背景）
 * -------------------------------------------------------------------------- */

/* ========== 浅色（军事文件风 · 简化版） ========== */
:root {
  /* 调色板 */
  --nv-bg: #ece6d4;
  --nv-bg-soft: #e3dcc7;
  --nv-bg-mute: #d8d0b8;
  --nv-line: #c9bfa2;
  --nv-text-1: #2e3324;
  --nv-text-2: #4c5340;
  --nv-text-3: #6b7157;
  --nv-khaki: #7a6a45;
  --nv-amber: #8a5a12;
  --nv-rust: #b03a26;

  /* VitePress 功能色映射 */
  --vp-c-brand-1: #8a5a12;
  --vp-c-brand-2: #a03826;
  --vp-c-brand-3: #b03a26;
  --vp-c-brand-soft: rgba(154, 107, 30, 0.16);

  --vp-c-bg: var(--nv-bg);
  --vp-c-bg-alt: var(--nv-bg-soft);
  --vp-c-bg-elv: var(--nv-bg-soft);
  --vp-c-bg-soft: var(--nv-bg-soft);
  --vp-c-bg-mute: var(--nv-bg-mute);

  --vp-c-text-1: var(--nv-text-1);
  --vp-c-text-2: var(--nv-text-2);
  --vp-c-text-3: var(--nv-text-3);

  --vp-c-divider: var(--nv-line);
  --vp-c-gutter: var(--nv-line);

  /* 行内代码与代码块 */
  --vp-code-bg: #e0d8bf;
  --vp-code-color: #55603c;
  --vp-code-block-bg: #ddd5bc;
  --vp-code-line-highlight-color: rgba(154, 107, 30, 0.12);

  /* 自定义容器：tip 使用琥珀系，warning/danger 见下 */
  --vp-custom-block-tip-bg: rgba(154, 107, 30, 0.10);
  --vp-custom-block-tip-code-bg: rgba(154, 107, 30, 0.14);
  --vp-custom-block-warning-bg: rgba(154, 107, 30, 0.10);
  --vp-custom-block-warning-code-bg: rgba(154, 107, 30, 0.14);
  --vp-custom-block-danger-bg: rgba(176, 58, 38, 0.08);
  --vp-custom-block-danger-code-bg: rgba(176, 58, 38, 0.12);

  /* 首页 hero：浅色下不用透明渐变文字，直接深橄榄色 */
  --vp-home-hero-name-color: #4c5340;
  --vp-home-hero-name-background: none;
  /* logo 光晕：柔和的琥珀纸光 */
  --vp-home-hero-image-background-image: linear-gradient(
    -45deg,
    rgba(176, 141, 62, 0.35) 30%,
    rgba(154, 107, 30, 0.20)
  );
  --vp-home-hero-image-filter: blur(56px);

  /* nolebase 标题高亮插件 */
  --vp-nolebase-highlight-targeted-heading-bg: rgba(176, 141, 62, 0.35);
}

/* ========== 深色（军用终端 · 完整版） ========== */
.dark {
  /* 调色板 */
  --nv-bg: #0e0f0b;
  --nv-bg-soft: #14160f;
  --nv-bg-mute: #191b12;
  --nv-line: #2a3320;
  --nv-text-1: #d3d9c2;
  --nv-text-2: #a8b391;
  --nv-text-3: #8fa66a;
  --nv-khaki: #cbb58a;
  --nv-amber: #e8b04b;
  --nv-rust: #b03a26;

  /* VitePress 功能色映射
     brand-1 琥珀用于链接/强调文字；brand-2/3 锈红用于主按钮 */
  --vp-c-brand-1: #e8b04b;
  --vp-c-brand-2: #c7452e;
  --vp-c-brand-3: #b03a26;
  --vp-c-brand-soft: rgba(232, 176, 75, 0.14);

  --vp-c-bg: var(--nv-bg);
  --vp-c-bg-alt: var(--nv-bg-soft);
  --vp-c-bg-elv: var(--nv-bg-soft);
  --vp-c-bg-soft: var(--nv-bg-soft);
  --vp-c-bg-mute: var(--nv-bg-mute);

  --vp-c-text-1: var(--nv-text-1);
  --vp-c-text-2: var(--nv-text-2);
  --vp-c-text-3: var(--nv-text-3);

  --vp-c-divider: var(--nv-line);
  --vp-c-gutter: var(--nv-line);

  /* 行内代码与代码块：终端黑底绿字 */
  --vp-code-bg: #1a1d12;
  --vp-code-color: #9db06e;
  --vp-code-block-bg: #0a0b08;
  --vp-code-line-highlight-color: rgba(232, 176, 75, 0.10);

  /* 自定义容器 */
  --vp-custom-block-tip-bg: rgba(232, 176, 75, 0.07);
  --vp-custom-block-tip-code-bg: rgba(232, 176, 75, 0.12);
  --vp-custom-block-warning-bg: rgba(232, 176, 75, 0.08);
  --vp-custom-block-warning-code-bg: rgba(232, 176, 75, 0.12);
  --vp-custom-block-danger-bg: rgba(176, 58, 38, 0.10);
  --vp-custom-block-danger-code-bg: rgba(176, 58, 38, 0.14);

  /* 首页 hero：琥珀磷光文字 + 琥珀光晕 */
  --vp-home-hero-name-color: #e8b04b;
  --vp-home-hero-name-background: none;
  --vp-home-hero-image-background-image: linear-gradient(
    -45deg,
    rgba(232, 176, 75, 0.30) 30%,
    rgba(143, 166, 106, 0.18)
  );
  --vp-home-hero-image-filter: blur(72px);

  /* nolebase 标题高亮插件 */
  --vp-nolebase-highlight-targeted-heading-bg: rgba(232, 176, 75, 0.25);
}

/* logo 光晕模糊半径的响应式调整 */
@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(72px);
  }
}
```

- [ ] **Step 2: 构建验证（本任务的验收门）**

Run: `pnpm build`
Expected: 构建成功，无 CSS 语法错误。`pnpm run update` 与 vitepress build 均通过。

---

### Task 3: 重写 `.vitepress/styles/main.css`（主题组件样式）

**Files:**
- Modify: `.vitepress/styles/main.css`（整体替换，277 行 → 新文件）

**Interfaces:**
- Consumes: Task 1 的字体路径 `/fonts/black-ops-one-latin-regular.woff2`；Task 2 的 `--nv-*` / `--vp-*` 变量
- Produces: 全部视觉装饰样式（扫描线、hero、按钮、features、文档页、自定义容器）

**删除清单**（相对旧文件）： tengwar `@font-face` ×2、旧 hero 字体规则、discord/github 定向按钮样式。
**保留清单**： 触屏高亮修复、VPTeamMembers 高度修复 ×7 条、VPTeamMembers max-width 覆盖、VPFooter 透明度、footer-cc-link、VPDoc 页脚间距、脚注样式、vp-doc h1 间距与链接下划线。

- [ ] **Step 1: 整体替换 main.css 为以下内容**

```css
@import 'kbd.css';

html, body {
  -webkit-tap-highlight-color: transparent; /* 避免触屏下的点击高亮颜色 */
}

/* ==========================================================================
   Black Ops One 军用 stencil 字体（仅拉丁字形，中文自动回退系统黑体）
   ========================================================================== */
@font-face {
  font-family: 'Black Ops One';
  src: url(/fonts/black-ops-one-latin-regular.woff2) format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ==========================================================================
   扫描线（仅深色模式，CRT 终端质感）
   固定定位覆盖全屏，pointer-events: none 不影响交互
   ========================================================================== */
.dark body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 2000;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.12) 0 1px,
    transparent 1px 3px
  );
}

/* ==========================================================================
   首页 Hero
   ========================================================================== */

/* 主标题（glitch 字符 id）：等宽 + 琥珀磷光 */
.VPHomeHero > .container > .main > .name {
  font-family: 'Black Ops One', Consolas, 'Courier New', monospace;
  letter-spacing: 2px;
}

/* 主标题尾部的闪烁方块光标 */
.dark .VPHomeHero > .container > .main > .name::after {
  content: '';
  display: inline-block;
  width: 0.45em;
  height: 0.8em;
  margin-left: 0.15em;
  vertical-align: -0.08em;
  background: var(--nv-amber);
  animation: nv-blink 1.1s steps(1) infinite;
}

@keyframes nv-blink {
  50% { opacity: 0; }
}

/* 副标题（诺文斯克，你始终无法逃离的世界） */
.VPHomeHero > .container > .main > .text {
  color: var(--nv-khaki);
  font-weight: 700;
  letter-spacing: 3px;
}

/* 副标题下方的琥珀警示条纹分隔带 */
.VPHomeHero > .container > .main > .text::after {
  content: '';
  display: block;
  height: 8px;
  width: min(320px, 70%);
  margin: 20px auto 0;
  background: repeating-linear-gradient(
    45deg,
    var(--nv-amber) 0 12px,
    transparent 12px 24px
  );
  opacity: 0.7;
}

/* 介绍行：等宽终端风 */
.VPHomeHero > .container > .main > .tagline {
  font-family: Consolas, 'Courier New', monospace;
  color: var(--nv-text-3);
}

/* 首页标题字号（自适应） */
.VPHomeHero > .container > .main > .name {
  font-size: 3.2rem;
}

.VPHomeHero > .container > .main > .text {
  font-size: 2rem;
  padding-top: 20px;
}

.VPHomeHero > .container > .main > .tagline {
  padding-top: 24px;
}

@media (min-width: 960px) {
  .VPHomeHero > .container > .main > .name {
    font-size: 4rem;
  }

  .VPHomeHero > .container > .main > .text {
    font-size: 2.6rem;
    padding-top: 28px;
  }
}

@media (max-width: 640px) {
  .VPHomeHero > .container > .main > .name {
    font-size: 2.2rem;
  }

  .VPHomeHero > .container > .main > .text {
    font-size: 1.5rem;
    padding-top: 16px;
    letter-spacing: 1px;
  }
}

/* ==========================================================================
   首页按钮
   brand（锈红实底）由 vars.css 的 --vp-c-brand-2/3 驱动；
   此处处理 alt（琥珀描边终端按钮）与等宽字体
   ========================================================================== */
.VPHero .actions .action {
  font-family: Consolas, 'Courier New', monospace;
}

.VPHero .VPButton.alt {
  border-color: var(--nv-amber);
  color: var(--nv-amber);
  background-color: transparent;
  transition: all 0.2s ease;
}

.VPHero .VPButton.alt:hover {
  border-color: var(--nv-amber);
  color: var(--nv-bg);
  background-color: var(--nv-amber);
}

/* alt 按钮文字加终端方括号 */
.VPHero .VPButton.alt .text::before {
  content: '[ ';
}

.VPHero .VPButton.alt .text::after {
  content: ' ]';
}

/* brand 按钮文字加粗 */
.VPHero .VPButton.brand {
  font-weight: 700;
}

/* ==========================================================================
   首页 Features 卡片：终端面板 + 警示条纹顶边
   ========================================================================== */
.VPFeatures .VPFeature {
  border: 1px solid var(--nv-line);
  background-color: var(--nv-bg-soft);
  position: relative;
  overflow: hidden;
}

.VPFeatures .VPFeature::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: repeating-linear-gradient(
    45deg,
    var(--nv-amber) 0 8px,
    transparent 8px 16px
  );
  opacity: 0.55;
}

.VPFeatures .VPFeature .title {
  font-family: Consolas, 'Courier New', monospace;
  color: var(--nv-amber);
}

.VPFeatures .VPFeature .title::before {
  content: '> ';
  color: var(--nv-text-3);
}

.VPFeatures .VPFeature .details {
  color: var(--nv-text-2);
}

/* ==========================================================================
   文档页
   ========================================================================== */

/* h1 终端提示符前缀 */
.vp-doc > div > h1::before {
  content: '> ';
  font-family: Consolas, 'Courier New', monospace;
  color: var(--nv-text-3);
}

/* 代码块：终端面板边框 */
.vp-doc div[class*='language-'] {
  border: 1px solid var(--nv-line);
  border-radius: 5px;
}

/* 侧边栏激活项：琥珀左边条指示 */
.VPSidebarItem .item > .link.is-active > .text {
  border-left: 3px solid var(--nv-amber);
  padding-left: 9px;
  margin-left: -12px;
}

/* warning 自定义容器：左侧琥珀警示条纹 */
.vp-doc .custom-block.warning {
  position: relative;
  border-left: none;
}

.vp-doc .custom-block.warning::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  border-radius: 4px 0 0 4px;
  background: repeating-linear-gradient(
    45deg,
    var(--nv-amber) 0 6px,
    transparent 6px 12px
  );
}

/* danger/caution 自定义容器：左侧锈红警示条纹 */
.vp-doc .custom-block.danger,
.vp-doc .custom-block.caution {
  position: relative;
  border-left: none;
}

.vp-doc .custom-block.danger::before,
.vp-doc .custom-block.caution::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  border-radius: 4px 0 0 4px;
  background: repeating-linear-gradient(
    45deg,
    var(--nv-rust) 0 6px,
    transparent 6px 12px
  );
}

/* 动效敏感用户：禁用光标闪烁 */
@media (prefers-reduced-motion: reduce) {
  .dark .VPHomeHero > .container > .main > .name::after {
    animation: none;
  }
}

/* ==========================================================================
   以下为从旧版保留的无害兼容性补丁
   ========================================================================== */

/* 参考 Vitest：VPTeamMembers 高度修复 */
.VPTeamMembersItem.small .profile .data .affiliation {
  min-height: 3rem;
}

.VPTeamMembersItem.small .profile .data .desc {
  min-height: 3rem;
}

@media (min-width: 1064px) and (max-width: 1143px) {
  .VPTeamMembersItem.small .profile .data .affiliation {
    min-height: 4rem;
  }

  .VPTeamMembersItem.small .profile .data .desc {
    min-height: 4rem;
  }
}

@media (min-width: 815px) and (max-width: 875px) {
  .VPTeamMembersItem.small .profile .data .affiliation {
    min-height: 4rem;
  }

  .VPTeamMembersItem.small .profile .data .desc {
    min-height: 4rem;
  }
}

@media (max-width: 612px) {
  .VPTeamMembersItem.small .profile .data .affiliation {
    min-height: 4rem;
  }

  .VPTeamMembersItem.small .profile .data .desc {
    min-height: 4rem;
  }
}

@media (max-width: 568px) {
  .VPTeamMembersItem.small .profile .data .affiliation {
    min-height: unset;
  }

  .VPTeamMembersItem.small .profile .data .desc {
    min-height: unset;
  }
}

.vp-doc .VPTeamMembers.small.count-2 .container,
.vp-doc .VPTeamMembers.small.count-3 .container {
  max-width: 1152px !important;
}

.VPTeamMembers.medium.count-2 .container {
  max-width: unset;
}

.VPTeamMembers.small.count-2 .container {
  max-width: unset;
}

/* 主页下方的页脚透明度 */
.VPFooter {
  opacity: 0.8;
}

/* 正文结尾的 CC 协议链接 */
.footer-cc-link {
  color: var(--vp-c-text-2);
  transition: all 0.3s ease;
  text-decoration: underline;
  text-decoration-color: rgb(114, 114, 114);
}

.footer-cc-link:hover {
  color: var(--vp-c-text-1);
}

/* 文档页面页脚到正文结尾的间隔 */
.VPDoc .VPDocFooter {
  margin-top: 32px;
}

/* 脚注 */
.footnotes > .footnotes-list {
  margin-top: 32px;
  opacity: 0.9;
  font-size: 12px;
  font-family: sans-serif;
}

.footnotes > .footnotes-list > .footnote-item > p {
  line-height: 18px;
}

/* 正文 h1 标题间距 */
.vp-doc > div > h1 {
  margin-bottom: 16px;
}

.vp-doc a {
  text-decoration: none;
  transition: all 0.3s ease;
}

.vp-doc a:hover {
  text-decoration: underline;
}
```

- [ ] **Step 2: 构建验证（本任务的验收门）**

Run: `pnpm build`
Expected: 构建成功，无 CSS 错误。

---

### Task 4: `config.ts` 与 `index.md` 微调

**Files:**
- Modify: `.vitepress/config.ts:107-124`（defineConfig 头部区域）
- Modify: `.vitepress/config.ts:231-235`（footer 区域）
- Modify: `index.md:14`（hero image alt）

**Interfaces:**
- Consumes: Task 2/3 的深色主题（appearance 默认深色才能体现"深色为主"）
- Produces: 无下游依赖

- [ ] **Step 1: config.ts 增加默认深色外观**

在 `lang: 'zh-CN',`（第 120 行）之后插入一行：

```ts
  lang: 'zh-CN',
  appearance: 'dark',
```

- [ ] **Step 2: config.ts 修改 theme-color meta**

将第 126-127 行：

```ts
      name: 'theme-color',
      content: '#ffffff',
```

改为：

```ts
      name: 'theme-color',
      content: '#0e0f0b',
```

- [ ] **Step 3: config.ts 修改 footer 版权文案**

将第 232-234 行：

```ts
      message: '用 <span style="color: #e25555;">&#9829;</span> 撰写',
      copyright:
        '<a class="footer-cc-link" target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> © 2022-PRESENT Nólëbase 的创作者们',
```

改为：

```ts
      message: '用 <span style="color: #e25555;">&#9829;</span> 撰写',
      copyright:
        '<a class="footer-cc-link" target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> © Samuel是不是好奇猫',
```

- [ ] **Step 4: index.md 修正 hero 图片 alt**

将第 12-14 行：

```yaml
  image:
    src: /logo.png
    alt: Vitest
```

改为：

```yaml
  image:
    src: /logo.png
    alt: Norvinsk Stalker Logo
```

- [ ] **Step 5: 构建验证（本任务的验收门）**

Run: `pnpm build`
Expected: 构建成功；`grep -n "appearance" .vitepress/config.ts` 能匹配到 `appearance: 'dark',`。

---

### Task 5: 全场景目检（人工验收）

**Files:**
- 无改动，纯验证任务

**Interfaces:**
- Consumes: Task 1-4 的全部产物
- Produces: 验收结论（通过 / 问题清单）

- [ ] **Step 1: 启动 dev 服务器**

Run: `pnpm dev`
Expected: VitePress dev server 启动（默认 http://localhost:5173），无报错。

- [ ] **Step 2: 逐场景目检（对照清单逐项确认）**

| # | 场景 | 检查点 |
|---|---|---|
| 1 | 首页 · 深色 | 琥珀 glitch 标题 + 闪烁光标、警示条纹分隔带、锈红主按钮、琥珀描边 alt 按钮（带 `[ ]`）、features 卡片条纹顶边、logo 琥珀光晕、全屏扫描线 |
| 2 | 首页 · 浅色 | 卡其纸底、深橄榄文字、无扫描线、按钮对比度可读 |
| 3 | 文档页 · 深色 | `>` 前缀 h1、琥珀链接、终端风代码块（黑底绿字 + 边框）、侧栏激活项琥珀左边条 |
| 4 | 文档页 · 浅色 | 正文/链接/代码块对比度可读 |
| 5 | 自定义容器 | 含 `::: warning` / `::: danger` 的页面（如安装手册），警示条纹左边条正常显示 |
| 6 | 插件页 | `/toc`（最近更新）、文档页底部 Git 日志/贡献者组件，颜色不冲突 |
| 7 | 移动端 | 390px 宽度：hero 字号、按钮换行、features 单列 |

- [ ] **Step 3: 最终构建确认**

Run: `pnpm build`
Expected: 构建成功（All-Clear），`.vitepress/dist` 产出正常。

---

## Self-Review 记录

- **Spec 覆盖**： 调色板（Task 2）、字体（Task 1/3）、扫描线/条纹/光标/光晕（Task 2/3）、浅色简化版（Task 2）、hero alt 修正（Task 4）、appearance/theme-color/footer（Task 4）、验证（Task 5）——spec 第 3 节改动清单 5 项全覆盖。
- **占位符扫描**： 无 TBD/TODO，所有代码完整。
- **类型一致性**： `--nv-*` 变量名在 vars.css 定义与 main.css 消费之间逐一核对一致；字体文件名 Task 1 产出与 Task 3 `@font-face` 引用一致（`black-ops-one-latin-regular.woff2`）。
- **与默认规则的偏差**： 按用户全局规则取消所有 commit 步骤；CSS 无单测设施，验收以 `pnpm build` + 人工目检替代 TDD 循环。

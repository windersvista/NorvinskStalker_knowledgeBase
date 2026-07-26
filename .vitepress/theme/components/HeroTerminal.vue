<script setup lang="ts">
// 首页终端风 Hero：居中构图，还原 style-hybrid-v2 mockup 的 HOMEPAGE 区块
// 数据来源：index.md frontmatter（hero.* 与 title），保持 markdown 为单一数据来源
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter } = useData()

// frontmatter.hero 整体
const hero = computed(() => frontmatter.value.hero ?? {})

// 大标题使用 frontmatter.title（'Norvinsk Stalker'）
const title = computed(() => frontmatter.value.title ?? '')

// hero.image 兼容字符串与 { src, alt } 两种写法
const logoSrc = computed(() => {
  const img = hero.value.image
  if (!img) return ''
  return typeof img === 'string' ? img : img.src
})

const logoAlt = computed(() => {
  const img = hero.value.image
  if (!img || typeof img === 'string') return ''
  return img.alt ?? ''
})

// 按钮阵列
const actions = computed(() => (hero.value.actions ?? []) as Array<{
  theme?: string
  text: string
  link: string
}>)

// 判断外部链接（新标签页打开）
function isExternal(link: string): boolean {
  return /^https?:\/\//.test(link)
}

// 内部链接走 withBase 兼容 base 部署路径；外部链接原样输出
function resolveLink(link: string): string {
  return isExternal(link) ? link : withBase(link)
}
</script>

<template>
  <section class="hero-terminal" aria-label="站点首页横幅">
    <!-- 小号 logo：琥珀光晕 -->
    <div v-if="logoSrc" class="hero-logo">
      <img :src="logoSrc" :alt="logoAlt" />
    </div>

    <!-- 装饰性启动日志：hero.name 的乱码串作为 SESSION ID 彩蛋 -->
    <div class="hero-boot" aria-hidden="true">
      <p class="boot-line"><span class="prompt">&gt;</span> NORVINSK TERMINAL // UPLINK ESTABLISHED</p>
      <p v-if="hero.name" class="boot-line"><span class="prompt">&gt;</span> SESSION: {{ hero.name }}</p>
    </div>

    <!-- 大标题：Black Ops One stencil + 磷光 + 闪烁方块光标 -->
    <h1 class="hero-title">
      {{ title }}<span class="cursor" aria-hidden="true"></span>
    </h1>

    <!-- 琥珀警示条纹分隔带 -->
    <div class="hero-stripe" aria-hidden="true"></div>

    <!-- 中文副标题（卡其色） -->
    <p v-if="hero.text" class="hero-text">{{ hero.text }}</p>

    <!-- tagline（等宽、muted） -->
    <p v-if="hero.tagline" class="hero-tagline">{{ hero.tagline }}</p>

    <!-- 按钮阵列：brand=锈红实底，alt=琥珀描边带方括号 -->
    <div v-if="actions.length" class="hero-actions">
      <a
        v-for="action in actions"
        :key="action.link"
        class="hero-btn"
        :class="action.theme === 'brand' ? 'brand' : 'alt'"
        :href="resolveLink(action.link)"
        :target="isExternal(action.link) ? '_blank' : undefined"
        :rel="isExternal(action.link) ? 'noopener noreferrer' : undefined"
      >{{ action.text }}</a>
    </div>
  </section>
</template>

<style scoped>
/* 整体：居中构图，垂直节奏紧凑 */
.hero-terminal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 72px 24px 48px;
  max-width: 960px;
  margin: 0 auto;
}

/* ---------- logo ---------- */
.hero-logo img {
  width: clamp(100px, 16vw, 130px);
  height: auto;
  display: block;
}

/* 琥珀光晕仅深色模式（浅色为军事文件风，去光晕） */
:global(.dark) .hero-logo img {
  filter: drop-shadow(0 0 18px rgba(232, 176, 75, 0.35));
}

/* ---------- 启动日志 ---------- */
.hero-boot {
  margin-top: 28px;
  font-family: Consolas, 'Courier New', monospace;
  font-size: 0.8rem;
  line-height: 1.7;
  color: var(--nv-text-3);
  letter-spacing: 1px;
}

.boot-line {
  margin: 0;
}

.prompt {
  color: var(--nv-amber);
}

/* ---------- 大标题 ---------- */
.hero-title {
  margin: 24px 0 0;
  font-family: 'Black Ops One', 'Arial Black', Impact, sans-serif;
  font-size: clamp(2.2rem, 7vw, 4.2rem);
  font-weight: 400;
  line-height: 1.15;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--nv-amber);
}

/* 磷光 text-shadow 仅深色模式 */
:global(.dark) .hero-title {
  text-shadow:
    0 0 18px rgba(232, 176, 75, 0.45),
    0 0 46px rgba(232, 176, 75, 0.18);
}

/* 闪烁方块光标 */
.cursor {
  display: inline-block;
  width: 0.45em;
  height: 0.8em;
  margin-left: 0.15em;
  vertical-align: -0.08em;
  background: var(--nv-amber);
  animation: nv-hero-blink 1.1s steps(1) infinite;
}

@keyframes nv-hero-blink {
  50% { opacity: 0; }
}

/* 动效敏感用户：光标静止 */
@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
  }
}

/* ---------- 琥珀警示条纹分隔带 ---------- */
.hero-stripe {
  margin-top: 28px;
  height: 8px;
  width: min(320px, 70%);
  background: repeating-linear-gradient(
    45deg,
    var(--nv-amber) 0 12px,
    transparent 12px 24px
  );
  opacity: 0.7;
}

/* ---------- 中文副标题（卡其） ---------- */
.hero-text {
  margin: 24px 0 0;
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--nv-khaki);
}

/* ---------- tagline（等宽 muted） ---------- */
.hero-tagline {
  margin: 18px auto 0;
  max-width: 640px;
  font-family: Consolas, 'Courier New', monospace;
  font-size: 0.92rem;
  line-height: 1.8;
  color: var(--nv-text-3);
}

/* ---------- 按钮阵列 ---------- */
.hero-actions {
  margin-top: 36px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 760px;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  font-family: Consolas, 'Courier New', monospace;
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.4;
  border-radius: 3px; /* 扁平小圆角，禁止胶囊 */
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

/* brand：锈红扁平矩形主按钮（--vp-c-brand-2 为映射的 hover 亮色） */
.hero-btn.brand {
  background-color: var(--nv-rust);
  border: 1px solid var(--nv-rust);
  color: #ffffff;
  font-weight: 700;
}

.hero-btn.brand:hover {
  background-color: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
  color: #ffffff;
}

/* alt：琥珀描边终端按钮，带 [ ] 方括号 */
.hero-btn.alt {
  background-color: transparent;
  border: 1px solid var(--nv-amber);
  color: var(--nv-amber);
}

.hero-btn.alt:hover {
  background-color: var(--nv-amber);
  border-color: var(--nv-amber);
  color: var(--nv-bg);
}

.hero-btn.alt::before {
  content: '[ ';
}

.hero-btn.alt::after {
  content: ' ]';
}

/* ---------- 响应式：移动端标题降级、按钮纵向堆叠 ---------- */
@media (max-width: 640px) {
  .hero-terminal {
    padding: 48px 20px 32px;
  }

  .hero-text {
    letter-spacing: 1px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 340px;
  }

  .hero-btn {
    width: 100%;
  }
}
</style>

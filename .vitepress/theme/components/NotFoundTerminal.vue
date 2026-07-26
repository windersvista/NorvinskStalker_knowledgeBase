<script setup lang="ts">
// 404 终端页：由 DefaultTheme.Layout 的 'not-found' 插槽挂载
// 深色完整体验（琥珀磷光），浅色简化（变量自动适配，无发光特效）
import { withBase } from 'vitepress'

// 兼容 base 部署路径的主页链接
const home = withBase('/')
</script>

<template>
  <div class="nf-terminal">
    <div class="nf-code">404</div>
    <div class="nf-title">信号丢失 // SIGNAL LOST</div>
    <p class="nf-desc">你在诺文斯克迷路了。这片区域没有撤离点——但主页有。</p>
    <a class="nf-btn" :href="home">[ 返回基地（主页） ]</a>
  </div>
</template>

<style scoped>
/* 居中布局 */
.nf-terminal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 48px 24px;
  text-align: center;
}

/* 大号 404：Black Ops One 军用 stencil 字体（中文自动回退系统黑体） */
.nf-code {
  font-family: 'Black Ops One', Consolas, 'Courier New', monospace;
  font-size: 120px;
  line-height: 1;
  letter-spacing: 8px;
  color: var(--nv-amber);
  user-select: none;
}

/* 深色模式：琥珀磷光 */
:global(.dark) .nf-code {
  text-shadow:
    0 0 12px rgba(232, 176, 75, 0.55),
    0 0 48px rgba(232, 176, 75, 0.25);
}

/* 标题：等宽终端风 */
.nf-title {
  margin-top: 24px;
  font-family: Consolas, 'Courier New', monospace;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--nv-text-1);
}

/* 描述文字 */
.nf-desc {
  margin-top: 12px;
  font-size: 14px;
  color: var(--nv-text-2);
}

/* 琥珀描边按钮 */
.nf-btn {
  margin-top: 32px;
  display: inline-block;
  padding: 10px 28px;
  border: 1px solid var(--nv-amber);
  border-radius: 4px;
  font-family: Consolas, 'Courier New', monospace;
  font-size: 14px;
  letter-spacing: 1px;
  color: var(--nv-amber);
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nf-btn:hover {
  background-color: var(--nv-amber);
  color: var(--nv-bg);
  text-decoration: none;
}

/* 移动端适配：缩小字号、收紧间距 */
@media (max-width: 640px) {
  .nf-code {
    font-size: 72px;
    letter-spacing: 4px;
  }

  .nf-title {
    font-size: 15px;
  }

  .nf-btn {
    padding: 8px 20px;
    font-size: 13px;
  }
}
</style>

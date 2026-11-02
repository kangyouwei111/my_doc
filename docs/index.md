---
layout: home

hero:
  name: MyDocs
  text: 把复杂工作写成清晰、可执行的文档
  tagline: 一套轻量的团队知识库模板。用 Markdown 记录决策、沉淀流程，让每个人都能快速找到下一步。
  image:
    src: /logo.svg
    alt: MyDocs 文档标志
  actions:
    - theme: brand
      text: 开始阅读
      link: '#protected:/guide/what-is-papertrail'
    - theme: alt
      text: 5 分钟快速开始
      link: '#protected:/guide/quick-start'

features:
  - icon: ◇
    title: 先建立共同语境
    details: 用简短的概念说明和决策记录，减少重复沟通与隐性知识。
  - icon: →
    title: 让流程可以复用
    details: 把经验整理成清单和工作流，新成员也能沿着步骤完成任务。
  - icon: ✓
    title: 发布即保持可信
    details: 每次变更都可追溯、可评审，并通过 GitHub Actions 自动发布。
---

<script setup>
import { ref } from 'vue'

const copied = ref(false)

async function copyCommand() {
  await navigator.clipboard.writeText('pnpm install && pnpm dev')
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1800)
}
</script>

<div class="home-note">
  <div>
    <span class="home-note__eyebrow">QUICK START</span>
    <strong>从一条命令开始</strong>
    <p>克隆仓库、安装依赖，然后打开本地预览。</p>
  </div>
  <button class="home-note__command" type="button" @click="copyCommand" :aria-label="copied ? '命令已复制' : '复制安装命令'">
    <code>pnpm install && pnpm dev</code>
    <span>{{ copied ? '已复制' : '复制' }}</span>
  </button>
</div>

<style>
.home-note { display: flex; align-items: center; justify-content: space-between; gap: 24px; max-width: 960px; margin: 12px auto 0; padding: 22px 24px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-elv); text-align: left; }
.home-note__eyebrow { display: block; margin-bottom: 5px; color: var(--vp-c-brand-1); font-size: 11px; font-weight: 750; letter-spacing: .12em; }
.home-note strong { display: block; color: var(--vp-c-text-1); font-size: 16px; }
.home-note p { margin: 4px 0 0; color: var(--vp-c-text-2); font-size: 13px; }
.home-note__command { display: flex; align-items: center; gap: 16px; flex-shrink: 0; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 6px; color: var(--vp-c-brand-1); background: var(--vp-c-bg-alt); cursor: pointer; font: inherit; }
.home-note__command:hover { border-color: var(--vp-c-brand-1); }
.home-note__command code { color: var(--vp-c-text-1); font-size: 12px; }
.home-note__command span { font-size: 12px; font-weight: 700; }
@media (max-width: 640px) { .home-note { align-items: stretch; flex-direction: column; } .home-note__command { justify-content: space-between; } }
</style>

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
      link: '#protected-entry'
    - theme: alt
      text: 5 分钟快速开始
      link: /guide/quick-start

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
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const copied = ref(false)
const isPasswordDialogOpen = ref(false)
const password = ref('')
const passwordError = ref('')
const isCheckingPassword = ref(false)
const passwordInput = ref(null)

const passwordConfigUrl = `${import.meta.env.BASE_URL}password-config.json`

async function hashPassword(value) {
  const encoded = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function openPasswordDialog(event) {
  event?.preventDefault()
  isPasswordDialogOpen.value = true
  password.value = ''
  passwordError.value = ''
  nextTick(() => passwordInput.value?.focus())
}

function closePasswordDialog() {
  if (isCheckingPassword.value) return
  isPasswordDialogOpen.value = false
}

async function verifyPassword() {
  if (isCheckingPassword.value) return

  const enteredPassword = password.value
  if (!enteredPassword) {
    passwordError.value = '请输入密码。'
    nextTick(() => passwordInput.value?.focus())
    return
  }

  isCheckingPassword.value = true
  passwordError.value = ''

  try {
    const response = await fetch(`${passwordConfigUrl}?t=${Date.now()}`, {
      cache: 'no-store',
      credentials: 'omit'
    })

    if (!response.ok) {
      throw new Error(`Password source returned ${response.status}`)
    }

    const data = await response.json()
    const expectedHash = data?.hash

    if (data?.algorithm !== 'SHA-256' || typeof expectedHash !== 'string') {
      throw new Error('Password hash configuration is invalid')
    }

    if (await hashPassword(enteredPassword) !== expectedHash) {
      passwordError.value = '密码不正确，请重试。'
      password.value = ''
      nextTick(() => passwordInput.value?.focus())
      return
    }

    window.location.assign(`${import.meta.env.BASE_URL}guide/what-is-papertrail`)
  } catch (error) {
    console.error('Unable to verify the reading password.', error)
    passwordError.value = '暂时无法读取密码，请稍后重试。'
  } finally {
    isCheckingPassword.value = false
  }
}

function handleProtectedEntryClick(event) {
  const target = event.target
  if (target instanceof Element) {
    const link = target.closest('a[href="#protected-entry"]')
    if (link) openPasswordDialog(event)
  }
}

function handleEscape(event) {
  if (event.key === 'Escape') closePasswordDialog()
}

onMounted(() => {
  document.addEventListener('click', handleProtectedEntryClick)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleProtectedEntryClick)
  document.removeEventListener('keydown', handleEscape)
})

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

<div v-if="isPasswordDialogOpen" class="password-dialog" role="presentation" @click.self="closePasswordDialog">
  <section class="password-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="password-dialog-title">
    <div class="password-dialog__header">
      <div>
        <span class="password-dialog__eyebrow">RESTRICTED READING</span>
        <h2 id="password-dialog-title">输入阅读密码</h2>
      </div>
      <button class="password-dialog__close" type="button" aria-label="关闭密码弹框" @click="closePasswordDialog">×</button>
    </div>
    <p class="password-dialog__description">验证通过后即可打开 Papertrail 指南。</p>
    <form @submit.prevent="verifyPassword">
      <label class="password-dialog__label" for="reading-password">密码</label>
      <input
        id="reading-password"
        ref="passwordInput"
        v-model="password"
        class="password-dialog__input"
        type="password"
        inputmode="text"
        autocomplete="current-password"
        placeholder="请输入密码"
        :disabled="isCheckingPassword"
        @keydown.enter.prevent="verifyPassword"
      >
      <p v-if="passwordError" class="password-dialog__error" role="alert">{{ passwordError }}</p>
      <div class="password-dialog__actions">
        <button class="password-dialog__cancel" type="button" :disabled="isCheckingPassword" @click="closePasswordDialog">取消</button>
        <button class="password-dialog__submit" type="submit" :disabled="isCheckingPassword">
          {{ isCheckingPassword ? '验证中…' : '确认进入' }}
        </button>
      </div>
    </form>
  </section>
</div>

<style>
.home-note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: 960px;
  margin: 12px auto 0;
  padding: 22px 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-elv);
  text-align: left;
}

.home-note__eyebrow {
  display: block;
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .12em;
  margin-bottom: 5px;
}

.home-note strong {
  display: block;
  color: var(--vp-c-text-1);
  font-size: 16px;
}

.home-note p {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.home-note__command {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-alt);
  cursor: pointer;
  font: inherit;
}

.home-note__command:hover {
  border-color: var(--vp-c-brand-1);
}

.home-note__command code {
  color: var(--vp-c-text-1);
  font-size: 12px;
}

.home-note__command span {
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 640px) {
  .home-note {
    align-items: stretch;
    flex-direction: column;
  }

  .home-note__command {
    justify-content: space-between;
  }
}

.password-dialog {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(17, 24, 22, .52);
}

.password-dialog__panel {
  width: min(100%, 420px);
  padding: 26px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-elv);
  box-shadow: 0 22px 70px rgba(17, 24, 22, .2);
}

.password-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.password-dialog__eyebrow {
  display: block;
  margin-bottom: 6px;
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .1em;
}

.password-dialog h2 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 22px;
  letter-spacing: -.02em;
}

.password-dialog__description {
  margin: 16px 0 22px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.password-dialog__close {
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.password-dialog__close:hover,
.password-dialog__cancel:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.password-dialog__label {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 650;
}

.password-dialog__input {
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  outline: none;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font: inherit;
}

.password-dialog__input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.password-dialog__error {
  margin: 10px 0 0;
  color: #b54242;
  font-size: 13px;
}

.password-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.password-dialog__cancel,
.password-dialog__submit {
  min-height: 38px;
  padding: 0 15px;
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
}

.password-dialog__cancel {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  background: transparent;
}

.password-dialog__submit {
  border: 1px solid var(--vp-c-brand-1);
  color: #fff;
  background: var(--vp-c-brand-1);
}

.password-dialog__submit:hover {
  background: var(--vp-c-brand-2);
}

.password-dialog__cancel:disabled,
.password-dialog__submit:disabled,
.password-dialog__input:disabled {
  cursor: not-allowed;
  opacity: .65;
}
</style>

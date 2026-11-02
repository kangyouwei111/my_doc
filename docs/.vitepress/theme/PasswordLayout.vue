<script setup>
import { nextTick, ref } from 'vue'
import DefaultTheme from 'vitepress/theme'

const isOpen = ref(false)
const password = ref('')
const errorMessage = ref('')
const isChecking = ref(false)
const passwordInput = ref(null)
const pendingDestination = ref('')
let pendingMenuButton = null
let bypassNextClick = false
let unlockedMenuLink = false

const passwordConfigUrl = `${import.meta.env.BASE_URL}password-config.json`

function resolveProtectedDestination(href) {
  const value = href.slice('#protected:'.length)
  if (/^https?:\/\//.test(value)) return value
  return `${window.location.origin}${import.meta.env.BASE_URL}${value.replace(/^\//, '')}`
}

async function hashPassword(value) {
  const encoded = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function openDialog(event, destination = '', menuButton = null) {
  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation()
  pendingDestination.value = destination
  pendingMenuButton = menuButton
  password.value = ''
  errorMessage.value = ''
  isOpen.value = true
  nextTick(() => passwordInput.value?.focus())
  window.setTimeout(() => {
    if (window.location.hash.startsWith('#protected:')) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    }
  }, 0)
}

function closeDialog() {
  if (isChecking.value) return
  isOpen.value = false
  pendingDestination.value = ''
  pendingMenuButton = null
}

function handleClick(event) {
  if (bypassNextClick) {
    bypassNextClick = false
    return
  }

  const target = event.target
  if (!(target instanceof Element)) return

  const menuButton = target.closest('.VPNavBarMenuGroup > button')
  if (menuButton && menuButton.textContent?.includes('更多')) {
    openDialog(event, '', menuButton)
    return
  }

  const link = target.closest('a')
  if (!link || link.closest('.VPNavBarTitle')) return

  const href = link.getAttribute('href') || ''
  if (!href.startsWith('#protected:')) return

  const destination = resolveProtectedDestination(href)

  if (unlockedMenuLink && link.closest('.VPMenu')) {
    unlockedMenuLink = false
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    window.location.assign(destination)
    return
  }

  openDialog(event, destination)
}

async function verifyPassword() {
  if (isChecking.value) return

  if (!password.value) {
    errorMessage.value = '请输入密码。'
    nextTick(() => passwordInput.value?.focus())
    return
  }

  isChecking.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${passwordConfigUrl}?t=${Date.now()}`, { cache: 'no-store', credentials: 'omit' })
    if (!response.ok) throw new Error(`Password config returned ${response.status}`)

    const data = await response.json()
    if (data?.algorithm !== 'SHA-256' || typeof data?.hash !== 'string') {
      throw new Error('Password hash configuration is invalid')
    }

    if (await hashPassword(password.value) !== data.hash) {
      errorMessage.value = '密码不正确，请重试。'
      password.value = ''
      nextTick(() => passwordInput.value?.focus())
      return
    }

    const destination = pendingDestination.value
    const menuButton = pendingMenuButton
    isOpen.value = false
    pendingDestination.value = ''
    pendingMenuButton = null

    if (destination) {
      window.location.assign(destination)
      return
    }

    if (menuButton) {
      bypassNextClick = true
      unlockedMenuLink = true
      nextTick(() => menuButton.click())
    }
  } catch (error) {
    console.error('Unable to verify the reading password.', error)
    errorMessage.value = '暂时无法读取密码，请稍后重试。'
  } finally {
    isChecking.value = false
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeDialog()
}
</script>

<template>
  <div class="password-layout" @click.capture="handleClick" @keydown="handleKeydown">
    <DefaultTheme.Layout />

    <div v-if="isOpen" class="password-dialog" role="presentation" @click.self="closeDialog">
      <section class="password-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="password-dialog-title">
        <div class="password-dialog__header">
          <div>
            <span class="password-dialog__eyebrow">RESTRICTED READING</span>
            <h2 id="password-dialog-title">输入阅读密码</h2>
          </div>
          <button class="password-dialog__close" type="button" aria-label="关闭密码弹框" @click="closeDialog">×</button>
        </div>
        <p class="password-dialog__description">验证通过后即可打开所选内容。</p>
        <form @submit.prevent="verifyPassword">
          <label class="password-dialog__label" for="reading-password">密码</label>
          <input id="reading-password" ref="passwordInput" v-model="password" class="password-dialog__input" type="password" autocomplete="current-password" placeholder="请输入密码" :disabled="isChecking">
          <p v-if="errorMessage" class="password-dialog__error" role="alert">{{ errorMessage }}</p>
          <div class="password-dialog__actions">
            <button class="password-dialog__cancel" type="button" :disabled="isChecking" @click="closeDialog">取消</button>
            <button class="password-dialog__submit" type="submit" :disabled="isChecking">{{ isChecking ? '验证中…' : '确认进入' }}</button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.password-layout { min-height: 100vh; }
.password-dialog { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 24px; background: rgba(17, 24, 22, .52); }
.password-dialog__panel { width: min(100%, 420px); padding: 26px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-elv); box-shadow: 0 22px 70px rgba(17, 24, 22, .2); }
.password-dialog__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.password-dialog__eyebrow { display: block; margin-bottom: 6px; color: var(--vp-c-brand-1); font-size: 11px; font-weight: 750; letter-spacing: .1em; }
.password-dialog h2 { margin: 0; color: var(--vp-c-text-1); font-size: 22px; letter-spacing: -.02em; }
.password-dialog__description { margin: 16px 0 22px; color: var(--vp-c-text-2); font-size: 14px; }
.password-dialog__close { width: 30px; height: 30px; padding: 0; border: 1px solid var(--vp-c-divider); border-radius: 6px; color: var(--vp-c-text-2); background: transparent; cursor: pointer; font-size: 20px; line-height: 1; }
.password-dialog__close:hover, .password-dialog__cancel:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.password-dialog__label { display: block; margin-bottom: 8px; color: var(--vp-c-text-1); font-size: 13px; font-weight: 650; }
.password-dialog__input { box-sizing: border-box; width: 100%; height: 44px; padding: 0 12px; border: 1px solid var(--vp-c-divider); border-radius: 6px; outline: none; color: var(--vp-c-text-1); background: var(--vp-c-bg); font: inherit; }
.password-dialog__input:focus { border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 3px var(--vp-c-brand-soft); }
.password-dialog__error { margin: 10px 0 0; color: #b54242; font-size: 13px; }
.password-dialog__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.password-dialog__cancel, .password-dialog__submit { min-height: 38px; padding: 0 15px; border-radius: 6px; cursor: pointer; font: inherit; font-size: 13px; font-weight: 650; }
.password-dialog__cancel { border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); background: transparent; }
.password-dialog__submit { border: 1px solid var(--vp-c-brand-1); color: #fff; background: var(--vp-c-brand-1); }
.password-dialog__submit:hover { background: var(--vp-c-brand-2); }
.password-dialog__cancel:disabled, .password-dialog__submit:disabled, .password-dialog__input:disabled { cursor: not-allowed; opacity: .65; }
</style>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useAppI18n } from '~/composables/useAppI18n'

type NoticeKind = 'install' | 'update' | 'offline-ready' | 'offline'

interface PwaClient {
  showInstallPrompt: boolean
  isPWAInstalled: boolean
  needRefresh: boolean
  offlineReady: boolean
  install: () => Promise<void>
  cancelInstall: () => void
  cancelPrompt: () => Promise<void>
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>
}

const { $pwa } = useNuxtApp()
const pwa = $pwa as unknown as PwaClient | undefined
const { t } = useAppI18n()
const isOnline = ref(true)
const dismissed = reactive<Record<NoticeKind, boolean>>({
  install: false,
  update: false,
  'offline-ready': false,
  offline: false,
})

const noticeKind = computed<NoticeKind | null>(() => {
  if (!isOnline.value && !dismissed.offline) return 'offline'
  if (pwa?.needRefresh && !dismissed.update) return 'update'
  if (pwa?.showInstallPrompt && !pwa.isPWAInstalled && !dismissed.install) return 'install'
  if (pwa?.offlineReady && !dismissed['offline-ready']) return 'offline-ready'
  return null
})

const noticeCopy = computed(() => {
  switch (noticeKind.value) {
    case 'install':
      return { icon: '↓', title: t('pwa.installTitle'), body: t('pwa.installBody') }
    case 'update':
      return { icon: '↻', title: t('pwa.updateTitle'), body: t('pwa.updateBody') }
    case 'offline-ready':
      return { icon: '✓', title: t('pwa.offlineReadyTitle'), body: t('pwa.offlineReadyBody') }
    case 'offline':
      return { icon: '!', title: t('pwa.offlineTitle'), body: t('pwa.offlineBody') }
    default:
      return null
  }
})

function updateConnectionStatus() {
  isOnline.value = navigator.onLine
  if (isOnline.value) dismissed.offline = false
}

function dismiss() {
  const kind = noticeKind.value
  if (!kind) return
  dismissed[kind] = true
  if (kind === 'install') pwa?.cancelInstall()
  if (kind === 'update' || kind === 'offline-ready') void pwa?.cancelPrompt()
}

async function installApp() {
  await pwa?.install()
  dismissed.install = true
}

async function applyUpdate() {
  await pwa?.updateServiceWorker(true)
}

onMounted(() => {
  updateConnectionStatus()
  window.addEventListener('online', updateConnectionStatus)
  window.addEventListener('offline', updateConnectionStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateConnectionStatus)
  window.removeEventListener('offline', updateConnectionStatus)
})
</script>

<template>
  <Transition name="pwa-notice">
    <aside
      v-if="noticeKind && noticeCopy"
      class="pwa-status-notice glass-surface"
      role="status"
      aria-live="polite"
    >
      <span class="pwa-status-notice__icon" aria-hidden="true">
        {{ noticeCopy.icon }}
      </span>
      <span class="pwa-status-notice__copy">
        <strong>{{ noticeCopy.title }}</strong>
        <small>{{ noticeCopy.body }}</small>
      </span>
      <button
        v-if="noticeKind === 'install'"
        type="button"
        class="pwa-status-notice__action"
        @click="installApp"
      >
        {{ t('pwa.install') }}
      </button>
      <button
        v-else-if="noticeKind === 'update'"
        type="button"
        class="pwa-status-notice__action"
        @click="applyUpdate"
      >
        {{ t('pwa.update') }}
      </button>
      <button
        type="button"
        class="pwa-status-notice__close"
        :aria-label="t('common.close')"
        @click="dismiss"
      >
        ×
      </button>
    </aside>
  </Transition>
</template>

<style scoped>
.pwa-status-notice {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1100;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  gap: 0.75rem;
  align-items: center;
  width: min(31rem, calc(100vw - 2rem));
  padding: 0.8rem;
  border: 0.0625rem solid rgb(var(--v-theme-primary) / 20%);
  box-shadow: 0 1rem 2.5rem rgb(34 9 17 / 18%);
}

.pwa-status-notice__icon {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-primary) / 10%);
  border-radius: 999px;
  font-size: 1.25rem;
  font-weight: 700;
}

.pwa-status-notice__copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.pwa-status-notice__copy strong {
  font-size: 0.78rem;
}

.pwa-status-notice__copy small {
  margin-top: 0.1rem;
  font-size: 0.68rem;
  line-height: 1.45;
  opacity: 0.68;
}

.pwa-status-notice__action,
.pwa-status-notice__close {
  display: inline-grid;
  min-height: 2.25rem;
  place-items: center;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  border: 0;
  border-radius: 999px;
}

.pwa-status-notice__action {
  padding: 0.5rem 0.85rem;
  color: white;
  /* Keep white text accessible in both themes; the dark Vuetify primary is a
     pale pink intended for text, not a button background. */
  background: #8b2942;
}

.pwa-status-notice__close {
  width: 2.25rem;
  padding: 0;
  color: inherit;
  font-size: 1.15rem;
  background: transparent;
}

.pwa-status-notice__action:focus-visible,
.pwa-status-notice__close:focus-visible {
  outline: 0.125rem solid currentColor;
  outline-offset: 0.125rem;
}

.pwa-notice-enter-active,
.pwa-notice-leave-active {
  transition: opacity 0.2s var(--motion-ease-out), transform 0.24s var(--motion-ease-out);
}

.pwa-notice-enter-from,
.pwa-notice-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}

@media (max-width: 59.95rem) {
  .pwa-status-notice {
    bottom: calc(5.75rem + env(safe-area-inset-bottom, 0rem));
  }
}

@media (max-width: 37.5rem) {
  .pwa-status-notice {
    left: 0.75rem;
    right: 0.75rem;
    grid-template-columns: auto minmax(0, 1fr) auto;
    width: auto;
  }

  .pwa-status-notice__action {
    grid-column: 2;
    justify-self: start;
  }

  .pwa-status-notice__close {
    grid-column: 3;
    grid-row: 1;
  }
}
</style>

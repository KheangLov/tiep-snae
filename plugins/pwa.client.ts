import { registerSW } from 'virtual:pwa-register'
import { reactive, ref } from 'vue'

const INSTALL_DISMISSED_KEY = 'tiep-snae:pwa-install-dismissed'
const REGISTRATION_GRACE_MS = 8_000
const UPDATE_INTERVAL_MS = 60 * 60 * 1_000

interface DeferredInstallPrompt extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<unknown>
}

export default defineNuxtPlugin((nuxtApp) => {
  const showInstallPrompt = ref(false)
  const isPWAInstalled = ref(window.matchMedia('(display-mode: standalone)').matches)
  const needRefresh = ref(false)
  const offlineReady = ref(false)
  const swActivated = ref(false)
  const registrationError = ref(false)

  let deferredInstallPrompt: DeferredInstallPrompt | undefined
  let registration: ServiceWorkerRegistration | undefined
  let updateRegistration: ((reloadPage?: boolean) => Promise<void>) | undefined
  let registrationPromise: Promise<void> | undefined
  let updateTimer: number | undefined

  function markRegistrationActive(candidate?: ServiceWorkerRegistration) {
    registration = candidate
    if (!candidate) return

    if (candidate.active?.state === 'activated') {
      swActivated.value = true
      return
    }

    candidate.installing?.addEventListener('statechange', (event) => {
      const worker = event.target as ServiceWorker
      swActivated.value = worker.state === 'activated'
    })
  }

  function registerServiceWorker(): Promise<void> {
    if (registrationPromise) return registrationPromise

    registrationPromise = Promise.resolve().then(() => {
      updateRegistration = registerSW({
        immediate: true,
        onNeedRefresh() {
          needRefresh.value = true
        },
        onOfflineReady() {
          offlineReady.value = true
        },
        onRegisterError(error) {
          registrationError.value = true
          void nuxtApp.hooks.callHook('service-worker:registration-failed', { error })
        },
        onRegisteredSW(url, candidate) {
          markRegistrationActive(candidate)
          void nuxtApp.hooks.callHook('service-worker:registered', { url, registration: candidate })

          if (updateTimer === undefined) {
            updateTimer = window.setInterval(() => {
              if (navigator.onLine) void candidate?.update()
            }, UPDATE_INTERVAL_MS)
          }
        },
      })
    })

    return registrationPromise
  }

  async function updateServiceWorker(reloadPage = true) {
    await registerServiceWorker()
    await updateRegistration?.(reloadPage)
  }

  async function install() {
    if (!deferredInstallPrompt) return
    showInstallPrompt.value = false
    await deferredInstallPrompt.prompt()
    await deferredInstallPrompt.userChoice
    deferredInstallPrompt = undefined
  }

  function cancelInstall() {
    deferredInstallPrompt = undefined
    showInstallPrompt.value = false
    localStorage.setItem(INSTALL_DISMISSED_KEY, 'true')
  }

  async function cancelPrompt() {
    needRefresh.value = false
    offlineReady.value = false
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    if (localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true') return
    event.preventDefault()
    deferredInstallPrompt = event as DeferredInstallPrompt
    showInstallPrompt.value = true
  })

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = undefined
    showInstallPrompt.value = false
    isPWAInstalled.value = true
  })

  const registerOnInteraction = () => {
    void registerServiceWorker()
  }
  window.addEventListener('pointerdown', registerOnInteraction, { once: true, passive: true })
  window.addEventListener('keydown', registerOnInteraction, { once: true })
  window.addEventListener('load', () => {
    window.setTimeout(() => void registerServiceWorker(), REGISTRATION_GRACE_MS)
  }, { once: true })

  return {
    provide: {
      pwa: reactive({
        isInstalled: isPWAInstalled,
        isPWAInstalled,
        showInstallPrompt,
        cancelInstall,
        install,
        swActivated,
        registrationError,
        offlineReady,
        needRefresh,
        updateServiceWorker,
        cancelPrompt,
        getSWRegistration: () => registration,
      }),
    },
  }
})

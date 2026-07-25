import { onMounted, watch } from 'vue'
import { messages, locales, localeLabels, type AppLocale } from '~/i18n/messages'
import { appStoragePrefix } from '~/utils/storageKeys'

export const LOCALE_STORAGE_KEY = `${appStoragePrefix}:locale`

export function useAppI18n() {
  // useState is request-safe during SSR and is serialized into the Nuxt
  // payload. The browser preference is intentionally restored only after
  // hydration, so the server and the client's first render both use Khmer.
  const locale = useState<AppLocale>('app-locale', () => 'km')
  const restored = useState<boolean>('app-locale-restored', () => false)

  if (import.meta.client) {
    onMounted(() => {
      if (restored.value) return
      try {
        const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY)
        if (saved === 'en' || saved === 'km') locale.value = saved
      } catch {
        // Storage can be unavailable in private or hardened browser modes.
      } finally {
        restored.value = true
      }
    })

    watch(locale, (nextLocale) => {
      if (!restored.value) return
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale)
      } catch {
        // The in-memory choice still works for the current session.
      }
    })
  }

  function t(key: string, params?: Record<string, string | number>): string {
    const dict = messages[locale.value] ?? messages.en
    let text = dict[key] ?? messages.en[key] ?? key
    if (params) {
      for (const [paramKey, value] of Object.entries(params)) {
        text = text.replaceAll(`{${paramKey}}`, String(value))
      }
    }
    return text
  }

  return { locale, locales, localeLabels, t }
}

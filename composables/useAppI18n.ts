import { useStorage } from '@vueuse/core'
import { messages, locales, localeLabels, type AppLocale } from '~/i18n/messages'
import { appStoragePrefix } from '~/utils/storageKeys'

export const LOCALE_STORAGE_KEY = `${appStoragePrefix}:locale`

// Module-scoped singleton -- same reasoning as useColorMode.ts.
let localeRef: ReturnType<typeof useStorage<AppLocale>> | null = null

export function useAppI18n() {
  if (!localeRef) {
    localeRef = useStorage<AppLocale>(LOCALE_STORAGE_KEY, 'en')
  }
  const locale = localeRef

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

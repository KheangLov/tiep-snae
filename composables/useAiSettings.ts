import { onMounted, watch } from 'vue'
import { appStoragePrefix } from '~/utils/storageKeys'
import type { AiProviderId } from '~/types/ai'

export interface AiSettings {
  provider: AiProviderId
  apiKey: string
  model: string
  baseUrl: string
}

export const AI_SETTINGS_STORAGE_KEY = `${appStoragePrefix}:ai-settings`

const DEFAULT_SETTINGS: AiSettings = {
  provider: 'anthropic',
  apiKey: '',
  model: 'claude-sonnet-4-5',
  baseUrl: '',
}

export function useAiSettings() {
  const settings = useState<AiSettings>('ai-settings', () => ({ ...DEFAULT_SETTINGS }))
  const restored = useState<boolean>('ai-settings-restored', () => false)

  if (import.meta.client) {
    onMounted(() => {
      if (restored.value) return
      try {
        const saved = JSON.parse(window.localStorage.getItem(AI_SETTINGS_STORAGE_KEY) ?? '{}') as Partial<AiSettings>
        settings.value = {
          provider: typeof saved.provider === 'string' ? saved.provider as AiProviderId : DEFAULT_SETTINGS.provider,
          apiKey: typeof saved.apiKey === 'string' ? saved.apiKey : '',
          model: typeof saved.model === 'string' ? saved.model : DEFAULT_SETTINGS.model,
          baseUrl: typeof saved.baseUrl === 'string' ? saved.baseUrl : '',
        }
      } catch {
        settings.value = { ...DEFAULT_SETTINGS }
      } finally {
        restored.value = true
      }
    })

    watch(settings, (nextSettings) => {
      if (!restored.value) return
      try {
        window.localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings))
      } catch {
        // The settings still work for the current session.
      }
    }, { deep: true })
  }

  return settings
}

import { useStorage } from '@vueuse/core'
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

// Module-scoped singleton -- same reasoning as useColorMode.ts: two
// independent useStorage() calls wouldn't see each other's writes within
// the same tab.
let settingsRef: ReturnType<typeof useStorage<AiSettings>> | null = null

export function useAiSettings() {
  if (!settingsRef) {
    settingsRef = useStorage<AiSettings>(AI_SETTINGS_STORAGE_KEY, { ...DEFAULT_SETTINGS })
  }
  return settingsRef
}

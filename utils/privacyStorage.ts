import { appStoragePrefix } from '~/utils/storageKeys'

const INVITE_KEY_PREFIX = `${appStoragePrefix}:invite:`
const AI_SETTINGS_KEY = `${appStoragePrefix}:ai-settings`
const PREFERENCE_KEYS = new Set([
  `${appStoragePrefix}:color-mode`,
  `${appStoragePrefix}:locale`,
])

export interface LocalDataSummary {
  inviteCount: number
  apiKeyStored: boolean
  bytesUsed: number
}

function browserStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function localUserDataKeys(storage: Storage): string[] {
  const keys: string[] = []
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index)
    if (key?.startsWith(`${appStoragePrefix}:`) && !PREFERENCE_KEYS.has(key)) keys.push(key)
  }
  return keys
}

export function readLocalDataSummary(): LocalDataSummary {
  const storage = browserStorage()
  if (!storage) {
    return { inviteCount: 0, apiKeyStored: false, bytesUsed: 0 }
  }

  const keys = localUserDataKeys(storage)
  let apiKeyStored = false
  try {
    const settings = JSON.parse(storage.getItem(AI_SETTINGS_KEY) ?? '{}') as Record<string, unknown>
    apiKeyStored = typeof settings.apiKey === 'string' && settings.apiKey.length > 0
  } catch {
    apiKeyStored = false
  }

  const bytesUsed = keys.reduce((total, key) => {
    const value = storage.getItem(key) ?? ''
    // localStorage strings are stored as UTF-16 in the major browsers.
    return total + (key.length + value.length) * 2
  }, 0)

  return {
    inviteCount: keys.filter((key) => key.startsWith(INVITE_KEY_PREFIX)).length,
    apiKeyStored,
    bytesUsed,
  }
}

/** Removes invitations and AI credentials from this browser while keeping
 * the user's language and light/dark preferences. */
export function clearLocalUserData(): void {
  const storage = browserStorage()
  if (!storage) return
  for (const key of localUserDataKeys(storage)) storage.removeItem(key)
}

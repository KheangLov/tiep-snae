import { useStorage } from '@vueuse/core'
import { appStoragePrefix } from '~/utils/storageKeys'

export type ColorMode = 'light' | 'dark'

export const COLOR_MODE_STORAGE_KEY = `${appStoragePrefix}:color-mode`

// Module-scoped singleton: two independent useStorage() calls wouldn't see
// each other's writes within the same tab. `null` means "no explicit choice
// yet, follow the OS setting"; once the user toggles it, an explicit
// 'light'/'dark' is stored and wins over the OS setting from then on.
let modeRef: ReturnType<typeof useStorage<ColorMode | null>> | null = null

export function useColorMode() {
  if (!modeRef) {
    modeRef = useStorage<ColorMode | null>(COLOR_MODE_STORAGE_KEY, null)
  }
  return modeRef
}

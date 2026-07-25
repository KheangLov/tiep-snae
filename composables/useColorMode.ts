import { onMounted, watch } from 'vue'
import { appStoragePrefix } from '~/utils/storageKeys'

export type ColorMode = 'light' | 'dark'

export const COLOR_MODE_STORAGE_KEY = `${appStoragePrefix}:color-mode`

export function useColorMode() {
  // Keep the SSR and hydration value stable, then restore the browser-only
  // preference once Vue has mounted. `null` means follow the OS setting.
  const mode = useState<ColorMode | null>('app-color-mode', () => null)
  const restored = useState<boolean>('app-color-mode-restored', () => false)

  if (import.meta.client) {
    onMounted(() => {
      if (restored.value) return
      try {
        const saved = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)
        if (saved === 'light' || saved === 'dark') mode.value = saved
      } catch {
        // Keep following the OS setting when storage is unavailable.
      } finally {
        restored.value = true
      }
    })

    watch(mode, (nextMode) => {
      if (!restored.value) return
      try {
        if (nextMode) window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, nextMode)
        else window.localStorage.removeItem(COLOR_MODE_STORAGE_KEY)
      } catch {
        // The in-memory choice still works for the current session.
      }
    })
  }

  return mode
}

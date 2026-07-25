<script setup lang="ts">
import { COLOR_MODE_STORAGE_KEY } from '~/composables/useColorMode'

// Runs synchronously in <head>, before the SSR body is parsed or painted.
// SSR always uses the stable Khmer/light defaults; this script only avoids a
// theme flash before the saved browser preference is restored after hydration.
const initialColorModeScript = `(() => {
  let savedMode = null
  try {
    const storedMode = localStorage.getItem(${JSON.stringify(COLOR_MODE_STORAGE_KEY)})
    if (storedMode === 'light' || storedMode === 'dark') savedMode = storedMode
  } catch {}

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  const mode = savedMode ?? (prefersDark ? 'dark' : 'light')
  const root = document.documentElement
  root.dataset.appTheme = mode
  root.style.colorScheme = mode
  root.style.backgroundColor = mode === 'dark' ? '#170B10' : '#FFF9F6'
})()`

useHead({
  script: [{
    key: 'initial-color-mode',
    tagPosition: 'head',
    tagPriority: 'critical',
    innerHTML: initialColorModeScript,
  }],
})
</script>

<template>
  <NuxtPwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

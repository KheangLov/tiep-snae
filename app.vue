<script setup lang="ts">
import { COLOR_MODE_STORAGE_KEY } from '~/composables/useColorMode'

const showSplash = ref(true)
let splashTimer: number | undefined
let splashCleanupTimer: number | undefined

// Runs synchronously in <head>, before the SSR body is parsed or painted.
// SSR always uses the stable Khmer/light defaults; this script only avoids a
// theme flash and enables the first-paint splash before hydration starts.
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
  root.classList.add('app-booting')
  window.__TIEP_SNAE_SPLASH_STARTED__ = performance.now()
  window.__TIEP_SNAE_SPLASH_FALLBACK__ = window.setTimeout(() => {
    root.classList.remove('app-booting')
  }, 6000)
})()`

// The splash is intentionally critical inline CSS. The rest of the app keeps
// using cached, content-hashed stylesheets, but this small shell must be styled
// before the browser parses or paints the SSR body.
const splashCriticalCss = `
#app-splash {
  display: none;
}
html.app-booting #app-splash {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: grid;
  place-items: center;
  min-height: 100dvh;
  overflow: hidden;
  color: #4a1020;
  background:
    radial-gradient(circle at 50% 42%, rgb(201 138 62 / 16%), transparent 19rem),
    radial-gradient(circle at 14% 10%, rgb(139 41 66 / 10%), transparent 24rem),
    linear-gradient(145deg, #fffaf7 0%, #fdf0eb 55%, #f9e3e0 100%);
  font-family: "Noto Sans Khmer", system-ui, sans-serif;
  isolation: isolate;
}
html[data-app-theme='dark'].app-booting #app-splash {
  color: #fff7f9;
  background:
    radial-gradient(circle at 50% 42%, rgb(240 200 120 / 14%), transparent 19rem),
    radial-gradient(circle at 14% 10%, rgb(232 160 180 / 12%), transparent 24rem),
    linear-gradient(145deg, #211116 0%, #170b10 58%, #260f18 100%);
}
html.app-booting:not(.app-ready) #app-shell {
  visibility: hidden;
}
.app-splash__glow {
  position: absolute;
  width: min(32rem, 84vw);
  aspect-ratio: 1;
  border: 0.0625rem solid rgb(139 41 66 / 9%);
  border-radius: 50%;
  box-shadow:
    0 0 0 3rem rgb(139 41 66 / 3%),
    0 0 0 7rem rgb(201 138 62 / 2%);
  animation: app-splash-breathe 2.4s ease-in-out infinite;
}
html[data-app-theme='dark'] .app-splash__glow {
  border-color: rgb(232 160 180 / 11%);
  box-shadow:
    0 0 0 3rem rgb(232 160 180 / 3%),
    0 0 0 7rem rgb(240 200 120 / 2%);
}
.app-splash__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  text-align: center;
  animation: app-splash-arrive 480ms cubic-bezier(.22, 1, .36, 1) both;
}
.app-splash__mark {
  position: relative;
  display: grid;
  place-items: center;
  width: 5.5rem;
  height: 5.5rem;
  margin-bottom: 1.2rem;
}
.app-splash__ring {
  position: absolute;
  inset: 0;
  border: 0.125rem solid rgb(139 41 66 / 14%);
  border-top-color: #8b2942;
  border-right-color: #c98a3e;
  border-radius: 50%;
  animation: app-splash-spin 1.8s linear infinite;
}
html[data-app-theme='dark'] .app-splash__ring {
  border-color: rgb(232 160 180 / 14%);
  border-top-color: #e8a0b4;
  border-right-color: #f0c878;
}
.app-splash__letter {
  display: grid;
  place-items: center;
  width: 4.25rem;
  height: 4.25rem;
  border: 0.0625rem solid rgb(255 255 255 / 72%);
  border-radius: 50%;
  background: linear-gradient(145deg, rgb(255 255 255 / 86%), rgb(255 255 255 / 45%));
  box-shadow: 0 1rem 2.5rem rgb(74 16 32 / 12%);
  color: #8b2942;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  -webkit-backdrop-filter: blur(0.75rem);
  backdrop-filter: blur(0.75rem);
}
html[data-app-theme='dark'] .app-splash__letter {
  border-color: rgb(255 255 255 / 10%);
  background: linear-gradient(145deg, rgb(255 255 255 / 10%), rgb(255 255 255 / 4%));
  box-shadow: 0 1rem 2.5rem rgb(0 0 0 / 24%);
  color: #f0c878;
}
.app-splash__name {
  margin: 0;
  background: linear-gradient(135deg, #4a1020 0%, #8b2942 55%, #c98a3e 100%);
  background-clip: text;
  color: transparent;
  font-size: clamp(1.65rem, 5vw, 2.25rem);
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.35;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
html[data-app-theme='dark'] .app-splash__name {
  background-image: linear-gradient(135deg, #fff7f9 0%, #e8a0b4 58%, #f0c878 100%);
}
.app-splash__status {
  margin: 0.45rem 0 1.1rem;
  color: #745e65;
  font-size: 0.78rem;
  font-weight: 500;
}
html[data-app-theme='dark'] .app-splash__status {
  color: #cdb9c0;
}
.app-splash__progress {
  position: relative;
  width: 8.5rem;
  height: 0.1875rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgb(139 41 66 / 10%);
}
.app-splash__progress::after {
  position: absolute;
  inset-block: 0;
  left: -45%;
  width: 45%;
  border-radius: inherit;
  background: linear-gradient(90deg, #8b2942, #c98a3e);
  content: "";
  animation: app-splash-progress 1.05s cubic-bezier(.65, 0, .35, 1) infinite;
}
html[data-app-theme='dark'] .app-splash__progress {
  background: rgb(232 160 180 / 12%);
}
html[data-app-theme='dark'] .app-splash__progress::after {
  background: linear-gradient(90deg, #e8a0b4, #f0c878);
}
.app-splash-leave-active {
  transition: opacity 300ms ease, filter 300ms ease;
}
.app-splash-leave-to {
  opacity: 0;
  filter: blur(0.35rem);
}
@keyframes app-splash-arrive {
  from { opacity: 0; transform: translateY(0.75rem) scale(.97); }
}
@keyframes app-splash-breathe {
  50% { opacity: .62; transform: scale(1.035); }
}
@keyframes app-splash-spin {
  to { transform: rotate(360deg); }
}
@keyframes app-splash-progress {
  0% { transform: translateX(0); }
  100% { transform: translateX(325%); }
}
@media (prefers-reduced-motion: reduce) {
  .app-splash__glow,
  .app-splash__content,
  .app-splash__ring,
  .app-splash__progress::after {
    animation: none;
  }
  .app-splash__progress::after {
    left: 0;
    width: 100%;
  }
  .app-splash-leave-active {
    transition-duration: 120ms;
  }
}
@media (forced-colors: active) {
  html.app-booting #app-splash {
    color: CanvasText;
    background: Canvas;
  }
  .app-splash__letter,
  .app-splash__ring,
  .app-splash__progress {
    border: 0.125rem solid CanvasText;
    color: CanvasText;
    forced-color-adjust: none;
  }
}`

useHead({
  script: [{
    key: 'initial-color-mode',
    tagPosition: 'head',
    tagPriority: 'critical',
    innerHTML: initialColorModeScript,
  }],
  style: [{
    key: 'app-splash-critical',
    tagPriority: 'critical',
    innerHTML: splashCriticalCss,
  }],
})

onMounted(async () => {
  await nextTick()

  const root = document.documentElement
  const bootWindow = window as Window & {
    __TIEP_SNAE_SPLASH_STARTED__?: number
    __TIEP_SNAE_SPLASH_FALLBACK__?: number
  }
  const startedAt = bootWindow.__TIEP_SNAE_SPLASH_STARTED__ ?? performance.now()
  const elapsed = performance.now() - startedAt
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const minimumDuration = reducedMotion ? 160 : 720
  const remaining = Math.max(0, minimumDuration - elapsed)

  splashTimer = window.setTimeout(() => {
    // Reveal the hydrated app underneath while the splash gently fades away.
    root.classList.add('app-ready')
    showSplash.value = false
    splashCleanupTimer = window.setTimeout(() => {
      root.classList.remove('app-booting', 'app-ready')
      if (bootWindow.__TIEP_SNAE_SPLASH_FALLBACK__ !== undefined) {
        window.clearTimeout(bootWindow.__TIEP_SNAE_SPLASH_FALLBACK__)
      }
      delete bootWindow.__TIEP_SNAE_SPLASH_STARTED__
      delete bootWindow.__TIEP_SNAE_SPLASH_FALLBACK__
    }, reducedMotion ? 160 : 360)
  }, remaining)
})

onBeforeUnmount(() => {
  if (splashTimer !== undefined) window.clearTimeout(splashTimer)
  if (splashCleanupTimer !== undefined) window.clearTimeout(splashCleanupTimer)
})
</script>

<template>
  <Transition name="app-splash">
    <div
      v-if="showSplash"
      id="app-splash"
      role="status"
      aria-live="polite"
      aria-label="កំពុងរៀបចំកម្មវិធី ធៀបស្នេហ៍"
    >
      <div class="app-splash__glow" aria-hidden="true" />
      <div class="app-splash__content">
        <div class="app-splash__mark" aria-hidden="true">
          <span class="app-splash__ring" />
          <span class="app-splash__letter">ធ</span>
        </div>
        <p class="app-splash__name">ធៀបស្នេហ៍</p>
        <p class="app-splash__status">កំពុងរៀបចំបទពិសោធន៍របស់អ្នក…</p>
        <span class="app-splash__progress" aria-hidden="true" />
      </div>
    </div>
  </Transition>

  <NuxtPwaManifest />
  <div id="app-shell">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

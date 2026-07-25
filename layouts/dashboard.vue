<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useAppI18n } from '~/composables/useAppI18n'
import { useColorMode } from '~/composables/useColorMode'
import type { AppLocale } from '~/i18n/messages'

const { locale, locales, localeLabels, t } = useAppI18n()
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme() {
  if (typeof document === 'undefined') return
  const dark = colorMode.value === 'dark' || (colorMode.value === null && systemPrefersDark())
  const root = document.documentElement
  root.dataset.appTheme = dark ? 'dark' : 'light'
  root.style.colorScheme = dark ? 'dark' : 'light'
  root.style.backgroundColor = dark ? '#170B10' : '#FFF9F6'
}

function toggleColorMode() {
  colorMode.value = isDark.value ? 'light' : 'dark'
}

function changeLocale(nextLocale: AppLocale) {
  locale.value = nextLocale
}

useHead(() => ({ htmlAttrs: { lang: locale.value } }))
watch(colorMode, applyTheme)
onMounted(applyTheme)
</script>

<template>
  <div class="dashboard-shell">
    <header class="dashboard-header">
      <nav class="dashboard-nav glass-surface" :aria-label="t('nav.accountMenu')">
        <NuxtLink to="/" class="dashboard-brand">
          <span class="dashboard-brand__mark" aria-hidden="true">♥</span>
          <strong>{{ t('app.name') }}</strong>
        </NuxtLink>

        <div class="dashboard-nav__links">
          <NuxtLink to="/templates">{{ t('nav.templates') }}</NuxtLink>
          <NuxtLink to="/" aria-current="page">{{ t('nav.myInvitations') }}</NuxtLink>
        </div>

        <details class="dashboard-menu">
          <summary :aria-label="t('nav.accountMenu')">•••</summary>
          <div class="dashboard-menu__panel glass-surface">
            <NuxtLink to="/settings">{{ t('nav.settings') }}</NuxtLink>
            <button type="button" @click="toggleColorMode">
              {{ isDark ? t('nav.switchLight') : t('nav.switchDark') }}
            </button>
            <span class="dashboard-menu__label">{{ t('nav.language') }}</span>
            <button
              v-for="item in locales"
              :key="item"
              type="button"
              :aria-pressed="locale === item"
              @click="changeLocale(item)"
            >
              {{ localeLabels[item] }}
            </button>
          </div>
        </details>
      </nav>
    </header>

    <main class="dashboard-main">
      <slot />
    </main>

    <ClientOnly>
      <PwaStatusNotice />
    </ClientOnly>
  </div>
</template>

<style scoped>
.dashboard-shell {
  min-height: 100dvh;
  color: #201014;
  /* Keep the lightweight dashboard's first paint independent from webfont
     downloads. Editor and invitation routes retain the branded Khmer font. */
  font-family: system-ui, sans-serif;
  background: var(--app-background);
}

html[data-app-theme='dark'] .dashboard-shell {
  color: #fff5f7;
}

.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.75rem clamp(1rem, 3vw, 2.5rem) 0;
}

.dashboard-nav {
  display: flex;
  align-items: center;
  min-height: 3.75rem;
  max-width: 64rem;
  padding: 0.5rem 0.75rem;
  margin: 0 auto;
  border: 0.0625rem solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--glass-shadow-subtle);
}

.dashboard-brand,
.dashboard-nav__links a,
.dashboard-menu__panel a {
  color: inherit;
  text-decoration: none;
}

.dashboard-brand {
  display: inline-flex;
  gap: 0.55rem;
  align-items: center;
  min-width: 0;
}

.dashboard-brand__mark {
  display: grid;
  flex: 0 0 auto;
  width: 2rem;
  height: 2rem;
  place-items: center;
  color: white;
  background: var(--app-gradient);
  border-radius: 999px;
}

.dashboard-brand strong {
  color: #8b2942;
  font-size: 1rem;
}

html[data-app-theme='dark'] .dashboard-brand strong {
  color: #f0b3c5;
}

.dashboard-nav__links {
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
}

.dashboard-nav__links a,
.dashboard-menu summary,
.dashboard-menu__panel a,
.dashboard-menu__panel button {
  min-height: 2.5rem;
  padding: 0.6rem 0.85rem;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  color: inherit;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 999px;
}

.dashboard-nav__links a:hover,
.dashboard-nav__links a:focus-visible,
.dashboard-menu summary:hover,
.dashboard-menu summary:focus-visible,
.dashboard-menu__panel a:hover,
.dashboard-menu__panel a:focus-visible,
.dashboard-menu__panel button:hover,
.dashboard-menu__panel button:focus-visible,
.dashboard-menu__panel button[aria-pressed='true'] {
  background: rgb(139 41 66 / 10%);
  outline: none;
}

.dashboard-menu {
  position: relative;
  margin-left: 0.25rem;
}

.dashboard-menu summary {
  display: grid;
  min-width: 2.5rem;
  place-items: center;
  list-style: none;
  letter-spacing: 0.08em;
}

.dashboard-menu summary::-webkit-details-marker {
  display: none;
}

.dashboard-menu__panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  display: grid;
  width: min(15rem, calc(100vw - 2rem));
  padding: 0.5rem;
  border: 0.0625rem solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--glass-shadow);
}

.dashboard-menu__panel a,
.dashboard-menu__panel button {
  width: 100%;
  text-align: left;
}

.dashboard-menu__label {
  padding: 0.65rem 0.85rem 0.25rem;
  font-size: 0.68rem;
  font-weight: 700;
  opacity: 0.62;
}

.dashboard-main {
  width: 100%;
}

@media (max-width: 42rem) {
  .dashboard-nav__links {
    display: none;
  }

  .dashboard-menu {
    margin-left: auto;
  }
}
</style>

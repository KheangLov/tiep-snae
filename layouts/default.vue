<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import { useColorMode } from '~/composables/useColorMode'
import { useAppI18n } from '~/composables/useAppI18n'
import type { AppLocale } from '~/i18n/messages'
import PrivacyCenterDialog from '~/components/privacy/PrivacyCenterDialog.vue'

const vuetifyTheme = useTheme()
const colorMode = useColorMode()
const { locale, locales, localeLabels, t } = useAppI18n()
const { lgAndUp } = useDisplay()
const route = useRoute()

const showCustomizeFab = computed(() => route.path !== '/customize/new')

useHead(() => ({ htmlAttrs: { lang: locale.value } }))

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function updateDocumentTheme(isDark: boolean) {
  if (typeof document === 'undefined') return
  const mode = isDark ? 'dark' : 'light'
  const root = document.documentElement
  root.dataset.appTheme = mode
  root.style.colorScheme = mode
  root.style.backgroundColor = isDark ? '#170B10' : '#FFF9F6'
}

function applyTheme() {
  const isDark = colorMode.value === 'dark' || (colorMode.value === null && systemPrefersDark())
  updateDocumentTheme(isDark)
  vuetifyTheme.change(isDark ? 'tiepSnaeDark' : 'tiepSnaeLight')
}

const isDark = computed(() => vuetifyTheme.global.name.value === 'tiepSnaeDark')

type UiTransitionKind = 'theme' | 'language'
type ViewTransitionHandle = { finished: Promise<unknown> }
type TransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => ViewTransitionHandle
}

async function runUiTransition(kind: UiTransitionKind, update: () => void) {
  if (typeof document === 'undefined') {
    update()
    return
  }

  const root = document.documentElement
  let updateStarted = false
  const performUpdate = async () => {
    updateStarted = true
    update()
    await nextTick()
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    await performUpdate()
    return
  }

  root.dataset.uiTransition = kind
  const transitionDocument = document as TransitionDocument

  if (typeof transitionDocument.startViewTransition === 'function') {
    try {
      const transition = transitionDocument.startViewTransition(performUpdate)
      await transition.finished
    } catch {
      if (!updateStarted) await performUpdate()
    } finally {
      if (root.dataset.uiTransition === kind) delete root.dataset.uiTransition
    }
    return
  }

  const fallbackClass = `ui-${kind}-switch`
  root.classList.remove(fallbackClass)
  void root.offsetWidth
  root.classList.add(fallbackClass)
  await performUpdate()
  window.setTimeout(() => root.classList.remove(fallbackClass), 450)
}

function toggleColorMode() {
  void runUiTransition('theme', () => {
    colorMode.value = isDark.value ? 'light' : 'dark'
    applyTheme()
  })
}

function changeLocale(nextLocale: AppLocale) {
  if (nextLocale === locale.value) return
  void runUiTransition('language', () => {
    locale.value = nextLocale
  })
}

watch(colorMode, applyTheme)

onMounted(() => {
  applyTheme()
  // Stay in sync with OS-level changes for as long as the user hasn't
  // explicitly overridden it via the toggle.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (colorMode.value === null) applyTheme()
  })
})
</script>

<template>
  <v-app>
    <v-app-bar flat color="transparent">
      <v-container class="app-navbar-shell glass-surface d-flex align-center ga-2" fluid>
        <NuxtLink
          to="/"
          class="text-decoration-none d-flex align-center ga-2 text-no-wrap"
          style="min-width: 0"
        >
          <span
            class="app-navbar-logo flex-shrink-0 d-flex align-center justify-center"
            style="border-radius: 999px; background: var(--app-gradient)"
            aria-hidden="true"
          >
            <v-icon icon="solar:hearts-bold" size="16" color="white" />
          </span>
          <span class="text-subtitle-1 font-weight-bold gradient-text text-truncate">{{ t('app.name') }}</span>
        </NuxtLink>
        <v-spacer />
        <template v-if="lgAndUp">
          <v-btn to="/templates" variant="text" size="small" class="text-none">{{ t('nav.templates') }}</v-btn>
          <v-btn to="/" exact variant="text" size="small" class="text-none">{{ t('nav.myInvitations') }}</v-btn>
        </template>
        <PrivacyCenterDialog />
        <v-menu>
          <template #activator="{ props: menuProps }">
            <v-btn
              icon
              variant="text"
              class="app-header-icon-btn"
              :aria-label="t('nav.accountMenu')"
              v-bind="menuProps"
            >
              <v-icon icon="solar:settings-linear" size="20" />
            </v-btn>
          </template>
          <v-list density="compact" class="glass-surface" style="min-width: 12.5rem">
            <v-list-item to="/settings" prepend-icon="solar:magic-stick-3-linear" :title="t('nav.settings')" />
            <v-divider class="my-1" />
            <v-list-item
              class="ui-theme-toggle"
              :prepend-icon="isDark ? 'solar:sun-linear' : 'solar:moon-linear'"
              :title="isDark ? t('nav.switchLight') : t('nav.switchDark')"
              @click="toggleColorMode"
            />
            <v-divider class="my-1" />
            <v-list-subheader>{{ t('nav.language') }}</v-list-subheader>
            <v-list-item
              v-for="item in locales"
              :key="item"
              :active="locale === item"
              :title="localeLabels[item]"
              class="ui-language-toggle"
              @click="changeLocale(item)"
            >
              <template #append>
                <span class="text-caption text-medium-emphasis">{{ item.toUpperCase() }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>

    <v-main class="app-main" :class="{ 'app-main--with-mobile-nav': !lgAndUp }">
      <slot />
    </v-main>

    <nav
      v-if="!lgAndUp"
      class="app-mobile-nav glass-surface"
      :aria-label="`${t('nav.templates')} / ${t('nav.myInvitations')} / ${t('nav.settings')}`"
    >
      <v-btn to="/templates" variant="text" active-color="primary" class="app-mobile-nav__button">
        <v-icon icon="solar:widget-5-linear" size="18" />
        <span class="app-mobile-nav__label">{{ t('nav.templates') }}</span>
      </v-btn>
      <v-btn to="/" exact variant="text" active-color="primary" class="app-mobile-nav__button">
        <v-icon icon="solar:documents-linear" size="18" />
        <span class="app-mobile-nav__label">{{ t('nav.myInvitations') }}</span>
      </v-btn>
      <v-btn to="/settings" variant="text" active-color="primary" class="app-mobile-nav__button">
        <v-icon icon="solar:magic-stick-3-linear" size="18" />
        <span class="app-mobile-nav__label">{{ t('nav.settings') }}</span>
      </v-btn>
    </nav>

    <NuxtLink
      v-if="showCustomizeFab"
      to="/customize/new"
      class="create-own-fab"
      :aria-label="t('nav.createNew')"
    >
      <v-icon icon="solar:palette-bold" size="22" color="white" />
    </NuxtLink>

    <ClientOnly>
      <PwaStatusNotice />
    </ClientOnly>
  </v-app>
</template>

<style scoped>
.create-own-fab {
  position: fixed;
  left: 1.25rem;
  bottom: 1.25rem;
  z-index: 1005;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 999px;
  background: var(--app-gradient);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.create-own-fab:hover {
  transform: translateY(-0.125rem);
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.3);
}

/* Clears the fixed mobile bottom nav (see .app-mobile-nav in
   assets/css/main.css) instead of sitting underneath it. */
@media (max-width: 37.5rem) {
  .create-own-fab {
    bottom: calc(5.25rem + env(safe-area-inset-bottom, 0rem));
  }
}
</style>

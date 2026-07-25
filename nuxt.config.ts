import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-04',
  // Every page in this app renders data that only ever exists in the
  // visitor's own browser (color mode, language, and every invitation --
  // see stores/invite.ts, composables/useColorMode.ts,
  // composables/useAppI18n.ts, all backed by localStorage via VueUse's
  // useStorage). useStorage reads that value synchronously on the client,
  // which is inherently earlier than Vue's SSR-hydration comparison point --
  // any SSR render is *guaranteed* to mismatch the client's first render as
  // soon as a returning visitor has a saved preference. Since this product's
  // entire premise is "nothing exists outside your browser," there's no SEO
  // payoff worth chasing that mismatch for: rendering client-only sidesteps
  // the whole bug class instead of hand-rolling hydration-safe timing for
  // every localStorage-backed composable.
  ssr: false,
  devtools: { enabled: false },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  // Load order matters: Vuetify's base styles first, Tailwind/app styles
  // after, so utility classes win on any specificity tie. Vuetify styling is
  // scoped under `.v-application`, so it never touches the invitation
  // render tree (which intentionally never mounts inside <v-app> -- see
  // components/invite/TemplateRenderer.vue).
  css: [
    'vuetify/styles',
    // Inter (body) + Plus Jakarta Sans (headings/buttons/nav) are the app
    // chrome's own font pair. Only the scripts used by the English/Khmer
    // interface are loaded here to keep unrelated subsets out of every SSR
    // document; invitation-only fonts load per-template instead (see
    // components/invite/TemplateRenderer.vue).
    '@fontsource/inter/latin-400.css',
    '@fontsource/inter/latin-500.css',
    '@fontsource/inter/latin-600.css',
    '@fontsource/inter/latin-700.css',
    '@fontsource/plus-jakarta-sans/latin-500.css',
    '@fontsource/plus-jakarta-sans/latin-600.css',
    '@fontsource/plus-jakarta-sans/latin-700.css',
    '@fontsource/plus-jakarta-sans/latin-800.css',
    '@fontsource/noto-sans-khmer/latin-400.css',
    '@fontsource/noto-sans-khmer/khmer-400.css',
    '@fontsource/noto-sans-khmer/khmer-500.css',
    '@fontsource/noto-sans-khmer/latin-600.css',
    '@fontsource/noto-sans-khmer/khmer-600.css',
    '@fontsource/noto-sans-khmer/latin-700.css',
    '@fontsource/noto-sans-khmer/khmer-700.css',
    '~/assets/css/main.css',
  ],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  app: {
    // No `mode: 'out-in'` -- that sequences the transition (wait for the old
    // page to finish leaving, *then* wait for the new page's async setup to
    // resolve before it enters). With ten templates' worth of dynamic
    // imports and per-template font loading now in play, that second wait
    // can outlast the leave transition, and the two aren't reliably
    // reconciled: navigation was observed to hang indefinitely on the old
    // page's leave-active state, never mounting the destination (confirmed
    // via a hard reload of the same route rendering instantly and
    // correctly). Concurrent enter/leave (the default) has no such
    // dependency between the two and can't deadlock this way.
    pageTransition: { name: 'page' },
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Tiep Snae — Digital Wedding Invitations',
      meta: [
        { name: 'description', content: 'Create a beautiful digital wedding invitation in minutes -- free, private, and entirely in your browser. Nothing you create is ever uploaded or stored on a server.' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#8B2942' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'format-detection', content: 'telephone=no' },
        // Hero/gallery/background photos are now external links the couple
        // pastes in (see types/invite.ts's PhotoItem), not uploaded images --
        // this stops the browser from sending this page's URL as a Referer
        // header to whatever third-party host serves them, for both <img>
        // tags and CSS background-image (which has no per-element
        // referrerpolicy attribute of its own).
        { name: 'referrer', content: 'no-referrer' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Tiep Snae' },
        { name: 'twitter:card', content: 'summary' },
      ],
    },
  },
})

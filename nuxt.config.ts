import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-04',
  // The public shell and shared invitations render on the server. Private
  // invitation records and preferences are restored from localStorage only
  // after hydration, so SSR never reads or receives browser-owned data.
  ssr: true,
  devtools: { enabled: false },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],

  routeRules: {
    '/_nuxt/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/icons/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/sw.js': {
      headers: { 'cache-control': 'no-cache, no-store, must-revalidate' },
    },
    '/manifest.webmanifest': {
      headers: { 'cache-control': 'no-cache, must-revalidate' },
    },
  },

  nitro: {
    prerender: {
      routes: ['/offline/'],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    registerWebManifestInRouteRules: true,
    includeAssets: [
      'icons/apple-touch-icon.png',
      'icons/app-icon-192.png',
      'icons/app-icon-512.png',
    ],
    client: {
      installPrompt: 'tiep-snae:pwa-install-dismissed',
      periodicSyncForUpdates: 60 * 60,
    },
    manifest: {
      id: '/',
      name: 'ធៀបស្នេហ៍',
      short_name: 'ធៀបស្នេហ៍',
      description: 'បង្កើតធៀបការឌីជីថលដ៏ស្រស់ស្អាត ឯកជន និងអាចប្រើបានក្រៅបណ្ដាញ។',
      lang: 'km-KH',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'any',
      background_color: '#FFF9F6',
      theme_color: '#8B2942',
      categories: ['lifestyle', 'design', 'utilities'],
      icons: [
        {
          src: '/icons/app-icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/app-icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/app-icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      // This is an SSR app, not a single-page app shell. Each route should
      // use its server response when online and its own cached response when
      // offline; unmatched routes fall back to the precached offline page.
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
      additionalManifestEntries: [
        { url: '/offline/', revision: 'offline-v1' },
      ],
      runtimeCaching: [
        {
          urlPattern: /^https?:\/\/[^/]+\/(?:$|templates(?:\/|$)|customize(?:\/|$)|editor(?:\/|$)|i(?:\/|$)|settings(?:\/|$)|offline(?:\/|$))/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'theap-snae-pages-v1',
            networkTimeoutSeconds: 3,
            cacheableResponse: { statuses: [0, 200] },
            expiration: {
              maxEntries: 40,
              maxAgeSeconds: 60 * 60 * 24 * 14,
            },
            precacheFallback: { fallbackURL: '/offline/' },
          },
        },
        {
          urlPattern: /\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?.*)?$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'theap-snae-images-v1',
            cacheableResponse: { statuses: [0, 200] },
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30,
              purgeOnQuotaError: true,
            },
          },
        },
        {
          urlPattern: /\.(?:aac|flac|m4a|mp3|ogg|wav)(?:\?.*)?$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'theap-snae-audio-v1',
            cacheableResponse: { statuses: [0, 200] },
            expiration: {
              maxEntries: 12,
              maxAgeSeconds: 60 * 60 * 24 * 30,
              purgeOnQuotaError: true,
            },
            rangeRequests: true,
          },
        },
        {
          urlPattern: /\.(?:otf|ttf|woff2?)(?:\?.*)?$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'theap-snae-fonts-v1',
            cacheableResponse: { statuses: [0, 200] },
            expiration: {
              maxEntries: 80,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
        {
          urlPattern: /\.(?:css|js|mjs)(?:\?.*)?$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'theap-snae-assets-v1',
            cacheableResponse: { statuses: [0, 200] },
            expiration: {
              maxEntries: 120,
              maxAgeSeconds: 60 * 60 * 24 * 30,
              purgeOnQuotaError: true,
            },
          },
        },
      ],
    },
  },

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
      htmlAttrs: { lang: 'km' },
      title: 'ធៀបស្នេហ៍ — ធៀបការឌីជីថល',
      link: [
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icons/app-icon-192.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'description', content: 'បង្កើតធៀបការឌីជីថលដ៏ស្រស់ស្អាត ឯកជន និងអាចប្រើបានក្រៅបណ្ដាញ។ ទិន្នន័យរបស់អ្នករក្សាទុកតែក្នុងកម្មវិធីរុករករបស់អ្នក។' },
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
        { property: 'og:site_name', content: 'ធៀបស្នេហ៍' },
        { name: 'twitter:card', content: 'summary' },
      ],
    },
  },
})

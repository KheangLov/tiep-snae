/*
 * Runtime cache ownership is deliberately narrow: this activation handler
 * only removes obsolete caches created by this app. Workbox manages its own
 * revisioned precache through cleanupOutdatedCaches.
 *
 * Keep CACHE_VERSION aligned with appCacheVersion in nuxt.config.ts.
 */
const CACHE_PREFIX = 'theap-snae'
const CACHE_VERSION = 'v2'
const CURRENT_RUNTIME_CACHES = new Set([
  `${CACHE_PREFIX}-pages-${CACHE_VERSION}`,
  `${CACHE_PREFIX}-images-${CACHE_VERSION}`,
  `${CACHE_PREFIX}-audio-${CACHE_VERSION}`,
  `${CACHE_PREFIX}-fonts-${CACHE_VERSION}`,
  `${CACHE_PREFIX}-assets-${CACHE_VERSION}`,
])

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames
        .filter(cacheName => (
          cacheName.startsWith(`${CACHE_PREFIX}-`)
          && !CURRENT_RUNTIME_CACHES.has(cacheName)
        ))
        .map(cacheName => caches.delete(cacheName)),
    )),
  )
})

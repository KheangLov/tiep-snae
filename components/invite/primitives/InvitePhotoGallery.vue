<script setup lang="ts">
import type { InviteLanguage, PhotoItem } from '~/types/invite'

defineProps<{ photos: PhotoItem[]; language: InviteLanguage }>()
</script>

<template>
  <section class="flex flex-col items-center gap-4">
    <h2 class="text-xs uppercase tracking-[0.25em]" :style="{ color: 'var(--invite-accent-secondary)' }">
      {{ language === 'km' ? 'រូបភាព' : 'Photos' }}
    </h2>
    <div class="gallery-grid w-full">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="gallery-item"
        :style="{ border: '0.0625rem solid color-mix(in srgb, var(--invite-accent) 16%, transparent)' }"
      >
        <img :src="photo.url" :alt="photo.caption ?? ''" class="h-full w-full object-cover" loading="lazy">
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;
}
.gallery-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius-lg, 1.125rem);
  /* Off-screen gallery photos on a long invitation skip layout/paint work
     until they're about to scroll into view -- same technique as the
     template-gallery thumbnails (components/preview/LazyMount.vue), applied
     here to a live invitation's own photo grid instead. */
  content-visibility: auto;
  contain-intrinsic-size: 0 12rem;
}

@media (min-width: 30rem) {
  .gallery-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>

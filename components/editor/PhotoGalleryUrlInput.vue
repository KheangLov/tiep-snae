<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { PhotoItem } from '~/types/invite'
import { normalizeHostedAssetUrl } from '~/utils/assetUrl'

const props = defineProps<{ photos: PhotoItem[] }>()
const emit = defineEmits<{ add: [PhotoItem]; remove: [string] }>()

// No longer capped tightly by a storage-quota concern -- since only a link
// is kept per photo (never the image itself), a dozen photos costs about
// as much space as one. The cap now just keeps the gallery itself
// browsable rather than protecting localStorage.
const MAX_PHOTOS = 12
const urlInput = ref('')
const status = ref<'idle' | 'loading' | 'error' | 'full'>('idle')

function addUrl() {
  const input = urlInput.value.trim()
  if (!input) return
  if (props.photos.length >= MAX_PHOTOS) {
    status.value = 'full'
    return
  }
  const url = normalizeHostedAssetUrl(input, 'image')
  if (!url) {
    status.value = 'error'
    return
  }

  urlInput.value = url
  status.value = 'loading'
  const img = new Image()
  img.onload = () => {
    emit('add', { id: uuidv4(), url })
    urlInput.value = ''
    status.value = 'idle'
  }
  img.onerror = () => {
    status.value = 'error'
  }
  img.src = url
}
</script>

<template>
  <div>
    <div v-if="photos.length" class="gallery-editor-grid mb-3">
      <div v-for="photo in photos" :key="photo.id" class="gallery-editor-item">
        <img :src="photo.url" alt="" class="gallery-editor-img">
        <v-btn
          icon="solar:trash-bin-minimalistic-linear"
          size="x-small"
          variant="flat"
          color="error"
          class="gallery-editor-remove"
          @click="emit('remove', photo.id)"
        />
      </div>
    </div>

    <div class="d-flex ga-2 align-start">
      <v-text-field
        v-model="urlInput"
        label="Paste a photo link"
        placeholder="https://…"
        density="compact"
        hide-details
        @keydown.enter="addUrl"
      />
      <v-btn variant="tonal" :loading="status === 'loading'" @click="addUrl">Add</v-btn>
    </div>
    <p v-if="status === 'error'" class="text-caption text-error mt-2 mb-0">
      Couldn't load that image — check the link is public and correct.
    </p>
    <p v-else-if="status === 'full'" class="text-caption text-error mt-2 mb-0">
      That's the {{ MAX_PHOTOS }}-photo limit — remove one to add another.
    </p>
    <p class="text-caption text-medium-emphasis mt-2 mb-0">
      {{ photos.length }} / {{ MAX_PHOTOS }} photos. Upload images to your own public storage first, then
      paste each file link. We keep only the links, never the images.
    </p>
  </div>
</template>

<style scoped>
.gallery-editor-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
}
.gallery-editor-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 0.0625rem solid var(--flat-glass-border);
}
.gallery-editor-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gallery-editor-remove {
  position: absolute;
  top: 0.1875rem;
  right: 0.1875rem;
}
</style>

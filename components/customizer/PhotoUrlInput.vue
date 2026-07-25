<script setup lang="ts">
import { ref, watch } from 'vue'
import { normalizeHostedAssetUrl } from '~/utils/assetUrl'

const props = defineProps<{ modelValue?: string; label?: string }>()
const emit = defineEmits<{ 'update:modelValue': [string | undefined] }>()

const urlInput = ref(props.modelValue ?? '')
const status = ref<'idle' | 'loading' | 'ok' | 'error'>(props.modelValue ? 'ok' : 'idle')

watch(() => props.modelValue, (value) => {
  urlInput.value = value ?? ''
  status.value = value ? 'ok' : 'idle'
})

function checkAndApply() {
  const input = urlInput.value.trim()
  if (!input) {
    emit('update:modelValue', undefined)
    status.value = 'idle'
    return
  }
  const url = normalizeHostedAssetUrl(input, 'image')
  if (!url) {
    status.value = 'error'
    return
  }

  urlInput.value = url
  status.value = 'loading'
  // Load the URL client-side purely to confirm it's a real, reachable image
  // before saving it -- the image itself is never fetched into our own
  // storage, only this link is kept (see InviteData.heroPhoto).
  const img = new Image()
  img.onload = () => {
    status.value = 'ok'
    emit('update:modelValue', url)
  }
  img.onerror = () => {
    status.value = 'error'
  }
  img.src = url
}

function clear() {
  urlInput.value = ''
  emit('update:modelValue', undefined)
  status.value = 'idle'
}
</script>

<template>
  <div>
    <div class="d-flex ga-2 align-start">
      <v-text-field
        v-model="urlInput"
        :label="label ?? 'Photo link'"
        placeholder="https://…"
        density="compact"
        hide-details
        @keydown.enter="checkAndApply"
      />
      <v-btn variant="tonal" :loading="status === 'loading'" @click="checkAndApply">Use</v-btn>
    </div>
    <p v-if="status === 'error'" class="text-caption text-error mt-2 mb-0">
      Couldn't load that image — check the link is public and correct.
    </p>
    <div v-if="modelValue && status !== 'error'" class="d-flex align-center ga-3 mt-3">
      <img :src="modelValue" alt="" class="photo-url-preview">
      <v-btn variant="text" size="small" color="error" @click="clear">Remove</v-btn>
    </div>
    <p class="text-caption text-medium-emphasis mt-2 mb-0">
      Upload the image to your own storage first (for example, Google Drive), allow “Anyone with the link”
      to view it, then paste its public file link here. We save only the link, never the image.
    </p>
  </div>
</template>

<style scoped>
.photo-url-preview {
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border-radius: var(--radius-lg);
  border: 0.0625rem solid var(--flat-glass-border);
}
</style>

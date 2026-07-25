<script setup lang="ts">
import { ref, watch } from 'vue'
import { normalizeHostedAssetUrl } from '~/utils/assetUrl'

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{ 'update:modelValue': [string | undefined] }>()

const error = ref<string | null>(null)
const urlInput = ref(props.modelValue ?? '')

watch(() => props.modelValue, (value) => {
  urlInput.value = value ?? ''
})

function applyUrl() {
  error.value = null
  const input = urlInput.value.trim()
  if (!input) {
    emit('update:modelValue', undefined)
    return
  }

  const url = normalizeHostedAssetUrl(input, 'audio')
  if (!url) {
    error.value = 'Enter a valid public https:// audio link.'
    return
  }

  urlInput.value = url
  emit('update:modelValue', url)
}

function remove() {
  urlInput.value = ''
  error.value = null
  emit('update:modelValue', undefined)
}

function onPlaybackError() {
  error.value = 'The browser could not play this audio. Check that the link is public and points to an MP3 or audio file.'
}
</script>

<template>
  <div class="d-flex flex-column ga-3">
    <div class="d-flex align-center ga-2">
      <v-text-field
        v-model="urlInput"
        label="Public MP3 or audio link"
        placeholder="https://…"
        density="compact"
        hide-details
        @keydown.enter="applyUrl"
      />
      <v-btn variant="tonal" size="small" @click="applyUrl">Use link</v-btn>
    </div>

    <p class="text-caption text-medium-emphasis mb-0">
      Upload the MP3 to Google Drive or another host, allow “Anyone with the link” to view it, then paste
      the public file link. We store only this link.
    </p>
    <p v-if="error" class="text-caption text-error mb-0">{{ error }}</p>
    <div v-if="modelValue" class="d-flex flex-column ga-2">
      <audio :src="modelValue" controls preload="metadata" class="w-100" style="height: 2.25rem" @error="onPlaybackError" />
      <v-btn variant="text" size="small" color="error" class="align-self-start" @click="remove">Remove link</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { normalizeHostedAssetUrl } from '~/utils/assetUrl'

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{ 'update:modelValue': [string | undefined] }>()

const urlInput = ref(props.modelValue ?? '')
const status = ref<'idle' | 'loading' | 'ok' | 'error'>(props.modelValue ? 'ok' : 'idle')
const error = ref<string | null>(null)

watch(() => props.modelValue, (value) => {
  urlInput.value = value ?? ''
  status.value = value ? 'ok' : 'idle'
})

function checkAndApply() {
  const input = urlInput.value.trim()
  error.value = null
  if (!input) {
    remove()
    return
  }

  const url = normalizeHostedAssetUrl(input, 'image')
  if (!url) {
    status.value = 'error'
    error.value = 'Enter a valid public https:// image link.'
    return
  }

  urlInput.value = url
  status.value = 'loading'
  const img = new Image()
  img.onload = () => {
    status.value = 'ok'
    emit('update:modelValue', url)
  }
  img.onerror = () => {
    status.value = 'error'
    error.value = 'Could not load that KHQR image. Check that the link is public and correct.'
  }
  img.src = url
}

function remove() {
  urlInput.value = ''
  status.value = 'idle'
  error.value = null
  emit('update:modelValue', undefined)
}
</script>

<template>
  <div class="d-flex flex-column ga-3">
    <div class="d-flex align-start ga-2">
      <v-text-field
        v-model="urlInput"
        label="Public KHQR image link"
        placeholder="https://…"
        density="compact"
        hide-details
        @keydown.enter="checkAndApply"
      />
      <v-btn variant="tonal" size="small" :loading="status === 'loading'" @click="checkAndApply">Use link</v-btn>
    </div>

    <p class="text-caption text-medium-emphasis mb-0">
      Upload a clear PNG to your own storage, allow “Anyone with the link” to view it, then paste the
      public file link. We save only this link.
    </p>
    <p v-if="error" class="text-caption text-error mb-0">{{ error }}</p>

    <div v-if="modelValue && status !== 'error'" class="d-flex align-center ga-4">
      <div class="qr-preview">
        <img :src="modelValue" alt="KHQR preview" class="qr-preview-img">
      </div>
      <v-btn variant="text" size="small" color="error" @click="remove">Remove link</v-btn>
    </div>
  </div>
</template>

<style scoped>
.qr-preview {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 0.0625rem solid var(--flat-glass-border);
  background: #fff;
  padding: 0.25rem;
}
.qr-preview-img {
  width: 100%;
  height: 100%;
  /* Never crop a QR code; losing even a corner can make it unscannable. */
  object-fit: contain;
}
</style>

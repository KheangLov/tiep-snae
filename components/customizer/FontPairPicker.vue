<script setup lang="ts">
import { FONT_PAIRS, type FontPairId } from '~/templates/theme/fontPairs'

defineProps<{ modelValue: FontPairId }>()
const emit = defineEmits<{ 'update:modelValue': [FontPairId] }>()

const entries = Object.entries(FONT_PAIRS) as [FontPairId, (typeof FONT_PAIRS)[FontPairId]][]
</script>

<template>
  <div class="d-flex flex-column ga-2">
    <button
      v-for="[id, pair] in entries"
      :key="id"
      type="button"
      class="font-option"
      :class="{ 'font-option--active': modelValue === id }"
      @click="emit('update:modelValue', id)"
    >
      <span :style="{ fontFamily: pair.heading }" class="text-h6">{{ pair.label }}</span>
      <span :style="{ fontFamily: pair.body }" class="text-caption text-medium-emphasis">
        Aa Bb Cc — the quick brown fox
      </span>
    </button>
  </div>
</template>

<style scoped>
.font-option {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.75rem 1rem;
  text-align: left;
  border-radius: var(--radius-lg);
  border: 0.125rem solid var(--flat-glass-border);
  background: var(--flat-glass-bg);
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;
}
.font-option:hover {
  background: var(--flat-glass-bg-hover);
}
.font-option--active {
  border-color: rgb(var(--v-theme-primary));
}
</style>

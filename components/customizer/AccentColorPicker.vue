<script setup lang="ts">
import { ACCENT_PALETTE } from '~/templates/theme/accentPalette'

defineProps<{ accentColor: string; accentColorSecondary?: string }>()
const emit = defineEmits<{ select: [{ accentColor: string; accentColorSecondary: string }] }>()
</script>

<template>
  <div class="d-flex flex-wrap ga-3">
    <button
      v-for="choice in ACCENT_PALETTE"
      :key="choice.id"
      type="button"
      class="accent-swatch"
      :class="{ 'accent-swatch--active': accentColor === choice.accentColor && accentColorSecondary === choice.accentColorSecondary }"
      @click="emit('select', { accentColor: choice.accentColor, accentColorSecondary: choice.accentColorSecondary })"
    >
      <span class="accent-swatch-dots" aria-hidden="true">
        <span :style="{ background: choice.accentColor }" />
        <span :style="{ background: choice.accentColorSecondary }" />
      </span>
      <span class="text-caption">{{ choice.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.accent-swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  width: 6.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  border: 0.125rem solid transparent;
  background: var(--flat-glass-bg);
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;
}
.accent-swatch:hover {
  background: var(--flat-glass-bg-hover);
}
.accent-swatch--active {
  border-color: rgb(var(--v-theme-primary));
}
.accent-swatch-dots {
  display: flex;
}
.accent-swatch-dots span {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  border: 0.125rem solid rgb(var(--v-theme-surface));
  box-shadow: 0 0 0 0.0625rem rgba(0, 0, 0, 0.08);
}
.accent-swatch-dots span + span {
  margin-left: -0.5rem;
}
</style>

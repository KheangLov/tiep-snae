<script setup lang="ts">
import { ACCENT_PALETTE } from '~/templates/theme/accentPalette'

const props = defineProps<{ accentColor: string; accentColorSecondary?: string }>()
const emit = defineEmits<{ select: [{ accentColor: string; accentColorSecondary: string }] }>()

function setPrimary(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('select', { accentColor: value, accentColorSecondary: props.accentColorSecondary ?? value })
}

function setSecondary(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('select', { accentColor: props.accentColor, accentColorSecondary: value })
}
</script>

<template>
  <div>
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

    <div class="custom-colors mt-4">
      <label class="custom-color">
        <input type="color" :value="accentColor" aria-label="Custom primary color" @input="setPrimary">
        <span>
          <strong>Primary</strong>
          <small>{{ accentColor.toUpperCase() }}</small>
        </span>
      </label>
      <label class="custom-color">
        <input
          type="color"
          :value="accentColorSecondary ?? accentColor"
          aria-label="Custom secondary color"
          @input="setSecondary"
        >
        <span>
          <strong>Secondary</strong>
          <small>{{ (accentColorSecondary ?? accentColor).toUpperCase() }}</small>
        </span>
      </label>
    </div>
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
.custom-colors {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}
.custom-color {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  min-width: 0;
  padding: 0.75rem;
  cursor: pointer;
  background: var(--flat-glass-bg);
  border: 0.0625rem solid var(--flat-glass-border);
  border-radius: var(--radius-lg);
}
.custom-color input {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.15rem;
  overflow: hidden;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 50%;
}
.custom-color span {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.custom-color strong { font-size: 0.78rem; }
.custom-color small {
  font-size: 0.65rem;
  opacity: 0.62;
}
</style>

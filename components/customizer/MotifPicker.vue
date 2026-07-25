<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { MOTIFS, type MotifId } from '~/templates/theme/motifs'

const props = defineProps<{ modelValue: MotifId; accentColor: string }>()
const emit = defineEmits<{ 'update:modelValue': [MotifId] }>()

// Keep the plain "None" choice alongside every registered motif.
const options = computed<MotifId[]>(() => ['none', ...(Object.keys(MOTIFS) as MotifId[])])

const labels: Partial<Record<MotifId, string>> = {
  none: 'None',
  'phka-garland': 'Phka Garland',
  'botanical-sprig': 'Botanical Sprig',
  'angkor-frieze': 'Angkor Frieze',
  'naga-scale': 'Naga Scale',
  'silk-hol': 'Silk Hol',
  sunburst: 'Art Deco Sun',
  'watercolor-blob': 'Watercolor',
  'angkor-wat-silhouette': 'Angkor Wat',
}

const motifComponents = computed(() =>
  Object.fromEntries(
    Object.entries(MOTIFS).map(([id, loader]) => [id, defineAsyncComponent(loader!)]),
  ),
)
</script>

<template>
  <div class="d-flex flex-wrap ga-3">
    <button
      v-for="option in options"
      :key="option"
      type="button"
      class="motif-option"
      :class="{ 'motif-option--active': modelValue === option }"
      @click="emit('update:modelValue', option)"
    >
      <span class="motif-preview" :style="{ color: accentColor }" aria-hidden="true">
        <component :is="motifComponents[option]" v-if="motifComponents[option]" class="motif-preview-svg" />
        <span v-else class="text-caption text-medium-emphasis">—</span>
      </span>
      <span class="text-caption">{{ labels[option] ?? option }}</span>
    </button>
  </div>
</template>

<style scoped>
.motif-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 7rem;
  padding: 0.875rem;
  border-radius: var(--radius-lg);
  border: 0.125rem solid var(--flat-glass-border);
  background: var(--flat-glass-bg);
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;
}
.motif-option:hover {
  background: var(--flat-glass-bg-hover);
}
.motif-option--active {
  border-color: rgb(var(--v-theme-primary));
}
.motif-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 4.75rem;
  height: 1.5rem;
  overflow: hidden;
}

.motif-preview :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}
</style>

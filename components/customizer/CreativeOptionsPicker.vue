<script setup lang="ts">
import type { Density, EffectId } from '~/templates/theme/tokens'

defineProps<{ density: Density; effectId: EffectId }>()
const emit = defineEmits<{
  'update:density': [Density]
  'update:effectId': [EffectId]
}>()

const densities: { id: Density; label: string; description: string }[] = [
  { id: 'compact', label: 'Compact', description: 'More details on screen' },
  { id: 'comfortable', label: 'Balanced', description: 'Easy, natural rhythm' },
  { id: 'spacious', label: 'Airy', description: 'Editorial breathing room' },
]

const effects: { id: EffectId; label: string; description: string; icon: string }[] = [
  { id: 'none', label: 'Still', description: 'Clean and calm', icon: 'solar:minimalistic-magnifer-linear' },
  { id: 'falling-leaves', label: 'Golden leaves', description: 'Soft drifting leaves', icon: 'solar:leaf-linear' },
  { id: 'falling-hearts', label: 'Sweet hearts', description: 'Romantic falling hearts', icon: 'solar:heart-angle-linear' },
]
</script>

<template>
  <div class="creative-options">
    <div>
      <p class="text-subtitle-2 font-weight-bold mb-1">Spacing</p>
      <p class="text-caption text-medium-emphasis mb-3">Choose how much room each section gets.</p>
      <div class="option-grid">
        <button
          v-for="option in densities"
          :key="option.id"
          type="button"
          class="creative-option"
          :class="{ 'creative-option--active': density === option.id }"
          @click="emit('update:density', option.id)"
        >
          <span class="density-lines" :class="`density-lines--${option.id}`" aria-hidden="true">
            <i /><i /><i />
          </span>
          <strong>{{ option.label }}</strong>
          <small>{{ option.description }}</small>
        </button>
      </div>
    </div>

    <div>
      <p class="text-subtitle-2 font-weight-bold mb-1">Ambient motion</p>
      <p class="text-caption text-medium-emphasis mb-3">Add a gentle effect or keep the invitation still.</p>
      <div class="option-grid">
        <button
          v-for="option in effects"
          :key="option.id"
          type="button"
          class="creative-option"
          :class="{ 'creative-option--active': effectId === option.id }"
          @click="emit('update:effectId', option.id)"
        >
          <v-icon :icon="option.icon" size="22" color="primary" />
          <strong>{{ option.label }}</strong>
          <small>{{ option.description }}</small>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.creative-options {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}
.option-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
}
.creative-option {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
  min-width: 0;
  padding: 0.75rem;
  text-align: left;
  cursor: pointer;
  background: var(--flat-glass-bg);
  border: 0.125rem solid var(--flat-glass-border);
  border-radius: var(--radius-lg);
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}
.creative-option:hover {
  background: var(--flat-glass-bg-hover);
  transform: translateY(-0.125rem);
}
.creative-option--active { border-color: rgb(var(--v-theme-primary)); }
.creative-option strong { font-size: 0.76rem; }
.creative-option small {
  font-size: 0.64rem;
  line-height: 1.3;
  opacity: 0.62;
}
.density-lines {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 2.25rem;
  height: 1.35rem;
}
.density-lines i {
  display: block;
  height: 0.16rem;
  background: rgb(var(--v-theme-primary));
  border-radius: 999px;
}
.density-lines--compact { gap: 0.08rem; justify-content: flex-start; }
.density-lines--comfortable { gap: 0.22rem; justify-content: center; }
.density-lines--spacious { justify-content: space-between; }

@media (max-width: 30rem) {
  .option-grid { grid-template-columns: 1fr; }
  .creative-option {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
  }
  .creative-option small { grid-column: 2; }
}
</style>

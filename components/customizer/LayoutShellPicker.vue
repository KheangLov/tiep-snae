<script setup lang="ts">
import type { InviteLayoutShellId } from '~/types/template'

defineProps<{ modelValue: InviteLayoutShellId }>()
const emit = defineEmits<{ 'update:modelValue': [InviteLayoutShellId] }>()

const shells: { id: InviteLayoutShellId; label: string; description: string; available: boolean }[] = [
  { id: 'classic-portrait', label: 'Classic Portrait', description: 'A single flowing column — the timeless invitation shape.', available: true },
  { id: 'hero-split', label: 'Hero Split', description: 'A bold split hero layout.', available: false },
  { id: 'timeline-scroll', label: 'Timeline Scroll', description: 'A day-by-day scrolling story.', available: false },
  { id: 'card-stack', label: 'Card Stack', description: 'Frosted-glass detail cards.', available: false },
]
</script>

<template>
  <div class="d-flex flex-wrap ga-3">
    <button
      v-for="shell in shells"
      :key="shell.id"
      type="button"
      class="shell-option"
      :class="{ 'shell-option--active': modelValue === shell.id }"
      :disabled="!shell.available"
      @click="emit('update:modelValue', shell.id)"
    >
      <span class="text-subtitle-2 font-weight-bold">{{ shell.label }}</span>
      <span class="text-caption text-medium-emphasis">{{ shell.available ? shell.description : 'Coming soon' }}</span>
    </button>
  </div>
</template>

<style scoped>
.shell-option {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 11.5rem;
  padding: 1rem;
  text-align: left;
  border-radius: var(--radius-lg);
  border: 0.0625rem solid var(--flat-glass-border);
  background: var(--flat-glass-bg);
  cursor: pointer;
  transition: border-color 0.18s ease, transform 0.18s ease, background 0.18s ease;
}
.shell-option:hover:not(:disabled) {
  transform: translateY(-0.125rem);
  background: var(--flat-glass-bg-hover);
}
.shell-option--active {
  border-color: rgb(var(--v-theme-primary));
  border-width: 0.125rem;
}
.shell-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

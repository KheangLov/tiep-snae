<script setup lang="ts">
import type { InviteLayoutShellId } from '~/types/template'

defineProps<{ modelValue: InviteLayoutShellId }>()
const emit = defineEmits<{ 'update:modelValue': [InviteLayoutShellId] }>()

const shells: { id: InviteLayoutShellId; label: string; description: string }[] = [
  { id: 'classic-portrait', label: 'Classic Portrait', description: 'Elegant, centered, and timeless.' },
  { id: 'hero-split', label: 'Bold Hero', description: 'A dramatic opening with photo focus.' },
  { id: 'timeline-scroll', label: 'Timeline Story', description: 'Ceremonies unfold chapter by chapter.' },
  { id: 'card-stack', label: 'Modern Cards', description: 'Flexible details in layered glass cards.' },
  { id: 'cinematic-scroll', label: 'Cinematic', description: 'Immersive, full-screen visual storytelling.' },
  { id: 'story-album', label: 'Story Album', description: 'A playful scrapbook of shared moments.' },
]
</script>

<template>
  <div class="shell-grid">
    <button
      v-for="shell in shells"
      :key="shell.id"
      type="button"
      class="shell-option"
      :class="{ 'shell-option--active': modelValue === shell.id }"
      @click="emit('update:modelValue', shell.id)"
    >
      <span class="shell-preview" :class="`shell-preview--${shell.id}`" aria-hidden="true">
        <i /><i /><i /><i />
      </span>
      <span class="text-subtitle-2 font-weight-bold">{{ shell.label }}</span>
      <span class="text-caption text-medium-emphasis">{{ shell.description }}</span>
    </button>
  </div>
</template>

<style scoped>
.shell-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}
.shell-option {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
  padding: 0.75rem;
  text-align: left;
  border-radius: var(--radius-lg);
  border: 0.125rem solid var(--flat-glass-border);
  background: var(--flat-glass-bg);
  cursor: pointer;
  transition: border-color 0.18s ease, transform 0.18s ease, background 0.18s ease;
}
.shell-option:hover {
  transform: translateY(-0.125rem);
  background: var(--flat-glass-bg-hover);
}
.shell-option--active {
  border-color: rgb(var(--v-theme-primary));
}

.shell-preview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 0.2rem;
  width: 100%;
  height: 4.5rem;
  padding: 0.45rem;
  margin-bottom: 0.2rem;
  overflow: hidden;
  border-radius: 0.7rem;
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 9%, var(--flat-glass-bg));
}
.shell-preview i {
  display: block;
  border-radius: 0.2rem;
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 26%, transparent);
}
.shell-preview--classic-portrait i:first-child {
  grid-column: 1 / -1;
  grid-row: 1 / 3;
  border-radius: 999px;
  justify-self: center;
  width: 2.3rem;
}
.shell-preview--classic-portrait i:nth-child(n + 2) {
  grid-row: 3;
}
.shell-preview--hero-split i:first-child {
  grid-column: 1 / -1;
  grid-row: 1 / 3;
  background: rgb(var(--v-theme-primary));
}
.shell-preview--hero-split i:nth-child(n + 2) {
  grid-row: 3;
}
.shell-preview--timeline-scroll {
  grid-template-columns: 0.25rem 1fr;
}
.shell-preview--timeline-scroll i:first-child {
  grid-row: 1 / -1;
  background: rgb(var(--v-theme-primary));
}
.shell-preview--timeline-scroll i:nth-child(n + 2) {
  grid-column: 2;
}
.shell-preview--card-stack {
  display: flex;
  flex-direction: column;
}
.shell-preview--card-stack i {
  flex: 1;
  box-shadow: 0 0.2rem 0.5rem rgb(var(--v-theme-primary) / 14%);
}
.shell-preview--cinematic-scroll {
  display: block;
  position: relative;
  background: linear-gradient(145deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
}
.shell-preview--cinematic-scroll i:first-child {
  position: absolute;
  right: 0.7rem;
  bottom: 0.7rem;
  left: 0.7rem;
  height: 0.4rem;
  background: rgb(255 255 255 / 78%);
}
.shell-preview--cinematic-scroll i:nth-child(2) {
  position: absolute;
  right: 0.7rem;
  bottom: 1.35rem;
  left: 1.7rem;
  height: 0.3rem;
  background: rgb(255 255 255 / 42%);
}
.shell-preview--story-album {
  position: relative;
  display: block;
}
.shell-preview--story-album i {
  position: absolute;
  width: 2.4rem;
  height: 3rem;
  background: rgb(var(--v-theme-primary) / 24%);
  box-shadow: 0 0.3rem 0.8rem rgb(var(--v-theme-primary) / 14%);
}
.shell-preview--story-album i:first-child {
  top: 0.7rem;
  left: 1rem;
  transform: rotate(-7deg);
}
.shell-preview--story-album i:nth-child(2) {
  top: 0.4rem;
  right: 1rem;
  transform: rotate(6deg);
}

@media (max-width: 25rem) {
  .shell-grid { grid-template-columns: 1fr; }
}
</style>

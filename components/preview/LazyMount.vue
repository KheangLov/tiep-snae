<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = withDefaults(defineProps<{ rootMargin?: string }>(), { rootMargin: '300px' })

const target = ref<HTMLElement | null>(null)
const visible = ref(false)

// Off-screen gallery cards never mount their (live-rendered, font-loading)
// TemplateRenderer until they're about to scroll into view -- and once
// mounted, they stay mounted (stop() below) rather than toggling on every
// scroll, so a template never re-renders from scratch after its first
// appearance.
const { stop } = useIntersectionObserver(target, ([entry]) => {
  if (entry?.isIntersecting) {
    visible.value = true
    stop()
  }
}, { rootMargin: props.rootMargin })
</script>

<template>
  <div ref="target">
    <slot v-if="visible" />
    <div v-else class="d-flex align-center justify-center" style="min-height: 12rem">
      <v-progress-circular indeterminate size="28" width="2" color="primary" />
    </div>
  </div>
</template>

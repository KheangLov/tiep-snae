<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { MOTIFS, type MotifId } from '~/templates/theme/motifs'

const props = defineProps<{ motifId?: MotifId }>()

const MotifComponent = computed(() => {
  if (!props.motifId || props.motifId === 'none') return null
  const loader = MOTIFS[props.motifId]
  return loader ? defineAsyncComponent(loader) : null
})
</script>

<template>
  <div v-if="MotifComponent" class="flex justify-center" :style="{ color: 'var(--invite-accent)' }" aria-hidden="true">
    <component :is="MotifComponent" class="h-7 w-auto" />
  </div>
</template>

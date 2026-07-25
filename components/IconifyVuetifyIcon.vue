<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

// Vuetify's icon-set contract: a component taking `tag`/`icon`/`disabled`.
// Wrapping @iconify/vue's own <Icon> here means every `icon="solar:x-linear"`
// call site across the app just works -- no slotted icon components needed
// (see plugins/vuetify.ts for the iconset wiring).
//
// Vuetify strips the recognized set name ("solar") from the icon string
// before passing it down, so `icon="solar:sun-linear"` arrives here as just
// "sun-linear" -- re-add the "solar:" prefix so @iconify/vue's registry
// lookup (or its on-demand fetch from the public Iconify API, since no local
// icon collection is pre-registered in this project) can resolve it.
const props = defineProps<{ tag: string; icon?: string; disabled?: boolean }>()
const fullIconName = computed(() => (props.icon ? `solar:${props.icon}` : undefined))
</script>

<template>
  <Icon v-if="fullIconName" :icon="fullIconName" />
</template>

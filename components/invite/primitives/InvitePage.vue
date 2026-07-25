<script setup lang="ts">
// The invitation's own scrolling page shell. Deliberately Tailwind-only,
// never a Vuetify component -- this render tree never mounts inside
// <v-app>, so Vuetify's .v-application-scoped styles never reach it. See
// components/invite/TemplateRenderer.vue for the Vuetify/Tailwind split.
import type { EffectId } from '~/templates/theme/tokens'
import InviteFallingParticles from './InviteFallingParticles.vue'

defineProps<{ effectId?: EffectId }>()
</script>

<template>
  <div
    class="invite-page w-full min-h-screen"
    :style="{
      fontFamily: 'var(--invite-font-body)',
      color: 'var(--invite-ink)',
      background: 'linear-gradient(180deg, var(--invite-accent-soft) 0%, transparent 46%)',
    }"
  >
    <InviteFallingParticles
      v-if="effectId === 'falling-leaves'"
      variant="leaves"
    />
    <InviteFallingParticles
      v-else-if="effectId === 'falling-hearts'"
      variant="hearts"
    />
    <div
      class="mx-auto flex flex-col px-6 py-16 md:px-10"
      style="max-width: 42rem; gap: var(--invite-section-gap, 3rem)"
    >
      <slot />
    </div>
  </div>
</template>

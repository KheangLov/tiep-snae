<script setup lang="ts">
// The invitation's own scrolling page shell. Deliberately Tailwind-only,
// never a Vuetify component -- this render tree never mounts inside
// <v-app>, so Vuetify's .v-application-scoped styles never reach it. See
// components/invite/TemplateRenderer.vue for the Vuetify/Tailwind split.
import { computed } from 'vue'
import type { BackgroundImageSettings } from '~/types/invite'
import type { EffectId } from '~/templates/theme/tokens'
import InviteFallingParticles from './InviteFallingParticles.vue'

const props = defineProps<{ effectId?: EffectId; backgroundImage?: BackgroundImageSettings }>()

const pageStyle = computed(() => {
  const base = {
    fontFamily: 'var(--invite-font-body)',
    color: 'var(--invite-ink)',
    background: 'linear-gradient(180deg, var(--invite-accent-soft) 0%, transparent 46%)',
  }
  if (!props.backgroundImage?.url) return base

  const opacity = Math.round(Math.min(1, Math.max(0, props.backgroundImage.overlayOpacity ?? 0.7)) * 100)
  return {
    ...base,
    backgroundImage: `linear-gradient(color-mix(in srgb, var(--invite-accent-soft) ${opacity}%, transparent), color-mix(in srgb, var(--invite-accent-soft) ${opacity}%, transparent)), url("${props.backgroundImage.url}")`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
  }
})
</script>

<template>
  <div
    class="invite-page w-full min-h-screen"
    :style="pageStyle"
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

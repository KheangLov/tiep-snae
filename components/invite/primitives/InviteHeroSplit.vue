<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { InviteData } from '~/types/invite'
import { formatInviteDate } from '~/utils/formatInviteDate'
import { MOTIFS } from '~/templates/theme/motifs'

const props = defineProps<{ invite: InviteData; dark?: boolean; guestName?: string }>()

// Some motifs are monumental enough to earn a large, dedicated treatment
// right in the hero banner (a temple skyline along the horizon) rather than
// the small divider every other template gets between sections -- see
// components/invite/layoutShells/HeroSplitShell.vue, which skips the small
// divider when this is active to avoid showing the same artwork twice.
const heroMotifId = 'angkor-wat-silhouette' as const
const showHeroSilhouette = computed(() => props.invite.themeTokens.motifId === heroMotifId)
const HeroSilhouette = defineAsyncComponent(MOTIFS[heroMotifId]!)

const formattedDate = computed(() => {
  if (props.invite.event.displayDateOverride) return props.invite.event.displayDateOverride
  if (!props.invite.event.date) return ''
  return formatInviteDate(props.invite.event.date, props.invite.language === 'km' ? 'km-KH' : 'en-US')
})

const backgroundStyle = computed(() => {
  if (props.invite.heroPhoto) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.55)), url(${props.invite.heroPhoto})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {
    background: props.dark
      ? 'linear-gradient(160deg, var(--invite-ink), color-mix(in srgb, var(--invite-accent) 55%, black))'
      : 'linear-gradient(160deg, var(--invite-accent), var(--invite-accent-secondary))',
  }
})
</script>

<template>
  <header class="hero-split flex flex-col items-center justify-center gap-4 px-6 py-20 text-center" :style="backgroundStyle">
    <p v-if="guestName" class="text-sm text-white/80">
      {{ invite.language === 'km' ? `ជូនចំពោះ ${guestName}` : `Dear ${guestName},` }}
    </p>
    <p class="text-xs uppercase tracking-[0.35em] text-white/80">
      {{ invite.language === 'km' ? 'យើងរៀបការហើយ' : "We're getting married" }}
    </p>
    <h1
      class="text-4xl font-semibold leading-tight text-white md:text-6xl"
      :style="{ fontFamily: 'var(--invite-font-heading)' }"
    >
      {{ invite.couple.partnerAName || 'Partner A' }}
      <span class="opacity-70">&amp;</span>
      {{ invite.couple.partnerBName || 'Partner B' }}
    </h1>
    <p v-if="formattedDate" class="text-lg text-white/90">{{ formattedDate }}</p>
    <p v-if="invite.event.timeStart" class="text-sm text-white/75">{{ invite.event.timeStart }}</p>

    <HeroSilhouette v-if="showHeroSilhouette" class="hero-split__silhouette" aria-hidden="true" />
  </header>
</template>

<style scoped>
.hero-split {
  position: relative;
  margin: -4rem -1.5rem 0;
  min-height: 24rem;
  overflow: hidden;
}
@media (min-width: 768px) {
  .hero-split {
    margin-inline: -2.5rem;
  }
}

.hero-split__silhouette {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6.5rem;
  color: rgb(255 255 255 / 22%);
  pointer-events: none;
}
</style>

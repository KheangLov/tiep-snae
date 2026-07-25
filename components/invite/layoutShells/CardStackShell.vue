<script setup lang="ts">
import type { InviteData } from '~/types/invite'
import type { InviteTemplateDefinition } from '~/types/template'
import InvitePage from '../primitives/InvitePage.vue'
import InviteHero from '../primitives/InviteHero.vue'
import InviteHostNames from '../primitives/InviteHostNames.vue'
import InviteEventTimeline from '../primitives/InviteEventTimeline.vue'
import InviteVenueMap from '../primitives/InviteVenueMap.vue'
import InviteQuote from '../primitives/InviteQuote.vue'
import InviteCountdown from '../primitives/InviteCountdown.vue'
import InviteAddToCalendar from '../primitives/InviteAddToCalendar.vue'
import InviteGiftQr from '../primitives/InviteGiftQr.vue'
import InviteMusicToggle from '../primitives/InviteMusicToggle.vue'
import InvitePhotoGallery from '../primitives/InvitePhotoGallery.vue'

defineProps<{ invite: InviteData; template: InviteTemplateDefinition; guestName?: string }>()
</script>

<template>
  <InvitePage :effect-id="invite.themeTokens.effectId">
    <div class="stack-card stack-card--hero">
      <InviteHero :invite="invite" :guest-name="guestName" />
    </div>
    <div class="stack-card flex flex-col gap-4">
      <InviteMusicToggle v-if="invite.music.enabled && invite.music.trackUrl" :music="invite.music" :language="invite.language" />
      <InviteCountdown :invite="invite" />
      <InviteAddToCalendar :invite="invite" />
    </div>
    <div v-if="invite.quote.text" class="stack-card">
      <InviteQuote :quote="invite.quote" />
    </div>
    <div v-if="invite.gallery.length" class="stack-card">
      <InvitePhotoGallery :photos="invite.gallery" :language="invite.language" />
    </div>
    <div v-if="template.sectionConfig?.showHostNames && invite.hosts.length" class="stack-card">
      <InviteHostNames :hosts="invite.hosts" :language="invite.language" />
    </div>
    <div v-if="template.sectionConfig?.showCeremonySchedule && invite.ceremonySchedule.length" class="stack-card">
      <InviteEventTimeline :schedule="invite.ceremonySchedule" :language="invite.language" />
    </div>
    <div v-if="invite.venue.name" class="stack-card">
      <InviteVenueMap :venue="invite.venue" :language="invite.language" />
    </div>
    <div v-if="invite.giftQr?.enabled && invite.giftQr.imageUrl" class="stack-card">
      <InviteGiftQr :gift-qr="invite.giftQr" :language="invite.language" />
    </div>
  </InvitePage>
</template>

<style scoped>
.stack-card {
  padding: 1.75rem 1.5rem;
  border-radius: var(--radius-xl, 1.5rem);
  background: color-mix(in srgb, var(--invite-accent-soft) 35%, white 65%);
  border: 0.0625rem solid color-mix(in srgb, var(--invite-accent) 14%, transparent);
  box-shadow: 0 1rem 2.5rem color-mix(in srgb, var(--invite-ink) 8%, transparent);
  backdrop-filter: blur(0.75rem);
  -webkit-backdrop-filter: blur(0.75rem);
}
.stack-card--hero {
  background: color-mix(in srgb, var(--invite-accent-soft) 55%, white 45%);
}
</style>

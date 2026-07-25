<script setup lang="ts">
import type { InviteData } from '~/types/invite'
import type { InviteTemplateDefinition } from '~/types/template'
import InvitePage from '../primitives/InvitePage.vue'
import InviteHeroSplit from '../primitives/InviteHeroSplit.vue'
import InviteHostNames from '../primitives/InviteHostNames.vue'
import InviteEventTimeline from '../primitives/InviteEventTimeline.vue'
import InviteVenueMap from '../primitives/InviteVenueMap.vue'
import InviteQuote from '../primitives/InviteQuote.vue'
import InviteMotifDivider from '../primitives/InviteMotifDivider.vue'
import InviteCountdown from '../primitives/InviteCountdown.vue'
import InviteAddToCalendar from '../primitives/InviteAddToCalendar.vue'
import InviteGiftQr from '../primitives/InviteGiftQr.vue'
import InviteMusicToggle from '../primitives/InviteMusicToggle.vue'
import InvitePhotoGallery from '../primitives/InvitePhotoGallery.vue'

const props = defineProps<{ invite: InviteData; template: InviteTemplateDefinition; guestName?: string }>()
</script>

<template>
  <InvitePage :effect-id="invite.themeTokens.effectId">
    <InviteHeroSplit :invite="invite" :dark="template.tags.includes('dark')" :guest-name="guestName" />
    <!-- The Angkor Wat silhouette motif already renders large across the
         hero's own horizon (see InviteHeroSplit.vue) -- showing the small
         divider version too would just repeat the same artwork twice. -->
    <InviteMotifDivider v-if="invite.themeTokens.motifId !== 'angkor-wat-silhouette'" :motif-id="invite.themeTokens.motifId" />
    <InviteMusicToggle v-if="invite.music.enabled && invite.music.trackUrl" :music="invite.music" :language="invite.language" />
    <InviteCountdown :invite="invite" />
    <InviteAddToCalendar :invite="invite" />
    <InviteQuote v-if="invite.quote.text" :quote="invite.quote" />
    <InvitePhotoGallery v-if="invite.gallery.length" :photos="invite.gallery" :language="invite.language" />
    <InviteHostNames
      v-if="template.sectionConfig?.showHostNames && invite.hosts.length"
      :hosts="invite.hosts"
      :language="invite.language"
    />
    <InviteEventTimeline
      v-if="template.sectionConfig?.showCeremonySchedule && invite.ceremonySchedule.length"
      :schedule="invite.ceremonySchedule"
      :language="invite.language"
    />
    <InviteVenueMap v-if="invite.venue.name" :venue="invite.venue" :language="invite.language" />
    <InviteGiftQr v-if="invite.giftQr?.enabled && invite.giftQr.imageUrl" :gift-qr="invite.giftQr" :language="invite.language" />
  </InvitePage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InviteData } from '~/types/invite'
import type { InviteTemplateDefinition } from '~/types/template'
import InvitePage from '../primitives/InvitePage.vue'
import InviteHero from '../primitives/InviteHero.vue'
import InviteHostNames from '../primitives/InviteHostNames.vue'
import InviteVenueMap from '../primitives/InviteVenueMap.vue'
import InviteQuote from '../primitives/InviteQuote.vue'
import InviteMotifDivider from '../primitives/InviteMotifDivider.vue'
import InviteCountdown from '../primitives/InviteCountdown.vue'
import InviteAddToCalendar from '../primitives/InviteAddToCalendar.vue'
import InviteGiftQr from '../primitives/InviteGiftQr.vue'
import InviteMusicToggle from '../primitives/InviteMusicToggle.vue'
import InvitePhotoGallery from '../primitives/InvitePhotoGallery.vue'

const props = defineProps<{ invite: InviteData; template: InviteTemplateDefinition; guestName?: string }>()

// Grouped by dayLabel so each ceremony day reads as its own chapter in the
// scrolling narrative, matching this shell's "three-day story" concept.
const groupedSchedule = computed(() => {
  const groups = new Map<string, typeof props.invite.ceremonySchedule>()
  for (const item of props.invite.ceremonySchedule) {
    const key = item.dayLabel || 'Schedule'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(item)
  }
  return [...groups.entries()]
})
</script>

<template>
  <InvitePage :effect-id="invite.themeTokens.effectId">
    <InviteHero :invite="invite" :guest-name="guestName" />
    <InviteMotifDivider :motif-id="invite.themeTokens.motifId" />
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

    <section v-if="template.sectionConfig?.showCeremonySchedule && groupedSchedule.length" class="timeline-story">
      <div v-for="[dayLabel, items] in groupedSchedule" :key="dayLabel" class="timeline-day">
        <h2 class="timeline-day-label" :style="{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-accent)' }">
          {{ dayLabel }}
        </h2>
        <ol class="timeline-line">
          <li v-for="item in items" :key="item.id" class="timeline-item">
            <span class="timeline-dot" :style="{ background: 'var(--invite-accent)' }" aria-hidden="true" />
            <div>
              <p class="text-sm font-semibold" :style="{ color: 'var(--invite-accent)' }">{{ item.time }}</p>
              <p class="font-semibold" :style="{ fontFamily: 'var(--invite-font-heading)' }">{{ item.title }}</p>
              <p v-if="item.khmerTitle" class="text-sm opacity-80">{{ item.khmerTitle }}</p>
              <p v-if="item.description" class="mt-1 text-sm opacity-70">{{ item.description }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <InviteVenueMap v-if="invite.venue.name" :venue="invite.venue" :language="invite.language" />
    <InviteGiftQr v-if="invite.giftQr?.enabled && invite.giftQr.imageUrl" :gift-qr="invite.giftQr" :language="invite.language" />
  </InvitePage>
</template>

<style scoped>
.timeline-story {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.timeline-day-label {
  margin-bottom: 0.75rem;
  text-align: center;
  font-size: 1.125rem;
}
.timeline-line {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-left: 1.25rem;
  border-left: 0.0625rem solid color-mix(in srgb, var(--invite-accent) 30%, transparent);
}
.timeline-item {
  position: relative;
  display: flex;
  gap: 0.875rem;
}
.timeline-dot {
  position: absolute;
  left: -1.5625rem;
  top: 0.25rem;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 999px;
}
</style>

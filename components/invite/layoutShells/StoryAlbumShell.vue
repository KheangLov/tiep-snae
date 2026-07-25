<script setup lang="ts">
import { computed } from 'vue'
import type { InviteData } from '~/types/invite'
import type { InviteTemplateDefinition } from '~/types/template'
import { formatInviteDate } from '~/utils/formatInviteDate'
import InviteAddToCalendar from '../primitives/InviteAddToCalendar.vue'
import InviteCountdown from '../primitives/InviteCountdown.vue'
import InviteFallingParticles from '../primitives/InviteFallingParticles.vue'
import InviteGiftQr from '../primitives/InviteGiftQr.vue'
import InviteHostNames from '../primitives/InviteHostNames.vue'
import InviteMotifDivider from '../primitives/InviteMotifDivider.vue'
import InviteMusicToggle from '../primitives/InviteMusicToggle.vue'
import InviteVenueMap from '../primitives/InviteVenueMap.vue'

const props = defineProps<{ invite: InviteData; template: InviteTemplateDefinition; guestName?: string }>()

const isKm = computed(() => props.invite.language === 'km')
const formattedDate = computed(() => {
  if (props.invite.event.displayDateOverride) return props.invite.event.displayDateOverride
  if (!props.invite.event.date) return ''
  return formatInviteDate(props.invite.event.date, isKm.value ? 'km-KH' : 'en-US')
})

const initials = computed(() => {
  const first = props.invite.couple.partnerAName.trim().charAt(0)
  const second = props.invite.couple.partnerBName.trim().charAt(0)
  const generated = [first, second].filter(Boolean).join(' + ')
  return props.invite.couple.monogram || generated || 'A + B'
})

const pageStyle = computed(() => {
  const background = props.invite.backgroundImage
  if (!background?.url) return undefined
  const opacity = Math.min(1, Math.max(0, background.overlayOpacity ?? 0.7))
  return {
    backgroundImage: `linear-gradient(rgb(255 250 240 / ${opacity}), rgb(255 250 240 / ${opacity})), url("${background.url}")`,
  }
})
</script>

<template>
  <div class="album-page" :style="pageStyle">
    <InviteFallingParticles
      v-if="invite.themeTokens.effectId === 'falling-leaves'"
      variant="leaves"
    />
    <InviteFallingParticles
      v-else-if="invite.themeTokens.effectId === 'falling-hearts'"
      variant="hearts"
    />

    <main class="album-book">
      <header class="album-cover">
        <div class="album-stamp" aria-hidden="true">
          <span>{{ initials }}</span>
          <i>{{ invite.event.date.slice(0, 4) || 'LOVE' }}</i>
        </div>

        <div class="album-photo-card">
          <span class="album-tape" aria-hidden="true" />
          <img v-if="invite.heroPhoto" :src="invite.heroPhoto" alt="" class="album-photo">
          <div v-else class="album-photo album-photo--placeholder" aria-hidden="true">
            <span>{{ initials }}</span>
            <i>our favorite photograph goes here</i>
          </div>
          <p>{{ isKm ? 'រូបថតទីមួយនៃជំពូកថ្មី' : 'The first frame of our next chapter' }}</p>
        </div>

        <div class="album-title">
          <p v-if="guestName" class="album-guest">
            {{ isKm ? `សម្រាប់ ${guestName}` : `Made especially for ${guestName}` }}
          </p>
          <p class="album-kicker">{{ isKm ? 'សំបុត្រពីបេះដូងពីរ' : 'A note from two hearts' }}</p>
          <h1>
            {{ invite.couple.partnerAName || 'Partner A' }}
            <span>&amp;</span>
            {{ invite.couple.partnerBName || 'Partner B' }}
          </h1>
          <div class="album-date-strip">
            <strong>{{ formattedDate }}</strong>
            <span v-if="invite.event.timeStart">{{ invite.event.timeStart }}</span>
          </div>
        </div>
      </header>

      <InviteMotifDivider :motif-id="invite.themeTokens.motifId" />

      <section class="album-paper album-paper--date">
        <span class="album-paperclip" aria-hidden="true" />
        <p class="album-label">{{ isKm ? 'រក្សាទុកកាលបរិច្ឆេទ' : 'Save our date' }}</p>
        <div class="album-actions">
          <InviteMusicToggle
            v-if="invite.music.enabled && invite.music.trackUrl"
            :music="invite.music"
            :language="invite.language"
          />
          <InviteCountdown :invite="invite" />
          <InviteAddToCalendar :invite="invite" />
        </div>
      </section>

      <blockquote v-if="invite.quote.text" class="album-note">
        <span class="album-note__pin" aria-hidden="true" />
        <p>{{ invite.quote.text }}</p>
        <cite v-if="invite.quote.attribution">— {{ invite.quote.attribution }}</cite>
      </blockquote>

      <section v-if="invite.gallery.length" class="album-gallery">
        <div class="album-section-heading">
          <span>01</span>
          <div>
            <p class="album-label">{{ isKm ? 'ពេលវេលាដែលយើងស្រឡាញ់' : 'Little moments, big love' }}</p>
            <h2>{{ isKm ? 'អាល់ប៊ុមរបស់យើង' : 'From our album' }}</h2>
          </div>
        </div>
        <div class="album-gallery__grid">
          <figure v-for="photo in invite.gallery" :key="photo.id">
            <img :src="photo.url" :alt="photo.caption ?? ''" loading="lazy">
            <figcaption v-if="photo.caption">{{ photo.caption }}</figcaption>
          </figure>
        </div>
      </section>

      <section
        v-if="template.sectionConfig?.showHostNames && invite.hosts.length"
        class="album-paper"
      >
        <span class="album-tape album-tape--corner" aria-hidden="true" />
        <InviteHostNames :hosts="invite.hosts" :language="invite.language" />
      </section>

      <section
        v-if="template.sectionConfig?.showCeremonySchedule && invite.ceremonySchedule.length"
        class="album-itinerary"
      >
        <div class="album-section-heading">
          <span>02</span>
          <div>
            <p class="album-label">{{ isKm ? 'កត់ទុកក្នុងប្រតិទិន' : 'Pinned to the calendar' }}</p>
            <h2>{{ isKm ? 'ដំណើរថ្ងៃមង្គលការ' : 'Our day, page by page' }}</h2>
          </div>
        </div>
        <ol>
          <li v-for="(item, index) in invite.ceremonySchedule" :key="item.id">
            <span class="album-ticket-hole album-ticket-hole--left" aria-hidden="true" />
            <span class="album-ticket-hole album-ticket-hole--right" aria-hidden="true" />
            <div class="album-ticket__number">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="album-ticket__content">
              <p>{{ item.dayLabel }} · {{ item.time }}</p>
              <h3>{{ item.title }}</h3>
              <span v-if="item.khmerTitle">{{ item.khmerTitle }}</span>
              <span v-if="item.description">{{ item.description }}</span>
            </div>
          </li>
        </ol>
      </section>

      <section v-if="invite.venue.name" class="album-paper album-paper--venue">
        <span class="album-paperclip album-paperclip--right" aria-hidden="true" />
        <InviteVenueMap :venue="invite.venue" :language="invite.language" />
      </section>

      <section v-if="invite.giftQr?.enabled && invite.giftQr.imageUrl" class="album-paper">
        <InviteGiftQr :gift-qr="invite.giftQr" :language="invite.language" />
      </section>

      <footer class="album-footer">
        <p>{{ initials }}</p>
        <span>{{ isKm ? 'ដោយក្តីស្រឡាញ់ — រង់ចាំជួបអ្នក' : 'With love — we cannot wait to celebrate with you' }}</span>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.album-page {
  min-height: 100vh;
  padding: clamp(1.25rem, 5vw, 4rem) 1rem;
  color: var(--invite-ink);
  font-family: var(--invite-font-body);
  background-color: var(--invite-accent-soft);
  background-image:
    linear-gradient(90deg, color-mix(in srgb, var(--invite-accent) 5%, transparent) 1px, transparent 1px),
    linear-gradient(color-mix(in srgb, var(--invite-accent) 5%, transparent) 1px, transparent 1px);
  background-position: center;
  background-size: 1.5rem 1.5rem, 1.5rem 1.5rem, cover;
}

.album-book {
  display: flex;
  flex-direction: column;
  gap: clamp(3rem, 8vw, 5.5rem);
  width: min(100%, 50rem);
  margin: 0 auto;
}

.album-cover {
  position: relative;
  display: grid;
  grid-template-columns: minmax(13rem, 0.9fr) minmax(16rem, 1.1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
  min-height: 38rem;
  padding: clamp(2rem, 7vw, 5rem);
  overflow: hidden;
  background:
    radial-gradient(circle at 95% 5%, color-mix(in srgb, var(--invite-accent-secondary) 28%, transparent), transparent 30%),
    color-mix(in srgb, var(--invite-accent-soft) 72%, white);
  border: 1px solid color-mix(in srgb, var(--invite-accent) 16%, transparent);
  border-radius: 0.4rem;
  box-shadow: 0 2rem 5rem color-mix(in srgb, var(--invite-ink) 12%, transparent);
  isolation: isolate;
}
.album-cover::before {
  position: absolute;
  inset: 0.75rem;
  z-index: -1;
  content: '';
  border: 1px dashed color-mix(in srgb, var(--invite-accent) 22%, transparent);
  pointer-events: none;
}

.album-photo-card {
  position: relative;
  z-index: 1;
  padding: 0.75rem 0.75rem 1.35rem;
  background: #fffdf8;
  box-shadow: 0 1.4rem 2.8rem color-mix(in srgb, var(--invite-ink) 20%, transparent);
  transform: rotate(-3deg);
}
.album-photo {
  display: grid;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  place-items: center;
  background:
    radial-gradient(circle at 32% 28%, color-mix(in srgb, var(--invite-accent-secondary) 75%, white), transparent 18%),
    linear-gradient(145deg, var(--invite-accent), var(--invite-accent-secondary));
}
.album-photo--placeholder {
  color: #fff;
  text-align: center;
}
.album-photo--placeholder span {
  font-family: var(--invite-font-heading);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
}
.album-photo--placeholder i {
  position: absolute;
  right: 1.4rem;
  bottom: 4.2rem;
  left: 1.4rem;
  font-size: 0.58rem;
  font-style: normal;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.7;
}
.album-photo-card > p {
  margin: 0.8rem 0 0;
  color: #4a403a;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-align: center;
}

.album-tape {
  position: absolute;
  top: -1rem;
  left: 50%;
  z-index: 2;
  width: 5.5rem;
  height: 1.8rem;
  background: color-mix(in srgb, var(--invite-accent-secondary) 34%, white);
  box-shadow: 0 0.15rem 0.25rem rgb(0 0 0 / 8%);
  opacity: 0.85;
  transform: translateX(-50%) rotate(2deg);
}
.album-tape--corner {
  top: 0.25rem;
  left: 0.25rem;
  transform: translate(-40%, -30%) rotate(-38deg);
}

.album-title { position: relative; z-index: 1; }
.album-kicker,
.album-label,
.album-guest {
  margin: 0 0 0.85rem;
  color: var(--invite-accent);
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.album-guest { color: var(--invite-muted); }
.album-title h1 {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-family: var(--invite-font-heading);
  font-size: clamp(3rem, 8vw, 5.75rem);
  font-weight: 500;
  line-height: 0.9;
  letter-spacing: -0.045em;
}
.album-title h1 span {
  align-self: center;
  margin-block: 0.1em;
  color: var(--invite-accent-secondary);
  font-size: 0.42em;
  font-style: italic;
}
.album-date-strip {
  display: inline-flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-top: 2rem;
  padding: 0.75rem 1.15rem;
  color: #fff;
  background: var(--invite-accent);
  box-shadow: 0.35rem 0.35rem 0 var(--invite-accent-secondary);
  transform: rotate(-1deg);
}
.album-date-strip strong {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.album-date-strip span { font-size: 0.68rem; opacity: 0.8; }

.album-stamp {
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: grid;
  width: 5rem;
  aspect-ratio: 1;
  place-items: center;
  color: var(--invite-accent);
  border: 0.18rem double currentColor;
  border-radius: 50%;
  opacity: 0.48;
  transform: rotate(10deg);
}
.album-stamp::after {
  position: absolute;
  inset: 0.35rem;
  content: '';
  border: 1px dashed currentColor;
  border-radius: inherit;
}
.album-stamp span {
  font-family: var(--invite-font-heading);
  font-size: 0.9rem;
}
.album-stamp i {
  margin-top: -1.4rem;
  font-size: 0.48rem;
  font-style: normal;
  letter-spacing: 0.14em;
}

.album-paper {
  position: relative;
  padding: clamp(1.75rem, 6vw, 3.5rem);
  background: color-mix(in srgb, var(--invite-accent-soft) 45%, white);
  border: 1px solid color-mix(in srgb, var(--invite-accent) 12%, transparent);
  box-shadow: 0 1.25rem 3rem color-mix(in srgb, var(--invite-ink) 10%, transparent);
}
.album-paper--date {
  width: min(100%, 41rem);
  margin: 0 auto;
  text-align: center;
  transform: rotate(0.7deg);
}
.album-actions {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  align-items: center;
}

.album-paperclip {
  position: absolute;
  top: -1.15rem;
  left: 2.5rem;
  width: 1.15rem;
  height: 3.2rem;
  border: 0.16rem solid color-mix(in srgb, var(--invite-accent) 65%, #999);
  border-bottom-color: transparent;
  border-radius: 0.7rem 0.7rem 0 0;
  transform: rotate(-8deg);
}
.album-paperclip--right {
  right: 2.5rem;
  left: auto;
  transform: rotate(8deg);
}

.album-note {
  position: relative;
  width: min(90%, 34rem);
  margin: 0 auto;
  padding: clamp(2rem, 6vw, 3.5rem);
  background: color-mix(in srgb, var(--invite-accent-secondary) 28%, #fff8c7);
  box-shadow: 0 1.5rem 3rem color-mix(in srgb, var(--invite-ink) 14%, transparent);
  transform: rotate(-2deg);
}
.album-note__pin {
  position: absolute;
  top: 0.85rem;
  left: 50%;
  width: 0.85rem;
  aspect-ratio: 1;
  background: var(--invite-accent);
  border: 0.15rem solid rgb(255 255 255 / 65%);
  border-radius: 50%;
  box-shadow: 0 0.25rem 0.4rem rgb(0 0 0 / 18%);
}
.album-note p {
  margin: 0;
  font-family: var(--invite-font-heading);
  font-size: clamp(1.5rem, 5vw, 2.35rem);
  line-height: 1.35;
  text-align: center;
}
.album-note cite {
  display: block;
  margin-top: 1rem;
  font-size: 0.72rem;
  font-style: normal;
  text-align: right;
  opacity: 0.64;
}

.album-section-heading {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
  margin-bottom: 2rem;
}
.album-section-heading > span {
  color: var(--invite-accent-secondary);
  font-family: var(--invite-font-heading);
  font-size: 2.5rem;
  line-height: 1;
  opacity: 0.5;
}
.album-section-heading .album-label { margin-bottom: 0.25rem; }
.album-section-heading h2 {
  margin: 0;
  font-family: var(--invite-font-heading);
  font-size: clamp(1.8rem, 5vw, 2.75rem);
  font-weight: 500;
}

.album-gallery__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 4vw, 2rem);
  align-items: start;
}
.album-gallery figure {
  margin: 0;
  padding: 0.65rem 0.65rem 1rem;
  background: #fffdf8;
  box-shadow: 0 1rem 2rem color-mix(in srgb, var(--invite-ink) 14%, transparent);
}
.album-gallery figure:nth-child(4n + 1) { transform: rotate(-2.2deg); }
.album-gallery figure:nth-child(4n + 2) { margin-top: 2.5rem; transform: rotate(1.8deg); }
.album-gallery figure:nth-child(4n + 3) { transform: rotate(1.2deg); }
.album-gallery figure:nth-child(4n) { margin-top: 2rem; transform: rotate(-1.5deg); }
.album-gallery img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}
.album-gallery figcaption {
  margin-top: 0.65rem;
  color: #4a403a;
  font-size: 0.68rem;
  text-align: center;
}

.album-itinerary ol {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
  margin: 0;
  list-style: none;
}
.album-itinerary li {
  position: relative;
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 1.25rem;
  align-items: center;
  padding: 1.4rem 1.75rem;
  overflow: hidden;
  background: color-mix(in srgb, var(--invite-accent-soft) 36%, white);
  border: 1px dashed color-mix(in srgb, var(--invite-accent) 38%, transparent);
  box-shadow: 0 0.75rem 1.8rem color-mix(in srgb, var(--invite-ink) 7%, transparent);
}
.album-ticket-hole {
  position: absolute;
  top: 50%;
  width: 1.2rem;
  aspect-ratio: 1;
  background: var(--invite-accent-soft);
  border-radius: 50%;
}
.album-ticket-hole--left { left: 0; transform: translate(-55%, -50%); }
.album-ticket-hole--right { right: 0; transform: translate(55%, -50%); }
.album-ticket__number {
  color: var(--invite-accent-secondary);
  font-family: var(--invite-font-heading);
  font-size: 2rem;
  text-align: center;
  border-right: 1px dashed color-mix(in srgb, var(--invite-accent) 28%, transparent);
}
.album-ticket__content p {
  margin: 0 0 0.25rem;
  color: var(--invite-accent);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}
.album-ticket__content h3 {
  margin: 0;
  font-family: var(--invite-font-heading);
  font-size: 1.25rem;
}
.album-ticket__content span {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.82rem;
  opacity: 0.68;
}

.album-footer {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  align-items: center;
  padding: 2rem 1rem;
  text-align: center;
}
.album-footer p {
  margin: 0;
  color: var(--invite-accent);
  font-family: var(--invite-font-heading);
  font-size: 2rem;
}
.album-footer span {
  font-size: 0.67rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.62;
}

@media (max-width: 42rem) {
  .album-cover {
    grid-template-columns: 1fr;
    min-height: auto;
    padding-top: 5.5rem;
  }
  .album-photo-card {
    width: min(82%, 18rem);
    margin: 0 auto;
  }
  .album-title { text-align: center; }
  .album-title h1 span { align-self: center; }
  .album-stamp {
    top: 1.5rem;
    right: 1.5rem;
  }
}

@media (max-width: 30rem) {
  .album-gallery__grid { gap: 0.75rem; }
  .album-gallery figure { padding: 0.4rem 0.4rem 0.75rem; }
  .album-itinerary li {
    grid-template-columns: 3rem 1fr;
    padding-inline: 1.15rem;
  }
  .album-ticket__number { font-size: 1.4rem; }
}
</style>

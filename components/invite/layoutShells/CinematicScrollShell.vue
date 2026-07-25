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
import InvitePhotoGallery from '../primitives/InvitePhotoGallery.vue'
import InviteVenueMap from '../primitives/InviteVenueMap.vue'

const props = defineProps<{ invite: InviteData; template: InviteTemplateDefinition; guestName?: string }>()

const isKm = computed(() => props.invite.language === 'km')
const formattedDate = computed(() => {
  if (props.invite.event.displayDateOverride) return props.invite.event.displayDateOverride
  if (!props.invite.event.date) return ''
  return formatInviteDate(props.invite.event.date, isKm.value ? 'km-KH' : 'en-US')
})

const monogram = computed(() => {
  if (props.invite.couple.monogram) return props.invite.couple.monogram
  const first = props.invite.couple.partnerAName.trim().charAt(0)
  const second = props.invite.couple.partnerBName.trim().charAt(0)
  return `${first}${second}` || 'T♥S'
})

const heroStyle = computed(() => {
  if (props.invite.heroPhoto) {
    return {
      backgroundImage: `linear-gradient(180deg, rgb(5 6 12 / 22%), rgb(5 6 12 / 88%)), url("${props.invite.heroPhoto}")`,
    }
  }
  return {
    backgroundImage:
      'radial-gradient(circle at 20% 18%, color-mix(in srgb, var(--invite-accent) 46%, transparent), transparent 34%), radial-gradient(circle at 82% 72%, color-mix(in srgb, var(--invite-accent-secondary) 24%, transparent), transparent 34%), linear-gradient(155deg, var(--invite-accent-soft), color-mix(in srgb, var(--invite-accent-soft) 72%, black))',
  }
})

const pageStyle = computed(() => {
  const background = props.invite.backgroundImage
  if (!background?.url) return undefined
  const opacity = Math.min(1, Math.max(0, background.overlayOpacity ?? 0.7))
  return {
    backgroundImage: `linear-gradient(rgb(7 8 14 / ${opacity}), rgb(7 8 14 / ${opacity})), url("${background.url}")`,
  }
})
</script>

<template>
  <div class="cinematic-page" :style="pageStyle">
    <InviteFallingParticles
      v-if="invite.themeTokens.effectId === 'falling-leaves'"
      variant="leaves"
    />
    <InviteFallingParticles
      v-else-if="invite.themeTokens.effectId === 'falling-hearts'"
      variant="hearts"
    />

    <header class="cinematic-hero" :style="heroStyle">
      <div class="cinematic-grain" aria-hidden="true" />
      <div class="cinematic-frame" aria-hidden="true" />
      <div class="cinematic-orbit" aria-hidden="true">
        <span>{{ monogram }}</span>
      </div>

      <div class="cinematic-hero__content">
        <p v-if="guestName" class="cinematic-guest">
          {{ isKm ? `ជូនចំពោះ ${guestName}` : `Especially for ${guestName}` }}
        </p>
        <p class="cinematic-kicker">
          {{ isKm ? 'រឿងស្នេហារបស់យើងបន្តទៅមុខ' : 'A new chapter begins' }}
        </p>
        <h1>
          <span>{{ invite.couple.partnerAName || 'Partner A' }}</span>
          <i>&amp;</i>
          <span>{{ invite.couple.partnerBName || 'Partner B' }}</span>
        </h1>
        <div class="cinematic-date">
          <span>{{ formattedDate }}</span>
          <span v-if="invite.event.timeStart" aria-hidden="true">·</span>
          <span v-if="invite.event.timeStart">{{ invite.event.timeStart }}</span>
        </div>
      </div>

      <div class="cinematic-scroll-cue" aria-hidden="true">
        <span>{{ isKm ? 'អូសដើម្បីស្វែងយល់' : 'Scroll into our story' }}</span>
        <i />
      </div>
    </header>

    <main class="cinematic-story">
      <InviteMotifDivider :motif-id="invite.themeTokens.motifId" />

      <section class="cinematic-panel cinematic-panel--pulse">
        <p class="cinematic-eyebrow">{{ isKm ? 'កាលបរិច្ឆេទពិសេស' : 'The moment is coming' }}</p>
        <InviteMusicToggle
          v-if="invite.music.enabled && invite.music.trackUrl"
          :music="invite.music"
          :language="invite.language"
        />
        <InviteCountdown :invite="invite" />
        <InviteAddToCalendar :invite="invite" />
      </section>

      <blockquote v-if="invite.quote.text" class="cinematic-quote">
        <span aria-hidden="true">“</span>
        <p>{{ invite.quote.text }}</p>
        <cite v-if="invite.quote.attribution">{{ invite.quote.attribution }}</cite>
      </blockquote>

      <section v-if="invite.gallery.length" class="cinematic-panel cinematic-panel--gallery">
        <InvitePhotoGallery :photos="invite.gallery" :language="invite.language" />
      </section>

      <section
        v-if="template.sectionConfig?.showHostNames && invite.hosts.length"
        class="cinematic-panel"
      >
        <p class="cinematic-chapter">01</p>
        <InviteHostNames :hosts="invite.hosts" :language="invite.language" />
      </section>

      <section
        v-if="template.sectionConfig?.showCeremonySchedule && invite.ceremonySchedule.length"
        class="cinematic-schedule"
      >
        <div class="cinematic-schedule__heading">
          <p class="cinematic-chapter">02</p>
          <div>
            <p class="cinematic-eyebrow">{{ isKm ? 'ដំណើរនៃថ្ងៃមង្គល' : 'Our celebration in scenes' }}</p>
            <h2>{{ isKm ? 'កម្មវិធីមង្គលការ' : 'The wedding story' }}</h2>
          </div>
        </div>
        <ol>
          <li v-for="(item, index) in invite.ceremonySchedule" :key="item.id">
            <span class="cinematic-scene">{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
              <p class="cinematic-time">{{ item.dayLabel }} · {{ item.time }}</p>
              <h3>{{ item.title }}</h3>
              <p v-if="item.khmerTitle" class="cinematic-subtitle">{{ item.khmerTitle }}</p>
              <p v-if="item.description" class="cinematic-description">{{ item.description }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section v-if="invite.venue.name" class="cinematic-panel">
        <p class="cinematic-chapter">03</p>
        <InviteVenueMap :venue="invite.venue" :language="invite.language" />
      </section>

      <section v-if="invite.giftQr?.enabled && invite.giftQr.imageUrl" class="cinematic-panel">
        <InviteGiftQr :gift-qr="invite.giftQr" :language="invite.language" />
      </section>

      <footer class="cinematic-finale">
        <p>{{ monogram }}</p>
        <span>{{ isKm ? 'រង់ចាំជួបអ្នកនៅថ្ងៃពិសេសរបស់យើង' : 'See you in our next chapter' }}</span>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.cinematic-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: var(--invite-ink);
  font-family: var(--invite-font-body);
  background-color: var(--invite-accent-soft);
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
}

.cinematic-hero {
  position: relative;
  display: grid;
  min-height: min(54rem, 100vh);
  padding: clamp(2rem, 6vw, 4.5rem);
  overflow: hidden;
  color: #fff;
  background-position: center;
  background-size: cover;
  isolation: isolate;
}

.cinematic-grain {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.16;
  background-image:
    repeating-linear-gradient(0deg, transparent 0 3px, rgb(255 255 255 / 8%) 4px),
    repeating-linear-gradient(90deg, transparent 0 5px, rgb(0 0 0 / 8%) 6px);
  mix-blend-mode: soft-light;
}

.cinematic-frame {
  position: absolute;
  inset: clamp(1rem, 3vw, 2rem);
  border: 1px solid rgb(255 255 255 / 28%);
  pointer-events: none;
}

.cinematic-orbit {
  position: absolute;
  top: clamp(3rem, 8vw, 6rem);
  right: clamp(2.5rem, 8vw, 6rem);
  display: grid;
  width: clamp(5rem, 14vw, 8rem);
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 45%);
  border-radius: 50%;
}

.cinematic-orbit::before,
.cinematic-orbit::after {
  position: absolute;
  content: '';
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: inherit;
}
.cinematic-orbit::before { inset: -0.65rem; }
.cinematic-orbit::after { inset: 0.55rem; }
.cinematic-orbit span {
  font-family: var(--invite-font-heading);
  font-size: clamp(1rem, 4vw, 1.5rem);
  color: var(--invite-accent-secondary);
}

.cinematic-hero__content {
  align-self: end;
  max-width: 44rem;
  padding-block: clamp(6rem, 18vh, 12rem) 5rem;
}

.cinematic-kicker,
.cinematic-guest,
.cinematic-eyebrow {
  margin: 0 0 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}
.cinematic-guest { color: rgb(255 255 255 / 76%); }
.cinematic-kicker,
.cinematic-eyebrow { color: var(--invite-accent-secondary); }

.cinematic-hero h1 {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-family: var(--invite-font-heading);
  font-size: clamp(3.35rem, 12vw, 7.75rem);
  font-weight: 500;
  line-height: 0.83;
  letter-spacing: -0.055em;
  text-shadow: 0 1.5rem 3rem rgb(0 0 0 / 28%);
}
.cinematic-hero h1 i {
  margin: 0.18em 0 0.08em 28%;
  color: var(--invite-accent-secondary);
  font-size: 0.4em;
  font-style: italic;
}

.cinematic-date {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
  margin-top: 2.5rem;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.cinematic-scroll-cue {
  position: absolute;
  right: clamp(2.25rem, 5vw, 4rem);
  bottom: clamp(2rem, 5vw, 3rem);
  display: flex;
  gap: 0.75rem;
  align-items: center;
  font-size: 0.58rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
}
.cinematic-scroll-cue i {
  width: 1px;
  height: 3rem;
  background: linear-gradient(180deg, #fff, transparent);
}

.cinematic-story {
  display: flex;
  flex-direction: column;
  gap: clamp(3rem, 8vw, 6rem);
  width: min(100% - 2rem, 48rem);
  margin: 0 auto;
  padding: clamp(4rem, 10vw, 7rem) 0;
}

.cinematic-panel {
  position: relative;
  padding: clamp(1.5rem, 5vw, 3rem);
  background: color-mix(in srgb, var(--invite-accent-soft) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--invite-accent-secondary) 22%, transparent);
  backdrop-filter: blur(1rem);
  -webkit-backdrop-filter: blur(1rem);
}
.cinematic-panel::after {
  position: absolute;
  right: 0.6rem;
  bottom: 0.6rem;
  width: 2.5rem;
  height: 2.5rem;
  content: '';
  border-right: 1px solid var(--invite-accent-secondary);
  border-bottom: 1px solid var(--invite-accent-secondary);
  opacity: 0.5;
}
.cinematic-panel--pulse {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  text-align: center;
}
.cinematic-panel--gallery {
  padding-inline: clamp(1rem, 4vw, 2rem);
}

.cinematic-quote {
  position: relative;
  margin: 0;
  padding: 0 clamp(1rem, 7vw, 4rem);
  text-align: center;
}
.cinematic-quote > span {
  display: block;
  height: 4rem;
  color: var(--invite-accent-secondary);
  font-family: var(--invite-font-heading);
  font-size: 7rem;
  line-height: 0.8;
  opacity: 0.38;
}
.cinematic-quote p {
  margin: 0;
  font-family: var(--invite-font-heading);
  font-size: clamp(1.7rem, 5vw, 2.8rem);
  line-height: 1.28;
}
.cinematic-quote cite {
  display: block;
  margin-top: 1.25rem;
  font-size: 0.75rem;
  font-style: normal;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.62;
}

.cinematic-chapter {
  margin: 0 0 1.75rem;
  color: var(--invite-accent-secondary);
  font-family: var(--invite-font-heading);
  font-size: 3rem;
  line-height: 1;
  opacity: 0.28;
}

.cinematic-schedule {
  padding: clamp(1rem, 4vw, 2rem) 0;
}
.cinematic-schedule__heading {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  align-items: start;
  margin-bottom: 2.5rem;
}
.cinematic-schedule__heading .cinematic-chapter { margin: 0; }
.cinematic-schedule h2 {
  margin: 0;
  font-family: var(--invite-font-heading);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 500;
}
.cinematic-schedule ol {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  margin: 0;
  list-style: none;
  border-top: 1px solid color-mix(in srgb, var(--invite-accent-secondary) 24%, transparent);
}
.cinematic-schedule li {
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 1.25rem;
  padding: 1.6rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--invite-accent-secondary) 24%, transparent);
}
.cinematic-scene {
  color: var(--invite-accent-secondary);
  font-family: var(--invite-font-heading);
  font-size: 1.5rem;
  opacity: 0.55;
}
.cinematic-time {
  margin: 0 0 0.4rem;
  color: var(--invite-accent-secondary);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.cinematic-schedule h3 {
  margin: 0;
  font-family: var(--invite-font-heading);
  font-size: 1.35rem;
}
.cinematic-subtitle,
.cinematic-description {
  margin: 0.35rem 0 0;
  opacity: 0.72;
}
.cinematic-description { font-size: 0.9rem; }

.cinematic-finale {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  padding: 3rem 1rem 1rem;
  text-align: center;
  border-top: 1px solid color-mix(in srgb, var(--invite-accent-secondary) 24%, transparent);
}
.cinematic-finale p {
  margin: 0;
  color: var(--invite-accent-secondary);
  font-family: var(--invite-font-heading);
  font-size: 2.2rem;
}
.cinematic-finale span {
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.62;
}

@media (max-width: 36rem) {
  .cinematic-hero {
    min-height: 46rem;
    padding: 1.5rem;
  }
  .cinematic-frame { inset: 0.75rem; }
  .cinematic-orbit {
    top: 2.5rem;
    right: 2.5rem;
  }
  .cinematic-hero__content { padding-bottom: 4.5rem; }
  .cinematic-scroll-cue { right: 1.75rem; }
}

@media (prefers-reduced-motion: no-preference) {
  .cinematic-orbit { animation: cinematic-float 6s ease-in-out infinite; }
  .cinematic-scroll-cue i { animation: cinematic-cue 1.8s ease-in-out infinite; }
}

@keyframes cinematic-float {
  50% { transform: translateY(-0.55rem) rotate(3deg); }
}
@keyframes cinematic-cue {
  50% { transform: scaleY(0.55); transform-origin: bottom; opacity: 0.45; }
}
</style>

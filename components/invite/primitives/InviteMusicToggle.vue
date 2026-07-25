<script setup lang="ts">
import { ref } from 'vue'
import type { InviteLanguage, MusicSettings } from '~/types/invite'

const props = defineProps<{ music: MusicSettings; language: InviteLanguage }>()

const audioEl = ref<HTMLAudioElement | null>(null)
const playing = ref(false)

function toggle() {
  const el = audioEl.value
  if (!el) return
  if (playing.value) {
    el.pause()
  } else {
    // Browsers block audio autoplay without a user gesture -- this toggle
    // IS that gesture, so music.autoplay is (deliberately, permanently)
    // false: there's no code path that plays audio a guest didn't ask for.
    void el.play().catch(() => {})
  }
}
</script>

<template>
  <div class="flex justify-center">
    <audio ref="audioEl" :src="music.trackUrl" loop @play="playing = true" @pause="playing = false" />
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-transform hover:-translate-y-px"
      :style="{ background: 'color-mix(in srgb, var(--invite-accent-soft) 70%, transparent)', color: 'var(--invite-accent)' }"
      @click="toggle"
    >
      <span aria-hidden="true">{{ playing ? '⏸' : '♪' }}</span>
      {{ playing
        ? (language === 'km' ? 'ផ្អាកតន្ត្រី' : 'Pause music')
        : (language === 'km' ? 'ចាក់តន្ត្រី' : 'Play music') }}
    </button>
  </div>
</template>

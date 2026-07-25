<script setup lang="ts">
import { computed } from 'vue'
import type { InviteData } from '~/types/invite'
import { generateIcs, buildGoogleCalendarUrl } from '~/utils/generateIcs'

const props = defineProps<{ invite: InviteData }>()

const isKm = computed(() => props.invite.language === 'km')
const googleUrl = computed(() => buildGoogleCalendarUrl(props.invite))

function downloadIcs() {
  const ics = generateIcs(props.invite)
  if (!ics) return
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${props.invite.couple.partnerAName || 'wedding'}-${props.invite.couple.partnerBName || 'invite'}.ics`.replace(/\s+/g, '-')
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <section class="flex flex-col items-center gap-3 text-center">
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-px"
      :style="{ background: 'var(--invite-accent)' }"
      @click="downloadIcs"
    >
      {{ isKm ? 'រក្សាទុកកាលបរិច្ឆេទ (រំលឹកមុន១ថ្ងៃ)' : 'Save the date (reminds you 1 day before)' }}
    </button>
    <a
      v-if="googleUrl"
      :href="googleUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="text-xs underline opacity-70 hover:opacity-100"
    >
      {{ isKm ? 'ឬបន្ថែមទៅ Google Calendar លឿន (គ្មានការរំលឹកផ្ទាល់ខ្លួន)' : 'or quick-add to Google Calendar (no custom reminder)' }}
    </a>
  </section>
</template>

<script setup lang="ts">
import type { InviteLanguage, VenueInfo } from '~/types/invite'

defineProps<{ venue: VenueInfo; language: InviteLanguage }>()
</script>

<template>
  <section class="flex flex-col items-center gap-2 text-center">
    <h2 class="text-xs uppercase tracking-[0.25em]" :style="{ color: 'var(--invite-accent-secondary)' }">
      {{ language === 'km' ? 'ទីតាំង' : 'Venue' }}
    </h2>
    <p class="text-lg font-semibold" :style="{ fontFamily: 'var(--invite-font-heading)' }">{{ venue.name }}</p>
    <p class="text-sm opacity-80">
      {{ venue.addressLine1 }}<template v-if="venue.addressLine2"><br>{{ venue.addressLine2 }}</template>
    </p>
    <a
      v-if="venue.mapUrl"
      :href="venue.mapUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-px"
      :style="{ background: 'var(--invite-accent)' }"
    >
      {{ language === 'km' ? 'បើកផែនទី' : 'Open in Maps' }}
    </a>
  </section>
</template>

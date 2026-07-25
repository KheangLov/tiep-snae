<script setup lang="ts">
import type { GiftQr, InviteLanguage } from '~/types/invite'

defineProps<{ giftQr: GiftQr; language: InviteLanguage }>()
</script>

<template>
  <section class="flex flex-col items-center gap-3 text-center">
    <h2 class="text-xs uppercase tracking-[0.25em]" :style="{ color: 'var(--invite-accent-secondary)' }">
      {{ language === 'km' ? 'ចងដៃអំណោយ' : 'Wedding gift' }}
    </h2>
    <div
      class="rounded-2xl bg-white p-3"
      :style="{ border: '0.0625rem solid color-mix(in srgb, var(--invite-accent) 18%, transparent)' }"
    >
      <img :src="giftQr.imageUrl" alt="KHQR code for wedding gift" class="h-48 w-48 object-contain">
    </div>
    <p v-if="giftQr.note" class="max-w-xs text-sm opacity-80">{{ giftQr.note }}</p>
    <p v-else class="max-w-xs text-sm opacity-70">
      {{ language === 'km' ? 'ស្កេនដើម្បីផ្ញើអំណោយ' : 'Scan with your banking app to send a gift' }}
    </p>
  </section>
</template>

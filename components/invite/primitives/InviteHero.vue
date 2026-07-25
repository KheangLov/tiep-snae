<script setup lang="ts">
import { computed } from 'vue'
import type { InviteData } from '~/types/invite'
import { formatInviteDate } from '~/utils/formatInviteDate'

const props = defineProps<{ invite: InviteData; guestName?: string }>()

const formattedDate = computed(() => {
  if (props.invite.event.displayDateOverride) return props.invite.event.displayDateOverride
  if (!props.invite.event.date) return ''
  return formatInviteDate(props.invite.event.date, props.invite.language === 'km' ? 'km-KH' : 'en-US')
})
</script>

<template>
  <header class="flex flex-col items-center gap-4 text-center">
    <div
      v-if="invite.heroPhoto"
      class="h-36 w-36 overflow-hidden rounded-full shadow-lg md:h-44 md:w-44"
      :style="{ border: '0.1875rem solid var(--invite-accent)' }"
    >
      <img :src="invite.heroPhoto" alt="" class="h-full w-full object-cover">
    </div>
    <p v-if="guestName" class="text-sm opacity-80">
      {{ invite.language === 'km' ? `ជូនចំពោះ ${guestName}` : `Dear ${guestName},` }}
    </p>
    <p class="text-xs uppercase tracking-[0.3em]" :style="{ color: 'var(--invite-accent-secondary)' }">
      {{ invite.language === 'km' ? 'យើងរៀបការហើយ' : "We're getting married" }}
    </p>
    <h1
      class="text-4xl font-semibold leading-tight md:text-5xl"
      :style="{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-accent)' }"
    >
      {{ invite.couple.partnerAName || 'Partner A' }}
      <span class="opacity-60">&amp;</span>
      {{ invite.couple.partnerBName || 'Partner B' }}
    </h1>
    <p v-if="formattedDate" class="text-lg">{{ formattedDate }}</p>
    <p v-if="invite.event.timeStart" class="text-sm opacity-70">{{ invite.event.timeStart }}</p>
  </header>
</template>

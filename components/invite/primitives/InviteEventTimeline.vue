<script setup lang="ts">
import type { CeremonyEvent, InviteLanguage } from '~/types/invite'

defineProps<{ schedule: CeremonyEvent[]; language: InviteLanguage }>()
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-center text-xs uppercase tracking-[0.25em]" :style="{ color: 'var(--invite-accent-secondary)' }">
      {{ language === 'km' ? 'កម្មវិធីពិធីមង្គលការ' : 'Ceremony schedule' }}
    </h2>
    <ol class="flex flex-col gap-3">
      <li
        v-for="item in schedule"
        :key="item.id"
        class="flex gap-4 rounded-2xl p-4"
        :style="{
          background: 'color-mix(in srgb, var(--invite-accent-soft) 55%, transparent)',
          border: '0.0625rem solid color-mix(in srgb, var(--invite-accent) 18%, transparent)',
          contentVisibility: 'auto',
          containIntrinsicSize: '0 5.5rem',
        }"
      >
        <div class="w-16 shrink-0 text-sm font-semibold" :style="{ color: 'var(--invite-accent)' }">
          {{ item.time }}
        </div>
        <div class="min-w-0">
          <p class="text-xs uppercase tracking-wide opacity-60">{{ item.dayLabel }}</p>
          <p class="font-semibold" :style="{ fontFamily: 'var(--invite-font-heading)' }">{{ item.title }}</p>
          <p v-if="item.khmerTitle" class="text-sm opacity-80">{{ item.khmerTitle }}</p>
          <p v-if="item.description" class="mt-1 text-sm opacity-70">{{ item.description }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

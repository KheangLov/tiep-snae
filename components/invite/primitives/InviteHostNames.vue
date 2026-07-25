<script setup lang="ts">
import type { HostEntry, InviteLanguage } from '~/types/invite'

defineProps<{ hosts: HostEntry[]; language: InviteLanguage }>()
</script>

<template>
  <section class="flex flex-col items-center gap-3 text-center">
    <h2 class="text-xs uppercase tracking-[0.25em]" :style="{ color: 'var(--invite-accent-secondary)' }">
      {{ language === 'km' ? 'ក្នុងពិធីអនុញ្ញាតដោយ' : 'With the blessing of' }}
    </h2>
    <div class="flex flex-col gap-1.5">
      <p v-for="host in hosts" :key="host.id" :style="{ fontFamily: 'var(--invite-font-heading)' }">
        <span class="font-medium">{{ host.honorific ? `${host.honorific} ` : '' }}{{ host.name }}</span>
        <span class="ml-2 text-sm opacity-70" style="font-family: var(--invite-font-body)">{{ host.relation }}</span>
      </p>
    </div>
  </section>
</template>

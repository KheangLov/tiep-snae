<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useInviteListStore } from '~/stores/inviteList'
import { useAppI18n } from '~/composables/useAppI18n'
import { countdownParts, resolveEventDateTime } from '~/utils/countdown'

const { t } = useAppI18n()
const inviteListStore = useInviteListStore()

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  inviteListStore.refresh()
  timer = setInterval(() => { now.value = Date.now() }, 60_000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
  } catch {
    return iso
  }
}

function countdownLabel(eventDate?: string, eventTimeStart?: string): string | null {
  if (!eventDate) return null
  const target = resolveEventDateTime(eventDate, eventTimeStart)
  if (!target) return null
  const parts = countdownParts(target, now.value)
  if (!parts) return 'Today!'
  if (parts.days > 0) return `in ${parts.days}d ${parts.hours}h`
  return `in ${parts.hours}h ${parts.minutes}m`
}

function remove(id: string) {
  if (typeof window !== 'undefined' && window.confirm('Delete this invitation? This cannot be undone.')) {
    inviteListStore.deleteInvite(id)
  }
}
</script>

<template>
  <v-container class="py-8" style="max-width: 64rem">
    <div v-if="inviteListStore.entries.length === 0" class="d-flex flex-column align-center text-center py-12">
      <span class="invite-empty-icon-badge mb-5" aria-hidden="true">
        <v-icon icon="solar:hearts-linear" size="44" color="primary" />
      </span>
      <h1 class="text-h4 font-weight-bold mb-2">{{ t('nav.myInvitations') }}</h1>
      <p class="text-body-1 text-medium-emphasis mb-6" style="max-width: 32rem">{{ t('app.tagline') }}</p>
      <v-btn
        to="/templates"
        color="primary"
        variant="flat"
        size="large"
        class="bg-primary attention-cta"
        prepend-icon="solar:magic-stick-3-bold"
      >
        {{ t('nav.createNew') }}
      </v-btn>
    </div>

    <template v-else>
      <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-2">
        <h1 class="text-h4 font-weight-bold">{{ t('nav.myInvitations') }}</h1>
        <v-btn to="/templates" color="primary" variant="flat" prepend-icon="solar:add-circle-bold" class="bg-primary">
          {{ t('nav.createNew') }}
        </v-btn>
      </div>
      <div class="invite-grid">
        <v-card
          v-for="entry in inviteListStore.entries"
          :key="entry.id"
          class="invite-card-interactive pa-4"
          :to="`/editor/${entry.id}`"
        >
          <div class="d-flex align-center justify-space-between ga-2">
            <div class="min-width-0">
              <p class="text-subtitle-1 font-weight-bold mb-1 text-truncate">{{ entry.name }}</p>
              <p class="text-caption text-medium-emphasis mb-0">{{ formatDate(entry.updatedAt) }}</p>
            </div>
            <v-btn
              icon="solar:trash-bin-minimalistic-linear"
              variant="text"
              size="small"
              @click.stop.prevent="remove(entry.id)"
            />
          </div>
          <v-chip
            v-if="countdownLabel(entry.eventDate, entry.eventTimeStart)"
            size="small"
            variant="tonal"
            color="primary"
            prepend-icon="solar:hourglass-line-linear"
            class="mt-3"
          >
            {{ countdownLabel(entry.eventDate, entry.eventTimeStart) }}
          </v-chip>
        </v-card>
      </div>
    </template>
  </v-container>
</template>

<style scoped>
.invite-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1rem;
}
.min-width-0 {
  min-width: 0;
}
</style>

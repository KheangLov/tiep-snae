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
  <section class="dashboard-page">
    <div v-if="inviteListStore.entries.length === 0" class="dashboard-empty">
      <span class="dashboard-empty__icon" aria-hidden="true">
        ♡
      </span>
      <h1>{{ t('nav.myInvitations') }}</h1>
      <p>{{ t('app.tagline') }}</p>
      <NuxtLink
        to="/templates"
        no-prefetch
        class="dashboard-primary-action attention-cta"
      >
        {{ t('nav.createNew') }}
      </NuxtLink>
    </div>

    <template v-else>
      <div class="dashboard-page__heading">
        <h1>{{ t('nav.myInvitations') }}</h1>
        <NuxtLink to="/templates" no-prefetch class="dashboard-primary-action">
          {{ t('nav.createNew') }}
        </NuxtLink>
      </div>
      <div class="invite-grid">
        <NuxtLink
          v-for="entry in inviteListStore.entries"
          :key="entry.id"
          class="dashboard-invite-card invite-card-interactive"
          :to="`/editor/${entry.id}`"
          no-prefetch
        >
          <div class="dashboard-invite-card__top">
            <div class="dashboard-invite-card__copy">
              <strong>{{ entry.name }}</strong>
              <small>{{ formatDate(entry.updatedAt) }}</small>
            </div>
            <button
              type="button"
              :aria-label="`Delete ${entry.name}`"
              @click.stop.prevent="remove(entry.id)"
            >
              ×
            </button>
          </div>
          <span
            v-if="countdownLabel(entry.eventDate, entry.eventTimeStart)"
            class="dashboard-countdown"
          >
            {{ countdownLabel(entry.eventDate, entry.eventTimeStart) }}
          </span>
        </NuxtLink>
      </div>
    </template>
  </section>
</template>

<style scoped>
.dashboard-page {
  width: min(75rem, 100%);
  padding: 2rem clamp(1rem, 0.6rem + 2vw, 2.5rem);
  margin: 0 auto;
}

.dashboard-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: min(35rem, calc(100dvh - 8.5rem));
  padding: clamp(3rem, 10vw, 6rem) 1rem;
  justify-content: center;
  text-align: center;
}

.dashboard-empty__icon {
  display: grid;
  width: 6rem;
  height: 6rem;
  margin-bottom: 1.25rem;
  place-items: center;
  color: #8b2942;
  font-size: 3rem;
  background: linear-gradient(135deg, rgb(139 41 66 / 14%), rgb(201 138 62 / 13%));
  border-radius: 999px;
}

.dashboard-empty h1,
.dashboard-page__heading h1 {
  margin: 0;
  font-size: clamp(1.5rem, 1.15rem + 1.4vw, 2.125rem);
  font-weight: 700;
  line-height: 1.35;
}

.dashboard-empty p {
  max-width: 32rem;
  margin: 0.75rem 0 1.5rem;
  line-height: 1.7;
  opacity: 0.68;
}

.dashboard-primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.65rem 1.25rem;
  color: white;
  font-weight: 700;
  text-decoration: none;
  background: var(--app-gradient);
  border-radius: var(--radius-lg);
  box-shadow: 0 0.75rem 1.5rem rgb(74 16 32 / 18%);
  transition: filter var(--motion-fast) ease, transform var(--motion-fast) ease;
}

.dashboard-primary-action:hover,
.dashboard-primary-action:focus-visible {
  filter: brightness(1.08);
  outline: none;
  transform: translateY(-0.125rem);
}

.dashboard-page__heading {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.invite-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1rem;
}

.dashboard-invite-card {
  display: block;
  padding: 1.25rem;
  color: inherit;
  text-decoration: none;
  background: var(--flat-glass-bg);
  border: 0.0625rem solid var(--flat-glass-border);
  border-radius: var(--radius-xl);
  transition: background var(--motion-fast) ease, border-color var(--motion-fast) ease, transform var(--motion-fast) ease;
}

.dashboard-invite-card:hover,
.dashboard-invite-card:focus-visible {
  background: var(--flat-glass-bg-hover);
  border-color: #8b2942;
  outline: none;
  transform: translateY(-0.1875rem);
}

.dashboard-invite-card__top {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.dashboard-invite-card__copy {
  display: grid;
  gap: 0.25rem;
  min-width: 0;
}

.dashboard-invite-card__copy strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-invite-card__copy small {
  opacity: 0.62;
}

.dashboard-invite-card button {
  display: grid;
  flex: 0 0 auto;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  color: inherit;
  font: inherit;
  font-size: 1.35rem;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 999px;
}

.dashboard-invite-card button:hover,
.dashboard-invite-card button:focus-visible {
  color: #8b2942;
  background: rgb(139 41 66 / 10%);
  outline: none;
}

.dashboard-countdown {
  display: inline-flex;
  padding: 0.35rem 0.65rem;
  margin-top: 0.75rem;
  color: #8b2942;
  font-size: 0.72rem;
  font-weight: 700;
  background: rgb(139 41 66 / 10%);
  border-radius: 999px;
}

@media (max-width: 37.5rem) {
  .dashboard-page {
    padding-top: 1.5rem;
  }

  .dashboard-page__heading {
    align-items: flex-start;
  }

  .dashboard-page__heading .dashboard-primary-action {
    min-height: 2.5rem;
    padding: 0.55rem 0.85rem;
    font-size: 0.78rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-primary-action,
  .dashboard-invite-card {
    transition: none;
  }

  .dashboard-primary-action:hover,
  .dashboard-invite-card:hover {
    transform: none;
  }
}
</style>

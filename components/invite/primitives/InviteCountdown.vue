<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { InviteData } from '~/types/invite'
import { countdownParts, resolveEventDateTime } from '~/utils/countdown'

const props = defineProps<{ invite: InviteData }>()

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  // Once a minute is plenty fresh for a "days to go" countdown and avoids
  // the per-second re-render a naive implementation would pay for on every
  // invitation view, guest-facing or not.
  timer = setInterval(() => { now.value = Date.now() }, 60_000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const target = computed(() => resolveEventDateTime(props.invite.event.date, props.invite.event.timeStart))
const remaining = computed(() => (target.value ? countdownParts(target.value, now.value) : null))

const isKm = computed(() => props.invite.language === 'km')
const units = computed(() => {
  if (!remaining.value) return []
  return isKm.value
    ? [
        { value: remaining.value.days, label: 'ថ្ងៃ' },
        { value: remaining.value.hours, label: 'ម៉ោង' },
        { value: remaining.value.minutes, label: 'នាទី' },
      ]
    : [
        { value: remaining.value.days, label: 'days' },
        { value: remaining.value.hours, label: 'hrs' },
        { value: remaining.value.minutes, label: 'min' },
      ]
})
</script>

<template>
  <section v-if="units.length" class="flex flex-col items-center gap-3">
    <p class="text-xs uppercase tracking-[0.25em]" :style="{ color: 'var(--invite-accent-secondary)' }">
      {{ isKm ? 'រាប់ថយក្រោយថ្ងៃមង្គលការ' : 'Counting down to the big day' }}
    </p>
    <div class="flex items-start gap-4">
      <div v-for="unit in units" :key="unit.label" class="flex flex-col items-center gap-0.5">
        <span
          class="text-3xl font-semibold tabular-nums md:text-4xl"
          :style="{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-accent)' }"
        >
          {{ unit.value }}
        </span>
        <span class="text-xs uppercase tracking-wide opacity-60">{{ unit.label }}</span>
      </div>
    </div>
  </section>
</template>

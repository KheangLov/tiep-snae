<script setup lang="ts">
import type { QuoteInfo } from '~/types/invite'

defineProps<{ quote: QuoteInfo }>()
</script>

<template>
  <blockquote
    class="text-center text-lg italic"
    :style="{ fontFamily: 'var(--invite-font-heading)', color: 'var(--invite-accent)' }"
  >
    “{{ quote.text }}”
    <footer v-if="quote.attribution" class="mt-2 text-sm not-italic opacity-70">— {{ quote.attribution }}</footer>
  </blockquote>
</template>

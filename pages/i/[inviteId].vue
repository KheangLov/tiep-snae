<script setup lang="ts">
definePageMeta({ layout: 'invite' })

import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { loadInviteFromStorage } from '~/utils/inviteStorage'
import { decodeShareData } from '~/utils/shareCodec'
import TemplateRenderer from '~/components/invite/TemplateRenderer.vue'
import type { InviteData } from '~/types/invite'

const route = useRoute()
const invite = ref<InviteData | null>(null)
const checked = ref(false)

// The one piece of a shared link that's genuinely per-recipient -- see
// composables/useShareLink.ts for why it's a plain query param instead of
// part of the compressed ?d= payload.
const guestName = computed(() => {
  const value = route.query.to
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
})

function printInvitation() {
  window.print()
}

onMounted(async () => {
  // A guest opening a shared link on a device that's never touched this
  // browser's storage resolves from the `?d=` payload; the author
  // previewing/re-sharing their own draft resolves from localStorage.
  // Priority order matters: a `?d=` link should render even if a stale
  // localStorage record with the same id happens to exist on this device.
  const sharedData = route.query.d
  if (typeof sharedData === 'string' && sharedData) {
    invite.value = await decodeShareData(sharedData)
  }
  if (!invite.value) {
    invite.value = loadInviteFromStorage(String(route.params.inviteId))
  }
  checked.value = true
})
</script>

<template>
  <div>
    <TemplateRenderer v-if="invite" :invite="invite" :guest-name="guestName" />
    <div v-else-if="checked" class="flex min-h-screen flex-col items-center justify-center gap-2 p-8 text-center">
      <p class="text-lg font-medium">Invitation not found.</p>
      <p class="text-sm opacity-70">This link may be broken, or the invitation only exists on its author's device.</p>
    </div>

    <button
      v-if="invite"
      type="button"
      class="no-print save-keepsake-btn"
      aria-label="Save or print this invitation"
      :style="{ background: invite.themeTokens.accentColor }"
      @click="printInvitation"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.save-keepsake-btn {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  color: white;
  border: none;
  border-radius: 999px;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.25);
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.save-keepsake-btn:hover {
  opacity: 1;
  transform: translateY(-0.0625rem);
}
</style>

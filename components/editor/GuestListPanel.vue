<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { buildShareUrl } from '~/composables/useShareLink'
import { useInviteStore } from '~/stores/invite'
import type { InviteData } from '~/types/invite'

const props = defineProps<{ invite: InviteData }>()
const inviteStore = useInviteStore()

const newName = ref('')
const copiedId = ref<string | null>(null)
const copyError = ref(false)

function addGuest() {
  const name = newName.value.trim()
  if (!name) return
  inviteStore.addEntry('guests', { id: uuidv4(), name })
  newName.value = ''
}
function removeGuest(id: string) {
  inviteStore.removeEntry('guests', id)
}
async function copyGuestLink(id: string, name: string) {
  const link = await buildShareUrl(props.invite, { guestName: name })
  try {
    await navigator.clipboard.writeText(link)
    copiedId.value = id
    copyError.value = false
    setTimeout(() => { if (copiedId.value === id) copiedId.value = null }, 2000)
  } catch {
    copyError.value = true
  }
}
</script>

<template>
  <div>
    <p class="text-body-2 text-medium-emphasis mb-3">
      Add a name to generate that guest's own link — it greets them by name when they open it. Every guest's
      link shares the same invitation; nothing about who opened which link is tracked or collected.
    </p>
    <div class="d-flex ga-2 mb-3">
      <v-text-field
        v-model="newName"
        label="Guest or family name"
        density="compact"
        hide-details
        @keydown.enter="addGuest"
      />
      <v-btn variant="tonal" prepend-icon="solar:add-circle-linear" @click="addGuest">Add</v-btn>
    </div>

    <div v-for="guest in invite.guests" :key="guest.id" class="d-flex align-center ga-2 mb-2 editor-form-row">
      <span class="text-body-2 flex-grow-1 text-truncate">{{ guest.name }}</span>
      <v-btn
        size="small"
        variant="tonal"
        prepend-icon="solar:link-circle-linear"
        @click="copyGuestLink(guest.id, guest.name)"
      >
        {{ copiedId === guest.id ? 'Copied!' : 'Copy link' }}
      </v-btn>
      <v-btn icon="solar:trash-bin-minimalistic-linear" variant="text" size="small" @click="removeGuest(guest.id)" />
    </div>
    <p v-if="copyError" class="text-caption text-error mb-0">
      Could not copy automatically — your browser may need clipboard permission.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { buildShareUrl } from '~/composables/useShareLink'
import type { InviteData } from '~/types/invite'

const props = defineProps<{ modelValue: boolean; invite: InviteData }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const guestName = ref('')
const link = ref('')
const generating = ref(false)
const copied = ref(false)

async function regenerate() {
  generating.value = true
  try {
    link.value = await buildShareUrl(props.invite, { guestName: guestName.value })
  } finally {
    generating.value = false
  }
}

watch([() => props.modelValue, guestName], ([open]) => {
  if (open) regenerate()
})

const charCount = computed(() => link.value.length)
const budget = computed(() => {
  if (charCount.value < 1500) return { text: 'Comfortably within link limits', color: 'success' }
  if (charCount.value < 2500) return { text: 'Getting long — some apps may truncate this', color: 'warning' }
  return { text: 'Very long — try trimming optional invitation content', color: 'error' }
})

const canWebShare = computed(() => typeof navigator !== 'undefined' && 'share' in navigator)

async function webShare() {
  try {
    await navigator.share({ title: props.invite.name, text: "You're invited! 💌", url: link.value })
  } catch {
    // User cancelled the native share sheet -- nothing to do.
  }
}

function shareTelegram() {
  window.open(`https://t.me/share/url?url=${encodeURIComponent(link.value)}&text=${encodeURIComponent("You're invited!")}`, '_blank', 'noopener')
}

function shareMessenger() {
  // Facebook's documented no-app-id deep link for sharing a URL into
  // Messenger. Opens the Messenger app when installed (mobile); on desktop
  // without the app there's no reliable equivalent, so Copy Link / Telegram
  // cover that case instead of shipping a broken "web" fallback here.
  window.open(`fb-messenger://share/?link=${encodeURIComponent(link.value)}`, '_blank', 'noopener')
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(link.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Clipboard permission denied -- the link is still visible to select manually.
  }
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="30rem" scrollable @update:model-value="(v) => emit('update:modelValue', v)">
    <v-card class="glass-surface">
      <v-card-title class="d-flex align-center ga-2 px-5 pt-5">
        <v-icon icon="solar:link-circle-bold" color="primary" />
        <span>Share your invitation</span>
      </v-card-title>
      <v-card-text class="px-5">
        <p class="text-body-2 text-medium-emphasis mb-3">
          Invitation details live in this link. Photos and audio load from the public storage links you added;
          Tiep Snae never uploads or stores those files. Anyone with this invitation link can view it.
        </p>

        <v-text-field
          v-model="guestName"
          label="Personalize for a guest (optional)"
          placeholder="e.g. Sokha's family"
          density="compact"
          class="mb-2"
        />

        <v-textarea
          :model-value="link"
          label="Shareable link"
          readonly
          rows="2"
          auto-grow
          density="comfortable"
          class="mb-1"
        />
        <p class="text-caption mb-4" :class="`text-${budget.color}`">
          {{ generating ? 'Generating…' : `${budget.text} (${charCount} characters)` }}
        </p>

        <v-btn
          v-if="canWebShare"
          block
          color="primary"
          variant="flat"
          class="bg-primary mb-3"
          prepend-icon="solar:share-linear"
          :disabled="generating"
          @click="webShare"
        >
          Share…
        </v-btn>

        <div class="d-flex flex-wrap ga-2">
          <v-btn variant="tonal" size="small" prepend-icon="solar:paperclip-linear" :disabled="generating" @click="copyLink">
            {{ copied ? 'Copied!' : 'Copy link' }}
          </v-btn>
          <v-btn variant="tonal" size="small" prepend-icon="solar:plain-2-linear" :disabled="generating" @click="shareTelegram">
            Telegram
          </v-btn>
          <v-btn variant="tonal" size="small" prepend-icon="solar:chat-round-dots-linear" :disabled="generating" @click="shareMessenger">
            Messenger
          </v-btn>
        </div>
      </v-card-text>
      <v-card-actions class="px-5 pb-5">
        <v-spacer />
        <v-btn variant="text" @click="emit('update:modelValue', false)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

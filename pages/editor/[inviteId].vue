<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { useInviteStore } from '~/stores/invite'
import TemplateRenderer from '~/components/invite/TemplateRenderer.vue'
import AiInviteAgentChat from '~/components/ai/AiInviteAgentChat.vue'
import AiWordingDialog from '~/components/ai/AiWordingDialog.vue'
import AiPairingDialog from '~/components/ai/AiPairingDialog.vue'
import ShareLinkDialog from '~/components/share/ShareLinkDialog.vue'
import QrCodeUrlInput from '~/components/editor/QrCodeUrlInput.vue'
import PhotoUrlInput from '~/components/customizer/PhotoUrlInput.vue'
import PhotoGalleryUrlInput from '~/components/editor/PhotoGalleryUrlInput.vue'
import MusicUrlInput from '~/components/editor/MusicUrlInput.vue'
import GuestListPanel from '~/components/editor/GuestListPanel.vue'
import type { PhotoItem } from '~/types/invite'

const route = useRoute()
const inviteStore = useInviteStore()

onMounted(() => {
  inviteStore.load(String(route.params.inviteId))
})

const wordingDialogOpen = ref(false)
const pairingDialogOpen = ref(false)
const shareDialogOpen = ref(false)

function applyQuoteWording(text: string) {
  inviteStore.updateQuote({ text })
}
function applyPairing(pairing: { accentColor: string; accentColorSecondary: string; fontPairId: string }) {
  inviteStore.updateTheme(pairing as never)
}

const languageItems = [
  { title: 'English', value: 'en' },
  { title: 'ខ្មែរ', value: 'km' },
  { title: 'Bilingual', value: 'bilingual' },
]

function addHost() {
  inviteStore.addEntry('hosts', { id: uuidv4(), relation: '', name: '' })
}
function removeHost(id: string) {
  inviteStore.removeEntry('hosts', id)
}
function addCeremonyEvent() {
  inviteStore.addEntry('ceremonySchedule', { id: uuidv4(), dayLabel: '', title: '', time: '' })
}
function removeCeremonyEvent(id: string) {
  inviteStore.removeEntry('ceremonySchedule', id)
}
function addGalleryPhoto(photo: PhotoItem) {
  inviteStore.addGalleryPhoto(photo)
}
function removeGalleryPhoto(id: string) {
  inviteStore.removeGalleryPhoto(id)
}

const statusLabel = {
  idle: 'Not saved yet',
  saving: 'Saving…',
  saved: 'Saved on this device',
  error: 'Could not save',
} as const
</script>

<template>
  <div v-if="inviteStore.invite">
    <v-container fluid class="py-6">
      <v-row>
        <v-col cols="12" md="5" lg="4">
          <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-2">
            <h1 class="text-h5 font-weight-bold text-truncate">{{ inviteStore.invite.name }}</h1>
            <v-chip
              size="small"
              :color="inviteStore.status === 'error' ? 'error' : 'success'"
              variant="tonal"
              prepend-icon="solar:check-circle-linear"
            >
              {{ statusLabel[inviteStore.status] }}
            </v-chip>
          </div>
          <p v-if="inviteStore.errorMessage" class="text-caption text-error mb-4">{{ inviteStore.errorMessage }}</p>

          <v-alert
            color="primary"
            variant="tonal"
            icon="solar:link-circle-linear"
            title="Use your own storage for media"
            class="mb-4"
          >
            Upload images and MP3 audio to Google Drive or another host, make each file public to anyone
            with the link, then paste the link here. Tiep Snae stores only those links—not the files.
          </v-alert>

          <v-expansion-panels multiple variant="accordion" class="editor-accordion">
            <v-expansion-panel title="Couple & language">
              <v-expansion-panel-text>
                <v-select v-model="inviteStore.invite.language" :items="languageItems" label="Language" class="mb-3" />
                <v-text-field v-model="inviteStore.invite.couple.partnerAName" label="Partner A name" class="mb-3" />
                <v-text-field v-model="inviteStore.invite.couple.partnerBName" label="Partner B name" class="mb-4" />
                <PhotoUrlInput
                  :model-value="inviteStore.invite.heroPhoto"
                  label="Hero photo link (optional)"
                  @update:model-value="(v) => inviteStore.setHeroPhoto(v)"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="Event & venue">
              <v-expansion-panel-text>
                <v-text-field v-model="inviteStore.invite.event.date" type="date" label="Event date" class="mb-3" />
                <v-text-field v-model="inviteStore.invite.event.timeStart" label="Start time" class="mb-3" />
                <v-text-field v-model="inviteStore.invite.venue.name" label="Venue name" class="mb-3" />
                <v-text-field v-model="inviteStore.invite.venue.addressLine1" label="Address" class="mb-3" />
                <v-text-field v-model="inviteStore.invite.venue.mapUrl" label="Google Maps link" />
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="Hosts">
              <v-expansion-panel-text>
                <div v-for="host in inviteStore.invite.hosts" :key="host.id" class="d-flex ga-2 mb-3 align-center editor-form-row">
                  <v-text-field v-model="host.relation" label="Relation" density="compact" hide-details />
                  <v-text-field v-model="host.name" label="Name" density="compact" hide-details />
                  <v-btn icon="solar:trash-bin-minimalistic-linear" variant="text" size="small" @click="removeHost(host.id)" />
                </div>
                <v-btn variant="tonal" prepend-icon="solar:add-circle-linear" @click="addHost">Add host</v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="Ceremony schedule">
              <v-expansion-panel-text>
                <div v-for="item in inviteStore.invite.ceremonySchedule" :key="item.id" class="mb-4">
                  <div class="d-flex ga-2 mb-2 editor-form-row">
                    <v-text-field v-model="item.dayLabel" label="Day" density="compact" hide-details />
                    <v-text-field v-model="item.time" label="Time" density="compact" hide-details />
                  </div>
                  <v-text-field v-model="item.title" label="Title" density="compact" hide-details class="mb-2" />
                  <v-btn
                    icon="solar:trash-bin-minimalistic-linear"
                    variant="text"
                    size="small"
                    @click="removeCeremonyEvent(item.id)"
                  />
                </div>
                <v-btn variant="tonal" prepend-icon="solar:add-circle-linear" @click="addCeremonyEvent">
                  Add schedule item
                </v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="Quote">
              <v-expansion-panel-text>
                <v-textarea v-model="inviteStore.invite.quote.text" label="Quote or verse" rows="2" class="mb-2" />
                <v-btn
                  size="small"
                  variant="tonal"
                  class="ai-action-button"
                  prepend-icon="solar:magic-stick-3-bold"
                  @click="wordingDialogOpen = true"
                >
                  Write with AI
                </v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="Photo gallery">
              <v-expansion-panel-text>
                <PhotoGalleryUrlInput
                  :photos="inviteStore.invite.gallery"
                  @add="addGalleryPhoto"
                  @remove="removeGalleryPhoto"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="Music">
              <v-expansion-panel-text>
                <v-switch
                  :model-value="inviteStore.invite.music.enabled"
                  label="Play music on the invitation"
                  color="primary"
                  density="compact"
                  class="mb-2"
                  @update:model-value="(v) => inviteStore.updateMusic({ enabled: Boolean(v) })"
                />
                <MusicUrlInput
                  v-if="inviteStore.invite.music.enabled"
                  :model-value="inviteStore.invite.music.trackUrl"
                  @update:model-value="(v) => inviteStore.updateMusic({ trackUrl: v })"
                />
                <p class="text-caption text-medium-emphasis mb-0">
                  Guests tap to play — browsers block autoplay with sound, so this never plays on its own.
                </p>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="Wedding gift (KHQR)">
              <v-expansion-panel-text>
                <v-switch
                  :model-value="inviteStore.invite.giftQr?.enabled ?? false"
                  label="Show a gift QR code on the invitation"
                  color="primary"
                  density="compact"
                  class="mb-2"
                  @update:model-value="(v) => inviteStore.updateGiftQr({ enabled: Boolean(v) })"
                />
                <template v-if="inviteStore.invite.giftQr?.enabled">
                  <QrCodeUrlInput
                    :model-value="inviteStore.invite.giftQr?.imageUrl"
                    class="mb-3"
                    @update:model-value="(v) => inviteStore.updateGiftQr({ imageUrl: v })"
                  />
                  <v-text-field
                    :model-value="inviteStore.invite.giftQr?.note"
                    label="Note under the code (optional)"
                    placeholder="Scan to send a gift"
                    @update:model-value="(v) => inviteStore.updateGiftQr({ note: v })"
                  />
                </template>
                <p class="text-caption text-medium-emphasis mb-0">
                  Guests scan this with their own banking app. Nothing is collected here — we never see who
                  scans it or what they send.
                </p>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="Guest list & personal links">
              <v-expansion-panel-text>
                <GuestListPanel :invite="inviteStore.invite" />
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel title="Design">
              <v-expansion-panel-text>
                <p class="text-body-2 text-medium-emphasis mb-3">
                  Want a different look? Use the guided customizer for full control, or let AI suggest a pairing.
                </p>
                <div class="d-flex flex-wrap ga-2">
                  <v-btn
                    size="small"
                    variant="tonal"
                    class="ai-action-button"
                    prepend-icon="solar:magic-stick-3-bold"
                    @click="pairingDialogOpen = true"
                  >
                    Suggest colors & fonts
                  </v-btn>
                  <v-btn size="small" variant="tonal" to="/customize/new" prepend-icon="solar:palette-linear">
                    Open customizer
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <div class="d-flex ga-2 mt-4">
            <v-btn
              variant="flat"
              color="primary"
              class="bg-primary flex-grow-1"
              prepend-icon="solar:link-circle-bold"
              @click="shareDialogOpen = true"
            >
              Share
            </v-btn>
            <v-btn
              :to="`/i/${inviteStore.invite.id}`"
              target="_blank"
              variant="tonal"
              icon="solar:eye-linear"
              :aria-label="'Preview shared page'"
            />
          </div>
        </v-col>

        <v-col cols="12" md="7" lg="8">
          <div class="preview-frame glass-surface pa-2">
            <TemplateRenderer :invite="inviteStore.invite" />
          </div>
        </v-col>
      </v-row>
    </v-container>

    <AiInviteAgentChat />
    <AiWordingDialog
      v-model="wordingDialogOpen"
      field-label="love quote"
      :current-value="inviteStore.invite.quote.text"
      :language="inviteStore.invite.language"
      @apply="applyQuoteWording"
    />
    <AiPairingDialog v-model="pairingDialogOpen" @apply="applyPairing" />
    <ShareLinkDialog v-model="shareDialogOpen" :invite="inviteStore.invite" />
  </div>
  <v-container v-else class="py-16 text-center">
    <p class="text-body-1 text-medium-emphasis">Invitation not found on this device.</p>
    <v-btn to="/templates" class="mt-4" color="primary" variant="flat">Back to templates</v-btn>
  </v-container>
</template>

<style scoped>
.preview-frame {
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
  border-radius: var(--radius-xl);
}
</style>

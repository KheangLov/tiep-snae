<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { clearLocalUserData, readLocalDataSummary, type LocalDataSummary } from '~/utils/privacyStorage'
import { useAppI18n } from '~/composables/useAppI18n'

const { t } = useAppI18n()
const open = ref(false)
const deleteConfirmOpen = ref(false)
const summary = ref<LocalDataSummary>({ inviteCount: 0, apiKeyStored: false, bytesUsed: 0 })

onMounted(() => {
  summary.value = readLocalDataSummary()
})

watch(open, (isOpen) => {
  if (isOpen) summary.value = readLocalDataSummary()
})

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kilobytes = bytes / 1024
  if (kilobytes < 1024) return `${kilobytes.toFixed(kilobytes < 10 ? 1 : 0)} KB`
  return `${(kilobytes / 1024).toFixed(1)} MB`
}

function deleteLocalData() {
  clearLocalUserData()
  deleteConfirmOpen.value = false
  open.value = false
  window.location.replace('/')
}
</script>

<template>
  <v-dialog v-model="open" max-width="44rem" scrollable>
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="success"
        variant="tonal"
        size="small"
        class="privacy-status-button text-none"
        :aria-label="t('privacy.open')"
      >
        <v-icon icon="solar:shield-check-linear" size="18" />
        <span class="privacy-status-label ml-1">{{ t('privacy.short') }}</span>
      </v-btn>
    </template>

    <v-card class="privacy-center-card">
      <v-card-title class="privacy-center-title d-flex align-start ga-3 px-5 pt-5 pb-3">
        <span class="privacy-hero-icon" aria-hidden="true">
          <v-icon icon="solar:shield-check-linear" size="26" />
        </span>
        <div class="privacy-center-title__copy">
          <h2 class="text-h6 font-weight-bold mb-1">{{ t('privacy.title') }}</h2>
          <p class="text-body-2 text-medium-emphasis text-wrap mb-0">{{ t('privacy.subtitle') }}</p>
        </div>
      </v-card-title>

      <v-card-text class="px-5 pb-2">
        <div class="privacy-principles mb-5">
          <div class="privacy-principle">
            <span class="privacy-principle-icon"><v-icon icon="solar:database-linear" size="21" /></span>
            <div>
              <h3 class="text-subtitle-2 font-weight-bold mb-1">{{ t('privacy.localTitle') }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ t('privacy.localBody') }}</p>
            </div>
          </div>

          <div class="privacy-principle">
            <span class="privacy-principle-icon"><v-icon icon="solar:eye-closed-linear" size="21" /></span>
            <div>
              <h3 class="text-subtitle-2 font-weight-bold mb-1">{{ t('privacy.trackingTitle') }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ t('privacy.trackingBody') }}</p>
            </div>
          </div>

          <div class="privacy-principle">
            <span class="privacy-principle-icon"><v-icon icon="solar:magic-stick-3-linear" size="21" /></span>
            <div>
              <h3 class="text-subtitle-2 font-weight-bold mb-1">{{ t('privacy.aiTitle') }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ t('privacy.aiBody') }}</p>
            </div>
          </div>

          <div class="privacy-principle">
            <span class="privacy-principle-icon"><v-icon icon="solar:user-linear" size="21" /></span>
            <div>
              <h3 class="text-subtitle-2 font-weight-bold mb-1">{{ t('privacy.feedbackTitle') }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ t('privacy.feedbackBody') }}</p>
            </div>
          </div>
        </div>

        <v-card variant="tonal" color="primary" class="privacy-storage-card pa-4">
          <h3 class="text-subtitle-2 font-weight-bold mb-3">{{ t('privacy.storageTitle') }}</h3>
          <div class="d-flex flex-wrap ga-2">
            <v-chip size="small" variant="flat" prepend-icon="solar:documents-linear">
              {{ t('privacy.savedInvites', { count: summary.inviteCount }) }}
            </v-chip>
            <v-chip size="small" variant="flat" prepend-icon="solar:shield-check-linear">
              {{ summary.apiKeyStored ? t('privacy.keySaved') : t('privacy.noKey') }}
            </v-chip>
            <v-chip size="small" variant="flat" prepend-icon="solar:database-linear">
              {{ t('privacy.storageUsed', { size: formatBytes(summary.bytesUsed) }) }}
            </v-chip>
          </div>
        </v-card>

        <p class="text-caption text-medium-emphasis mt-3 mb-0">{{ t('privacy.preferencesNote') }}</p>
      </v-card-text>

      <v-card-actions class="privacy-center-actions px-5 pb-5 pt-3">
        <v-btn
          color="error"
          variant="text"
          prepend-icon="solar:trash-bin-minimalistic-linear"
          @click="deleteConfirmOpen = true"
        >
          {{ t('privacy.deleteData') }}
        </v-btn>
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="open = false">{{ t('common.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteConfirmOpen" max-width="30rem">
    <v-card>
      <v-card-title class="privacy-delete-title d-flex align-start ga-2 px-5 pt-5">
        <v-icon icon="solar:danger-triangle-linear" color="error" />
        <span class="flex-1-1">{{ t('privacy.deleteTitle') }}</span>
      </v-card-title>
      <v-card-text class="px-5">{{ t('privacy.deleteBody') }}</v-card-text>
      <v-card-actions class="privacy-delete-actions px-5 pb-5 ga-2">
        <v-spacer />
        <v-btn variant="text" @click="deleteConfirmOpen = false">{{ t('common.cancel') }}</v-btn>
        <v-btn color="error" variant="flat" @click="deleteLocalData">{{ t('privacy.deleteConfirm') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.privacy-status-button {
  min-width: 0;
  border: 0.0625rem solid rgba(var(--v-theme-success), 0.22);
}

.privacy-center-card {
  border: 0.0625rem solid rgba(var(--v-theme-success), 0.22);
}

.privacy-center-title,
.privacy-delete-title {
  white-space: normal;
}

.privacy-center-title__copy,
.privacy-delete-title span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.privacy-center-title__copy {
  flex: 1 1 auto;
}

.privacy-hero-icon,
.privacy-principle-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-success));
  border-radius: 999px;
  background: rgba(var(--v-theme-success), 0.12);
}

.privacy-hero-icon {
  width: 3rem;
  height: 3rem;
}

.privacy-principles {
  display: grid;
  gap: 0.75rem;
}

.privacy-principle {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem;
  border: 0.0625rem solid var(--glass-border);
  border-radius: var(--radius-lg);
  background: var(--glass-field-bg);
}

.privacy-principle-icon {
  width: 2.25rem;
  height: 2.25rem;
}

.privacy-storage-card {
  border-radius: var(--radius-lg) !important;
}

@media (min-width: 45rem) {
  .privacy-principles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 37.5rem) {
  .privacy-center-title {
    gap: 0.75rem !important;
    padding: 1rem 1rem 0.75rem !important;
  }

  .privacy-center-title h2 {
    font-size: 1rem !important;
    line-height: 1.5;
  }

  .privacy-hero-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .privacy-center-actions,
  .privacy-delete-actions {
    flex-wrap: wrap;
    padding-inline: 1rem !important;
  }

  .privacy-center-actions .v-spacer,
  .privacy-delete-actions .v-spacer {
    display: none;
  }

  .privacy-center-actions .v-btn,
  .privacy-delete-actions .v-btn {
    width: 100%;
  }

  .privacy-delete-title {
    padding-inline: 1rem !important;
  }

  .privacy-status-label {
    display: none;
  }

  .privacy-status-button {
    width: 2.25rem;
    min-width: 2.25rem !important;
    padding-inline: 0 !important;
  }
}
</style>

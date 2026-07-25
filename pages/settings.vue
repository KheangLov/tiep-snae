<script setup lang="ts">
import { computed } from 'vue'
import { useAiSettings } from '~/composables/useAiSettings'
import { AI_PROVIDERS } from '~/utils/ai'
import type { AiProviderId } from '~/types/ai'

const settings = useAiSettings()

const providerOptions = Object.values(AI_PROVIDERS).map((p) => ({ title: p.label, value: p.id }))
const currentProvider = computed(() => AI_PROVIDERS[settings.value.provider])

function onProviderChange(id: AiProviderId) {
  settings.value.provider = id
  settings.value.model = AI_PROVIDERS[id].defaultModels[0]
  settings.value.baseUrl = AI_PROVIDERS[id].defaultBaseUrl ?? ''
}
</script>

<template>
  <v-container class="py-8" style="max-width: 40rem">
    <h1 class="text-h4 font-weight-bold mb-2">AI Assistant</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">
      Bring your own API key. Your key and every message go directly from this browser to the provider
      you choose — never through any server we run.
    </p>

    <v-card class="pa-5 mb-4">
      <v-select
        :model-value="settings.provider"
        :items="providerOptions"
        label="AI provider"
        class="mb-3"
        @update:model-value="onProviderChange"
      />
      <v-text-field
        v-model="settings.apiKey"
        :label="settings.provider === 'ollama' ? 'API key (usually not needed)' : 'API key'"
        type="password"
        autocomplete="off"
        class="mb-3"
      />
      <v-combobox
        v-model="settings.model"
        :items="currentProvider.defaultModels"
        label="Model"
        class="mb-3"
      />
      <v-text-field
        v-if="settings.provider === 'ollama'"
        v-model="settings.baseUrl"
        label="Server URL"
      />
    </v-card>

    <v-card variant="tonal" color="success" class="pa-4 d-flex align-start ga-2">
      <v-icon icon="solar:shield-check-linear" size="18" class="mt-1 flex-shrink-0" />
      <p class="text-body-2 mb-0">
        Stored only in this browser's local storage. Nothing here is ever sent to us — we have no
        server in the loop at all.
      </p>
    </v-card>
  </v-container>
</template>

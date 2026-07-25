<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAiAssistant } from '~/composables/useAiAssistant'
import { ACCENT_PALETTE } from '~/templates/theme/accentPalette'
import { FONT_PAIRS, type FontPairId } from '~/templates/theme/fontPairs'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  apply: [{ accentColor: string; accentColorSecondary: string; fontPairId: FontPairId }]
}>()

const { isConfigured, isLoading, error, complete } = useAiAssistant()
const vibe = ref('')
const suggestion = ref<{ accentColor: string; accentColorSecondary: string; fontPairId: FontPairId; reason: string } | null>(null)

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) { vibe.value = ''; suggestion.value = null }
})

async function generate() {
  const accentIds = ACCENT_PALETTE.map((c) => c.id).join(', ')
  const fontIds = Object.keys(FONT_PAIRS).join(', ')
  const system = `You pick a color pairing and a font pairing for a wedding invitation from two fixed lists. Reply with ONLY compact JSON of the shape {"accentId":"...","fontPairId":"...","reason":"..."} and nothing else. accentId must be exactly one of: ${accentIds}. fontPairId must be exactly one of: ${fontIds}. reason is one short sentence explaining the choice.`
  const result = await complete(system, [{ role: 'user', content: vibe.value || 'Something elegant and timeless.' }])
  if (!result) return

  try {
    const parsed = JSON.parse(result.text.trim()) as { accentId?: string; fontPairId?: string; reason?: string }
    const accent = ACCENT_PALETTE.find((c) => c.id === parsed.accentId) ?? ACCENT_PALETTE[0]
    const fontPairId: FontPairId = parsed.fontPairId && parsed.fontPairId in FONT_PAIRS ? parsed.fontPairId as FontPairId : 'lora-inter'
    suggestion.value = {
      accentColor: accent.accentColor,
      accentColorSecondary: accent.accentColorSecondary,
      fontPairId,
      reason: parsed.reason ?? '',
    }
  } catch {
    error.value = 'Could not read that suggestion — try again.'
  }
}

function apply() {
  if (!suggestion.value) return
  emit('apply', suggestion.value)
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="28rem" scrollable @update:model-value="(v) => emit('update:modelValue', v)">
    <v-card class="glass-surface">
      <v-card-title class="d-flex align-center ga-2 px-5 pt-5">
        <v-icon icon="solar:palette-2-bold" color="primary" />
        <span>AI color & font pairing</span>
      </v-card-title>
      <v-card-text class="px-5">
        <div v-if="!isConfigured">
          <p class="text-body-2 text-medium-emphasis mb-3">Set up an AI provider first.</p>
          <v-btn to="/settings" variant="tonal" color="primary" @click="emit('update:modelValue', false)">Set up AI</v-btn>
        </div>
        <template v-else>
          <v-text-field
            v-model="vibe"
            label="Describe the vibe you want"
            density="comfortable"
            class="mb-3"
            @keydown.enter="generate"
          />
          <v-btn variant="tonal" color="primary" class="mb-3 ai-action-button" :loading="isLoading" @click="generate">
            {{ suggestion ? 'Try another' : 'Suggest' }}
          </v-btn>
          <div v-if="suggestion" class="d-flex align-center ga-3 mb-2">
            <span class="pairing-dots" aria-hidden="true">
              <span :style="{ background: suggestion.accentColor }" />
              <span :style="{ background: suggestion.accentColorSecondary }" />
            </span>
            <span class="text-body-2">{{ FONT_PAIRS[suggestion.fontPairId].label }}</span>
          </div>
          <p v-if="suggestion?.reason" class="text-caption text-medium-emphasis">{{ suggestion.reason }}</p>
          <p v-if="error" class="text-caption text-error mb-0">{{ error }}</p>
        </template>
      </v-card-text>
      <v-card-actions class="px-5 pb-5">
        <v-spacer />
        <v-btn variant="text" @click="emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn v-if="suggestion" color="primary" variant="flat" @click="apply">Use this</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.pairing-dots {
  display: flex;
}
.pairing-dots span {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  border: 0.125rem solid rgb(var(--v-theme-surface));
}
.pairing-dots span + span {
  margin-left: -0.5rem;
}
</style>

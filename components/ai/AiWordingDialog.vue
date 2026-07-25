<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAiAssistant } from '~/composables/useAiAssistant'
import type { InviteLanguage } from '~/types/invite'

const props = defineProps<{
  modelValue: boolean
  fieldLabel: string
  currentValue: string
  language: InviteLanguage
}>()
const emit = defineEmits<{ 'update:modelValue': [boolean]; apply: [string] }>()

const { isConfigured, isLoading, error, complete } = useAiAssistant()
const instruction = ref('')
const proposal = ref('')

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) { instruction.value = ''; proposal.value = '' }
})

async function generate() {
  const languageNote = props.language === 'km'
    ? 'Write in Khmer.'
    : props.language === 'en'
      ? 'Write in English.'
      : 'Write bilingually (Khmer, then English).'
  const system = `You help write short, warm wedding-invitation text. Reply with ONLY the finished text for the "${props.fieldLabel}" field -- no preamble, no surrounding quotes, no explanation. ${languageNote}`
  const userMessage = props.currentValue
    ? `Current text: "${props.currentValue}"\n\nInstruction: ${instruction.value || 'Improve it.'}`
    : `Instruction: ${instruction.value || `Write a short ${props.fieldLabel}.`}`

  const result = await complete(system, [{ role: 'user', content: userMessage }])
  if (result) proposal.value = result.text.trim()
}

function apply() {
  emit('apply', proposal.value)
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="30rem" scrollable @update:model-value="(v) => emit('update:modelValue', v)">
    <v-card class="glass-surface">
      <v-card-title class="d-flex align-center ga-2 px-5 pt-5">
        <v-icon icon="solar:magic-stick-3-bold" color="primary" />
        <span>AI wording — {{ fieldLabel }}</span>
      </v-card-title>
      <v-card-text class="px-5">
        <div v-if="!isConfigured">
          <p class="text-body-2 text-medium-emphasis mb-3">Set up an AI provider first.</p>
          <v-btn to="/settings" variant="tonal" color="primary" @click="emit('update:modelValue', false)">Set up AI</v-btn>
        </div>
        <template v-else>
          <v-text-field
            v-model="instruction"
            label="What should it say? (optional)"
            density="comfortable"
            class="mb-3"
            @keydown.enter="generate"
          />
          <v-btn variant="tonal" color="primary" class="mb-3 ai-action-button" :loading="isLoading" @click="generate">
            {{ proposal ? 'Regenerate' : 'Generate' }}
          </v-btn>
          <v-textarea v-if="proposal" v-model="proposal" auto-grow rows="3" label="Proposed text" />
          <p v-if="error" class="text-caption text-error mb-0">{{ error }}</p>
        </template>
      </v-card-text>
      <v-card-actions class="px-5 pb-5">
        <v-spacer />
        <v-btn variant="text" @click="emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn v-if="proposal" color="primary" variant="flat" @click="apply">Use this</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

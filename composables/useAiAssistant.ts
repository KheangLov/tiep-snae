import { computed, ref } from 'vue'
import { useAiSettings } from '~/composables/useAiSettings'
import { getAiProvider } from '~/utils/ai'
import type { AiCompletionResult, AiMessage, AiToolDefinition } from '~/types/ai'

/** Thin, domain-agnostic wrapper shared by every AI surface (chat dock,
 * wording dialog, pairing dialog): resolves the user's configured provider
 * and calls it directly, with no backend proxy in between -- see
 * utils/ai/*Provider.ts. */
export function useAiAssistant() {
  const settings = useAiSettings()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isConfigured = computed(() => settings.value.provider === 'ollama' || settings.value.apiKey.length > 0)

  async function complete(system: string, messages: AiMessage[], tools?: AiToolDefinition[]): Promise<AiCompletionResult | null> {
    if (!isConfigured.value) {
      error.value = 'Set up an AI provider first.'
      return null
    }

    const provider = getAiProvider(settings.value.provider)
    isLoading.value = true
    error.value = null
    try {
      return await provider.complete({
        apiKey: settings.value.apiKey,
        model: settings.value.model,
        baseUrl: settings.value.baseUrl || undefined,
        system,
        messages,
        tools,
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Something went wrong talking to the AI provider.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isConfigured, isLoading, error, complete }
}

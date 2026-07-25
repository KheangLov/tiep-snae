import type { AiProvider, AiProviderId } from '~/types/ai'
import { anthropicProvider } from './anthropicProvider'
import { createOpenAiCompatibleProvider } from './openaiCompatibleProvider'

const openaiProvider = createOpenAiCompatibleProvider({
  id: 'openai',
  label: 'OpenAI',
  defaultBaseUrl: 'https://api.openai.com/v1',
  defaultModels: ['gpt-5', 'gpt-5-mini'],
})

const deepseekProvider = createOpenAiCompatibleProvider({
  id: 'deepseek',
  label: 'DeepSeek',
  defaultBaseUrl: 'https://api.deepseek.com',
  defaultModels: ['deepseek-chat'],
})

const ollamaProvider = createOpenAiCompatibleProvider({
  id: 'ollama',
  label: 'Ollama (local)',
  defaultBaseUrl: 'http://localhost:11434/v1',
  defaultModels: ['llama3.1'],
})

export const AI_PROVIDERS: Record<AiProviderId, AiProvider> = {
  anthropic: anthropicProvider,
  openai: openaiProvider,
  deepseek: deepseekProvider,
  ollama: ollamaProvider,
}

export function getAiProvider(id: AiProviderId): AiProvider {
  return AI_PROVIDERS[id]
}

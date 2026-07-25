export type AiProviderId = 'anthropic' | 'openai' | 'deepseek' | 'ollama'

export interface AiMessage {
  role: 'user' | 'assistant'
  content: string
}

/** JSON-schema-shaped tool definition -- the same shape works unchanged as
 * Anthropic's `input_schema` and as an OpenAI-compatible function's
 * `parameters`, so one AiToolDefinition list serves every provider. */
export interface AiToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown>
}

export interface AiToolCall {
  id: string
  name: string
  input: Record<string, unknown>
}

export interface AiCompletionResult {
  text: string
  toolCalls: AiToolCall[]
}

export interface AiCompletionRequest {
  apiKey: string
  model: string
  baseUrl?: string
  system: string
  messages: AiMessage[]
  tools?: AiToolDefinition[]
}

export interface AiProvider {
  id: AiProviderId
  label: string
  defaultBaseUrl?: string
  defaultModels: string[]
  complete(request: AiCompletionRequest): Promise<AiCompletionResult>
}

import type { AiCompletionRequest, AiCompletionResult, AiProvider, AiProviderId, AiToolCall } from '~/types/ai'

interface OpenAiToolCallRaw {
  id?: string
  function?: { name?: string; arguments?: string }
}

function safeParseJson(text: string | undefined): Record<string, unknown> {
  if (!text) return {}
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    return {}
  }
}

/** Factory for any provider that speaks the OpenAI Chat Completions
 * wire format (OpenAI itself, DeepSeek's official API, and a local Ollama
 * server via its OpenAI-compatible endpoint all qualify) -- one adapter
 * covers all three rather than hand-rolling near-identical fetch calls. */
export function createOpenAiCompatibleProvider(config: {
  id: AiProviderId
  label: string
  defaultBaseUrl: string
  defaultModels: string[]
}): AiProvider {
  return {
    id: config.id,
    label: config.label,
    defaultBaseUrl: config.defaultBaseUrl,
    defaultModels: config.defaultModels,

    async complete(request: AiCompletionRequest): Promise<AiCompletionResult> {
      const baseUrl = (request.baseUrl || config.defaultBaseUrl).replace(/\/$/, '')
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(request.apiKey ? { authorization: `Bearer ${request.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: request.model,
          messages: [{ role: 'system', content: request.system }, ...request.messages],
          ...(request.tools?.length
            ? { tools: request.tools.map((t) => ({ type: 'function', function: { name: t.name, description: t.description, parameters: t.parameters } })) }
            : {}),
        }),
      })

      if (!response.ok) {
        const bodyText = await response.text().catch(() => '')
        throw new Error(`${config.label} API error (${response.status}): ${bodyText.slice(0, 200)}`)
      }

      const data = await response.json() as { choices?: { message?: { content?: string; tool_calls?: OpenAiToolCallRaw[] } }[] }
      const message = data.choices?.[0]?.message ?? {}
      const toolCalls: AiToolCall[] = (message.tool_calls ?? []).map((call) => ({
        id: call.id ?? crypto.randomUUID(),
        name: call.function?.name ?? '',
        input: safeParseJson(call.function?.arguments),
      })).filter((call) => call.name)

      return { text: message.content ?? '', toolCalls }
    },
  }
}

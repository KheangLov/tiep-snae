import type { AiCompletionRequest, AiCompletionResult, AiProvider, AiToolCall } from '~/types/ai'

interface AnthropicContentBlock {
  type: string
  text?: string
  id?: string
  name?: string
  input?: Record<string, unknown>
}

export const anthropicProvider: AiProvider = {
  id: 'anthropic',
  label: 'Anthropic (Claude)',
  defaultModels: ['claude-sonnet-4-5', 'claude-opus-4-1', 'claude-haiku-4-5'],

  async complete(request: AiCompletionRequest): Promise<AiCompletionResult> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': request.apiKey,
        'anthropic-version': '2023-06-01',
        // Anthropic's documented opt-in for calling the Messages API
        // directly from a browser with no backend proxy. The API key and
        // every message go straight from this device to Anthropic -- this
        // app has no server in the loop and never sees either.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: request.model,
        system: request.system,
        max_tokens: 1024,
        messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
        ...(request.tools?.length
          ? { tools: request.tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.parameters })) }
          : {}),
      }),
    })

    if (!response.ok) {
      const bodyText = await response.text().catch(() => '')
      throw new Error(`Anthropic API error (${response.status}): ${bodyText.slice(0, 200)}`)
    }

    const data = await response.json() as { content?: AnthropicContentBlock[] }
    const textParts: string[] = []
    const toolCalls: AiToolCall[] = []
    for (const block of data.content ?? []) {
      if (block.type === 'text' && block.text) textParts.push(block.text)
      else if (block.type === 'tool_use' && block.name) {
        toolCalls.push({ id: block.id ?? crypto.randomUUID(), name: block.name, input: block.input ?? {} })
      }
    }

    return { text: textParts.join('\n'), toolCalls }
  },
}

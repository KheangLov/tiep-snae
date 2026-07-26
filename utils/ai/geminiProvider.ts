import type {
  AiCompletionRequest,
  AiCompletionResult,
  AiProvider,
  AiToolCall,
} from '~/types/ai'

interface GeminiFunctionCall {
  id?: string
  name?: string
  args?: unknown
}

interface GeminiPart {
  text?: string
  thought?: boolean
  functionCall?: GeminiFunctionCall
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] }
    finishReason?: string
  }>
  promptFeedback?: {
    blockReason?: string
  }
}

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

export const geminiProvider: AiProvider = {
  id: 'gemini',
  label: 'Google Gemini',
  defaultBaseUrl: GEMINI_BASE_URL,
  defaultModels: [
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
  ],

  async complete(request: AiCompletionRequest): Promise<AiCompletionResult> {
    const baseUrl = (request.baseUrl || GEMINI_BASE_URL).replace(/\/$/, '')
    const model = request.model.trim()
    const response = await fetch(`${baseUrl}/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': request.apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: request.system }],
        },
        contents: request.messages.map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          maxOutputTokens: 1024,
        },
        ...(request.tools?.length
          ? {
              tools: [{
                functionDeclarations: request.tools.map((tool) => ({
                  name: tool.name,
                  description: tool.description,
                  parameters: tool.parameters,
                })),
              }],
            }
          : {}),
      }),
    })

    if (!response.ok) {
      const bodyText = await response.text().catch(() => '')
      throw new Error(`Google Gemini API error (${response.status}): ${bodyText.slice(0, 200)}`)
    }

    const data = await response.json() as GeminiResponse
    const candidate = data.candidates?.[0]
    if (!candidate?.content?.parts?.length) {
      const reason = data.promptFeedback?.blockReason || candidate?.finishReason
      throw new Error(reason
        ? `Google Gemini returned no content (${reason}).`
        : 'Google Gemini returned no content.')
    }

    const textParts: string[] = []
    const toolCalls: AiToolCall[] = []
    for (const part of candidate.content.parts) {
      if (part.text && !part.thought) textParts.push(part.text)

      const call = part.functionCall
      if (call?.name) {
        toolCalls.push({
          id: call.id ?? crypto.randomUUID(),
          name: call.name,
          input: asRecord(call.args),
        })
      }
    }

    return {
      text: textParts.join('\n'),
      toolCalls,
    }
  },
}

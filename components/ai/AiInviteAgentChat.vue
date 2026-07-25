<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useInviteStore } from '~/stores/invite'
import { useAiAssistant } from '~/composables/useAiAssistant'
import { TEMPLATES } from '~/templates'
import type { AiMessage, AiToolDefinition } from '~/types/ai'
import type { CeremonyEvent, HostEntry } from '~/types/invite'

const inviteStore = useInviteStore()
const { isConfigured, isLoading, error, complete } = useAiAssistant()

const open = ref(false)
const input = ref('')
const scrollEl = ref<HTMLElement | null>(null)

interface ChatEntry { role: 'user' | 'assistant'; text: string; actions?: string[] }
const transcript = ref<ChatEntry[]>([])

// Tool schemas double as the assistant's vocabulary of what it's allowed to
// touch -- each one maps directly onto a stores/invite.ts action, so the
// model can only ever make the same edits a human could make through the
// form (see executeToolCall below).
const TOOLS: AiToolDefinition[] = [
  {
    name: 'set_couple_names',
    description: "Set the couple's names as they should appear on the invitation.",
    parameters: {
      type: 'object',
      properties: {
        partnerAName: { type: 'string' },
        partnerAHonorific: { type: 'string' },
        partnerBName: { type: 'string' },
        partnerBHonorific: { type: 'string' },
      },
      required: ['partnerAName', 'partnerBName'],
    },
  },
  {
    name: 'set_language',
    description: 'Set the invitation language.',
    parameters: {
      type: 'object',
      properties: { language: { type: 'string', enum: ['km', 'en', 'bilingual'] } },
      required: ['language'],
    },
  },
  {
    name: 'switch_template',
    description: `Switch to a different template. Available template ids: ${TEMPLATES.map((t) => t.id).join(', ')}.`,
    parameters: { type: 'object', properties: { templateId: { type: 'string' } }, required: ['templateId'] },
  },
  {
    name: 'set_theme_tokens',
    description: 'Change the accent colors, font pairing id, or decorative motif id.',
    parameters: {
      type: 'object',
      properties: {
        accentColor: { type: 'string' },
        accentColorSecondary: { type: 'string' },
        fontPairId: { type: 'string' },
        motifId: { type: 'string' },
      },
    },
  },
  {
    name: 'set_event_details',
    description: 'Set the wedding date and time.',
    parameters: {
      type: 'object',
      properties: {
        eventDate: { type: 'string', description: 'ISO date, YYYY-MM-DD' },
        timeStart: { type: 'string' },
        displayDateOverride: { type: 'string' },
      },
      required: ['eventDate'],
    },
  },
  {
    name: 'set_venue',
    description: 'Set the venue name and address.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        addressLine1: { type: 'string' },
        addressLine2: { type: 'string' },
        mapUrl: { type: 'string' },
      },
      required: ['name', 'addressLine1'],
    },
  },
  {
    name: 'add_ceremony_event',
    description: 'Add one item to the ceremony schedule.',
    parameters: {
      type: 'object',
      properties: {
        dayLabel: { type: 'string' },
        title: { type: 'string' },
        khmerTitle: { type: 'string' },
        time: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['dayLabel', 'title', 'time'],
    },
  },
  {
    name: 'add_host',
    description: "Add a host (e.g. the couple's parents) to the invitation.",
    parameters: {
      type: 'object',
      properties: { relation: { type: 'string' }, name: { type: 'string' }, honorific: { type: 'string' } },
      required: ['relation', 'name'],
    },
  },
  {
    name: 'set_love_quote',
    description: 'Set the love quote or verse shown on the invitation.',
    parameters: { type: 'object', properties: { text: { type: 'string' }, attribution: { type: 'string' } }, required: ['text'] },
  },
  {
    name: 'set_rsvp_notice',
    description: 'Set how guests should informally let the couple know they are coming. This app never collects RSVPs itself.',
    parameters: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        contactMethod: { type: 'string', enum: ['phone', 'telegram', 'none'] },
        contactValue: { type: 'string' },
        message: { type: 'string' },
      },
      required: ['enabled', 'contactMethod'],
    },
  },
]

const SYSTEM_PROMPT = `You are a friendly, concise assistant helping someone build a digital wedding invitation inside this editor. You can both explain how to use the tool and directly fill in details using the tools available to you whenever the person tells you a concrete fact (names, date, venue, schedule, wording, colors).

Rules:
- If the invitation's language isn't obviously already set, ask whether they want Khmer, English, or bilingual before writing any long text.
- Respect Khmer honorifics and naming conventions when writing Khmer text.
- Never invent concrete facts (names, dates, a venue address) -- only set a fact once the person actually told you it.
- Call a tool as soon as you learn a concrete fact rather than waiting until the end of the conversation.
- Keep replies short and warm, like a helpful friend guiding them through the tool, not a form.
- This product never collects RSVPs on a server. If asked about RSVPs, explain guests are asked to reply directly by phone, Telegram, or message instead.`

function executeToolCall(name: string, args: Record<string, unknown>): string | null {
  switch (name) {
    case 'set_couple_names':
      inviteStore.updateCouple(args as never)
      return "Updated the couple's names"
    case 'set_language':
      inviteStore.setLanguage(args.language as never)
      return 'Updated the language'
    case 'switch_template': {
      const templateId = String(args.templateId ?? '')
      if (!TEMPLATES.some((t) => t.id === templateId)) return null
      inviteStore.setTemplate(templateId)
      return 'Switched template'
    }
    case 'set_theme_tokens':
      inviteStore.updateTheme(args as never)
      return 'Updated the design'
    case 'set_event_details':
      inviteStore.updateEvent(args as never)
      return 'Updated the event date/time'
    case 'set_venue':
      inviteStore.updateVenue(args as never)
      return 'Updated the venue'
    case 'add_ceremony_event':
      inviteStore.addEntry('ceremonySchedule', { id: uuidv4(), khmerTitle: '', description: '', ...args } as CeremonyEvent)
      return 'Added a schedule item'
    case 'add_host':
      inviteStore.addEntry('hosts', { id: uuidv4(), honorific: '', ...args } as HostEntry)
      return 'Added a host'
    case 'set_love_quote':
      inviteStore.updateQuote(args as never)
      return 'Updated the quote'
    case 'set_rsvp_notice':
      inviteStore.updateRsvpNotice(args as never)
      return 'Updated the RSVP notice'
    default:
      return null
  }
}

function scrollToBottom() {
  if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}

async function send() {
  const text = input.value.trim()
  if (!text || isLoading.value) return
  transcript.value.push({ role: 'user', text })
  input.value = ''
  await nextTick()
  scrollToBottom()

  const history: AiMessage[] = transcript.value.map((entry) => ({ role: entry.role, content: entry.text }))
  const result = await complete(SYSTEM_PROMPT, history, TOOLS)

  if (!result) {
    transcript.value.push({ role: 'assistant', text: error.value ?? 'Something went wrong. Check your AI settings and try again.' })
    await nextTick()
    scrollToBottom()
    return
  }

  const actions: string[] = []
  for (const call of result.toolCalls) {
    const summary = executeToolCall(call.name, call.input)
    if (summary) actions.push(summary)
  }
  if (actions.length) inviteStore.flushSave()

  transcript.value.push({
    role: 'assistant',
    text: result.text || (actions.length ? 'Done!' : "I didn't quite catch that — could you rephrase?"),
    actions,
  })
  await nextTick()
  scrollToBottom()
}
</script>

<template>
  <Teleport to="body">
    <v-btn
      icon
      class="ai-dock-launcher gradient-border-loop"
      color="primary"
      variant="flat"
      :aria-label="open ? 'Close AI assistant' : 'Open AI assistant'"
      @click="open = !open"
    >
      <v-icon :icon="open ? 'solar:close-circle-linear' : 'solar:magic-stick-3-bold'" size="22" />
    </v-btn>

    <Transition name="panel-swap">
      <v-card v-if="open" class="glass-surface ai-dock-card d-flex flex-column">
        <v-card-title class="d-flex align-center ga-2 px-4 pt-4 pb-2">
          <span class="ai-orbit-icon"><v-icon icon="solar:magic-stick-3-bold" size="16" /></span>
          <span class="text-subtitle-1 font-weight-bold">Invitation Assistant</span>
        </v-card-title>

        <div v-if="!isConfigured" class="px-4 pb-4">
          <p class="text-body-2 text-medium-emphasis mb-3">
            Connect your own AI provider to use the assistant — your key stays on this device and is
            sent only to the provider you choose, never to us.
          </p>
          <v-btn to="/settings" variant="tonal" color="primary" block @click="open = false">Set up AI</v-btn>
        </div>

        <template v-else>
          <div ref="scrollEl" class="ai-dock-transcript px-4">
            <p v-if="transcript.length === 0" class="text-body-2 text-medium-emphasis">
              Tell me about your wedding — names, date, venue, schedule — and I'll fill it in for you.
            </p>
            <div v-for="(entry, index) in transcript" :key="index" class="ai-chat-entry mb-3">
              <div class="ai-bubble" :class="entry.role === 'user' ? 'ai-bubble--user' : 'ai-bubble--assistant'">
                {{ entry.text }}
              </div>
              <ul v-if="entry.actions?.length" class="ai-actions">
                <li v-for="(action, i) in entry.actions" :key="i">✓ {{ action }}</li>
              </ul>
            </div>
            <p v-if="isLoading" class="text-caption text-medium-emphasis">Thinking…</p>
          </div>

          <v-card-actions class="px-3 py-3 ga-2">
            <v-text-field
              v-model="input"
              placeholder="Tell me about your wedding…"
              hide-details
              density="comfortable"
              :disabled="isLoading"
              @keydown.enter="send"
            />
            <v-btn icon="solar:arrow-up-linear" color="primary" variant="flat" class="bg-primary" :loading="isLoading" @click="send" />
          </v-card-actions>
        </template>
      </v-card>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ai-dock-launcher {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 1005;
  width: 3.25rem;
  height: 3.25rem;
}
.ai-dock-card {
  position: fixed;
  right: 1.25rem;
  bottom: 5rem;
  z-index: 1005;
  width: min(24rem, calc(100vw - 2rem));
  max-height: min(32rem, calc(100vh - 7rem));
}
.ai-dock-transcript {
  flex: 1 1 auto;
  min-height: 10rem;
  max-height: 20rem;
  overflow-y: auto;
}
.ai-bubble {
  display: inline-block;
  max-width: 90%;
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  line-height: 1.5;
}
.ai-bubble--user {
  background: var(--app-gradient);
  color: white;
  margin-left: auto;
}
.ai-bubble--assistant {
  background: var(--flat-glass-bg);
}
.ai-actions {
  margin: 0.375rem 0 0;
  padding-left: 1.1rem;
  font-size: 0.75rem;
  color: rgb(var(--v-theme-success));
}

/* Clears the fixed mobile bottom nav (see .app-mobile-nav in
   assets/css/main.css) instead of sitting underneath/behind it -- matches
   layouts/default.vue's "Design your own" FAB on the opposite corner. Must
   come after the base .ai-dock-launcher/.ai-dock-card rules above: equal-
   specificity CSS rules are resolved by source order, not by which one is
   wrapped in a media query, so declaring this first would have been
   silently overridden by the unconditioned base rule below it. */
@media (max-width: 37.5rem) {
  .ai-dock-launcher {
    bottom: calc(5.25rem + env(safe-area-inset-bottom, 0rem));
  }
  .ai-dock-card {
    bottom: calc(9rem + env(safe-area-inset-bottom, 0rem));
  }
}
</style>

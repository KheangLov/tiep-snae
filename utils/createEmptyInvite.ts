import { v4 as uuidv4 } from 'uuid'
import type { InviteData, InviteLanguage } from '~/types/invite'
import { DEFAULT_SECTION_ORDER } from '~/types/invite'
import { getTemplateById, TEMPLATES } from '~/templates'

/** `language` lets a caller (the gallery's per-card Khmer/English toggle,
 * the guided customizer, the AI agent) pin the starting language up front;
 * omitting it falls back to the template's own category, same as before. */
export function createEmptyInvite(templateId: string, language?: InviteLanguage): InviteData {
  const template = getTemplateById(templateId) ?? TEMPLATES[0]
  const now = new Date().toISOString()

  return {
    schemaVersion: 1,
    id: uuidv4(),
    name: template.name,
    createdAt: now,
    updatedAt: now,
    templateId: template.id,
    language: language ?? (template.category === 'khmer' ? 'bilingual' : 'en'),
    couple: { partnerAName: '', partnerBName: '' },
    hosts: [],
    guests: [],
    event: { date: now.slice(0, 10) },
    venue: { name: '', addressLine1: '' },
    ceremonySchedule: [],
    gallery: [],
    heroPhoto: undefined,
    backgroundImage: { overlayOpacity: 0.7 },
    quote: { text: '' },
    rsvpNotice: { enabled: false, contactMethod: 'none' },
    music: { enabled: false, autoplay: false },
    giftQr: { enabled: false },
    themeTokens: { ...template.defaultTheme },
    sections: DEFAULT_SECTION_ORDER.map((key) => ({ key, visible: true })),
    customSections: [],
  }
}

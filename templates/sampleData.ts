import { createEmptyInvite } from '~/utils/createEmptyInvite'
import { getTemplateById } from '~/templates'
import type { InviteData } from '~/types/invite'

export type SampleLanguage = 'km' | 'en'

/** Realistic example content so a template gallery thumbnail or a freshly
 * created invitation never renders blank -- reused identically by
 * pages/templates/index.vue (thumbnails) and pages/editor/[inviteId].vue
 * (first-run preview), so both can never visually drift from each other.
 *
 * `language` is independent of the template's own category: every
 * templates can preview (and be created) in either Khmer or English -- a
 * Khmer-heritage template isn't locked to Khmer content, and vice versa.
 * Defaults to the template's category when omitted, for callers that don't
 * care which language they get. */
export function createSampleInvite(templateId: string, language?: SampleLanguage): InviteData {
  const invite = createEmptyInvite(templateId)
  const template = getTemplateById(templateId)
  const isKhmer = (language ?? (template?.category === 'khmer' ? 'km' : 'en')) === 'km'

  invite.language = isKhmer ? 'km' : 'en'

  invite.couple = isKhmer
    ? { partnerAName: 'សុគន្ធនីសា', partnerAHonorific: 'នាង', partnerBName: 'វិបុល', partnerBHonorific: 'លោក' }
    : { partnerAName: 'Sophea', partnerBName: 'Daniel' }

  invite.event = { date: '2026-12-12', timeStart: '4:00 PM' }

  invite.venue = isKhmer
    ? { name: 'សណ្ឋាគារ រាជធានី', addressLine1: 'ផ្លូវលេខ ២៧១, ភ្នំពេញ', mapUrl: 'https://maps.google.com' }
    : { name: 'The Garden Pavilion', addressLine1: '221 Riverside Ave', mapUrl: 'https://maps.google.com' }

  invite.hosts = isKhmer
    ? [
        { id: 'h1', relation: 'ឪពុកម្តាយកូនប្រុស', name: 'លោក សុផល និង លោកស្រី សុភា', honorific: '' },
        { id: 'h2', relation: 'ឪពុកម្តាយកូនស្រី', name: 'លោក សំណាង និង លោកស្រី ដារា', honorific: '' },
      ]
    : [
        { id: 'h1', relation: 'Parents of the groom', name: 'Mr. & Mrs. Robert Lee' },
        { id: 'h2', relation: 'Parents of the bride', name: 'Mr. & Mrs. James Carter' },
      ]

  invite.ceremonySchedule = isKhmer
    ? [
        { id: 'c1', dayLabel: 'ថ្ងៃទី ១', title: 'ពិធីហែជំនូន', khmerTitle: 'ហែជំនូន', time: '6:00 AM' },
        { id: 'c2', dayLabel: 'ថ្ងៃទី ១', title: 'ពិធីកាត់សក់', khmerTitle: 'កាត់សក់', time: '8:00 AM' },
        { id: 'c3', dayLabel: 'ថ្ងៃទី ២', title: 'ពិធីជប់លៀង', khmerTitle: 'ជប់លៀង', time: '6:00 PM' },
      ]
    : [
        { id: 'c1', dayLabel: 'Ceremony', title: 'Guests arrive', time: '3:30 PM' },
        { id: 'c2', dayLabel: 'Ceremony', title: 'Vows & rings', time: '4:00 PM' },
        { id: 'c3', dayLabel: 'Reception', title: 'Dinner & dancing', time: '6:30 PM' },
      ]

  invite.quote = isKhmer
    ? { text: 'ស្នេហាពិតជាទ្រព្យសម្បត្តិដ៏មានតម្លៃបំផុតរបស់ជីវិត', attribution: '' }
    : { text: 'Together is a beautiful place to be.', attribution: '' }

  return invite
}

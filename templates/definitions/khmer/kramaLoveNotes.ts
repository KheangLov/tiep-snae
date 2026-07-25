import type { InviteTemplateDefinition } from '~/types/template'

export const kramaLoveNotes: InviteTemplateDefinition = {
  id: 'khmer-krama-love-notes',
  name: 'ក្រមាស្នេហ៍ · Krama Love Notes',
  description: 'A warm Khmer keepsake album of taped photographs, handwritten notes, woven color, and ticket-like ceremony cards.',
  category: 'khmer',
  tags: ['playful', 'traditional', 'modern-heritage', 'romantic'],
  badge: 'new',
  layout: 'story-album',
  defaultTheme: {
    accentColor: '#9B3A3A',
    accentColorSecondary: '#30497C',
    accentSoft: '#F5E7D4',
    ink: '#2B211D',
    muted: '#79665B',
    fontPairId: 'robotoSlab-khmer',
    motifId: 'silk-hol',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
    galleryLayout: 'grid',
  },
}

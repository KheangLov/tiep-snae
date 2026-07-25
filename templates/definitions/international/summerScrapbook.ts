import type { InviteTemplateDefinition } from '~/types/template'

export const summerScrapbook: InviteTemplateDefinition = {
  id: 'intl-summer-scrapbook',
  name: 'Summer Scrapbook',
  description: 'Playful taped snapshots, postage marks, love-note paper, and keepsake tickets turn the invitation into a joyful shared album.',
  category: 'international',
  tags: ['playful', 'pastel', 'romantic', 'bold'],
  badge: 'new',
  layout: 'story-album',
  defaultTheme: {
    accentColor: '#D35C58',
    accentColorSecondary: '#EAAE59',
    accentSoft: '#FFF1D9',
    ink: '#342823',
    muted: '#816E64',
    fontPairId: 'dancing-inter',
    motifId: 'watercolor-blob',
    effectId: 'falling-hearts',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
    galleryLayout: 'grid',
  },
}

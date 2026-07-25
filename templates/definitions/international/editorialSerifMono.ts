import type { InviteTemplateDefinition } from '~/types/template'

export const editorialSerifMono: InviteTemplateDefinition = {
  id: 'intl-editorial-serif-mono',
  name: 'Editorial Serif Monochrome',
  description: 'High-fashion, magazine-cover energy — oversized serif type, huge negative space, photography-forward.',
  category: 'international',
  tags: ['minimal', 'editorial', 'bold'],
  layout: 'hero-split',
  defaultTheme: {
    accentColor: '#111111',
    accentColorSecondary: '#8B2942',
    accentSoft: '#F2F2F2',
    ink: '#111111',
    muted: '#6B6B6B',
    fontPairId: 'plex-playfair',
    motifId: 'none',
    density: 'spacious',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: false,
  },
}

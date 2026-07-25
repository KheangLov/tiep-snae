import type { InviteTemplateDefinition } from '~/types/template'

export const sirimongkolGold: InviteTemplateDefinition = {
  id: 'khmer-sirimongkol-gold',
  name: 'សិរីមង្គល · Sirimongkol Gold',
  description: 'Gate-ceremony grandeur — an Angkorian temple-frieze border framing the couple names and date.',
  category: 'khmer',
  tags: ['gold', 'elegant', 'traditional', 'bold'],
  layout: 'hero-split',
  defaultTheme: {
    accentColor: '#7A1F2B',
    accentColorSecondary: '#C9A227',
    accentSoft: '#F6E9D2',
    ink: '#1A1410',
    muted: '#7A6A5C',
    fontPairId: 'moul-playfair',
    motifId: 'angkor-frieze',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
  },
}

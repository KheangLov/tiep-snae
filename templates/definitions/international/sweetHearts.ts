import type { InviteTemplateDefinition } from '~/types/template'

export const sweetHearts: InviteTemplateDefinition = {
  id: 'intl-sweet-hearts',
  name: 'Sweet Hearts',
  description: 'A dreamy, romantic invitation with tiny hearts drifting gently down the page — pure sweetness for a love-struck celebration.',
  category: 'international',
  tags: ['romantic', 'pastel', 'floral'],
  layout: 'classic-portrait',
  defaultTheme: {
    accentColor: '#D46A83',
    accentColorSecondary: '#F4A6BC',
    accentSoft: '#FCEEF2',
    ink: '#3A2029',
    muted: '#8C6B75',
    fontPairId: 'dancing-inter',
    motifId: 'none',
    effectId: 'falling-hearts',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
  },
}

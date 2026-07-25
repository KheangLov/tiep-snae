import type { InviteTemplateDefinition } from '~/types/template'

export const botanicalLinen: InviteTemplateDefinition = {
  id: 'intl-botanical-linen',
  name: 'Botanical Linen',
  description: 'An airy, sage-and-ivory garden wedding with eucalyptus sprig line-art on a subtle linen-toned card.',
  category: 'international',
  tags: ['floral', 'minimal', 'romantic', 'pastel'],
  layout: 'classic-portrait',
  defaultTheme: {
    accentColor: '#6E7F5E',
    accentColorSecondary: '#C08552',
    accentSoft: '#F7F3EC',
    ink: '#25281F',
    muted: '#6B6F5F',
    fontPairId: 'lora-inter',
    motifId: 'botanical-sprig',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
  },
}

import type { InviteTemplateDefinition } from '~/types/template'

export const phkaSlapPkar: InviteTemplateDefinition = {
  id: 'khmer-phka-slap-pkar',
  name: 'ផ្កាស្លាបផ្កា · Phka Slap Pkar Garland',
  description: 'The flower-garland tradition, rendered as delicate modern line-art botanicals rather than clip-art.',
  category: 'khmer',
  tags: ['floral', 'elegant', 'traditional', 'romantic'],
  layout: 'classic-portrait',
  defaultTheme: {
    accentColor: '#B8536A',
    accentColorSecondary: '#2F5233',
    accentSoft: '#FAF3E8',
    ink: '#2B1B1E',
    muted: '#7A6A63',
    fontPairId: 'lora-khmer',
    motifId: 'phka-garland',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
  },
}

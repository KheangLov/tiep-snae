import type { InviteTemplateDefinition } from '~/types/template'

export const pastelWatercolor: InviteTemplateDefinition = {
  id: 'intl-pastel-watercolor',
  name: 'Pastel Watercolor Dream',
  description: 'A soft gradient-wash background with hand-lettered-feel names, for a dreamy, romantic wedding.',
  category: 'international',
  tags: ['pastel', 'romantic', 'floral'],
  layout: 'classic-portrait',
  defaultTheme: {
    accentColor: '#C97B96',
    accentColorSecondary: '#9E8FC9',
    accentSoft: '#F7EEF7',
    ink: '#3A2E3D',
    muted: '#8A7A8E',
    fontPairId: 'dancing-inter',
    motifId: 'watercolor-blob',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
  },
}

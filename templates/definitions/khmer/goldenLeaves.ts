import type { InviteTemplateDefinition } from '~/types/template'

export const goldenLeaves: InviteTemplateDefinition = {
  id: 'khmer-golden-leaves',
  name: 'ស្លឹកឈើមាស · Golden Leaves',
  description: 'Warm golden leaves drift softly down the page — an elegant, gentle Khmer wedding invitation for an autumn-hued celebration.',
  category: 'khmer',
  tags: ['elegant', 'gold', 'romantic'],
  layout: 'classic-portrait',
  defaultTheme: {
    accentColor: '#B8763A',
    accentColorSecondary: '#7A4A2B',
    accentSoft: '#FBF0DD',
    ink: '#2E1D12',
    muted: '#8C6F52',
    fontPairId: 'robotoSlab-khmer',
    motifId: 'none',
    effectId: 'falling-leaves',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
  },
}

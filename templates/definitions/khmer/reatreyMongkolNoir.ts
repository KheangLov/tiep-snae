import type { InviteTemplateDefinition } from '~/types/template'

export const reatreyMongkolNoir: InviteTemplateDefinition = {
  id: 'khmer-reatrey-mongkol-noir',
  name: 'រាត្រីមង្គលការ · Reatrey Mongkol Gold-Noir',
  description: 'Evening-reception, black-tie-gala energy — the one Khmer template built around dark glassmorphism.',
  category: 'khmer',
  tags: ['gold', 'dark', 'elegant', 'bold'],
  layout: 'hero-split',
  defaultTheme: {
    accentColor: '#141311',
    accentColorSecondary: '#C9A227',
    accentSoft: '#2A231A',
    ink: '#F5EFE0',
    muted: '#C9BBA0',
    fontPairId: 'robotoSlab-khmer',
    motifId: 'angkor-frieze',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
  },
}

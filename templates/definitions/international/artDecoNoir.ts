import type { InviteTemplateDefinition } from '~/types/template'

export const artDecoNoir: InviteTemplateDefinition = {
  id: 'intl-art-deco-noir',
  name: 'Art Deco Noir',
  description: '1920s-revival geometric symmetry — sunburst and fan borders in black, gold, and emerald.',
  category: 'international',
  tags: ['gold', 'dark', 'bold', 'editorial'],
  layout: 'hero-split',
  defaultTheme: {
    accentColor: '#0F0F0F',
    accentColorSecondary: '#D4AF37',
    accentSoft: '#1C1C1C',
    ink: '#F2EFE6',
    muted: '#B9AF95',
    fontPairId: 'plex-playfair',
    motifId: 'sunburst',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: false,
  },
}

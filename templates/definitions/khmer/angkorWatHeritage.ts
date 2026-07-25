import type { InviteTemplateDefinition } from '~/types/template'

export const angkorWatHeritage: InviteTemplateDefinition = {
  id: 'khmer-angkor-wat-heritage',
  name: 'អង្គរវត្ត · Angkor Wat Heritage',
  description: 'The quincunx towers of Angkor Wat rise across the hero itself as a monumental silhouette — weathered sandstone and jungle green, named for its own Bayon-carved heading font.',
  category: 'khmer',
  tags: ['traditional', 'modern-heritage', 'elegant', 'bold'],
  layout: 'hero-split',
  defaultTheme: {
    accentColor: '#7C6A4F',
    accentColorSecondary: '#3F5B44',
    accentSoft: '#EFE7D8',
    ink: '#241E16',
    muted: '#8A7A63',
    fontPairId: 'bayon-playfair',
    motifId: 'angkor-wat-silhouette',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
  },
}

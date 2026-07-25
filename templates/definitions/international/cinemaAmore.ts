import type { InviteTemplateDefinition } from '~/types/template'

export const cinemaAmore: InviteTemplateDefinition = {
  id: 'intl-cinema-amore',
  name: 'Cinema Amore',
  description: 'A film-title opening, dramatic full-bleed photography, and chaptered event scenes for a celebration that deserves the big screen.',
  category: 'international',
  tags: ['cinematic', 'dark', 'editorial', 'romantic'],
  badge: 'new',
  layout: 'cinematic-scroll',
  defaultTheme: {
    accentColor: '#7E2033',
    accentColorSecondary: '#E5BD76',
    accentSoft: '#160D15',
    ink: '#FAF2E8',
    muted: '#C7B6B4',
    fontPairId: 'plex-playfair',
    motifId: 'sunburst',
    density: 'spacious',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: false,
    galleryLayout: 'grid',
  },
}

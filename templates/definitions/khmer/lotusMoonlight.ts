import type { InviteTemplateDefinition } from '~/types/template'

export const lotusMoonlight: InviteTemplateDefinition = {
  id: 'khmer-lotus-moonlight',
  name: 'ចន្ទផ្កាឈូក · Lotus Moonlight',
  description: 'A cinematic Khmer night story with an immersive opening scene, luminous gold details, and each ceremony revealed like a new chapter.',
  category: 'khmer',
  tags: ['cinematic', 'dark', 'romantic', 'modern-heritage'],
  badge: 'new',
  layout: 'cinematic-scroll',
  defaultTheme: {
    accentColor: '#9C6B4E',
    accentColorSecondary: '#E9C98D',
    accentSoft: '#101725',
    ink: '#F8F0E3',
    muted: '#C8BCA9',
    fontPairId: 'bayon-playfair',
    motifId: 'naga-scale',
    density: 'spacious',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
    galleryLayout: 'grid',
  },
}

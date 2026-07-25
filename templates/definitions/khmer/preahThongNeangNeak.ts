import type { InviteTemplateDefinition } from '~/types/template'

export const preahThongNeangNeak: InviteTemplateDefinition = {
  id: 'khmer-preah-thong-neang-neak',
  name: 'ព្រះថោង នាងនាគ · Preah Thong Neang Neak',
  description: 'The naga-princess origin legend, told as a scrolling three-day narrative — gate, hair-cutting, and reception.',
  category: 'khmer',
  tags: ['elegant', 'traditional', 'modern-heritage'],
  layout: 'timeline-scroll',
  defaultTheme: {
    accentColor: '#12213D',
    accentColorSecondary: '#7FA6C9',
    accentSoft: '#E8EEF6',
    ink: '#101826',
    muted: '#5C6B80',
    fontPairId: 'bayon-playfair',
    motifId: 'naga-scale',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
  },
}

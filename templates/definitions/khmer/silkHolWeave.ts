import type { InviteTemplateDefinition } from '~/types/template'

export const silkHolWeave: InviteTemplateDefinition = {
  id: 'khmer-silk-hol-weave',
  name: 'សូត្រហុល · Silk Hol Weave',
  description: 'Ikat/hol textile diamond-weave reinterpreted as modern-heritage cards — each detail its own woven textile card.',
  category: 'khmer',
  tags: ['gold', 'traditional', 'modern-heritage', 'bold'],
  layout: 'card-stack',
  defaultTheme: {
    accentColor: '#B75B33',
    accentColorSecondary: '#E0A542',
    accentSoft: '#FBEEDD',
    ink: '#2B1B12',
    muted: '#8A6E56',
    fontPairId: 'montserrat-khmer',
    motifId: 'silk-hol',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: true,
  },
}

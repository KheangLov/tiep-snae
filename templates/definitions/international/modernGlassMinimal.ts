import type { InviteTemplateDefinition } from '~/types/template'

export const modernGlassMinimal: InviteTemplateDefinition = {
  id: 'intl-modern-glass-minimal',
  name: 'Modern Glass Minimal',
  description: 'Extends the app’s own glassmorphism directly into the invitation — frosted panels, one electric accent, no ornamental motif.',
  category: 'international',
  tags: ['minimal', 'bold', 'editorial'],
  layout: 'card-stack',
  defaultTheme: {
    accentColor: '#0F172A',
    accentColorSecondary: '#0066FF',
    accentSoft: '#EEF3FF',
    ink: '#0F172A',
    muted: '#5B6472',
    fontPairId: 'jakarta-inter',
    motifId: 'none',
    density: 'comfortable',
  },
  sectionConfig: {
    showCeremonySchedule: true,
    showHostNames: false,
  },
}

import { FONT_PAIRS, type FontPairId } from './fontPairs'
import type { MotifId } from './motifs'

export type Density = 'compact' | 'comfortable' | 'spacious'

/** An ambient animated overlay, distinct from `motifId` (a static
 * decorative divider) -- see components/invite/primitives/
 * InviteFallingParticles.vue. */
export type EffectId = 'none' | 'falling-leaves' | 'falling-hearts'

export interface InviteThemeTokens {
  accentColor: string
  accentColorSecondary?: string
  accentSoft?: string
  ink?: string
  muted?: string
  fontPairId: FontPairId
  motifId?: MotifId
  effectId?: EffectId
  density?: Density
}

const DENSITY_GAP: Record<Density, string> = {
  compact: '2rem',
  comfortable: '3rem',
  spacious: '4.25rem',
}

/** Turns a template's theme tokens into CSS custom properties, applied once
 * on the invitation's root element (see components/invite/TemplateRenderer.vue).
 * Every primitive/motif reads colors and fonts through these variables --
 * never a hard-coded value -- so switching template/theme never requires
 * touching a primitive's own markup. */
export function resolveThemeStyle(tokens: InviteThemeTokens): Record<string, string> {
  const pair = FONT_PAIRS[tokens.fontPairId]
  return {
    '--invite-accent': tokens.accentColor,
    '--invite-accent-secondary': tokens.accentColorSecondary ?? tokens.accentColor,
    '--invite-accent-soft': tokens.accentSoft ?? tokens.accentColor,
    '--invite-ink': tokens.ink ?? '#201014',
    '--invite-muted': tokens.muted ?? '#6b5a5f',
    '--invite-font-heading': pair.heading,
    '--invite-font-body': pair.body,
    '--invite-section-gap': DENSITY_GAP[tokens.density ?? 'comfortable'],
  }
}

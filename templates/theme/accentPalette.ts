/** Curated accent-color choices offered in the guided customizer (Phase 2).
 * Each entry is a two-tone pairing so a user picking "their own" colors
 * still gets a template's characteristic two-tone look rather than a flat
 * single-hue result. */
export interface AccentChoice {
  id: string
  label: string
  accentColor: string
  accentColorSecondary: string
}

export const ACCENT_PALETTE: AccentChoice[] = [
  { id: 'rosewood-gold', label: 'Rosewood & Gold', accentColor: '#8B2942', accentColorSecondary: '#C98A3E' },
  { id: 'blush-jade', label: 'Blush & Jade', accentColor: '#E8B4B8', accentColorSecondary: '#2F5233' },
  { id: 'navy-silver', label: 'Navy & Silver', accentColor: '#12213D', accentColorSecondary: '#7FA6C9' },
  { id: 'terracotta-marigold', label: 'Terracotta & Marigold', accentColor: '#B75B33', accentColorSecondary: '#E0A542' },
  { id: 'sage-terracotta', label: 'Sage & Terracotta', accentColor: '#8A9A7E', accentColorSecondary: '#C08552' },
  { id: 'black-emerald', label: 'Black & Emerald', accentColor: '#0F0F0F', accentColorSecondary: '#0B6E4F' },
  { id: 'blush-lilac', label: 'Blush & Lilac', accentColor: '#F4C7D0', accentColorSecondary: '#D8C7EC' },
  { id: 'monochrome-electric', label: 'Monochrome & Electric', accentColor: '#0F172A', accentColorSecondary: '#0066FF' },
]

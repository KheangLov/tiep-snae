/** Curated font pairings, one per template family. Adding a new pair here is
 * the only step needed for a template definition to reference it -- the
 * actual font files are imported once, centrally, in
 * components/invite/TemplateRenderer.vue so the dashboard/gallery bundle
 * never pays for a font only a couple of templates use. */
export type FontPairId =
  | 'lora-khmer'
  | 'lora-inter'
  | 'jakarta-inter'
  | 'moul-playfair'
  | 'bayon-playfair'
  | 'montserrat-khmer'
  | 'robotoSlab-khmer'
  | 'dancing-inter'
  | 'plex-playfair'

export interface FontPair {
  label: string
  heading: string
  body: string
}

export const FONT_PAIRS: Record<FontPairId, FontPair> = {
  'lora-khmer': { label: 'Lora + Noto Sans Khmer', heading: '"Lora", serif', body: '"Noto Sans Khmer", "Inter", sans-serif' },
  'lora-inter': { label: 'Lora + Inter', heading: '"Lora", serif', body: '"Inter", sans-serif' },
  'jakarta-inter': { label: 'Plus Jakarta Sans + Inter', heading: '"Plus Jakarta Sans", sans-serif', body: '"Inter", sans-serif' },
  'moul-playfair': { label: 'Moul + Playfair Display', heading: '"Moul", serif', body: '"Playfair Display", serif' },
  'bayon-playfair': { label: 'Bayon + Playfair Display', heading: '"Bayon", serif', body: '"Playfair Display", serif' },
  'montserrat-khmer': { label: 'Montserrat + Noto Sans Khmer', heading: '"Montserrat", sans-serif', body: '"Noto Sans Khmer", "Inter", sans-serif' },
  'robotoSlab-khmer': { label: 'Roboto Slab + Noto Sans Khmer', heading: '"Roboto Slab", serif', body: '"Noto Sans Khmer", "Inter", sans-serif' },
  'dancing-inter': { label: 'Dancing Script + Inter', heading: '"Dancing Script", cursive', body: '"Inter", sans-serif' },
  'plex-playfair': { label: 'Playfair Display + IBM Plex Sans', heading: '"Playfair Display", serif', body: '"IBM Plex Sans", sans-serif' },
}

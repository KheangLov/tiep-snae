import type { Component } from 'vue'

/** Every motif is a single-color `currentColor` line-art SVG component, so
 * it's cheap (no raster assets, no network requests) and inherits the
 * template's accent color automatically -- see
 * components/invite/primitives/InviteMotifDivider.vue. */
export type MotifId =
  | 'none'
  | 'phka-garland'
  | 'botanical-sprig'
  | 'angkor-frieze'
  | 'naga-scale'
  | 'silk-hol'
  | 'sunburst'
  | 'watercolor-blob'
  | 'angkor-wat-silhouette'

export const MOTIFS: Partial<Record<MotifId, () => Promise<{ default: Component }>>> = {
  'phka-garland': () => import('~/components/invite/motifs/PhkaGarlandDivider.vue'),
  'botanical-sprig': () => import('~/components/invite/motifs/BotanicalSprig.vue'),
  'angkor-frieze': () => import('~/components/invite/motifs/AngkorFrieze.vue'),
  'naga-scale': () => import('~/components/invite/motifs/NagaScalePattern.vue'),
  'silk-hol': () => import('~/components/invite/motifs/SilkHolPattern.vue'),
  'sunburst': () => import('~/components/invite/motifs/ArtDecoSunburst.vue'),
  'watercolor-blob': () => import('~/components/invite/motifs/WatercolorBlob.vue'),
  'angkor-wat-silhouette': () => import('~/components/invite/motifs/AngkorWatSilhouette.vue'),
}

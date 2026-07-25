import type { Component } from 'vue'
import type { InviteThemeTokens } from '~/templates/theme/tokens'

export type InviteCategory = 'khmer' | 'international'

export type InviteLayoutShellId =
  | 'classic-portrait'
  | 'hero-split'
  | 'timeline-scroll'
  | 'card-stack'
  | 'cinematic-scroll'
  | 'story-album'

export type InviteStyleTag =
  | 'gold'
  | 'floral'
  | 'minimal'
  | 'elegant'
  | 'bold'
  | 'pastel'
  | 'dark'
  | 'traditional'
  | 'modern-heritage'
  | 'editorial'
  | 'romantic'
  | 'cinematic'
  | 'playful'

/**
 * Most templates are "declarative": a layout shell id + a config object the
 * shell interprets (see components/invite/layoutShells/*). A few flagship
 * templates could bypass shells entirely via `component`, still honoring the
 * same {invite} prop contract -- see components/invite/TemplateRenderer.vue.
 */
export interface InviteTemplateDefinition {
  id: string
  name: string
  description: string
  category: InviteCategory
  tags: InviteStyleTag[]
  badge?: 'new' | 'featured'
  defaultTheme: InviteThemeTokens
  layout?: InviteLayoutShellId
  sectionConfig?: {
    showCeremonySchedule?: boolean
    showHostNames?: boolean
    showMusicToggle?: boolean
    galleryLayout?: 'grid' | 'carousel'
  }
  component?: () => Promise<{ default: Component }>
}

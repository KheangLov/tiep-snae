import type { InviteCategory, InviteStyleTag, InviteTemplateDefinition } from '~/types/template'
import { phkaSlapPkar } from './definitions/khmer/phkaSlapPkar'
import { angkorWatHeritage } from './definitions/khmer/angkorWatHeritage'
import { sirimongkolGold } from './definitions/khmer/sirimongkolGold'
import { preahThongNeangNeak } from './definitions/khmer/preahThongNeangNeak'
import { silkHolWeave } from './definitions/khmer/silkHolWeave'
import { reatreyMongkolNoir } from './definitions/khmer/reatreyMongkolNoir'
import { goldenLeaves } from './definitions/khmer/goldenLeaves'
import { lotusMoonlight } from './definitions/khmer/lotusMoonlight'
import { kramaLoveNotes } from './definitions/khmer/kramaLoveNotes'
import { botanicalLinen } from './definitions/international/botanicalLinen'
import { artDecoNoir } from './definitions/international/artDecoNoir'
import { pastelWatercolor } from './definitions/international/pastelWatercolor'
import { modernGlassMinimal } from './definitions/international/modernGlassMinimal'
import { editorialSerifMono } from './definitions/international/editorialSerifMono'
import { sweetHearts } from './definitions/international/sweetHearts'
import { cinemaAmore } from './definitions/international/cinemaAmore'
import { summerScrapbook } from './definitions/international/summerScrapbook'

/** Flat registry of every template, declarative-config templates and
 * flagship components alike -- see components/invite/TemplateRenderer.vue
 * for how a definition turns into rendered markup. */
export const TEMPLATES: InviteTemplateDefinition[] = [
  angkorWatHeritage,
  lotusMoonlight,
  kramaLoveNotes,
  sirimongkolGold,
  phkaSlapPkar,
  preahThongNeangNeak,
  silkHolWeave,
  reatreyMongkolNoir,
  goldenLeaves,
  botanicalLinen,
  cinemaAmore,
  summerScrapbook,
  artDecoNoir,
  pastelWatercolor,
  modernGlassMinimal,
  editorialSerifMono,
  sweetHearts,
]

export function getTemplateById(id: string): InviteTemplateDefinition | undefined {
  return TEMPLATES.find((template) => template.id === id)
}

export function getTemplatesByCategory(category: InviteCategory | 'all'): InviteTemplateDefinition[] {
  if (category === 'all') return TEMPLATES
  return TEMPLATES.filter((template) => template.category === category)
}

export function getTemplatesByTag(tag: InviteStyleTag): InviteTemplateDefinition[] {
  return TEMPLATES.filter((template) => template.tags.includes(tag))
}

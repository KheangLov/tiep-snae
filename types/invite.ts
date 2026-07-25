import type { InviteThemeTokens } from '~/templates/theme/tokens'
import type { InviteLayoutShellId } from '~/types/template'

export type InviteLanguage = 'km' | 'en' | 'bilingual'

export interface CoupleInfo {
  partnerAName: string
  partnerAHonorific?: string
  partnerBName: string
  partnerBHonorific?: string
  monogram?: string
}

export interface HostEntry {
  id: string
  relation: string
  name: string
  honorific?: string
}

export interface EventDetails {
  date: string // ISO date (yyyy-mm-dd)
  displayDateOverride?: string
  timeStart?: string
  timeEnd?: string
  timezone?: string
}

export interface VenueInfo {
  name: string
  addressLine1: string
  addressLine2?: string
  mapUrl?: string
}

export interface CeremonyEvent {
  id: string
  dayLabel: string
  title: string
  khmerTitle?: string
  time: string
  description?: string
  iconId?: string
}

export interface PhotoItem {
  id: string
  // A public link to a photo hosted by the couple. The app keeps only this
  // URL and never stores the image bytes.
  url: string
  caption?: string
}

export interface QuoteInfo {
  text: string
  attribution?: string
}

export interface RsvpNotice {
  enabled: boolean
  contactMethod: 'phone' | 'telegram' | 'none'
  contactValue?: string
  message?: string
}

export interface MusicSettings {
  enabled: boolean
  trackUrl?: string
  autoplay: false
}

/** A public link to the couple's own bank-issued KHQR image. The app stores
 * only the link and never the image itself. Nothing is collected when a
 * guest scans it. */
export interface GiftQr {
  enabled: boolean
  imageUrl?: string
  note?: string
}

/** A full-page background photo behind the whole invitation (distinct from
 * heroPhoto, which only fills the hero banner) -- see InvitePage.vue for how
 * `overlayOpacity` tints it for text readability. Just a link, like
 * every other image field. Optional so invitations saved before this field
 * existed still load correctly. */
export interface BackgroundImageSettings {
  url?: string
  /** 0 (image fully visible, no tint) to 1 (fully opaque tint, image
   * effectively hidden). Defaults to a clean, readable 0.7 the moment a URL
   * is set -- see utils/createEmptyInvite.ts and stores/invite.ts's
   * updateBackgroundImage -- so the "clean and standard" look never
   * requires the couple to touch this at all. */
  overlayOpacity: number
}

/** A name the couple has typed in, purely so they can generate a personal
 * "Dear {name}," link to send that one guest -- see utils/shareCodec.ts's
 * `to` query param (kept outside the compressed `?d=` payload so the same
 * base link is reused for every guest) and components/invite/primitives/
 * InviteHero*.vue's greeting. Nothing is tracked: there's no record of
 * whether a guest ever opened their link, this is just a label. */
export interface GuestEntry {
  id: string
  name: string
}

export type SectionKey = 'hero' | 'hosts' | 'schedule' | 'venue' | 'gallery' | 'quote' | 'rsvp' | 'music'

export interface SectionVisibility {
  key: SectionKey
  visible: boolean
}

export interface CustomSection {
  id: string
  title: string
  body: string
}

export const DEFAULT_SECTION_ORDER: SectionKey[] = ['hero', 'quote', 'hosts', 'schedule', 'venue', 'gallery', 'rsvp', 'music']

export interface InviteData {
  schemaVersion: 1
  id: string
  name: string
  createdAt: string
  updatedAt: string
  templateId: string
  /** Optional for backwards compatibility with invitations created before
   * layouts became independently customizable. The renderer falls back to
   * the selected template's layout when this is absent. */
  layoutId?: InviteLayoutShellId
  language: InviteLanguage
  couple: CoupleInfo
  hosts: HostEntry[]
  guests: GuestEntry[]
  event: EventDetails
  venue: VenueInfo
  ceremonySchedule: CeremonyEvent[]
  gallery: PhotoItem[]
  heroPhoto?: string
  backgroundImage?: BackgroundImageSettings
  quote: QuoteInfo
  rsvpNotice: RsvpNotice
  music: MusicSettings
  giftQr?: GiftQr
  themeTokens: InviteThemeTokens
  sections: SectionVisibility[]
  customSections: CustomSection[]
}

/** Keys of InviteData that hold a repeatable, id-keyed list -- the generic
 * addEntry/updateEntry/removeEntry/reorderEntries actions in stores/invite.ts
 * only operate on these. */
export type RepeatableListKey = 'hosts' | 'ceremonySchedule' | 'guests'

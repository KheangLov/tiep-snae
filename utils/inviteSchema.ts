import { z } from 'zod'
import { normalizeHostedAssetUrl } from '~/utils/assetUrl'

const hostEntrySchema = z.object({
  id: z.string(),
  relation: z.string(),
  name: z.string(),
  honorific: z.string().optional(),
})

const ceremonyEventSchema = z.object({
  id: z.string(),
  dayLabel: z.string(),
  title: z.string(),
  khmerTitle: z.string().optional(),
  time: z.string(),
  description: z.string().optional(),
  iconId: z.string().optional(),
})

const photoItemSchema = z.object({
  id: z.string(),
  url: z.string(),
  caption: z.string().optional(),
})

const guestEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
})

const themeTokensSchema = z.object({
  accentColor: z.string(),
  accentColorSecondary: z.string().optional(),
  accentSoft: z.string().optional(),
  ink: z.string().optional(),
  muted: z.string().optional(),
  fontPairId: z.string(),
  motifId: z.string().optional(),
  effectId: z.string().optional(),
  density: z.enum(['compact', 'comfortable', 'spacious']).optional(),
})

export const inviteDataSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  templateId: z.string(),
  layoutId: z.enum([
    'classic-portrait',
    'hero-split',
    'timeline-scroll',
    'card-stack',
    'cinematic-scroll',
    'story-album',
  ]).optional(),
  language: z.enum(['km', 'en', 'bilingual']),
  couple: z.object({
    partnerAName: z.string(),
    partnerAHonorific: z.string().optional(),
    partnerBName: z.string(),
    partnerBHonorific: z.string().optional(),
    monogram: z.string().optional(),
  }),
  hosts: z.array(hostEntrySchema),
  // .default([]), not .optional(): invitations saved before this field
  // existed still validate (missing input is fine), but the parsed *output*
  // always has a real array, so every other call site can assume
  // invite.guests exists rather than checking for undefined everywhere.
  guests: z.array(guestEntrySchema).default([]),
  event: z.object({
    date: z.string(),
    displayDateOverride: z.string().optional(),
    timeStart: z.string().optional(),
    timeEnd: z.string().optional(),
    timezone: z.string().optional(),
  }),
  venue: z.object({
    name: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    mapUrl: z.string().optional(),
  }),
  ceremonySchedule: z.array(ceremonyEventSchema),
  gallery: z.array(photoItemSchema),
  heroPhoto: z.string().optional(),
  // Optional, same reasoning as giftQr below: invitations saved before this
  // field existed still validate, simply with no background image set.
  backgroundImage: z.object({
    url: z.string().optional(),
    overlayOpacity: z.number(),
  }).optional(),
  quote: z.object({
    text: z.string(),
    attribution: z.string().optional(),
  }),
  rsvpNotice: z.object({
    enabled: z.boolean(),
    contactMethod: z.enum(['phone', 'telegram', 'none']),
    contactValue: z.string().optional(),
    message: z.string().optional(),
  }),
  music: z.object({
    enabled: z.boolean(),
    trackUrl: z.string().optional(),
    autoplay: z.literal(false),
  }),
  // Optional (not .default(...)) so invitations saved before this field
  // existed still validate successfully -- they simply load with no gift QR
  // configured, exactly as if the couple never enabled it.
  giftQr: z.object({
    enabled: z.boolean(),
    imageUrl: z.string().optional(),
    // Read only for migration. Embedded data URLs are intentionally dropped
    // by safeParseInviteData; an old HTTP URL is moved to imageUrl.
    imageDataUrl: z.string().optional(),
    note: z.string().optional(),
  }).optional(),
  themeTokens: themeTokensSchema,
  sections: z.array(z.object({ key: z.string(), visible: z.boolean() })),
  customSections: z.array(z.object({ id: z.string(), title: z.string(), body: z.string() })),
})

/** Guards every localStorage read (and, in Phase 5, every `?d=` shared-link
 * payload) against corrupted or tampered data -- returns null rather than
 * throwing so callers can fall back to "not found" instead of crashing. */
export function safeParseInviteData(raw: unknown): import('~/types/invite').InviteData | null {
  const result = inviteDataSchema.safeParse(raw)
  if (!result.success) return null

  const data = result.data

  data.heroPhoto = data.heroPhoto
    ? normalizeHostedAssetUrl(data.heroPhoto, 'image') ?? undefined
    : undefined
  data.gallery = data.gallery.flatMap((photo) => {
    const url = normalizeHostedAssetUrl(photo.url, 'image')
    return url ? [{ ...photo, url }] : []
  })

  if (data.backgroundImage?.url) {
    data.backgroundImage.url = normalizeHostedAssetUrl(data.backgroundImage.url, 'image') ?? undefined
  }
  if (data.music.trackUrl) {
    data.music.trackUrl = normalizeHostedAssetUrl(data.music.trackUrl, 'audio') ?? undefined
  }
  if (data.giftQr) {
    const legacyUrl = data.giftQr.imageDataUrl
    data.giftQr.imageUrl = normalizeHostedAssetUrl(data.giftQr.imageUrl ?? legacyUrl ?? '', 'image') ?? undefined
    delete data.giftQr.imageDataUrl
  }

  return data as import('~/types/invite').InviteData
}

import { v4 as uuidv4 } from 'uuid'
import type { InviteData } from '~/types/invite'
import { DEFAULT_SECTION_ORDER } from '~/types/invite'
import { safeParseInviteData } from '~/utils/inviteSchema'

/** The compact shape actually put in a `?d=` link -- deliberately much
 * smaller than InviteData (no id/createdAt/customSections/section-visibility
 * bookkeeping) so the link stays as short as possible.
 *
 * Media fields are public URLs, never embedded file bytes, so they add only
 * a small amount of text to the share payload. */
interface SharePayload {
  v: 1
  templateId: string
  layoutId?: InviteData['layoutId']
  name: string
  language: InviteData['language']
  couple: InviteData['couple']
  hosts: InviteData['hosts']
  event: InviteData['event']
  venue: InviteData['venue']
  ceremonySchedule: InviteData['ceremonySchedule']
  quote: InviteData['quote']
  rsvpNotice: InviteData['rsvpNotice']
  themeTokens: InviteData['themeTokens']
  heroPhoto?: string
  gallery?: InviteData['gallery']
  music?: InviteData['music']
  giftQr?: InviteData['giftQr']
  backgroundImage?: InviteData['backgroundImage']
}

function buildSharePayload(invite: InviteData): SharePayload {
  return {
    v: 1,
    templateId: invite.templateId,
    layoutId: invite.layoutId,
    name: invite.name,
    language: invite.language,
    couple: invite.couple,
    hosts: invite.hosts,
    event: invite.event,
    venue: invite.venue,
    ceremonySchedule: invite.ceremonySchedule,
    quote: invite.quote,
    rsvpNotice: invite.rsvpNotice,
    themeTokens: invite.themeTokens,
    heroPhoto: invite.heroPhoto,
    gallery: invite.gallery,
    music: invite.music,
    ...(invite.giftQr?.enabled ? { giftQr: invite.giftQr } : {}),
    backgroundImage: invite.backgroundImage,
  }
}

function sharePayloadToInvite(payload: SharePayload): InviteData {
  const now = new Date().toISOString()
  return {
    schemaVersion: 1,
    id: uuidv4(),
    name: payload.name,
    createdAt: now,
    updatedAt: now,
    templateId: payload.templateId,
    layoutId: payload.layoutId,
    language: payload.language,
    couple: payload.couple,
    hosts: payload.hosts ?? [],
    guests: [],
    event: payload.event,
    venue: payload.venue,
    ceremonySchedule: payload.ceremonySchedule ?? [],
    gallery: payload.gallery ?? [],
    heroPhoto: payload.heroPhoto,
    backgroundImage: payload.backgroundImage,
    quote: payload.quote,
    rsvpNotice: payload.rsvpNotice,
    music: payload.music ?? { enabled: false, autoplay: false },
    giftQr: payload.giftQr,
    themeTokens: payload.themeTokens,
    sections: DEFAULT_SECTION_ORDER.map((key) => ({ key, visible: true })),
    customSections: [],
  }
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBytes(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(base64url.length / 4) * 4, '=')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function gzipCompress(text: string): Promise<Uint8Array> {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function gzipDecompress(bytes: Uint8Array): Promise<string> {
  const stream = new Blob([Uint8Array.from(bytes)]).stream().pipeThrough(new DecompressionStream('gzip'))
  return new TextDecoder().decode(await new Response(stream).arrayBuffer())
}

/** Encodes an invitation into the string that goes in a shareable link's
 * `?d=` query param. Uses the native CompressionStream API (supported in
 * every current browser) so the link stays well under the length where SMS
 * gateways and in-app browsers start mangling URLs; degrades to plain
 * base64url if CompressionStream is unavailable, rather than failing. */
export async function encodeShareData(invite: InviteData): Promise<string> {
  const safeInvite = safeParseInviteData(invite)
  if (!safeInvite) throw new Error('Cannot share invalid invitation data.')
  const json = JSON.stringify(buildSharePayload(safeInvite))
  if (typeof CompressionStream === 'undefined') {
    return `u.${bytesToBase64Url(new TextEncoder().encode(json))}`
  }
  return `g.${bytesToBase64Url(await gzipCompress(json))}`
}

/** Decodes a `?d=` payload back into a full InviteData, defaulting every
 * field the compact payload doesn't carry. Returns null on any malformed or
 * tampered input rather than throwing -- the caller (pages/i/[inviteId].vue)
 * falls back to localStorage when this returns null. */
export async function decodeShareData(encoded: string): Promise<InviteData | null> {
  try {
    const marker = encoded.slice(0, 1)
    const bytes = base64UrlToBytes(encoded.slice(2))
    const json = marker === 'g' ? await gzipDecompress(bytes) : new TextDecoder().decode(bytes)
    const payload = JSON.parse(json) as SharePayload
    if (payload.v !== 1 || !payload.templateId || !payload.couple) return null
    return safeParseInviteData(sharePayloadToInvite(payload))
  } catch {
    return null
  }
}

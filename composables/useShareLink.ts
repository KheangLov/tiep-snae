import { encodeShareData } from '~/utils/shareCodec'
import type { InviteData } from '~/types/invite'

export interface ShareLinkOptions {
  /** A guest's name, added as a plain `to` query param -- deliberately
   * outside the compressed `?d=` blob, so the same (comparatively expensive
   * to compute) compressed payload is computed once and reused for every
   * guest; only this short param changes per link. See
   * components/invite/primitives/InviteHero*.vue for where it surfaces as a
   * "Dear {name}," greeting. */
  guestName?: string
}

/** Builds a complete shareable URL for an invitation. The one place this
 * logic lives -- components/share/ShareLinkDialog.vue and the editor's
 * per-guest "copy link" buttons both call this rather than each
 * constructing the URL by hand. */
export async function buildShareUrl(invite: InviteData, options: ShareLinkOptions = {}): Promise<string> {
  const encoded = await encodeShareData(invite)
  const url = new URL(`/i/${invite.id}`, window.location.origin)
  url.searchParams.set('d', encoded)
  if (options.guestName?.trim()) url.searchParams.set('to', options.guestName.trim())
  return url.toString()
}

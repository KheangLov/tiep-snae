export type HostedAssetKind = 'image' | 'audio'

function googleDriveFileId(url: URL): string | null {
  if (url.hostname !== 'drive.google.com') return null

  const pathMatch = url.pathname.match(/\/file\/d\/([^/]+)/)
  return pathMatch?.[1] ?? url.searchParams.get('id')
}

/** Accepts secure remote assets (plus localhost for development) and
 * converts common Google Drive sharing URLs into URLs that can be used by
 * <img> and <audio>. Data/blob URLs are deliberately rejected so invitation
 * records never contain file bytes owned by this app. */
export function normalizeHostedAssetUrl(value: string, kind: HostedAssetKind): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed)
    const isLocalDevelopmentUrl = url.protocol === 'http:'
      && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    if (url.protocol !== 'https:' && !isLocalDevelopmentUrl) return null

    const driveFileId = googleDriveFileId(url)
    if (driveFileId) {
      const directUrl = new URL('https://drive.google.com/uc')
      directUrl.searchParams.set('export', kind === 'audio' ? 'download' : 'view')
      directUrl.searchParams.set('id', driveFileId)
      return directUrl.toString()
    }

    return url.toString()
  } catch {
    return null
  }
}

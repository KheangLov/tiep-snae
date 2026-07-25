import { inviteKey } from '~/utils/storageKeys'
import { safeParseInviteData } from '~/utils/inviteSchema'
import type { InviteData } from '~/types/invite'

export function loadInviteFromStorage(id: string): InviteData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(inviteKey(id))
    if (!raw) return null
    const invite = safeParseInviteData(JSON.parse(raw))
    if (!invite) return null

    // Rewrite migrated records immediately so old embedded data: assets do
    // not remain in browser storage after this version opens an invitation.
    try {
      const migrated = JSON.stringify(invite)
      if (migrated !== raw) window.localStorage.setItem(inviteKey(id), migrated)
    } catch {
      // Loading the sanitized in-memory record is still safe if a migration
      // write is blocked by browser storage settings.
    }

    return invite
  } catch {
    return null
  }
}

/** Returns false (rather than throwing) on quota-exceeded or any other
 * write failure, so callers can surface a "couldn't save" message instead of
 * silently losing the edit -- see stores/invite.ts's flushSave(). */
export function persistInviteToStorage(invite: InviteData): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(inviteKey(invite.id), JSON.stringify(invite))
    return true
  } catch {
    return false
  }
}

export function removeInviteFromStorage(id: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(inviteKey(id))
  } catch {
    // Best-effort: nothing more we can do if localStorage is unavailable.
  }
}

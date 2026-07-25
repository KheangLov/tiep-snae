/** Every localStorage key this app writes is namespaced under this prefix so
 * privacyStorage.ts can enumerate/clear "our" data without touching anything
 * else that might live in the same browser. Bump the version segment if a
 * future migration needs to leave old-shape data behind rather than migrate
 * it in place. */
export const appStoragePrefix = 'tiep-snae:v1'

export function inviteKey(id: string): string {
  return `${appStoragePrefix}:invite:${id}`
}

export const inviteIndexKey = `${appStoragePrefix}:invite-index`

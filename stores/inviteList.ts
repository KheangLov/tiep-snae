import { defineStore } from 'pinia'
import { ref } from 'vue'
import { inviteIndexKey } from '~/utils/storageKeys'
import { createEmptyInvite } from '~/utils/createEmptyInvite'
import { persistInviteToStorage, removeInviteFromStorage } from '~/utils/inviteStorage'
import type { InviteData, InviteLanguage } from '~/types/invite'

export interface InviteIndexEntry {
  id: string
  name: string
  templateId: string
  updatedAt: string
  // Kept in the lightweight index (not just the full record) specifically
  // so the dashboard can show a live countdown per card without loading
  // every invitation's full document -- see pages/index.vue.
  eventDate?: string
  eventTimeStart?: string
}

function readIndex(): InviteIndexEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(inviteIndexKey)
    return raw ? (JSON.parse(raw) as InviteIndexEntry[]) : []
  } catch {
    return []
  }
}

function writeIndex(entries: InviteIndexEntry[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(inviteIndexKey, JSON.stringify(entries))
  } catch {
    // Best-effort: the per-invitation record is the source of truth: a
    // failed index write just means the dashboard list may be briefly stale.
  }
}

/** Dashboard index store: a lightweight list of every saved invitation, kept
 * under its own storage key so the dashboard doesn't need to load every full
 * invitation document just to render a list of titles. Mirrors the
 * cv-generator "document list" store pattern. */
export const useInviteListStore = defineStore('inviteList', () => {
  // Starts empty (not readIndex()) even though this is client-only data:
  // reading localStorage synchronously here would make the client's very
  // first render (used for SSR hydration diffing) disagree with the
  // server's empty render. Pages call refresh() in onMounted() instead, so
  // the mismatch never happens and the list simply fills in right after
  // hydration.
  const entries = ref<InviteIndexEntry[]>([])

  function refresh() {
    entries.value = readIndex()
  }

  function createInvite(templateId: string, language?: InviteLanguage): InviteData {
    const invite = createEmptyInvite(templateId, language)
    persistInviteToStorage(invite)
    entries.value = [...entries.value, {
      id: invite.id,
      name: invite.name,
      templateId: invite.templateId,
      updatedAt: invite.updatedAt,
      eventDate: invite.event.date,
      eventTimeStart: invite.event.timeStart,
    }]
    writeIndex(entries.value)
    return invite
  }

  function renameInvite(id: string, name: string) {
    const entry = entries.value.find((it) => it.id === id)
    if (entry) entry.name = name
    writeIndex(entries.value)
  }

  function deleteInvite(id: string) {
    entries.value = entries.value.filter((it) => it.id !== id)
    writeIndex(entries.value)
    removeInviteFromStorage(id)
  }

  function touchInvite(id: string, updatedAt: string, name?: string, eventDate?: string, eventTimeStart?: string) {
    const entry = entries.value.find((it) => it.id === id)
    if (!entry) return
    entry.updatedAt = updatedAt
    if (name) entry.name = name
    entry.eventDate = eventDate
    entry.eventTimeStart = eventTimeStart
    writeIndex(entries.value)
  }

  return { entries, refresh, createInvite, renameInvite, deleteInvite, touchInvite }
})

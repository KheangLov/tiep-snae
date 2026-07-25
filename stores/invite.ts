import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type {
  BackgroundImageSettings,
  CeremonyEvent,
  CoupleInfo,
  EventDetails,
  GiftQr,
  GuestEntry,
  HostEntry,
  InviteData,
  InviteLanguage,
  MusicSettings,
  PhotoItem,
  QuoteInfo,
  RepeatableListKey,
  RsvpNotice,
  VenueInfo,
} from '~/types/invite'

type RepeatableEntry = HostEntry | CeremonyEvent | GuestEntry
import type { InviteThemeTokens } from '~/templates/theme/tokens'
import type { InviteLayoutShellId } from '~/types/template'
import { getTemplateById } from '~/templates'
import { loadInviteFromStorage, persistInviteToStorage } from '~/utils/inviteStorage'
import { useInviteListStore } from '~/stores/inviteList'
import { normalizeHostedAssetUrl } from '~/utils/assetUrl'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

/** Active-document store: one currently-open invitation plus debounced
 * autosave. Mirrors the shape of a typical CV-builder "current document"
 * store -- $subscribe-equivalent via a deep watch, 600ms debounce, and a
 * flushSave() for callers (export/navigation) that need the write to land
 * immediately rather than waiting out the debounce. */
export const useInviteStore = defineStore('invite', () => {
  const invite = ref<InviteData | null>(null)
  const status = ref<SaveStatus>('idle')
  const lastSavedAt = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)

  let saveTimer: ReturnType<typeof setTimeout> | null = null
  let suppressAutosave = false

  function load(id: string) {
    suppressAutosave = true
    invite.value = loadInviteFromStorage(id)
    status.value = invite.value ? 'saved' : 'idle'
    lastSavedAt.value = invite.value?.updatedAt ?? null
    errorMessage.value = null
    // Let the watcher's next tick see the flag flip back before any real
    // mutation can schedule a save -- avoids re-saving the record we just read.
    void Promise.resolve().then(() => { suppressAutosave = false })
  }

  function setInvite(data: InviteData) {
    suppressAutosave = false
    invite.value = data
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(flushSave, 600)
  }

  function flushSave() {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    if (!invite.value) return

    // Stamping updatedAt mutates the very object the watch() below is deep-
    // watching, which would otherwise re-trigger that watcher, call
    // scheduleSave() again, and flushSave() again once the new timer
    // elapses -- an infinite self-triggered save loop (status stuck on
    // "saving" forever, even though each cycle does genuinely persist).
    // Suppressing autosave around just this one assignment, combined with
    // the watcher's `flush: 'sync'` below (so it observes the flag within
    // the same synchronous step rather than on a later microtask), closes
    // the loop.
    suppressAutosave = true
    invite.value.updatedAt = new Date().toISOString()
    suppressAutosave = false

    const ok = persistInviteToStorage(invite.value)
    if (ok) {
      status.value = 'saved'
      lastSavedAt.value = invite.value.updatedAt
      errorMessage.value = null
      useInviteListStore().touchInvite(
        invite.value.id,
        invite.value.updatedAt,
        invite.value.name,
        invite.value.event.date,
        invite.value.event.timeStart,
      )
    } else {
      status.value = 'error'
      errorMessage.value = 'Could not save in this browser. Check that site storage is available and try again.'
    }
  }

  watch(invite, () => {
    if (!invite.value || suppressAutosave) return
    status.value = 'saving'
    scheduleSave()
  }, { deep: true, flush: 'sync' })

  function updateCouple(patch: Partial<CoupleInfo>) {
    if (invite.value) Object.assign(invite.value.couple, patch)
  }
  function updateEvent(patch: Partial<EventDetails>) {
    if (invite.value) Object.assign(invite.value.event, patch)
  }
  function updateVenue(patch: Partial<VenueInfo>) {
    if (invite.value) Object.assign(invite.value.venue, patch)
  }
  function updateQuote(patch: Partial<QuoteInfo>) {
    if (invite.value) Object.assign(invite.value.quote, patch)
  }
  function updateRsvpNotice(patch: Partial<RsvpNotice>) {
    if (invite.value) Object.assign(invite.value.rsvpNotice, patch)
  }
  function updateTheme(patch: Partial<InviteThemeTokens>) {
    if (invite.value) Object.assign(invite.value.themeTokens, patch)
  }
  function setLanguage(language: InviteLanguage) {
    if (invite.value) invite.value.language = language
  }
  function setTemplate(templateId: string) {
    if (!invite.value) return
    invite.value.templateId = templateId
    invite.value.layoutId = getTemplateById(templateId)?.layout
  }
  function updateLayout(layoutId: InviteLayoutShellId) {
    if (invite.value) invite.value.layoutId = layoutId
  }
  function setHeroPhoto(url: string | undefined) {
    if (invite.value) invite.value.heroPhoto = url ? normalizeHostedAssetUrl(url, 'image') ?? undefined : undefined
  }
  function updateBackgroundImage(patch: Partial<BackgroundImageSettings>) {
    if (!invite.value) return
    // backgroundImage is optional on InviteData (older saved invitations
    // predate the field) -- initialize it with the same 0.7 default
    // createEmptyInvite uses for new invitations, so an old invitation
    // adopting a background image for the first time gets the same clean
    // starting point as a brand-new one.
    const normalizedPatch = { ...patch }
    if ('url' in normalizedPatch) {
      normalizedPatch.url = normalizedPatch.url
        ? normalizeHostedAssetUrl(normalizedPatch.url, 'image') ?? undefined
        : undefined
    }
    invite.value.backgroundImage = { overlayOpacity: 0.7, ...invite.value.backgroundImage, ...normalizedPatch }
  }
  function updateGiftQr(patch: Partial<GiftQr>) {
    if (!invite.value) return
    // giftQr is optional on InviteData (older saved invitations predate the
    // field -- see utils/inviteSchema.ts) -- initialize it on first write
    // rather than requiring every invite to already have one.
    const normalizedPatch = { ...patch }
    if ('imageUrl' in normalizedPatch) {
      normalizedPatch.imageUrl = normalizedPatch.imageUrl
        ? normalizeHostedAssetUrl(normalizedPatch.imageUrl, 'image') ?? undefined
        : undefined
    }
    invite.value.giftQr = { enabled: false, ...invite.value.giftQr, ...normalizedPatch }
  }
  function updateMusic(patch: Partial<MusicSettings>) {
    if (!invite.value) return
    const normalizedPatch = { ...patch }
    if ('trackUrl' in normalizedPatch) {
      normalizedPatch.trackUrl = normalizedPatch.trackUrl
        ? normalizeHostedAssetUrl(normalizedPatch.trackUrl, 'audio') ?? undefined
        : undefined
    }
    Object.assign(invite.value.music, normalizedPatch)
  }
  function addGalleryPhoto(photo: PhotoItem) {
    if (!invite.value) return
    const url = normalizeHostedAssetUrl(photo.url, 'image')
    if (url) invite.value.gallery.push({ ...photo, url })
  }
  function removeGalleryPhoto(id: string) {
    if (!invite.value) return
    invite.value.gallery = invite.value.gallery.filter((photo) => photo.id !== id)
  }

  function listOf(key: RepeatableListKey): RepeatableEntry[] {
    return invite.value ? (invite.value[key] as RepeatableEntry[]) : []
  }

  function addEntry(key: RepeatableListKey, entry: RepeatableEntry) {
    listOf(key).push(entry)
  }
  function updateEntry(key: RepeatableListKey, id: string, patch: Partial<HostEntry & CeremonyEvent & GuestEntry>) {
    const item = listOf(key).find((it) => it.id === id)
    if (item) Object.assign(item, patch)
  }
  function removeEntry(key: RepeatableListKey, id: string) {
    if (!invite.value) return
    ;(invite.value[key] as RepeatableEntry[]) = listOf(key).filter((it) => it.id !== id)
  }
  function reorderEntries(key: RepeatableListKey, orderedIds: string[]) {
    if (!invite.value) return
    const byId = new Map(listOf(key).map((item) => [item.id, item]))
    ;(invite.value[key] as RepeatableEntry[]) = orderedIds
      .map((id) => byId.get(id))
      .filter((item): item is RepeatableEntry => Boolean(item))
  }

  return {
    invite,
    status,
    lastSavedAt,
    errorMessage,
    load,
    setInvite,
    scheduleSave,
    flushSave,
    updateCouple,
    updateEvent,
    updateVenue,
    updateQuote,
    updateRsvpNotice,
    updateTheme,
    setLanguage,
    setTemplate,
    updateLayout,
    setHeroPhoto,
    updateBackgroundImage,
    updateGiftQr,
    updateMusic,
    addGalleryPhoto,
    removeGalleryPhoto,
    addEntry,
    updateEntry,
    removeEntry,
    reorderEntries,
  }
})

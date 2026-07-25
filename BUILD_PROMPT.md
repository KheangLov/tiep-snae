# Build Prompt: Digital Wedding Invitation Builder ("tiep-snae")

> This document is a self-contained brief. Hand it to a fresh Claude Code session (or use it in this one) to execute the build end-to-end. It assumes read access to the sibling project `/Users/nitaandkheang/projects/cv-generator`, which this product ports its tech stack, design system, and several architectural patterns from.

## 1. Mission & non-negotiable principles

Build a Nuxt 3 web app where couples create a beautiful digital wedding invitation — pick from a gallery of richly designed templates (Khmer traditional + International/modern), or customize their own via a guided flow — and share it as a link. Three principles override every other decision in this brief:

1. **100% frontend, zero app-owned server storage.** No backend database, no analytics that identify a couple, and no media uploads to Tiep Snae. Invitation fields and public asset URLs live in the browser's `localStorage`; image and audio files stay in storage controlled by the couple. This must be *visibly* true to users, not just technically true — see §9.
2. **Visually distinctive, not generic.** Competing products (Sambot Online, Khinvite — see §3) are functionally capable but visually plain (sans-serif, generic hero-plus-features layouts). This product's entire differentiation is design quality: glassmorphism, rounded Vuetify components, real (but performant) animation, and culturally-specific — not clip-art — Khmer motifs.
3. **An AI agent makes the tool easy to use.** Non-technical couples should be able to lean on an in-app assistant that both *explains* the tool and *acts* on their behalf (fills in fields, switches templates, drafts wording) — see §8.

## 2. Tech stack

Ported from `cv-generator`'s verified `package.json`/`plugins/vuetify.ts`:

| Category | Package | Version | Notes |
|---|---|---|---|
| Framework | `nuxt` | 3.21.2 | pin exactly, matching cv-generator |
| | `vue` / `vue-router` | 3.5.x / 4.6.x | |
| UI | `vuetify` | 3.12.9 | + `vite-plugin-vuetify` |
| | `@iconify/vue` | 5.0.1 | Solar icon set, bundled locally (no remote Iconify calls — see `plugins/icons.ts` in cv-generator) |
| CSS | `@nuxtjs/tailwindcss` + `tailwindcss` | 6.14.x / 3.4.x | |
| State | `pinia` + `@pinia/nuxt` | latest 3.x / 0.11.x | |
| Utils | `@vueuse/core` | latest | |
| Validation | `zod` | latest 3.x | schema-guard localStorage reads, not live form validation |
| Reordering | `vue-draggable-plus` | latest | for list/section reordering only — **not** a canvas engine (guided customizer, not drag-and-drop design — see §5) |
| Fonts | `@fontsource/*` self-hosted | — | reuse cv-generator's set (Inter, Plus Jakarta Sans, Playfair Display, Roboto Slab, Lora, Montserrat, IBM Plex Sans, Noto Sans Khmer) **plus new**: `@fontsource/moul`, `@fontsource/bayon` (Khmer display faces), `@fontsource/dancing-script` (script face) |
| Export | `html2pdf.js`-style approach | — | reuse cv-generator's `useHtml2PdfExport.ts` pattern for a "download as image/PDF" keepsake |
| AI | **no SDK package** | — | direct browser `fetch()` to each provider's REST API, BYOK — identical to cv-generator's `utils/ai/*Provider.ts` |
| TypeScript | `typescript` + `vue-tsc` | latest, `strict: true` | |

No test framework, no backend framework, no `@supabase/*` or any hosted DB — cv-generator's one Supabase usage (a voluntary feedback form) is **not** ported; if a feedback channel is wanted later, use an external form service or a `mailto:` link instead of adding a backend dependency.

## 3. Competitive framing

- **[Sambot Online](https://www.sambot.online/index.html)** — tiered (Silver/Gold) packages: couple names/date, background music, photo galleries, romantic quotes; Gold adds Google Maps + expandable guest message box. Bilingual Khmer/English. Visually minimal/utilitarian — neutral tones, sans-serif, a two-column pricing-page layout rather than a designed invitation gallery.
- **[Khinvite](https://khinvite.com/)** — template gallery + customization (colors/fonts/layout), guest-list management, real-time RSVP tracking, ចងដៃ (monetary gift) recording, Google Maps embed, ABA/KHQR digital gifting. Mobile-first ("90% of guests view on mobile"). Also visually plain relative to its feature depth.
- **This product's deliberate difference:** no server-side RSVP/guest-list/payment tracking (a scope choice, not an oversight — see §6 for why, and how sharing still works well without it), in exchange for a dramatically more distinctive design system and a genuinely helpful AI agent. Feature-for-feature parity is not the goal; design quality and ease-of-use are.
- ("e-theap," a third product the user mentioned, could not be identified during research under that name or close spellings — if the user has a link, fold its inspiration in before starting Phase 4 template work.)

## 4. Design system (ported from cv-generator)

Port these near-verbatim from `/Users/nitaandkheang/projects/cv-generator`, then extend:

**`plugins/vuetify.ts`** — the `defaults` block is the single highest-leverage file to copy:
```ts
defaults: {
  VBtn: { rounded: 'xl', class: 'text-none font-weight-medium' },
  VCard: { rounded: 'xl', variant: 'flat', class: 'glass-surface' },
  VTextField: { variant: 'solo-filled', density: 'comfortable', rounded: 'xl', flat: true, hideDetails: 'auto' },
  // VTextarea / VSelect / VCombobox: same solo-filled pattern
  VChip: { variant: 'tonal', rounded: 'pill' },
}
```
Also port the Solar icon-alias remapping (avoids any remote Iconify network calls) and the light/dark theme color-token structure (`primary`/`secondary`/`background`/`surface` only).

**`assets/css/main.css`** — the two-tier glassmorphism system is the core visual language:
- `--glass-bg` / `--glass-blur` (real `backdrop-filter: blur()`) for **prominent one-off panels** (navbar, dialogs, the AI chat dock).
- A flatter, near-opaque tint (**no** `backdrop-filter`) for **repeated elements** (template gallery cards, accordions) — this is a deliberate performance choice (many simultaneous blur layers are GPU-expensive), not an oversight. Copy this distinction exactly.
- Motion tokens (`--motion-fast/base/slow`, easing curves) and a global `prefers-reduced-motion: reduce` override block that disables all animation/transition app-wide.
- Radius token scale (`--radius-sm` → `--radius-full`).

**Tailwind + Vuetify split** — `corePlugins.preflight: false` in `tailwind.config.ts` so Tailwind's reset doesn't fight Vuetify's `.v-application` styles. **Domain split, not utility-conflict avoidance**: Vuetify styles app chrome (dashboard, editor, dialogs, gallery UI); Tailwind utility classes style the invitation content tree only (the actual rendered card/page, which never mounts inside `<v-app>`). This is the load-bearing insight from cv-generator's `nuxt.config.ts` — replicate it exactly.

**Animation performance techniques to replicate:**
- Only `transform`/`opacity` for animated properties, never layout-triggering properties.
- `will-change` set explicitly and narrowly, only on elements actively animating (not globally).
- `IntersectionObserver`-gated lazy mounting for off-screen template gallery thumbnails (port `components/preview/LazyMount.vue` as-is).
- `content-visibility: auto` on long off-screen scroll sections (cv-generator uses this for paginated CV pages; this product needs it for long scrolling invitation sections and photo galleries instead).
- Disable `backdrop-filter` while an element is being dragged (mobile Safari repaint cost).
- Page transitions via the View Transitions API where supported, CSS-class fallback otherwise (port the pattern from cv-generator's `layouts/default.vue`).

## 5. Domain architecture

### Project structure

```
tiep-snae/
  app.vue  nuxt.config.ts
  plugins/
    vuetify.ts  icons.ts  local-data.client.ts     # ported from cv-generator, renamed storage keys
  assets/css/main.css                               # ported two-tier glass tokens + new invite tokens
  layouts/
    default.vue      # app chrome
    invite.vue        # chrome-free, for the shared invitation page (mirrors cv-generator's layouts/print.vue)
  pages/
    index.vue                # "My Invitations" dashboard
    templates/index.vue       # gallery, Khmer/International filterable
    customize/new.vue         # guided customizer entry
    editor/[inviteId].vue     # edit workspace
    i/[inviteId].vue          # shareable read-only invitation route (ssr:false)
    settings.vue              # AI provider/key settings
  components/
    invite/
      TemplateRenderer.vue           # single entry point: {templateId, invite} -> rendered tree
      layoutShells/                  # ClassicPortraitShell, HeroSplitShell, TimelineScrollShell, CardStackShell
      primitives/                    # InvitePage, InviteHero, InviteCountdown, InviteEventTimeline,
                                      # InviteVenueMap, InvitePhotoGallery, InviteHostNames, InviteQuote,
                                      # InviteRsvpNotice, InviteMusicToggle, InviteAddToCalendar, InviteMotifDivider
      motifs/                        # AngkorFrieze, ApsaraSilhouette, PhkaGarlandDivider, NagaScalePattern,
                                      # SilkHolPattern, BotanicalSprig, ArtDecoSunburst, WatercolorBlob
      flagship/                      # bespoke one-off templates that bypass shells
    customizer/    # CustomizerStepper, LayoutShellPicker, AccentColorPicker, FontPairPicker, MotifPicker, PhotoUrlInput
    gallery/       # TemplateCard, CategoryFilterBar (Khmer / International / All)
    ai/            # AiInviteAgentChat (chat dock), AiWordingDialog, AiPairingDialog
    privacy/PrivacyCenterDialog.vue   # ported near-verbatim
    preview/{LazyMount,PreviewStage}.vue
    share/ShareLinkDialog.vue  share/ExportDialog.vue
  composables/
    useAiSettings.ts  useAiAssistant.ts             # ported verbatim, storage key renamed
    useInviteTheme.ts  useShareLink.ts  useColorMode.ts
  stores/
    invite.ts       # active document + debounced autosave (mirrors cv-generator's stores/cv.ts)
    inviteList.ts    # dashboard index (mirrors stores/cvList.ts)
  templates/
    definitions/khmer/{sirimongkolGold,phkaSlapPkar,preahThongNeangNeak,silkHolWeave,reatreyMongkolNoir}.ts
    definitions/international/{botanicalLinen,artDecoNoir,pastelWatercolor,modernGlassMinimal,editorialSerifMono}.ts
    theme/{tokens.ts,accentPalette.ts,fontPairs.ts,motifs.ts}
    sampleData.ts  index.ts
  types/  invite.ts  template.ts  ai.ts             # ai.ts ported verbatim
  utils/
    inviteStorage.ts  inviteSchema.ts  storageKeys.ts  privacyStorage.ts  shareCodec.ts
    ai/{anthropicProvider,openaiProvider,geminiProvider,deepseekProvider,ollamaProvider,index,models}.ts  # ported verbatim
```

### `TemplateDefinition`, adapted for invitations

cv-generator's shape (verified in `types/template.ts`):
```ts
interface TemplateDefinition {
  id: string; name: string; description: string; tags: StyleTag[]
  defaultTheme: ThemeTokens
  layout?: LayoutShellId
  sectionConfig?: Record<string, unknown>
  component?: () => Promise<{ default: Component }>
}
```
Invitation version adds a hard `category` field (Khmer vs. International is a top-level gallery filter, distinct from the finer `tags` facets):
```ts
type InviteCategory = 'khmer' | 'international'
type InviteLayoutShellId = 'classic-portrait' | 'hero-split' | 'timeline-scroll' | 'card-stack'
type InviteStyleTag = 'gold' | 'floral' | 'minimal' | 'elegant' | 'bold' | 'pastel' | 'dark' | 'traditional' | 'modern-heritage' | 'editorial' | 'romantic'

interface InviteTemplateDefinition {
  id: string; name: string; description: string
  category: InviteCategory
  tags: InviteStyleTag[]
  defaultTheme: InviteThemeTokens
  layout?: InviteLayoutShellId
  sectionConfig?: { showCeremonySchedule?: boolean; showHostNames?: boolean; showMusicToggle?: boolean; galleryLayout?: 'grid' | 'carousel' }
  component?: () => Promise<{ default: Component }>   // flagship escape hatch, same as cv-generator
}
```

### `InviteData` domain fields

Mirror `CvData`'s conventions (`schemaVersion`, `id/name/createdAt/updatedAt`, `templateId`, `themeTokens`):
- `language: 'km' | 'en' | 'bilingual'`
- `couple: { partnerAName, partnerAHonorific?, partnerBName, partnerBHonorific?, monogram? }`
- `hosts: HostEntry[]` — `{ id, relation, name, honorific? }` (e.g. "Parents of the Groom") — reuse cv-generator's generic repeatable-entry CRUD (`addEntry`/`updateEntry`/`removeEntry`/`reorderEntries`)
- `event: { date, displayDateOverride?, timeStart?, timeEnd?, timezone? }`
- `venue: { name, addressLine1, addressLine2?, mapUrl? }` — `mapUrl` is a plain pasted Google Maps share-link, no API key/embed
- `ceremonySchedule: CeremonyEvent[]` — `{ id, dayLabel, title, khmerTitle?, time, description?, iconId? }`, same repeatable-CRUD pattern
- `gallery: PhotoItem[]` — `{ id, url, caption? }`, capped for a browsable gallery; each URL points to a public image in storage controlled by the couple
- `heroPhoto?: string` (public hosted-image URL)
- `quote: { text, attribution? }`
- `rsvpNotice: { enabled, contactMethod: 'phone' | 'telegram' | 'none', contactValue?, message? }` — explicitly informational, never a submission form (see §6)
- `music: { enabled, trackUrl?, autoplay: false }`
- `sections: SectionVisibility[]` (reorder/visibility)
- `customSections: CustomSection[]` (freeform bilingual notes)

### Persistence

`stores/invite.ts` mirrors `stores/cv.ts` exactly: `$subscribe`-driven 600ms-debounced autosave, `flushSave()` for immediate writes before navigation/share/export. `utils/inviteStorage.ts` mirrors `utils/cvStorage.ts`: `try/catch` around storage failures, boolean return instead of throwing. `utils/inviteSchema.ts` mirrors `utils/cvSchema.ts`: a `zod` schema + `safeParseInviteData` with a `SCHEMA_VERSION` backfill hook for future migrations. On a failed save, surface a clear browser-storage error rather than silently losing the edit. Media file bytes are never written to localStorage; only their public URLs are saved.

## 6. Sharing — no backend, but no dead end either

Why no RSVP/guest-tracking: doing that safely (collecting responses from many guests, aggregating them for the couple) fundamentally needs a place to store submissions — which conflicts with the "we never collect your data" promise this product is built around. Rather than half-build a server or fake it insecurely, v1 scope is a **polished, informational, shareable invitation** — not a guest-response collection system. This is stated to users as a deliberate feature (privacy-first), not hidden as a gap.

**Recommended sharing model** (localStorage is always the editor's source of truth for `/editor/[inviteId]`):

1. **"Share" produces a compressed link.** `utils/shareCodec.ts` gzip-compresses (native `CompressionStream`, or `lz-string` as fallback) + base64url-encodes the invitation's *text* fields into a `?d=` query param. Budget this to roughly **2000 characters** — long enough for names/dates/schedule/quote/venue, short enough to survive SMS gateways and in-app browsers that mangle very long URLs. `ShareLinkDialog.vue` shows a live character-count indicator so this is never a silent failure as content grows.
2. **Media stays externally hosted.** Share payloads contain only public photo, KHQR, and audio URLs—never embedded file bytes. The editor tells users to upload files to storage they control, enable public link access, and paste each link.
3. **"Download as image" keepsake export** (client-side, reuse cv-generator's `useHtml2PdfExport.ts` + `pages/print/[cvId].vue` postMessage-ready-handshake pattern) sidesteps the URL-length problem entirely for photo-heavy invitations — and matches how people already share Sambot/Khinvite invites today (as an image in a chat app).
4. **Direct social-share targets**, so the couple doesn't have to manually copy/paste — all sharing the same `?d=` link from step 1, no new data ever leaves the browser beyond what's already in the link:
   - **Web Share API** (`navigator.share({ title, text, url })`) as the primary one-tap mobile path — this surfaces the OS's own native share sheet (Telegram, Messenger, WhatsApp, SMS, etc. all appear automatically, no per-app integration needed).
   - **Explicit deep-link buttons** as a desktop/fallback path when `navigator.share` isn't available: Telegram (`https://t.me/share/url?url=<link>&text=<message>`), Messenger (`fb-messenger://share?link=<link>` on mobile, or Facebook's share dialog on desktop), plus an always-visible **"Copy link"** button as the universal fallback.
5. `pages/i/[inviteId].vue` (mirrors cv-generator's `pages/print/[cvId].vue`, `ssr:false`) resolves data in priority order: `?d=` query param if present (a guest viewing a shared link on a device that's never touched this browser's storage) → else `loadInviteFromStorage(inviteId)` (the author previewing their own draft). Same `TemplateRenderer.vue` for both, same zod `safeParse` guard against a tampered/corrupted `?d=` payload as localStorage reads already get.

## 7. Template gallery — 10 named concepts

### Khmer traditional

| # | Name | Concept | Palette | Typography | Motif | Shell |
|---|------|---------|---------|------------|-------|-------|
| 1 | **សិរីមង្គល · Sirimongkol Gold** | Gate-ceremony (ha kae) grandeur — Angkorian temple-frieze border framing the couple names/date | Lacquer red `#7A1F2B` + temple gold `#C9A227` + ink `#1A1410` | Moul (headings) + Noto Sans Khmer (body) + Playfair Display (English names) | Angkor Wat silhouette frieze border, apsara hand-gesture corner linework | `hero-split` |
| 2 | **ផ្កាស្លាបផ្កា · Phka Slap Pkar Garland** | The flower-garland/floral-cutting tradition, rendered as delicate modern line-art botanicals, not clip-art | Blush `#E8B4B8` + jade `#2F5233` + cream `#FAF3E8` | Lora (headings) + Noto Sans Khmer (body) | Thin-line floral garland dividers between ceremony sections | `classic-portrait` |
| 3 | **ព្រះថោង នាងនាគ · Preah Thong Neang Neak** | The naga-princess origin legend told as a scrolling three-day narrative (gate → hair-cutting/tea → reception) | Deep navy `#12213D` + silver-blue `#7FA6C9` + gold-foil accents | Bayon (headings) + Playfair Display | Naga-scale texture as a thin border band only, never a full background | `timeline-scroll` |
| 4 | **សូត្រហុល · Silk Hol Weave** | Ikat/hol textile diamond-weave pattern reinterpreted as "modern heritage" cards — each detail (schedule/venue/hosts) is a woven textile card | Terracotta `#B75B33` + marigold `#E0A542` + deep red `#7A1F2B` | Montserrat (headings) + Noto Sans Khmer (body) | Low-opacity repeating diamond-weave SVG, gold thread-line dividers | `card-stack` |
| 5 | **រាត្រីមង្គលការ · Reatrey Mongkol Gold-Noir** | Evening/reception-focused, black-tie-gala energy — the one Khmer template built around dark glassmorphism | Charcoal `#141311` + gold `#C9A227` linework | Roboto Slab/heavier Playfair + Noto Sans Khmer | Gold Angkorian corner motifs + faint apsara silhouette watermark on dark glass panels | `hero-split` (dark) |

### International / modern

| # | Name | Concept | Palette | Typography | Motif | Shell |
|---|------|---------|---------|------------|-------|-------|
| 1 | **Botanical Linen** | Airy sage-and-ivory garden wedding, eucalyptus sprig line-art on subtle linen texture | Sage `#8A9A7E` + ivory `#F7F3EC` + terracotta `#C08552` | Lora + Inter | Thin botanical sprig corner/divider accents | `classic-portrait` |
| 2 | **Art Deco Noir** | 1920s-revival geometric symmetry, sunburst/fan borders | Black `#0F0F0F` + gold `#D4AF37` + emerald `#0B6E4F` | Playfair Display (heavy) + IBM Plex Sans | Geometric sunburst/fan border frame | `hero-split` |
| 3 | **Pastel Watercolor Dream** | Soft gradient-wash background (CSS gradient, not photo texture), hand-lettered-feel names | Blush `#F4C7D0` + lilac `#D8C7EC` + sky `#C9E4F6` | Dancing Script + Inter | Soft blob-gradient washes, thin floral line accents | `classic-portrait` |
| 4 | **Modern Glass Minimal** | Extends the app's own glassmorphism directly into the invitation — frosted panels over a gradient mesh, one electric accent | Monochrome + one electric accent | Plus Jakarta Sans + Inter | None ornamental — the glass panels are the motif | `card-stack` |
| 5 | **Editorial Serif Monochrome** | High-fashion magazine-cover energy — oversized serif type, huge negative space, photography-forward | Black/white + one accent | Playfair Display (heavy) + IBM Plex Sans | None — typography and photo do the work | `hero-split` (large photo) |

Each motif is a single-color `currentColor` SVG component (`components/invite/motifs/*.vue`, registered in `templates/theme/motifs.ts`) — cheap (no raster assets/network requests) and inherits the template's accent color via CSS variable.

## 8. AI agent

Port `types/ai.ts` and `utils/ai/{anthropicProvider,openaiProvider,geminiProvider,deepseekProvider,ollamaProvider,index,models}.ts` **verbatim** — they're already fully domain-agnostic (system + messages + tools → text + toolCalls via direct browser `fetch`, e.g. Anthropic's `anthropic-dangerous-direct-browser-access` header for the no-backend BYOK pattern). Reuse `useAiAssistant.ts`'s `complete()` wrapper unchanged; only rename `useAiSettings.ts`'s localStorage key.

**Two UI surfaces** (collapsing the copilot/content/tool-calling roles cv-generator's own precedent already suggests two surfaces, not three):
- **`AiInviteAgentChat.vue`** — persistent chat dock (floating launcher → slide-over panel), available from the editor and customizer. One assistant that both *explains* ("click Customize, then pick a layout shell") and *acts* ("I'll fill in a typical Khmer wedding schedule for you") in the same conversation — mirrors `AiIntakeChat.vue`'s transcript/tool-call-dispatch structure.
- **`AiWordingDialog.vue`** / **`AiPairingDialog.vue`** — scoped propose→Accept/Regenerate/Cancel dialogs triggered by a sparkle button next to a specific field (never silently overwrites), mirroring `AiPolishDialog.vue`. Wording dialog: rewrite/translate ceremony descriptions, host titles, RSVP notice, generate a poetic couple quote. Pairing dialog: suggest accent-color/font/motif combos from a vibe description or hero photo.

**Tool schema**, dispatched to `useInviteStore()`:

| Tool | Params | Store action |
|---|---|---|
| `set_couple_names` | `partnerAName, partnerAHonorific?, partnerBName, partnerBHonorific?` | `updateCouple` |
| `set_language` | `language: 'km'\|'en'\|'bilingual'` | `setLanguage` |
| `switch_template` | `templateId` | `setTemplate` |
| `set_theme_tokens` | `accentColor?, fontPairId?, motifId?, density?` | `updateTheme` |
| `set_event_details` | `eventDate, displayDateOverride?, timeStart?, timeEnd?, timezone?` | `updateEvent` |
| `set_venue` | `name, addressLine1, addressLine2?, mapUrl?` | `updateVenue` |
| `add_ceremony_event` / `update_ceremony_event` / `remove_ceremony_event` | `dayLabel, title, khmerTitle?, time, description?` / `id, patch` / `id` | `addEntry`/`updateEntry`/`removeEntry('ceremonySchedule', …)` |
| `add_host` | `relation, name, honorific?` | `addEntry('hosts', …)` |
| `set_love_quote` | `text, attribution?` | `updateQuote` |
| `set_rsvp_notice` | `enabled, contactMethod, contactValue?, message?` | `updateRsvpNotice` |
| `set_music` | `enabled, trackUrl?` | `updateMusic` |
| `request_photo_link` | `slot: 'hero'\|'gallery'` | opens the appropriate URL input and asks the user for a public image link |
| `set_section_visible` / `reorder_sections` | `key, visible` / `orderedKeys` | `setSectionVisible`/`reorderSections` |

System prompt philosophy (parallel to `AiIntakeChat.vue`'s): ask which language the couple wants before assuming, respect Khmer honorific/naming conventions, never fabricate concrete facts (names/dates/venue), call tools as soon as a concrete fact is learned rather than waiting for the conversation to end.

## 9. Privacy messaging

The "we don't collect your data" promise must be visible, not just true:
- A persistent, small, always-present indicator (e.g. in the app bar) — something like a lock/shield icon + "Saved on this device only."
- A **Privacy Center dialog** (port `components/privacy/PrivacyCenterDialog.vue` from cv-generator, re-labeled) reachable from settings and from that indicator, plainly explaining: invitation fields and public media links are stored in this browser's localStorage; media files remain in the couple's own storage; sharing a link puts *only* invitation fields and those URLs into the URL; clearing browser data deletes the invitation (offer a "download backup JSON" escape hatch, mirroring cv-generator's `utils/downloadJson.ts` pattern).
- If AI features are used, disclose plainly in the same dialog that AI requests go directly from their browser to whichever provider they configured with their own key — not through any server this product controls (same disclosure cv-generator already makes).

## 10. Build phases

**Phase 0 — Scaffold + design-system port.** Nuxt init; port `plugins/vuetify.ts`, `assets/css/main.css`, `tailwind.config.ts`, fontsource deps, Pinia, `plugins/local-data.client.ts` hydration pattern, `utils/privacyStorage.ts` + `PrivacyCenterDialog.vue`. Deliverable: an app that *feels* like cv-generator's chrome with no invitation features yet.

**Phase 1 — Template engine core.** `types/invite.ts` + `template.ts`, `utils/inviteSchema.ts` (zod) + `inviteStorage.ts`, `stores/invite.ts` + `inviteList.ts` with debounced autosave, `TemplateRenderer.vue` + one shell (`classic-portrait`) + core primitives. Ship **2–3 templates end-to-end** (Phka Slap Pkar + Botanical Linen + Modern Glass Minimal) to validate create → edit → preview → save → reload before investing in the rest of the gallery.

**Phase 2 — Guided customizer.** `customize/new.vue` stepper (shell → category → template → accent/font/motif → photos → review); `pages/templates/index.vue` gallery with category+tag filtering and `LazyMount` thumbnails.

**Phase 3 — AI agent.** Port `utils/ai/*` + `types/ai.ts` + `useAiSettings.ts` + `useAiAssistant.ts` verbatim; build `AiInviteAgentChat.vue` with the §8 tool schema; `AiWordingDialog.vue`/`AiPairingDialog.vue`; `settings.vue` provider picker.

**Phase 4 — Remaining templates + polish/perf.** Build out the remaining Khmer and International templates + their shells (`hero-split`, `timeline-scroll`, `card-stack`) + motif SVG library; photo gallery + music toggle + add-to-calendar; `content-visibility`/reduced-motion perf pass; mobile responsive pass (the customizer is heavily mobile-used in this market).

**Phase 5 — Sharing/export.** `utils/shareCodec.ts`, `pages/i/[inviteId].vue` dual-source resolution, `ShareLinkDialog.vue` with character-budget indicator + QR code + Web Share API + Telegram/Messenger deep links, image/PDF keepsake export, final privacy-copy audit end to end.

## 11. Critical reference files (in `/Users/nitaandkheang/projects/cv-generator`)

Open and port from these first — they're the load-bearing patterns for the whole build:

- `types/template.ts` — the `TemplateDefinition` shape to adapt (§5)
- `stores/cv.ts` — debounced-autosave Pinia pattern to mirror
- `utils/cvStorage.ts` — localStorage read/write + quota-error handling to mirror
- `components/ai/AiIntakeChat.vue` — tool-calling chat architecture to mirror (§8)
- `assets/css/main.css` — two-tier glassmorphism tokens + motion tokens to port (§4)
- `plugins/vuetify.ts` — component `defaults` block to port (§4)
- `components/cv/TemplateRenderer.vue` — dynamic shell/flagship dispatch pattern to adapt
- `composables/useAiSettings.ts` / `utils/ai/*Provider.ts` — BYOK provider layer to port verbatim

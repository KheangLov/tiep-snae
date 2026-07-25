<script setup lang="ts">
// Font imports are centralized here, not in nuxt.config.ts's global `css`
// array, so the dashboard/gallery bundle never pays for a font only some
// templates use -- only whichever page actually mounts an invitation
// (editor, gallery thumbnail, or the shared /i/[inviteId] view) pays this
// cost, and only once per unique font actually referenced below.
import '@fontsource/lora/latin-400.css'
import '@fontsource/lora/latin-600.css'
import '@fontsource/playfair-display/latin-500.css'
import '@fontsource/playfair-display/latin-700.css'
import '@fontsource/montserrat/latin-500.css'
import '@fontsource/montserrat/latin-700.css'
import '@fontsource/roboto-slab/latin-500.css'
import '@fontsource/roboto-slab/latin-700.css'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/dancing-script/latin-500.css'
import '@fontsource/dancing-script/latin-700.css'
import '@fontsource/moul/khmer-400.css'
import '@fontsource/bayon/khmer-400.css'

import { computed } from 'vue'
import type { InviteData } from '~/types/invite'
import { getTemplateById } from '~/templates'
import { resolveThemeStyle } from '~/templates/theme/tokens'
import ClassicPortraitShell from './layoutShells/ClassicPortraitShell.vue'
import HeroSplitShell from './layoutShells/HeroSplitShell.vue'
import TimelineScrollShell from './layoutShells/TimelineScrollShell.vue'
import CardStackShell from './layoutShells/CardStackShell.vue'
import CinematicScrollShell from './layoutShells/CinematicScrollShell.vue'
import StoryAlbumShell from './layoutShells/StoryAlbumShell.vue'

const props = defineProps<{ invite: InviteData; guestName?: string }>()

const template = computed(() => getTemplateById(props.invite.templateId))
const layout = computed(() => props.invite.layoutId ?? template.value?.layout)
const themeStyle = computed(() => resolveThemeStyle(props.invite.themeTokens))
</script>

<template>
  <div v-if="template" class="invite-render-root" :style="themeStyle">
    <ClassicPortraitShell v-if="layout === 'classic-portrait'" :invite="invite" :template="template" :guest-name="guestName" />
    <HeroSplitShell v-else-if="layout === 'hero-split'" :invite="invite" :template="template" :guest-name="guestName" />
    <TimelineScrollShell v-else-if="layout === 'timeline-scroll'" :invite="invite" :template="template" :guest-name="guestName" />
    <CardStackShell v-else-if="layout === 'card-stack'" :invite="invite" :template="template" :guest-name="guestName" />
    <CinematicScrollShell v-else-if="layout === 'cinematic-scroll'" :invite="invite" :template="template" :guest-name="guestName" />
    <StoryAlbumShell v-else-if="layout === 'story-album'" :invite="invite" :template="template" :guest-name="guestName" />
  </div>
</template>

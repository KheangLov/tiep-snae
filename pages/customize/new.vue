<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { TEMPLATES, getTemplatesByCategory } from '~/templates'
import { createSampleInvite } from '~/templates/sampleData'
import { useInviteListStore } from '~/stores/inviteList'
import { useInviteStore } from '~/stores/invite'
import type { InviteCategory } from '~/types/template'
import type { FontPairId } from '~/templates/theme/fontPairs'
import type { MotifId } from '~/templates/theme/motifs'
import TemplateRenderer from '~/components/invite/TemplateRenderer.vue'
import AccentColorPicker from '~/components/customizer/AccentColorPicker.vue'
import FontPairPicker from '~/components/customizer/FontPairPicker.vue'
import MotifPicker from '~/components/customizer/MotifPicker.vue'
import PhotoUrlInput from '~/components/customizer/PhotoUrlInput.vue'

const router = useRouter()
const inviteListStore = useInviteListStore()
const inviteStore = useInviteStore()

const STEP_LABELS = ['Category', 'Template', 'Colors', 'Fonts', 'Motif', 'Photo', 'Review'] as const
const step = ref(0)

const category = ref<InviteCategory | null>(null)
const templateId = ref<string | null>(null)
const accentColor = ref('#8B2942')
const accentColorSecondary = ref('#C98A3E')
const fontPairId = ref<FontPairId>('lora-inter')
const motifId = ref<MotifId>('none')
const heroPhoto = ref<string | undefined>(undefined)

const templatesInCategory = computed(() => (category.value ? getTemplatesByCategory(category.value) : []))

function chooseCategory(value: InviteCategory) {
  category.value = value
  step.value = 1
}

function chooseTemplate(id: string) {
  templateId.value = id
  const template = TEMPLATES.find((t) => t.id === id)
  if (template) {
    accentColor.value = template.defaultTheme.accentColor
    accentColorSecondary.value = template.defaultTheme.accentColorSecondary ?? template.defaultTheme.accentColor
    fontPairId.value = template.defaultTheme.fontPairId
    motifId.value = template.defaultTheme.motifId ?? 'none'
  }
  step.value = 2
}

const previewInvite = computed(() => {
  if (!templateId.value) return null
  const invite = createSampleInvite(templateId.value)
  invite.themeTokens = {
    ...invite.themeTokens,
    accentColor: accentColor.value,
    accentColorSecondary: accentColorSecondary.value,
    fontPairId: fontPairId.value,
    motifId: motifId.value,
  }
  invite.heroPhoto = heroPhoto.value
  return invite
})

function next() {
  if (step.value < STEP_LABELS.length - 1) step.value += 1
}
function back() {
  if (step.value > 0) step.value -= 1
}

function finish() {
  if (!templateId.value) return
  const invite = inviteListStore.createInvite(templateId.value)
  inviteStore.setInvite(invite)
  inviteStore.updateTheme({
    accentColor: accentColor.value,
    accentColorSecondary: accentColorSecondary.value,
    fontPairId: fontPairId.value,
    motifId: motifId.value,
  })
  if (heroPhoto.value) inviteStore.setHeroPhoto(heroPhoto.value)
  inviteStore.flushSave()
  router.push(`/editor/${invite.id}`)
}
</script>

<template>
  <v-container fluid class="py-6">
    <v-row>
      <v-col cols="12" md="5" lg="4">
        <h1 class="text-h5 font-weight-bold mb-1">Design your own</h1>
        <p class="text-body-2 text-medium-emphasis mb-5">
          Pick a starting template, then make it yours — colors, fonts, motif, and a photo.
        </p>

        <div class="d-flex ga-1 mb-6" role="presentation">
          <span
            v-for="(label, index) in STEP_LABELS"
            :key="label"
            class="step-dot"
            :class="{ 'step-dot--active': index <= step }"
          />
        </div>

        <div v-if="step === 0">
          <p class="text-subtitle-2 font-weight-bold mb-3">What kind of wedding?</p>
          <div class="d-flex flex-column ga-3">
            <v-card class="pa-4 invite-card-interactive" @click="chooseCategory('khmer')">
              <p class="text-subtitle-1 font-weight-bold mb-1">Khmer traditional</p>
              <p class="text-caption text-medium-emphasis mb-0">Ceremony-rich, culturally grounded designs.</p>
            </v-card>
            <v-card class="pa-4 invite-card-interactive" @click="chooseCategory('international')">
              <p class="text-subtitle-1 font-weight-bold mb-1">International / modern</p>
              <p class="text-caption text-medium-emphasis mb-0">Contemporary styles for any wedding.</p>
            </v-card>
          </div>
        </div>

        <div v-else-if="step === 1">
          <p class="text-subtitle-2 font-weight-bold mb-3">Pick a starting template</p>
          <div class="d-flex flex-column ga-3">
            <v-card
              v-for="template in templatesInCategory"
              :key="template.id"
              class="pa-4 invite-card-interactive"
              :class="{ 'choice-card--active': templateId === template.id }"
              @click="chooseTemplate(template.id)"
            >
              <p class="text-subtitle-1 font-weight-bold mb-1">{{ template.name }}</p>
              <p class="text-caption text-medium-emphasis mb-0">{{ template.description }}</p>
            </v-card>
          </div>
          <v-btn variant="text" class="mt-4" prepend-icon="solar:alt-arrow-left-linear" @click="back">Back</v-btn>
        </div>

        <div v-else-if="step === 2">
          <p class="text-subtitle-2 font-weight-bold mb-3">Choose a color pairing</p>
          <AccentColorPicker
            :accent-color="accentColor"
            :accent-color-secondary="accentColorSecondary"
            @select="(c) => { accentColor = c.accentColor; accentColorSecondary = c.accentColorSecondary }"
          />
          <div class="d-flex ga-2 mt-5">
            <v-btn variant="text" prepend-icon="solar:alt-arrow-left-linear" @click="back">Back</v-btn>
            <v-btn color="primary" variant="flat" class="bg-primary" append-icon="solar:alt-arrow-right-linear" @click="next">Next</v-btn>
          </div>
        </div>

        <div v-else-if="step === 3">
          <p class="text-subtitle-2 font-weight-bold mb-3">Choose a font pairing</p>
          <FontPairPicker v-model="fontPairId" />
          <div class="d-flex ga-2 mt-5">
            <v-btn variant="text" prepend-icon="solar:alt-arrow-left-linear" @click="back">Back</v-btn>
            <v-btn color="primary" variant="flat" class="bg-primary" append-icon="solar:alt-arrow-right-linear" @click="next">Next</v-btn>
          </div>
        </div>

        <div v-else-if="step === 4">
          <p class="text-subtitle-2 font-weight-bold mb-3">Choose a decorative motif</p>
          <MotifPicker v-model="motifId" :accent-color="accentColor" />
          <div class="d-flex ga-2 mt-5">
            <v-btn variant="text" prepend-icon="solar:alt-arrow-left-linear" @click="back">Back</v-btn>
            <v-btn color="primary" variant="flat" class="bg-primary" append-icon="solar:alt-arrow-right-linear" @click="next">Next</v-btn>
          </div>
        </div>

        <div v-else-if="step === 5">
          <p class="text-subtitle-2 font-weight-bold mb-3">Add a photo (optional)</p>
          <PhotoUrlInput v-model="heroPhoto" />
          <div class="d-flex ga-2 mt-5">
            <v-btn variant="text" prepend-icon="solar:alt-arrow-left-linear" @click="back">Back</v-btn>
            <v-btn color="primary" variant="flat" class="bg-primary" append-icon="solar:alt-arrow-right-linear" @click="next">Next</v-btn>
          </div>
        </div>

        <div v-else-if="step === 6">
          <p class="text-subtitle-2 font-weight-bold mb-3">Ready to create your invitation?</p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            You can change everything else — names, dates, venue — right after it's created.
          </p>
          <div class="d-flex ga-2">
            <v-btn variant="text" prepend-icon="solar:alt-arrow-left-linear" @click="back">Back</v-btn>
            <v-btn
              color="primary"
              variant="flat"
              class="bg-primary attention-cta"
              prepend-icon="solar:magic-stick-3-bold"
              @click="finish"
            >
              Create my invitation
            </v-btn>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="7" lg="8">
        <div class="preview-frame glass-surface pa-2">
          <TemplateRenderer v-if="previewInvite" :invite="previewInvite" />
          <div v-else class="d-flex align-center justify-center" style="min-height: 24rem">
            <p class="text-body-2 text-medium-emphasis">Pick a category to see a live preview.</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.step-dot {
  flex: 1;
  height: 0.25rem;
  border-radius: var(--radius-full);
  background: var(--flat-glass-border);
  transition: background 0.2s ease;
}
.step-dot--active {
  background: var(--app-gradient);
}
.choice-card--active {
  border: 0.125rem solid rgb(var(--v-theme-primary));
}
.preview-frame {
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
  border-radius: var(--radius-xl);
}
</style>

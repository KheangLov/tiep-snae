<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { TEMPLATES } from '~/templates'
import { createSampleInvite } from '~/templates/sampleData'
import { useInviteListStore } from '~/stores/inviteList'
import { useInviteStore } from '~/stores/invite'
import type { InviteCategory, InviteLayoutShellId } from '~/types/template'
import type { FontPairId } from '~/templates/theme/fontPairs'
import type { MotifId } from '~/templates/theme/motifs'
import type { Density, EffectId } from '~/templates/theme/tokens'
import TemplateRenderer from '~/components/invite/TemplateRenderer.vue'
import AccentColorPicker from '~/components/customizer/AccentColorPicker.vue'
import CreativeOptionsPicker from '~/components/customizer/CreativeOptionsPicker.vue'
import FontPairPicker from '~/components/customizer/FontPairPicker.vue'
import LayoutShellPicker from '~/components/customizer/LayoutShellPicker.vue'
import MotifPicker from '~/components/customizer/MotifPicker.vue'
import PhotoUrlInput from '~/components/customizer/PhotoUrlInput.vue'

const router = useRouter()
const inviteListStore = useInviteListStore()
const inviteStore = useInviteStore()

const STEPS = [
  { label: 'Templates', shortLabel: 'Start', icon: 'solar:gallery-wide-linear' },
  { label: 'Layout', shortLabel: 'Layout', icon: 'solar:widget-5-linear' },
  { label: 'Colors & type', shortLabel: 'Style', icon: 'solar:palette-linear' },
  { label: 'Decorations', shortLabel: 'Decor', icon: 'solar:magic-stick-3-linear' },
  { label: 'Photos', shortLabel: 'Photos', icon: 'solar:gallery-add-linear' },
  { label: 'Review', shortLabel: 'Review', icon: 'solar:checklist-minimalistic-linear' },
] as const

const LAYOUT_LABELS: Record<InviteLayoutShellId, string> = {
  'classic-portrait': 'Classic Portrait',
  'hero-split': 'Bold Hero',
  'timeline-scroll': 'Timeline Story',
  'card-stack': 'Modern Cards',
  'cinematic-scroll': 'Cinematic',
  'story-album': 'Story Album',
}

const step = ref(0)
const category = ref<InviteCategory | 'all'>('all')
const templateSearch = ref('')
const templateId = ref<string | null>(null)
const layoutId = ref<InviteLayoutShellId>('classic-portrait')
const accentColor = ref('#8B2942')
const accentColorSecondary = ref('#C98A3E')
const accentSoft = ref('#F7F1ED')
const ink = ref('#201014')
const fontPairId = ref<FontPairId>('lora-inter')
const motifId = ref<MotifId>('none')
const density = ref<Density>('comfortable')
const effectId = ref<EffectId>('none')
const heroPhoto = ref<string | undefined>(undefined)
const backgroundImageUrl = ref<string | undefined>(undefined)
const backgroundOverlayOpacity = ref(0.72)
const previewDevice = ref<'phone' | 'wide'>('phone')
const mobilePane = ref<'design' | 'preview'>('design')
const focusMode = ref(false)
const controlsScroll = ref<HTMLElement | null>(null)
const previewScroll = ref<HTMLElement | null>(null)

const selectedTemplate = computed(() => TEMPLATES.find((template) => template.id === templateId.value))

const filteredTemplates = computed(() => {
  const query = templateSearch.value.trim().toLocaleLowerCase()
  return TEMPLATES.filter((template) => {
    if (category.value !== 'all' && template.category !== category.value) return false
    if (!query) return true
    const searchable = [
      template.name,
      template.description,
      template.category,
      ...template.tags,
    ].join(' ').toLocaleLowerCase()
    return searchable.includes(query)
  })
})

const previewInvite = computed(() => {
  if (!templateId.value) return null
  const invite = createSampleInvite(templateId.value)
  invite.layoutId = layoutId.value
  invite.themeTokens = {
    ...invite.themeTokens,
    accentColor: accentColor.value,
    accentColorSecondary: accentColorSecondary.value,
    accentSoft: accentSoft.value,
    ink: ink.value,
    fontPairId: fontPairId.value,
    motifId: motifId.value,
    density: density.value,
    effectId: effectId.value,
  }
  invite.heroPhoto = heroPhoto.value
  invite.backgroundImage = {
    url: backgroundImageUrl.value,
    overlayOpacity: backgroundOverlayOpacity.value,
  }
  return invite
})

const canContinue = computed(() => Boolean(templateId.value))
const isLastStep = computed(() => step.value === STEPS.length - 1)
const nextLabel = computed(() => {
  if (isLastStep.value) return 'Create invitation'
  return `Next: ${STEPS[step.value + 1]?.shortLabel ?? 'Continue'}`
})

async function selectTemplate(id: string) {
  const template = TEMPLATES.find((item) => item.id === id)
  if (!template) return

  templateId.value = id
  layoutId.value = template.layout ?? 'classic-portrait'
  accentColor.value = template.defaultTheme.accentColor
  accentColorSecondary.value = template.defaultTheme.accentColorSecondary ?? template.defaultTheme.accentColor
  accentSoft.value = template.defaultTheme.accentSoft ?? '#F7F1ED'
  ink.value = template.defaultTheme.ink ?? '#201014'
  fontPairId.value = template.defaultTheme.fontPairId
  motifId.value = template.defaultTheme.motifId ?? 'none'
  density.value = template.defaultTheme.density ?? 'comfortable'
  effectId.value = template.defaultTheme.effectId ?? 'none'

  await nextTick()
  previewScroll.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetToTemplate() {
  if (templateId.value) void selectTemplate(templateId.value)
}

async function goToStep(index: number) {
  if (index < 0 || index >= STEPS.length) return
  if (index > 0 && !templateId.value) return
  step.value = index
  mobilePane.value = 'design'
  await nextTick()
  controlsScroll.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

function next() {
  if (!canContinue.value) return
  if (isLastStep.value) {
    finish()
    return
  }
  void goToStep(step.value + 1)
}

function back() {
  if (step.value > 0) void goToStep(step.value - 1)
}

function toggleFocusMode() {
  focusMode.value = !focusMode.value
  if (focusMode.value) mobilePane.value = 'preview'
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && focusMode.value) focusMode.value = false
}

function finish() {
  if (!templateId.value) return
  const invite = inviteListStore.createInvite(templateId.value)
  inviteStore.setInvite(invite)
  inviteStore.updateLayout(layoutId.value)
  inviteStore.updateTheme({
    accentColor: accentColor.value,
    accentColorSecondary: accentColorSecondary.value,
    accentSoft: accentSoft.value,
    ink: ink.value,
    fontPairId: fontPairId.value,
    motifId: motifId.value,
    density: density.value,
    effectId: effectId.value,
  })
  inviteStore.setHeroPhoto(heroPhoto.value)
  inviteStore.updateBackgroundImage({
    url: backgroundImageUrl.value,
    overlayOpacity: backgroundOverlayOpacity.value,
  })
  inviteStore.flushSave()
  router.push(`/editor/${invite.id}`)
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <v-container
    fluid
    class="creative-studio"
    :class="{ 'creative-studio--focus': focusMode }"
  >
    <div class="studio-heading">
      <div>
        <p class="studio-kicker mb-1">Creative studio</p>
        <h1 class="text-h4 font-weight-bold mb-1">Design your own</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Start with any template, then mix layouts, colors, type, decoration, motion, and photos.
        </p>
      </div>
      <v-chip color="primary" variant="tonal" prepend-icon="solar:magic-stick-3-bold">
        {{ TEMPLATES.length }} starting designs
      </v-chip>
    </div>

    <div class="studio-steps" aria-label="Design steps">
      <button
        v-for="(item, index) in STEPS"
        :key="item.label"
        type="button"
        class="studio-step"
        :class="{
          'studio-step--active': step === index,
          'studio-step--complete': index < step,
        }"
        :disabled="index > 0 && !templateId"
        :aria-current="step === index ? 'step' : undefined"
        @click="goToStep(index)"
      >
        <span class="studio-step__number">
          <v-icon v-if="index < step" icon="solar:check-read-linear" size="15" />
          <span v-else>{{ index + 1 }}</span>
        </span>
        <span>{{ item.shortLabel }}</span>
      </button>
    </div>

    <div class="mobile-pane-switch" aria-label="Workspace panel">
      <button
        type="button"
        :class="{ 'mobile-pane-switch__button--active': mobilePane === 'design' }"
        @click="mobilePane = 'design'"
      >
        <v-icon icon="solar:palette-linear" size="18" />
        Design
      </button>
      <button
        type="button"
        :class="{ 'mobile-pane-switch__button--active': mobilePane === 'preview' }"
        @click="mobilePane = 'preview'"
      >
        <v-icon icon="solar:eye-linear" size="18" />
        Preview
      </button>
    </div>

    <div
      class="studio-grid"
      :class="`studio-grid--${mobilePane}`"
    >
      <aside class="studio-controls glass-surface">
        <div ref="controlsScroll" class="studio-controls__scroll studio-scroll-area">
          <Transition name="studio-panel" mode="out-in">
            <div :key="step">
          <section v-if="step === 0" class="control-section">
            <div class="control-heading">
              <div>
                <p class="studio-kicker mb-1">Step 1</p>
                <h2 class="text-h6 font-weight-bold mb-1">Choose a starting design</h2>
                <p class="text-caption text-medium-emphasis mb-0">
                  Every design is flexible. You can completely change its layout and style next.
                </p>
              </div>
            </div>

            <v-text-field
              v-model="templateSearch"
              label="Search templates"
              placeholder="Try cinematic, floral, Khmer…"
              prepend-inner-icon="solar:magnifer-linear"
              clearable
              density="compact"
              hide-details
            />

            <div class="template-filters" aria-label="Template category">
              <button
                v-for="option in [
                  { id: 'all', label: 'All' },
                  { id: 'khmer', label: 'Khmer' },
                  { id: 'international', label: 'International' },
                ]"
                :key="option.id"
                type="button"
                class="filter-pill"
                :class="{ 'filter-pill--active': category === option.id }"
                @click="category = option.id as InviteCategory | 'all'"
              >
                {{ option.label }}
              </button>
            </div>

            <div class="d-flex align-center justify-space-between">
              <p class="text-caption text-medium-emphasis mb-0">
                {{ filteredTemplates.length }} design{{ filteredTemplates.length === 1 ? '' : 's' }}
              </p>
              <p v-if="selectedTemplate" class="text-caption text-primary font-weight-bold mb-0">
                Previewing {{ selectedTemplate.name }}
              </p>
            </div>

            <div class="template-picker-list">
              <button
                v-for="template in filteredTemplates"
                :key="template.id"
                type="button"
                class="template-choice"
                :class="{ 'template-choice--active': templateId === template.id }"
                :aria-pressed="templateId === template.id"
                @click="selectTemplate(template.id)"
              >
                <span
                  class="template-choice__swatch"
                  :style="{
                    background: `linear-gradient(145deg, ${template.defaultTheme.accentColor}, ${template.defaultTheme.accentColorSecondary ?? template.defaultTheme.accentColor})`,
                  }"
                  aria-hidden="true"
                >
                  <i>{{ template.name.charAt(0) }}</i>
                </span>
                <span class="template-choice__content">
                  <span class="template-choice__title">
                    <strong>{{ template.name }}</strong>
                    <v-chip v-if="template.badge" size="x-small" color="primary" variant="flat">
                      {{ template.badge }}
                    </v-chip>
                  </span>
                  <small>{{ template.description }}</small>
                  <span class="template-choice__tags">
                    <i>{{ template.category }}</i>
                    <i v-for="tag in template.tags.slice(0, 2)" :key="tag">{{ tag }}</i>
                  </span>
                </span>
                <v-icon
                  v-if="templateId === template.id"
                  icon="solar:check-circle-bold"
                  color="primary"
                  size="22"
                />
              </button>
            </div>

            <div v-if="filteredTemplates.length === 0" class="empty-picker">
              <v-icon icon="solar:magnifer-linear" size="28" color="primary" />
              <p class="text-subtitle-2 font-weight-bold mb-1">No templates found</p>
              <p class="text-caption text-medium-emphasis mb-3">Try a different word or category.</p>
              <v-btn
                size="small"
                variant="tonal"
                @click="templateSearch = ''; category = 'all'"
              >
                Show all templates
              </v-btn>
            </div>
          </section>

          <section v-else-if="step === 1" class="control-section">
            <div class="control-heading">
              <div>
                <p class="studio-kicker mb-1">Step 2</p>
                <h2 class="text-h6 font-weight-bold mb-1">Choose your layout</h2>
                <p class="text-caption text-medium-emphasis mb-0">
                  The layout is independent from the template. Mix any structure with any visual style.
                </p>
              </div>
            </div>
            <LayoutShellPicker v-model="layoutId" />
          </section>

          <section v-else-if="step === 2" class="control-section">
            <div class="control-heading">
              <div>
                <p class="studio-kicker mb-1">Step 3</p>
                <h2 class="text-h6 font-weight-bold mb-1">Colors and typography</h2>
                <p class="text-caption text-medium-emphasis mb-0">
                  Use a curated pairing or create a palette that is completely yours.
                </p>
              </div>
            </div>

            <div>
              <p class="text-subtitle-2 font-weight-bold mb-3">Color palette</p>
              <AccentColorPicker
                :accent-color="accentColor"
                :accent-color-secondary="accentColorSecondary"
                @select="(colors) => {
                  accentColor = colors.accentColor
                  accentColorSecondary = colors.accentColorSecondary
                }"
              />
              <div class="surface-colors mt-3">
                <label>
                  <input v-model="accentSoft" type="color" aria-label="Page background color">
                  <span>
                    <strong>Page</strong>
                    <small>{{ accentSoft.toUpperCase() }}</small>
                  </span>
                </label>
                <label>
                  <input v-model="ink" type="color" aria-label="Text color">
                  <span>
                    <strong>Text</strong>
                    <small>{{ ink.toUpperCase() }}</small>
                  </span>
                </label>
              </div>
            </div>

            <v-divider />

            <div>
              <p class="text-subtitle-2 font-weight-bold mb-1">Font pairing</p>
              <p class="text-caption text-medium-emphasis mb-3">
                Each option pairs an expressive heading with a readable body font.
              </p>
              <FontPairPicker v-model="fontPairId" />
            </div>
          </section>

          <section v-else-if="step === 3" class="control-section">
            <div class="control-heading">
              <div>
                <p class="studio-kicker mb-1">Step 4</p>
                <h2 class="text-h6 font-weight-bold mb-1">Decoration and rhythm</h2>
                <p class="text-caption text-medium-emphasis mb-0">
                  Add cultural detail, breathing room, and subtle motion without changing your content.
                </p>
              </div>
            </div>

            <div>
              <p class="text-subtitle-2 font-weight-bold mb-1">Decorative motif</p>
              <p class="text-caption text-medium-emphasis mb-3">
                Choose a divider and visual signature for the invitation.
              </p>
              <MotifPicker v-model="motifId" :accent-color="accentColor" />
            </div>

            <v-divider />

            <CreativeOptionsPicker
              :density="density"
              :effect-id="effectId"
              @update:density="density = $event"
              @update:effect-id="effectId = $event"
            />
          </section>

          <section v-else-if="step === 4" class="control-section">
            <div class="control-heading">
              <div>
                <p class="studio-kicker mb-1">Step 5</p>
                <h2 class="text-h6 font-weight-bold mb-1">Add your photos</h2>
                <p class="text-caption text-medium-emphasis mb-0">
                  Photos are optional. The design still looks finished without them.
                </p>
              </div>
            </div>

            <div class="media-control">
              <div class="media-control__icon">
                <v-icon icon="solar:gallery-wide-linear" color="primary" />
              </div>
              <div>
                <p class="text-subtitle-2 font-weight-bold mb-1">Hero photo</p>
                <p class="text-caption text-medium-emphasis mb-3">
                  The main photograph at the beginning of the invitation.
                </p>
                <PhotoUrlInput v-model="heroPhoto" label="Hero photo link" />
              </div>
            </div>

            <v-divider />

            <div class="media-control">
              <div class="media-control__icon">
                <v-icon icon="solar:wallpaper-linear" color="primary" />
              </div>
              <div>
                <p class="text-subtitle-2 font-weight-bold mb-1">Page background</p>
                <p class="text-caption text-medium-emphasis mb-3">
                  Place a subtle photograph behind the whole invitation.
                </p>
                <PhotoUrlInput v-model="backgroundImageUrl" label="Background photo link" />

                <div v-if="backgroundImageUrl" class="mt-4">
                  <div class="d-flex align-center justify-space-between">
                    <p class="text-caption font-weight-bold mb-0">Readability overlay</p>
                    <span class="text-caption text-medium-emphasis">
                      {{ Math.round(backgroundOverlayOpacity * 100) }}%
                    </span>
                  </div>
                  <v-slider
                    v-model="backgroundOverlayOpacity"
                    :min="0.2"
                    :max="0.95"
                    :step="0.05"
                    color="primary"
                    hide-details
                    aria-label="Background readability overlay"
                  />
                  <p class="text-caption text-medium-emphasis mb-0">
                    Increase this when text needs more contrast over the photo.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section v-else class="control-section">
            <div class="control-heading">
              <div>
                <p class="studio-kicker mb-1">Step 6</p>
                <h2 class="text-h6 font-weight-bold mb-1">Your design is ready</h2>
                <p class="text-caption text-medium-emphasis mb-0">
                  Review the creative choices below. Names, dates, venue, schedule, gallery, and wording come next.
                </p>
              </div>
            </div>

            <div class="review-grid">
              <button type="button" class="review-card" @click="goToStep(0)">
                <v-icon icon="solar:gallery-wide-linear" color="primary" />
                <span>
                  <small>Starting design</small>
                  <strong>{{ selectedTemplate?.name }}</strong>
                </span>
                <v-icon icon="solar:pen-2-linear" size="17" />
              </button>
              <button type="button" class="review-card" @click="goToStep(1)">
                <v-icon icon="solar:widget-5-linear" color="primary" />
                <span>
                  <small>Layout</small>
                  <strong>{{ LAYOUT_LABELS[layoutId] }}</strong>
                </span>
                <v-icon icon="solar:pen-2-linear" size="17" />
              </button>
              <button type="button" class="review-card" @click="goToStep(2)">
                <span class="review-swatches" aria-hidden="true">
                  <i :style="{ background: accentColor }" />
                  <i :style="{ background: accentColorSecondary }" />
                </span>
                <span>
                  <small>Palette & type</small>
                  <strong>{{ fontPairId }}</strong>
                </span>
                <v-icon icon="solar:pen-2-linear" size="17" />
              </button>
              <button type="button" class="review-card" @click="goToStep(3)">
                <v-icon icon="solar:magic-stick-3-linear" color="primary" />
                <span>
                  <small>Creative details</small>
                  <strong>{{ motifId }} · {{ density }}</strong>
                </span>
                <v-icon icon="solar:pen-2-linear" size="17" />
              </button>
              <button type="button" class="review-card" @click="goToStep(4)">
                <v-icon icon="solar:gallery-add-linear" color="primary" />
                <span>
                  <small>Photos</small>
                  <strong>{{ heroPhoto || backgroundImageUrl ? 'Added' : 'None yet' }}</strong>
                </span>
                <v-icon icon="solar:pen-2-linear" size="17" />
              </button>
            </div>

            <v-alert
              color="primary"
              variant="tonal"
              icon="solar:magic-stick-3-bold"
              title="Nothing is locked"
              text="You can keep changing the template, layout, colors, photos, and every invitation detail in the editor."
            />
          </section>
            </div>
          </Transition>
        </div>

        <div class="studio-controls__footer">
          <v-btn
            variant="text"
            prepend-icon="solar:alt-arrow-left-linear"
            :disabled="step === 0"
            @click="back"
          >
            Back
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="bg-primary"
            :class="{ 'attention-cta': isLastStep }"
            :prepend-icon="isLastStep ? 'solar:magic-stick-3-bold' : undefined"
            :append-icon="isLastStep ? undefined : 'solar:alt-arrow-right-linear'"
            :disabled="!canContinue"
            @click="next"
          >
            {{ nextLabel }}
          </v-btn>
        </div>
      </aside>

      <section class="studio-preview glass-surface" aria-label="Invitation preview">
        <div class="studio-preview__toolbar">
          <div class="min-w-0">
            <p class="text-caption text-medium-emphasis mb-0">Live preview</p>
            <p class="text-subtitle-2 font-weight-bold text-truncate mb-0">
              {{ selectedTemplate?.name ?? 'Choose a starting design' }}
            </p>
          </div>

          <div class="preview-actions">
            <v-btn-toggle
              v-model="previewDevice"
              mandatory
              density="compact"
              color="primary"
              variant="tonal"
              class="gap-2"
              aria-label="Preview width"
            >
              <v-btn value="phone" icon="solar:smartphone-linear" aria-label="Phone preview" />
              <v-btn value="wide" icon="solar:laptop-2-linear" aria-label="Wide preview" />
            </v-btn-toggle>
            <v-btn
              v-if="selectedTemplate"
              icon="solar:restart-linear"
              variant="text"
              size="small"
              aria-label="Reset styles to the selected template"
              title="Reset styles to template"
              @click="resetToTemplate"
            />
            <v-btn
              v-if="previewInvite"
              :prepend-icon="focusMode ? 'solar:close-circle-linear' : 'solar:eye-bold'"
              variant="tonal"
              size="small"
              :aria-label="focusMode ? 'Exit full-screen preview' : 'Open full-screen preview'"
              @click="toggleFocusMode"
            >
              {{ focusMode ? 'Exit' : 'Focus' }}
            </v-btn>
          </div>
        </div>

        <div ref="previewScroll" class="studio-preview__canvas studio-scroll-area">
          <div
            v-if="previewInvite"
            class="preview-surface"
            :class="`preview-surface--${previewDevice}`"
          >
            <TemplateRenderer :invite="previewInvite" />
          </div>
          <div v-else class="preview-empty">
            <span class="preview-empty__art" aria-hidden="true">
              <i /><i /><i />
            </span>
            <p class="text-h6 font-weight-bold mb-1">Your canvas is ready</p>
            <p class="text-body-2 text-medium-emphasis text-center mb-4">
              Choose any of the {{ TEMPLATES.length }} starting designs to begin. It will preview here before you continue.
            </p>
            <v-chip color="primary" variant="tonal" prepend-icon="solar:eye-linear">
              Every change updates live
            </v-chip>
          </div>
        </div>
      </section>
    </div>
  </v-container>
</template>

<style scoped>
.creative-studio {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: none;
  height: calc(100dvh - 4.5rem);
  padding: clamp(0.65rem, 1.4vw, 1rem);
  overflow: hidden;
}
.studio-heading {
  display: flex;
  flex: 0 0 auto;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.studio-kicker {
  color: rgb(var(--v-theme-primary));
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.studio-steps {
  display: grid;
  flex: 0 0 auto;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}
.studio-step {
  position: relative;
  isolation: isolate;
  display: flex;
  gap: 0.45rem;
  align-items: center;
  min-width: 0;
  padding: 0.55rem 0.65rem;
  overflow: hidden;
  color: rgb(var(--v-theme-on-surface) / 58%);
  font-size: 0.72rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  background: var(--flat-glass-bg);
  border: 0.0625rem solid var(--flat-glass-border);
  border-radius: var(--radius-lg);
  transition:
    color 0.24s var(--motion-ease-out),
    border-color 0.24s var(--motion-ease-out),
    background-color 0.24s var(--motion-ease-out),
    box-shadow 0.24s var(--motion-ease-out),
    transform 0.24s var(--motion-ease-out);
}
.studio-step::before {
  position: absolute;
  z-index: 0;
  content: '';
  inset: -0.0625rem;
  pointer-events: none;
  background: var(--app-gradient);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.28s var(--motion-ease-out);
}
.studio-step > span {
  position: relative;
  z-index: 1;
}
.studio-step:hover:not(:disabled):not(.studio-step--active) {
  color: rgb(var(--v-theme-primary));
  background: var(--flat-glass-bg-hover);
  border-color: rgb(var(--v-theme-primary) / 28%);
  box-shadow: 0 0.35rem 0.9rem rgb(var(--v-theme-primary) / 8%);
  transform: translateY(-0.0625rem);
}
.studio-step--active {
  color: white;
  background: transparent;
  border-color: transparent;
  box-shadow: 0 0.45rem 1rem rgb(var(--v-theme-primary) / 18%);
}
.studio-step--active::before {
  opacity: 1;
}
.studio-step--active:hover:not(:disabled) {
  box-shadow: 0 0.6rem 1.15rem rgb(var(--v-theme-primary) / 24%);
  transform: translateY(-0.0625rem);
}
.studio-step--complete { color: rgb(var(--v-theme-primary)); }
.studio-step:disabled { cursor: not-allowed; opacity: 0.42; }
.studio-step__number {
  display: grid;
  flex: 0 0 auto;
  width: 1.35rem;
  height: 1.35rem;
  place-items: center;
  font-size: 0.65rem;
  background: rgb(var(--v-theme-primary) / 10%);
  border-radius: 50%;
  transition:
    background-color 0.24s var(--motion-ease-out),
    transform 0.24s var(--motion-ease-out);
}
.studio-step--active .studio-step__number {
  background: rgb(255 255 255 / 20%);
  transform: scale(1.06);
}

.studio-panel-enter-active,
.studio-panel-leave-active {
  transition:
    opacity 0.16s var(--motion-ease-out),
    transform 0.2s var(--motion-ease-out);
}
.studio-panel-enter-from {
  opacity: 0;
  transform: translateY(0.4rem);
}
.studio-panel-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

.mobile-pane-switch {
  display: none;
  flex: 0 0 auto;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.25rem;
  padding: 0.25rem;
  margin-bottom: 0.65rem;
  background: var(--flat-glass-bg);
  border: 0.0625rem solid var(--flat-glass-border);
  border-radius: var(--radius-lg);
}
.mobile-pane-switch button {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;
  padding: 0.55rem;
  color: inherit;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  border-radius: calc(var(--radius-lg) - 0.25rem);
}
.mobile-pane-switch__button--active {
  color: white !important;
  background: var(--app-gradient);
}

.studio-grid {
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: minmax(23rem, 29rem) minmax(0, 1fr);
  gap: 1rem;
  align-items: stretch;
  min-height: 0;
}
.studio-controls,
.studio-preview {
  min-height: 0;
  overflow: hidden;
}
.studio-controls {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.studio-controls__scroll {
  flex: 1 1 auto;
  min-height: 0;
  padding: 1.25rem;
}
.studio-scroll-area {
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-color: var(--scrollbar-handle) transparent;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}
.studio-scroll-area::-webkit-scrollbar {
  width: 0.7rem;
  height: 0.7rem;
}
.studio-scroll-area::-webkit-scrollbar-track {
  background: transparent;
}
.studio-scroll-area::-webkit-scrollbar-thumb {
  background: var(--scrollbar-handle);
  background-clip: padding-box;
  border: 0.18rem solid transparent;
  border-radius: 999px;
}
.studio-scroll-area::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-handle-hover);
}
.studio-controls__footer {
  display: flex;
  flex: 0 0 auto;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  background: var(--glass-bg-strong);
  border-top: 0.0625rem solid var(--flat-glass-border);
}
.control-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.control-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.template-filters {
  display: flex;
  gap: 0.4rem;
  padding: 0.25rem;
  background: var(--flat-glass-bg);
  border: 0.0625rem solid var(--flat-glass-border);
  border-radius: var(--radius-lg);
}
.filter-pill {
  flex: 1;
  padding: 0.45rem 0.65rem;
  color: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: calc(var(--radius-lg) - 0.25rem);
}
.filter-pill--active {
  color: white;
  background: var(--app-gradient);
}

.template-picker-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.template-choice {
  display: grid;
  grid-template-columns: 4.25rem minmax(0, 1fr) auto;
  gap: 0.8rem;
  align-items: center;
  width: 100%;
  padding: 0.65rem;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: var(--flat-glass-bg);
  border: 0.125rem solid var(--flat-glass-border);
  border-radius: var(--radius-lg);
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}
.template-choice:hover {
  background: var(--flat-glass-bg-hover);
  transform: translateY(-0.125rem);
}
.template-choice--active {
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 7%, var(--flat-glass-bg));
  border-color: rgb(var(--v-theme-primary));
}
.template-choice__swatch {
  display: grid;
  width: 4.25rem;
  height: 5rem;
  place-items: center;
  color: white;
  border-radius: 0.75rem;
  box-shadow: inset 0 0 0 0.0625rem rgb(255 255 255 / 26%);
}
.template-choice__swatch i {
  font-family: serif;
  font-size: 1.5rem;
  font-style: normal;
  opacity: 0.78;
}
.template-choice__content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.template-choice__title {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  justify-content: space-between;
}
.template-choice__title strong {
  overflow: hidden;
  font-size: 0.78rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.template-choice__content > small {
  display: -webkit-box;
  margin-top: 0.2rem;
  overflow: hidden;
  font-size: 0.65rem;
  line-height: 1.35;
  opacity: 0.62;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.template-choice__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.45rem;
}
.template-choice__tags i {
  padding: 0.15rem 0.35rem;
  font-size: 0.55rem;
  font-style: normal;
  background: rgb(var(--v-theme-primary) / 8%);
  border-radius: 999px;
  opacity: 0.74;
}
.empty-picker {
  padding: 2.5rem 1rem;
  text-align: center;
  background: var(--flat-glass-bg);
  border: 0.0625rem dashed var(--flat-glass-border);
  border-radius: var(--radius-lg);
}

.surface-colors {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}
.surface-colors label {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  background: var(--flat-glass-bg);
  border: 0.0625rem solid var(--flat-glass-border);
  border-radius: var(--radius-lg);
}
.surface-colors input {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.15rem;
  cursor: pointer;
  background: transparent;
  border: 0;
}
.surface-colors span {
  display: flex;
  flex-direction: column;
}
.surface-colors strong { font-size: 0.78rem; }
.surface-colors small { font-size: 0.65rem; opacity: 0.62; }

.media-control {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  gap: 0.9rem;
}
.media-control__icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  background: rgb(var(--v-theme-primary) / 9%);
  border-radius: var(--radius-lg);
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
}
.review-card {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) auto;
  gap: 0.6rem;
  align-items: center;
  min-width: 0;
  padding: 0.8rem;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: var(--flat-glass-bg);
  border: 0.0625rem solid var(--flat-glass-border);
  border-radius: var(--radius-lg);
}
.review-card:hover { background: var(--flat-glass-bg-hover); }
.review-card span:not(.review-swatches) {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.review-card small { font-size: 0.62rem; opacity: 0.58; }
.review-card strong {
  overflow: hidden;
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.review-swatches { display: flex; }
.review-swatches i {
  width: 1.35rem;
  height: 1.35rem;
  border: 0.125rem solid rgb(var(--v-theme-surface));
  border-radius: 50%;
}
.review-swatches i + i { margin-left: -0.55rem; }

.studio-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.studio-preview__toolbar {
  display: flex;
  flex: 0 0 auto;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  background: var(--glass-bg-strong);
  border-bottom: 0.0625rem solid var(--flat-glass-border);
}
.preview-actions {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}
.preview-actions :deep(.v-btn-toggle .v-btn) {
  min-width: 2.25rem;
  width: 2.25rem;
  height: 2.25rem;
}
.studio-preview__canvas {
  display: flex;
  flex: 1 1 auto;
  align-items: flex-start;
  justify-content: center;
  min-height: 0;
  padding: clamp(0.75rem, 2vw, 1.5rem);
  background-image:
    linear-gradient(rgb(var(--v-theme-on-surface) / 3%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--v-theme-on-surface) / 3%) 1px, transparent 1px);
  background-size: 1.25rem 1.25rem;
}
.preview-surface {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background: white;
  border: 0.0625rem solid rgb(var(--v-theme-on-surface) / 10%);
  border-radius: 1.25rem;
  box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 16%);
  transition: max-width 0.3s var(--motion-ease-out);
}
.preview-surface--phone { max-width: 25rem; }
.preview-surface--wide { max-width: 48rem; }
.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  max-width: 28rem;
}
.preview-empty__art {
  position: relative;
  display: block;
  width: 10rem;
  height: 8rem;
  margin-bottom: 1.25rem;
}
.preview-empty__art i {
  position: absolute;
  display: block;
  width: 5.5rem;
  height: 7rem;
  background: linear-gradient(145deg, rgb(var(--v-theme-primary) / 18%), rgb(var(--v-theme-secondary) / 20%));
  border: 0.0625rem solid rgb(var(--v-theme-primary) / 18%);
  border-radius: 0.8rem;
  box-shadow: 0 0.75rem 1.5rem rgb(var(--v-theme-primary) / 10%);
}
.preview-empty__art i:first-child { left: 0; bottom: 0; transform: rotate(-8deg); }
.preview-empty__art i:nth-child(2) { right: 0; bottom: 0; transform: rotate(8deg); }
.preview-empty__art i:nth-child(3) {
  left: 50%;
  bottom: 0.5rem;
  background: var(--app-gradient);
  transform: translateX(-50%);
}

.creative-studio--focus {
  position: fixed;
  inset: 0;
  z-index: 1200;
  height: 100dvh;
  padding: 0.65rem;
  background: var(--app-background);
}
.creative-studio--focus .studio-heading,
.creative-studio--focus .studio-steps,
.creative-studio--focus .mobile-pane-switch,
.creative-studio--focus .studio-controls {
  display: none;
}
.creative-studio--focus .studio-grid {
  grid-template-columns: 1fr;
  height: 100%;
}
.creative-studio--focus .studio-preview {
  display: flex;
  height: 100%;
}
.creative-studio--focus .preview-surface--wide {
  max-width: 70rem;
}

@media (max-width: 79.99rem) {
  .creative-studio {
    height: calc(100dvh - 9.75rem);
  }
  .creative-studio--focus {
    height: 100dvh;
  }
  .studio-grid { grid-template-columns: minmax(21rem, 25rem) minmax(0, 1fr); }
  .studio-step { justify-content: center; }
  .studio-step > span:last-child { display: none; }
  .review-grid { grid-template-columns: 1fr; }
}

@media (max-width: 59.95rem) {
  .creative-studio {
    padding: 0.65rem;
  }
  .studio-heading {
    align-items: center;
    margin-bottom: 0.55rem;
  }
  .studio-heading h1 {
    font-size: 1.35rem;
  }
  .studio-heading .text-body-2 {
    display: none;
  }
  .studio-heading > .v-chip {
    display: none;
  }
  .studio-steps {
    margin-bottom: 0.55rem;
  }
  .mobile-pane-switch {
    display: grid;
  }
  .studio-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .studio-controls,
  .studio-preview {
    height: 100%;
  }
  .studio-grid--design .studio-preview {
    display: none;
  }
  .studio-grid--preview .studio-controls {
    display: none;
  }
  .studio-preview__canvas {
    min-height: 0;
  }
  .studio-step > span:last-child { display: inline; }
  .creative-studio--focus {
    height: 100dvh;
    padding: 0.45rem;
  }
}

@media (max-width: 37.5rem) {
  .studio-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .studio-steps {
    display: flex;
    padding-bottom: 0.25rem;
    overflow-x: auto;
  }
  .studio-step {
    flex: 0 0 auto;
    justify-content: flex-start;
    min-width: 5.6rem;
  }
  .studio-step > span:last-child { display: inline; }
  .studio-controls__scroll { padding: 1rem; }
  .studio-controls__footer { padding: 0.65rem 0.75rem; }
  .studio-controls__footer :deep(.v-btn) { padding-inline: 0.7rem; }
  .template-choice {
    grid-template-columns: 3.5rem minmax(0, 1fr) auto;
  }
  .template-choice__swatch {
    width: 3.5rem;
    height: 4.35rem;
  }
  .surface-colors,
  .review-grid { grid-template-columns: 1fr; }
  .studio-preview__toolbar {
    align-items: flex-start;
    padding: 0.55rem 0.7rem;
  }
  .preview-actions :deep(.v-btn-toggle) { display: none; }
  .preview-actions :deep(.v-btn) { min-width: auto; }
}
</style>

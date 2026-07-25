<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { TEMPLATES } from '~/templates'
import { createSampleInvite, type SampleLanguage } from '~/templates/sampleData'
import { useInviteListStore } from '~/stores/inviteList'
import { useAppI18n } from '~/composables/useAppI18n'
import TemplateRenderer from '~/components/invite/TemplateRenderer.vue'
import LazyMount from '~/components/preview/LazyMount.vue'
import PreviewStage from '~/components/preview/PreviewStage.vue'
import CategoryFilterBar from '~/components/gallery/CategoryFilterBar.vue'
import type { InviteCategory, InviteStyleTag } from '~/types/template'

const { t } = useAppI18n()
const router = useRouter()
const inviteListStore = useInviteListStore()

const category = ref<InviteCategory | 'all'>('all')
const selectedTags = ref<InviteStyleTag[]>([])

const availableTags = computed<InviteStyleTag[]>(() => {
  const pool = category.value === 'all' ? TEMPLATES : TEMPLATES.filter((tpl) => tpl.category === category.value)
  return [...new Set(pool.flatMap((tpl) => tpl.tags))]
})

const filtered = computed(() => TEMPLATES.filter((tpl) => {
  if (category.value !== 'all' && tpl.category !== category.value) return false
  if (selectedTags.value.length === 0) return true
  return tpl.tags.some((tag) => selectedTags.value.includes(tag))
}))

// Every template can be previewed and started in either language,
// independent of its own category -- a Khmer-heritage template isn't
// locked to Khmer content, and vice versa. Each card remembers its own
// choice, defaulting to the template's category.
const cardLanguage = ref<Record<string, SampleLanguage>>(
  Object.fromEntries(TEMPLATES.map((tpl) => [tpl.id, tpl.category === 'khmer' ? 'km' : 'en'])),
)

function setCardLanguage(templateId: string, language: SampleLanguage) {
  cardLanguage.value = { ...cardLanguage.value, [templateId]: language }
}

const samples = computed(() => Object.fromEntries(
  TEMPLATES.map((tpl) => [tpl.id, createSampleInvite(tpl.id, cardLanguage.value[tpl.id])]),
))

function useTemplate(templateId: string) {
  const invite = inviteListStore.createInvite(templateId, cardLanguage.value[templateId])
  router.push(`/editor/${invite.id}`)
}
</script>

<template>
  <v-container class="py-8">
    <div class="mb-2">
      <h1 class="text-h4 font-weight-bold mb-2">{{ t('nav.templates') }}</h1>
      <p class="text-body-1 text-medium-emphasis" style="max-width: 40rem">
        Explore {{ TEMPLATES.length }} original Khmer and international wedding invitation templates — from
        cinematic love stories to playful keepsake albums. Every design works in either language.
      </p>
    </div>

    <div class="mb-6">
      <CategoryFilterBar
        :category="category"
        :tags="selectedTags"
        :available-tags="availableTags"
        @update:category="(value) => { category = value; selectedTags = [] }"
        @update:tags="(value) => (selectedTags = value)"
      />
    </div>

    <div class="template-masonry">
      <div v-for="template in filtered" :key="template.id" class="template-masonry-item">
        <v-card
          class="template-card invite-card-interactive"
          role="button"
          tabindex="0"
          @click="useTemplate(template.id)"
          @keydown.enter="useTemplate(template.id)"
          @keydown.space.prevent="useTemplate(template.id)"
        >
          <div class="template-thumbnail">
            <LazyMount>
              <PreviewStage>
                <TemplateRenderer :invite="samples[template.id]" />
              </PreviewStage>
            </LazyMount>
          </div>
          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-1 ga-2">
              <span class="text-subtitle-1 font-weight-bold">{{ template.name }}</span>
              <span class="d-flex align-center ga-1 flex-shrink-0">
                <v-chip
                  v-if="template.badge"
                  size="x-small"
                  color="primary"
                  variant="flat"
                  class="text-capitalize"
                >
                  {{ template.badge }}
                </v-chip>
                <v-chip size="x-small" variant="tonal" class="invite-tag-chip">{{ template.category }}</v-chip>
              </span>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-3">{{ template.description }}</p>

            <div class="lang-toggle">
              <button
                type="button"
                class="lang-toggle__btn"
                :class="{ 'lang-toggle__btn--active': cardLanguage[template.id] === 'km' }"
                @click.stop="setCardLanguage(template.id, 'km')"
              >
                ខ្មែរ
              </button>
              <button
                type="button"
                class="lang-toggle__btn"
                :class="{ 'lang-toggle__btn--active': cardLanguage[template.id] === 'en' }"
                @click.stop="setCardLanguage(template.id, 'en')"
              >
                English
              </button>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <p v-if="filtered.length === 0" class="text-body-2 text-medium-emphasis text-center py-12">
      No templates match those filters yet.
    </p>
  </v-container>
</template>

<style scoped>
.lang-toggle {
  display: inline-flex;
  padding: 0.1875rem;
  border-radius: var(--radius-full);
  background: var(--flat-glass-bg);
  border: 0.0625rem solid var(--flat-glass-border);
}
.lang-toggle__btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: inherit;
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: background 0.15s ease, color 0.15s ease;
}
.lang-toggle__btn--active {
  background: var(--app-gradient);
  color: white;
}
</style>

import { createVuetify } from 'vuetify'
import IconifyVuetifyIcon from '~/components/IconifyVuetifyIcon.vue'

// Vuetify's own components (v-checkbox, v-select's dropdown arrow, v-alert's
// severity icon, expansion-panel chevrons, ...) reference a fixed set of
// semantic icon names ("dropdown", "checkboxOn", "error", ...) that default
// to MDI-named values baked into the framework -- overriding the icon *set*
// alone doesn't touch these, so every alias actually reachable by a
// component this app renders is remapped to its Solar equivalent here.
const solarAliases = {
  collapse: 'solar:alt-arrow-up-linear',
  expand: 'solar:alt-arrow-down-linear',
  complete: 'solar:check-circle-bold',
  cancel: 'solar:close-circle-linear',
  close: 'solar:close-circle-linear',
  delete: 'solar:trash-bin-minimalistic-linear',
  clear: 'solar:close-circle-linear',
  success: 'solar:check-circle-bold',
  info: 'solar:info-circle-linear',
  warning: 'solar:danger-triangle-linear',
  error: 'solar:close-circle-bold',
  prev: 'solar:alt-arrow-left-linear',
  next: 'solar:alt-arrow-right-linear',
  checkboxOn: 'solar:check-square-linear',
  checkboxOff: 'solar:stop-linear',
  checkboxIndeterminate: 'solar:minus-square-linear',
  delimiter: 'solar:record-circle-bold',
  sortAsc: 'solar:alt-arrow-up-linear',
  sortDesc: 'solar:alt-arrow-down-linear',
  subgroup: 'solar:alt-arrow-down-linear',
  dropdown: 'solar:alt-arrow-down-linear',
  menu: 'solar:hamburger-menu-linear',
  radioOn: 'solar:record-circle-bold',
  radioOff: 'solar:record-circle-linear',
  edit: 'solar:pen-linear',
  ratingEmpty: 'solar:star-linear',
  ratingFull: 'solar:star-bold',
  ratingHalf: 'solar:star-linear',
  loading: 'solar:refresh-linear',
  first: 'solar:alt-arrow-left-linear',
  last: 'solar:alt-arrow-right-linear',
  unfold: 'solar:sort-vertical-linear',
  file: 'solar:document-linear',
  plus: 'solar:add-circle-linear',
  minus: 'solar:minus-circle-linear',
  treeviewCollapse: 'solar:alt-arrow-down-linear',
  treeviewExpand: 'solar:alt-arrow-right-linear',
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    // Start client-side breakpoint detection from the same zero-width state
    // used during server rendering, then let Vuetify update after Nuxt has
    // hydrated. This prevents desktop/mobile branches from disagreeing.
    ssr: true,
    icons: {
      defaultSet: 'solar',
      aliases: solarAliases,
      sets: {
        solar: { component: IconifyVuetifyIcon },
      },
    },
    theme: {
      // Actual active theme is set at runtime by layouts/default.vue based on
      // stored preference / OS setting (see composables/useColorMode.ts) --
      // this is just the initial value before that JS runs.
      defaultTheme: 'tiepSnaeLight',
      themes: {
        tiepSnaeLight: {
          dark: false,
          colors: {
            // Deep rosewood anchors the brand; warm gold energizes actions
            // and decorative details -- a "wedding stationery" palette that
            // stays distinct from either template category's own colors.
            primary: '#8B2942',
            secondary: '#C98A3E',
            background: '#FFF9F6',
            surface: '#FFFFFF',
          },
        },
        tiepSnaeDark: {
          dark: true,
          colors: {
            primary: '#E8A0B4',
            secondary: '#F0C878',
            background: '#170B10',
            surface: '#241419',
          },
        },
      },
    },
    defaults: {
      // text-none: Vuetify's default uppercase button/tab text is a Material
      // Design 1-era convention that reads as dated next to most current
      // product UI -- normal case is the single biggest "modern" lever here.
      VBtn: { rounded: 'xl', class: 'text-none font-weight-medium' },
      VTab: { class: 'text-none' },
      // glass-surface provides the app's translucent card language. Large,
      // intentional glass panels retain blur; repeated surfaces such as
      // gallery cards use the faster tinted treatment defined in main.css so
      // long desktop views remain responsive.
      VCard: { rounded: 'xl', variant: 'flat', class: 'glass-surface' },
      // solo-filled + flat: a soft filled background with no border and no
      // default elevation/shadow, replacing the boxed "outlined" look on
      // every field in the app.
      VTextField: { variant: 'solo-filled', density: 'comfortable', rounded: 'xl', flat: true, hideDetails: 'auto' },
      VTextarea: { variant: 'solo-filled', density: 'comfortable', rounded: 'xl', flat: true, hideDetails: 'auto' },
      VSelect: { variant: 'solo-filled', density: 'comfortable', rounded: 'xl', flat: true, hideDetails: 'auto' },
      VCombobox: { variant: 'solo-filled', density: 'comfortable', rounded: 'xl', flat: true, hideDetails: 'auto' },
      VFileInput: { hideDetails: 'auto' },
      VCheckbox: { hideDetails: 'auto' },
      VSwitch: { hideDetails: 'auto' },
      VSlider: { hideDetails: 'auto' },
      // tonal: soft filled pill instead of an outlined ring.
      VChip: { variant: 'tonal', rounded: 'pill' },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})

import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './templates/**/*.{vue,ts}',
    './app.vue',
    './error.vue',
  ],
  // Vuetify already provides base element styling for the app chrome (scoped
  // under .v-application). Tailwind's preflight reset would strip those
  // defaults, so it's disabled here; Tailwind is used purely for utility
  // classes inside the invitation render tree, which never mounts inside
  // <v-app> -- see components/invite/TemplateRenderer.vue.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        robotoSlab: ['"Roboto Slab"', 'serif'],
        lora: ['Lora', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        plexSans: ['"IBM Plex Sans"', 'sans-serif'],
        moul: ['Moul', 'serif'],
        bayon: ['Bayon', 'serif'],
        dancingScript: ['"Dancing Script"', 'cursive'],
        notoSansKhmer: ['"Noto Sans Khmer"', 'sans-serif'],
      },
      colors: {
        accent: 'var(--invite-accent)',
        'accent-soft': 'var(--invite-accent-soft)',
        'accent-secondary': 'var(--invite-accent-secondary)',
        ink: 'var(--invite-ink)',
        muted: 'var(--invite-muted)',
      },
    },
  },
  plugins: [],
}

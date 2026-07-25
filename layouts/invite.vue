<script setup lang="ts">
// Chrome-free layout for the shared, read-only invitation page
// (pages/i/[inviteId].vue) -- deliberately never wraps the invitation render
// tree in <v-app>, since it uses Tailwind, not Vuetify (see
// components/invite/TemplateRenderer.vue).
</script>

<template>
  <slot />
</template>

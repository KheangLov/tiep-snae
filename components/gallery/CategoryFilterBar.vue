<script setup lang="ts">
import type { InviteCategory, InviteStyleTag } from '~/types/template'

defineProps<{
  category: InviteCategory | 'all'
  tags: InviteStyleTag[]
  availableTags: InviteStyleTag[]
}>()

const emit = defineEmits<{
  'update:category': [InviteCategory | 'all']
  'update:tags': [InviteStyleTag[]]
}>()
</script>

<template>
  <div>
    <v-chip-group
      :model-value="category"
      mandatory
      class="mb-1"
      @update:model-value="(value: InviteCategory | 'all') => emit('update:category', value)"
    >
      <v-chip value="all" variant="tonal" class="invite-tag-chip">All</v-chip>
      <v-chip value="khmer" variant="tonal" class="invite-tag-chip">Khmer</v-chip>
      <v-chip value="international" variant="tonal" class="invite-tag-chip">International</v-chip>
    </v-chip-group>
    <v-chip-group
      v-if="availableTags.length"
      :model-value="tags"
      multiple
      column
      @update:model-value="(value: InviteStyleTag[]) => emit('update:tags', value)"
    >
      <v-chip
        v-for="tag in availableTags"
        :key="tag"
        :value="tag"
        size="small"
        variant="outlined"
        class="invite-tag-chip"
      >
        {{ tag }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

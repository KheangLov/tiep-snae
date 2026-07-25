<script setup lang="ts">
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'

// The invitation render tree (components/invite/TemplateRenderer.vue) is a
// fluid, full-width scrolling page, not a fixed-size document -- so instead
// of "shrink a fixed page to fit," this stage renders the invitation at a
// fixed reference width (contentWidth) and scales that whole box down to
// fit whatever container it's placed in (a gallery thumbnail). The parent
// thumbnail box supplies its own `overflow: hidden` + max-height (see
// assets/css/main.css's `.template-thumbnail`) to crop the scaled-down
// page to a preview-sized card rather than showing the entire scroll length.
const props = withDefaults(defineProps<{ contentWidth?: number }>(), { contentWidth: 640 })

const container = ref<HTMLElement | null>(null)
const { width } = useElementSize(container)
</script>

<template>
  <div ref="container" class="preview-stage">
    <div
      class="preview-stage__content"
      :style="{ width: `${contentWidth}px`, transform: `scale(${width ? width / contentWidth : 1})` }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.preview-stage {
  width: 100%;
  overflow: hidden;
  pointer-events: none;
}
.preview-stage__content {
  transform-origin: top left;
}
</style>

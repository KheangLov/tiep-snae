<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ variant: 'leaves' | 'hearts' }>()

const PARTICLE_COUNT = 12

interface Particle {
  left: number
  delay: number
  duration: number
  size: number
  drift: number
  rotateStart: number
  opacity: number
}

// A fixed, deterministic spread computed once (not Math.random() on every
// render) -- looks organic without ever recomputing. Twelve particles, pure
// CSS transform/opacity keyframes, no JS animation loop: cheap enough to
// run continuously for as long as a guest has the invitation open.
const particles = computed<Particle[]>(() => {
  const list: Particle[] = []
  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const seed = i / PARTICLE_COUNT
    list.push({
      left: (seed * 97) % 100,
      delay: (seed * 130) % 8,
      duration: 9 + ((seed * 310) % 6),
      size: 0.9 + ((seed * 70) % 10) / 10,
      drift: ((seed * 530) % 40) - 20,
      rotateStart: (seed * 360) % 360,
      opacity: 0.5 + ((seed * 170) % 35) / 100,
    })
  }
  return list
})
</script>

<template>
  <div class="falling-particles" aria-hidden="true">
    <span
      v-for="(particle, index) in particles"
      :key="index"
      class="falling-particle"
      :style="{
        left: `${particle.left}%`,
        animationDelay: `${particle.delay}s`,
        animationDuration: `${particle.duration}s`,
        opacity: particle.opacity,
        '--drift': `${particle.drift}px`,
        '--rotate-start': `${particle.rotateStart}deg`,
      }"
    >
      <svg
        v-if="variant === 'leaves'"
        viewBox="0 0 24 24"
        fill="currentColor"
        :style="{ width: `${particle.size}rem`, height: `${particle.size}rem` }"
      >
        <path d="M12 2C7 2 3 7 3 12c0 5 4 9 9 10 1-5 1-10 0-15-1 3-3 5-6 6 2-6 7-10 12-11-1 5-3 9-6 11 1-5 1-10 0-15Z" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="currentColor"
        :style="{ width: `${particle.size}rem`, height: `${particle.size}rem` }"
      >
        <path d="M12 21s-7.5-4.6-10.2-9.3C.3 8.8 1.7 5 5.4 4.2c2-.4 4 .4 5.1 2.1a5.7 5.7 0 0 1 1.5-1.6c1.8-1.3 4.4-1.1 6 .5 1.9 1.9 1.9 5 0 7.3C15.5 16.4 12 21 12 21Z" />
      </svg>
    </span>
  </div>
</template>

<style scoped>
.falling-particles {
  position: fixed;
  inset: 0;
  z-index: 5;
  overflow: hidden;
  pointer-events: none;
}
.falling-particle {
  position: absolute;
  top: -2.5rem;
  color: var(--invite-accent);
  animation-name: particle-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform, opacity;
}

@keyframes particle-fall {
  0% {
    transform: translateY(-5vh) translateX(0) rotate(var(--rotate-start));
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(105vh) translateX(var(--drift)) rotate(calc(var(--rotate-start) + 180deg));
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .falling-particles {
    display: none;
  }
}
</style>

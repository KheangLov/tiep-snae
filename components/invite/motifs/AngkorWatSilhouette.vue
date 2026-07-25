<script setup lang="ts">
// A stylized front-elevation silhouette of the Angkor Wat quincunx towers
// on their stepped terrace -- five tapering, tiered towers (center
// tallest, symmetric outward), each topped with a lotus-bud finial. Built
// from stacked <rect>/<polygon> primitives rather than hand-drawn paths so
// the proportions stay easy to re-tune, and rendered as a single flat
// `currentColor` fill (not line art) since a filled skyline silhouette
// reads as recognizably "Angkor Wat" at a glance -- the whole point of this
// motif -- in a way a thin outline wouldn't.
</script>

<template>
  <svg viewBox="0 0 400 90" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- stepped terrace -->
    <rect x="5" y="75" width="390" height="10" rx="1" />
    <rect x="25" y="66" width="350" height="9" rx="1" />
    <rect x="50" y="58" width="300" height="8" rx="1" />

    <!-- outer-left tower (h=34) -->
    <g transform="translate(85,58)">
      <rect x="-16" y="-14" width="32" height="14" />
      <rect x="-11" y="-24" width="22" height="10" />
      <rect x="-6.5" y="-31" width="13" height="7" />
      <polygon points="0,-40 -4.5,-31 4.5,-31" />
    </g>

    <!-- inner-left tower (h=46) -->
    <g transform="translate(150,58)">
      <rect x="-18" y="-18" width="36" height="18" />
      <rect x="-12.5" y="-30" width="25" height="12" />
      <rect x="-7.5" y="-39" width="15" height="9" />
      <polygon points="0,-50 -5,-39 5,-39" />
    </g>

    <!-- central tower (h=56, tallest) -->
    <g transform="translate(200,58)">
      <rect x="-20" y="-22" width="40" height="22" />
      <rect x="-14" y="-37" width="28" height="15" />
      <rect x="-8.5" y="-48" width="17" height="11" />
      <polygon points="0,-56 -6,-48 6,-48" />
    </g>

    <!-- inner-right tower (h=46) -->
    <g transform="translate(250,58)">
      <rect x="-18" y="-18" width="36" height="18" />
      <rect x="-12.5" y="-30" width="25" height="12" />
      <rect x="-7.5" y="-39" width="15" height="9" />
      <polygon points="0,-50 -5,-39 5,-39" />
    </g>

    <!-- outer-right tower (h=34) -->
    <g transform="translate(315,58)">
      <rect x="-16" y="-14" width="32" height="14" />
      <rect x="-11" y="-24" width="22" height="10" />
      <rect x="-6.5" y="-31" width="13" height="7" />
      <polygon points="0,-40 -4.5,-31 4.5,-31" />
    </g>
  </svg>
</template>

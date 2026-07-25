<script setup lang="ts">
function retryConnection() {
  window.location.reload()
}

useSeoMeta({
  title: 'ក្រៅបណ្ដាញ — ធៀបស្នេហ៍',
  description: 'ធៀបស្នេហ៍អាចបន្តប្រើការរចនាដែលបានរក្សាទុកនៅពេលគ្មានអ៊ីនធឺណិត។',
  robots: 'noindex',
})
</script>

<template>
  <v-container class="offline-page">
    <v-card class="offline-card pa-6 pa-sm-10 text-center">
      <span class="offline-card__icon mb-5" aria-hidden="true">
        <v-icon icon="solar:cloud-cross-linear" size="42" color="primary" />
      </span>
      <p class="offline-kicker mb-2">ធៀបស្នេហ៍</p>
      <h1 class="text-h4 font-weight-bold mb-3">អ្នកកំពុងនៅក្រៅបណ្ដាញ</h1>
      <p class="text-body-1 text-medium-emphasis mx-auto mb-6" style="max-width: 32rem">
        អ្នកនៅតែអាចបើកការរចនា និងទំព័រដែលបានប្រើពីមុន។ សូមភ្ជាប់អ៊ីនធឺណិត
        ដើម្បីបើកទំព័រថ្មី ឬផ្ទុករូបភាពដែលមិនទាន់បានរក្សាទុក។
      </p>
      <div class="d-flex flex-wrap justify-center ga-3">
        <v-btn color="primary" variant="flat" prepend-icon="solar:refresh-linear" @click="retryConnection">
          សាកល្បងម្ដងទៀត
        </v-btn>
        <v-btn to="/" variant="tonal" prepend-icon="solar:documents-linear">
          ការអញ្ជើញរបស់ខ្ញុំ
        </v-btn>
      </div>
      <div class="offline-card__tip mt-7">
        <v-icon icon="solar:shield-check-linear" size="18" color="success" />
        <span>ទិន្នន័យការរចនារបស់អ្នកនៅតែរក្សាទុកដោយសុវត្ថិភាពលើឧបករណ៍នេះ។</span>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped>
.offline-page {
  display: grid;
  min-height: calc(100dvh - 9rem);
  place-items: center;
}

.offline-card {
  width: min(100%, 42rem);
}

.offline-card__icon {
  display: inline-grid;
  width: 5rem;
  height: 5rem;
  place-items: center;
  background: rgb(var(--v-theme-primary) / 10%);
  border-radius: 999px;
}

.offline-kicker {
  color: rgb(var(--v-theme-primary));
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.offline-card__tip {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.65rem 0.85rem;
  color: rgb(var(--v-theme-on-surface) / 72%);
  font-size: 0.75rem;
  background: rgb(var(--v-theme-success) / 8%);
  border-radius: var(--radius-lg);
}
</style>

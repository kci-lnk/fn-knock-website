<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { retryLatestRelease, useLatestRelease } from '@/composables/useLatestRelease'

defineProps<{ packageOnly?: boolean; url?: string }>()
const { t } = useI18n()
const { status } = useLatestRelease()
</script>

<template>
  <span v-if="packageOnly && status === 'success' && !url" class="download-unavailable">{{
    t('downloadFeedback.unavailable')
  }}</span>
  <div v-else-if="!packageOnly && status !== 'success'" class="download-feedback">
    <span role="status">{{
      t(status === 'error' ? 'downloadFeedback.error' : 'downloadFeedback.loading')
    }}</span>
    <button v-if="status === 'error'" type="button" @click="retryLatestRelease()">
      {{ t('downloadFeedback.retry') }}
    </button>
  </div>
</template>

<style scoped>
.download-feedback {
  align-items: center;
  color: #475569;
  display: flex;
  flex-wrap: wrap;
  font-size: 0.8125rem;
  gap: 0.25rem 0.75rem;
  grid-column: 1 / -1;
  line-height: 1.6;
  padding: 0.5rem 0;
}
.download-feedback button {
  color: #1d4ed8;
  cursor: pointer;
  font-weight: 600;
  min-height: 2.75rem;
  padding-inline: 0.5rem;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.download-unavailable {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
}
.dark .download-feedback {
  color: #c5d9ec;
}
.dark .download-feedback button {
  color: #8ed8ff;
}
</style>

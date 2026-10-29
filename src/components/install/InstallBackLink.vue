<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

withDefaults(defineProps<{ tone?: 'slate' | 'warm' | 'dark' }>(), { tone: 'slate' })
const { t } = useI18n()
</script>

<template>
  <RouterLink
    to="/"
    class="back-link inline-flex items-center gap-2 text-sm font-medium transition"
    :class="`back-link--${tone}`"
  >
    <ArrowLeft class="h-4 w-4" />
    {{ t('common.backHome') }}
  </RouterLink>
</template>

<style scoped>
.back-link {
  min-height: 2.75rem;
}
.back-link--slate {
  color: #64748b;
}
.back-link--slate:hover {
  color: #172033;
}
.back-link--warm {
  color: #77736c;
}
.back-link--warm:hover {
  color: #262522;
}
.back-link--dark {
  color: #8097b1;
}
.back-link--dark:hover {
  color: #d8efff;
}
.back-link--dark:focus-visible {
  border-radius: 0.3rem;
  outline: 2px solid rgb(93 196 255 / 0.7);
  outline-offset: 4px;
}
</style>

<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const { locale, t } = useI18n()

watch(
  [() => route.meta.titleKey, locale],
  ([titleKey]) => {
    document.title = typeof titleKey === 'string' ? t(titleKey) : t('meta.home')
    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.setAttribute('content', t('meta.description'))
  },
  { immediate: true },
)
</script>

<template>
  <RouterView />
</template>

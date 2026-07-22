<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section
    class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6"
  >
    <p class="text-sm font-bold tracking-[.18em] text-blue-600">404</p>
    <h1 class="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
      {{ t('notFound.title') }}
    </h1>
    <p class="mt-4 max-w-xl leading-7 text-slate-500">{{ t('notFound.description') }}</p>
    <RouterLink
      to="/"
      class="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      <ArrowLeft class="h-4 w-4" />{{ t('common.backHome') }}
    </RouterLink>
  </section>
</template>

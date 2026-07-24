<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { siteConfig } from '@/config/site'
import { useClipboard } from '@/composables/useClipboard'
import logo from '@/assets/favicon.svg'

withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' })
const copyFailed = ref(false)
const { t } = useI18n()
const { copied, copy } = useClipboard(siteConfig.qqGroupNumber, {
  fallback: () => {
    copyFailed.value = true
  },
})
const copyGroupNumber = async () => {
  copyFailed.value = false
  await copy()
}
const copyStatus = computed(() => {
  if (copied.value) return t('footer.copySuccess')
  if (copyFailed.value) return t('footer.copyFailed', { number: siteConfig.qqGroupNumber })
  return ''
})
</script>

<template>
  <footer class="app-footer border-t print:hidden" :class="`app-footer--${tone}`">
    <div
      class="footer-inner mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:px-6 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex items-center gap-3">
        <img :src="logo" alt="" class="h-9 w-9" />
        <div>
          <p class="font-medium">{{ t('header.brandFull') }}</p>
          <p class="text-muted-foreground">{{ t('footer.description') }}</p>
        </div>
      </div>
      <div class="flex flex-col items-start gap-3 text-muted-foreground md:items-end">
        <div class="flex flex-wrap items-center gap-3">
          <span>{{ t('footer.qqGroup', { number: siteConfig.qqGroupNumber }) }}</span>
          <a
            :href="`mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${siteConfig.qqGroupNumber}&card_type=group&source=qrcode`"
            class="font-medium text-foreground transition-opacity hover:opacity-70"
            >{{ t('footer.openQq') }}</a
          >
          <button
            type="button"
            class="min-h-6 font-medium text-foreground transition-opacity hover:opacity-70"
            @click="copyGroupNumber"
          >
            {{ copied ? t('footer.copied') : t('footer.copyGroup') }}
          </button>
        </div>
        <p class="text-xs">{{ t('footer.qqHint') }}</p>
        <p class="sr-only" role="status" aria-live="polite">{{ copyStatus }}</p>
        <nav class="flex flex-wrap items-center gap-4 text-xs" :aria-label="t('footer.legalNav')">
          <RouterLink
            :to="{ name: 'legal', hash: '#terms' }"
            class="transition-colors hover:text-foreground"
            >{{ t('footer.terms') }}</RouterLink
          >
          <RouterLink
            :to="{ name: 'legal', hash: '#privacy' }"
            class="transition-colors hover:text-foreground"
            >{{ t('footer.privacy') }}</RouterLink
          >
          <RouterLink
            :to="{ name: 'third-party-software' }"
            class="transition-colors hover:text-foreground"
            >{{ t('footer.openSource') }}</RouterLink
          >
          <RouterLink :to="{ name: 'changelog' }" class="transition-colors hover:text-foreground">{{
            t('footer.changelog')
          }}</RouterLink>
          <RouterLink
            :to="{ name: 'accessibility' }"
            class="transition-colors hover:text-foreground"
            >{{ t('footer.accessibility') }}</RouterLink
          >
        </nav>
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs transition-opacity hover:opacity-70"
          >{{ siteConfig.icpNumber }}</a
        >
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer--light {
  background: rgb(255 255 255 / 0.92);
  border-color: rgb(226 232 240 / 0.7);
}

.app-footer--dark {
  background: linear-gradient(180deg, #060d1a 0%, #02050d 100%);
  border-color: rgb(132 199 255 / 0.16);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.025),
    0 -18px 54px rgb(0 0 0 / 0.28);
  color: #dbeeff;
  isolation: isolate;
  overflow: hidden;
  position: relative;
  z-index: 5;
}

.app-footer--dark::before {
  background: linear-gradient(90deg, transparent, #43c8ff, #765cff, transparent);
  content: '';
  height: 1px;
  left: 12%;
  opacity: 0.5;
  position: absolute;
  right: 12%;
  top: -1px;
}

.app-footer--dark .footer-inner {
  position: relative;
  z-index: 1;
}

.app-footer--dark :deep(.text-muted-foreground) {
  color: #91a8bf;
}

.app-footer--dark :deep(.text-foreground) {
  color: #d5e8f7;
}

.app-footer--dark a:hover,
.app-footer--dark button:hover {
  color: #eff9ff;
}
</style>

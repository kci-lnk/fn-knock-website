<script setup lang="ts">
import { computed } from 'vue'
import { LoaderCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useLatestRelease } from '@/composables/useLatestRelease'

withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' })

const { t } = useI18n()
const { status, version } = useLatestRelease()
const isWaitingForVersion = computed(() => status.value === 'idle' || status.value === 'loading')
const versionLabel = computed(() => {
  if (status.value === 'success') return t('footer.versionLabel', { version: version.value })
  if (isWaitingForVersion.value) return t('footer.versionLoading')
  return t('footer.versionUnavailable')
})
</script>

<template>
  <RouterLink
    :to="{ name: 'changelog' }"
    class="current-version-link"
    :class="`current-version-link--${tone}`"
    :aria-label="versionLabel"
    :aria-busy="isWaitingForVersion || undefined"
  >
    <strong v-if="status === 'success'">V{{ version }}</strong>
    <span v-else-if="isWaitingForVersion" class="current-version-link__state">
      <LoaderCircle aria-hidden="true" />
      {{ t('footer.versionLoading') }}
    </span>
    <span v-else class="current-version-link__state">
      {{ t('footer.versionUnavailable') }}
    </span>
  </RouterLink>
</template>

<style scoped>
.current-version-link {
  align-items: center;
  border: 1px solid;
  border-radius: 999px;
  display: inline-flex;
  justify-content: center;
  letter-spacing: 0;
  line-height: 1;
  min-height: 1.8rem;
  padding: 0.36rem 0.68rem;
  text-transform: none;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease;
}

.current-version-link strong {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.025em;
}

.current-version-link__state {
  align-items: center;
  display: inline-flex;
  font-size: 0.7rem;
  font-weight: 600;
  gap: 0.3rem;
}

.current-version-link__state svg {
  animation: current-version-spin 0.8s linear infinite;
  height: 0.8rem;
  width: 0.8rem;
}

@keyframes current-version-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .current-version-link__state svg {
    animation: none;
  }
}

.current-version-link:focus-visible {
  outline: 2px solid rgb(37 99 235 / 0.34);
  outline-offset: 3px;
}

.current-version-link--light {
  background: rgb(255 255 255 / 0.64);
  border-color: rgb(148 163 184 / 0.32);
  color: #64748b;
}

.current-version-link--light strong {
  color: #1e3a5f;
}

.current-version-link--light:hover {
  background: #fff;
  border-color: rgb(100 116 139 / 0.42);
  color: #334155;
}

.current-version-link--dark {
  background: rgb(8 27 52 / 0.58);
  border-color: rgb(126 181 229 / 0.22);
  color: #8fa8bf;
}

.current-version-link--dark strong {
  color: #8ed8ff;
}

.current-version-link--dark:hover {
  background: rgb(11 37 70 / 0.88);
  border-color: rgb(126 181 229 / 0.4);
  color: #c5d9ec;
}

.current-version-link--dark:focus-visible {
  outline-color: rgb(125 211 252 / 0.52);
}
</style>

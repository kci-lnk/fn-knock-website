<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLatestRelease } from '@/composables/useLatestRelease'

withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' })

const { t } = useI18n()
const { version } = useLatestRelease()
</script>

<template>
  <RouterLink
    :to="{ name: 'changelog' }"
    class="current-version-link"
    :class="`current-version-link--${tone}`"
    :aria-label="t('footer.versionLabel', { version })"
  >
    <strong>V{{ version }}</strong>
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

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Check, Clipboard } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useClipboard } from '@/composables/useClipboard'

const props = defineProps<{ title: string; code: string }>()
const { t } = useI18n()
const source = computed(() => props.code)
const { copied, copy, reset } = useClipboard(source, {
  fallback: (text) => window.prompt(t('install.docker.copyPrompt'), text),
})
const copyLabel = computed(() =>
  copied.value ? t('install.docker.copied') : t('install.docker.copy'),
)

watch(source, reset)
</script>

<template>
  <div class="docker-code-block">
    <div class="code-toolbar">
      <div class="code-title">
        <span>{{ title }}</span>
      </div>
      <button type="button" class="copy-button" :aria-label="copyLabel" @click="copy">
        <Check v-if="copied" class="h-4 w-4" aria-hidden="true" />
        <Clipboard v-else class="h-4 w-4" aria-hidden="true" />
        <span aria-live="polite">{{ copyLabel }}</span>
      </button>
    </div>
    <pre
      tabindex="0"
      :aria-label="t('install.docker.codeBlockLabel', { title })"
    ><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.docker-code-block {
  background: #111318;
  border: 1px solid #30343d;
  border-radius: 0.25rem;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  width: 100%;
}
.code-toolbar {
  align-items: center;
  background: #1a1c22;
  border-bottom: 1px solid #30343d;
  color: #a1a1aa;
  display: flex;
  justify-content: space-between;
  min-height: 3rem;
  padding: 0.65rem 0.8rem 0.65rem 1rem;
}
.code-title,
.copy-button {
  align-items: center;
  display: inline-flex;
  gap: 0.45rem;
}
.code-title {
  color: #d4d4d8;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.025em;
}
.copy-button {
  border-radius: 0.2rem;
  color: #a1a1aa;
  font-size: 0.72rem;
  font-weight: 700;
  min-height: 2rem;
  padding: 0.35rem 0.55rem;
  transition:
    background-color 0.16s ease,
    color 0.16s ease;
}
.copy-button:hover {
  background: rgb(255 255 255 / 0.06);
  color: #f4f4f5;
}
.copy-button:focus-visible,
pre:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: -2px;
}
pre {
  color: #e4e4e7;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: clamp(0.72rem, 1.4vw, 0.82rem);
  line-height: 1.75;
  margin: 0;
  max-height: 36rem;
  max-width: 100%;
  overflow: auto;
  padding: 1.15rem 1.25rem 1.3rem;
  tab-size: 2;
  white-space: pre;
}
pre:focus-visible {
  border-radius: 0;
}
@media (max-width: 640px) {
  pre {
    font-size: 0.7rem;
    padding: 1rem;
  }
  .code-toolbar {
    padding-left: 0.8rem;
  }
}
</style>

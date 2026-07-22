<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { Check, Languages } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { LOCALE_OPTIONS, setLocale, type LocaleCode } from '@/i18n'

withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' })
const { locale, t } = useI18n()
const open = ref(false)
const root = useTemplateRef<HTMLElement>('root')
const currentLocaleLabel = computed(
  () => LOCALE_OPTIONS.find((item) => item.code === locale.value)?.label ?? locale.value,
)

const chooseLocale = (nextLocale: LocaleCode) => {
  setLocale(nextLocale)
  open.value = false
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!root.value?.contains(event.target as Node)) open.value = false
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !open.value) return
  open.value = false
  root.value?.querySelector<HTMLButtonElement>('.language-trigger')?.focus()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div ref="root" class="language-selector relative" :class="`language-selector--${tone}`">
    <button
      type="button"
      class="language-trigger"
      :title="t('locale.label')"
      :aria-label="t('locale.current', { language: currentLocaleLabel })"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click.stop="open = !open"
    >
      <Languages class="h-4 w-4 shrink-0" aria-hidden="true" />
    </button>
    <Transition name="language-menu">
      <div v-if="open" class="language-menu" role="menu" :aria-label="t('locale.label')">
        <button
          v-for="option in LOCALE_OPTIONS"
          :key="option.code"
          type="button"
          role="menuitemradio"
          :aria-checked="locale === option.code"
          :lang="option.code"
          @click="chooseLocale(option.code)"
        >
          <span>{{ option.label }}</span>
          <Check v-if="locale === option.code" class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.language-trigger {
  align-items: center;
  border: 1px solid rgb(15 23 42 / 0.12);
  border-radius: 9999px;
  color: #475569;
  display: inline-flex;
  height: 2.25rem;
  justify-content: center;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
  width: 2.25rem;
}

.language-trigger:hover,
.language-trigger[aria-expanded='true'] {
  background: #f1f5f9;
  border-color: rgb(15 23 42 / 0.2);
  color: #0f172a;
}

.language-trigger:focus-visible {
  outline: 2px solid rgb(37 99 235 / 0.5);
  outline-offset: 2px;
}

.language-selector--dark .language-trigger {
  border-color: rgb(151 203 255 / 0.16);
  color: #9eb4ca;
}

.language-selector--dark .language-trigger:hover,
.language-selector--dark .language-trigger[aria-expanded='true'] {
  background: rgb(131 186 255 / 0.1);
  border-color: rgb(151 203 255 / 0.26);
  color: #e6f5ff;
}

.language-selector--dark .language-menu {
  backdrop-filter: blur(22px) saturate(135%);
  -webkit-backdrop-filter: blur(22px) saturate(135%);
  background: rgb(8 17 34 / 0.96);
  border-color: rgb(151 203 255 / 0.16);
  box-shadow: 0 18px 50px rgb(0 0 0 / 0.38);
}

.language-selector--dark .language-menu button {
  color: #9fb3c8;
}

.language-selector--dark .language-menu button:hover,
.language-selector--dark .language-menu button:focus-visible {
  background: rgb(131 186 255 / 0.1);
  color: #eff8ff;
}

.language-selector--dark .language-menu button[aria-checked='true'] {
  color: #70d0ff;
}

.language-menu {
  background: rgb(255 255 255 / 0.98);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  box-shadow: 0 18px 50px rgb(15 23 42 / 0.14);
  min-width: 10.5rem;
  overflow: hidden;
  padding: 0.35rem;
  position: absolute;
  right: 0;
  top: calc(100% + 0.55rem);
  z-index: 80;
}

.language-menu button {
  align-items: center;
  border-radius: 0.5rem;
  color: #475569;
  display: flex;
  font-size: 0.82rem;
  font-weight: 600;
  gap: 0.75rem;
  justify-content: space-between;
  min-height: 2.5rem;
  padding: 0.55rem 0.7rem;
  text-align: left;
  width: 100%;
}

.language-menu button:hover,
.language-menu button:focus-visible {
  background: #f1f5f9;
  color: #0f172a;
  outline: none;
}

.language-menu button[aria-checked='true'] {
  color: #1d4ed8;
}

.language-menu-enter-active,
.language-menu-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}

.language-menu-enter-from,
.language-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

@media (prefers-reduced-motion: reduce) {
  .language-trigger,
  .language-menu-enter-active,
  .language-menu-leave-active {
    transition: none;
  }
}
</style>

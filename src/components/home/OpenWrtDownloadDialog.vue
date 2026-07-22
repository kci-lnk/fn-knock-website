<script setup lang="ts">
import { Cpu, Download, Server, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import { openWrtDownloads, resolveOpenWrtDownloadUrl } from '@/config/home'

defineProps<{ open: boolean; dialogId: string }>()
defineEmits<{ close: [] }>()
const { t } = useI18n()
</script>

<template>
  <BaseDialog
    :id="dialogId"
    :open="open"
    aria-labelledby="openwrt-download-dialog-title"
    aria-describedby="openwrt-download-dialog-description"
    initial-focus="#openwrt-download-first-link"
    backdrop-class="!bg-slate-950/65 backdrop-blur-sm"
    panel-class="max-w-lg rounded-2xl border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)]"
    @close="$emit('close')"
  >
    <div class="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
      <div class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 gap-3">
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700"
          >
            <Server class="h-5 w-5" aria-hidden="true" />
          </span>
          <div class="min-w-0">
            <h2
              id="openwrt-download-dialog-title"
              class="text-left text-lg font-bold text-slate-950"
            >
              {{ t('home.downloads.dialogTitle') }}
            </h2>
            <p
              id="openwrt-download-dialog-description"
              class="mt-1 text-left text-sm leading-5 text-slate-500"
            >
              {{ t('home.downloads.dialogDescription') }}
            </p>
          </div>
        </div>
        <button
          type="button"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          :aria-label="t('home.downloads.dialogClose')"
          @click="$emit('close')"
        >
          <X class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div class="space-y-2 p-3">
      <article
        v-for="(item, index) in openWrtDownloads"
        :key="item.arch"
        class="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left"
      >
        <div class="flex items-start gap-3">
          <span
            class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200"
          >
            <Cpu class="h-4 w-4" aria-hidden="true" />
          </span>
          <div class="min-w-0">
            <h3 class="font-semibold leading-5 text-slate-950">
              {{ t(`home.downloads.${item.id}Label`) }}
            </h3>
            <p class="mt-1 text-xs leading-5 text-slate-500">
              {{ t(`home.downloads.${item.id}Hint`) }}
            </p>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <a
            :id="index === 0 ? 'openwrt-download-first-link' : undefined"
            :href="resolveOpenWrtDownloadUrl(item.arch, 'apk')"
            target="_blank"
            rel="noopener noreferrer"
            class="openwrt-dialog-download"
            @click="$emit('close')"
          >
            <span>APK 25.12+</span>
            <Download class="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a
            :href="resolveOpenWrtDownloadUrl(item.arch, 'ipk')"
            target="_blank"
            rel="noopener noreferrer"
            class="openwrt-dialog-download"
            @click="$emit('close')"
          >
            <span>IPK 24.10/{{ t('home.downloads.legacy') }}</span>
            <Download class="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </article>
    </div>
  </BaseDialog>
</template>

<style scoped>
.openwrt-dialog-download {
  align-items: center;
  background: white;
  border: 1px solid #bae6fd;
  border-radius: 0.65rem;
  color: #0369a1;
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 700;
  gap: 0.35rem;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.55rem 0.4rem;
  text-align: center;
  text-decoration: none;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.openwrt-dialog-download:hover {
  background: #f0f9ff;
  border-color: #38bdf8;
  color: #075985;
  text-decoration: none;
}

.openwrt-dialog-download:focus-visible {
  outline: 2px solid rgb(14 165 233 / 0.55);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .openwrt-dialog-download {
    transition: none;
  }
}
</style>

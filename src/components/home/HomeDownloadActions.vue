<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ChevronDown,
  Cpu,
  Download,
  HardDriveDownload,
  MonitorDown,
  Server,
  Terminal,
} from 'lucide-vue-next'
import dockerMark from '@/assets/docker-mark.svg'
import fnOsLogo from '@/assets/fnos-logo.svg'
import OpenWrtDownloadDialog from '@/components/home/OpenWrtDownloadDialog.vue'
import { useDownloadMenu } from '@/composables/useDownloadMenu'
import { fnOsDownloads, openWrtDownloads, resolveOpenWrtDownloadUrl } from '@/config/home'

const componentId = useId()
const { t } = useI18n()
const fnOsTriggerId = `${componentId}-fnos-trigger`
const fnOsPanelId = `${componentId}-fnos-downloads`
const openWrtTriggerId = `${componentId}-openwrt-trigger`
const openWrtPanelId = `${componentId}-openwrt-downloads`
const openWrtDialogId = `${componentId}-openwrt-dialog`
const downloadActionsRef = useTemplateRef<HTMLElement>('downloadActionsRef')
const isMobileOpenWrt = ref(false)
const isOpenWrtDialogOpen = ref(false)
let openWrtMediaQuery: MediaQueryList | undefined

const {
  activeDownloadMenu,
  closeDownloadMenus,
  handleDownloadButtonClick,
  handleDownloadFocusIn,
  handleDownloadFocusOut,
  handleDownloadPointerEnter,
  handleDownloadPointerLeave,
} = useDownloadMenu(downloadActionsRef)

const syncOpenWrtPresentation = (event: MediaQueryList | MediaQueryListEvent) => {
  isMobileOpenWrt.value = event.matches
  if (event.matches) closeDownloadMenus()
  else isOpenWrtDialogOpen.value = false
}

const handleOpenWrtButtonClick = () => {
  if (isMobileOpenWrt.value) {
    closeDownloadMenus()
    isOpenWrtDialogOpen.value = true
    return
  }

  handleDownloadButtonClick('openwrt')
}

const handleOpenWrtPointerEnter = (event: PointerEvent) => {
  if (!isMobileOpenWrt.value) handleDownloadPointerEnter('openwrt', event)
}

onMounted(() => {
  openWrtMediaQuery = window.matchMedia('(max-width: 767px)')
  syncOpenWrtPresentation(openWrtMediaQuery)
  openWrtMediaQuery.addEventListener('change', syncOpenWrtPresentation)
})

onBeforeUnmount(() => {
  openWrtMediaQuery?.removeEventListener('change', syncOpenWrtPresentation)
})
</script>

<template>
  <div
    id="downloads"
    ref="downloadActionsRef"
    class="download-actions-shell relative z-40 mt-9"
    :class="{ 'has-open-menu': activeDownloadMenu }"
    @focusin="handleDownloadFocusIn"
    @focusout="handleDownloadFocusOut"
  >
    <div class="download-actions-grid mx-auto grid w-full gap-2.5 sm:gap-3">
      <div
        class="download-action-item relative col-span-2 min-w-0 sm:col-span-1"
        :class="{ 'is-active': activeDownloadMenu === 'fnos' }"
        @pointerenter="handleDownloadPointerEnter('fnos', $event)"
        @pointerleave="handleDownloadPointerLeave"
      >
        <button
          :id="fnOsTriggerId"
          type="button"
          class="download-action-button download-action--fnos h-12 w-full rounded-lg px-4 text-sm font-bold"
          :aria-controls="fnOsPanelId"
          :aria-expanded="activeDownloadMenu === 'fnos'"
          @click.stop="handleDownloadButtonClick('fnos')"
        >
          <span class="download-action-content">
            <img :src="fnOsLogo" alt="" class="download-action-icon fnos-mark" />
            <span class="truncate">
              <span class="hidden sm:inline">{{ t('home.downloads.fnos') }}</span>
              <span class="sm:hidden">{{ t('home.downloads.fnosShort') }}</span>
            </span>
            <ChevronDown
              class="download-action-chevron"
              :class="activeDownloadMenu === 'fnos' ? 'rotate-180' : ''"
              aria-hidden="true"
            />
          </span>
        </button>

        <Transition name="download-menu">
          <div
            v-show="activeDownloadMenu === 'fnos'"
            :id="fnOsPanelId"
            role="group"
            :aria-labelledby="fnOsTriggerId"
            class="download-menu absolute left-1/2 z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-slate-200 bg-white p-2 text-left shadow-[0_18px_48px_rgba(15,23,42,0.12)]"
          >
            <a
              v-for="item in fnOsDownloads"
              :key="item.url"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="download-menu-option group flex items-center gap-3 rounded-md px-3 py-3 text-sm text-slate-800 transition hover:bg-blue-50"
              @click="closeDownloadMenus"
            >
              <span class="download-menu-icon">
                <Cpu class="h-4 w-4" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <span class="block font-semibold leading-5 text-slate-950">
                  {{ t(`home.downloads.${item.id}Label`) }}
                </span>
                <span class="mt-0.5 block text-xs leading-5 text-slate-500">
                  {{ t(`home.downloads.${item.id}Hint`) }}
                </span>
              </span>
              <Download class="download-menu-download" aria-hidden="true" />
            </a>
          </div>
        </Transition>
      </div>

      <div
        class="download-action-item relative min-w-0"
        :class="{ 'is-active': activeDownloadMenu === 'openwrt' }"
        @pointerenter="handleOpenWrtPointerEnter"
        @pointerleave="handleDownloadPointerLeave"
      >
        <button
          :id="openWrtTriggerId"
          type="button"
          class="download-action-button download-action--openwrt h-12 w-full rounded-lg px-4 text-sm font-bold"
          :aria-controls="
            isMobileOpenWrt ? (isOpenWrtDialogOpen ? openWrtDialogId : undefined) : openWrtPanelId
          "
          :aria-expanded="isMobileOpenWrt ? isOpenWrtDialogOpen : activeDownloadMenu === 'openwrt'"
          :aria-haspopup="isMobileOpenWrt ? 'dialog' : undefined"
          @click.stop="handleOpenWrtButtonClick"
        >
          <span class="download-action-content">
            <Server class="download-action-icon" aria-hidden="true" />
            <span class="truncate">
              <span class="hidden sm:inline">{{ t('home.downloads.openwrt') }}</span>
              <span class="sm:hidden">OpenWrt</span>
            </span>
            <ChevronDown
              class="download-action-chevron"
              :class="
                (isMobileOpenWrt ? isOpenWrtDialogOpen : activeDownloadMenu === 'openwrt')
                  ? 'rotate-180'
                  : ''
              "
              aria-hidden="true"
            />
          </span>
        </button>

        <Transition name="download-menu">
          <div
            v-show="activeDownloadMenu === 'openwrt' && !isMobileOpenWrt"
            :id="openWrtPanelId"
            role="group"
            :aria-labelledby="openWrtTriggerId"
            class="download-menu openwrt-download-menu absolute left-1/2 z-50 mt-3 w-[min(48rem,calc(100vw-2rem))] overflow-visible rounded-lg border border-slate-200 bg-white p-2 text-left shadow-[0_18px_48px_rgba(15,23,42,0.12)]"
          >
            <div
              v-for="item in openWrtDownloads"
              :key="item.arch"
              class="download-menu-option group grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-md px-3 py-3 text-sm text-slate-800 transition hover:bg-sky-50"
            >
              <span class="download-menu-icon">
                <Cpu class="h-4 w-4" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <span class="block font-semibold leading-5 text-slate-950">
                  {{ t(`home.downloads.${item.id}Label`) }}
                </span>
                <span class="mt-0.5 block text-xs leading-5 text-slate-500">
                  {{ t(`home.downloads.${item.id}Hint`) }}
                </span>
              </span>
              <span class="download-format-actions col-start-2 flex flex-wrap gap-2">
                <a
                  :href="resolveOpenWrtDownloadUrl(item.arch, 'apk')"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="download-format-link"
                  @click="closeDownloadMenus"
                >
                  APK 25.12+
                  <Download class="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a
                  :href="resolveOpenWrtDownloadUrl(item.arch, 'ipk')"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="download-format-link"
                  @click="closeDownloadMenus"
                >
                  IPK 24.10/{{ t('home.downloads.legacy') }}
                  <Download class="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </span>
            </div>
          </div>
        </Transition>
      </div>

      <div class="download-action-item relative min-w-0">
        <RouterLink
          to="/docker"
          class="download-action-button download-action--docker h-12 w-full rounded-lg px-4 text-sm font-bold"
        >
          <span class="download-action-content">
            <img :src="dockerMark" alt="" class="docker-mark h-6 w-6" />
            <span class="truncate">
              <span class="hidden sm:inline">{{ t('home.downloads.docker') }}</span>
              <span class="sm:hidden">Docker</span>
            </span>
          </span>
        </RouterLink>
      </div>

      <div class="download-action-item relative min-w-0">
        <RouterLink
          to="/windows"
          class="download-action-button download-action--windows h-12 w-full rounded-lg px-4 text-sm font-bold"
        >
          <span class="download-action-content">
            <MonitorDown class="download-action-icon" aria-hidden="true" />
            <span class="truncate">Windows</span>
          </span>
        </RouterLink>
      </div>

      <div class="download-action-item relative min-w-0">
        <RouterLink
          to="/synology"
          class="download-action-button download-action--synology h-12 w-full rounded-lg px-4 text-sm font-bold"
        >
          <span class="download-action-content">
            <HardDriveDownload class="download-action-icon" aria-hidden="true" />
            <span class="truncate">{{ t('home.downloads.synology') }}</span>
          </span>
        </RouterLink>
      </div>

      <div class="download-action-item relative min-w-0 max-sm:col-span-2">
        <RouterLink
          to="/linux"
          class="download-action-button download-action--linux h-12 w-full rounded-lg px-4 text-sm font-bold"
        >
          <span class="download-action-content">
            <Terminal class="download-action-icon" aria-hidden="true" />
            <span class="truncate">{{ t('home.downloads.linux') }}</span>
          </span>
        </RouterLink>
      </div>
    </div>

    <p class="mx-auto mt-5 max-w-2xl text-center text-sm leading-6 text-slate-500">
      {{ t('home.downloads.note') }}
    </p>
  </div>

  <OpenWrtDownloadDialog
    :open="isOpenWrtDialogOpen"
    :dialog-id="openWrtDialogId"
    @close="isOpenWrtDialogOpen = false"
  />
</template>

<style scoped>
.download-action-item {
  transition:
    filter 0.22s ease,
    opacity 0.22s ease,
    transform 0.22s ease;
}

.download-actions-shell {
  container-name: download-actions;
  container-type: inline-size;
  left: 50%;
  transform: translateX(-50%);
  width: min(1320px, calc(100vw - 2rem));
}

.download-actions-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@container download-actions (min-width: 45rem) {
  .download-actions-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@container download-actions (min-width: 66.25rem) {
  .download-actions-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

.download-actions-shell.has-open-menu,
.download-action-item.is-active {
  z-index: 70;
}

@supports selector(:has(*)) {
  .download-actions-grid:has(.download-action-button:hover) .download-action-item,
  .download-actions-grid:has(.download-menu:hover) .download-action-item,
  .download-actions-grid:has(.download-action-item.is-active) .download-action-item {
    filter: saturate(0.55);
    opacity: 0.42;
    transform: scale(0.985);
  }

  .download-actions-grid:has(.download-action-button:hover)
    .download-action-item:has(.download-action-button:hover),
  .download-actions-grid:has(.download-menu:hover) .download-action-item:has(.download-menu:hover),
  .download-actions-grid:has(.download-action-item.is-active) .download-action-item.is-active {
    filter: none;
    opacity: 1;
    transform: none;
  }
}

.download-action-button {
  --download-bg: linear-gradient(135deg, #0f172a, #020617);
  --download-fg: #fff;
  --download-hover-bg: linear-gradient(135deg, #2563eb, #7c3aed);
  --download-hover-fg: #fff;
  --download-shadow: rgb(15 23 42 / 0.1);
  --download-shadow-hover: rgb(15 23 42 / 0.14);
  --download-sheen: rgb(255 255 255 / 0.38);
  align-items: center;
  appearance: none;
  background: var(--download-bg);
  border: 0;
  box-shadow: 0 8px 20px var(--download-shadow);
  color: var(--download-fg);
  cursor: pointer;
  display: inline-flex;
  isolation: isolate;
  justify-content: center;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    box-shadow 0.24s ease,
    transform 0.24s ease;
}

.download-action-button::before {
  background: linear-gradient(90deg, transparent, var(--download-sheen), transparent);
  bottom: -70%;
  content: '';
  left: -45%;
  position: absolute;
  top: -70%;
  transform: translateX(-160%) rotate(16deg);
  transition: transform 0.72s cubic-bezier(0.22, 1, 0.36, 1);
  width: 32%;
  z-index: 1;
}

.download-action-button:hover {
  background: var(--download-hover-bg);
  box-shadow: 0 10px 24px var(--download-shadow-hover);
  color: var(--download-hover-fg);
  text-decoration: none;
  transform: translateY(-1px);
}

.download-action-button:hover::before {
  transform: translateX(520%) rotate(16deg);
}

.download-action-button:focus-visible,
.download-menu-option:focus-visible,
.download-format-link:focus-visible {
  outline: 2px solid rgb(37 99 235 / 0.42);
  outline-offset: 4px;
}

.download-action-content {
  align-items: center;
  display: flex;
  gap: 0.65rem;
  justify-content: center;
  min-width: 0;
  position: relative;
  width: 100%;
  z-index: 2;
}

.download-action-icon,
.download-action-chevron {
  flex: 0 0 auto;
  height: 1.35rem;
  transition: transform 0.22s ease;
  width: 1.35rem;
}

.download-action-button:hover .download-action-icon {
  transform: scale(1.06);
}

.fnos-mark {
  height: 1.12rem;
  object-fit: contain;
  position: relative;
  top: -1px;
  width: 1.44rem;
}

.download-action--fnos {
  --download-bg: linear-gradient(135deg, #2f7df6, #3478f6);
  --download-hover-bg: linear-gradient(135deg, #2563eb, #7c3aed);
  --download-shadow: rgb(47 125 246 / 0.16);
  --download-shadow-hover: rgb(47 125 246 / 0.2);
  --download-sheen: rgb(255 255 255 / 0.46);
}

.download-action--openwrt {
  --download-bg: linear-gradient(135deg, #0f172a, #020617);
  --download-hover-bg: linear-gradient(135deg, #075985, #0284c7);
  --download-shadow: rgb(15 23 42 / 0.12);
  --download-shadow-hover: rgb(15 23 42 / 0.16);
  --download-sheen: rgb(125 211 252 / 0.36);
}

.download-action--docker {
  --download-bg: linear-gradient(135deg, #2496ed, #0b8ddf);
  --download-hover-bg: linear-gradient(135deg, #0b72c6, #075985);
  --download-shadow: rgb(36 150 237 / 0.16);
  --download-shadow-hover: rgb(36 150 237 / 0.2);
  --download-sheen: rgb(255 255 255 / 0.46);
}

.docker-mark {
  flex: 0 0 auto;
  filter: brightness(0) invert(1);
  transition: transform 0.22s ease;
}

.download-action--docker:hover .docker-mark {
  transform: scale(1.06);
}

.download-action--linux {
  --download-bg: linear-gradient(135deg, #475569, #1e293b);
  --download-hover-bg: linear-gradient(135deg, #334155, #0f172a);
  --download-shadow: rgb(30 41 59 / 0.14);
  --download-shadow-hover: rgb(30 41 59 / 0.22);
  --download-sheen: rgb(226 232 240 / 0.28);
}

.download-action--windows {
  --download-bg: linear-gradient(135deg, #087cd5, #0067b8);
  --download-hover-bg: linear-gradient(135deg, #0067b8, #075985);
  --download-shadow: rgb(0 103 184 / 0.16);
  --download-shadow-hover: rgb(0 103 184 / 0.24);
  --download-sheen: rgb(219 234 254 / 0.4);
}

.download-action--synology {
  --download-bg: linear-gradient(135deg, #34383d, #202327);
  --download-hover-bg: linear-gradient(135deg, #1689c9, #0875b5);
  --download-shadow: rgb(32 35 39 / 0.16);
  --download-shadow-hover: rgb(8 117 181 / 0.24);
  --download-sheen: rgb(255 255 255 / 0.4);
}

.download-menu {
  transform: translateX(-50%);
  z-index: 999;
}

.openwrt-download-menu {
  display: grid;
  gap: 0.25rem 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-height: none;
  overflow: visible;
}

.download-menu-enter-active,
.download-menu-leave-active {
  transition: transform 0.14s ease;
}

.download-menu-enter-from,
.download-menu-leave-to {
  transform: translateX(-50%) translateY(-0.3rem);
}

.download-menu-option {
  text-decoration: none;
}

.download-menu-option:hover {
  text-decoration: none;
}

.download-format-link {
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  color: #0369a1;
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 700;
  gap: 0.3rem;
  line-height: 1;
  min-height: 1.7rem;
  padding: 0.35rem 0.55rem;
  text-decoration: none;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
  white-space: nowrap;
}

.download-format-link:hover {
  background: #e0f2fe;
  border-color: #7dd3fc;
  color: #075985;
  text-decoration: none;
}

.download-menu-icon {
  align-items: center;
  background: #f1f5f9;
  border-radius: 9999px;
  color: #334155;
  display: flex;
  flex: 0 0 auto;
  height: 2.25rem;
  justify-content: center;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
  width: 2.25rem;
}

.download-menu-option:hover .download-menu-icon {
  background: #dbeafe;
  color: #2563eb;
}

.download-menu-download {
  color: #94a3b8;
  flex: 0 0 auto;
  height: 1rem;
  margin-left: auto;
  transition: color 0.18s ease;
  width: 1rem;
}

.download-menu-option:hover .download-menu-download {
  color: #2563eb;
}

@media (prefers-reduced-motion: reduce) {
  .download-action-item,
  .download-action-button,
  .download-action-button::before,
  .download-action-icon,
  .download-action-chevron,
  .docker-mark,
  .download-format-link,
  .download-menu-icon,
  .download-menu-download,
  .download-menu-enter-active,
  .download-menu-leave-active {
    transition: none;
  }
}

@media (max-width: 767px) {
  .openwrt-download-menu {
    display: none;
  }
}

@media (max-width: 640px) {
  .download-actions-grid {
    max-width: min(100%, 22rem);
  }

  .download-action-button {
    border-radius: 0.75rem;
    box-shadow: 0 8px 18px var(--download-shadow);
    padding-inline: 0.8rem;
    transform: none;
  }

  .download-action-button::before {
    display: none;
  }

  .download-action-button:hover {
    box-shadow: 0 8px 18px var(--download-shadow-hover);
    transform: none;
  }

  .download-action-item:first-child .download-action-button {
    min-height: 3.25rem;
  }

  .download-action-item:first-child .download-action-content {
    font-size: 0.95rem;
  }

  .download-action-item:not(:first-child) .download-action-button {
    --download-bg: rgb(255 255 255 / 0.9);
    --download-fg: #0f172a;
    --download-shadow: rgb(15 23 42 / 0.035);
    --download-shadow-hover: rgb(15 23 42 / 0.055);
    border: 1px solid rgb(226 232 240 / 0.92);
  }

  .download-action-content {
    font-size: 0.86rem;
    gap: 0.45rem;
  }

  .download-action-icon,
  .download-action-chevron {
    height: 1rem;
    width: 1rem;
  }

  .fnos-mark {
    height: 0.88rem;
    width: 1.15rem;
  }

  .docker-mark {
    filter: none;
    height: 1.05rem;
    width: 1.05rem;
  }

  .download-menu {
    margin-top: 0.55rem;
    width: min(22rem, calc(100vw - 2rem)) !important;
  }

  @supports selector(:has(*)) {
    .download-actions-grid:has(.download-action-button:hover) .download-action-item,
    .download-actions-grid:has(.download-menu:hover) .download-action-item,
    .download-actions-grid:has(.download-action-item.is-active) .download-action-item {
      filter: none;
      opacity: 1;
      transform: none;
    }
  }
}
</style>

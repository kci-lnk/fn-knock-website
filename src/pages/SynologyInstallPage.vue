<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  CheckCircle2,
  Download,
  ExternalLink,
  HardDrive,
  PackageOpen,
  ShieldCheck,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import DownloadAvailability from '@/components/install/DownloadAvailability.vue'
import CurrentVersionLink from '@/components/install/CurrentVersionLink.vue'
import InstallBackLink from '@/components/install/InstallBackLink.vue'
import PortTable, { type PortItem } from '@/components/install/PortTable.vue'
import SynologyWaveBackground from '@/components/install/SynologyWaveBackground.vue'
import { useReleaseDownloads } from '@/composables/useReleaseDownloads'

const { t } = useI18n()
const { resolveDownloadUrl } = useReleaseDownloads()
const synologyGuideUrl = 'https://docs.fnknock.cn/quick-start/synology-deployment'

const installSteps = ['step1', 'step2', 'step3'] as const
const downloads = [
  {
    arch: 'x86_64',
    labelKey: 'install.synology.downloadX86',
    hintKey: 'install.synology.downloadX86Hint',
  },
  {
    arch: 'armv8',
    labelKey: 'install.synology.downloadArmv8',
    hintKey: 'install.synology.downloadArmv8Hint',
  },
  {
    arch: 'armv7',
    labelKey: 'install.synology.downloadArmv7',
    hintKey: 'install.synology.downloadArmv7Hint',
  },
]
const hoveredDownloadArch = ref<string | null>(null)
const focusedDownloadArch = ref<string | null>(null)
const activeDownloadArch = computed(() => focusedDownloadArch.value ?? hoveredDownloadArch.value)

const clearHoveredDownload = (arch: string) => {
  if (hoveredDownloadArch.value === arch) hoveredDownloadArch.value = null
}

const clearFocusedDownload = (arch: string) => {
  if (focusedDownloadArch.value === arch) focusedDownloadArch.value = null
}

const ports = computed<PortItem[]>(() => [
  {
    port: '7999',
    name: t('install.synology.port7999Name'),
    scope: t('install.table.lanWan'),
    note: t('install.synology.port7999Note'),
  },
  {
    port: '7998',
    name: t('install.synology.port7998Name'),
    scope: t('install.table.localOnly'),
    note: t('install.synology.port7998Note'),
  },
  {
    port: '7997',
    name: t('install.synology.port7997Name'),
    scope: t('install.table.localOnly'),
    note: t('install.synology.packageInternal'),
  },
  {
    port: '7996',
    name: t('install.synology.port7996Name'),
    scope: t('install.table.localOnly'),
    note: t('install.synology.packageInternal'),
  },
])
</script>

<template>
  <div class="synology-page px-4 py-8 sm:px-6 sm:py-12">
    <SynologyWaveBackground />
    <div class="ambient-orb ambient-orb--one" aria-hidden="true" />
    <div class="ambient-orb ambient-orb--two" aria-hidden="true" />
    <section class="synology-content mx-auto max-w-6xl">
      <InstallBackLink tone="dark" />

      <section class="synology-hero mt-10 overflow-hidden rounded-3xl">
        <div class="hero-copy">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div class="platform-label">
              <span class="dsm-mark" aria-hidden="true">DSM</span>
              SYNOLOGY DSM 7 · x86_64 · ARMv8 · ARMv7
            </div>
            <CurrentVersionLink tone="dark" />
          </div>
          <h1 class="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            {{ t('install.synology.title') }}
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-8 sm:text-lg">
            {{ t('install.synology.intro') }}
          </p>
          <div class="download-row mt-7" :class="{ 'has-active-download': activeDownloadArch }">
            <a
              v-for="item in downloads"
              :key="item.arch"
              :href="resolveDownloadUrl('synology', item.arch) || undefined"
              :aria-disabled="!resolveDownloadUrl('synology', item.arch) || undefined"
              :data-synology-arch="item.arch"
              class="primary-download min-h-12 rounded-xl px-4 py-3"
              :class="[
                `primary-download--${item.arch}`,
                {
                  'is-active': activeDownloadArch === item.arch,
                  'is-muted': activeDownloadArch && activeDownloadArch !== item.arch,
                },
              ]"
              @pointerenter="hoveredDownloadArch = item.arch"
              @pointerleave="clearHoveredDownload(item.arch)"
              @pointercancel="clearHoveredDownload(item.arch)"
              @focus="focusedDownloadArch = item.arch"
              @blur="clearFocusedDownload(item.arch)"
            >
              <Download class="h-4 w-4" aria-hidden="true" />
              <span>
                <strong>{{ t(item.labelKey) }}</strong>
                <small>{{ t(item.hintKey) }}</small>
                <DownloadAvailability
                  package-only
                  :url="resolveDownloadUrl('synology', item.arch)"
                />
              </span>
            </a>
            <span class="download-meta text-xs font-medium text-stone-500">{{
              t('install.synology.packageMeta')
            }}</span>
          </div>
          <DownloadAvailability />
        </div>

        <aside class="platform-summary" :aria-label="t('install.synology.summaryLabel')">
          <div class="summary-status"><i></i> {{ t('install.synology.service') }}</div>
          <dl>
            <div>
              <dt>{{ t('install.synology.system') }}</dt>
              <dd>DSM 7.0+</dd>
            </div>
            <div>
              <dt>{{ t('install.synology.architecture') }}</dt>
              <dd>x86_64 / armv8 / armv7</dd>
            </div>
            <div>
              <dt>{{ t('install.synology.entry') }}</dt>
              <dd>{{ t('install.synology.desktop') }}</dd>
            </div>
          </dl>
          <div class="summary-note">{{ t('install.synology.thirdParty') }}</div>
        </aside>
      </section>

      <section class="content-section glass-panel mt-6">
        <div class="section-heading">
          <p>{{ t('install.synology.installation') }}</p>
          <h2>{{ t('install.synology.stepsTitle') }}</h2>
        </div>
        <div class="step-list mt-6">
          <article v-for="(step, index) in installSteps" :key="step" class="step-row">
            <span class="step-number">0{{ index + 1 }}</span>
            <CheckCircle2 class="step-icon h-5 w-5" aria-hidden="true" />
            <div>
              <h3>{{ t(`install.synology.${step}Title`) }}</h3>
              <p>{{ t(`install.synology.${step}Description`) }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="details-grid mt-6">
        <article class="detail-card">
          <HardDrive class="h-5 w-5" aria-hidden="true" />
          <div>
            <h2>{{ t('install.synology.dataTitle') }}</h2>
            <p class="mt-4">
              {{ t('install.synology.dataDescription') }}
            </p>
          </div>
        </article>
        <article class="detail-card detail-card--notice">
          <ShieldCheck class="h-5 w-5" aria-hidden="true" />
          <div>
            <h2>{{ t('install.synology.noticeTitle') }}</h2>
            <p class="mt-4">
              {{ t('install.synology.noticeDescription') }}
            </p>
          </div>
        </article>
      </section>

      <section class="port-section glass-panel mt-6">
        <div class="section-title-row">
          <div class="section-heading">
            <p>{{ t('install.synology.network') }}</p>
            <h2>{{ t('install.synology.ports') }}</h2>
          </div>
          <span>{{ t('install.synology.portsNote') }}</span>
        </div>
        <PortTable class="mt-6" :items="ports" tone="dark" />
        <a
          :href="synologyGuideUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="guide-link mt-7 inline-flex items-center gap-2 text-sm font-semibold"
        >
          <PackageOpen class="h-4 w-4" aria-hidden="true" />
          {{ t('install.synology.guide') }}
          <ExternalLink class="h-4 w-4" aria-hidden="true" />
        </a>
      </section>
    </section>
  </div>
</template>

<style scoped>
.synology-page {
  background: #fff;
  color: #1d2731;
  min-height: calc(100vh - 4rem);
  padding-bottom: 7rem;
}

.synology-hero {
  align-items: center;
  background:
    radial-gradient(circle at 85% 8%, rgb(56 189 248 / 0.18), transparent 34%),
    linear-gradient(135deg, #fbfdff 0%, #eef7fd 100%);
  border: 1px solid #d7e8f3;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(17rem, 0.65fr);
  min-height: 26rem;
  position: relative;
}

.synology-hero::before {
  background-image:
    linear-gradient(rgb(8 117 181 / 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgb(8 117 181 / 0.055) 1px, transparent 1px);
  background-size: 32px 32px;
  content: '';
  inset: 0;
  mask-image: linear-gradient(90deg, transparent, black);
  pointer-events: none;
  position: absolute;
}

.hero-copy {
  padding: clamp(2rem, 5vw, 4rem);
  position: relative;
  z-index: 1;
}

.platform-label {
  align-items: center;
  color: #0875b5;
  display: flex;
  font-size: 0.72rem;
  font-weight: 800;
  gap: 0.65rem;
  letter-spacing: 0.12em;
}

.dsm-mark {
  align-items: center;
  background: #1689c9;
  border-radius: 0.3rem;
  color: #fff;
  display: inline-flex;
  font-size: 0.55rem;
  height: 1.35rem;
  justify-content: center;
  letter-spacing: 0.04em;
  width: 1.75rem;
}

.synology-hero h1 {
  color: #17212b;
  font-weight: 680;
  letter-spacing: -0.05em;
  line-height: 1.06;
}

.hero-copy > p {
  color: #526575;
}

.primary-download {
  --download-start: #0875b5;
  --download-end: #055d91;
  --download-shadow: rgb(8 117 181 / 0.22);
  --download-shadow-active: rgb(8 117 181 / 0.34);
  --download-ring: rgb(14 165 233 / 0.48);
  align-items: center;
  background: linear-gradient(135deg, var(--download-start), var(--download-end));
  box-shadow: 0 12px 28px var(--download-shadow);
  color: #fff;
  display: inline-flex;
  gap: 0.65rem;
  isolation: isolate;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  transition:
    box-shadow 0.22s ease,
    filter 0.22s ease,
    opacity 0.22s ease,
    transform 0.22s ease;
}

.primary-download::before {
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.42), transparent);
  bottom: -75%;
  content: '';
  left: -48%;
  position: absolute;
  top: -75%;
  transform: translateX(-170%) rotate(16deg);
  transition: transform 0.72s cubic-bezier(0.22, 1, 0.36, 1);
  width: 34%;
  z-index: 1;
}

.primary-download > svg,
.primary-download > span {
  position: relative;
  z-index: 2;
}

.primary-download--x86_64 {
  --download-start: #0875b5;
  --download-end: #055d91;
  --download-shadow: rgb(8 117 181 / 0.22);
  --download-shadow-active: rgb(8 117 181 / 0.36);
  --download-ring: rgb(14 165 233 / 0.5);
}

.primary-download--armv8 {
  --download-start: #0f766e;
  --download-end: #115e59;
  --download-shadow: rgb(15 118 110 / 0.22);
  --download-shadow-active: rgb(15 118 110 / 0.36);
  --download-ring: rgb(20 184 166 / 0.5);
}

.primary-download--armv7 {
  --download-start: #b45309;
  --download-end: #7c2d12;
  --download-shadow: rgb(146 64 14 / 0.22);
  --download-shadow-active: rgb(146 64 14 / 0.36);
  --download-ring: rgb(234 88 12 / 0.48);
}

.download-row {
  display: grid;
  gap: 0.65rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.primary-download span {
  display: grid;
  gap: 0.15rem;
  min-width: 0;
}

.primary-download strong {
  font-size: 0.78rem;
  font-weight: 700;
}

.primary-download small {
  color: rgb(255 255 255 / 0.94);
  font-size: 0.65rem;
  line-height: 1.3;
}

.download-meta {
  grid-column: 1 / -1;
}

.download-row.has-active-download .primary-download.is-muted {
  filter: grayscale(0.16) saturate(0.42);
  opacity: 0.38;
  transform: scale(0.975);
}

.primary-download.is-active {
  box-shadow: 0 17px 36px var(--download-shadow-active);
  filter: none;
  opacity: 1;
  transform: translateY(-2px) scale(1.015);
}

.primary-download.is-active::before {
  transform: translateX(520%) rotate(16deg);
}

.primary-download:focus-visible {
  outline: 3px solid var(--download-ring);
  outline-offset: 4px;
}

.platform-summary {
  background: rgb(255 255 255 / 0.8);
  border: 1px solid rgb(8 117 181 / 0.18);
  border-radius: 1rem 0 0 1rem;
  box-shadow: 0 18px 42px rgb(12 74 110 / 0.09);
  margin-left: 1rem;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
}

.summary-status {
  align-items: center;
  color: #15803d;
  display: flex;
  font-size: 0.75rem;
  font-weight: 700;
  gap: 0.55rem;
}

.summary-status i {
  background: #22c55e;
  border-radius: 999px;
  box-shadow: 0 0 0 4px rgb(34 197 94 / 0.12);
  height: 0.45rem;
  width: 0.45rem;
}

.platform-summary dl {
  border-top: 1px solid #dce8ef;
  margin-top: 1.25rem;
}

.platform-summary dl > div {
  align-items: center;
  border-bottom: 1px solid #dce8ef;
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
}

.platform-summary dt,
.summary-note {
  color: #738493;
  font-size: 0.72rem;
}

.platform-summary dd {
  color: #324554;
  font-size: 0.8rem;
  font-weight: 650;
}

.summary-note {
  margin-top: 1rem;
}

.section-heading > p {
  color: #0875b5;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.section-heading h2,
.detail-card h2 {
  color: #1d2a35;
  font-size: 1.55rem;
  font-weight: 650;
  letter-spacing: -0.035em;
}

.section-heading h2 {
  margin-top: 0.35rem;
}

.step-list {
  border-bottom: 1px solid #dce7ee;
  border-top: 1px solid #8fa6b6;
}

.step-row {
  align-items: start;
  display: grid;
  gap: 1rem;
  grid-template-columns: 2.5rem 1.25rem minmax(0, 1fr);
  padding: 1.35rem 0.25rem;
}

.step-row + .step-row {
  border-top: 1px solid #dce7ee;
}

.step-number {
  color: #a9bac5;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.step-icon,
.detail-card > svg {
  color: #1689c9;
}

.step-row h3 {
  font-size: 0.96rem;
  font-weight: 650;
}

.step-row p,
.detail-card p {
  color: #637584;
  font-size: 0.86rem;
  line-height: 1.75;
  margin-top: 0.6rem;
}

.details-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1.2fr 0.8fr;
}

.detail-card {
  border: 1px solid #dce7ee;
  border-radius: 1rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: auto minmax(0, 1fr);
  padding: 1.6rem;
}

.detail-card > svg {
  margin-top: 0.22rem;
}

.detail-card--notice {
  background: #f2f9fd;
  border-color: #cce4f2;
}

.detail-card code {
  color: #334b5c;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.82em;
  overflow-wrap: anywhere;
}

.section-title-row {
  align-items: end;
  display: flex;
  justify-content: space-between;
}

.section-title-row > span {
  color: #748896;
  font-size: 0.75rem;
}

.guide-link {
  color: #0875b5;
  text-decoration: underline;
  text-decoration-color: #8fc6e4;
  text-underline-offset: 0.3rem;
}

.guide-link:hover {
  color: #055d91;
  text-decoration-color: #055d91;
}

@media (max-width: 800px) {
  .synology-hero {
    grid-template-columns: 1fr;
  }

  .platform-summary {
    border-radius: 0.85rem;
    margin: 0 1.5rem 1.5rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .synology-page {
    padding-bottom: 4.5rem;
  }

  .synology-hero {
    border-radius: 1.15rem;
    min-height: 0;
  }

  .hero-copy {
    padding: 1.7rem 1.25rem 1.25rem;
  }

  .synology-hero h1 {
    font-size: 2rem;
    letter-spacing: -0.04em;
  }

  .hero-copy > p {
    font-size: 0.92rem;
    line-height: 1.75;
  }

  .download-row {
    grid-template-columns: 1fr;
    width: 100%;
  }

  .download-meta {
    grid-column: auto;
  }

  .platform-summary {
    box-shadow: none;
    margin: 0 1.25rem 1.25rem;
    padding: 1.1rem;
  }

  .content-section,
  .port-section {
    margin-top: 3rem;
  }

  .step-row {
    gap: 0.8rem;
    grid-template-columns: 1.25rem minmax(0, 1fr);
    padding-block: 1.15rem;
  }

  .step-number {
    display: none;
  }

  .step-row p {
    line-height: 1.65;
    margin-top: 0.35rem;
  }

  .section-title-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-card {
    gap: 0.8rem;
    padding: 1.1rem;
  }

  .detail-card h2,
  .section-heading h2 {
    font-size: 1.3rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .primary-download,
  .primary-download::before {
    transition: none;
  }
}
</style>
<style scoped src="./SynologyInstallPage.dark.css"></style>

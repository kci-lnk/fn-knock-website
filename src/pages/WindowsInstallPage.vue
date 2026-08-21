<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Download, ExternalLink, FolderOpen, ShieldCheck } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import CurrentVersionLink from '@/components/install/CurrentVersionLink.vue'
import InstallBackLink from '@/components/install/InstallBackLink.vue'
import PortTable, { type PortItem } from '@/components/install/PortTable.vue'
import { useReleaseDownloads } from '@/composables/useReleaseDownloads'

const { resolveDownloadUrl } = useReleaseDownloads()
const downloadUrl = computed(() => resolveDownloadUrl('windows', 'x86_64'))
const projectGuideUrl =
  'https://github.com/kci-lnk/fn-knock-turborepo/tree/main/apps/fn-knock-desktop'

const { t } = useI18n()
const installSteps = ['step1', 'step2', 'step3'] as const

const ports = computed<PortItem[]>(() => [
  {
    port: '7991',
    name: t('install.windows.port7991Name'),
    scope: t('install.table.browserAccess'),
    note: t('install.table.setPassword'),
  },
  {
    port: '7999',
    name: t('install.windows.port7999Name'),
    scope: t('install.windows.port7999Scope'),
    note: t('install.windows.port7999Note'),
  },
  {
    port: '7998',
    name: t('install.windows.port7998Name'),
    scope: t('install.table.localOnly'),
    note: t('install.table.internalUse'),
  },
  {
    port: '7997',
    name: t('install.windows.port7997Name'),
    scope: t('install.table.localOnly'),
    note: t('install.table.internalUse'),
  },
  {
    port: '7996',
    name: t('install.windows.port7996Name'),
    scope: t('install.table.localOnly'),
    note: t('install.table.internalUse'),
  },
])
</script>

<template>
  <div class="windows-page px-4 py-8 sm:px-6 sm:py-12">
    <section class="mx-auto max-w-6xl">
      <InstallBackLink />

      <section class="windows-hero mt-10 overflow-hidden rounded-3xl border border-blue-100">
        <div class="windows-hero-copy">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div class="platform-label">
              <span class="windows-mark" aria-hidden="true"> <i></i><i></i><i></i><i></i> </span>
              WINDOWS x86_64
            </div>
            <CurrentVersionLink />
          </div>
          <h1 class="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            {{ t('install.windows.title') }}
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-8 sm:text-lg">
            {{ t('install.windows.intro') }}
          </p>
          <div
            class="download-row mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
          >
            <a
              :href="downloadUrl || undefined"
              :aria-disabled="!downloadUrl || undefined"
              class="primary-download inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold"
            >
              <Download class="h-4 w-4" />
              {{ t('install.windows.download') }}
            </a>
            <span class="text-xs font-medium text-slate-500">{{
              t('install.windows.packageMeta')
            }}</span>
          </div>
        </div>

        <div class="platform-summary">
          <div class="summary-status"><i></i> {{ t('install.windows.status') }}</div>
          <dl>
            <div>
              <dt>{{ t('install.windows.architecture') }}</dt>
              <dd>x86_64</dd>
            </div>
            <div>
              <dt>{{ t('install.windows.management') }}</dt>
              <dd>{{ t('install.windows.tray') }}</dd>
            </div>
            <div>
              <dt>{{ t('install.windows.panel') }}</dt>
              <dd>{{ t('install.windows.browserPort') }}</dd>
            </div>
          </dl>
          <div class="summary-note">{{ t('install.windows.nativeNote') }}</div>
        </div>
      </section>

      <section class="content-section mt-14 max-w-5xl">
        <div class="section-heading">
          <p>{{ t('install.windows.installation') }}</p>
          <h2>{{ t('install.windows.stepsTitle') }}</h2>
        </div>
        <div class="step-list mt-6">
          <article v-for="(step, index) in installSteps" :key="step" class="step-row">
            <span class="step-number">0{{ index + 1 }}</span>
            <CheckCircle2 class="step-icon h-5 w-5" />
            <div>
              <h3>{{ t(`install.windows.${step}Title`) }}</h3>
              <p>{{ t(`install.windows.${step}Description`) }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="details-grid mt-12 max-w-5xl">
        <article class="detail-card">
          <FolderOpen class="h-5 w-5" />
          <div>
            <h2>{{ t('install.windows.directories') }}</h2>
            <dl class="path-list mt-5">
              <div>
                <dt>{{ t('install.windows.program') }}</dt>
                <dd>%ProgramFiles%\Knock 敲门</dd>
              </div>
              <div>
                <dt>{{ t('install.windows.data') }}</dt>
                <dd>%ProgramData%\FnKnock</dd>
              </div>
            </dl>
            <p class="mt-5">
              {{ t('install.windows.dataDescription') }}
            </p>
          </div>
        </article>
        <article class="detail-card detail-card--security">
          <ShieldCheck class="h-5 w-5" />
          <div>
            <h2>{{ t('install.windows.security') }}</h2>
            <p class="mt-4">
              {{ t('install.windows.securityDescription') }}
            </p>
          </div>
        </article>
      </section>

      <section class="port-section mt-14 max-w-5xl">
        <div class="section-title-row">
          <div class="section-heading">
            <p>{{ t('install.windows.network') }}</p>
            <h2>{{ t('install.windows.ports') }}</h2>
          </div>
          <span>{{ t('install.windows.portsNote') }}</span>
        </div>
        <PortTable class="mt-6" :items="ports" />
        <a
          :href="projectGuideUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="guide-link mt-7 inline-flex items-center gap-2 text-sm font-semibold"
        >
          {{ t('install.windows.guide') }}
          <ExternalLink class="h-4 w-4" />
        </a>
      </section>
    </section>
  </div>
</template>

<style scoped>
.windows-page {
  background: #fff;
  color: #172033;
  min-height: calc(100vh - 4rem);
  padding-bottom: 7rem;
}

.windows-hero {
  background:
    radial-gradient(circle at 92% 8%, rgb(125 211 252 / 0.24), transparent 34%),
    linear-gradient(135deg, #f8fbff 0%, #edf6ff 100%);
  align-items: center;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(17rem, 0.65fr);
  min-height: 26rem;
  position: relative;
}

.windows-hero::before {
  background-image:
    linear-gradient(rgb(2 132 199 / 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgb(2 132 199 / 0.06) 1px, transparent 1px);
  background-size: 32px 32px;
  content: '';
  inset: 0;
  mask-image: linear-gradient(90deg, transparent, black);
  pointer-events: none;
  position: absolute;
}

.windows-hero-copy {
  padding: clamp(2rem, 5vw, 4rem);
  position: relative;
  z-index: 1;
}

.platform-label {
  align-items: center;
  color: #0067b8;
  display: flex;
  font-size: 0.72rem;
  font-weight: 800;
  gap: 0.65rem;
  letter-spacing: 0.14em;
}

.windows-mark {
  display: grid;
  gap: 2px;
  grid-template-columns: repeat(2, 6px);
}

.windows-mark i {
  background: #087cd5;
  display: block;
  height: 6px;
  width: 6px;
}

.windows-hero h1 {
  color: #111827;
  font-weight: 680;
  letter-spacing: -0.05em;
  line-height: 1.06;
}

.windows-hero-copy > p {
  color: #526176;
}

.primary-download {
  background: #0067b8;
  box-shadow: 0 12px 28px rgb(0 103 184 / 0.2);
  color: #fff;
  text-decoration: none;
  transition:
    background-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.primary-download:hover {
  background: #00589e;
  box-shadow: 0 15px 34px rgb(0 103 184 / 0.26);
  transform: translateY(-1px);
}

.platform-summary {
  background: rgb(255 255 255 / 0.78);
  border: 1px solid rgb(148 163 184 / 0.24);
  border-radius: 1rem 0 0 1rem;
  box-shadow: 0 18px 42px rgb(15 62 104 / 0.1);
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
  border-top: 1px solid #e2e8f0;
  margin-top: 1.25rem;
}
.platform-summary dl > div {
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
}
.platform-summary dt {
  color: #718096;
  font-size: 0.75rem;
}
.platform-summary dd {
  color: #27364a;
  font-size: 0.8rem;
  font-weight: 650;
}
.summary-note {
  color: #8b98a9;
  font-size: 0.7rem;
  margin-top: 1rem;
}

.section-heading > p {
  color: #087cd5;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}
.section-heading h2,
.detail-card h2 {
  color: #172033;
  font-size: 1.55rem;
  font-weight: 650;
  letter-spacing: -0.035em;
}
.section-heading h2 {
  margin-top: 0.35rem;
}

.step-list {
  border-bottom: 1px solid #dbe4ef;
  border-top: 1px solid #9aa9ba;
}
.step-row {
  align-items: start;
  display: grid;
  gap: 1rem;
  grid-template-columns: 2.5rem 1.25rem minmax(0, 1fr);
  padding: 1.35rem 0.25rem;
}
.step-row + .step-row {
  border-top: 1px solid #dbe4ef;
}
.step-number {
  color: #b4c2d3;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.step-icon {
  color: #087cd5;
}
.step-row h3 {
  color: #172033;
  font-size: 0.96rem;
  font-weight: 650;
}
.step-row p,
.detail-card p {
  color: #68778b;
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
  border: 1px solid #dbe4ef;
  border-radius: 1rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: auto minmax(0, 1fr);
  padding: 1.6rem;
}
.detail-card > svg {
  color: #087cd5;
  margin-top: 0.22rem;
}
.detail-card--security {
  background: #f6faff;
  border-color: #cfe5f8;
}
.path-list {
  display: grid;
  gap: 0.75rem;
}
.path-list > div {
  align-items: baseline;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  gap: 1rem;
  grid-template-columns: 7rem minmax(0, 1fr);
  padding-bottom: 0.7rem;
}
.path-list dt {
  color: #8190a2;
  font-size: 0.72rem;
}
.path-list dd {
  color: #334155;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.76rem;
  overflow-wrap: anywhere;
}

.section-title-row {
  align-items: end;
  display: flex;
  justify-content: space-between;
}
.section-title-row > span {
  color: #8491a2;
  font-size: 0.75rem;
}
.guide-link {
  color: #0067b8;
  text-decoration: underline;
  text-decoration-color: #9dc8e8;
  text-underline-offset: 0.3rem;
}
.guide-link:hover {
  color: #004f8d;
  text-decoration-color: #004f8d;
}

@media (max-width: 800px) {
  .windows-hero {
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
  .windows-page {
    padding-bottom: 4.5rem;
  }
  .windows-hero {
    border-radius: 1.15rem;
    min-height: 0;
  }
  .windows-hero-copy {
    padding: 1.7rem 1.25rem 1.25rem;
  }
  .windows-hero h1 {
    font-size: 2rem;
    letter-spacing: -0.04em;
  }
  .windows-hero-copy > p {
    font-size: 0.92rem;
    line-height: 1.75;
  }
  .download-row {
    align-items: stretch;
    width: 100%;
  }
  .primary-download {
    width: 100%;
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
  .path-list > div {
    grid-template-columns: 1fr;
    gap: 0.3rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .primary-download {
    transition: none;
  }
}
</style>

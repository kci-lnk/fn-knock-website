<script setup lang="ts">
import { computed } from 'vue'
import { Cpu, Download, FolderOpen, ShieldAlert, Terminal } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import DockerCodeBlock from '@/components/install/DockerCodeBlock.vue'
import DownloadAvailability from '@/components/install/DownloadAvailability.vue'
import CurrentVersionLink from '@/components/install/CurrentVersionLink.vue'
import InstallBackLink from '@/components/install/InstallBackLink.vue'
import PortTable, { type PortItem } from '@/components/install/PortTable.vue'
import { useReleaseDownloads } from '@/composables/useReleaseDownloads'

const installCommand = 'curl -fsSL https://cdn.fnknock.cn/macos/install.sh | sudo bash'
const { resolveDownloadUrl } = useReleaseDownloads()
const intelDownloadUrl = computed(() => resolveDownloadUrl('macos', 'amd64'))
const appleSiliconDownloadUrl = computed(() => resolveDownloadUrl('macos', 'arm64'))
const { t } = useI18n()

const ports = computed<PortItem[]>(() => [
  {
    port: '7999',
    name: t('install.macos.port7999Name'),
    scope: t('install.table.allInterfaces'),
    note: t('install.macos.port7999Note'),
  },
  {
    port: '7991',
    name: t('install.macos.port7991Name'),
    scope: t('install.table.localOnly'),
    note: t('install.table.setPassword'),
  },
  {
    port: '7998',
    name: t('install.macos.port7998Name'),
    scope: t('install.table.localOnly'),
    note: t('install.table.doNotExpose'),
  },
  {
    port: '7997',
    name: t('install.macos.port7997Name'),
    scope: t('install.table.localOnly'),
    note: t('install.table.internalUse'),
  },
  {
    port: '7996',
    name: t('install.macos.port7996Name'),
    scope: t('install.table.localOnly'),
    note: t('install.table.internalUse'),
  },
])
</script>

<template>
  <div class="macos-page px-4 py-8 sm:px-6 sm:py-12">
    <section class="mx-auto max-w-6xl">
      <InstallBackLink />

      <header class="page-intro mx-auto mt-12 max-w-5xl">
        <div class="flex flex-wrap items-center gap-3">
          <span class="platform-label">macOS 13+</span>
          <CurrentVersionLink />
        </div>
        <h1 class="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
          {{ t('install.macos.title') }}
        </h1>
        <p class="mt-6 max-w-3xl text-base leading-8 sm:text-lg">
          {{ t('install.macos.intro') }}
        </p>
      </header>

      <section class="quick-install mx-auto mt-10 max-w-5xl" aria-labelledby="macos-command-title">
        <div class="section-heading">
          <Terminal class="h-5 w-5" aria-hidden="true" />
          <div>
            <h2 id="macos-command-title">{{ t('install.macos.commandTitle') }}</h2>
            <p>{{ t('install.macos.commandDescription') }}</p>
          </div>
        </div>
        <DockerCodeBlock
          class="mt-6"
          data-testid="macos-install-command"
          title="Terminal"
          :code="installCommand"
        />
      </section>

      <section
        class="architecture-section mx-auto mt-6 max-w-5xl"
        aria-labelledby="macos-arch-title"
      >
        <div class="section-title-row">
          <div>
            <p class="section-kicker">{{ t('install.macos.directDownloads') }}</p>
            <h2 id="macos-arch-title">{{ t('install.macos.architectureTitle') }}</h2>
          </div>
          <span>{{ t('install.macos.architectureNote') }}</span>
        </div>
        <p class="section-description">{{ t('install.macos.directDownloadsDescription') }}</p>
        <DownloadAvailability />
        <div class="architecture-grid mt-6">
          <a
            :href="intelDownloadUrl || undefined"
            :aria-disabled="!intelDownloadUrl || undefined"
            class="architecture-card"
            data-testid="macos-amd64-download"
          >
            <span class="architecture-icon"><Cpu class="h-5 w-5" aria-hidden="true" /></span>
            <span>
              <strong>{{ t('install.macos.intel') }}</strong>
              <small>{{ t('install.macos.intelHint') }}</small>
              <DownloadAvailability package-only :url="intelDownloadUrl" />
            </span>
            <Download class="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            :href="appleSiliconDownloadUrl || undefined"
            :aria-disabled="!appleSiliconDownloadUrl || undefined"
            class="architecture-card"
            data-testid="macos-arm64-download"
          >
            <span class="architecture-icon"><Cpu class="h-5 w-5" aria-hidden="true" /></span>
            <span>
              <strong>{{ t('install.macos.appleSilicon') }}</strong>
              <small>{{ t('install.macos.appleSiliconHint') }}</small>
              <DownloadAvailability package-only :url="appleSiliconDownloadUrl" />
            </span>
            <Download class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section class="details-grid mx-auto mt-6 max-w-5xl">
        <article class="detail-card">
          <FolderOpen class="h-5 w-5" aria-hidden="true" />
          <div>
            <h2>{{ t('install.macos.pathsTitle') }}</h2>
            <dl class="path-list mt-5">
              <div>
                <dt>{{ t('install.macos.program') }}</dt>
                <dd>/Library/Application Support/FnKnock</dd>
              </div>
              <div>
                <dt>{{ t('install.macos.logs') }}</dt>
                <dd>/Library/Logs/FnKnock</dd>
              </div>
            </dl>
          </div>
        </article>
        <article class="detail-card detail-card--limitations">
          <ShieldAlert class="h-5 w-5" aria-hidden="true" />
          <div>
            <h2>{{ t('install.macos.limitationsTitle') }}</h2>
            <p class="mt-4">{{ t('install.macos.limitationsDescription') }}</p>
          </div>
        </article>
      </section>

      <section
        class="maintenance-section mx-auto mt-6 max-w-5xl"
        aria-labelledby="macos-maintenance-title"
      >
        <div>
          <p class="section-kicker">launchd · knock CLI</p>
          <h2 id="macos-maintenance-title">{{ t('install.macos.maintenanceTitle') }}</h2>
          <p class="section-description">{{ t('install.macos.maintenanceDescription') }}</p>
        </div>
        <div class="menu-command mt-6">
          <div>
            <span>{{ t('install.macos.menuCommandLabel') }}</span>
            <code>sudo knock</code>
          </div>
          <p>{{ t('install.macos.menuCommandHint') }}</p>
        </div>
        <div class="command-list mt-3">
          <code>sudo knock status</code>
          <code>sudo knock update</code>
          <code>sudo knock rollback</code>
          <code>sudo knock uninstall</code>
        </div>
      </section>

      <section class="ports-section mx-auto mt-6 max-w-5xl" aria-labelledby="macos-ports-title">
        <div class="section-title-row">
          <h2 id="macos-ports-title">{{ t('install.macos.portsTitle') }}</h2>
          <span>{{ t('install.macos.portsNote') }}</span>
        </div>
        <PortTable
          class="mt-6"
          :items="ports"
          :scope-label="t('install.table.listeningScope')"
          :caption="t('install.macos.portsCaption')"
        />
      </section>
    </section>
  </div>
</template>

<style scoped>
.macos-page {
  --macos-blue: #0066cc;
  --macos-border: #d2d2d7;
  --macos-label: #1d1d1f;
  --macos-secondary: #6e6e73;
  background: #f5f5f7;
  color: var(--macos-label);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  min-height: calc(100vh - 4rem);
  padding-bottom: 7rem;
}
.macos-page :deep(.back-link) {
  color: var(--macos-blue);
}
.macos-page :deep(.back-link:hover) {
  color: #004a99;
}
.macos-page :deep(.current-version-link--light) {
  background: transparent;
  border-color: transparent;
  color: var(--macos-secondary);
  padding-left: 0.1rem;
  padding-right: 0.1rem;
}
.macos-page :deep(.current-version-link--light:hover) {
  background: transparent;
  border-color: transparent;
}
.platform-label {
  color: var(--macos-secondary);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.page-intro h1 {
  color: var(--macos-label);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1.06;
}
.page-intro > p {
  color: var(--macos-secondary);
}
.quick-install,
.architecture-section,
.maintenance-section,
.ports-section {
  border-top: 1px solid var(--macos-border);
  padding: 2rem 0;
}
.section-heading {
  align-items: flex-start;
  display: flex;
  gap: 0.75rem;
}
.section-heading > svg {
  color: #86868b;
  flex: 0 0 auto;
  margin-top: 0.2rem;
}
.section-heading h2,
.section-title-row h2,
.detail-card h2,
.maintenance-section h2 {
  color: var(--macos-label);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}
.section-heading p,
.section-description,
.detail-card p {
  color: var(--macos-secondary);
  line-height: 1.7;
  margin-top: 0.4rem;
}
.section-title-row {
  align-items: end;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.section-title-row > span {
  color: #86868b;
  font-size: 0.78rem;
  text-align: right;
}
.section-kicker {
  color: #86868b;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}
.architecture-grid {
  display: grid;
  column-gap: 2rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.architecture-card {
  align-items: center;
  border-bottom: 1px solid var(--macos-border);
  border-top: 1px solid var(--macos-border);
  color: var(--macos-label);
  display: grid;
  gap: 0.75rem;
  grid-template-columns: auto minmax(0, 1fr) auto;
  padding: 0.9rem 0;
  text-decoration: none;
  transition: color 0.16s ease;
}
.architecture-card:hover {
  color: var(--macos-blue);
}
.architecture-icon {
  color: #86868b;
  display: inline-flex;
}
.architecture-card strong,
.architecture-card small {
  display: block;
}
.architecture-card strong {
  font-size: 0.9rem;
}
.architecture-card small {
  color: var(--macos-secondary);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
.details-grid {
  border-top: 1px solid var(--macos-border);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.detail-card {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: auto minmax(0, 1fr);
  padding: 2rem 2rem 2rem 0;
}
.detail-card > svg {
  color: #86868b;
  margin-top: 0.2rem;
}
.detail-card--limitations {
  border-left: 1px solid var(--macos-border);
  padding-left: 2rem;
  padding-right: 0;
}
.path-list {
  display: grid;
  gap: 0.7rem;
}
.path-list dt {
  color: #86868b;
  font-size: 0.7rem;
  font-weight: 700;
}
.path-list dd {
  color: #3a3a3c;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.73rem;
  margin-top: 0.15rem;
  overflow-wrap: anywhere;
}
.menu-command {
  align-items: center;
  border-bottom: 1px solid var(--macos-border);
  border-top: 1px solid var(--macos-border);
  color: var(--macos-label);
  display: flex;
  gap: 1.25rem;
  justify-content: space-between;
  padding: 0.9rem 0;
}
.menu-command > div {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  gap: 0.8rem;
}
.menu-command span {
  font-size: 0.78rem;
  font-weight: 700;
}
.menu-command code {
  background: #e8e8ed;
  border-radius: 0.3rem;
  color: var(--macos-label);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  padding: 0.55rem 0.7rem;
}
.menu-command p {
  color: var(--macos-secondary);
  font-size: 0.78rem;
  line-height: 1.55;
  text-align: right;
}
.command-list {
  display: grid;
  column-gap: 2rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.command-list code {
  border-bottom: 1px solid var(--macos-border);
  color: #3a3a3c;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.76rem;
  padding: 0.75rem 0;
}
.quick-install :deep(.docker-code-block) {
  background: #1c1c1e;
  border: 0;
  border-radius: 0.45rem;
}
.quick-install :deep(.code-toolbar) {
  background: #242426;
  border-bottom-color: rgb(255 255 255 / 0.08);
}
.quick-install :deep(.copy-button:hover) {
  background: rgb(255 255 255 / 0.08);
}
.ports-section :deep(.port-table-region) {
  --port-border: var(--macos-border);
  --port-border-strong: var(--macos-border);
  --port-row-border: #e5e5e7;
  --port-code: var(--macos-blue);
  --port-name: var(--macos-label);
  --port-text: var(--macos-secondary);
  --port-head: #8e8e93;
}
.ports-section :deep(thead th),
.ports-section :deep(tbody td),
.ports-section :deep(tbody th) {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
@media (max-width: 640px) {
  .macos-page {
    padding-bottom: 4rem;
  }
  .architecture-grid,
  .details-grid,
  .command-list {
    grid-template-columns: minmax(0, 1fr);
  }
  .section-title-row {
    align-items: flex-start;
    flex-direction: column;
  }
  .section-title-row > span {
    text-align: left;
  }
  .detail-card {
    padding: 1.5rem 0;
  }
  .detail-card--limitations {
    border-left: 0;
    border-top: 1px solid var(--macos-border);
  }
  .menu-command {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }
  .menu-command p {
    text-align: left;
  }
}
@media (prefers-reduced-motion: reduce) {
  .architecture-card {
    transition: none;
  }
}
</style>

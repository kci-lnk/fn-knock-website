<script setup lang="ts">
import { computed } from 'vue'
import { Cpu, Download, FolderOpen, ShieldAlert, Terminal } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import DockerCodeBlock from '@/components/install/DockerCodeBlock.vue'
import CurrentVersionLink from '@/components/install/CurrentVersionLink.vue'
import InstallBackLink from '@/components/install/InstallBackLink.vue'
import PortTable, { type PortItem } from '@/components/install/PortTable.vue'
import { createDownloadUrl } from '@/config/downloads'

const installCommand = 'curl -fsSL https://cdn.fnknock.cn/macos/install.sh | sudo bash'
const intelDownloadUrl = createDownloadUrl({ type: 'macos', arch: 'amd64' })
const appleSiliconDownloadUrl = createDownloadUrl({ type: 'macos', arch: 'arm64' })
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
        <div class="architecture-grid mt-6">
          <a :href="intelDownloadUrl" class="architecture-card" data-testid="macos-amd64-download">
            <span class="architecture-icon"><Cpu class="h-5 w-5" aria-hidden="true" /></span>
            <span>
              <strong>{{ t('install.macos.intel') }}</strong>
              <small>{{ t('install.macos.intelHint') }}</small>
            </span>
            <Download class="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            :href="appleSiliconDownloadUrl"
            class="architecture-card"
            data-testid="macos-arm64-download"
          >
            <span class="architecture-icon"><Cpu class="h-5 w-5" aria-hidden="true" /></span>
            <span>
              <strong>{{ t('install.macos.appleSilicon') }}</strong>
              <small>{{ t('install.macos.appleSiliconHint') }}</small>
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
  --macos-accent: #007aff;
  --macos-accent-dark: #0066cc;
  --macos-border: rgb(60 60 67 / 0.14);
  --macos-label: #1d1d1f;
  --macos-secondary-label: #6e6e73;
  background:
    radial-gradient(circle at 88% 0%, rgb(10 132 255 / 0.11), transparent 30rem),
    linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 48%, #f2f2f4 100%);
  color: var(--macos-label);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  min-height: calc(100vh - 4rem);
  padding-bottom: 7rem;
}
.macos-page :deep(.back-link) {
  color: var(--macos-accent-dark);
}
.macos-page :deep(.back-link:hover) {
  color: #004e9f;
}
.platform-label {
  background: var(--macos-accent);
  border-radius: 999px;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.42rem 0.75rem;
  box-shadow: 0 2px 8px rgb(0 122 255 / 0.2);
}
.page-intro h1 {
  color: var(--macos-label);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1.06;
}
.page-intro > p {
  color: var(--macos-secondary-label);
}
.quick-install,
.architecture-section,
.maintenance-section,
.ports-section {
  background: rgb(255 255 255 / 0.82);
  border: 1px solid var(--macos-border);
  border-radius: 1.25rem;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.03),
    0 12px 36px rgb(0 0 0 / 0.045);
  padding: 1.75rem;
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  backdrop-filter: blur(20px) saturate(160%);
}
.section-heading {
  align-items: flex-start;
  display: flex;
  gap: 0.9rem;
}
.section-heading > svg {
  background: rgb(0 122 255 / 0.1);
  border-radius: 0.7rem;
  color: var(--macos-accent-dark);
  flex: 0 0 auto;
  height: 2.4rem;
  margin-top: 0.05rem;
  padding: 0.5rem;
  width: 2.4rem;
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
  color: var(--macos-secondary-label);
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
  background: #f2f2f7;
  border-radius: 999px;
  color: var(--macos-secondary-label);
  font-size: 0.78rem;
  padding: 0.38rem 0.65rem;
  text-align: right;
}
.section-kicker {
  color: var(--macos-accent-dark);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}
.architecture-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.architecture-card {
  align-items: center;
  background: #f7f7fa;
  border: 1px solid rgb(60 60 67 / 0.12);
  border-radius: 0.9rem;
  color: var(--macos-label);
  display: grid;
  gap: 0.9rem;
  grid-template-columns: auto minmax(0, 1fr) auto;
  padding: 1rem;
  text-decoration: none;
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;
}
.architecture-card:hover {
  background: #fff;
  border-color: rgb(0 122 255 / 0.48);
  box-shadow: 0 10px 28px rgb(0 122 255 / 0.11);
  color: var(--macos-accent-dark);
  transform: translateY(-2px);
}
.architecture-icon {
  align-items: center;
  background: rgb(0 122 255 / 0.1);
  border-radius: 0.7rem;
  color: var(--macos-accent-dark);
  display: inline-flex;
  height: 2.6rem;
  justify-content: center;
  width: 2.6rem;
}
.architecture-card strong,
.architecture-card small {
  display: block;
}
.architecture-card strong {
  font-size: 0.9rem;
}
.architecture-card small {
  color: var(--macos-secondary-label);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
.details-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.detail-card {
  background: rgb(255 255 255 / 0.82);
  border: 1px solid var(--macos-border);
  border-radius: 1.25rem;
  box-shadow: 0 8px 28px rgb(0 0 0 / 0.035);
  display: grid;
  gap: 1rem;
  grid-template-columns: auto minmax(0, 1fr);
  padding: 1.5rem;
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  backdrop-filter: blur(20px) saturate(160%);
}
.detail-card > svg {
  background: rgb(0 122 255 / 0.1);
  border-radius: 0.65rem;
  color: var(--macos-accent-dark);
  height: 2.2rem;
  margin-top: 0.05rem;
  padding: 0.45rem;
  width: 2.2rem;
}
.detail-card--limitations {
  background: linear-gradient(145deg, rgb(239 246 255 / 0.96), rgb(255 255 255 / 0.88));
}
.path-list {
  display: grid;
  gap: 0.7rem;
}
.path-list dt {
  color: var(--macos-secondary-label);
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
  background: linear-gradient(135deg, #0a84ff, #0071e3);
  border-radius: 1rem;
  color: #fff;
  display: flex;
  gap: 1.25rem;
  justify-content: space-between;
  padding: 1rem 1.1rem;
  box-shadow: 0 10px 24px rgb(0 122 255 / 0.18);
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
  background: rgb(255 255 255 / 0.18);
  border: 1px solid rgb(255 255 255 / 0.22);
  border-radius: 0.55rem;
  color: #fff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  padding: 0.55rem 0.7rem;
}
.menu-command p {
  color: rgb(255 255 255 / 0.88);
  font-size: 0.78rem;
  line-height: 1.55;
  text-align: right;
}
.command-list {
  display: grid;
  gap: 0.55rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.command-list code {
  background: #f2f2f7;
  border: 1px solid rgb(60 60 67 / 0.08);
  border-radius: 0.7rem;
  color: #3a3a3c;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.76rem;
  padding: 0.75rem 0.9rem;
}
.quick-install :deep(.docker-code-block) {
  background: #1c1c1e;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: 0.9rem;
  box-shadow: 0 16px 34px rgb(0 0 0 / 0.14);
}
.quick-install :deep(.code-toolbar) {
  background: #2c2c2e;
  border-bottom-color: rgb(255 255 255 / 0.08);
  padding-left: 4.35rem;
  position: relative;
}
.quick-install :deep(.code-toolbar)::before {
  background: #ff5f57;
  border-radius: 50%;
  box-shadow:
    1.15rem 0 #febc2e,
    2.3rem 0 #28c840;
  content: '';
  height: 0.72rem;
  left: 1rem;
  position: absolute;
  width: 0.72rem;
}
.quick-install :deep(.copy-button:hover) {
  background: rgb(10 132 255 / 0.24);
}
.ports-section :deep(.port-table-region) {
  --port-border: rgb(60 60 67 / 0.12);
  --port-border-strong: rgb(60 60 67 / 0.12);
  --port-row-border: rgb(60 60 67 / 0.09);
  --port-code: var(--macos-accent-dark);
  --port-name: var(--macos-label);
  --port-text: var(--macos-secondary-label);
  --port-head: #8e8e93;
  background: #f7f7fa;
  border: 1px solid var(--macos-border);
  border-radius: 0.9rem;
  overflow-x: auto;
}
.ports-section :deep(thead th),
.ports-section :deep(tbody td),
.ports-section :deep(tbody th) {
  padding-left: 0.9rem;
  padding-right: 0.9rem;
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
  .quick-install,
  .architecture-section,
  .maintenance-section,
  .ports-section,
  .detail-card {
    border-radius: 1rem;
    padding: 1.25rem;
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

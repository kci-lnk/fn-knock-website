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

      <header class="page-intro mt-12 max-w-4xl">
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

      <section class="quick-install mt-10 max-w-5xl" aria-labelledby="macos-command-title">
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

      <section class="architecture-section mt-14 max-w-5xl" aria-labelledby="macos-arch-title">
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

      <section class="warning-section mt-12 max-w-5xl" aria-labelledby="macos-warning-title">
        <ShieldAlert class="h-5 w-5" aria-hidden="true" />
        <div>
          <h2 id="macos-warning-title">{{ t('install.macos.unsignedTitle') }}</h2>
          <p>{{ t('install.macos.unsignedDescription') }}</p>
        </div>
      </section>

      <section class="details-grid mt-12 max-w-5xl">
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
        class="maintenance-section mt-12 max-w-5xl"
        aria-labelledby="macos-maintenance-title"
      >
        <div>
          <p class="section-kicker">launchd · knock CLI</p>
          <h2 id="macos-maintenance-title">{{ t('install.macos.maintenanceTitle') }}</h2>
          <p class="section-description">{{ t('install.macos.maintenanceDescription') }}</p>
        </div>
        <div class="command-list mt-6">
          <code>sudo knock status</code>
          <code>sudo knock update</code>
          <code>sudo knock rollback</code>
          <code>sudo knock uninstall</code>
        </div>
      </section>

      <section class="ports-section mt-12 max-w-5xl" aria-labelledby="macos-ports-title">
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
  background: #fff;
  color: #24262a;
  min-height: calc(100vh - 4rem);
  padding-bottom: 7rem;
}
.platform-label {
  background: #202226;
  border-radius: 999px;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  padding: 0.4rem 0.7rem;
}
.page-intro h1 {
  color: #191a1d;
  font-weight: 680;
  letter-spacing: -0.05em;
  line-height: 1.06;
}
.page-intro > p {
  color: #666a72;
}
.quick-install,
.architecture-section,
.maintenance-section,
.ports-section {
  border-bottom: 1px solid #d7d9dd;
  border-top: 1px solid #777c85;
  padding: 2rem 0.25rem 2.25rem;
}
.section-heading {
  align-items: flex-start;
  display: flex;
  gap: 0.8rem;
}
.section-heading > svg {
  color: #4c5159;
  flex: 0 0 auto;
  margin-top: 0.2rem;
}
.section-heading h2,
.section-title-row h2,
.detail-card h2,
.maintenance-section h2 {
  color: #292b2f;
  font-size: 1.4rem;
  font-weight: 680;
  letter-spacing: -0.025em;
}
.section-heading p,
.section-description,
.detail-card p {
  color: #6e727a;
  line-height: 1.8;
  margin-top: 0.4rem;
}
.section-title-row {
  align-items: end;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.section-title-row > span {
  color: #858a92;
  font-size: 0.78rem;
  text-align: right;
}
.section-kicker {
  color: #858a92;
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.1em;
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
  border: 1px solid #d4d7dc;
  border-radius: 0.65rem;
  color: #31343a;
  display: grid;
  gap: 0.9rem;
  grid-template-columns: auto minmax(0, 1fr) auto;
  padding: 1.1rem;
  text-decoration: none;
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;
}
.architecture-card:hover {
  border-color: #7b818b;
  box-shadow: 0 12px 30px rgb(22 25 30 / 0.08);
  transform: translateY(-1px);
}
.architecture-icon {
  align-items: center;
  background: #eff0f2;
  border-radius: 0.55rem;
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
  color: #767b84;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
.warning-section {
  align-items: flex-start;
  background: #fff9ed;
  border: 1px solid #f2d59b;
  border-radius: 0.65rem;
  color: #764f12;
  display: flex;
  gap: 0.9rem;
  padding: 1.15rem 1.25rem;
}
.warning-section > svg {
  flex: 0 0 auto;
  margin-top: 0.15rem;
}
.warning-section h2 {
  font-size: 0.92rem;
  font-weight: 750;
}
.warning-section p {
  font-size: 0.8rem;
  line-height: 1.75;
  margin-top: 0.35rem;
}
.details-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.detail-card {
  border: 1px solid #d7d9dd;
  border-radius: 0.65rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: auto minmax(0, 1fr);
  padding: 1.35rem;
}
.detail-card > svg {
  color: #555b64;
  margin-top: 0.2rem;
}
.detail-card--limitations {
  background: #f7f8f9;
}
.path-list {
  display: grid;
  gap: 0.7rem;
}
.path-list dt {
  color: #838891;
  font-size: 0.7rem;
  font-weight: 700;
}
.path-list dd {
  color: #4d525b;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.73rem;
  margin-top: 0.15rem;
  overflow-wrap: anywhere;
}
.command-list {
  display: grid;
  gap: 0.55rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.command-list code {
  background: #f1f2f4;
  border-left: 2px solid #7e848d;
  color: #4d525b;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.76rem;
  padding: 0.75rem 0.9rem;
}
@media (max-width: 640px) {
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
}
@media (prefers-reduced-motion: reduce) {
  .architecture-card {
    transition: none;
  }
}
</style>

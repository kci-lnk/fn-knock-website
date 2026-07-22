<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import InstallBackLink from '@/components/install/InstallBackLink.vue'
import CurrentVersionLink from '@/components/install/CurrentVersionLink.vue'
import LinuxInstallCommand from '@/components/install/LinuxInstallCommand.vue'
import PortTable, { type PortItem } from '@/components/install/PortTable.vue'
import { siteConfig } from '@/config/site'

const { t } = useI18n()
const ports = computed<PortItem[]>(() => [
  {
    port: '7999',
    name: t('install.linux.port7999Name'),
    scope: t('install.table.allInterfaces'),
    note: t('install.linux.port7999Note'),
  },
  {
    port: '7991',
    name: t('install.linux.port7991Name'),
    scope: t('install.table.allInterfaces'),
    note: t('install.table.setPassword'),
  },
  {
    port: '7998',
    name: t('install.linux.port7998Name'),
    scope: t('install.table.localOnly'),
    note: t('install.table.doNotExpose'),
  },
  {
    port: '7997',
    name: t('install.linux.port7997Name'),
    scope: t('install.table.localOnly'),
    note: t('install.table.internalUse'),
  },
  {
    port: '7996',
    name: t('install.linux.port7996Name'),
    scope: t('install.table.localOnly'),
    note: t('install.table.internalUse'),
  },
])
</script>

<template>
  <div class="linux-page px-4 py-8 sm:px-6 sm:py-12">
    <section class="mx-auto max-w-6xl">
      <InstallBackLink tone="warm" />
      <header class="page-intro mt-12 max-w-4xl">
        <CurrentVersionLink class="mb-5" />
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
          {{ t('install.linux.title') }}
        </h1>
        <p class="mt-6 max-w-3xl text-base leading-8 sm:text-lg">
          {{ t('install.linux.intro') }}
        </p>
      </header>

      <LinuxInstallCommand />

      <section class="doc-section mt-16 max-w-5xl" aria-labelledby="linux-ports-title">
        <div class="section-title-row">
          <h2 id="linux-ports-title">{{ t('install.linux.portsTitle') }}</h2>
          <span class="section-title-note">{{ t('install.linux.portsNote') }}</span>
        </div>
        <PortTable
          class="mt-6"
          :items="ports"
          tone="warm"
          :scope-label="t('install.table.listeningScope')"
          :caption="t('install.linux.portsCaption')"
        />
      </section>

      <section
        class="doc-section followup-section mt-12 max-w-5xl"
        :aria-label="t('install.linux.maintenanceLabel')"
      >
        <article class="followup-item">
          <p class="section-index">01</p>
          <div>
            <h2>{{ t('install.linux.maintenance') }}</h2>
            <p class="mt-3">{{ t('install.linux.maintenanceText') }}</p>
            <div class="command-list mt-5">
              <code>knock status</code><code>knock update</code
              ><code>knock reset-panel-password</code>
            </div>
          </div>
        </article>
        <article class="followup-item">
          <p class="section-index">02</p>
          <div>
            <h2>{{ t('install.linux.remote') }}</h2>
            <p class="mt-3">{{ t('install.linux.remoteText') }}</p>
            <a
              :href="`${siteConfig.docsUrl}/quick-start/linux-deployment`"
              target="_blank"
              rel="noopener noreferrer"
              class="docs-link mt-5 inline-flex items-center gap-2 text-sm font-semibold transition"
            >
              {{ t('install.linux.docs') }}<ExternalLink class="h-4 w-4" />
            </a>
          </div>
        </article>
      </section>
    </section>
  </div>
</template>

<style scoped>
.linux-page {
  background: #fff;
  color: #262522;
  min-height: calc(100vh - 4rem);
  padding-bottom: 6rem;
}
.page-intro h1 {
  color: #24231f;
  font-weight: 650;
  letter-spacing: -0.045em;
  line-height: 1.12;
}
.page-intro > p:last-child,
.doc-section p {
  color: #6f6b64;
}
.doc-section h2 {
  color: #292824;
  font-size: 1.45rem;
  font-weight: 650;
  letter-spacing: -0.025em;
}
.section-title-row {
  align-items: end;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.section-title-note {
  color: #8b867d;
  font-size: 0.78rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.followup-section {
  border-bottom: 1px solid #cbc7bf;
  border-top: 1px solid #827d74;
}
.followup-section p {
  font-size: 0.92rem;
  line-height: 1.9;
  margin-top: 0.3rem;
}
.followup-item {
  display: grid;
  gap: 2rem;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  padding: 2.1rem 0.25rem 2.25rem;
}
.followup-item + .followup-item {
  border-top: 1px solid #d8d4cc;
}
.section-index {
  color: #a39d93 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem !important;
  letter-spacing: 0.08em;
  line-height: 1.45 !important;
  margin: 0 !important;
  padding-top: 0.34rem;
}
.command-list {
  border-left: 1px solid #c8c3ba;
  display: grid;
  gap: 0.65rem;
  padding-left: 1rem;
}
.command-list code {
  color: #59554e;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
}
.inline-code {
  border-bottom: 1px solid #b8b2a8;
  color: #4e4a43;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82em;
  padding: 0 0.08rem 0.08rem;
}
.docs-link {
  color: #4e4a43;
  text-decoration: underline;
  text-decoration-color: #b7b0a5;
  text-underline-offset: 0.35rem;
}
.docs-link:hover {
  color: #171612;
  text-decoration-color: #171612;
}
@media (max-width: 640px) {
  .section-title-row {
    align-items: center;
    gap: 0.5rem;
  }
  .section-title-note {
    font-size: 0.8rem;
  }
  .followup-item {
    gap: 1rem;
    grid-template-columns: 1.8rem minmax(0, 1fr);
    padding-block: 1.75rem;
  }
}
</style>

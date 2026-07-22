<script setup lang="ts">
import { computed, ref } from 'vue'
import { ExternalLink } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import CurrentVersionLink from '@/components/install/CurrentVersionLink.vue'
import DockerCodeBlock from '@/components/install/DockerCodeBlock.vue'
import InstallBackLink from '@/components/install/InstallBackLink.vue'
import PortTable from '@/components/install/PortTable.vue'
import { homeLinks } from '@/config/home'

type RegistrySource = 'mirror' | 'dockerHub'

const { t } = useI18n()
const activeSource = ref<RegistrySource>('mirror')
const image = computed(() =>
  activeSource.value === 'mirror' ? homeLinks.dockerMirrorImage : homeLinks.dockerHubImage,
)
const sourceOptions = computed(() => [
  {
    id: 'mirror' as const,
    label: t('install.docker.mirror'),
    hostname: 'hub.fnknock.cn',
    description: t('install.docker.mirrorDescription'),
  },
  {
    id: 'dockerHub' as const,
    label: t('install.docker.dockerHub'),
    hostname: 'docker.io',
    description: t('install.docker.dockerHubDescription'),
  },
])
const activeSourceOption = computed(() =>
  sourceOptions.value.find((option) => option.id === activeSource.value),
)

const requirementsCommand = ['docker version', 'docker compose version'].join('\n')
const prepareCommand = ['mkdir -p /opt/fn-knock-docker', 'cd /opt/fn-knock-docker'].join('\n')
const pullCommand = computed(() => `docker pull ${image.value}`)
const envFile = computed(() =>
  [
    `FN_KNOCK_IMAGE=${image.value}`,
    'TZ=Asia/Shanghai',
    'ADMIN_VIEW_PORT=7991',
    'BACKEND_PORT=7998',
    'AUTH_PORT=7997',
    'GO_BACKEND_PORT=7996',
    'GO_REPROXY_PORT=7999',
    'FN_KNOCK_DOCKER_IPV4_SUBNET=172.30.0.0/16',
    'FN_KNOCK_DOCKER_IPV6_SUBNET=fd42:fb33:7f7a:100::/64',
    'DOCKER_ADMIN_TRUSTED_PROXY_CIDRS=',
    'DOCKER_DISCOVER_LAN_IP=',
  ].join('\n'),
)
const configItems = computed(() => [
  {
    name: 'FN_KNOCK_IMAGE',
    value: image.value,
    description: t('install.docker.imageConfigDescription'),
  },
  {
    name: 'ADMIN_VIEW_PORT / GO_REPROXY_PORT',
    value: '7991 / 7999',
    description: t('install.docker.publicPortsConfigDescription'),
  },
  {
    name: 'FN_KNOCK_DOCKER_IPV4_SUBNET',
    value: '172.30.0.0/16',
    description: t('install.docker.ipv4ConfigDescription'),
  },
  {
    name: 'FN_KNOCK_DOCKER_IPV6_SUBNET',
    value: 'fd42:fb33:7f7a:100::/64',
    description: t('install.docker.ipv6ConfigDescription'),
  },
  {
    name: 'DOCKER_ADMIN_TRUSTED_PROXY_CIDRS',
    value: t('install.docker.optionalValue'),
    description: t('install.docker.trustedProxyConfigDescription'),
  },
  {
    name: 'DOCKER_DISCOVER_LAN_IP',
    value: t('install.docker.optionalValue'),
    description: t('install.docker.discoverLanConfigDescription'),
  },
])
const composeFile = [
  'services:',
  '  fn-knock:',
  '    image: ${FN_KNOCK_IMAGE}',
  '    restart: unless-stopped',
  '    environment:',
  '      TZ: ${TZ:-Asia/Shanghai}',
  '      FN_KNOCK_RUNTIME_TARGET: docker',
  '      FN_KNOCK_DATA_DIR: /var/lib/fn-knock',
  '      FN_KNOCK_GATEWAY_CONFIG_DIR: /usr/local/etc/fn-knock',
  '      ADMIN_VIEW_PORT: ${ADMIN_VIEW_PORT:-7991}',
  '      BACKEND_PORT: ${BACKEND_PORT:-7998}',
  '      AUTH_PORT: ${AUTH_PORT:-7997}',
  '      GO_BACKEND_PORT: ${GO_BACKEND_PORT:-7996}',
  '      GO_REPROXY_PORT: ${GO_REPROXY_PORT:-7999}',
  '      DOCKER_ADMIN_TRUSTED_PROXY_CIDRS: ${DOCKER_ADMIN_TRUSTED_PROXY_CIDRS:-}',
  '      DOCKER_DISCOVER_LAN_IP: ${DOCKER_DISCOVER_LAN_IP:-}',
  '      DDNS_HOST_IF_INET6_PATH: /host/proc/net/if_inet6',
  '      ADMIN_VIEW_HOST: 0.0.0.0',
  '      BACKEND_HOST: 127.0.0.1',
  '    ports:',
  '      - "${ADMIN_VIEW_PORT:-7991}:${ADMIN_VIEW_PORT:-7991}"',
  '      - "${GO_REPROXY_PORT:-7999}:${GO_REPROXY_PORT:-7999}"',
  '    networks:',
  '      - fn_knock_net',
  '    volumes:',
  '      - fn_knock_data:/var/lib/fn-knock',
  '      - fn_knock_gateway:/usr/local/etc/fn-knock',
  '      - type: bind',
  '        source: /proc/net/if_inet6',
  '        target: /host/proc/net/if_inet6',
  '        read_only: true',
  '    healthcheck:',
  '      test:',
  '        [',
  '          "CMD-SHELL",',
  '          "curl -fsS http://127.0.0.1:${ADMIN_VIEW_PORT:-7991}/api/admin/healthz || exit 1",',
  '        ]',
  '      interval: 10s',
  '      timeout: 5s',
  '      retries: 12',
  '      start_period: 20s',
  '',
  'volumes:',
  '  fn_knock_data:',
  '  fn_knock_gateway:',
  '',
  'networks:',
  '  fn_knock_net:',
  '    enable_ipv6: true',
  '    ipam:',
  '      config:',
  '        - subnet: ${FN_KNOCK_DOCKER_IPV4_SUBNET:-172.30.0.0/16}',
  '        - subnet: ${FN_KNOCK_DOCKER_IPV6_SUBNET:-fd42:fb33:7f7a:100::/64}',
].join('\n')
const quickInstallCommand = computed(() =>
  [
    "sh <<'FN_KNOCK_INSTALL'",
    'set -eu',
    '',
    'if [ "$(id -u)" -ne 0 ]; then',
    '  echo "Please run this installer in a root terminal." >&2',
    '  exit 1',
    'fi',
    '',
    'command -v docker >/dev/null 2>&1 || { echo "Docker is not installed." >&2; exit 1; }',
    'docker compose version >/dev/null 2>&1 || { echo "Docker Compose is not available." >&2; exit 1; }',
    'if [ ! -r /proc/net/if_inet6 ] || ! awk \'$4 == "00" { found=1 } END { exit !found }\' /proc/net/if_inet6; then',
    '  echo "No usable global IPv6 interface was found on this host." >&2',
    '  exit 1',
    'fi',
    '',
    'install_dir=/opt/fn-knock-docker',
    'mkdir -p "$install_dir"',
    'cd "$install_dir"',
    '',
    'if [ -e .env ] || [ -e docker-compose.yml ]; then',
    '  echo "Existing .env or docker-compose.yml found; installation stopped." >&2',
    '  exit 1',
    'fi',
    '',
    "cat > .env <<'FN_KNOCK_ENV'",
    envFile.value,
    'FN_KNOCK_ENV',
    '',
    "cat > docker-compose.yml <<'FN_KNOCK_COMPOSE'",
    composeFile,
    'FN_KNOCK_COMPOSE',
    '',
    'docker compose pull',
    'docker compose up -d',
    'docker compose ps',
    'FN_KNOCK_INSTALL',
  ].join('\n'),
)
const portItems = computed(() => [
  {
    port: '7991',
    name: t('install.docker.adminService'),
    scope: t('install.docker.hostMapped'),
    note: t('install.docker.adminPortNote'),
  },
  {
    port: '7999',
    name: t('install.docker.gatewayService'),
    scope: t('install.docker.hostMapped'),
    note: t('install.docker.gatewayPortNote'),
  },
  {
    port: '7998',
    name: t('install.docker.rustBackendService'),
    scope: t('install.docker.containerOnly'),
    note: t('install.docker.internalPortNote'),
  },
  {
    port: '7997',
    name: t('install.docker.authFrontendService'),
    scope: t('install.docker.containerOnly'),
    note: t('install.docker.internalPortNote'),
  },
  {
    port: '7996',
    name: t('install.docker.goAdminService'),
    scope: t('install.docker.containerOnly'),
    note: t('install.docker.internalPortNote'),
  },
])
const startCommand = [
  'docker compose up -d',
  'docker compose ps',
  'docker compose logs -f fn-knock',
].join('\n')
const updateCommand = [
  'cd /opt/fn-knock-docker',
  'docker compose pull',
  'docker compose up -d',
  'docker compose ps',
].join('\n')
const resetPanelPasswordCommand =
  'cd /opt/fn-knock-docker && docker compose exec -T fn-knock fn-knock-reset-panel-password'
</script>

<template>
  <div class="docker-page px-4 py-8 sm:px-6 sm:py-12">
    <section class="mx-auto max-w-6xl">
      <InstallBackLink tone="warm" />

      <header class="page-intro mt-12 max-w-5xl">
        <CurrentVersionLink class="mb-5" />
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
          {{ t('install.docker.title') }}
        </h1>
        <p class="mt-6 max-w-3xl text-base leading-8 sm:text-lg">
          {{ t('install.docker.intro') }}
        </p>
        <a
          :href="homeLinks.dockerHub"
          target="_blank"
          rel="noopener noreferrer"
          class="docker-hub-link mt-7 inline-flex items-center gap-2 text-sm font-semibold"
        >
          {{ t('install.docker.dockerHubLink') }}
          <ExternalLink class="h-4 w-4" aria-hidden="true" />
        </a>
      </header>

      <section class="source-panel mt-12 max-w-5xl" aria-labelledby="docker-source-title">
        <div class="source-heading">
          <h2 id="docker-source-title">{{ t('install.docker.sourceTitle') }}</h2>
        </div>
        <div class="source-switch" role="group" :aria-label="t('install.docker.sourceLabel')">
          <button
            v-for="option in sourceOptions"
            :key="option.id"
            type="button"
            class="source-option"
            :class="{ 'is-active': activeSource === option.id }"
            :data-source="option.id"
            :aria-pressed="activeSource === option.id"
            @click="activeSource = option.id"
          >
            <span>{{ option.label }}</span>
            <small>{{ option.hostname }}</small>
          </button>
        </div>

        <div class="source-summary" aria-live="polite">
          <p>{{ activeSourceOption?.description }}</p>
          <code data-testid="selected-image">{{ image }}</code>
        </div>
      </section>

      <section class="quick-install mt-14 max-w-5xl" aria-labelledby="quick-install-title">
        <h2 id="quick-install-title">{{ t('install.docker.quickInstallTitle') }}</h2>
        <p class="quick-install-description">{{ t('install.docker.quickInstallDescription') }}</p>
        <p class="quick-install-source">
          <span>{{ t('install.docker.quickInstallSource') }}</span>
          <code>{{ image }}</code>
        </p>
        <DockerCodeBlock
          class="mt-6"
          data-testid="quick-install-command"
          :title="t('install.docker.quickInstallTerminal')"
          :code="quickInstallCommand"
        />
        <p class="quick-install-note">{{ t('install.docker.quickInstallSafety') }}</p>
      </section>

      <section class="install-steps mt-16 max-w-5xl" :aria-label="t('install.docker.stepsTitle')">
        <div class="steps-heading">
          <h2>{{ t('install.docker.stepsTitle') }}</h2>
        </div>

        <article class="install-step">
          <p class="step-number">01</p>
          <div>
            <h3>{{ t('install.docker.requirementsTitle') }}</h3>
            <p>{{ t('install.docker.requirementsDescription') }}</p>
            <DockerCodeBlock class="mt-6" title="Terminal" :code="requirementsCommand" />
          </div>
        </article>

        <article class="install-step">
          <p class="step-number">02</p>
          <div>
            <h3>{{ t('install.docker.prepareTitle') }}</h3>
            <p>{{ t('install.docker.prepareDescription') }}</p>
            <DockerCodeBlock class="mt-6" title="Terminal" :code="prepareCommand" />
            <DockerCodeBlock class="mt-4" title="Docker pull" :code="pullCommand" />
          </div>
        </article>

        <article class="install-step">
          <p class="step-number">03</p>
          <div>
            <h3>{{ t('install.docker.environmentTitle') }}</h3>
            <p>{{ t('install.docker.environmentDescription') }}</p>
            <DockerCodeBlock class="mt-6" title=".env" :code="envFile" />
            <div class="config-reference mt-6">
              <h4>{{ t('install.docker.configReferenceTitle') }}</h4>
              <dl>
                <div v-for="item in configItems" :key="item.name">
                  <dt>
                    <code>{{ item.name }}</code>
                    <span>{{ item.value }}</span>
                  </dt>
                  <dd>{{ item.description }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </article>

        <article class="install-step">
          <p class="step-number">04</p>
          <div>
            <h3>{{ t('install.docker.composeTitle') }}</h3>
            <p>{{ t('install.docker.composeDescription') }}</p>
            <DockerCodeBlock class="mt-6" title="docker-compose.yml" :code="composeFile" />
          </div>
        </article>

        <article class="install-step">
          <p class="step-number">05</p>
          <div>
            <h3>{{ t('install.docker.startTitle') }}</h3>
            <p>{{ t('install.docker.startDescription') }}</p>
            <DockerCodeBlock class="mt-6" title="Terminal" :code="startCommand" />
          </div>
        </article>
      </section>

      <section class="after-install mt-14 max-w-5xl">
        <h2>{{ t('install.docker.afterInstallTitle') }}</h2>
        <p class="section-description">{{ t('install.docker.afterInstallDescription') }}</p>
        <PortTable
          class="mt-6"
          tone="warm"
          :items="portItems"
          :scope-label="t('install.docker.exposureScope')"
          :caption="t('install.docker.portsCaption')"
        />
        <ol class="first-run-list">
          <li>{{ t('install.docker.firstRun1') }}</li>
          <li>{{ t('install.docker.firstRun2') }}</li>
          <li>{{ t('install.docker.firstRun3') }}</li>
          <li>{{ t('install.docker.firstRun4') }}</li>
          <li>{{ t('install.docker.firstRun5') }}</li>
        </ol>
      </section>

      <section class="update-section mt-12 max-w-5xl">
        <h2>{{ t('install.docker.updateTitle') }}</h2>
        <p class="section-description">{{ t('install.docker.updateDescription') }}</p>
        <DockerCodeBlock class="mt-7" title="Terminal" :code="updateCommand" />
      </section>

      <section class="reset-password-section mt-12 max-w-5xl">
        <h2>{{ t('install.docker.resetPasswordTitle') }}</h2>
        <p class="section-description">{{ t('install.docker.resetPasswordDescription') }}</p>
        <DockerCodeBlock
          class="mt-7"
          data-testid="reset-panel-password-command"
          title="Terminal"
          :code="resetPanelPasswordCommand"
        />
        <p class="reset-password-note">{{ t('install.docker.resetPasswordNote') }}</p>
      </section>
    </section>
  </div>
</template>

<style scoped>
.docker-page {
  background: #fff;
  color: #262522;
  min-height: calc(100vh - 4rem);
  padding-bottom: 6rem;
}
.page-intro h1 {
  color: #20211f;
  font-weight: 650;
  letter-spacing: -0.05em;
  line-height: 1.05;
}
.page-intro p,
.install-step > div > p,
.section-description {
  color: #6f6b64;
}
.docker-hub-link {
  color: #4f5964;
  text-decoration: underline;
  text-decoration-color: #b9bec4;
  text-underline-offset: 0.35rem;
}
.docker-hub-link:hover {
  color: #075985;
  text-decoration-color: #0ea5e9;
}
.source-panel {
  border-bottom: 1px solid #d8d4cc;
  border-top: 1px solid #827d74;
  padding: 1.6rem 0.25rem 1.75rem;
}
.source-heading {
  max-width: 42rem;
}
.source-heading h2,
.steps-heading h2,
.after-install h2,
.update-section h2,
.reset-password-section h2 {
  color: #292824;
  font-size: clamp(1.55rem, 3vw, 2rem);
  font-weight: 650;
  letter-spacing: -0.035em;
}
.source-switch {
  border: 1px solid #c9c4bc;
  border-radius: 0.4rem;
  display: grid;
  flex-shrink: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 1.35rem;
  overflow: hidden;
  width: min(100%, 28rem);
}
.source-option {
  align-items: flex-start;
  background: #fff;
  color: #5e5a54;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  justify-content: center;
  min-height: 3.25rem;
  padding: 0.55rem 0.85rem;
  text-align: left;
  transition:
    background-color 0.16s ease,
    color 0.16s ease;
}
.source-option + .source-option {
  border-left: 1px solid #c9c4bc;
}
.source-option span {
  font-size: 0.78rem;
  font-weight: 700;
}
.source-option small {
  color: #928d84;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.65rem;
  font-weight: 500;
}
.source-option:hover {
  background: #f5f4f1;
  color: #292824;
}
.source-option.is-active {
  background: #292824;
  color: #fff;
}
.source-option.is-active small {
  color: #c8c4bd;
}
.source-option:focus-visible {
  outline: 2px solid #0284c7;
  outline-offset: 3px;
}
.source-summary {
  margin-top: 1rem;
}
.source-summary p {
  color: #6b747a;
  font-size: 0.82rem;
  line-height: 1.7;
  margin-top: 0.35rem;
}
.source-summary code {
  color: #075985;
  display: block;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  margin-top: 0.65rem;
  overflow-wrap: anywhere;
}
.quick-install {
  border-bottom: 1px solid #d8d4cc;
  border-top: 1px solid #827d74;
  padding: 2rem 0.25rem 2.25rem;
}
.quick-install h2 {
  color: #292824;
  font-size: clamp(1.55rem, 3vw, 2rem);
  font-weight: 650;
  letter-spacing: -0.035em;
}
.quick-install-description {
  color: #6f6b64;
  line-height: 1.8;
  margin-top: 0.55rem;
  max-width: 48rem;
}
.quick-install-source {
  align-items: baseline;
  color: #858078;
  display: flex;
  flex-wrap: wrap;
  font-size: 0.75rem;
  gap: 0.45rem 0.75rem;
  margin-top: 1rem;
}
.quick-install-source code {
  color: #075985;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  overflow-wrap: anywhere;
}
.quick-install-note {
  color: #858078;
  font-size: 0.75rem;
  line-height: 1.7;
  margin-top: 0.85rem;
}
.steps-heading {
  border-bottom: 1px solid #b9b4ab;
  padding-bottom: 1.2rem;
}
.install-step {
  border-bottom: 1px solid #ddd9d1;
  display: grid;
  gap: clamp(1rem, 4vw, 3rem);
  grid-template-columns: 3.5rem minmax(0, 1fr);
  padding: 2.7rem 0.25rem 3rem;
}
.install-step > * {
  min-width: 0;
}
.step-number {
  color: #aaa49a;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  padding-top: 0.42rem;
}
.install-step h3 {
  color: #292824;
  font-size: 1.35rem;
  font-weight: 650;
  letter-spacing: -0.025em;
}
.install-step > div > p {
  line-height: 1.85;
  margin-top: 0.55rem;
  max-width: 48rem;
}
.config-reference {
  border-bottom: 1px solid #d8d4cc;
  border-top: 1px solid #827d74;
  padding: 0.2rem 0;
}
.config-reference h4 {
  color: #3c4650;
  font-size: 0.82rem;
  font-weight: 750;
  padding: 0.8rem 0;
}
.config-reference dl {
  display: grid;
  gap: 0;
  margin-top: 0.6rem;
}
.config-reference dl > div {
  border-top: 1px solid #e2e8f0;
  display: grid;
  gap: 0.45rem;
  grid-template-columns: minmax(13rem, 0.9fr) minmax(0, 1.4fr);
  padding: 0.85rem 0;
}
.config-reference dt {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}
.config-reference code {
  color: #075985;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}
.config-reference dt span {
  color: #8a949d;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.68rem;
  overflow-wrap: anywhere;
}
.config-reference dd {
  color: #68737c;
  font-size: 0.78rem;
  line-height: 1.7;
}
.after-install,
.update-section,
.reset-password-section {
  border-bottom: 1px solid #d8d4cc;
  border-top: 1px solid #827d74;
  padding: 2rem 0.25rem 2.25rem;
}
.section-description {
  line-height: 1.8;
  margin-top: 0.55rem;
  max-width: 46rem;
}
.first-run-list {
  color: #5f5b54;
  counter-reset: first-run;
  display: grid;
  gap: 0.75rem;
  list-style: none;
  margin-top: 1.5rem;
}
.first-run-list li {
  align-items: start;
  counter-increment: first-run;
  display: grid;
  gap: 0.8rem;
  grid-template-columns: 2rem minmax(0, 1fr);
  line-height: 1.75;
}
.first-run-list li::before {
  color: #99938a;
  content: '0' counter(first-run);
  font:
    700 0.68rem ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.05em;
  margin-top: 0.22rem;
}
.update-section {
  background: transparent;
}
.reset-password-note {
  color: #858078;
  font-size: 0.75rem;
  line-height: 1.7;
  margin-top: 0.85rem;
}
@media (max-width: 520px) {
  .source-switch {
    width: 100%;
  }
  .source-option {
    padding-inline: 0.7rem;
  }
  .install-step {
    gap: 0.35rem;
    grid-template-columns: minmax(0, 1fr);
    padding-block: 2rem 2.3rem;
  }
  .config-reference dl > div {
    grid-template-columns: 1fr;
  }
  .step-number {
    padding: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .source-option {
    transition: none;
  }
}
</style>

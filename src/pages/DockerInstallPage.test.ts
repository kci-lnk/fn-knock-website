import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { homeLinks } from '@/config/home'
import DockerInstallPage from './DockerInstallPage.vue'

const mountPage = () =>
  mount(DockerInstallPage, {
    global: {
      stubs: {
        RouterLink: true,
      },
    },
  })

describe('DockerInstallPage', () => {
  it('uses the fn-knock mirror by default and switches every image reference to Docker Hub', async () => {
    const wrapper = mountPage()

    expect(wrapper.text()).toContain('官方镜像源')
    expect(wrapper.text()).toContain('hub.fnknock.cn')
    expect(wrapper.text()).toContain('docker.io')
    expect(wrapper.get('[data-testid="selected-image"]').text()).toBe(homeLinks.dockerMirrorImage)
    expect(wrapper.text()).toContain(`docker pull ${homeLinks.dockerMirrorImage}`)
    expect(wrapper.text()).toContain(`FN_KNOCK_IMAGE=${homeLinks.dockerMirrorImage}`)
    expect(wrapper.get('[data-testid="quick-install-command"]').text()).toContain(
      `FN_KNOCK_IMAGE=${homeLinks.dockerMirrorImage}`,
    )

    await wrapper.get('[data-source="dockerHub"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[data-testid="selected-image"]').text()).toBe(homeLinks.dockerHubImage)
    expect(wrapper.text()).toContain(`docker pull ${homeLinks.dockerHubImage}`)
    expect(wrapper.text()).toContain(`FN_KNOCK_IMAGE=${homeLinks.dockerHubImage}`)
    expect(wrapper.get('[data-testid="quick-install-command"]').text()).toContain(
      `FN_KNOCK_IMAGE=${homeLinks.dockerHubImage}`,
    )
  })

  it('keeps the original Docker Hub link and uses the current single-container setup', () => {
    const wrapper = mountPage()
    const dockerHubLink = wrapper.get(`a[href="${homeLinks.dockerHub}"]`)

    expect(dockerHubLink.attributes('target')).toBe('_blank')
    expect(dockerHubLink.attributes('rel')).toContain('noopener')
    expect(wrapper.text()).not.toContain('redis:7-bookworm')
    expect(wrapper.text()).not.toContain('REDIS_HOST')
    expect(wrapper.text()).not.toContain('depends_on')
    expect(wrapper.text()).toContain('fn_knock_data:/var/lib/fn-knock')
    expect(wrapper.text()).toContain('fn_knock_gateway:/usr/local/etc/fn-knock')
  })

  it('documents every current port and the trusted-proxy fallbacks', () => {
    const text = mountPage().text()

    for (const port of ['7991', '7999', '7998', '7997', '7996']) {
      expect(text).toContain(port)
    }
    expect(text).toContain('DOCKER_ADMIN_TRUSTED_PROXY_CIDRS')
    expect(text).toContain('DOCKER_DISCOVER_LAN_IP')
    expect(text).toContain('FN_KNOCK_DOCKER_IPV6_SUBNET')
  })

  it('provides a guarded one-paste installer without overwriting an existing setup', () => {
    const command = mountPage().get('[data-testid="quick-install-command"]').text()

    expect(command).toContain('install_dir=/opt/fn-knock-docker')
    expect(command).toContain('if [ -e .env ] || [ -e docker-compose.yml ]')
    expect(command).toContain("cat > .env <<'FN_KNOCK_ENV'")
    expect(command).toContain("cat > docker-compose.yml <<'FN_KNOCK_COMPOSE'")
    expect(command).toContain('docker compose up -d')
  })

  it('shows the supported Docker admin-panel password reset command', () => {
    const wrapper = mountPage()
    const command = wrapper
      .get('[data-testid="reset-panel-password-command"]')
      .get('pre code')
      .text()

    expect(command).toBe(
      'cd /opt/fn-knock-docker && docker compose exec -T fn-knock fn-knock-reset-panel-password',
    )
    expect(wrapper.text()).toContain('不会删除业务配置')
  })
})

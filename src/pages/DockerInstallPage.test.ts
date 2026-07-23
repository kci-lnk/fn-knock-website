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

  it('defaults to host networking and can switch the complete setup to an IPv6 bridge', async () => {
    const wrapper = mountPage()
    const hostCommand = wrapper.get('[data-testid="quick-install-command"]').text()

    expect(wrapper.findAll('.deployment-options')).toHaveLength(1)
    expect(wrapper.findAll('.option-row')).toHaveLength(2)
    expect(wrapper.findAll('.source-panel')).toHaveLength(0)
    for (const port of ['7991', '7999', '7998', '7997', '7996']) {
      expect(wrapper.text()).toContain(port)
    }
    expect(wrapper.text()).toContain('DOCKER_ADMIN_TRUSTED_PROXY_CIDRS')
    expect(wrapper.text()).toContain('DOCKER_DISCOVER_LAN_IP')
    expect(wrapper.get('[data-testid="selected-network"]').text()).toBe('network_mode: host')
    expect(hostCommand).toContain('network_mode: host')
    expect(hostCommand).not.toContain('ports:')
    expect(hostCommand).not.toContain('enable_ipv6: true')
    expect(hostCommand).not.toContain('FN_KNOCK_DOCKER_IPV6_SUBNET')
    expect(hostCommand).not.toContain('/proc/net/if_inet6')

    await wrapper.get('[data-network="bridge"]').trigger('click')
    await nextTick()

    const bridgeCommand = wrapper.get('[data-testid="quick-install-command"]').text()
    expect(wrapper.get('[data-testid="selected-network"]').text()).toBe('Docker bridge')
    expect(wrapper.text()).toContain('可能导致 DDNS 找不到宿主机网卡或 IPv6')
    expect(bridgeCommand).not.toContain('network_mode: host')
    expect(bridgeCommand).toContain('ports:')
    expect(bridgeCommand).toContain('enable_ipv6: true')
    expect(bridgeCommand).toContain('FN_KNOCK_DOCKER_IPV6_SUBNET')
    expect(bridgeCommand).not.toContain('/proc/net/if_inet6')
    expect(bridgeCommand).not.toContain('DDNS_HOST_IF_INET6_PATH')
  })

  it('provides a guarded one-paste installer without overwriting an existing setup', () => {
    const command = mountPage().get('[data-testid="quick-install-command"]').text()

    expect(command).toContain('install_dir=/opt/fn-knock-docker')
    expect(command).not.toContain('/proc/net/if_inet6')
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

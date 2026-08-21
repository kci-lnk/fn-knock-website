import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/composables/useReleaseDownloads', () => ({
  useReleaseDownloads: () => ({
    resolveDownloadUrl: (packageType: string, architecture: string) =>
      `https://cdn.fnknock.cn/files/current/${packageType}/${architecture}`,
  }),
}))

import MacInstallPage from './MacInstallPage.vue'

describe('MacInstallPage', () => {
  it('publishes the supported one-line installer and both native architectures', () => {
    const wrapper = mount(MacInstallPage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.get('[data-testid="macos-install-command"]').text()).toContain(
      'curl -fsSL https://cdn.fnknock.cn/macos/install.sh | sudo bash',
    )
    expect(wrapper.get('[data-testid="macos-amd64-download"]').attributes('href')).toBe(
      'https://cdn.fnknock.cn/files/current/macos/amd64',
    )
    expect(wrapper.get('[data-testid="macos-arm64-download"]').attributes('href')).toBe(
      'https://cdn.fnknock.cn/files/current/macos/arm64',
    )
    expect(wrapper.text()).toContain('/Library/Application Support/FnKnock')
    expect(wrapper.text()).toContain('不支持 iptables')
    expect(wrapper.text()).toContain('macOS功能局限')
    expect(wrapper.text()).toContain('运行 sudo knock 即可唤起交互式管理菜单')
    expect(wrapper.text()).not.toContain('当前发行包未使用 Apple Developer ID 签名或公证')
  })
})

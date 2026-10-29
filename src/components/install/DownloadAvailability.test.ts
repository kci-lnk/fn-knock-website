import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadLatestRelease, useLatestRelease } from '@/composables/useLatestRelease'
import HomeDownloadActions from '@/components/home/HomeDownloadActions.vue'
import WindowsInstallPage from '@/pages/WindowsInstallPage.vue'
import MacInstallPage from '@/pages/MacInstallPage.vue'
import SynologyInstallPage from '@/pages/SynologyInstallPage.vue'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('release download feedback', () => {
  it('recovers all download surfaces from a timeout and identifies missing packages', async () => {
    vi.useFakeTimers()
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockImplementationOnce(() => new Promise(() => {}))
      .mockResolvedValueOnce(
        Response.json({
          version: '2.5.7',
          release_notes: 'Update',
          packages: {
            fpk: { amd64: { download_url: 'https://cdn.fnknock.cn/test.fpk' } },
            macos: { amd64: { download_url: 'https://cdn.fnknock.cn/test.tar.gz' } },
          },
        }),
      )
    vi.stubGlobal('fetch', fetchMock)
    const options = { global: { stubs: { RouterLink: true, SynologyWaveBackground: true } } }
    const home = mount(HomeDownloadActions, options)
    const windows = mount(WindowsInstallPage, options)
    const mac = mount(MacInstallPage, options)
    const synology = mount(SynologyInstallPage, options)
    try {
      await home.get('.download-action--fnos').trigger('click')
      const pending = loadLatestRelease()
      await vi.advanceTimersByTimeAsync(9_999)
      expect(windows.text()).toContain('正在获取下载信息')
      expect(windows.get('.primary-download').attributes('href')).toBeUndefined()
      // Tutorial navigation is available even while package metadata is loading.
      expect(home.get('.download-action--docker').attributes('to')).toBe('/docker')
      expect(home.get('.download-action--linux').attributes('to')).toBe('/linux')
      await vi.advanceTimersByTimeAsync(1)
      await pending
      expect(useLatestRelease().status.value).toBe('error')
      const signal = fetchMock.mock.calls[0]?.[1]?.signal
      expect(signal?.aborted).toBe(true)
      for (const page of [home, windows, mac, synology]) {
        expect(page.text()).toContain('暂时无法获取下载信息')
      }
      await windows.get('.download-feedback button').trigger('click')
      await flushPromises()
      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(useLatestRelease().status.value).toBe('success')
      expect(windows.get('.primary-download').text()).toContain('该架构暂无安装包')
      expect(mac.get('[data-testid="macos-arm64-download"]').text()).toContain('该架构暂无安装包')
      expect(mac.get('[data-testid="macos-amd64-download"]').attributes('href')).toBe(
        'https://cdn.fnknock.cn/test.tar.gz',
      )
      expect(home.findAll('a.download-menu-option')[0]?.attributes('href')).toBe(
        'https://cdn.fnknock.cn/test.fpk',
      )
      expect(home.findAll('a.download-menu-option')[1]?.text()).toContain('该架构暂无安装包')
      expect(
        synology
          .findAll('[data-synology-arch]')
          .every((link) => link.text().includes('该架构暂无安装包')),
      ).toBe(true)
      const missingLink = windows.get('.primary-download')
      expect(missingLink.attributes('href')).toBeUndefined()
      expect(missingLink.attributes('aria-disabled')).toBe('true')
    } finally {
      for (const page of [home, windows, mac, synology]) page.unmount()
    }
  })
})

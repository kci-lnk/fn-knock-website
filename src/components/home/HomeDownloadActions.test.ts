import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { openWrtDownloads } from '@/config/home'
import HomeDownloadActions from './HomeDownloadActions.vue'

let wrapper: VueWrapper | undefined

const mountDownloadActions = () => {
  wrapper = mount(HomeDownloadActions, {
    attachTo: document.body,
    global: {
      stubs: {
        RouterLink: true,
      },
    },
  })

  return wrapper
}

const useMobileViewport = () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: true,
    media: '(max-width: 767px)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList)
}

const getDisclosures = (mounted: VueWrapper) => {
  const fnOsTrigger = mounted.get('.download-action--fnos')
  const openWrtTrigger = mounted.get('.download-action--openwrt')
  const fnOsPanelId = fnOsTrigger.attributes('aria-controls')
  const openWrtPanelId = openWrtTrigger.attributes('aria-controls')

  if (!fnOsPanelId || !openWrtPanelId) {
    throw new Error('Download disclosures must reference their controlled panels')
  }

  return {
    fnOsPanel: mounted.get(`[id="${fnOsPanelId}"]`),
    fnOsPanelId,
    fnOsTrigger,
    openWrtPanel: mounted.get(`[id="${openWrtPanelId}"]`),
    openWrtPanelId,
    openWrtTrigger,
  }
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe('HomeDownloadActions', () => {
  it('connects both disclosure triggers to persistent controlled panels', () => {
    const mounted = mountDownloadActions()
    const { fnOsPanel, fnOsPanelId, fnOsTrigger, openWrtPanel, openWrtPanelId, openWrtTrigger } =
      getDisclosures(mounted)

    expect(fnOsTrigger.attributes('aria-expanded')).toBe('false')
    expect(fnOsPanel.attributes('id')).toBe(fnOsPanelId)
    expect(fnOsPanel.attributes('aria-labelledby')).toBe(fnOsTrigger.attributes('id'))
    expect(fnOsPanel.isVisible()).toBe(false)

    expect(openWrtTrigger.attributes('aria-expanded')).toBe('false')
    expect(openWrtPanel.attributes('id')).toBe(openWrtPanelId)
    expect(openWrtPanel.attributes('aria-labelledby')).toBe(openWrtTrigger.attributes('id'))
    expect(openWrtPanel.isVisible()).toBe(false)

    expect(mounted.find('[role="menu"]').exists()).toBe(false)
    expect(mounted.find('[role="menuitem"]').exists()).toBe(false)
  })

  it('opens, switches, and toggles the two disclosures without leaving both open', async () => {
    const mounted = mountDownloadActions()
    const { fnOsPanel, fnOsTrigger, openWrtPanel, openWrtTrigger } = getDisclosures(mounted)

    await fnOsTrigger.trigger('click')
    expect(fnOsTrigger.attributes('aria-expanded')).toBe('true')
    expect(fnOsPanel.isVisible()).toBe(true)
    expect(openWrtTrigger.attributes('aria-expanded')).toBe('false')
    expect(openWrtPanel.isVisible()).toBe(false)

    await openWrtTrigger.trigger('click')
    expect(fnOsTrigger.attributes('aria-expanded')).toBe('false')
    expect(fnOsPanel.isVisible()).toBe(false)
    expect(openWrtTrigger.attributes('aria-expanded')).toBe('true')
    expect(openWrtPanel.isVisible()).toBe(true)

    await openWrtTrigger.trigger('click')
    expect(openWrtTrigger.attributes('aria-expanded')).toBe('false')
    expect(openWrtPanel.isVisible()).toBe(false)
  })

  it('closes an open disclosure after an outside click or Escape', async () => {
    const mounted = mountDownloadActions()
    const { fnOsTrigger, openWrtTrigger } = getDisclosures(mounted)

    await fnOsTrigger.trigger('click')
    expect(fnOsTrigger.attributes('aria-expanded')).toBe('true')

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(fnOsTrigger.attributes('aria-expanded')).toBe('false')

    await openWrtTrigger.trigger('click')
    expect(openWrtTrigger.attributes('aria-expanded')).toBe('true')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(openWrtTrigger.attributes('aria-expanded')).toBe('false')
  })

  it('renders the configured platform links and generated OpenWrt package URLs', () => {
    const mounted = mountDownloadActions()
    const { fnOsPanel, openWrtPanel } = getDisclosures(mounted)
    const fnOsLinks = fnOsPanel.findAll('a.download-menu-option')
    const openWrtLinks = openWrtPanel.findAll('a.download-format-link')

    expect(fnOsLinks.map((link) => link.attributes('href'))).toEqual([
      'https://get.fnknock.cn/',
      'https://get.fnknock.cn/?arch=arm64',
    ])
    expect(mounted.get('.download-action--docker').attributes('to')).toBe('/docker')
    expect(mounted.get('.download-action--synology').attributes('to')).toBe('/synology')
    expect(openWrtLinks).toHaveLength(openWrtDownloads.length * 2)

    openWrtLinks.forEach((link, index) => {
      const packageIndex = Math.floor(index / 2)
      const expectedFormat = index % 2 === 0 ? 'apk' : 'ipk'
      const url = new URL(link.attributes('href')!)

      expect(`${url.origin}${url.pathname}`).toBe('https://get.fnknock.cn/')
      expect(url.searchParams.get('type')).toBe(expectedFormat)
      expect(url.searchParams.get('arch')).toBe(openWrtDownloads[packageIndex]?.arch)
    })
  })

  it('opens OpenWrt downloads in a dedicated dialog on mobile', async () => {
    useMobileViewport()
    const mounted = mountDownloadActions()
    await nextTick()
    const openWrtTrigger = mounted.get('.download-action--openwrt')
    const dialogId = openWrtTrigger.attributes('aria-controls')

    expect(openWrtTrigger.attributes('aria-haspopup')).toBe('dialog')
    expect(openWrtTrigger.attributes('aria-expanded')).toBe('false')
    expect(dialogId).toBeTruthy()

    await openWrtTrigger.trigger('click')
    await nextTick()
    await flushPromises()

    const dialog = document.getElementById(dialogId!)
    expect(dialog?.getAttribute('role')).toBe('dialog')
    expect(openWrtTrigger.attributes('aria-expanded')).toBe('true')

    const links = dialog?.querySelectorAll<HTMLAnchorElement>('a.openwrt-dialog-download') ?? []
    expect(links).toHaveLength(openWrtDownloads.length * 2)
    expect(links[0]?.href).toBe('https://get.fnknock.cn/?type=apk&arch=x86_64')
    expect(links[1]?.href).toBe('https://get.fnknock.cn/?type=ipk&arch=x86_64')

    dialog?.querySelector<HTMLButtonElement>('[aria-label="关闭 OpenWrt 下载窗口"]')?.click()
    await nextTick()
    await flushPromises()

    expect(document.getElementById(dialogId!)).toBeNull()
    expect(openWrtTrigger.attributes('aria-expanded')).toBe('false')
  })
})

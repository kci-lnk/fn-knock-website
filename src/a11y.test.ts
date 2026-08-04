import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import axe from 'axe-core'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import HomeDownloadActions from '@/components/home/HomeDownloadActions.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import LanguageSelector from '@/components/layout/LanguageSelector.vue'
import LoginDialog from '@/components/layout/LoginDialog.vue'
import AccessibilityPage from '@/pages/AccessibilityPage.vue'
import ChangelogPage from '@/pages/ChangelogPage.vue'
import DockerInstallPage from '@/pages/DockerInstallPage.vue'
import HomePage from '@/pages/HomePage.vue'
import LegalPage from '@/pages/LegalPage.vue'
import LinuxInstallPage from '@/pages/LinuxInstallPage.vue'
import MacInstallPage from '@/pages/MacInstallPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import SynologyInstallPage from '@/pages/SynologyInstallPage.vue'
import ThirdPartySoftwarePage from '@/pages/ThirdPartySoftwarePage.vue'
import WindowsInstallPage from '@/pages/WindowsInstallPage.vue'

const axeOptions: axe.RunOptions = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
  },
  rules: {
    'color-contrast': { enabled: false },
  },
}

const expectNoViolations = async (root: Element | Document = document) => {
  const { violations } = await axe.run(root, axeOptions)
  const report = violations
    .map(
      (violation) =>
        `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
    )
    .join('\n')

  expect(violations, report).toEqual([])
}

const routerStubs = {
  RouterLink: {
    props: ['to'],
    template: '<a href="#"><slot /></a>',
  },
}

const mockBomResponse = () => ({
  ok: true,
  json: async () => ({
    metadata: {
      timestamp: '2026-07-17T07:15:00.000Z',
    },
    components: [
      {
        'bom-ref': 'pkg:generic/example@1.0.0',
        name: 'example',
        version: '1.0.0',
        licenses: [{ license: { id: 'MIT' } }],
        externalReferences: [{ type: 'website', url: 'https://example.com' }],
        properties: [
          { name: 'fn-knock:ecosystem', value: 'npm' },
          { name: 'fn-knock:scope', value: 'runtime' },
          { name: 'fn-knock:relationship', value: 'direct' },
          { name: 'fn-knock:used-by', value: 'website' },
        ],
      },
    ],
  }),
})

let wrapper: VueWrapper | undefined

beforeEach(() => {
  document.title = 'fn-knock accessibility test'
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.replaceChildren()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('automated accessibility regression', () => {
  it('keeps every route free of detectable WCAG semantic violations', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockBomResponse()))
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '(max-width: 767px)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList)

    const pages = [
      HomePage,
      LinuxInstallPage,
      MacInstallPage,
      DockerInstallPage,
      WindowsInstallPage,
      SynologyInstallPage,
      LegalPage,
      ThirdPartySoftwarePage,
      ChangelogPage,
      AccessibilityPage,
      NotFoundPage,
    ]

    for (const page of pages) {
      wrapper = mount(page, {
        attachTo: document.body,
        global: { stubs: routerStubs },
      })
      await flushPromises()
      await expectNoViolations(wrapper.element)
      wrapper.unmount()
      wrapper = undefined
      document.body.replaceChildren()
    }
  })

  it('audits open disclosures and modal dialogs, not only their closed state', async () => {
    vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([
      new DOMRect(0, 0, 1, 1),
    ] as unknown as DOMRectList)
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '(max-width: 767px)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList)

    wrapper = mount(LanguageSelector, { attachTo: document.body })
    await wrapper.get('.language-trigger').trigger('click')
    await expectNoViolations(wrapper.element)
    wrapper.unmount()
    document.body.replaceChildren()

    wrapper = mount(HomeDownloadActions, {
      attachTo: document.body,
      global: { stubs: routerStubs },
    })
    await wrapper.get('.download-action--fnos').trigger('click')
    await expectNoViolations(wrapper.element)
    await wrapper.get('.download-action--openwrt').trigger('click')
    await expectNoViolations(wrapper.element)
    wrapper.unmount()
    document.body.replaceChildren()

    const app = document.createElement('div')
    app.id = 'app'
    document.body.append(app)
    wrapper = mount(LoginDialog, {
      attachTo: app,
      props: {
        error: '登录未完成',
        open: true,
        remember: true,
        submitting: false,
        'onUpdate:remember': () => undefined,
      },
      global: { stubs: routerStubs },
    })
    await nextTick()
    await flushPromises()
    await expectNoViolations(document)
  })

  it('audits the authenticated header state', async () => {
    wrapper = mount(AppHeader, {
      attachTo: document.body,
      props: {
        loading: false,
        tone: 'dark',
        user: {
          id: 'a11y-user',
          username: 'Accessible User',
          provider: 'qq',
          avatar: 'https://example.com/avatar.png',
        },
      },
      global: { stubs: routerStubs },
    })

    await flushPromises()
    await expectNoViolations(document)
  })
})

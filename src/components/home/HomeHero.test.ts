import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { loadLatestRelease } from '@/composables/useLatestRelease'
import HomeHero from './HomeHero.vue'

const mountHero = () =>
  mount(HomeHero, {
    global: {
      stubs: {
        HomeDownloadActions: true,
        RouterLink: RouterLinkStub,
      },
    },
  })

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('HomeHero capability cards', () => {
  it('describes the high-performance reverse proxy without an MTTF card', () => {
    const wrapper = mountHero()

    expect(wrapper.text()).toContain('反向代理')
    expect(wrapper.text()).toContain('高性能转发')
    expect(wrapper.text()).toContain('开箱即用')
    expect(wrapper.text()).not.toContain('MTTF')
  })
})

describe('HomeHero release announcement', () => {
  it('shows a loading state until the release endpoint resolves', async () => {
    const wrapper = mountHero()
    const releaseLink = wrapper.getComponent(RouterLinkStub)

    expect(releaseLink.text()).toContain('正在获取版本')
    expect(releaseLink.text()).not.toMatch(/V\d/)
    expect(releaseLink.attributes('aria-busy')).toBe('true')
    expect(releaseLink.props('to')).toEqual({ name: 'changelog' })

    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json({ version: '2.1.9', release_notes: '2.1.9 update' })),
    )
    await loadLatestRelease()
    await flushPromises()

    expect(releaseLink.text()).toContain('V2.1.9')
    expect(releaseLink.text()).not.toContain('正在获取版本')
    expect(releaseLink.attributes('aria-busy')).toBeUndefined()
  })
})

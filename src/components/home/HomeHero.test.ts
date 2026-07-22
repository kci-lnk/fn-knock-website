import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
  it('links the current release to the standalone changelog', () => {
    const wrapper = mountHero()
    const releaseLink = wrapper.getComponent(RouterLinkStub)

    expect(releaseLink.text()).toContain('V2.0.8')
    expect(releaseLink.props('to')).toEqual({ name: 'changelog' })
  })
})

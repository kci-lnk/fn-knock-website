import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CurrentVersionLink from './CurrentVersionLink.vue'

describe('CurrentVersionLink', () => {
  it('shows a loading state until the current release is resolved', () => {
    const wrapper = mount(CurrentVersionLink, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    expect(wrapper.text()).toBe('正在获取版本…')
    expect(wrapper.text()).not.toMatch(/V\d/)
    expect(wrapper.getComponent(RouterLinkStub).attributes('aria-busy')).toBe('true')
    expect(wrapper.getComponent(RouterLinkStub).props('to')).toEqual({ name: 'changelog' })
    expect(wrapper.getComponent(RouterLinkStub).classes()).toContain('current-version-link--light')
  })

  it('supports the dark Synology treatment', () => {
    const wrapper = mount(CurrentVersionLink, {
      props: { tone: 'dark' },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    expect(wrapper.getComponent(RouterLinkStub).classes()).toContain('current-version-link--dark')
  })
})

import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CurrentVersionLink from './CurrentVersionLink.vue'

describe('CurrentVersionLink', () => {
  it('shows the current release and links to the changelog', () => {
    const wrapper = mount(CurrentVersionLink, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    expect(wrapper.text()).toBe('V2.0.8')
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

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { en, jaJP, koKR, zhCN, zhHant } from '@/i18n/messages'
import SynologyInstallPage from './SynologyInstallPage.vue'

describe('SynologyInstallPage', () => {
  it('offers an explicit download for every supported DSM architecture', () => {
    const wrapper = mount(SynologyInstallPage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    const links = wrapper.findAll<HTMLAnchorElement>('[data-synology-arch]')
    expect(links.map((link) => link.attributes('data-synology-arch'))).toEqual([
      'x86_64',
      'armv8',
      'armv7',
    ])

    expect(
      links.map((link) => {
        const url = new URL(link.attributes('href')!)
        return [url.searchParams.get('type'), url.searchParams.get('arch')]
      }),
    ).toEqual([
      ['synology', 'x86_64'],
      ['synology', 'armv8'],
      ['synology', 'armv7'],
    ])
  })

  it('highlights the hovered or focused architecture and mutes the others', async () => {
    const wrapper = mount(SynologyInstallPage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })
    const links = wrapper.findAll('[data-synology-arch]')
    const [x86, armv8, armv7] = links

    await x86!.trigger('pointerenter')
    expect(wrapper.get('.download-row').classes()).toContain('has-active-download')
    expect(x86!.classes()).toContain('is-active')
    expect(armv8!.classes()).toContain('is-muted')
    expect(armv7!.classes()).toContain('is-muted')

    await x86!.trigger('pointerleave')
    expect(wrapper.get('.download-row').classes()).not.toContain('has-active-download')

    await armv8!.trigger('focus')
    expect(armv8!.classes()).toContain('is-active')
    expect(x86!.classes()).toContain('is-muted')
    expect(armv7!.classes()).toContain('is-muted')

    await armv8!.trigger('blur')
    expect(wrapper.get('.download-row').classes()).not.toContain('has-active-download')
  })

  it('uses a distinct visual tone for every architecture', () => {
    const wrapper = mount(SynologyInstallPage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    for (const arch of ['x86_64', 'armv8', 'armv7']) {
      expect(wrapper.get(`[data-synology-arch="${arch}"]`).classes()).toContain(
        `primary-download--${arch}`,
      )
    }
  })

  it('links to the complete Synology deployment guide', () => {
    const wrapper = mount(SynologyInstallPage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.get('.guide-link').attributes('href')).toBe(
      'https://docs.fnknock.cn/quick-start/synology-deployment',
    )
  })

  it('explains that the DSM CGI launch does not require another admin password', () => {
    const wrapper = mount(SynologyInstallPage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.text()).toContain('通过 CGI 安全启动，无需另设管理密码')
    expect(wrapper.text()).not.toContain('首次进入时设置管理密码')

    for (const messages of [zhCN, zhHant, en, jaJP, koKR]) {
      expect(messages.install.synology.step3Description).toContain('CGI')
    }
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import LinuxInstallCommand from './LinuxInstallCommand.vue'

describe('LinuxInstallCommand', () => {
  it('uses a root-aware POSIX shell command for curl and wget', async () => {
    const wrapper = mount(LinuxInstallCommand)
    const expectedRunner = '| { if [ "$(id -u)" -eq 0 ]; then sh; else sudo sh; fi; }'

    expect(wrapper.get('.command-text').text()).toContain('wget -qO-')
    expect(wrapper.get('.command-text').text()).toContain(expectedRunner)
    expect(wrapper.text()).toContain('Alpine 默认可直接使用 wget')

    await wrapper.get('.command-tabs button:nth-child(2)').trigger('click')

    expect(wrapper.get('.command-text').text()).toContain('curl -fsSL')
    expect(wrapper.get('.command-text').text()).toContain(expectedRunner)
    expect(wrapper.get('.command-text').text()).not.toContain('sudo bash')
  })
})

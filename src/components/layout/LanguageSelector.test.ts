import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { LOCALE_STORAGE_KEY } from '@/i18n'
import LanguageSelector from './LanguageSelector.vue'

describe('LanguageSelector', () => {
  it('uses an icon-only trigger and switches among all five locales', async () => {
    const wrapper = mount(LanguageSelector, { attachTo: document.body })
    const trigger = wrapper.get('.language-trigger')

    expect(trigger.text()).toBe('')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await trigger.trigger('click')
    const options = wrapper.findAll('[role="menuitemradio"]')
    expect(options.map((option) => option.text())).toEqual([
      '中文简体',
      '中文正體',
      'English',
      '한국어',
      '日本語',
    ])

    await options[2]!.trigger('click')
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    wrapper.unmount()
  })
})

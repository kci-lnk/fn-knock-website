import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppFooter from '@/components/layout/AppFooter.vue'
import { setLocale, type LocaleCode } from '@/i18n'
import router from '@/router'
import AccessibilityPage from './AccessibilityPage.vue'

const routerLinkStub = {
  props: ['to'],
  template: '<a href="#" :data-route-name="typeof to === \'object\' ? to.name : to"><slot /></a>',
}

const mountPage = () =>
  mount(AccessibilityPage, {
    global: {
      stubs: { RouterLink: routerLinkStub },
    },
  })

describe('AccessibilityPage', () => {
  it('publishes the complete, dated WCAG 2.2 Level AA conformance claim', () => {
    const wrapper = mountPage()
    const claim = wrapper.get('[data-testid="conformance-claim"]')
    const wcagLink = claim.get('a[href="https://www.w3.org/TR/WCAG22/"]')

    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(wrapper.get('h1').text()).toBe('无障碍访问声明')
    expect(claim.text()).toContain('完全符合')
    expect(claim.text()).toContain('WCAG 2.2 Level AA')
    expect(claim.text()).toContain('2026 年 7 月 24 日')
    expect(claim.text()).toContain('fn-knock 2.0.10')
    expect(claim.text()).toContain('www.fnknock.cn')
    expect(wcagLink.attributes('target')).toBe('_blank')
    expect(wcagLink.attributes('rel')).toContain('noopener')
    expect(wrapper.text()).toContain('目前没有已知的 WCAG 2.2 AA 例外')
  })

  it.each([
    ['zh-CN', '无障碍访问声明'],
    ['zh-Hant', '無障礙聲明'],
    ['en', 'Accessibility Statement'],
    ['ko-KR', '접근성 선언'],
    ['ja-JP', 'アクセシビリティ・ステートメント'],
  ] satisfies Array<[LocaleCode, string]>)('renders complete %s content', (locale, title) => {
    setLocale(locale)
    const wrapper = mountPage()

    expect(wrapper.get('h1').text()).toBe(title)
    expect(wrapper.get('[data-testid="conformance-claim"]').text()).toContain('WCAG 2.2')
    expect(wrapper.text()).not.toContain('accessibility.')
  })

  it('exposes the public route and page title key', () => {
    const resolved = router.resolve('/accessibility')

    expect(resolved.name).toBe('accessibility')
    expect(resolved.meta.titleKey).toBe('meta.accessibility')
  })

  it('adds a consistent accessibility entry to the global footer', () => {
    const wrapper = mount(AppFooter, {
      global: {
        stubs: { RouterLink: routerLinkStub },
      },
    })
    const accessibilityLink = wrapper.get('[data-route-name="accessibility"]')

    expect(accessibilityLink.text()).toBe('无障碍访问')
    expect(wrapper.get('nav').attributes('aria-label')).toContain('无障碍')
  })
})

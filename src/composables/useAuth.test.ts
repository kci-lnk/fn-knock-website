import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuth } from './useAuth'

const authApiMock = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
}))

vi.mock('@/services/auth', () => ({ authApi: authApiMock }))

const mountAuth = () => {
  let auth!: ReturnType<typeof useAuth>
  const wrapper = mount(
    defineComponent({
      setup() {
        auth = useAuth()
        return () => null
      },
    }),
  )

  return { auth, wrapper }
}

beforeEach(() => {
  authApiMock.getCurrentUser.mockResolvedValue({ authenticated: false, user: null })
  authApiMock.logout.mockReset()
})

afterEach(() => {
  vi.restoreAllMocks()
  window.history.replaceState(null, '', '/')
})

describe('useAuth', () => {
  it('removes login query parameters while preserving other URL and history state', () => {
    const historyState = { source: 'install-page', nested: { step: 2 } }
    window.history.replaceState(
      historyState,
      '',
      '/linux?channel=stable&login=qq&arch=arm64&login_error=denied#install',
    )
    const replaceState = vi.spyOn(window.history, 'replaceState')

    const { auth, wrapper } = mountAuth()

    expect(window.location.pathname).toBe('/linux')
    expect(window.location.search).toBe('?channel=stable&arch=arm64')
    expect(window.location.hash).toBe('#install')
    expect(window.history.state).toEqual(historyState)
    expect(replaceState).toHaveBeenCalledWith(
      historyState,
      '',
      '/linux?channel=stable&arch=arm64#install',
    )
    expect(auth.isLoginDialogOpen.value).toBe(true)
    expect(auth.loginError.value).toContain('QQ 登陆未完成')

    wrapper.unmount()
  })
})

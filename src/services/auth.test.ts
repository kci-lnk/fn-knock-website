import { afterEach, describe, expect, it, vi } from 'vitest'

import { authApi } from './auth'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('authApi', () => {
  it('rejects a successful HTTP response whose body is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response('<html>bad gateway</html>')),
    )

    await expect(authApi.getCurrentUser()).rejects.toThrow('暂时无法获取登录状态')
  })

  it('aborts an in-flight request and clears its timeout', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn<typeof fetch>().mockImplementation((_input, init) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener(
          'abort',
          () => reject(new DOMException('The operation was aborted', 'AbortError')),
          { once: true },
        )
      })
    })
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()

    const request = authApi.getCurrentUser(controller.signal)
    expect(vi.getTimerCount()).toBe(1)

    controller.abort()

    await expect(request).rejects.toThrow('请求超时，请检查网络后重试')
    expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
  })
})

import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useClipboard } from './useClipboard'

const mountClipboard = (
  writeText: (text: string) => Promise<void>,
  options: { resetAfter?: number; fallback?: (text: string) => void } = {},
) => {
  vi.stubGlobal('navigator', { clipboard: { writeText } })

  let clipboard!: ReturnType<typeof useClipboard>
  const wrapper = mount(
    defineComponent({
      setup() {
        clipboard = useClipboard('copy me', options)
        return () => null
      },
    }),
  )

  return { clipboard, wrapper }
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useClipboard', () => {
  it('copies the source text and exposes the copied state', async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
    const { clipboard, wrapper } = mountClipboard(writeText)

    await expect(clipboard.copy()).resolves.toBe(true)

    expect(writeText).toHaveBeenCalledOnce()
    expect(writeText).toHaveBeenCalledWith('copy me')
    expect(clipboard.copied.value).toBe(true)

    wrapper.unmount()
  })

  it('uses the fallback when the Clipboard API rejects', async () => {
    const writeText = vi
      .fn<(text: string) => Promise<void>>()
      .mockRejectedValue(new Error('denied'))
    const fallback = vi.fn<(text: string) => void>()
    const { clipboard, wrapper } = mountClipboard(writeText, { fallback })

    await expect(clipboard.copy()).resolves.toBe(false)

    expect(fallback).toHaveBeenCalledOnce()
    expect(fallback).toHaveBeenCalledWith('copy me')
    expect(clipboard.copied.value).toBe(false)

    wrapper.unmount()
  })

  it('resets the copied state after the configured delay', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
    const { clipboard, wrapper } = mountClipboard(writeText, { resetAfter: 1_000 })

    await clipboard.copy()
    expect(clipboard.copied.value).toBe(true)

    vi.advanceTimersByTime(999)
    expect(clipboard.copied.value).toBe(true)

    vi.advanceTimersByTime(1)
    expect(clipboard.copied.value).toBe(false)

    wrapper.unmount()
  })

  it('clears the pending reset timer when its component unmounts', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
    const { clipboard, wrapper } = mountClipboard(writeText, { resetAfter: 1_000 })

    await clipboard.copy()
    expect(vi.getTimerCount()).toBe(1)

    wrapper.unmount()

    expect(clipboard.copied.value).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })
})

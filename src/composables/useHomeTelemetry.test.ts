import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useHomeTelemetry } from './useHomeTelemetry'

const originalVisibilityDescriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState')

const setDocumentVisibility = (initial: DocumentVisibilityState) => {
  const state = { value: initial }
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state.value,
  })

  return (next: DocumentVisibilityState) => {
    state.value = next
    document.dispatchEvent(new Event('visibilitychange'))
  }
}

const createDesktopMedia = (initialMatches: boolean) => {
  const state = { matches: initialMatches }
  const addEventListener = vi.fn<(type: string, listener: EventListener) => void>()
  const removeEventListener = vi.fn<(type: string, listener: EventListener) => void>()
  const mediaQuery = {
    get matches() {
      return state.matches
    },
    media: '(min-width: 1024px)',
    onchange: null,
    addEventListener,
    removeEventListener,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  } as unknown as MediaQueryList

  const setMatches = (matches: boolean) => {
    state.matches = matches
    const listener = addEventListener.mock.calls.find(([type]) => type === 'change')?.[1]
    listener?.(new Event('change'))
  }

  return { addEventListener, mediaQuery, removeEventListener, setMatches }
}

const mountTelemetry = (desktopMatches = true) => {
  const desktopMedia = createDesktopMedia(desktopMatches)
  vi.spyOn(window, 'matchMedia').mockReturnValue(desktopMedia.mediaQuery)

  let telemetry!: ReturnType<typeof useHomeTelemetry>
  const wrapper = mount(
    defineComponent({
      setup() {
        telemetry = useHomeTelemetry()
        return () => null
      },
    }),
  )

  return { desktopMedia, telemetry, wrapper }
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()

  if (originalVisibilityDescriptor) {
    Object.defineProperty(document, 'visibilityState', originalVisibilityDescriptor)
  } else {
    Reflect.deleteProperty(document, 'visibilityState')
  }
})

describe('useHomeTelemetry', () => {
  it('advances uptime according to real one-second clock intervals', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-13T00:00:00.000Z'))
    setDocumentVisibility('visible')
    const { telemetry, wrapper } = mountTelemetry()

    expect(telemetry.formattedUptime.value).toBe('1小时 12分 45秒')

    vi.advanceTimersByTime(999)
    expect(telemetry.formattedUptime.value).toBe('1小时 12分 45秒')

    vi.advanceTimersByTime(1)
    expect(telemetry.formattedUptime.value).toBe('1小时 12分 46秒')

    wrapper.unmount()
  })

  it('keeps displayed cumulative traffic totals monotonic', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-13T00:00:00.000Z'))
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    setDocumentVisibility('visible')
    const { telemetry, wrapper } = mountTelemetry()
    const inbound = [Number.parseFloat(telemetry.totalInBand.value)]
    const outbound = [Number.parseFloat(telemetry.totalOutBand.value)]

    for (let index = 0; index < 5; index += 1) {
      vi.advanceTimersByTime(3_500)
      inbound.push(Number.parseFloat(telemetry.totalInBand.value))
      outbound.push(Number.parseFloat(telemetry.totalOutBand.value))
    }

    expect(inbound.slice(1).every((value, index) => value >= inbound[index]!)).toBe(true)
    expect(outbound.slice(1).every((value, index) => value >= outbound[index]!)).toBe(true)
    expect(inbound[inbound.length - 1]).toBeGreaterThan(inbound[0]!)
    expect(outbound[outbound.length - 1]).toBeGreaterThan(outbound[0]!)

    wrapper.unmount()
  })

  it('starts and stops timers as the desktop media query changes', () => {
    vi.useFakeTimers()
    setDocumentVisibility('visible')
    const { desktopMedia, wrapper } = mountTelemetry(false)

    expect(vi.getTimerCount()).toBe(0)

    desktopMedia.setMatches(true)
    expect(vi.getTimerCount()).toBe(2)

    desktopMedia.setMatches(false)
    expect(vi.getTimerCount()).toBe(0)

    wrapper.unmount()
  })

  it('starts and stops timers as document visibility changes', () => {
    vi.useFakeTimers()
    const setVisibility = setDocumentVisibility('hidden')
    const { wrapper } = mountTelemetry()

    expect(vi.getTimerCount()).toBe(0)

    setVisibility('visible')
    expect(vi.getTimerCount()).toBe(2)

    setVisibility('hidden')
    expect(vi.getTimerCount()).toBe(0)

    wrapper.unmount()
  })

  it('clears timers and listeners when its component unmounts', () => {
    vi.useFakeTimers()
    setDocumentVisibility('visible')
    const removeDocumentListener = vi.spyOn(document, 'removeEventListener')
    const { desktopMedia, wrapper } = mountTelemetry()

    expect(vi.getTimerCount()).toBe(2)

    wrapper.unmount()

    expect(vi.getTimerCount()).toBe(0)
    expect(desktopMedia.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    expect(removeDocumentListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
  })
})

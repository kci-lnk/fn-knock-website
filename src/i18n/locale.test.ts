import { describe, expect, it } from 'vitest'
import {
  DEFAULT_LOCALE,
  detectBrowserLocale,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  resolveInitialLocale,
} from './locale'

describe('website locale resolution', () => {
  it('normalizes supported browser language variants', () => {
    expect(normalizeLocale('zh-Hant-TW')).toBe('zh-Hant')
    expect(normalizeLocale('zh_HK')).toBe('zh-Hant')
    expect(normalizeLocale('zh-SG')).toBe('zh-CN')
    expect(normalizeLocale('en-AU')).toBe('en')
    expect(normalizeLocale('ko')).toBe('ko-KR')
    expect(normalizeLocale('ja')).toBe('ja-JP')
  })

  it('uses the first supported browser language and falls back to simplified Chinese', () => {
    expect(detectBrowserLocale(['fr-FR', 'ja-JP', 'en-US'])).toBe('ja-JP')
    expect(detectBrowserLocale(['fr-FR', 'de-DE'])).toBe(DEFAULT_LOCALE)
  })

  it('keeps an explicit saved choice ahead of browser detection', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'ko-KR')
    expect(resolveInitialLocale()).toBe('ko-KR')
  })
})

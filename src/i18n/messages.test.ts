import { describe, expect, it } from 'vitest'
import { en, jaJP, koKR, zhCN, zhHant } from './messages'

const collectLeafKeys = (value: unknown, prefix = ''): string[] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix]

  return Object.entries(value).flatMap(([key, child]) =>
    collectLeafKeys(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('website translation catalogs', () => {
  it.each([
    ['zh-Hant', zhHant],
    ['en', en],
    ['ko-KR', koKR],
    ['ja-JP', jaJP],
  ])('%s has the same keys as simplified Chinese', (_locale, messages) => {
    expect(collectLeafKeys(messages).sort()).toEqual(collectLeafKeys(zhCN).sort())
  })
})

export const SUPPORTED_LOCALES = ['zh-CN', 'zh-Hant', 'en', 'ko-KR', 'ja-JP'] as const

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: LocaleCode = 'zh-CN'
export const LOCALE_STORAGE_KEY = 'fn-knock:locale'

export const LOCALE_OPTIONS: ReadonlyArray<{ code: LocaleCode; label: string }> = [
  { code: 'zh-CN', label: '中文简体' },
  { code: 'zh-Hant', label: '中文正體' },
  { code: 'en', label: 'English' },
  { code: 'ko-KR', label: '한국어' },
  { code: 'ja-JP', label: '日本語' },
]

const supportedLocaleSet = new Set<string>(SUPPORTED_LOCALES)

const localeAliases: Record<string, LocaleCode> = {
  zh: 'zh-CN',
  'zh-cn': 'zh-CN',
  'zh-hans': 'zh-CN',
  'zh-hans-cn': 'zh-CN',
  'zh-sg': 'zh-CN',
  'zh-my': 'zh-CN',
  'zh-tw': 'zh-Hant',
  'zh-hk': 'zh-Hant',
  'zh-mo': 'zh-Hant',
  'zh-hant': 'zh-Hant',
  'zh-hant-tw': 'zh-Hant',
  en: 'en',
  'en-us': 'en',
  'en-gb': 'en',
  ko: 'ko-KR',
  'ko-kr': 'ko-KR',
  ja: 'ja-JP',
  'ja-jp': 'ja-JP',
}

export const normalizeLocale = (value: string | null | undefined): LocaleCode | null => {
  const raw = String(value ?? '').trim()
  if (!raw) return null
  if (supportedLocaleSet.has(raw)) return raw as LocaleCode

  const normalized = raw.replace(/_/g, '-').toLowerCase()
  if (localeAliases[normalized]) return localeAliases[normalized]
  if (normalized.startsWith('en-')) return 'en'
  if (normalized.startsWith('ko-')) return 'ko-KR'
  if (normalized.startsWith('ja-')) return 'ja-JP'
  if (normalized.startsWith('zh-hant')) return 'zh-Hant'
  if (normalized.startsWith('zh-')) return 'zh-CN'
  return null
}

const readStoredLocale = (): LocaleCode | null => {
  if (typeof window === 'undefined') return null

  try {
    return normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY))
  } catch {
    return null
  }
}

export const detectBrowserLocale = (
  languages: readonly string[] = typeof navigator === 'undefined'
    ? []
    : navigator.languages?.length
      ? navigator.languages
      : [navigator.language],
): LocaleCode => {
  for (const language of languages) {
    const locale = normalizeLocale(language)
    if (locale) return locale
  }
  return DEFAULT_LOCALE
}

export const resolveInitialLocale = (): LocaleCode => readStoredLocale() ?? detectBrowserLocale()

export const applyDocumentLocale = (locale: LocaleCode) => {
  if (typeof document !== 'undefined') document.documentElement.lang = locale
}

export const persistLocale = (locale: LocaleCode) => {
  applyDocumentLocale(locale)
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // The language still changes for this page when browser storage is unavailable.
  }
}

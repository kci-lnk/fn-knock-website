import { createI18n } from 'vue-i18n'
import { en, jaJP, koKR, zhCN, zhHant } from './messages'
import {
  applyDocumentLocale,
  DEFAULT_LOCALE,
  normalizeLocale,
  persistLocale,
  resolveInitialLocale,
  type LocaleCode,
} from './locale'

const initialLocale = resolveInitialLocale()

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    'zh-CN': zhCN,
    'zh-Hant': zhHant,
    en,
    'ko-KR': koKR,
    'ja-JP': jaJP,
  },
})

applyDocumentLocale(initialLocale)

export const setLocale = (value: string): LocaleCode => {
  const locale = normalizeLocale(value) ?? DEFAULT_LOCALE
  i18n.global.locale.value = locale
  persistLocale(locale)
  return locale
}

export const translate = (key: string, params?: Record<string, string | number>): string =>
  params ? i18n.global.t(key, params) : i18n.global.t(key)

export * from './locale'

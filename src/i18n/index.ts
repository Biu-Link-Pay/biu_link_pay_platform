import { createI18n } from 'vue-i18n'
import { messages } from './messages'
import {
  detectBrowserLocale,
  getStoredLocale,
  storeLocale,
  applyDocumentLang,
  supportedLocales,
  type SupportedLocale
} from './locales'

const fallbackLocale: SupportedLocale = 'en'

const resolveInitialLocale = (): SupportedLocale => {
  const stored = getStoredLocale()
  if (stored) {
    return stored
  }

  const detected = detectBrowserLocale()
  if (detected && supportedLocales.includes(detected)) {
    return detected
  }

  return fallbackLocale
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: resolveInitialLocale(),
  fallbackLocale,
  messages,
  missingWarn: false,
  fallbackWarn: false,
  fallbackFormat: true
})

export const setLocalePreference = (locale: SupportedLocale) => {
  storeLocale(locale)
  applyDocumentLang(locale)
  i18n.global.locale.value = locale
}

applyDocumentLang(i18n.global.locale.value as SupportedLocale)

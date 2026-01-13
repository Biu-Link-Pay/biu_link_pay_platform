export const supportedLocales = ['en', 'zh-TW'] as const

export type SupportedLocale = (typeof supportedLocales)[number]

const localeStorageKey = 'biu-locale'

export const getLocaleStorageKey = () => localeStorageKey

const isSupportedLocale = (locale: string): locale is SupportedLocale =>
  supportedLocales.includes(locale as SupportedLocale)

const normalizeLocale = (rawLocale: string | null | undefined): SupportedLocale | null => {
  if (!rawLocale) {
    return null
  }

  const locale = rawLocale.toLowerCase()

  if (locale.startsWith('zh')) {
    if (locale.includes('hant') || locale.includes('tw') || locale.includes('hk') || locale.includes('mo')) {
      return 'zh-TW'
    }
    return null
  }

  if (locale.startsWith('en')) {
    return 'en'
  }

  return null
}

export const detectBrowserLocale = (): SupportedLocale | null => {
  if (typeof navigator === 'undefined') {
    return null
  }

  const languages = Array.isArray(navigator.languages) ? navigator.languages : []
  const candidates = [...languages, navigator.language]

  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate)
    if (normalized) {
      return normalized
    }
  }

  return null
}

export const getStoredLocale = (): SupportedLocale | null => {
  if (typeof localStorage === 'undefined') {
    return null
  }

  const saved = localStorage.getItem(localeStorageKey)
  if (saved && isSupportedLocale(saved)) {
    return saved
  }

  return null
}

export const storeLocale = (locale: SupportedLocale) => {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.setItem(localeStorageKey, locale)
}

export const applyDocumentLang = (locale: SupportedLocale) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.lang = locale
}

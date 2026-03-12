import { createI18n } from 'vue-i18n'
import en from '@/locales/en'
import zhTW from '@/locales/zh-TW'
import ko from '@/locales/ko'
import ja from '@/locales/ja'
import ru from '@/locales/ru'
import es from '@/locales/es'
import pt from '@/locales/pt'
import tr from '@/locales/tr'
import vi from '@/locales/vi'
import id from '@/locales/id'
import ar from '@/locales/ar'
import hi from '@/locales/hi'
import th from '@/locales/th'
import fr from '@/locales/fr'
import de from '@/locales/de'

/** 浏览器语言到 locale 的映射 */
const BROWSER_LOCALE_MAP: Record<string, string> = {
  ko: 'ko',
  ja: 'ja',
  ru: 'ru',
  es: 'es',
  pt: 'pt',
  tr: 'tr',
  vi: 'vi',
  id: 'id',
  ar: 'ar',
  hi: 'hi',
  th: 'th',
  fr: 'fr',
  de: 'de',
}

/**
 * Detect browser locale from navigator.language.
 * Supports: en, zh-TW, ko, ja, ru, es, pt, tr, vi, id, ar, hi, th, fr, de
 */
function getBrowserLocale(): string {
  try {
    const lang = (typeof navigator !== 'undefined' && (navigator.language || navigator.languages?.[0])) || 'en'
    const lower = String(lang).toLowerCase()
    const base = lower.split('-')[0] || lower

    if (base === 'zh') {
      return (lower.includes('tw') || lower.includes('hk') || lower.includes('hant')) ? 'zh-TW' : 'en'
    }

    return BROWSER_LOCALE_MAP[base] ?? 'en'
  }
  catch {
    return 'en'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-TW': zhTW,
    ko,
    ja,
    ru,
    es,
    pt,
    tr,
    vi,
    id,
    ar,
    hi,
    th,
    fr,
    de,
  },
})

export default i18n

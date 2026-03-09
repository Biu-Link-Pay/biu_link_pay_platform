import { createI18n } from 'vue-i18n'
import en from '@/locales/en'
import zhTW from '@/locales/zh-TW'

/**
 * Detect browser locale: use Traditional Chinese (zh-TW) only when
 * browser language is zh-TW, zh-HK, or zh-Hant. All others use English.
 * 使用 try-catch 防止在非浏览器环境（如 build 阶段）访问 navigator 时报错
 */
function getBrowserLocale(): string {
  try {
    const lang = (typeof navigator !== 'undefined' && (navigator.language || (navigator.languages?.[0]))) || 'en'
    const lower = String(lang).toLowerCase()

    // Traditional Chinese: zh-TW, zh-HK, zh-Hant, zh-Hant-TW, zh-Hant-HK, etc.
    if (lower.startsWith('zh')) {
      if (lower.includes('tw') || lower.includes('hk') || lower.includes('hant')) {
        return 'zh-TW'
      }
    }

    return 'en'
  }
  catch {
    return 'en'
  }
}

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getBrowserLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-TW': zhTW,
  },
})

export default i18n

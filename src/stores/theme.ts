import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  // 当前主题
  const currentTheme = ref<Theme>('system')

  // 实际应用的主题（light 或 dark）
  const appliedTheme = ref<'light' | 'dark'>('light')

  // 系统主题检测
  const systemTheme = ref<'light' | 'dark'>('light')

  // 更新 PrimeVue 主题
  const updatePrimeVueTheme = (_theme: 'light' | 'dark') => {
    const primeVueConfig = document.querySelector('script[data-primevue-config]')
    if (primeVueConfig) {
      // PrimeVue 主题切换逻辑
    }
  }

  // 应用主题
  const applyTheme = () => {
    let themeToApply: 'light' | 'dark'

    if (currentTheme.value === 'system') {
      themeToApply = systemTheme.value
    }
    else {
      themeToApply = currentTheme.value
    }

    console.log('Applying theme:', themeToApply)
    appliedTheme.value = themeToApply

    // 更新 HTML 类名
    const html = document.documentElement
    if (themeToApply === 'dark') {
      html.classList.add('dark')
    }
    else {
      html.classList.remove('dark')
    }

    updatePrimeVueTheme(themeToApply)
  }

  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      currentTheme.value = savedTheme
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemTheme.value = mediaQuery.matches ? 'dark' : 'light'

    mediaQuery.addEventListener('change', (e) => {
      systemTheme.value = e.matches ? 'dark' : 'light'
    })

    applyTheme()
  }

  // 设置主题
  const setTheme = (theme: Theme) => {
    console.log('Setting theme to:', theme)
    currentTheme.value = theme
    localStorage.setItem('theme', theme)
    applyTheme()
  }

  // 切换主题（简单亮暗切换）
  const toggleTheme = () => {
    console.log('Toggle theme called, current theme:', currentTheme.value)
    if (currentTheme.value === 'light') {
      setTheme('dark')
    }
    else {
      setTheme('light')
    }
  }

  // 获取主题图标
  const getThemeIcon = () => {
    switch (appliedTheme.value) {
      case 'light':
        return 'pi pi-sun'
      case 'dark':
        return 'pi pi-moon'
      default:
        return 'pi pi-sun'
    }
  }

  // 获取主题标签
  const getThemeLabel = () => {
    switch (currentTheme.value) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'System'
      default:
        return 'Light'
    }
  }

  // 监听主题变化
  watch([currentTheme, systemTheme], () => {
    applyTheme()
  })

  return {
    currentTheme,
    appliedTheme,
    systemTheme,
    initTheme,
    setTheme,
    toggleTheme,
    getThemeIcon,
    getThemeLabel,
  }
}, {
  persist: {
    key: 'theme-store',
    storage: localStorage,
  },
})

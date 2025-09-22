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

  // 初始化主题
  const initTheme = () => {
    // 从 localStorage 读取保存的主题
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      currentTheme.value = savedTheme
    }

    // 检测系统主题
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemTheme.value = mediaQuery.matches ? 'dark' : 'light'

    // 监听系统主题变化
    mediaQuery.addEventListener('change', (e) => {
      systemTheme.value = e.matches ? 'dark' : 'light'
    })

    // 应用主题
    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    let themeToApply: 'light' | 'dark'

    if (currentTheme.value === 'system') {
      themeToApply = systemTheme.value
    } else {
      themeToApply = currentTheme.value
    }

    console.log('Applying theme:', themeToApply)
    appliedTheme.value = themeToApply

    // 更新 HTML 类名
    const html = document.documentElement
    if (themeToApply === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    // 更新 PrimeVue 主题
    updatePrimeVueTheme(themeToApply)
    
    // 强制触发重新渲染
    setTimeout(() => {
      console.log('Theme applied, HTML classes:', html.className)
    }, 0)
  }

  // 更新 PrimeVue 主题
  const updatePrimeVueTheme = (theme: 'light' | 'dark') => {
    // PrimeVue 主题切换
    const primeVueConfig = document.querySelector('script[data-primevue-config]')
    if (primeVueConfig) {
      // 这里可以添加 PrimeVue 主题切换逻辑
      console.log('PrimeVue theme updated to:', theme)
    }
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
    } else {
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
    getThemeLabel
  }
}, {
  persist: {
    key: 'theme-store',
    storage: localStorage,
    paths: ['currentTheme'] // 只持久化 currentTheme，避免其他状态冲突
  }
})

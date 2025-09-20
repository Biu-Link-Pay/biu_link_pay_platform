<template>
  <div class="relative">
    <!-- 主题切换按钮 -->
    <button @click="handleToggleTheme"
      class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group"
      :title="`Current: ${getThemeLabel()}`">
      <i :class="getThemeIcon()"
        class="text-lg text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:scale-110"></i>
    </button>

    <!-- 主题选择下拉菜单 -->
    <div v-if="showDropdown"
      class="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
      @click.stop>
      <button @click="handleSetTheme('light')"
        class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
        :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': currentTheme === 'light' }">
        <i class="pi pi-sun text-lg"></i>
        <span class="text-sm font-medium">Light</span>
        <i v-if="currentTheme === 'light'" class="pi pi-check text-blue-600 dark:text-blue-400 ml-auto"></i>
      </button>

      <button @click="handleSetTheme('dark')"
        class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
        :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': currentTheme === 'dark' }">
        <i class="pi pi-moon text-lg"></i>
        <span class="text-sm font-medium">Dark</span>
        <i v-if="currentTheme === 'dark'" class="pi pi-check text-blue-600 dark:text-blue-400 ml-auto"></i>
      </button>

      <button @click="handleSetTheme('system')"
        class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
        :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': currentTheme === 'system' }">
        <i class="pi pi-desktop text-lg"></i>
        <span class="text-sm font-medium">System</span>
        <i v-if="currentTheme === 'system'" class="pi pi-check text-blue-600 dark:text-blue-400 ml-auto"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const showDropdown = ref(false)

// 解构 store 方法
const { currentTheme, setTheme, toggleTheme, getThemeIcon, getThemeLabel } = themeStore

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

// 处理主题切换
const handleToggleTheme = () => {
  toggleTheme()
  showDropdown.value = false
}

// 处理主题选择
const handleSetTheme = (theme: 'light' | 'dark' | 'system') => {
  setTheme(theme)
  showDropdown.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 确保下拉菜单在正确的层级 */
.relative {
  position: relative;
}

/* 平滑过渡动画 */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* 悬停效果 */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>

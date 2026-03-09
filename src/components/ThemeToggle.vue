<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const showDropdown = ref(false)

// Destructure store methods
const { currentTheme, setTheme, toggleTheme, getThemeIcon, getThemeLabel } = themeStore

// Click outside to close dropdown menu
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement
  // Only handle click outside events for theme toggle dropdown
  if (!target.closest('[data-theme-toggle]')) {
    showDropdown.value = false
  }
}

// Handle theme toggle
function handleToggleTheme(event: Event) {
  event.preventDefault()
  event.stopPropagation()
  toggleTheme()
  showDropdown.value = false
}

// Handle theme selection
function handleSetTheme(theme: 'light' | 'dark' | 'system') {
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

<template>
  <div class="relative" data-theme-toggle>
    <!-- Theme toggle button -->
    <button
      class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group"
      :title="`Current: ${getThemeLabel()}`"
      @click="handleToggleTheme"
    >
      <i
        :class="getThemeIcon()"
        class="text-lg text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:scale-110"
      />
    </button>

    <!-- Theme selection dropdown menu -->
    <div
      v-if="showDropdown"
      class="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
      @click.stop
    >
      <button
        class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
        :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': currentTheme === 'light' }"
        @click="handleSetTheme('light')"
      >
        <i class="pi pi-sun text-lg" />
        <span class="text-sm font-medium">Light</span>
        <i v-if="currentTheme === 'light'" class="pi pi-check text-blue-600 dark:text-blue-400 ml-auto" />
      </button>

      <button
        class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
        :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': currentTheme === 'dark' }"
        @click="handleSetTheme('dark')"
      >
        <i class="pi pi-moon text-lg" />
        <span class="text-sm font-medium">Dark</span>
        <i v-if="currentTheme === 'dark'" class="pi pi-check text-blue-600 dark:text-blue-400 ml-auto" />
      </button>

      <button
        class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
        :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': currentTheme === 'system' }"
        @click="handleSetTheme('system')"
      >
        <i class="pi pi-desktop text-lg" />
        <span class="text-sm font-medium">System</span>
        <i v-if="currentTheme === 'system'" class="pi pi-check text-blue-600 dark:text-blue-400 ml-auto" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Ensure dropdown menu is at correct z-index */
.relative {
  position: relative;
}

/* Smooth transition animation */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>

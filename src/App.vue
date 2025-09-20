<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <router-view />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

// 初始化主题
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

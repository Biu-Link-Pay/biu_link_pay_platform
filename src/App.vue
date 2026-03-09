<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import { onMounted } from 'vue'
import ContactUs from '@/components/ContactUs.vue'
import CookieConsent from '@/components/CookieConsent.vue'
import { useThemeStore } from '@/stores/theme'

// 初始化主题
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" v-if="route.meta.keepAlive" :key="route.path" />
      </keep-alive>
      <component :is="Component" v-if="!route.meta.keepAlive" :key="route.path" />
    </router-view>
    <Toast />
    <ConfirmDialog />
    <CookieConsent />
    <ContactUs />
  </div>
</template>

<template>
  <nav
    class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-200">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
          <img src="https://static.biulinkpay.online/logo/biu_blue.png" alt="BiuLinkPay" class="w-full h-full object-contain" />
        </div>
        <div v-if="showTitle" class="hidden sm:block">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h1>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Theme toggle button -->
        <div data-theme-toggle>
          <ThemeToggle />
        </div>

        <slot name="actions">
          <!-- User avatar and menu -->
          <div v-if="isLoggedIn" class="relative">
            <!-- PC: Avatar + Username + Floating Menu -->
            <div
              class="hidden md:flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
              @click="toggleUserMenu">
              <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                <img v-if="userAvatar" :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
                <div v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                  {{ userName.charAt(0).toUpperCase() }}
                </div>
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ userName }}
              </span>
              <i class="pi pi-chevron-down text-xs text-gray-500 transition-transform"
                :class="{ 'rotate-180': showUserMenu }"></i>
            </div>

            <!-- Mobile: Only show avatar, click to go to profile -->
            <div class="md:hidden w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 cursor-pointer"
              @click="goToProfile">
              <img v-if="userAvatar" :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
              <div v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                {{ userName.charAt(0).toUpperCase() }}
              </div>
            </div>

            <!-- PC user menu floating box -->
            <div v-if="showUserMenu"
              class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
              @click.stop>
              <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ userEmail }}</p>
              </div>

              <button
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                @click="goToMyCards">
                <i class="pi pi-credit-card text-gray-500"></i>
                <span>My Cards</span>
              </button>

              <button
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                @click="goToProfile">
                <i class="pi pi-user text-gray-500"></i>
                <span>Profile</span>
              </button>

              <button
                class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
                @click="confirmLogout">
                <i class="pi pi-sign-out text-red-500"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>

          <!-- Show login button when not logged in -->
          <Button v-else-if="showLogin" label="Login" text class="text-gray-600 hover:text-gray-900"
            @click="goToLogin" />
        </slot>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from './ThemeToggle.vue'

interface Props {
  title?: string
  showTitle?: boolean
  showLogin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showTitle: false,
  showLogin: true
})

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const authStore = useAuthStore()

// Reactive data
const showUserMenu = ref(false)

// Computed properties
const isLoggedIn = computed(() => authStore.isLoggedIn)
const currentUser = computed(() => authStore.currentUser)
const userName = computed(() => {
  if (currentUser.value?.name) {
    return currentUser.value.name
  }
  if (currentUser.value?.email) {
    return currentUser.value.email.split('@')[0]
  }
  return 'User'
})
const userEmail = computed(() => currentUser.value?.email || '')
const userAvatar = computed(() => currentUser.value?.avatar)

// Toggle user menu
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Navigate to my cards
const goToMyCards = () => {
  showUserMenu.value = false
  router.push('/my-cards')
}

// Navigate to profile
const goToProfile = () => {
  showUserMenu.value = false
  // Here you can navigate to profile page
  toast.add({
    severity: 'info',
    summary: 'Profile',
    detail: 'Profile feature is under development...',
    life: 2000
  })
}

// Navigate to login page
const goToLogin = () => {
  router.push('/login')
}

// Confirm logout
const confirmLogout = () => {
  console.log('显示登出确认对话框')
  showUserMenu.value = false
  confirm.require({
    message: 'Are you sure you want to logout?',
    header: 'Confirm Logout',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Confirm',
    accept: () => {
      console.log('用户确认登出')
      handleLogout()
    },
    reject: () => {
      console.log('用户取消登出')
    }
  })
}

// Logout handling
const handleLogout = async () => {
  try {
    console.log('开始登出流程...')
    await authStore.logout()
    console.log('登出成功')
    
    toast.add({
      severity: 'success',
      summary: 'Logged Out',
      detail: 'You have been logged out successfully',
      life: 3000
    })
    
    // 延迟跳转，让用户看到成功消息
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (error) {
    console.error('登出失败:', error)
    toast.add({
      severity: 'error',
      summary: 'Logout Failed',
      detail: 'Failed to logout. Please try again.',
      life: 3000
    })
  }
}

// Click outside to close menu
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  // 检查是否点击了用户菜单区域，而不是主题切换按钮
  if (!target.closest('.relative') && !target.closest('[data-theme-toggle]')) {
    showUserMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Responsive design */
@media (max-width: 640px) {
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .py-4 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
}

/* Dark mode support */
.dark .bg-white {
  background-color: #1f2937;
}

.dark .border-gray-200 {
  border-color: #374151;
}

.dark .text-gray-900 {
  color: #f9fafb;
}

/* User menu animation */
.rotate-180 {
  transform: rotate(180deg);
}

/* Avatar styles */
.w-8.h-8 {
  min-width: 2rem;
  min-height: 2rem;
}

/* Menu item hover effects */
button:hover {
  transform: translateX(2px);
}

/* Menu shadow effects */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dark .shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}
</style>

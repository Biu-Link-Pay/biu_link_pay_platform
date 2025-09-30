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
            <div
              class="md:hidden w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 cursor-pointer"
              @click="toggleMobileMenu"
            >
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

  <!-- Mobile slide-out menu -->
  <Transition name="fade">
    <div
      v-if="showMobileMenu"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
      @click="closeMobileMenu"
    ></div>
  </Transition>
  <Transition name="slide-in-right">
    <div
      v-if="showMobileMenu"
      class="fixed inset-y-0 right-0 z-50 w-72 max-w-[18rem] md:hidden bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col"
      @click.stop
    >
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <img v-if="userAvatar" :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
            <div v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
              {{ userName.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ userName }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ userEmail }}</p>
          </div>
        </div>
        <button class="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white" @click="closeMobileMenu">
          <i class="pi pi-times text-lg"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto py-4">
        <div v-if="isLoggedIn" class="space-y-2 px-4">
          <button
            class="w-full flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="handleMobileNavigate(goToMyCards)"
          >
            <i class="pi pi-credit-card text-gray-500"></i>
            <span>My Cards</span>
          </button>
          <button
            class="w-full flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="handleMobileNavigate(goToProfile)"
          >
            <i class="pi pi-user text-gray-500"></i>
            <span>Profile</span>
          </button>
          <button
            class="w-full flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            @click="handleMobileNavigate(confirmLogout)"
          >
            <i class="pi pi-sign-out text-red-500"></i>
            <span>Logout</span>
          </button>
        </div>
        <div v-else-if="showLogin" class="px-5 py-4">
          <Button label="Login" class="w-full" @click="handleMobileNavigate(goToLogin)" />
        </div>
        <div v-else class="px-5 py-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">Welcome to BiuLinkPay</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
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
const userStore = useUserStore()

// Reactive data
const showUserMenu = ref(false)

// Computed properties
const isLoggedIn = computed(() => authStore.isLoggedIn)
const currentUser = computed(() => authStore.currentUser)
const userName = computed(() => {
  // 优先使用 userStore 中的 firstName (接口返回的字段)
  if (userStore.user && userStore.user.firstName) {
    return userStore.user.firstName
  }
  // 然后使用 authStore 中的 name
  if (currentUser.value?.name) {
    return currentUser.value.name
  }
  // 最后使用 email 的用户名部分
  if (userStore.user?.email) {
    return userStore.user?.email.split('@')[0]
  }
  return 'User'
})
const userEmail = computed(() => userStore.user?.email || '')
const userAvatar = computed(() => currentUser.value?.avatar)

const showMobileMenu = ref(false)
let previousBodyOverflow: string | null = null

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleMobileNavigate = (callback: () => void) => {
  closeMobileMenu()
  callback()
}

// Toggle user menu
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Navigate to my cards
const goToMyCards = () => {
  showUserMenu.value = false
  closeMobileMenu()
  router.push('/my-cards')
}

// Navigate to profile
const goToProfile = () => {
  showUserMenu.value = false
  closeMobileMenu()
  router.push('/personal-center')
}

// Navigate to login page
const goToLogin = () => {
  closeMobileMenu()
  router.push('/login')
}

// Confirm logout
const confirmLogout = () => {
  console.log('显示登出确认对话框')
  showUserMenu.value = false
  closeMobileMenu()
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
    router.push('/login')
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

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showMobileMenu.value) {
    closeMobileMenu()
  }
}

watch(showMobileMenu, value => {
  if (value) {
    previousBodyOverflow = document.body.style.overflow ? document.body.style.overflow : null
    document.body.style.overflow = 'hidden'
  } else {
    if (previousBodyOverflow !== null) {
      document.body.style.overflow = previousBodyOverflow
      previousBodyOverflow = null
    } else {
      document.body.style.removeProperty('overflow')
    }
  }
})

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
  if (showMobileMenu.value) {
    showMobileMenu.value = false
  } else if (previousBodyOverflow !== null) {
    document.body.style.overflow = previousBodyOverflow
    previousBodyOverflow = null
  } else {
    document.body.style.removeProperty('overflow')
  }
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

/* Mobile menu transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: transform 0.25s ease;
}

.slide-in-right-enter-from,
.slide-in-right-leave-to {
  transform: translateX(100%);
}

</style>

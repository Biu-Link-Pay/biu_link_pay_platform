<template>
  <nav
    class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-200">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90"
          role="button" :aria-label="$t('Go to cards')" :title="$t('Go to cards')" @click="onLogoClick">
          <img src="https://static.biulinkpay.online/logo/biu_blue.png" alt="BiuLinkPay"
            class="w-full h-full object-contain" />
        </div>
        <div v-if="showTitle" class="hidden sm:block">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h1>
        </div>
      </div>

      <div class="flex items-center">
        <!-- Theme toggle button -->
        <div data-theme-toggle>
          <ThemeToggle />
        </div>

        <!-- Language switcher -->
        <div class="ml-3">
          <label class="sr-only" for="locale-select">{{ $t('Language') }}</label>
          <div class="relative">
            <select
              id="locale-select"
              v-model="locale"
              class="appearance-none text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-full pl-3 pr-8 py-1.5 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :aria-label="$t('Language')">
              <option value="en">{{ $t('English') }}</option>
              <option value="zh-TW">{{ $t('Traditional Chinese') }}</option>
            </select>
            <i
              class="pi pi-angle-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400"></i>
          </div>
        </div>

        <!-- Card reward points (desktop) -->
        <div v-if="isLoggedIn"
          class="card-points-desktop hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-2xl    text-gray-900 dark:text-white cursor-default">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center points-icon-animate">
            <img :src="coinsIcon" :alt="$t('Card Points')" class="w-6 h-6 object-contain" />
          </div>
          <div class="flex items-center gap-1">
            <p :class="[
              'text-lg font-extrabold tracking-wide tabular-nums',
              { 'animate-pulse opacity-70': !hasCardRewardPoints }
            ]">
              {{ formattedCardRewardPoints }}
            </p>
            <span v-tooltip.bottom="{ value: $t('100 pts = 1 USD'), class: 'points-tooltip' }"
              class="inline-flex items-center justify-center w-4 h-4 rounded-full dark:bg-white/25 bg-gray-900/25 text-[10px] font-bold leading-none cursor-pointer"
              @click.stop="showPointsHint">
              !
            </span>
          </div>
        </div>

        <!-- Card reward points (mobile) -->
        <div v-if="isLoggedIn"
          class="card-points-mobile sm:hidden flex items-center gap-0.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-white ">
          <div class="w-5 h-5 rounded-lg flex items-center justify-center points-icon-animate">
            <img :src="coinsIcon" :alt="$t('Card Points')" class="w-3.5 h-3.5 object-contain" />
          </div>
          <div class="flex items-center gap-0.5">
            <span :class="[{ 'animate-pulse opacity-70': !hasCardRewardPoints }]" class="text-gray-900 dark:text-white">
              {{ formattedCardRewardPoints }}
            </span>
            <span v-tooltip.bottom="{ value: $t('100 pts = 1 USD'), class: 'points-tooltip' }"
              class="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full dark:bg-white/25 bg-gray-900/25 text-[9px] font-bold leading-none cursor-pointer"
              @click.stop="showPointsHint">
              !
            </span>
          </div>
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

            <!-- Mobile: Avatar toggles floating menu same as desktop -->
            <div class="md:hidden w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 cursor-pointer"
              @click="toggleUserMenu">
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
                <span>{{ $t('My Cards') }}</span>
              </button>

              <button
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                @click="goToProfile">
                <i class="pi pi-user text-gray-500"></i>
                <span>{{ $t('Profile') }}</span>
              </button>

              <button
                class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
                @click="confirmLogout">
                <i class="pi pi-sign-out text-red-500"></i>
                <span>{{ $t('Logout') }}</span>
              </button>
            </div>
          </div>

          <!-- Show login button when not logged in -->
          <Button v-else-if="showLogin" :label="$t('Login')" text class="text-gray-600 hover:text-gray-900"
            @click="goToLogin" />
        </slot>
      </div>
    </div>
  </nav>


</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useCardStore } from '@/stores/card'
import ThemeToggle from './ThemeToggle.vue'
import coinsIcon from '@/assets/images/coins.png'
import { setLocalePreference } from '@/i18n'
import type { SupportedLocale } from '@/i18n/locales'

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
const { locale, t } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()
const userStore = useUserStore()
const cardStore = useCardStore()

// Reactive data
const showUserMenu = ref(false)

// Computed properties
const isLoggedIn = computed(() => authStore.isLoggedIn)
const currentUser = computed(() => authStore.currentUser)
const userName = computed(() => {
  // Prefer firstName from userStore (field returned by API)
  if (userStore.user && userStore.user.firstName) {
    return userStore.user.firstName
  }
  // Then use name from authStore
  if (currentUser.value?.name) {
    return currentUser.value.name
  }
  // Finally use the username part of email
  if (userStore.user?.email) {
    return userStore.user?.email.split('@')[0]
  }
  return 'User'
})
const userEmail = computed(() => userStore.user?.email || '')
const userAvatar = computed(() => currentUser.value?.avatar)
const hasCardRewardPoints = computed(() => userStore.user?.cardRewardPoints !== undefined)
const cardRewardPoints = computed(() => userStore.cardRewardPoints)
const formattedCardRewardPoints = computed(() => {
  if (!hasCardRewardPoints.value) {
    return '--'
  }
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(cardRewardPoints.value)
})

const showPointsHint = () => {
  toast.add({
    severity: 'info',
    summary: t('Card Points'),
    detail: t('100 pts = 1 USD'),
    life: 2500
  })
}

// Mobile drawer removed; use the same floating menu as desktop

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
  router.push('/personal-center')
}

// Navigate to login page
const goToLogin = () => {
  router.push('/login')
}

// Confirm logout
const confirmLogout = () => {
  console.log('Showing logout confirmation dialog')
  showUserMenu.value = false
  confirm.require({
    message: t('Are you sure you want to logout?'),
    header: t('Confirm Logout'),
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: t('Cancel'),
    acceptLabel: t('Confirm'),
    accept: () => {
      console.log('User confirmed logout')
      handleLogout()
    },
    reject: () => {
      console.log('User cancelled logout')
    }
  })
}

// Logout handling
const handleLogout = async () => {
  try {
    console.log('Starting logout process...')
    await authStore.logout()
    console.log('Logout successful')

    toast.add({
      severity: 'success',
      summary: t('Logged Out'),
      detail: t('You have been logged out successfully'),
      life: 3000
    })
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
    toast.add({
      severity: 'error',
      summary: t('Logout Failed'),
      detail: (error as any)?.message || t('Failed to logout. Please try again.'),
      life: 3000
    })
  }
}

const applyLocaleChange = () => {
  const selected = locale.value
  if (selected === 'en' || selected === 'zh-TW') {
    setLocalePreference(selected as SupportedLocale)
  }
}

watch(locale, () => {
  applyLocaleChange()
})

const loadUserProfileIfNeeded = async () => {
  if (!isLoggedIn.value) return
  if (userStore.user?.cardRewardPoints !== undefined) return
  try {
    await userStore.fetchUserProfile()
  } catch (error) {
    console.error('Failed to fetch user profile for card points:', error)
  }
}

// Poll card points every 60s to keep header data fresh
let cardPointsTimer: number | null = null

const startCardPointsPolling = () => {
  if (cardPointsTimer || !isLoggedIn.value) return
  cardPointsTimer = window.setInterval(async () => {
    try {
      await userStore.fetchUserProfile()
    } catch (error) {
      console.error('Failed to refresh user profile for card points:', error)
    }
  }, 60_000)
}

const stopCardPointsPolling = () => {
  if (cardPointsTimer !== null) {
    window.clearInterval(cardPointsTimer)
    cardPointsTimer = null
  }
}

// Click outside to close menu
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  // Check if clicked on user menu area, not theme toggle button
  if (!target.closest('.relative') && !target.closest('[data-theme-toggle]')) {
    showUserMenu.value = false
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') showUserMenu.value = false
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
  loadUserProfileIfNeeded()
  startCardPointsPolling()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
  stopCardPointsPolling()
})

watch(isLoggedIn, value => {
  if (value) {
    loadUserProfileIfNeeded()
    startCardPointsPolling()
  } else {
    stopCardPointsPolling()
  }
})

// Logo click: navigate to MyCards if user has cards, else to ApplyCardList
const onLogoClick = async () => {
  try {
    // 在导航判断时静默获取，避免在 apply-card 页面展示错误
    await cardStore.fetchCardList({ silent: true })
  } catch (e) {
    // 静默模式下忽略错误；路由守卫处理鉴权
  }

  const hasCards = cardStore.cardList.length > 0
  router.push({ name: hasCards ? 'MyCards' : 'ApplyCardList' })
}
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

/* Card points icon subtle scale animation */
.points-icon-animate {
  animation: pointsIconPulse 2.2s ease-in-out infinite;
}

@keyframes pointsIconPulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

/* Custom tooltip style for card points */
:deep(.p-tooltip.points-tooltip .p-tooltip-text) {
  background: rgba(15, 23, 42, 0.95);
  /* slate-900-ish with slight transparency */
  color: #e5e7eb;
  /* gray-200 */
  border-radius: 9999px;
  padding-inline: 0.75rem;
  padding-block: 0.35rem;
  font-size: 11px;
  font-weight: 500;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.35);
}

:deep(.p-tooltip.points-tooltip .p-tooltip-arrow) {
  border-top-color: rgba(15, 23, 42, 0.95) !important;
  border-bottom-color: rgba(15, 23, 42, 0.95) !important;
}

/* Mobile drawer transitions removed */
</style>

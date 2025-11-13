<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 dark:from-gray-800 dark:via-blue-800 dark:to-purple-800 flex items-center justify-center p-4">
    <!-- Logo -->
    <div class="absolute left-4 top-4 lg:left-8 lg:top-8 z-10 flex items-center gap-2">
      <img src="https://static.biulinkpay.online/logo/biu_blue.png" alt="BiulinkPay" class="w-10 lg:w-12"
        loading="eager" />
      <span class="text-[#007cc3] text-xl lg:text-2xl font-bold"
        style="font-family: Alimama ShuHeiTi, Alimama ShuHeiTi;">
        BiulinkPay
      </span>
    </div>

    <div class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px]">
        <!-- Left showcase area (Desktop) -->
        <div class="hidden lg:block lg:pr-8 relative h-full">
          <!-- Service Logo Area -->
          <div class="relative h-full">
            <!-- Service Logo -->
            <img v-for="(service, index) in services" :key="index" :src="service.image" :alt="service.name"
              class="absolute hover:opacity-100 transition-all duration-500 ease-out service-logo"
              :class="[service.size, service.position, `surf-animation-${index}`]" :style="{
                opacity: 1,
              }" />
          </div>
        </div>

        <!-- Mobile: Welcome Screen (Step 1) -->
        <div v-if="!showMobileForm"
          class="lg:hidden w-full flex flex-col items-center justify-between min-h-[600px] px-6 py-8">
          <!-- Service Logo Area -->
          <div class="relative w-full flex-1 flex items-center justify-center max-h-[450px]">
            <!-- Service Logo -->
            <img v-for="(service, index) in services" :key="index" :src="service.image" :alt="service.name"
              class="absolute hover:opacity-100 transition-all duration-500 ease-out service-logo"
              :class="[service.size, service.position, `surf-animation-${index}`]" :style="{
                opacity: 1,
              }" />
          </div>

          <!-- Welcome Text & Button Container -->
          <div class="w-full space-y-6">
            <!-- Welcome Text -->
            <div class="text-center">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Welcome to BiulinkPay
              </h2>
              <p class="text-base text-gray-600 dark:text-gray-400 px-4">
                Your global virtual card solution for seamless payments
              </p>
            </div>

            <!-- Login Button -->
            <div class="w-full px-4">
              <Button label="Get Started" icon="pi pi-arrow-right" iconPos="right" class="w-full" size="large"
                severity="primary" @click="showMobileForm = true" />
            </div>
          </div>
        </div>

        <!-- Right content area (Desktop + Mobile Step 2) -->
        <div v-if="showMobileForm || !isMobile" class="w-full lg:pl-8" :class="{ 'lg:block': !isMobile }">
          <!-- Login form -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-10 w-full max-w-md mx-auto lg:mx-0">
            <!-- Title and Back Button -->
            <div class="flex items-center justify-between mb-8">
              <!-- Back button (Mobile only) -->
              <button v-if="showMobileForm && isMobile" @click="handleBackClick"
                class="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                type="button">
                <i class="pi pi-arrow-left text-gray-700 dark:text-gray-300"></i>
              </button>
              <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white"
                :class="{ 'ml-2': showMobileForm && isMobile }">
                Login with Email
              </h1>
              <div v-if="showMobileForm && isMobile" class="w-10"></div>
            </div>

            <!-- Login Form -->
            <form class="space-y-8" @submit.prevent="handleSubmit">
              <!-- Email Input -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Please enter your email address
                </label>
                <div class="relative">
                  <InputText v-model="form.email" type="email" placeholder="example@email.com"
                    class="w-full text-base min-h-[48px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    :class="{ 'border-red-500': errors.email }" :disabled="isLoading" />
                  <i v-if="errors.email"
                    class="pi pi-exclamation-triangle absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"></i>
                </div>
                <p v-if="errors.email" class="text-sm text-red-500">
                  {{ errors.email }}
                </p>
              </div>

              <!-- Verification Code Input -->
              <div v-if="showVerificationCode" class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Please enter verification code
                </label>
                <div class="flex items-center gap-3">
                  <InputText v-model="form.code" type="text" placeholder="Enter 6-digit code" maxlength="6"
                    class="flex-1 text-base min-h-[48px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center tracking-widest transition-all duration-200"
                    :class="{ 'border-red-500': errors.code }" :disabled="isLoading" />
                  <Button type="button" :label="countdown > 0 ? `${countdown}s` : 'Resend'"
                    :disabled="countdown > 0 || isLoading" severity="secondary"
                    class="min-h-[48px] px-4 whitespace-nowrap flex-shrink-0" @click="resendCode" />
                </div>
                <p v-if="errors.code" class="text-sm text-red-500">
                  {{ errors.code }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Verification code sent to {{ form.email }}
                </p>
              </div>

              <!-- Invitation Code Toggle + Input -->
              <div class="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 bg-white/70 dark:bg-gray-800/60">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">Use invitation code</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                      Optional — share referral rewards with the friend who invited you.
                    </p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                    <input type="checkbox" class="sr-only peer" v-model="inviteToggle" />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-colors">
                    </div>
                    <div
                      class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5">
                    </div>
                  </label>
                </div>

                <div v-if="inviteToggle" class="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Invitation code
                  </label>
                  <InputText v-model="form.inviteCode" type="text" placeholder="Enter invitation code"
                    class="w-full text-base min-h-[48px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    :disabled="isLoading" />
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    We’ll apply the code during login so both of you receive rewards.
                  </p>
                </div>
              </div>

              <!-- Terms Agreement -->
              <div class="flex items-start space-x-3">
                <Checkbox v-model="form.agreeTerms" :binary="true" class="mt-1 checkbox-enhanced"
                  :disabled="isLoading" />
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  I have read and agree to BiuLinkPay
                  <a href="https://static.biulinkpay.online/compliance/TermsOfService.html" target="_blank"
                    rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">
                    Terms of service
                  </a>
                  and
                  <a href="https://static.biulinkpay.online/compliance/PrivacyPolicy.html" target="_blank"
                    rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
              <p v-if="errors.agreeTerms" class="text-sm text-red-500">
                {{ errors.agreeTerms }}
              </p>

              <!-- Submit Button -->
              <Button type="submit" :label="buttonText" :loading="isLoading" :disabled="!form.agreeTerms"
                class="bottom-button-primary text-base font-medium transition-all duration-200" severity="primary" />
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth'
import { useCardStore } from '@/stores/card'
import { useUserStore } from '@/stores/user'
import { AuthUtils, RouteUtils } from '@/utils/auth'
import { getFingerprintId, getCachedFingerprintId } from '@/utils/fingerprint'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const cardStore = useCardStore()
const userStore = useUserStore()

// Service Logo Data - Repositioned according to design
const services = ref([
  {
    name: 'PayPal',
    image: 'https://static.biulinkpay.online/images/paypal.png',
    // 移动端：围绕中心卡片分布
    position: 'top-1/5 right-1/6 lg:top-1/5 lg:left-1/5',
    size: 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14',
  },
  {
    name: 'YouTube',
    image: 'https://static.biulinkpay.online/images/youtube.png',
    // 移动端：围绕中心卡片分布
    position: 'top-1/6 left-1/8 lg:top-1/4 lg:left-7/10',
    size: 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14',
  },
  {
    name: 'TikTok',
    image: 'https://static.biulinkpay.online/images/tiktok.png',
    // 移动端：围绕中心卡片分布
    position: 'top-1/8 left-1/2 lg:top-1/2 lg:left-0',
    size: 'w-16 h-16 sm:w-16 sm:h-16 lg:w-20 lg:h-20',
  },
  {
    name: 'Apple',
    image: 'https://static.biulinkpay.online/images/apple.png',
    // 移动端：围绕中心卡片分布
    position: 'top-1/2 right-1/10 lg:top-2/5 lg:left-2/5',
    size: 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14',
  },
  {
    name: 'eBay',
    image: 'https://static.biulinkpay.online/images/ebay.png',
    // 移动端：围绕中心卡片分布
    position: 'bottom-1/5 right-1/6 lg:top-[42%] lg:left-7/8',
    size: 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12',
  },
  {
    name: 'ChatGPT',
    image: 'https://static.biulinkpay.online/images/chatgpt.png',
    // 移动端：围绕中心卡片分布
    position: 'bottom-[5%] right-1/5 lg:top-[62%] lg:left-[56%]',
    size: 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14',
  },
  {
    name: 'Facebook',
    image: 'https://static.biulinkpay.online/images/facebook.png',
    // 移动端：围绕中心卡片分布
    position: 'bottom-1/5 left-1/6 lg:top-[75%] lg:left-[10%]',
    size: 'w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20',
  },
  {
    name: 'Google',
    image: 'https://static.biulinkpay.online/images/google.png',
    // 移动端：围绕中心卡片分布
    position: 'top-1/2 left-1/10 lg:top-[55%] lg:left-[90%]',
    size: 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14',
  },
  {
    name: 'Amazon',
    image: 'https://static.biulinkpay.online/images/amazon.png',
    // 移动端：围绕中心卡片分布
    position: 'bottom-1/10 left-1/8 lg:top-[75%] lg:left-[95%]',
    size: 'w-10 h-10 sm:w-12 sm:h-12 lg:w-20 lg:h-20',
  },
])

// Form data
const form = ref({
  email: '',
  inviteCode: '',
  code: '',
  agreeTerms: false
})
const inviteToggle = ref(false)

// Form validation errors
const errors = ref({
  email: '',
  code: '',
  agreeTerms: ''
})

// State
const isLoading = ref(false)
const showVerificationCode = ref(false)
const countdown = ref(0)
const showMobileForm = ref(false) // 控制移动端是否显示表单

// Countdown timer
let countdownTimer: number | null = null

// Computed properties
const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 1024
  }
  return false
})

const buttonText = computed(() => {
  if (isLoading.value) {
    return showVerificationCode.value ? 'Signing in...' : 'Sending...'
  }
  return showVerificationCode.value ? 'Sign In' : 'Send Code'
})

// Form validation
const validateEmail = () => {
  if (!form.value.email) {
    errors.value.email = 'Please enter email address'
    return false
  } else if (!AuthUtils.isValidEmail(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    return false
  } else {
    errors.value.email = ''
    return true
  }
}

const validateCode = () => {
  if (!form.value.code) {
    errors.value.code = 'Please enter verification code'
    return false
  } else if (!AuthUtils.isValidCode(form.value.code)) {
    errors.value.code = 'Please enter 6-digit verification code'
    return false
  } else {
    errors.value.code = ''
    return true
  }
}

const validateTerms = () => {
  if (!form.value.agreeTerms) {
    errors.value.agreeTerms = 'Please agree to the terms and conditions'
    return false
  } else {
    errors.value.agreeTerms = ''
    return true
  }
}

// Countdown functionality
const startCountdown = () => {
  countdown.value = 60
  countdownTimer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      window.clearInterval(countdownTimer!)
      countdownTimer = null
    }
  }, 1000)
}

// Send verification code
const sendCode = async () => {
  if (!validateEmail()) {
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.sendEmailCode({ email: form.value.email })

    if (result.success) {
      showVerificationCode.value = true
      startCountdown()
      toast.add({
        severity: 'success',
        summary: 'Code Sent',
        detail: result.message,
        life: 3000
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Send Failed',
        detail: result.message,
        life: 3000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Send Failed',
      detail: (error as any)?.message || 'Network error, please try again later',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

// Resend code
const resendCode = async () => {
  if (countdown.value > 0) return
  // 重新获取验证码前清空验证码输入与错误提示
  form.value.code = ''
  errors.value.code = ''
  await sendCode()
}

// Login handling
const login = async () => {
  if (!validateCode() || !validateTerms()) {
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.login({
      email: form.value.email,
      code: form.value.code,
      license: form.value.inviteCode || ''
    })

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Login Successful',
        detail: result.message,
        life: 3000
      })

      // Clear card store cache to prevent showing previous user's data
      cardStore.reset()
      console.log('Card store cache cleared for new user')

      // Fetch user profile details after successful login
      await fetchUserProfileAndRedirect()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: result.message,
        life: 3000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: (error as any)?.message || 'Network error, please try again later',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

// Fetch user profile and then check card list
const fetchUserProfileAndRedirect = async () => {
  try {
    // First, fetch user profile details
    console.log('Fetching user profile details...')
    const profileResult = await userStore.fetchUserProfile()

    if (profileResult.success) {
      console.log('User profile fetched successfully:', profileResult.data)
    } else {
      console.warn('Failed to fetch user profile:', profileResult.message)
      // Continue with navigation even if profile fetch fails
    }

    // Then check card list and decide navigation
    await checkCardListAndRedirect()
  } catch (error) {
    console.error('Error fetching user profile:', error)
    // Continue with card list check even if profile fetch fails
    await checkCardListAndRedirect()
  }
}

// Check card list and decide navigation
const checkCardListAndRedirect = async () => {
  try {
    // Get card list
    const result = await cardStore.fetchCardList()

    if (result.success) {
      // Check if there are cards
      if (cardStore.hasCards) {
        // Has cards, navigate to my cards page
        console.log('User has cards, redirecting to MyCards')
        router.push('/my-cards')
      } else {
        // No cards, navigate to apply card page
        console.log('User has no cards, redirecting to ApplyCardList')
        router.push('/apply-card')
      }
    } else {
      // Failed to get card list, default to apply card page
      console.log('Failed to fetch card list, redirecting to ApplyCardList')
      router.push('/apply-card')
    }
  } catch (error) {
    console.error('Error checking card list:', error)
    // On error, default to apply card page
    router.push('/apply-card')
  }
}

// Handle form submit
const handleSubmit = async () => {
  if (showVerificationCode.value) {
    await login()
  } else {
    await sendCode()
  }
}

// Handle back button click (mobile)
const handleBackClick = () => {
  showMobileForm.value = false
  // Reset form state
  showVerificationCode.value = false
  form.value = {
    email: '',
    inviteCode: '',
    code: '',
    agreeTerms: false
  }
  errors.value = {
    email: '',
    code: '',
    agreeTerms: ''
  }
  // Clear countdown timer
  if (countdownTimer) {
    window.clearInterval(countdownTimer)
    countdownTimer = null
  }
  countdown.value = 0
}

// Clean up timer when component unmounts
onMounted(() => {
  return () => {
    if (countdownTimer) {
      window.clearInterval(countdownTimer)
    }
  }
})
</script>

<style scoped>
/* Custom styles */
:deep(.p-inputtext) {
  font-size: 16px;
  /* Prevent iOS zoom */
}

:deep(.p-button) {
  font-weight: 500;
}

/* Enhanced Checkbox styles */
:deep(.checkbox-enhanced .p-checkbox-box) {
  border: 2px solid #d1d5db !important;
  background-color: #ffffff !important;
  width: 20px !important;
  height: 20px !important;
  border-radius: 4px !important;
  transition: all 0.2s ease !important;
}

:deep(.checkbox-enhanced .p-checkbox-box:hover) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
}

/* Selected state - using multiple possible class names */
:deep(.checkbox-enhanced .p-checkbox-box.p-highlight),
:deep(.checkbox-enhanced .p-checkbox-box.p-checked),
:deep(.checkbox-enhanced .p-checkbox-box[aria-checked="true"]),
:deep(.checkbox-enhanced.p-checkbox-checked .p-checkbox-box) {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

:deep(.checkbox-enhanced .p-checkbox-box.p-highlight .p-checkbox-icon),
:deep(.checkbox-enhanced .p-checkbox-box.p-checked .p-checkbox-icon),
:deep(.checkbox-enhanced .p-checkbox-box[aria-checked="true"] .p-checkbox-icon),
:deep(.checkbox-enhanced.p-checkbox-checked .p-checkbox-box .p-checkbox-icon) {
  color: #ffffff !important;
  font-size: 12px !important;
  font-weight: bold !important;
}

/* Ensure selected state is visible in all cases */
:deep(.checkbox-enhanced.p-checkbox-checked .p-checkbox-box) {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

:deep(.checkbox-enhanced.p-checkbox-checked .p-checkbox-box .p-checkbox-icon) {
  color: #ffffff !important;
  font-size: 12px !important;
  font-weight: bold !important;
}

/* Force selected state styles - highest priority */
:deep(.checkbox-enhanced[data-p-checked="true"] .p-checkbox-box),
:deep(.checkbox-enhanced[data-p-checked="true"] .p-checkbox-box *) {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
  color: #ffffff !important;
}

/* Use more generic selectors to ensure selected state is visible */
:deep(.checkbox-enhanced .p-checkbox-box:has(.p-checkbox-icon)) {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

:deep(.checkbox-enhanced .p-checkbox-box:has(.p-checkbox-icon) .p-checkbox-icon) {
  color: #ffffff !important;
  font-size: 12px !important;
  font-weight: bold !important;
}

:deep(.checkbox-enhanced .p-checkbox-box:focus) {
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
}

/* Dark mode checkbox styles */
.dark :deep(.checkbox-enhanced .p-checkbox-box) {
  border-color: #6b7280 !important;
  background-color: #1f2937 !important;
}

.dark :deep(.checkbox-enhanced .p-checkbox-box:hover) {
  border-color: #60a5fa !important;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.1) !important;
}

/* Dark mode selected state */
.dark :deep(.checkbox-enhanced .p-checkbox-box.p-highlight),
.dark :deep(.checkbox-enhanced .p-checkbox-box.p-checked),
.dark :deep(.checkbox-enhanced .p-checkbox-box[aria-checked="true"]),
.dark :deep(.checkbox-enhanced.p-checkbox-checked .p-checkbox-box) {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

.dark :deep(.checkbox-enhanced .p-checkbox-box:focus) {
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3) !important;
}

/* Mobile optimization */
@media (max-width: 640px) {
  .min-h-screen {
    padding: 1rem;
  }
}


/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-gray-300 {
    border-color: #000;
  }

  .text-gray-600 {
    color: #000;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 服务Logo冒泡动效 - 通过CSS类应用 */

/* 冒泡浮动动画 - 气泡上升效果 */
@keyframes bubbleFloat {
  0% {
    transform: translateY(0px) scale(0.7);
    opacity: 0;
  }

  5% {
    transform: translateY(-3px) scale(0.72);
    opacity: 0.05;
  }

  10% {
    transform: translateY(-6px) scale(0.74);
    opacity: 0.1;
  }

  15% {
    transform: translateY(-9px) scale(0.76);
    opacity: 0.15;
  }

  20% {
    transform: translateY(-12px) scale(0.78);
    opacity: 0.2;
  }

  25% {
    transform: translateY(-15px) scale(0.8);
    opacity: 0.25;
  }

  30% {
    transform: translateY(-18px) scale(0.82);
    opacity: 0.3;
  }

  35% {
    transform: translateY(-21px) scale(0.84);
    opacity: 0.35;
  }

  40% {
    transform: translateY(-24px) scale(0.86);
    opacity: 0.4;
  }

  45% {
    transform: translateY(-27px) scale(0.88);
    opacity: 0.45;
  }

  50% {
    transform: translateY(-30px) scale(0.9);
    opacity: 0.5;
  }

  55% {
    transform: translateY(-33px) scale(0.92);
    opacity: 0.55;
  }

  60% {
    transform: translateY(-36px) scale(0.94);
    opacity: 0.6;
  }

  65% {
    transform: translateY(-39px) scale(0.96);
    opacity: 0.65;
  }

  70% {
    transform: translateY(-42px) scale(0.98);
    opacity: 0.7;
  }

  75% {
    transform: translateY(-45px) scale(1.0);
    opacity: 0.75;
  }

  80% {
    transform: translateY(-48px) scale(1.02);
    opacity: 0.8;
  }

  85% {
    transform: translateY(-51px) scale(1.04);
    opacity: 0.85;
  }

  90% {
    transform: translateY(-54px) scale(1.06);
    opacity: 0.9;
  }

  95% {
    transform: translateY(-57px) scale(1.08);
    opacity: 0.95;
  }

  100% {
    transform: translateY(-60px) scale(1.1);
    opacity: 1.0;
  }
}

/* 随机冒泡效果 - 无序执行 */
.surf-animation-2 {
  animation: bubbleFloat 3s ease-out infinite;
  animation-delay: 0.1s;
}

/* TikTok */
.surf-animation-6 {
  animation: bubbleFloat 3s ease-out infinite;
  animation-delay: 0.6s;
}

/* Facebook */
.surf-animation-0 {
  animation: bubbleFloat 3s ease-out infinite;
  animation-delay: 0.3s;
}

/* PayPal */
.surf-animation-3 {
  animation: bubbleFloat 3s ease-out infinite;
  animation-delay: 1.1s;
}

/* Apple */
.surf-animation-5 {
  animation: bubbleFloat 3s ease-out infinite;
  animation-delay: 0.2s;
}

/* ChatGPT */
.surf-animation-1 {
  animation: bubbleFloat 3s ease-out infinite;
  animation-delay: 0.9s;
}

/* YouTube */
.surf-animation-4 {
  animation: bubbleFloat 3s ease-out infinite;
  animation-delay: 1.5s;
}

/* eBay */
.surf-animation-7 {
  animation: bubbleFloat 3s ease-out infinite;
  animation-delay: 0.4s;
}

/* Google */
.surf-animation-8 {
  animation: bubbleFloat 3s ease-out infinite;
  animation-delay: 1.3s;
}

/* Amazon */

/* 冒泡涟漪效果 - 气泡扩散 */
.service-logo::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 40%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: bubbleRipple 3s ease-out infinite;
  pointer-events: none;
  z-index: -1;
}

/* 冒泡涟漪动画 - 气泡扩散同步 */
@keyframes bubbleRipple {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 0;
  }

  5% {
    transform: translate(-50%, -50%) scale(0.25);
    opacity: 0.1;
  }

  10% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0.2;
  }

  15% {
    transform: translate(-50%, -50%) scale(0.35);
    opacity: 0.3;
  }

  20% {
    transform: translate(-50%, -50%) scale(0.4);
    opacity: 0.4;
  }

  25% {
    transform: translate(-50%, -50%) scale(0.45);
    opacity: 0.5;
  }

  30% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0.6;
  }

  35% {
    transform: translate(-50%, -50%) scale(0.55);
    opacity: 0.7;
  }

  40% {
    transform: translate(-50%, -50%) scale(0.6);
    opacity: 0.8;
  }

  45% {
    transform: translate(-50%, -50%) scale(0.65);
    opacity: 0.9;
  }

  50% {
    transform: translate(-50%, -50%) scale(0.7);
    opacity: 1.0;
  }

  55% {
    transform: translate(-50%, -50%) scale(0.75);
    opacity: 0.9;
  }

  60% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }

  65% {
    transform: translate(-50%, -50%) scale(0.85);
    opacity: 0.7;
  }

  70% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0.6;
  }

  75% {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0.5;
  }

  80% {
    transform: translate(-50%, -50%) scale(1.0);
    opacity: 0.4;
  }

  85% {
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 0.3;
  }

  90% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.2;
  }

  95% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 0.1;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}
</style>

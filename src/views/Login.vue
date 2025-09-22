<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px]">
        <!-- Left showcase area -->
        <div class="hidden lg:block lg:pr-8">
          <div class="space-y-8">
            <div class="text-center lg:text-left">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Multiple Card Type Options
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-400">
                Rich Consumption Scenarios
              </p>
            </div>

            <!-- Card showcase -->
            <div class="relative">
              <div class="grid grid-cols-2 gap-6">
                <div v-for="i in 4" :key="i"
                  class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <div class="flex items-center justify-between mb-3">
                    <div class="w-8 h-6 bg-yellow-400 rounded-sm"></div>
                    <div class="text-sm font-medium">Bit Seven</div>
                  </div>
                  <div class="text-sm mb-3">United States - USD</div>
                  <div class="w-10 h-10 bg-yellow-400 rounded-full mx-auto"></div>
                </div>
              </div>
            </div>

            <!-- App icons -->
            <div class="flex justify-center lg:justify-start space-x-3">
              <div v-for="app in apps" :key="app"
                class="w-14 h-14 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-110">
                <i :class="app" class="text-xl text-gray-600 dark:text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Right content area -->
        <div class="w-full lg:pl-8">
          <!-- Login form -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-10 w-full max-w-md mx-auto lg:mx-0">
            <!-- Title and Language Selection -->
            <div class="flex items-center justify-between mb-8">
              <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Login with Email
              </h1>
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
                <div class="flex space-x-3">
                  <InputText v-model="form.code" type="text" placeholder="Enter 6-digit code" maxlength="6"
                    class="flex-1 text-base min-h-[48px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center tracking-widest transition-all duration-200"
                    :class="{ 'border-red-500': errors.code }" :disabled="isLoading" />
                  <Button type="button" :label="countdown > 0 ? `${countdown}s` : 'Resend'"
                    :disabled="countdown > 0 || isLoading" severity="secondary"
                    class="min-h-[48px] px-4 whitespace-nowrap" @click="resendCode" />
                </div>
                <p v-if="errors.code" class="text-sm text-red-500">
                  {{ errors.code }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Verification code sent to {{ form.email }}
                </p>
              </div>

              <!-- Terms Agreement -->
              <div class="flex items-start space-x-3">
                <Checkbox v-model="form.agreeTerms" :binary="true" class="mt-1 checkbox-enhanced"
                  :disabled="isLoading" />
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  I have read and agree to Bit Store's
                  <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">
                    Terms of service
                  </a>
                  and
                  <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">
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
import { AuthUtils, RouteUtils } from '@/utils/auth'
import { getFingerprintId, getCachedFingerprintId } from '@/utils/fingerprint'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const cardStore = useCardStore()

// App icons for showcase
const apps = ref([
  'pi pi-apple',
  'pi pi-google',
  'pi pi-amazon',
  'pi pi-paypal',
  'pi pi-visa'
])

// Form data
const form = ref({
  email: '',
  code: '',
  agreeTerms: false
})

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

// Countdown timer
let countdownTimer: number | null = null

// Computed properties
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
      detail: 'Network error, please try again later',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

// Resend code
const resendCode = async () => {
  if (countdown.value > 0) return
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
      code: form.value.code
    })

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Login Successful',
        detail: result.message,
        life: 3000
      })

      // Check card list after successful login
      await checkCardListAndRedirect()
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
      detail: 'Network error, please try again later',
      life: 3000
    })
  } finally {
    isLoading.value = false
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
</style>

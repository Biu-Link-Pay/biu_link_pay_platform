<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

    <!-- Unified Header -->
    <AppHeader title="Payment Result" :show-title="true" />

    <!-- Main Content -->
    <div
      class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-7xl xl:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
      <!-- Payment Result Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-lg lg:max-w-none mx-auto relative overflow-hidden"
        :class="[cardAnimationClass]">

        <!-- Desktop Layout: Two Column -->
        <div class="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <!-- Left Column: Status & Amount -->
          <div class="lg:flex lg:flex-col lg:justify-center">
            <!-- Status Icon -->
            <div v-if="orderStatus !== 'PENDING'"
              class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full mx-auto lg:mx-0 mb-6 lg:mb-8 flex items-center justify-center relative"
              :class="statusIconClass">
              <div
                class="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl xl:text-5xl"
                :class="iconAnimationClass">
                <!-- SUCCESS: Animated checkmark -->
                <div v-if="orderStatus === 'SUCCESS'" class="w-full h-full flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 40 40"
                    class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14">
                    <path class="checkmark-path" fill="none" stroke="currentColor" stroke-width="4"
                      stroke-linecap="round" d="M10,20 l7,7 l13,-13" />
                  </svg>
                </div>

                <!-- FAIL: Shaking X icon -->
                <div v-else-if="orderStatus === 'FAIL'" class="w-full h-full flex items-center justify-center">
                  <i class="pi pi-times"></i>
                </div>

                <!-- CANCEL: Pulsing ban icon -->
                <div v-else-if="orderStatus === 'CANCEL'"
                  class="w-full h-full flex items-center justify-center relative">
                  <i class="pi pi-ban"></i>
                  <div
                    class="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full text-white flex items-center justify-center text-xs sm:text-sm font-bold animate-bounce">
                    !</div>
                </div>
              </div>
            </div>

            <!-- PENDING Status Icon (Desktop) -->
            <div v-if="orderStatus === 'PENDING'"
              class="hidden lg:block w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full mx-auto lg:mx-0 mb-6 lg:mb-8 flex items-center justify-center relative"
              :class="statusIconClass">
              <div
                class="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl xl:text-5xl"
                :class="iconAnimationClass">
                <!-- PENDING: Rotating loader with lock icon -->
                <div class="relative w-full h-full">
                  <div class="w-full h-full border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              </div>
              <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl sm:text-2xl lg:text-3xl xl:text-4xl">
                <i class="pi pi-lock"></i>
              </div>
            </div>

            <!-- Status Title -->
            <h2 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center lg:text-left mb-3 lg:mb-4"
              :class="statusTitleClass">{{ statusTitle }}</h2>

            <!-- Status Description -->
            <p
              class="text-gray-600 dark:text-gray-400 text-center lg:text-left mb-6 lg:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg">
              {{ statusDescription }}</p>

            <!-- Amount Display -->
            <div class="text-center lg:text-left mb-8 lg:mb-10">
              <span
                class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-600 dark:text-gray-400">$</span>
              <span class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white">{{
                formatCurrency(orderAmount) }}</span>
            </div>
          </div>

          <!-- Right Column: Order Information & Actions -->
          <div class="lg:flex lg:flex-col lg:justify-center">
            <!-- Order Information -->
            <div
              class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 lg:p-6 xl:p-8 mb-6 lg:mb-8 space-y-3 lg:space-y-4">
              <h3 class="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-4 lg:hidden">Order Details
              </h3>
              <div
                class="flex justify-between items-center py-2 lg:py-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                <span class="text-sm lg:text-base text-gray-600 dark:text-gray-400">Order Number</span>
                <span class="text-sm lg:text-base font-medium text-gray-900 dark:text-white">{{ orderNumber }}</span>
              </div>
              <div
                class="flex justify-between items-center py-2 lg:py-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                <span class="text-sm lg:text-base text-gray-600 dark:text-gray-400">Payment Time</span>
                <span class="text-sm lg:text-base font-medium text-gray-900 dark:text-white">{{ paymentTime }}</span>
              </div>
              <div v-if="orderStatus === 'SUCCESS'" class="flex justify-between items-center py-2 lg:py-3">
                <span class="text-sm lg:text-base text-gray-600 dark:text-gray-400">Transaction ID</span>
                <span class="text-sm lg:text-base font-medium text-gray-900 dark:text-white">{{ transactionId }}</span>
              </div>
            </div>

            <!-- Status Specific Content -->
            <!-- PENDING Status -->
            <div v-if="orderStatus === 'PENDING'" class="mb-6 lg:mb-8">
              <!-- Mobile: Show icon and progress -->
              <div class="lg:hidden">
                <div
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-6 flex items-center justify-center relative"
                  :class="statusIconClass">
                  <div class="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl"
                    :class="iconAnimationClass">
                    <!-- PENDING: Rotating loader with lock icon -->
                    <div class="relative w-full h-full">
                      <div class="w-full h-full border-4 border-white/20 border-t-white rounded-full animate-spin">
                      </div>
                    </div>
                  </div>
                  <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl sm:text-2xl">
                    <i class="pi pi-lock"></i>
                  </div>
                </div>
              </div>

              <div class="text-center lg:text-left my-6 lg:my-8">
                <p class="text-blue-600 dark:text-blue-400 font-medium text-sm sm:text-base lg:text-base xl:text-lg">
                  Secure payment verification in progress...</p>
              </div>

              <div class="bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 lg:h-3 xl:h-4 mb-4 lg:mb-6 overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: progressWidth + '%' }"></div>
              </div>

              <div
                class="flex justify-between text-xs sm:text-sm lg:text-sm xl:text-base text-gray-500 dark:text-gray-400">
                <span :class="{ 'text-blue-600 dark:text-blue-400 font-semibold': progressStep >= 1 }">Connecting</span>
                <span :class="{ 'text-blue-600 dark:text-blue-400 font-semibold': progressStep >= 2 }">Verifying Payment</span>
                <span :class="{ 'text-blue-600 dark:text-blue-400 font-semibold': progressStep >= 3 }">Complete</span>
              </div>
            </div>

            <!-- SUCCESS Status -->
            <div v-if="orderStatus === 'SUCCESS'" class="mb-6 lg:mb-8">
              <div class="relative h-16 lg:h-20 xl:h-24 overflow-hidden">
                <div class="confetti" v-for="i in 6" :key="i" :style="{ '--delay': i * 0.1 + 's' }"></div>
              </div>
            </div>

            <!-- FAIL Status -->
            <div v-if="orderStatus === 'FAIL'" class="mb-6 lg:mb-8">
              <div
                class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg p-3 sm:p-4 lg:p-4 xl:p-6 text-red-700 dark:text-red-300 text-sm sm:text-base lg:text-base xl:text-lg flex items-center gap-2 lg:gap-3">
                <i class="pi pi-exclamation-circle text-lg lg:text-xl xl:text-xl"></i>
                <span>{{ errorReason }}</span>
              </div>
            </div>

            <!-- CANCEL Status -->
            <div v-if="orderStatus === 'CANCEL'" class="mb-6 lg:mb-8">
              <div class="text-center lg:text-left space-y-4 lg:space-y-6">
                <div
                  class="inline-flex items-center gap-2 lg:gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-base xl:text-lg animate-pulse">
                  <i class="pi pi-clock text-lg lg:text-xl xl:text-xl"></i>
                  <span>Payment Timeout</span>
                </div>
                <div
                  v-if="!isPaymentExpired"
                  class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 sm:p-4 lg:p-4 xl:p-6 text-orange-700 dark:text-orange-300 text-sm sm:text-base lg:text-base xl:text-lg flex items-start gap-2 lg:gap-3">
                  <i class="pi pi-info-circle text-lg lg:text-xl xl:text-xl mt-0.5"></i>
                  <span>For security reasons, the payment page has expired. Please complete the payment promptly.</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3 lg:space-y-3 xl:space-y-4 mb-6 lg:mb-8">
              <!-- PENDING Actions -->
              <template v-if="orderStatus === 'PENDING'">
                <button @click="refreshPayment" :disabled="refreshing"
                  class="w-full py-3 px-6 lg:py-3 lg:px-6 xl:py-4 xl:px-8 rounded-xl font-semibold text-sm sm:text-base lg:text-base xl:text-lg transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  <i v-if="refreshing" class="pi pi-spin pi-spinner"></i>
                  <i v-else class="pi pi-refresh"></i>
                  <span>{{ refreshing ? 'Refreshing...' : 'Refresh Status' }}</span>
                </button>
                <button @click="goBack"
                  class="w-full py-3 px-6 lg:py-3 lg:px-6 xl:py-4 xl:px-8 rounded-xl font-semibold text-sm sm:text-base lg:text-base xl:text-lg transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg">
                  <i class="pi pi-arrow-left"></i>
                  <span>Back to Payment</span>
                </button>
              </template>

              <!-- SUCCESS Actions -->
              <template v-if="orderStatus === 'SUCCESS'">
                <button @click="viewOrder"
                  class="w-full py-3 px-6 lg:py-3 lg:px-6 xl:py-4 xl:px-8 rounded-xl font-semibold text-sm sm:text-base lg:text-base xl:text-lg transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <i class="pi pi-eye"></i>
                  <span>View Order</span>
                </button>
                <button @click="goHome"
                  class="w-full py-3 px-6 lg:py-3 lg:px-6 xl:py-4 xl:px-8 rounded-xl font-semibold text-sm sm:text-base lg:text-base xl:text-lg transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg">
                  <i class="pi pi-home"></i>
                  <span>Back to Home</span>
                </button>
              </template>

              <!-- FAIL Actions -->
              <template v-if="orderStatus === 'FAIL'">
                <button @click="retryPayment"
                  class="w-full py-3 px-6 lg:py-3 lg:px-6 xl:py-4 xl:px-8 rounded-xl font-semibold text-sm sm:text-base lg:text-base xl:text-lg transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <i class="pi pi-refresh"></i>
                  <span>Retry Payment</span>
                </button>
                <button @click="changePaymentMethod"
                  class="w-full py-3 px-6 lg:py-3 lg:px-6 xl:py-4 xl:px-8 rounded-xl font-semibold text-sm sm:text-base lg:text-base xl:text-lg transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg">
                  <i class="pi pi-credit-card"></i>
                  <span>Change Payment Method</span>
                </button>
                <button @click="cancelOrder"
                  class="w-full py-3 px-6 lg:py-3 lg:px-6 xl:py-4 xl:px-8 rounded-xl font-semibold text-sm sm:text-base lg:text-base xl:text-lg transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <i class="pi pi-times"></i>
                  <span>Cancel Order</span>
                </button>
              </template>

              <!-- CANCEL Actions -->
              <template v-if="orderStatus === 'CANCEL'">
                <button @click="createNewOrder"
                  class="w-full py-3 px-6 lg:py-3 lg:px-6 xl:py-4 xl:px-8 rounded-xl font-semibold text-sm sm:text-base lg:text-base xl:text-lg transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <i class="pi pi-plus"></i>
                  <span>Create New Order</span>
                </button>
                <button @click="goHome"
                  class="w-full py-3 px-6 lg:py-3 lg:px-6 xl:py-4 xl:px-8 rounded-xl font-semibold text-sm sm:text-base lg:text-base xl:text-lg transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg">
                  <i class="pi pi-home"></i>
                  <span>Back to Home</span>
                </button>
              </template>
            </div>

            <!-- Support Information -->
            <div class="text-center lg:text-left text-sm lg:text-base xl:text-lg text-gray-500 dark:text-gray-400">
              <p>Need help? <a href="mailto:support@biulinkpay.org" 
                  class="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200">Contact
                  Support</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import AppHeader from '@/components/AppHeader.vue'
import { OrderAPI } from '@/api/order'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Order data
const orderNumber = ref('')
const orderAmount = ref(0)
const orderStatus = ref<'PENDING' | 'SUCCESS' | 'FAIL' | 'CANCEL'>('PENDING')
const paymentTime = ref<string | null>('')
const transactionId = ref<string | null>('')
const errorReason = ref<string | null>('')

// UI state
const refreshing = ref(false)
const progressWidth = ref(0)
const progressStep = ref(0)

// Polling for PENDING status
let pollingInterval: NodeJS.Timeout | null = null
const isMounted = ref(false)


const statusIconClass = computed(() => {
  switch (orderStatus.value) {
    case 'PENDING': return 'bg-blue-500'
    case 'SUCCESS': return 'bg-green-500'
    case 'FAIL': return 'bg-red-500'
    case 'CANCEL': return 'bg-orange-500'
    default: return 'bg-blue-500'
  }
})

const cardAnimationClass = computed(() => {
  switch (orderStatus.value) {
    case 'PENDING': return 'animate-fade-in-up'
    case 'SUCCESS': return 'animate-fade-in-up'
    case 'FAIL': return 'animate-shake'
    case 'CANCEL': return 'animate-fade-in-up'
    default: return 'animate-fade-in-up'
  }
})

const iconAnimationClass = computed(() => {
  switch (orderStatus.value) {
    case 'PENDING': return ''
    case 'SUCCESS': return 'animate-scale-in'
    case 'FAIL': return 'animate-shake'
    case 'CANCEL': return 'animate-pulse'
    default: return ''
  }
})

const statusTitle = computed(() => {
  switch (orderStatus.value) {
    case 'PENDING': return 'Payment Processing'
    case 'SUCCESS': return 'Payment Successful'
    case 'FAIL': return 'Payment Failed'
    case 'CANCEL': return 'Payment Cancelled'
    default: return 'Payment Processing'
  }
})

const statusTitleClass = computed(() => {
  switch (orderStatus.value) {
    case 'PENDING': return 'text-blue-600 dark:text-blue-400'
    case 'SUCCESS': return 'text-green-600 dark:text-green-400'
    case 'FAIL': return 'text-red-600 dark:text-red-400'
    case 'CANCEL': return 'text-gray-600 dark:text-gray-400'
    default: return 'text-blue-600 dark:text-blue-400'
  }
})

const statusDescription = computed(() => {
  switch (orderStatus.value) {
    case 'PENDING': return 'Please wait while we process your payment'
    case 'SUCCESS': return 'Thank you for your purchase! Your payment has been confirmed'
    case 'FAIL': return 'Sorry, your payment could not be completed. Please try again'
    case 'CANCEL': return 'This payment has been cancelled'
    default: return 'Please wait while we process your payment'
  }
})

// Format currency
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Check if payment is expired (15 minutes)
const isPaymentExpired = computed(() => {
  if (!paymentTime.value) return false
  
  const createTime = new Date(paymentTime.value).getTime()
  const currentTime = new Date().getTime()
  const fifteenMinutes = 15 * 60 * 1000 // 15 minutes in milliseconds
  
  return (currentTime - createTime) >= fifteenMinutes
})

// Simulate progress for PENDING status
const simulateProgress = () => {
  if (orderStatus.value !== 'PENDING') return

  const interval = setInterval(() => {
    if (progressWidth.value < 100) {
      progressWidth.value += Math.random() * 10
      if (progressWidth.value >= 33 && progressStep.value < 1) {
        progressStep.value = 1
      } else if (progressWidth.value >= 66 && progressStep.value < 2) {
        progressStep.value = 2
      } else if (progressWidth.value >= 100 && progressStep.value < 3) {
        progressStep.value = 3
      }
    } else {
      clearInterval(interval)
    }
  }, 500)
}

// Fetch order status
const fetchOrderStatus = async () => {
  if (!orderNumber.value) return

  try {
    const response = await OrderAPI.getDepositOrderDetail({ num: orderNumber.value.toString() })

    if (response.success && response.model) {
      const detail = response.model
      const previousStatus = orderStatus.value
      orderStatus.value = detail.status as any
      paymentTime.value = detail.createTime || null
      transactionId.value = detail.hashId || null
      errorReason.value = detail.errorMessage || null
      // Update other fields if needed
      if (detail.amount) {
        orderAmount.value = parseFloat(detail.amount.toString())
      }

      // Handle status change
      if (previousStatus !== detail.status) {
        handleStatusChange(detail.status)
      }
    }
  } catch (error) {
    console.error('Error fetching order status:', error)
  }
}

// Handle status change
const handleStatusChange = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      toast.add({
        severity: 'success',
        summary: 'Payment Successful',
        detail: 'Your payment has been confirmed successfully!',
        life: 5000
      })
      stopPolling()
      break
    case 'FAIL':
      toast.add({
        severity: 'error',
        summary: 'Payment Failed',
        detail: 'Your payment could not be completed. Please try again.',
        life: 5000
      })
      stopPolling()
      break
    case 'CANCEL':
      toast.add({
        severity: 'warn',
        summary: 'Payment Cancelled',
        detail: 'This payment has been cancelled.',
        life: 5000
      })
      stopPolling()
      break
  }
}

// Start polling for PENDING status
const startPolling = () => {
  if (pollingInterval) return

  pollingInterval = setInterval(async () => {
    if (!isMounted.value || orderStatus.value !== 'PENDING') {
      stopPolling()
      return
    }

    await fetchOrderStatus()
  }, 3000) // Poll every 3 seconds
}

// Stop polling
const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

// Action handlers
const refreshPayment = async () => {
  refreshing.value = true
  try {
    await fetchOrderStatus()
    toast.add({
      severity: 'info',
      summary: 'Status Refreshed',
      detail: 'Payment status has been updated',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Refresh Failed',
      detail: 'Failed to refresh payment status',
      life: 3000
    })
  } finally {
    refreshing.value = false
  }
}

const goBack = () => {
  router.back()
}

const viewOrder = () => {
  router.push({
    name: 'MyCards',
    query: {
      orderNum: orderNumber.value
    }
  })
}

const goHome = () => {
  router.push({ name: 'ApplyCardList' })
}

const retryPayment = () => {
  router.push({
    name: 'PaymentMethodSelection',
    query: {
      orderNum: orderNumber.value,
      retry: 'true'
    }
  })
}

const changePaymentMethod = () => {
  router.push({
    name: 'PaymentMethodSelection',
    query: {
      orderNum: orderNumber.value
    }
  })
}

const cancelOrder = () => {
  toast.add({
    severity: 'info',
    summary: 'Order Cancelled',
    detail: 'Your order has been cancelled',
    life: 3000
  })
  // Navigate back to home or order list
  setTimeout(() => {
    router.push({ name: 'ApplyCardList' })
  }, 2000)
}

const createNewOrder = () => {
  router.push({ name: 'ApplyCardList' })
}

// Initialize data
onMounted(async () => {
  isMounted.value = true

  // Get order number from route
  const orderNum = route.query.orderNum as string
  if (orderNum) {
    orderNumber.value = orderNum
  }

  // Get other data from route or set defaults
  const amount = route.query.amount as string
  if (amount) {
    orderAmount.value = parseFloat(amount)
  }

  const status = route.query.status as string
  if (status && ['PENDING', 'SUCCESS', 'FAIL', 'CANCEL'].includes(status)) {
    orderStatus.value = status as any
  }

  // Start progress simulation for PENDING status
  if (orderStatus.value === 'PENDING') {
    simulateProgress()
    startPolling()
  }

  // Fetch initial status
  await fetchOrderStatus()
})

// Cleanup
onUnmounted(() => {
  isMounted.value = false
  stopPolling()
})
</script>

<style scoped>
/* Success Checkmark Animation */
.checkmark-path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 0.8s ease-out forwards;
  animation-delay: 0.2s;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

/* Confetti Animation */
.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #f39c12;
  animation: confetti-fall 2s ease-out forwards;
  animation-delay: var(--delay);
}

.confetti:nth-child(2n) {
  background: #e74c3c;
}

.confetti:nth-child(3n) {
  background: #2ecc71;
}

.confetti:nth-child(4n) {
  background: #3498db;
}

.confetti:nth-child(5n) {
  background: #9b59b6;
}

.confetti:nth-child(6n) {
  background: #f1c40f;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translateY(100px) rotate(360deg);
    opacity: 0;
  }
}

/* Custom Animation Classes */
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.6s ease-out;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  70% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Unified Header -->
    <AppHeader title="Crypto Payment" :show-title="true" />

    <!-- Main Content -->
    <div class="w-full max-w-md mx-auto px-4 py-6">
      <!-- Order Information -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div class="space-y-4">
          <!-- Order Number -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Order NO.</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-mono text-gray-900 dark:text-white">{{ orderNumber }}</span>
              <button @click="copyToClipboard(orderNumber)"
                class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Copy order number">
                <i class="pi pi-copy text-gray-500 text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Order Amount -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Order amount</span>
            <span class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(orderAmount) }}</span>
          </div>

          <!-- You need to pay -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">You need to pay</span>
            <div class="flex items-center space-x-2">
              <span class="text-lg font-bold text-gray-900 dark:text-white">{{ cryptoAmount }} {{ selectedCrypto
                }}</span>
              <div class="w-6 h-6 rounded-full flex items-center justify-center"
                :class="getCryptoIconBg(selectedCrypto)">
                <span class="text-white font-bold text-xs">{{ getCryptoIcon(selectedCrypto) }}</span>
              </div>
              <button @click="copyToClipboard(cryptoAmount)"
                class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Copy amount">
                <i class="pi pi-copy text-gray-500 text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Network Fee Warning -->
      <div
        class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
        <div class="flex items-start space-x-3">
          <div class="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <i class="pi pi-exclamation-triangle text-white text-xs"></i>
          </div>
          <div class="text-sm text-orange-800 dark:text-orange-200">
            <span class="font-semibold">DON'T forget to add the Network Fee</span> when transferring, so as not to fail
            due to insufficient transfer amount.
          </div>
        </div>
      </div>

      <!-- Payment Address Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div class="space-y-4">
          <!-- Section Header -->
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Please send to this address</h3>
            <div class="flex items-center space-x-2 text-red-500">
              <i class="pi pi-clock text-sm"></i>
              <span class="text-sm font-medium">{{ formatTime(countdown) }}</span>
            </div>
          </div>

          <!-- Network Type -->
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
              {{ selectedCrypto }}({{ selectedNetwork }}) only
            </div>
          </div>

          <!-- Wallet Address -->
          <div class="space-y-2">
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Wallet Address:</div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <span class="text-sm font-mono text-gray-900 dark:text-white break-all">{{ walletAddress }}</span>
                <button @click="copyToClipboard(walletAddress)"
                  class="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                  title="Copy address">
                  <i class="pi pi-copy text-gray-500 text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- QR Code -->
          <div class="flex justify-center">
            <div class="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div ref="qrCodeContainer" class="w-48 h-48 flex items-center justify-center">
                <!-- QR Code will be generated here -->
                <div v-if="qrCodeLoading" class="flex flex-col items-center space-y-2">
                  <i class="pi pi-spin pi-spinner text-2xl text-blue-600"></i>
                  <span class="text-sm text-gray-500">Generating QR Code...</span>
                </div>
                <div v-else-if="qrCodeError" class="flex flex-col items-center space-y-2 text-red-500">
                  <i class="pi pi-exclamation-triangle text-2xl"></i>
                  <span class="text-sm">Failed to generate QR Code</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wallet Connection Button -->
      <div class="mb-6">
        <button @click="connectWallet"
          class="w-full border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3">
          <span>Deposit by your Wallet</span>
          <div class="flex items-center space-x-2">
            <!-- Wallet Icons -->
            <div class="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <span class="text-white font-bold text-xs">M</span>
            </div>
            <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span class="text-white font-bold text-xs">W</span>
            </div>
            <div class="w-6 h-6 bg-gray-500 rounded flex items-center justify-center">
              <span class="text-white font-bold text-xs">+</span>
            </div>
          </div>
        </button>
      </div>

      <!-- Payment Status -->
      <div v-if="paymentStatus" class="mb-6">
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div class="flex items-center space-x-3">
            <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <i class="pi pi-check text-white text-xs"></i>
            </div>
            <div class="text-sm text-green-800 dark:text-green-200">
              <span class="font-semibold">Payment Detected!</span> We are processing your payment...
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bottom-buttons-container">
        <!-- Back Button -->
        <button @click="goBack"
          class="bottom-button-dual bottom-button-dual-secondary">
          Back to Payment Method
        </button>

        <!-- Refresh Button -->
        <button @click="refreshPayment" :disabled="refreshing"
          class="bottom-button-dual bottom-button-dual-primary flex items-center justify-center space-x-2">
          <i v-if="refreshing" class="pi pi-spin pi-spinner text-sm"></i>
          <i v-else class="pi pi-refresh text-sm"></i>
          <span>{{ refreshing ? 'Refreshing...' : 'Refresh Payment' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Payment data
const orderNumber = ref('76782112321321047696')
const orderAmount = ref(1000.00)
const selectedCrypto = ref('ETH')
const selectedNetwork = ref('ERC20')
const cryptoAmount = ref('0.263')
const walletAddress = ref('0xe688b84b23f322a994A53dbF8E15FA82CDB71127')

// UI state
const countdown = ref(1461) // 24:21 in seconds
const qrCodeLoading = ref(true)
const qrCodeError = ref(false)
const paymentStatus = ref(false)
const refreshing = ref(false)

// QR Code container ref
const qrCodeContainer = ref<HTMLElement | null>(null)

// Countdown timer
let countdownInterval: NodeJS.Timeout | null = null

// Computed properties
const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Get crypto icon background color
const getCryptoIconBg = (crypto: string) => {
  switch (crypto) {
    case 'BTC': return 'bg-orange-500'
    case 'ETH': return 'bg-blue-500'
    case 'USDT': return 'bg-green-500'
    case 'USDC': return 'bg-blue-400'
    case 'BNB': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

// Get crypto icon
const getCryptoIcon = (crypto: string) => {
  switch (crypto) {
    case 'BTC': return '₿'
    case 'ETH': return 'Ξ'
    case 'USDT': return 'T'
    case 'USDC': return 'C'
    case 'BNB': return 'B'
    default: return '$'
  }
}

// Copy to clipboard
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.add({
      severity: 'success',
      summary: 'Copied',
      detail: 'Text copied to clipboard',
      life: 2000
    })
  } catch (error) {
    console.error('Failed to copy:', error)
    toast.add({
      severity: 'error',
      summary: 'Copy Failed',
      detail: 'Failed to copy to clipboard',
      life: 3000
    })
  }
}

// Generate QR Code
const generateQRCode = async () => {
  try {
    qrCodeLoading.value = true
    qrCodeError.value = false

    // Simulate QR code generation
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Create a simple QR code placeholder
    if (qrCodeContainer.value) {
      qrCodeContainer.value.innerHTML = `
        <div class="w-full h-full bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
          <div class="text-center">
            <div class="text-4xl mb-2">📱</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">QR Code</div>
            <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">${walletAddress.value.slice(0, 8)}...</div>
          </div>
        </div>
      `
    }

    qrCodeLoading.value = false
  } catch (error) {
    console.error('Failed to generate QR code:', error)
    qrCodeError.value = true
    qrCodeLoading.value = false
  }
}

// Start countdown timer
const startCountdown = () => {
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      // Time expired
      toast.add({
        severity: 'warn',
        summary: 'Payment Expired',
        detail: 'Payment time has expired. Please refresh to get a new payment address.',
        life: 5000
      })
      clearInterval(countdownInterval!)
    }
  }, 1000)
}

// Connect wallet
const connectWallet = () => {
  toast.add({
    severity: 'info',
    summary: 'Wallet Connection',
    detail: 'Wallet connection feature will be implemented soon',
    life: 3000
  })
}

// Go back
const goBack = () => {
  router.back()
}

// Refresh payment
const refreshPayment = async () => {
  refreshing.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Reset countdown
    countdown.value = 1461

    // Generate new QR code
    await generateQRCode()

    toast.add({
      severity: 'success',
      summary: 'Payment Refreshed',
      detail: 'New payment details have been generated',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Refresh Failed',
      detail: 'Failed to refresh payment details',
      life: 3000
    })
  } finally {
    refreshing.value = false
  }
}

// Initialize data from route params
onMounted(async () => {
  // Get payment data from route query
  const amount = route.query.amount as string
  if (amount) {
    orderAmount.value = parseFloat(amount)
  }

  const currency = route.query.currency as string
  if (currency) {
    selectedCrypto.value = currency
  }

  const network = route.query.network as string
  if (network) {
    selectedNetwork.value = network
  }

  const payType = route.query.payType as string
  if (payType) {
    // Update order number based on pay type
    orderNumber.value = `${Date.now()}${Math.floor(Math.random() * 1000)}`
  }

  // Generate QR code
  await generateQRCode()

  // Start countdown
  startCountdown()
})

// Cleanup on unmount
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

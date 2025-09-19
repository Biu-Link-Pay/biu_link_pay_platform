<template>
  <div class="min-h-screen bg-white">
    <!-- Unified Header -->
    <AppHeader title="Apply for a card" :show-title="true" />

    <!-- Main Content -->
    <div class="max-w-md mx-auto px-4 py-6">
      <!-- Virtual Card Display -->
      <div class="mb-6">
        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-lg">
          <!-- Card Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span class="text-gray-800 font-bold text-lg">TP</span>
              </div>
              <div>
                <div class="text-lg font-semibold">TOKEN POCKET</div>
                <div class="text-sm text-gray-300">LITE</div>
              </div>
            </div>
          </div>

          <!-- Cardholder Name -->
          <div class="mb-4">
            <div class="text-sm text-gray-300 mb-1">Cardholder</div>
            <div class="text-lg font-semibold">{{ cardholderName }}</div>
          </div>

          <!-- Card Number -->
          <div class="mb-4">
            <div class="text-sm text-gray-300 mb-1">Card Number</div>
            <div class="text-lg font-mono tracking-wider">{{ maskedCardNumber }}</div>
          </div>
        </div>
      </div>

      <!-- Payment Token Selection -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Choose the token you want to pay</h3>

        <!-- Selected Crypto Option -->
        <div class="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center relative"
                :class="getCryptoIconBg(selectedCurrency)">
                <span class="text-white font-bold text-sm">{{ getCryptoIcon(selectedCurrency) }}</span>
                <div v-if="selectedCurrency === 'USDT'"
                  class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>
              <div>
                <div class="flex items-center space-x-1">
                  <span class="font-medium text-gray-900">{{ selectedCurrency }}</span>
                </div>
                <div class="text-sm text-gray-500">{{ selectedNetwork }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-blue-600">{{ getCryptoAmount(selectedCurrency) }}</div>
            </div>
          </div>
        </div>

        <!-- USD Reference -->
        <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">$</span>
              </div>
              <div>
                <div class="font-medium text-gray-900">$ USD</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-gray-900">{{ usdAmount }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Summary -->
      <div class="mb-8">
        <div class="space-y-3">
          <!-- Payment Summary -->
          <div class="flex items-center justify-between">
            <div class="text-gray-700">
              You will pay <span class="font-bold">{{ tptAmount }} {{ selectedCurrency }}</span> to recharge <span
                class="font-bold">{{
                  usdAmount }} USD</span>
            </div>
            <div class="flex items-center space-x-1 text-gray-500">
              <i class="pi pi-clock text-sm"></i>
              <span class="text-sm">{{ countdown }}s</span>
            </div>
          </div>

          <!-- Exchange Rate -->
          <div class="text-gray-700">
            1 {{ selectedCurrency }} = {{ exchangeRate }} USD
          </div>

          <!-- Recharge Fee -->
          <div class="text-gray-700">
            Recharge fee <span class="font-bold">{{ cryptoFee }} {{ selectedCurrency }}</span>
          </div>

          <!-- Total Amount -->
          <div v-if="rateData?.model" class="text-gray-700 border-t pt-2">
            Total payment: <span class="font-bold text-blue-600">{{ usdtAmount }} USDT</span>
          </div>

          <!-- Loading indicator -->
          <div v-if="loadingRate" class="flex items-center space-x-2 text-blue-600">
            <i class="pi pi-spin pi-spinner text-sm"></i>
            <span class="text-sm">Updating exchange rate...</span>
          </div>
        </div>
      </div>

      <!-- Payment Button -->
      <div class="sticky bottom-4">
        <button :disabled="countdown <= 0"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
          @click="handlePayment">
          <span v-if="countdown <= 0">Session Expired</span>
          <span v-else>Pay {{ getCryptoAmount(selectedCurrency) }}</span>
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
import { OrderAPI, type OrderRateResponse } from '@/api/order'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Card information
const cardholderName = ref('John Tan')
const maskedCardNumber = ref('6567 66****')

// Payment amounts
const rechargeAmount = ref(10)
const rechargeFee = ref(0.2)
const selectedCurrency = ref('USDT')
const selectedNetwork = ref('BNB-Chain(BEP20)')
const selectedExchange = ref('BINANCE') // 默认选择 BINANCE

// Rate data from API
const rateData = ref<OrderRateResponse | null>(null)
const loadingRate = ref(false)

// Computed amounts based on rate data
const usdtAmount = computed(() => {
  if (rateData.value?.model) {
    return parseFloat(rateData.value.model.totalAmountUsdT).toFixed(2)
  }
  return (rechargeAmount.value + rechargeFee.value).toFixed(2)
})

const usdAmount = computed(() => {
  if (rateData.value?.model) {
    return parseFloat(rateData.value.model.cryptoDetail.cryptoAmount).toFixed(2)
  }
  return rechargeAmount.value.toString()
})

const tptAmount = computed(() => {
  if (rateData.value?.model) {
    return parseFloat(rateData.value.model.cryptoDetail.totalAmountCrypto).toFixed(2)
  }
  return '1230'
})

const exchangeRate = computed(() => {
  if (rateData.value?.model) {
    return parseFloat(rateData.value.model.cryptoDetail.cryptoToUsdTRate).toFixed(4)
  }
  return '1.0000'
})

const cryptoFee = computed(() => {
  if (rateData.value?.model) {
    return parseFloat(rateData.value.model.cryptoDetail.cryptoFee).toFixed(2)
  }
  return rechargeFee.value.toFixed(2)
})

// Countdown timer
const countdown = ref(15)
let countdownInterval: NodeJS.Timeout | null = null

// Get crypto icon background color
const getCryptoIconBg = (currency: string) => {
  switch (currency) {
    case 'BTC': return 'bg-orange-500'
    case 'ETH': return 'bg-blue-500'
    case 'USDT': return 'bg-green-500'
    case 'USDC': return 'bg-blue-400'
    default: return 'bg-gray-500'
  }
}

// Get crypto icon
const getCryptoIcon = (currency: string) => {
  switch (currency) {
    case 'BTC': return '₿'
    case 'ETH': return 'Ξ'
    case 'USDT': return 'T'
    case 'USDC': return 'C'
    default: return '$'
  }
}

// Get crypto amount
const getCryptoAmount = (currency: string) => {
  if (rateData.value?.model) {
    const totalAmount = rateData.value.model.cryptoDetail.totalAmountCrypto
    return `${totalAmount} ${currency}`
  }

  switch (currency) {
    case 'BTC': return '0.025 BTC'
    case 'ETH': return '0.4 ETH'
    case 'USDT': return `${usdtAmount.value} USDT`
    case 'USDC': return `${usdtAmount.value} USDC`
    default: return `${usdtAmount.value} ${currency}`
  }
}

// Fetch rate data from API
const fetchRateData = async () => {
  try {
    loadingRate.value = true

    const response = await OrderAPI.getRate({
      cryptoUnit: selectedCurrency.value,
      network: selectedNetwork.value,
      number: rechargeAmount.value.toString(),
      saleDirection: 'BUY', // 入金
      exchange: selectedExchange.value as 'WALLET' | 'BINANCE',
      fiatUnit: 'USD'
    })

    if (response.success) {
      rateData.value = response
      toast.add({
        severity: 'success',
        summary: 'Rate Updated',
        detail: 'Exchange rate has been updated',
        life: 2000
      })
    } else {
      throw new Error(response.msg || 'Failed to fetch rate')
    }
  } catch (error) {
    console.error('Error fetching rate:', error)
    toast.add({
      severity: 'error',
      summary: 'Rate Error',
      detail: 'Failed to fetch exchange rate. Using default values.',
      life: 3000
    })
  } finally {
    loadingRate.value = false
  }
}

// Start countdown timer
const startCountdown = () => {
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(countdownInterval!)
    }
  }, 1000)
}

// Handle payment
const handlePayment = () => {
  if (countdown.value <= 0) {
    toast.add({
      severity: 'error',
      summary: 'Session Expired',
      detail: 'Please refresh the page to start a new session',
      life: 3000
    })
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Payment Processing',
    detail: `Processing payment of ${usdtAmount.value} USDT...`,
    life: 3000
  })

  // Simulate payment processing
  setTimeout(() => {
    router.push({
      name: 'ApplyCardList',
      query: {
        success: 'true',
        message: 'Card application completed successfully'
      }
    })
  }, 2000)
}

// Initialize data from route params
onMounted(async () => {
  // Get recharge amount from route query
  const amount = route.query.amount as string
  if (amount) {
    rechargeAmount.value = parseFloat(amount)
  }

  // Get cardholder name from route query
  const name = route.query.name as string
  if (name) {
    cardholderName.value = name
  }

  // Get selected currency and network from route query
  const currency = route.query.currency as string
  if (currency) {
    selectedCurrency.value = currency
  }

  const network = route.query.network as string
  if (network) {
    selectedNetwork.value = network
  }

  // Get exchange from route query (optional)
  const exchange = route.query.exchange as string
  if (exchange && (exchange === 'WALLET' || exchange === 'BINANCE')) {
    selectedExchange.value = exchange
  }

  // Fetch rate data from API
  await fetchRateData()

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

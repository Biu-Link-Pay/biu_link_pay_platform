<template>
  <div class="min-h-screen bg-white">
    <!-- Unified Header -->
    <AppHeader title="Payment Method" :show-title="true" />

    <!-- Main Content -->
    <div class="max-w-md mx-auto px-4 py-6">
      <!-- Pay Amount Section -->
      <div class="text-center mb-8">
        <h2 class="text-lg font-medium text-gray-600 mb-2">Pay Amount</h2>
        <div class="text-4xl font-bold text-gray-900 mb-4">{{ formatCurrency(payAmount) }}</div>
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>Order NO.</span>
          <span class="font-mono">{{ orderNumber }}</span>
        </div>
      </div>

      <!-- Select Crypto Currency Section -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="pi pi-credit-card text-blue-600 text-sm"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Select crypto currency</h3>
              <p class="text-sm text-green-600">1 - 2 mins</p>
            </div>
          </div>
          <div class="w-4 h-4 bg-blue-600 rounded-full"></div>
        </div>

        <!-- Crypto Currency Options -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <i class="pi pi-spin pi-spinner text-2xl text-blue-600"></i>
          <span class="ml-2 text-gray-600">Loading payment methods...</span>
        </div>

        <div v-else class="space-y-2">
          <div v-for="crypto in cryptoOptions" :key="`${crypto.crypto.name}-${crypto.network.name}`"
            class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200"
            :class="selectedCrypto?.crypto.name === crypto.crypto.name && selectedCrypto?.network.name === crypto.network.name ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'"
            @click="selectCrypto(crypto)">

            <!-- Crypto Icon and Info -->
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <img v-if="crypto.crypto.logoUrl" :src="crypto.crypto.logoUrl" :alt="crypto.crypto.name"
                  class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-gray-400 flex items-center justify-center">
                  <span class="text-white font-bold text-sm">{{ crypto.crypto.name.charAt(0) }}</span>
                </div>
              </div>
              <div>
                <div class="font-semibold text-gray-900">{{ crypto.crypto.name }}</div>
                <div class="text-sm text-gray-500">{{ crypto.crypto.fullName }}</div>
                <div class="text-xs text-gray-400">{{ crypto.network.fullName }}</div>
              </div>
            </div>

            <!-- Selection Indicator -->
            <div
              v-if="selectedCrypto?.crypto.name === crypto.crypto.name && selectedCrypto?.network.name === crypto.network.name"
              class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <i class="pi pi-check text-white text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Crypto Details -->
      <div v-if="selectedCrypto" class="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Payment Details</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Amount:</span>
            <span class="font-medium">{{ formatCurrency(payAmount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Currency:</span>
            <span class="font-medium">{{ selectedCrypto.crypto.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Network:</span>
            <span class="font-medium">{{ selectedCrypto.network.fullName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Min Limit:</span>
            <span class="font-medium">${{ selectedCrypto.minLimit }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Max Limit:</span>
            <span class="font-medium">${{ selectedCrypto.maxLimit }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Processing Time:</span>
            <span class="font-medium text-green-600">1 - 2 mins</span>
          </div>
        </div>
      </div>

      <!-- Continue Button -->
      <div class="mt-8">
        <button :disabled="!selectedCrypto"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
          @click="handleContinue">
          <span v-if="!selectedCrypto">Select a payment method</span>
          <span v-else>Continue with {{ selectedCrypto.crypto.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import AppHeader from '@/components/AppHeader.vue'
import { OrderAPI, type OrderPayType, type OrderCryptoNetwork } from '@/api/order'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Payment amount and order info
const payAmount = ref(1000.00)
const orderNumber = ref('76782112321321047696')

// Selected crypto currency
const selectedCrypto = ref<OrderCryptoNetwork | null>(null)

// Available crypto currencies from API
const cryptoOptions = ref<OrderCryptoNetwork[]>([])

// Loading state
const loading = ref(false)

// Format currency
const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)} USD`
}

// Select crypto currency
const selectCrypto = (crypto: OrderCryptoNetwork) => {
  selectedCrypto.value = crypto
}

// Load payment methods from API
const loadPaymentMethods = async () => {
  try {
    loading.value = true
    const response = await OrderAPI.getPaymentMethods({ orderType: 'IN' })

    if (response.success && response.model.payTypes) {
      // Flatten all crypto networks from all payment types
      const allCryptoNetworks: OrderCryptoNetwork[] = []
      response.model.payTypes.forEach(payType => {
        allCryptoNetworks.push(...payType.cryptoNetworks)
      })

      // Remove duplicates based on crypto name and network name
      const uniqueCryptoNetworks = allCryptoNetworks.filter((crypto, index, self) =>
        index === self.findIndex(c =>
          c.crypto.name === crypto.crypto.name && c.network.name === crypto.network.name
        )
      )

      cryptoOptions.value = uniqueCryptoNetworks
    }
  } catch (error) {
    console.error('Error loading payment methods:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load payment methods',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Handle continue
const handleContinue = () => {
  if (!selectedCrypto.value) {
    toast.add({
      severity: 'warn',
      summary: 'Selection Required',
      detail: 'Please select a payment method',
      life: 3000
    })
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Payment Method Selected',
    detail: `Selected ${selectedCrypto.value.crypto.name} for payment`,
    life: 2000
  })

  // Navigate to payment confirmation page
  setTimeout(() => {
    router.push({
      name: 'PaymentConfirmation',
      query: {
        amount: payAmount.value.toString(),
        currency: selectedCrypto.value.crypto.name,
        network: selectedCrypto.value.network.sortName,
        exchange: 'BINANCE', // 默认使用 BINANCE，可以根据实际需求调整
        name: route.query.name || 'John Tan'
      }
    })
  }, 2000)
}

// Initialize data from route params
onMounted(async () => {
  // Get amount from route query
  const amount = route.query.amount as string
  if (amount) {
    payAmount.value = parseFloat(amount)
  }

  // Generate order number if not provided
  if (route.query.orderNumber) {
    orderNumber.value = route.query.orderNumber as string
  } else {
    orderNumber.value = Math.random().toString().slice(2, 22)
  }

  // Load payment methods from API
  await loadPaymentMethods()
})
</script>

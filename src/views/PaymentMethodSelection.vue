<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Unified Header -->
    <AppHeader title="Payment Method" :show-title="true" />

    <!-- Main Content -->
    <div
      class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12 pb-24 md:pb-6 lg:pb-12">
      <!-- Desktop Layout -->
      <div class="hidden md:block">
        <div class="max-w-4xl xl:max-w-5xl mx-auto space-y-10">
          <!-- Pay Summary -->
          <div
            class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-white shadow-xl">
            <div class="absolute -top-16 -right-20 w-56 h-56 bg-white/15 blur-3xl rounded-full"></div>
            <div class="absolute -bottom-20 -left-10 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
            <div class="relative px-10 py-12 text-center flex flex-col items-center space-y-4">
              <span class="text-sm uppercase tracking-widest text-white/80">Pay Amount</span>
              <div class="text-5xl font-extrabold tracking-tight">{{ formatCurrency(payAmount) }}</div>
              <div v-if="cardStore.selectedCardBin?.cardCurrency" class="text-sm text-white/80">
                {{ cardStore.selectedCardBin?.cardCurrency }} total for your card
              </div>
              <div
                class="mt-6 inline-flex items-center px-4 py-2 rounded-full text-sm text-white/90 bg-white/15 backdrop-blur-sm">
                <i class="pi pi-shield mr-2 text-white/90"></i>
                Secure crypto payment powered by {{ selectedPayType?.name || 'our partners' }}
              </div>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <i class="pi pi-credit-card text-blue-600 dark:text-blue-400 text-base"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Select Payment Method</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Choose a provider and network to continue</p>
                </div>
              </div>
              <span class="inline-flex items-center text-xs font-medium uppercase tracking-wide text-blue-600">
                <span class="w-2 h-2 mr-2 rounded-full bg-blue-500 animate-pulse"></span>
                {{ paymentMethods.length }} available
              </span>
            </div>

            <div v-if="loading" class="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
              <span class="text-gray-600 dark:text-gray-400">Loading payment methods...</span>
            </div>

            <div v-else class="space-y-4">
              <div v-for="payType in paymentMethods" :key="payType.name"
                class="border border-gray-200 dark:border-gray-600 rounded-xl p-5 cursor-pointer transition-all duration-200"
                :class="selectedPayType?.name === payType.name ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 shadow-md ring-2 ring-blue-100 dark:ring-blue-800/60' : 'hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm'"
                @click="selectPayType(payType)">
                <div class="flex flex-col gap-4">
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-600">
                      <img v-if="payType.img" :src="payType.img" :alt="payType.name"
                        class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center">
                        <span class="text-white font-bold text-lg">{{ payType.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white text-lg">{{ payType.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ payType.cryptoNetworks.length }} crypto
                        options</div>
                    </div>
                  </div>

                  <div v-if="selectedPayType?.name === payType.name"
                    class="flex items-center gap-3 text-blue-600 self-start">
                    <span class="text-sm font-medium">Currently selected</span>
                    <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                      <i class="pi pi-check text-white text-xs"></i>
                    </div>
                  </div>
                </div>

                <div v-if="selectedPayType?.name === payType.name"
                  class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
                    <span
                      class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Available
                      Networks</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">Selected: {{ selectedCrypto ?
                      selectedCrypto.crypto.name + '-' + selectedCrypto.network.name : 'None' }}</span>
                  </div>
                  <div class="grid grid-cols-1 gap-3">
                    <div v-for="crypto in payType.cryptoNetworks" :key="crypto.crypto.name + '-' + crypto.network.name"
                      class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 border border-transparent"
                      :class="[
                        selectedCrypto && selectedCrypto.crypto.name === crypto.crypto.name && selectedCrypto.network.name === crypto.network.name ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      ]" @click.stop="selectCrypto(crypto)">
                      <div class="flex items-center space-x-3">
                        <div
                          class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-600">
                          <img v-if="crypto.crypto.logoUrl" :src="crypto.crypto.logoUrl" :alt="crypto.crypto.name"
                            class="w-full h-full object-cover" />
                          <div v-else
                            class="w-full h-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center">
                            <span class="text-white font-bold text-sm">{{ crypto.crypto.name.charAt(0) }}</span>
                          </div>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900 dark:text-white">{{ crypto.crypto.fullName }}
                          </div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">{{ crypto.network.fullName }}</div>
                          <div class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Limit: ${{ crypto.minLimit }} - ${{ crypto.maxLimit }}
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="selectedCrypto && selectedCrypto.crypto.name === crypto.crypto.name && selectedCrypto.network.name === crypto.network.name"
                        class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                        <i class="pi pi-check text-white text-xs"></i>
                      </div>
                      <div v-else class="w-7 h-7 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Exchange Rate Info (Desktop) -->
          <div v-if="selectedCrypto && actualCryptoAmount"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <span class="text-gray-700 dark:text-gray-300">You will receive</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ actualCryptoAmount }} {{
                  selectedCrypto.crypto.name }}</span>
                <span class="text-gray-700 dark:text-gray-300">from</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(payAmount) }}</span>
              </div>
              <div v-if="countdown > 0" class="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <i class="pi pi-clock"></i>
                <span>{{ countdown }}s</span>
              </div>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-700 dark:text-gray-300">Transaction Fee</span>
              <span class="text-gray-700 dark:text-gray-300">
                {{ rateResult?.cryptoDetail?.cryptoFee || '0' }} {{ selectedCrypto.crypto.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="md:hidden">
        <div class="w-full max-w-md mx-auto space-y-6">
          <!-- Pay Summary -->
          <div
            class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-white shadow-xl">
            <div class="absolute -top-16 -right-20 w-56 h-56 bg-white/15 blur-3xl rounded-full"></div>
            <div class="absolute -bottom-20 -left-10 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
            <div class="relative px-6 py-8 text-center flex flex-col items-center space-y-3">
              <span class="text-sm uppercase tracking-widest text-white/80">Pay Amount</span>
              <div class="text-4xl font-extrabold tracking-tight">{{ formatCurrency(payAmount) }}</div>
              <div v-if="cardStore.selectedCardBin?.cardCurrency" class="text-sm text-white/80">
                {{ cardStore.selectedCardBin?.cardCurrency }} total for your card
              </div>
              <div
                class="mt-4 inline-flex items-center px-3 py-2 rounded-full text-xs text-white/90 bg-white/15 backdrop-blur-sm">
                <i class="pi pi-shield mr-2 text-white/90"></i>
                Secure crypto payment powered by {{ selectedPayType?.name || 'our partners' }}
              </div>
            </div>
          </div>

          <!-- Payment Methods Section -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <!-- Section Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <i class="pi pi-credit-card text-blue-600 text-sm"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Select Payment Method</h3>
                </div>
              </div>
              <div class="w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-8">
              <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
              <span class="ml-2 text-gray-600 dark:text-gray-400">Loading payment methods...</span>
            </div>

            <!-- Payment Methods Options -->
            <div v-else class="space-y-3">
              <div v-for="payType in paymentMethods" :key="payType.name"
                class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer transition-all duration-200"
                :class="selectedPayType?.name === payType.name ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 shadow-md' : 'hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm'"
                @click="selectPayType(payType)">

                <!-- Payment Method Header -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-600">
                      <img v-if="payType.img" :src="payType.img" :alt="payType.name"
                        class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full bg-gray-400 flex items-center justify-center">
                        <span class="text-white font-bold text-lg">{{ payType.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">{{ payType.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ payType.cryptoNetworks.length }} crypto
                        options</div>
                    </div>
                  </div>

                  <!-- Selection Indicator -->
                  <div v-if="selectedPayType?.name === payType.name"
                    class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <i class="pi pi-check text-white text-xs"></i>
                  </div>
                </div>

                <!-- Crypto Networks Selection -->
                <div v-if="selectedPayType?.name === payType.name"
                  class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Selected: {{ selectedCrypto ? `${selectedCrypto.crypto.name}-${selectedCrypto.network.name}` :
                      'None' }}
                  </div>
                  <div class="space-y-2">
                    <div v-for="crypto in payType.cryptoNetworks" :key="`${crypto.crypto.name}-${crypto.network.name}`"
                      class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200"
                      :class="[
                        selectedCrypto && selectedCrypto.crypto.name === crypto.crypto.name && selectedCrypto.network.name === crypto.network.name ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                        'border border-transparent'
                      ]" @click.stop="selectCrypto(crypto)">

                      <!-- Crypto Icon and Info -->
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                          <img v-if="crypto.crypto.logoUrl" :src="crypto.crypto.logoUrl" :alt="crypto.crypto.name"
                            class="w-full h-full object-cover" />
                          <div v-else
                            class="w-full h-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center">
                            <span class="text-white font-bold text-sm">{{ crypto.crypto.name.charAt(0) }}</span>
                          </div>
                        </div>
                        <div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">{{ crypto.crypto.fullName }}</div>
                          <div class="text-xs text-gray-400 dark:text-gray-500">{{ crypto.network.fullName }}</div>
                          <div class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Limit: ${{ crypto.minLimit }} - ${{ crypto.maxLimit }}
                          </div>
                        </div>
                      </div>

                      <!-- Selection Indicator -->
                      <div
                        v-if="selectedCrypto && selectedCrypto.crypto.name === crypto.crypto.name && selectedCrypto.network.name === crypto.network.name"
                        class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <i class="pi pi-check text-white text-xs"></i>
                      </div>
                      <div v-else class="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- Selected Crypto Details -->
          <!-- <div v-if="selectedCrypto" class="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Details</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400"> {{ cardStore.selectedCardBin?.cardCurrency }}
                  Amount:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(payAmount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Currency:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ selectedCrypto.crypto.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Network:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ selectedCrypto.network.fullName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Crypto Amount:</span>
                <span class="font-medium text-blue-600 dark:text-blue-400">
                  <span v-if="rateLoading" class="flex items-center space-x-1">
                    <i class="pi pi-spin pi-spinner text-xs"></i>
                    <span>Loading...</span>
                  </span>
                  <span v-else-if="actualCryptoAmount">{{ actualCryptoAmount }} {{ selectedCrypto.crypto.name }}</span>
                  <span v-else>-</span>
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Min Limit:</span>
                <span class="font-medium text-gray-900 dark:text-white">${{ selectedCrypto.minLimit }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Max Limit:</span>
                <span class="font-medium text-gray-900 dark:text-white">${{ selectedCrypto.maxLimit }}</span>
              </div>
            </div>
          </div> -->

          <!-- Exchange Rate Info (Mobile) -->
          <div v-if="selectedCrypto && actualCryptoAmount"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1">
                <span class="text-xs text-gray-600 dark:text-gray-400">You will receive</span>
                <div class="flex">
                  <span class="text-xs font-bold text-gray-900 dark:text-white">{{ actualCryptoAmount }}</span>
                  <span class="text-xs font-bold text-gray-900 dark:text-white">{{ selectedCrypto.crypto.name }}</span>
                </div>
                <span class="text-xs text-gray-600 dark:text-gray-400">from</span>
                <span class="text-xs font-bold text-gray-900 dark:text-white">{{ formatCurrency(payAmount) }}</span>
              </div>
              <div v-if="countdown > 0" class="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <i class="pi pi-clock"></i>
                <span>{{ countdown }}s</span>
              </div>
            </div>
            <div class="flex items-center justify-between text-xs mt-2">
              <span class="text-gray-600 dark:text-gray-400">Transaction Fee</span>
              <span class="text-gray-600 dark:text-gray-400">
                {{ rateResult?.cryptoDetail?.cryptoFee || '0' }} {{ selectedCrypto.crypto.name }}
              </span>
            </div>
          </div>

        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bottom-buttons-container relative md:static">
        <!-- Back Button -->
        <button class="bottom-button-dual bottom-button-dual-secondary flex items-center justify-center space-x-2"
          @click="goBack">
          <i class="pi pi-arrow-left"></i>
          <span>Back</span>
        </button>

        <!-- Continue Button -->
        <button :disabled="!selectedPayType || !selectedCrypto || rateLoading || creatingOrder"
          class="bottom-button-dual bottom-button-dual-primary" @click="handleContinue">
          <span v-if="creatingOrder" class="flex items-center space-x-2">
            <i class="pi pi-spin pi-spinner text-sm"></i>
            <span>Creating...</span>
          </span>
          <span v-else-if="rateLoading" class="flex items-center space-x-2">
            <i class="pi pi-spin pi-spinner text-sm"></i>
            <span>Loading rate...</span>
          </span>
          <span v-else-if="!selectedPayType">Select Payment</span>
          <span v-else-if="!selectedCrypto">Select Crypto</span>
          <span v-else-if="!actualCryptoAmount">Loading payment amount...</span>
          <span v-else>Pay {{ actualCryptoAmount }} {{ selectedCrypto.crypto.name }}<span v-if="countdown > 0"
              class="text-xs opacity-75"> ({{ countdown }}s)</span></span>
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
import { OrderAPI, type OrderPayType, type OrderCryptoNetwork } from '@/api/order'
import { useCardStore } from '@/stores/card'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()

// Payment amount and order info
const payAmount = ref(1000.00)

// Selected payment method and crypto currency
const selectedPayType = ref<OrderPayType | null>(null)
const selectedCrypto = ref<OrderCryptoNetwork | null>(null)

// Available payment methods from API
const paymentMethods = ref<OrderPayType[]>([])

// Loading state
const loading = ref(false)
const rateLoading = ref(false)
const creatingOrder = ref(false)

// Rate query result
const rateResult = ref<any>(null)
const actualCryptoAmount = ref<string>('')

// Currency symbol mapping
const currencySymbols: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'CNH': '¥',
  'GBP': '£',
  'JPY': '¥',
  'CAD': 'C$',
  'AUD': 'A$',
  'CHF': 'CHF',
  'SGD': 'S$',
  'HKD': 'HK$'
}

// Get current currency symbol
const currentCurrencySymbol = computed(() => {
  const currency = cardStore.selectedCardBin?.cardCurrency || 'USD'
  return currencySymbols[currency] || '$'
})

// Format currency
const formatCurrency = (amount: number) => {
  return `${currentCurrencySymbol.value}${amount.toFixed(2)}`
}


// Select payment method
const selectPayType = (payType: OrderPayType) => {
  selectedPayType.value = payType
  // Auto-select first crypto network if available
  if (payType.cryptoNetworks && payType.cryptoNetworks.length > 0) {
    selectedCrypto.value = payType.cryptoNetworks[0]
    // Start rate polling when both payment type and crypto are selected
    startRatePolling()
  } else {
    selectedCrypto.value = null
    rateResult.value = null
    actualCryptoAmount.value = ''
    // Stop polling if no crypto networks available
    stopRatePolling()
  }
}

// Select crypto currency
const selectCrypto = (crypto: OrderCryptoNetwork) => {
  selectedCrypto.value = crypto
  // Start rate polling when crypto is selected
  if (selectedPayType.value) {
    startRatePolling()
  }
}

// Query exchange rate
const queryRate = async () => {
  if (!selectedCrypto.value || !selectedPayType.value) {
    rateResult.value = null
    actualCryptoAmount.value = ''
    return
  }

  try {
    rateLoading.value = true
    const response = await OrderAPI.getRate({
      cryptoUnit: selectedCrypto.value.crypto.name,
      network: selectedCrypto.value.network.name,
      number: payAmount.value.toString(),
      saleDirection: 'BUY', // Deposit direction
      exchange: selectedPayType.value.name.toUpperCase() === 'BINANCEPAY' ? 'BINANCE' : 'WALLET',
      fiatUnit: cardStore.selectedCardBin?.cardCurrency || 'USD',
    })

    if (response.success && response.model) {
      rateResult.value = response.model
      actualCryptoAmount.value = response.model.cryptoDetail?.totalAmountCrypto || ''
    } else {
      toast.add({
        severity: 'error',
        summary: 'Rate Query Failed',
        detail: response.msg || 'Failed to get exchange rate',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Error querying rate:', error)
    toast.add({
      severity: 'error',
      summary: 'Rate Query Error',
      detail: (error as any)?.msg || 'Failed to get exchange rate',
      life: 3000
    })
  } finally {
    rateLoading.value = false
  }
}

// Rate polling state
const ratePollingInterval = ref<NodeJS.Timeout | null>(null)
const isRatePolling = ref(false)

// Countdown state
const countdown = ref(0)
const countdownInterval = ref<NodeJS.Timeout | null>(null)

// Start rate polling
const startRatePolling = () => {
  if (isRatePolling.value) {
    console.log('Rate polling already active, skipping')
    return
  }

  // Check if we have required data
  if (!selectedCrypto.value || !selectedPayType.value) {
    console.log('Cannot start polling: missing crypto or payment type', {
      crypto: selectedCrypto.value,
      payType: selectedPayType.value
    })
    return
  }

  isRatePolling.value = true
  console.log('Starting rate polling every 15 seconds', {
    crypto: selectedCrypto.value.crypto.name,
    network: selectedCrypto.value.network.sortName,
    payType: selectedPayType.value.name
  })

  // Initial query
  queryRate()

  // Start countdown
  startCountdown()

  // Set up polling
  ratePollingInterval.value = setInterval(() => {
    console.log('Polling exchange rate...')
    queryRate()
    // Restart countdown after each poll
    startCountdown()
  }, 15000) // Poll every 15 seconds
}

// Stop rate polling
const stopRatePolling = () => {
  if (ratePollingInterval.value) {
    clearInterval(ratePollingInterval.value)
    ratePollingInterval.value = null
  }
  isRatePolling.value = false
  stopCountdown()
  console.log('Rate polling stopped')
}

// Start countdown
const startCountdown = () => {
  countdown.value = 15
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }

  countdownInterval.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval.value!)
      countdownInterval.value = null
    }
  }, 1000)
}

// Stop countdown
const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
  countdown.value = 0
}

// Load payment methods from API
const loadPaymentMethods = async () => {
  try {
    loading.value = true
    const response = await OrderAPI.getPaymentMethods({ orderType: 'IN' })

    if (response.success && response.model.payTypes) {
      // Store all payment methods
      paymentMethods.value = response.model.payTypes
      // Auto-select first payment method if available
      if (paymentMethods.value.length > 0) {
        selectedPayType.value = paymentMethods.value[0]
        console.log('Auto-selected payment method:', paymentMethods.value[0].name)

        // Auto-select first crypto network of the first payment method
        if (paymentMethods.value[0].cryptoNetworks && paymentMethods.value[0].cryptoNetworks.length > 0) {
          selectedCrypto.value = paymentMethods.value[0].cryptoNetworks[0]
          console.log('Auto-selected crypto network:', paymentMethods.value[0].cryptoNetworks[0].crypto.name)

          // Start rate polling after auto-selecting payment method and crypto
          console.log('Attempting to start rate polling...')
          startRatePolling()
        } else {
          console.log('No crypto networks available for selected payment method')
        }
      } else {
        console.log('No payment methods available')
      }
    }
  } catch (error) {
    console.error('Error loading payment methods:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as any)?.msg || 'Failed to load payment methods',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Handle continue
const handleContinue = async () => {
  if (!selectedPayType.value) {
    toast.add({
      severity: 'warn',
      summary: 'Selection Required',
      detail: 'Please select a payment method',
      life: 3000
    })
    return
  }

  if (!selectedCrypto.value) {
    toast.add({
      severity: 'warn',
      summary: 'Selection Required',
      detail: 'Please select a cryptocurrency',
      life: 3000
    })
    return
  }

  if (!actualCryptoAmount.value) {
    toast.add({
      severity: 'warn',
      summary: 'Rate Loading',
      detail: 'Please wait for the exchange rate to load',
      life: 3000
    })
    return
  }

  if (creatingOrder.value) {
    return // Prevent multiple submissions
  }

  try {
    creatingOrder.value = true

    // Show loading toast
    toast.add({
      severity: 'info',
      summary: 'Creating Order',
      detail: 'Creating deposit order...',
      life: 3000
    })
    // Determine if it's card application or recharge operation
    const isRecharge = route.query.action === 'recharge'
    const orderType = isRecharge ? '2' : '1' // 1: Card Application 2: Recharge

    // Create deposit order
    const orderResponse = await OrderAPI.createDepositOrder({
      cardPattern: cardStore.selectedCardConfig?.cardPattern.toString() || '1', // 1: Virtual Card 2: Physical Card
      type: orderType, // 1: Card Application 2: Recharge
      cardBin: cardStore.selectedCardBin?.cardBin || '', // Get card bin from Pinia store
      payType: selectedPayType.value.name, // Payment method
      amount: payAmount.value, // Order amount
      orderCurrency: cardStore.selectedCardBin?.cardCurrency || 'USD', // Order currency
      userCardId: isRecharge ? (cardStore.selectedCardBin?.cardId || '') : (route.query.userCardId as string || ''), // User cardId, when type is 1, cardBin is required, when type is 2, userCardId is required
      token: selectedCrypto.value.crypto.name, // token
      network: selectedCrypto.value.network.name, // Network
      address: '' // Address, needs to be obtained based on actual business logic
    })

    if (orderResponse.success && orderResponse.model) {
      // Success toast
      toast.add({
        severity: 'success',
        summary: 'Order Created',
        detail: `Order ${orderResponse.model.orderNum} created successfully`,
        life: 3000
      })

      // Store order info in Pinia store
      cardStore.setCurrentOrder({
        orderNum: orderResponse.model.orderNum,
        webUrl: orderResponse.model.webUrl,
        deeplink: orderResponse.model.deeplink,
        qrcodeLink: orderResponse.model.qrcodeLink,
        exchange: orderResponse.model.exchange,
        amount: payAmount.value.toString(),
        orderCurrency: cardStore.selectedCardBin?.cardCurrency || 'USD',
        currency: selectedCrypto.value!.crypto.name,
        network: selectedCrypto.value!.network.name,
        payType: selectedPayType.value!.name,
        cryptoAmount: actualCryptoAmount.value,
        name: route.query.name || 'John Tan',
        expires: selectedPayType.value?.expires ?? null
      })

      // Navigate to crypto payment page
      setTimeout(() => {
        router.push({
          name: 'CryptoPayment',
          query: {
            orderNum: orderResponse.model.orderNum
          }
        })
      }, 2000)
    } else {
      toast.add({
        severity: 'error',
        summary: 'Order Creation Failed',
        detail: orderResponse.msg || 'Failed to create deposit order',
        life: 5000
      })
    }
  } catch (error) {
    console.error('Error creating deposit order:', error)
    toast.add({
      severity: 'error',
      summary: 'Order Creation Error',
      detail: (error as any)?.msg || 'Failed to create deposit order',
      life: 5000
    })
  } finally {
    creatingOrder.value = false
  }
}

// Go back to previous page
const goBack = () => {
  router.back()
}

// Initialize data from route params
onMounted(async () => {
  // Get amount from route query
  const amount = route.query.amount as string
  if (amount) {
    payAmount.value = parseFloat(amount)
  }
  // Load payment methods from API
  await loadPaymentMethods()
})

// Clean up polling on unmount
onUnmounted(() => {
  stopRatePolling()
  stopCountdown()
})
</script>

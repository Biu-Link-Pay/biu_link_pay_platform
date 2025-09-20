<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Unified Header -->
    <AppHeader title="Payment Method" :show-title="true" />

    <!-- Main Content -->
    <div
      class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
      <!-- Desktop Layout -->
      <div class="hidden md:block">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column: Payment Amount -->
          <div class="lg:col-span-1">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="text-center">
                <h2 class="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Pay Amount</h2>
                <div class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{{ formatCurrency(payAmount) }}</div>
              </div>
            </div>
          </div>

          <!-- Right Column: Payment Methods -->
          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <!-- Section Header -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <i class="pi pi-credit-card text-blue-600 dark:text-blue-400 text-sm"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Select Payment Method</h3>
                  </div>
                </div>
                <div class="w-4 h-4 bg-blue-600 rounded-full"></div>
              </div>

              <!-- Payment Methods Options -->
              <div v-if="loading" class="flex justify-center items-center py-8">
                <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
                <span class="ml-2 text-gray-600 dark:text-gray-400">Loading payment methods...</span>
              </div>

              <div v-else class="space-y-4">
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
                        <div v-else class="w-full h-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center">
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
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Cryptocurrency:</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Selected: {{ selectedCrypto ? `${selectedCrypto.crypto.name}-${selectedCrypto.network.name}` :
                        'None' }}
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div v-for="crypto in payType.cryptoNetworks"
                        :key="`${crypto.crypto.name}-${crypto.network.name}`"
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
                            <div class="font-semibold text-gray-900 dark:text-white">{{ crypto.crypto.name }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">{{ crypto.crypto.fullName }}</div>
                            <div class="text-xs text-gray-400 dark:text-gray-500">{{ crypto.network.fullName }}</div>
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
          </div>
        </div>

        <!-- Selected Crypto Details - Desktop -->
        <div v-if="selectedCrypto" class="mt-8">
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">USD Amount:</span>
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
          </div>
        </div>

        <!-- Action Buttons - Desktop -->
        <div class="bottom-buttons-container">
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
              <span>Creating Order...</span>
            </span>
            <span v-else-if="rateLoading" class="flex items-center space-x-2">
              <i class="pi pi-spin pi-spinner text-sm"></i>
              <span>Loading rate...</span>
            </span>
            <span v-else-if="!selectedPayType">Select a payment method</span>
            <span v-else-if="!selectedCrypto">Select a cryptocurrency</span>
            <span v-else-if="!actualCryptoAmount">Loading payment amount...</span>
            <span v-else>Pay {{ actualCryptoAmount }} {{ selectedCrypto.crypto.name }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="md:hidden">
        <div class="w-full max-w-md mx-auto">
          <!-- Pay Amount Section -->
          <div class="text-center mb-8">
            <h2 class="text-lg font-medium text-gray-600 mb-2">Pay Amount</h2>
            <div class="text-4xl font-bold text-gray-900 mb-4">{{ formatCurrency(payAmount) }}</div>
          </div>

          <!-- Payment Methods Section -->
          <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <!-- Section Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i class="pi pi-credit-card text-blue-600 text-sm"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Select Payment Method</h3>
                </div>
              </div>
              <div class="w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-8">
              <i class="pi pi-spin pi-spinner text-2xl text-blue-600"></i>
              <span class="ml-2 text-gray-600">Loading payment methods...</span>
            </div>

            <!-- Payment Methods Options -->
            <div v-else class="space-y-3">
              <div v-for="payType in paymentMethods" :key="payType.name"
                class="border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200"
                :class="selectedPayType?.name === payType.name ? 'bg-blue-50 border-blue-300 shadow-md' : 'hover:bg-gray-50 hover:shadow-sm'"
                @click="selectPayType(payType)">

                <!-- Payment Method Header -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100">
                      <img v-if="payType.img" :src="payType.img" :alt="payType.name"
                        class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full bg-gray-400 flex items-center justify-center">
                        <span class="text-white font-bold text-lg">{{ payType.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">{{ payType.name }}</div>
                      <div class="text-sm text-gray-500">{{ payType.cryptoNetworks.length }} crypto options</div>
                    </div>
                  </div>

                  <!-- Selection Indicator -->
                  <div v-if="selectedPayType?.name === payType.name"
                    class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <i class="pi pi-check text-white text-xs"></i>
                  </div>
                </div>

                <!-- Crypto Networks Selection -->
                <div v-if="selectedPayType?.name === payType.name" class="mt-3 pt-3 border-t border-gray-200">
                  <div class="text-sm font-medium text-gray-700 mb-3">Select Cryptocurrency:</div>
                  <div class="text-xs text-gray-500 mb-2">
                    Selected: {{ selectedCrypto ? `${selectedCrypto.crypto.name}-${selectedCrypto.network.name}` :
                      'None' }}
                  </div>
                  <div class="space-y-2">
                    <div v-for="crypto in payType.cryptoNetworks" :key="`${crypto.crypto.name}-${crypto.network.name}`"
                      class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200"
                      :class="[
                        selectedCrypto && selectedCrypto.crypto.name === crypto.crypto.name && selectedCrypto.network.name === crypto.network.name ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50',
                        'border border-transparent'
                      ]" @click.stop="selectCrypto(crypto)">

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
                          <div class="text-sm text-gray-500">{{ crypto.crypto.fullName }}</div>
                          <div class="text-xs text-gray-400">{{ crypto.network.fullName }}</div>
                        </div>
                      </div>

                      <!-- Selection Indicator -->
                      <div
                        v-if="selectedCrypto && selectedCrypto.crypto.name === crypto.crypto.name && selectedCrypto.network.name === crypto.network.name"
                        class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <i class="pi pi-check text-white text-xs"></i>
                      </div>
                      <div v-else class="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- Selected Crypto Details -->
          <div v-if="selectedCrypto" class="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Payment Details</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">USD Amount:</span>
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
                <span class="text-gray-600">Crypto Amount:</span>
                <span class="font-medium text-blue-600">
                  <span v-if="rateLoading" class="flex items-center space-x-1">
                    <i class="pi pi-spin pi-spinner text-xs"></i>
                    <span>Loading...</span>
                  </span>
                  <span v-else-if="actualCryptoAmount">{{ actualCryptoAmount }} {{ selectedCrypto.crypto.name }}</span>
                  <span v-else>-</span>
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Min Limit:</span>
                <span class="font-medium">${{ selectedCrypto.minLimit }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Max Limit:</span>
                <span class="font-medium">${{ selectedCrypto.maxLimit }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="bottom-buttons-container">
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
                <span>Creating Order...</span>
              </span>
              <span v-else-if="rateLoading" class="flex items-center space-x-2">
                <i class="pi pi-spin pi-spinner text-sm"></i>
                <span>Loading rate...</span>
              </span>
              <span v-else-if="!selectedPayType">Select a payment method</span>
              <span v-else-if="!selectedCrypto">Select a cryptocurrency</span>
              <span v-else-if="!actualCryptoAmount">Loading payment amount...</span>
              <span v-else>Pay {{ actualCryptoAmount }} {{ selectedCrypto.crypto.name }}</span>
            </button>
          </div>
        </div>
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

// Format currency
const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)} USD`
}


// Select payment method
const selectPayType = (payType: OrderPayType) => {
  selectedPayType.value = payType
  // Auto-select first crypto network if available
  if (payType.cryptoNetworks && payType.cryptoNetworks.length > 0) {
    selectedCrypto.value = payType.cryptoNetworks[0]
    // Query rate after selecting crypto
    queryRate()
  } else {
    selectedCrypto.value = null
    rateResult.value = null
    actualCryptoAmount.value = ''
  }
}

// Select crypto currency
const selectCrypto = (crypto: OrderCryptoNetwork) => {
  selectedCrypto.value = crypto
  // Query rate after selecting crypto
  queryRate()
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
      network: selectedCrypto.value.network.sortName,
      number: payAmount.value.toString(),
      saleDirection: 'BUY', // 入金方向
      exchange: selectedPayType.value.name.toUpperCase() === 'BINANCEPAY' ? 'BINANCE' : 'WALLET',
      fiatUnit: cardStore.selectedCardBin?.cardCurrency || 'USD',
    })

    if (response.success && response.model) {
      rateResult.value = response.model
      actualCryptoAmount.value = response.model.cryptoDetail.totalAmountCrypto
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
      detail: 'Failed to get exchange rate',
      life: 3000
    })
  } finally {
    rateLoading.value = false
  }
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
        // Auto-select first crypto network of the first payment method
        if (paymentMethods.value[0].cryptoNetworks && paymentMethods.value[0].cryptoNetworks.length > 0) {
          selectedCrypto.value = paymentMethods.value[0].cryptoNetworks[0]
          // Auto-query rate after selecting crypto
          await queryRate()
        }
      }
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

    // Create deposit order
    const orderResponse = await OrderAPI.createDepositOrder({
      cardPattern: cardStore.selectedCardConfig?.cardPattern.toString() || '1', // 1:虚拟卡 2:实体卡
      type: '1', // 1:办卡 2:充值，这里需要根据实际业务逻辑确定
      cardBin: cardStore.selectedCardBin?.cardBin || '', // 从 Pinia store 获取卡段
      payType: selectedPayType.value.name.toUpperCase() === 'BINANCEPAY' ? '1' : '2', // 1:binancePay，2:wallet
      amount: payAmount.value, // 订单金额
      orderCurrency: selectedCrypto.value.crypto.name, // 订单币种
      userCardId: route.query.userCardId as string || '', // 用户cardId，当类型为1时，cardBin必填,类型为2时，userCardId必填
      token: selectedCrypto.value.crypto.name, // token
      network: selectedCrypto.value.network.name, // 网络
      address: '' // 地址，这里需要根据实际业务逻辑获取
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
        currency: selectedCrypto.value!.crypto.name,
        network: selectedCrypto.value!.network.name,
        payType: selectedPayType.value!.name,
        cryptoAmount: actualCryptoAmount.value,
        name: route.query.name || 'John Tan'
      })

      // Navigate to crypto payment page
      setTimeout(() => {
        router.push({
          name: 'CryptoPayment'
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
      detail: 'Failed to create deposit order',
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
</script>

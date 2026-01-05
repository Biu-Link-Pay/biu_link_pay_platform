<template>
  <div>
    <!-- Desktop Layout -->
    <div class="hidden md:block space-y-8">
      <!-- Withdrawal Form -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i class="pi pi-arrow-up text-blue-600 dark:text-blue-400 text-base"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Withdrawal Details</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Configure your withdrawal settings</p>
            </div>
          </div>
          <span class="inline-flex items-center text-xs font-medium uppercase tracking-wide text-blue-600">
            <span class="w-2 h-2 mr-2 rounded-full bg-blue-500 animate-pulse"></span>
            {{ cardInfo.cardCurrency }} available
          </span>
        </div>

        <div class="space-y-6">
          <!-- Withdraw Amount Section -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
            <div class="flex items-center space-x-2 mb-4">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Withdraw amount</label>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(totalWithdrawAmount) }}
                <span v-if="appliedRewardPoints > 0"
                  class="ml-2 text-base font-semibold text-orange-500 dark:text-orange-400">
                  (Use {{ appliedRewardPoints.toLocaleString() }} pts)
                </span>
              </div>
              <span class="text-gray-700 dark:text-gray-300 font-medium">{{ cardInfo.cardCurrency }}</span>
            </div>
          </div>

          <!-- Receive Amount Section -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
            <div class="flex items-center space-x-2 mb-4">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Receive amount</label>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
              <span class="text-gray-600 dark:text-gray-400">Loading payment methods...</span>
            </div>

            <!-- Payment Methods Grid -->
            <div v-else class="space-y-4">
              <div v-for="payType in paymentMethods" :key="payType.name"
                class="border border-gray-200 dark:border-gray-600 rounded-xl p-5 cursor-pointer transition-all duration-200"
                :class="selectedPayType?.name === payType.name
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 shadow-md ring-2 ring-blue-100 dark:ring-blue-800/60'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-sm'" @click="selectPayType(payType)">
                <div class="flex flex-col gap-4">
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-600">
                      <img v-if="payType.img" :src="payType.img" :alt="payType.name"
                        class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center">
                        <span class="text-white font-bold text-lg">{{ payType.name }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white text-lg">{{ payType.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ payType.cryptoNetworks?.length || 0
                        }} crypto networks</div>
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

                <!-- Network Selection (Second Level) -->
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
                          <div class="text-sm font-medium text-gray-900 dark:text-white">{{ crypto.crypto.fullName
                            }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">{{ crypto.network.fullName }}
                          </div>
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
                      <div v-else class="w-7 h-7 border-2 border-gray-300 dark:border-gray-600 rounded-full">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rate Error State -->
            <div v-if="rateError" class="mt-2 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
              <i class="pi pi-exclamation-triangle"></i>
              <span>{{ rateError }}</span>
            </div>
          </div>

          <!-- Exchange Rate Info -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex flex-col gap-1">
                <div class="flex flex-wrap items-center space-x-2">
                  <span class="text-sm text-gray-600 dark:text-gray-400">You will receive</span>
                  <span class="text-base font-bold text-gray-900 dark:text-white">{{ receiveAmount }}</span>
                  <span class="text-base font-bold text-gray-900 dark:text-white">{{ selectedToken }}</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">from</span>
                  <span class="text-base font-bold text-gray-900 dark:text-white">{{
                    formatCurrency(withdrawAmount)
                    }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <i class="pi pi-clock"></i>
                <span>{{ countdown }}s</span>
              </div>
            </div>
            <div v-if="exchangeRate?.cryptoDetail?.cryptoToUsdTRate"
              class="text-xs text-gray-600 dark:text-gray-400 mb-2">
              1 {{ cardInfo.cardCurrency }} ≈ {{ exchangeRate.cryptoDetail.cryptoToUsdTRate }} {{ selectedToken }}
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-700 dark:text-gray-300">Transaction Fee</span>
              <span class="text-gray-700 dark:text-gray-300">{{ networkFee }} {{ selectedToken }}</span>
            </div>
          </div>

          <!-- Amount Limit Warning (Desktop) -->
          <div v-if="selectedCrypto && !isReceiveAmountWithinLimit"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400 text-lg"></i>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">Receive Amount Out of Range
                </h4>
                <p class="text-sm text-red-700 dark:text-red-300">{{ receiveLimitErrorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Send To Address -->
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Send to
              <span v-if="selectedCrypto" class="text-xs text-gray-500 ml-2">
                {{ selectedCrypto.network.fullName || selectedCrypto.network.name }} address
              </span>
            </label>
            <InputText v-model="recipientAddress"
              :placeholder="selectedCrypto ? `Enter ${selectedCrypto.network.fullName || selectedCrypto.network.name} address` : 'Enter recipient wallet address'"
              class="w-full" :class="{ 'p-invalid': errors.recipientAddress }" />
            <small v-if="errors.recipientAddress" class="text-red-500">{{ errors.recipientAddress }}</small>
            <small v-else-if="selectedCrypto && selectedCrypto.network && selectedCrypto.network.addressRegex"
              class="text-gray-500 text-xs mt-1 block">
              Address must match {{ selectedCrypto.network.fullName || selectedCrypto.network.name }} format
            </small>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-4">
        <Button label="Back" icon="pi pi-arrow-left" severity="secondary" class="flex-1" size="large" @click="goBack" />
        <Button label="Withdraw" icon="pi pi-send" class="flex-1" size="large" :disabled="!isFormValid"
          :loading="isSubmitting" @click="handleWithdraw" />
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="md:hidden space-y-4">
      <!-- Withdraw Amount -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2 mb-3">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Withdraw amount</label>
        </div>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ formatCurrency(totalWithdrawAmount) }}
            <span v-if="appliedRewardPoints > 0"
              class="ml-1 text-xs font-semibold text-orange-500 dark:text-orange-400">
              (Use {{ appliedRewardPoints.toLocaleString() }} pts)
            </span>
          </div>
          <span class="text-gray-700 dark:text-gray-300 font-medium">{{ cardInfo.cardCurrency }}</span>
        </div>
      </div>

      <!-- Payment Methods Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i class="pi pi-credit-card text-blue-600 text-sm"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h3>
            </div>
          </div>
          <div v-if="selectedPayType" class="w-4 h-4 bg-blue-600 rounded-full"></div>
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
                  <img v-if="payType.img" :src="payType.img" :alt="payType.name" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full bg-gray-400 flex items-center justify-center">
                    <span class="text-white font-bold text-lg">{{ payType.name.charAt(0) }}</span>
                  </div>
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">{{ payType.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ payType.cryptoNetworks?.length || 0 }}
                    crypto options</div>
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
                  'None'
                }}
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
                      <div v-else class="w-full h-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center">
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

      <!-- Rate Error State -->
      <div v-if="rateError" class="mt-2 flex items-center space-x-2 text-xs text-red-600 dark:text-red-400">
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ rateError }}</span>
      </div>

      <!-- Exchange Rate Info (Mobile) -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <div class="flex items-center space-x-1">
              <span class="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">You will receive</span>
              <div class="flex">
                <span class="text-xs font-bold text-gray-900 dark:text-white">{{ receiveAmount }}</span>
                <span class="text-xs font-bold text-gray-900 dark:text-white">{{ selectedToken }}</span>
              </div>
              <span class="text-xs text-gray-600 dark:text-gray-400">from</span>
              <span class="text-xs font-bold text-gray-900 dark:text-white">{{ formatCurrency(withdrawAmount)
                }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-1 text-xs text-gray-500">
            <i class="pi pi-clock"></i>
            <span>{{ countdown }}s</span>
          </div>
        </div>
        <div v-if="exchangeRate?.cryptoDetail?.cryptoToUsdTRate" class="text-xs text-gray-600 dark:text-gray-400 mt-2">
          1 {{ cardInfo.cardCurrency }} ≈ {{ exchangeRate.cryptoDetail.cryptoToUsdTRate }} {{ selectedToken }}
        </div>
        <div class="flex items-center justify-between text-xs mt-2">
          <span class="text-gray-600 dark:text-gray-400">Transaction Fee</span>
          <span class="text-gray-600 dark:text-gray-400">{{ networkFee }} {{ selectedToken }}</span>
        </div>
      </div>

      <!-- Amount Limit Warning (Mobile) -->
      <div v-if="selectedCrypto && !isReceiveAmountWithinLimit"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="pi pi-exclamation-triangle text-red-600 dark:text-red-400"></i>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">Receive Amount Out of Range</h4>
            <p class="text-xs text-red-700 dark:text-red-300">{{ receiveLimitErrorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Send To Address -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
          Send to
          <span v-if="selectedCrypto" class="text-xs text-gray-500 ml-2">
            {{ selectedCrypto.network.fullName || selectedCrypto.network.name }} address
          </span>
        </label>
        <InputText v-model="recipientAddress"
          :placeholder="selectedCrypto ? `Enter ${selectedCrypto.network.fullName || selectedCrypto.network.name} address` : 'Address required'"
          class="w-full" :class="{ 'p-invalid': errors.recipientAddress }" />
        <small v-if="errors.recipientAddress" class="text-red-500 text-xs">{{ errors.recipientAddress }}</small>
        <small v-else-if="selectedCrypto && selectedCrypto.network && selectedCrypto.network.addressRegex"
          class="text-gray-500 text-xs mt-1 block">
          Address must match {{ selectedCrypto.network.fullName || selectedCrypto.network.name }} format
        </small>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <Button label="Back" icon="pi pi-arrow-left" severity="secondary" class="flex-1" size="large" @click="goBack" />
        <Button label="Withdraw" icon="pi pi-send" class="flex-1" size="large" :disabled="!isFormValid"
          :loading="isSubmitting" @click="handleWithdraw" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { OrderAPI } from '@/api/order'
import { useCardStore } from '@/stores/card'
import { useUserStore } from '@/stores/user'

interface Props {
  cardInfo: {
    cardId: string
    cardNo: string
    cardCurrency: string
    maxOnDaily: number
    maxOnMonthly: number
    maxOnPercent: number
  }
  cardDetail: any
  balance: number
  withdrawAmount: number
  appliedRewardPoints: number
  isDeleteAction: boolean
}

const props = defineProps<Props>()

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()
const userStore = useUserStore()

// Payment methods from API
const paymentMethods = ref<any[]>([])
const loading = ref(false)

// Form data
const minimumBalance = ref(1.00)
const receiveAmount = ref(0)
const recipientAddress = ref('')
const selectedCurrency = ref('USD')
const selectedToken = ref('TPT')
const selectedNetwork = ref('BNB Chain (BEP20)')
const networkFee = ref(12)

// Reward points
const discountAmount = computed(() => {
  const value = props.appliedRewardPoints / 100
  if (!Number.isFinite(value))
    return 0
  return parseFloat(value.toFixed(2))
})

// Total withdraw amount = cash amount + equivalent points amount
const totalWithdrawAmount = computed(() => {
  const base = props.withdrawAmount || 0
  const bonus = discountAmount.value || 0
  return base + bonus
})

const triggerImmediateRateRefreshForWithdraw = () => {
  if (!selectedCrypto.value || !selectedPayType.value) return
  fetchExchangeRate()
}

// Exchange rate data
const exchangeRate = ref<any>(null)
const rateLoading = ref(false)
const rateError = ref('')

// Rate polling state
const ratePollingInterval = ref<NodeJS.Timeout | null>(null)
const isRatePolling = ref(false)

// Countdown state
const countdown = ref(0)
const countdownInterval = ref<NodeJS.Timeout | null>(null)

// Two-level selection for payment methods
const selectedPayType = ref<any>(null)
const selectedCrypto = ref<any>(null)

// UI state
const isSubmitting = ref(false)

// Form validation
const errors = ref({
  withdrawAmount: '',
  recipientAddress: ''
})

// Options
const tokens = ['TPT', 'USDT', 'USDC', 'BNB', 'ETH']
const networks = ['BNB Chain (BEP20)', 'Ethereum (ERC20)', 'Polygon (MATIC)', 'Arbitrum']

// Computed properties
const isFormValid = computed(() => {
  const base = recipientAddress.value.length > 0 && selectedPayType.value !== null && selectedCrypto.value !== null
  if (props.isDeleteAction) return base

  const hasFiatAmount = props.withdrawAmount > 0
  const hasPoints = props.appliedRewardPoints > 0

  // Only use card points withdrawal: amount is 0 but has points
  if (!hasFiatAmount && hasPoints) {
    return base
  }

  // Neither amount nor points, not allowed to submit
  if (!hasFiatAmount && !hasPoints) {
    return false
  }

  // When there is withdrawal amount, validate according to original amount validation
  return base &&
    props.withdrawAmount >= minimumBalance.value &&
    props.withdrawAmount <= props.balance &&
    props.withdrawAmount <= getMaxWithdrawAmount()
})

// Check if receive amount is within selected crypto's limit
const isReceiveAmountWithinLimit = computed(() => {
  if (!selectedCrypto.value) return true

  const receiveUsdAmount = receiveAmount.value || 0
  if (isNaN(receiveUsdAmount)) return true

  const minLimit = selectedCrypto.value.minLimit
  const maxLimit = selectedCrypto.value.maxLimit
  return receiveUsdAmount >= minLimit && receiveUsdAmount <= maxLimit
})

// Get receive amount limit error message
const receiveLimitErrorMessage = computed(() => {
  if (!selectedCrypto.value) return ''

  const receiveUsdAmount = receiveAmount.value || 0
  if (isNaN(receiveUsdAmount)) return ''

  const minLimit = selectedCrypto.value.minLimit
  const maxLimit = selectedCrypto.value.maxLimit

  if (receiveUsdAmount < minLimit) {
    return `Receive amount must be at least ${formatCurrency(minLimit)} for ${selectedCrypto.value.crypto.name}`
  }
  if (receiveUsdAmount > maxLimit) {
    return `Receive amount exceeds maximum limit of ${formatCurrency(maxLimit)} for ${selectedCrypto.value.crypto.name}`
  }
  return ''
})

// Calculate maximum withdraw amount based on card balance
const getMaxWithdrawAmount = () => {
  if (!props.cardDetail) return props.balance

  const cardBalance = (props.cardDetail as any).cardBalance || 0
  const availableBalance = parseFloat(cardBalance.toString()) || 0

  const maxDaily = props.cardInfo.maxOnDaily || availableBalance
  const maxPercent = props.cardInfo.maxOnPercent || availableBalance

  return Math.min(availableBalance, maxDaily, maxPercent)
}

// Methods
const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Go back
const goBack = () => {
  router.back()
}

// Select payment method
const selectPayType = (payType: any) => {
  if (selectedPayType.value?.name === payType.name) {
    console.log('Payment type unchanged, skipping operations')
    return
  }

  console.log('Payment type changed from', selectedPayType.value?.name, 'to', payType.name)

  selectedPayType.value = payType
  selectedToken.value = payType.name

  if (payType.cryptoNetworks && payType.cryptoNetworks.length > 0) {
    selectedCrypto.value = payType.cryptoNetworks[0]
    selectedNetwork.value = payType.cryptoNetworks[0].network.name || payType.cryptoNetworks[0].network.fullName

    // Note: startRatePolling() will fetch immediately; avoid duplicate fetch here
    console.log('Payment type changed, restarting rate polling...')
  } else {
    selectedCrypto.value = null
    selectedNetwork.value = ''
  }

  if (selectedCrypto.value) {
    stopRatePolling()
    startRatePolling()
  } else {
    stopRatePolling()
  }
}

// Select crypto currency
const selectCrypto = (crypto: any) => {
  const currentCryptoKey = selectedCrypto.value ? `${selectedCrypto.value.crypto.name}-${selectedCrypto.value.network.name}` : null
  const newCryptoKey = `${crypto.crypto.name}-${crypto.network.name}`

  if (currentCryptoKey === newCryptoKey) {
    console.log('Crypto selection unchanged, skipping operations')
    return
  }

  console.log('Crypto selection changed from', currentCryptoKey, 'to', newCryptoKey)

  selectedCrypto.value = crypto
  selectedNetwork.value = crypto.network.name || crypto.network.fullName
  selectedToken.value = crypto.crypto.name

  stopRatePolling()
  startRatePolling()
}

// Legacy functions for backward compatibility
const selectToken = (token: string) => {
  const paymentType = paymentMethods.value.find(pt => pt.name === token)
  if (paymentType) {
    selectPayType(paymentType)
  }
}

const selectNetwork = (network: string) => {
  if (selectedPayType.value && selectedPayType.value.cryptoNetworks) {
    const cryptoNetwork = selectedPayType.value.cryptoNetworks.find((crypto: any) =>
      crypto.network.name === network || crypto.network.fullName === network
    )
    if (cryptoNetwork) {
      selectCrypto(cryptoNetwork)
    }
  }
}

const validateForm = () => {
  errors.value = {
    withdrawAmount: '',
    recipientAddress: ''
  }

  if (!props.isDeleteAction) {
    const hasFiatAmount = props.withdrawAmount > 0
    const hasPoints = props.appliedRewardPoints > 0

    if (!hasFiatAmount && !hasPoints) {
      errors.value.withdrawAmount = 'Amount or points must be greater than 0'
    } else if (hasFiatAmount) {
      if (props.withdrawAmount < minimumBalance.value) {
        errors.value.withdrawAmount = `Amount must be at least ${formatCurrency(minimumBalance.value)}`
      } else if (props.withdrawAmount > props.balance) {
        errors.value.withdrawAmount = 'Amount exceeds available balance'
      } else if (props.withdrawAmount > getMaxWithdrawAmount()) {
        errors.value.withdrawAmount = `Amount exceeds maximum withdraw limit of ${formatCurrency(getMaxWithdrawAmount())}`
      } else if (props.cardInfo.maxOnDaily && props.withdrawAmount > props.cardInfo.maxOnDaily) {
        errors.value.withdrawAmount = `Amount exceeds daily limit of ${formatCurrency(props.cardInfo.maxOnDaily)}`
      } else if (props.cardInfo.maxOnPercent && props.withdrawAmount > props.cardInfo.maxOnPercent) {
        errors.value.withdrawAmount = `Amount exceeds single transaction limit of ${formatCurrency(props.cardInfo.maxOnPercent)}`
      }
    }
  }

  if (!recipientAddress.value) {
    errors.value.recipientAddress = 'Recipient address is required'
  } else {
    if (selectedCrypto.value && selectedCrypto.value.network && selectedCrypto.value.network.addressRegex) {
      const addressRegex = new RegExp(selectedCrypto.value.network.addressRegex)
      console.log('Validating address:', {
        address: recipientAddress.value,
        network: selectedCrypto.value.network.fullName || selectedCrypto.value.network.name,
        regex: selectedCrypto.value.network.addressRegex,
        isValid: addressRegex.test(recipientAddress.value)
      })
      if (!addressRegex.test(recipientAddress.value)) {
        errors.value.recipientAddress = `Invalid address format for ${selectedCrypto.value.network.fullName || selectedCrypto.value.network.name}`
      }
    } else if (recipientAddress.value.length < 10) {
      errors.value.recipientAddress = 'Invalid address format'
    }
  }
}

const handleWithdraw = async () => {
  validateForm()

  if (!props.isDeleteAction && !isFormValid.value) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please check the form and try again',
      life: 3000
    })
    return
  }

  if (!props.cardInfo.cardId) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Card information is missing. Please go back and try again.',
      life: 3000
    })
    return
  }

  if (!selectedPayType.value) {
    toast.add({
      severity: 'error',
      summary: 'Selection Error',
      detail: 'Please select a payment type.',
      life: 3000
    })
    return
  }

  if (!selectedCrypto.value) {
    toast.add({
      severity: 'error',
      summary: 'Selection Error',
      detail: 'Please select a crypto network.',
      life: 3000
    })
    return
  }

  if (!recipientAddress.value) {
    toast.add({
      severity: 'error',
      summary: 'Address Required',
      detail: 'Please enter a recipient address.',
      life: 3000
    })
    return
  }

  if (selectedCrypto.value && !props.isDeleteAction) {
    const minLimit = selectedCrypto.value.minLimit || 0
    const maxLimit = selectedCrypto.value.maxLimit || Infinity

    const receiveUsdAmount = receiveAmount.value || 0
    if (receiveUsdAmount < minLimit) {
      toast.add({
        severity: 'error',
        summary: 'Receive Amount Below Limit',
        detail: `Your receive amount is ${receiveUsdAmount}, which is below the minimum limit of ${formatCurrency(minLimit)} for ${selectedCrypto.value.crypto.name} on ${selectedCrypto.value.network.name}. Please increase your withdrawal amount.`,
        life: 5000
      })
      return
    }

    if (receiveUsdAmount > maxLimit) {
      toast.add({
        severity: 'error',
        summary: 'Receive Amount Exceeds Limit',
        detail: `Your receive amount is ${receiveUsdAmount}, which exceeds the maximum limit of ${formatCurrency(maxLimit)} for ${selectedCrypto.value.crypto.name} on ${selectedCrypto.value.network.name}. Please reduce your withdrawal amount.`,
        life: 5000
      })
      return
    }
  }

  if (selectedCrypto.value.network && selectedCrypto.value.network.addressRegex) {
    const addressRegex = new RegExp(selectedCrypto.value.network.addressRegex)
    if (!addressRegex.test(recipientAddress.value)) {
      console.log('Address validation failed on submission:', {
        address: recipientAddress.value,
        network: selectedCrypto.value.network.fullName || selectedCrypto.value.network.name,
        regex: selectedCrypto.value.network.addressRegex,
        isValid: false
      })
      toast.add({
        severity: 'error',
        summary: 'Invalid Address Format',
        detail: `The address format is invalid for ${selectedCrypto.value.network.fullName || selectedCrypto.value.network.name}. Please check and try again.`,
        life: 5000
      })
      return
    }
  } else {
    if (recipientAddress.value.length < 10) {
      toast.add({
        severity: 'error',
        summary: 'Invalid Address',
        detail: 'The address format appears to be invalid. Please check and try again.',
        life: 3000
      })
      return
    }
  }

  isSubmitting.value = true

  try {
    const cardFromList = cardStore.cardList.find(card => card.cardId === props.cardInfo.cardId)
    const maskedCardNo = cardFromList?.cardNo || props.cardInfo.cardNo || ''
    const payTypeValue = selectedPayType.value?.name.toUpperCase() === 'BINANCE' ? 'BINANCE' : 'WALLET'

    const response = await OrderAPI.createWithdrawOrder({
      cardPattern: '1',
      type: '1',
      cardId: props.cardInfo.cardId,
      token: selectedCrypto.value.crypto.name,
      network: selectedCrypto.value.network.name,
      address: recipientAddress.value,
      delFlag: props.isDeleteAction,
      withdrawAmount: (props.isDeleteAction ? getMaxWithdrawAmount() : props.withdrawAmount).toString(),
      cardNo: maskedCardNo,
      cardRewardPoints: props.appliedRewardPoints,
      payType: payTypeValue,
      customParam: ''
    })

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Withdraw Order Created',
        detail: `Order #${response.model} has been submitted successfully`,
        life: 3000
      })

      userStore.fetchUserProfile().catch(error => {
        console.warn('Failed to refresh user profile after withdraw order:', error)
      })

      router.push({
        name: 'PaymentResult',
        query: {
          orderNum: response.model,
          status: 'PENDING',
          amount: props.withdrawAmount.toString(),
          currency: selectedCrypto.value.crypto.name,
          network: selectedCrypto.value.network.name,
          address: recipientAddress.value,
          type: 'withdraw'
        }
      })
    } else {
      throw new Error(response.msg || 'Failed to create withdraw order')
    }
  } catch (error) {
    console.error('Withdraw error:', error)
    toast.add({
      severity: 'error',
      summary: 'Withdraw Failed',
      detail: (error as any)?.message || 'Failed to create withdraw order. Please try again.',
      life: 3000
    })
  } finally {
    isSubmitting.value = false
  }
}

// Watch for address changes to validate in real-time
watch([recipientAddress, selectedCrypto], ([newAddress, newCrypto], [oldAddress, oldCrypto]) => {
  if (newAddress && newCrypto && newCrypto.network && newCrypto.network.addressRegex) {
    if (errors.value.recipientAddress && errors.value.recipientAddress.includes('Invalid address format')) {
      errors.value.recipientAddress = ''
    }

    const addressRegex = new RegExp(newCrypto.network.addressRegex)
    const isValid = addressRegex.test(newAddress)
    console.log('Real-time address validation:', {
      address: newAddress,
      network: newCrypto.network.fullName || newCrypto.network.name,
      regex: newCrypto.network.addressRegex,
      isValid
    })
    if (!isValid) {
      errors.value.recipientAddress = `Invalid address format for ${newCrypto.network.fullName || newCrypto.network.name}`
    }
  }
})

// Watch for form changes to update receive amount
watch([() => props.withdrawAmount, selectedToken, exchangeRate], () => {
  updateReceiveAmount()
})

// Watch for amount changes to fetch new exchange rate
watch(() => props.withdrawAmount, (newAmount, oldAmount) => {
  if (newAmount > 0 && selectedCrypto.value && newAmount !== oldAmount) {
    console.log('Amount changed, fetching new exchange rate...', {
      oldAmount,
      newAmount,
      selectedCrypto: selectedCrypto.value.crypto.name
    })
    stopRatePolling()
    startRatePolling()
  }
})

// Fetch exchange rate from API
const fetchExchangeRate = async () => {
  if (!selectedCrypto.value || (!props.withdrawAmount && !props.appliedRewardPoints)) {
    return
  }

  rateLoading.value = true
  rateError.value = ''

  try {
    console.log('Fetching exchange rate for withdrawal...', {
      cryptoUnit: selectedCrypto.value.crypto.name,
      network: selectedCrypto.value.network.name,
      amount: props.withdrawAmount,
      fiatUnit: selectedCurrency.value,
      exchange: selectedPayType.value?.name,
      payTypeName: selectedPayType.value?.name
    })

    const requestedPoints = props.appliedRewardPoints || 0

    const response = await OrderAPI.getRate({
      cryptoUnit: selectedCrypto.value.crypto.name,
      network: selectedCrypto.value.network.name,
      number: props.withdrawAmount.toString(),
      saleDirection: 'SELL',
      exchange: selectedPayType.value?.name.toUpperCase() === 'BINANCE' ? 'BINANCE' : 'WALLET',
      fiatUnit: selectedCurrency.value,
      cardRewardPoints: requestedPoints
    })

    if (response.success && response.model) {
      exchangeRate.value = response.model
      console.log('Exchange rate loaded:', response.model)

      if (response.model.cryptoDetail && response.model.cryptoDetail.cryptoFee) {
        networkFee.value = parseFloat(response.model.cryptoDetail.cryptoFee) || 0
      }

      updateReceiveAmount()
    } else {
      throw new Error(response.msg || 'Failed to get exchange rate')
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    rateError.value = (error as any)?.message || 'Failed to get exchange rate'

    exchangeRate.value = null
    updateReceiveAmount()
  } finally {
    rateLoading.value = false
  }
}

// Start countdown timer
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

// Start rate polling every 15s
const startRatePolling = () => {
  if (isRatePolling.value) return
  if (!selectedCrypto.value) return
  isRatePolling.value = true
  fetchExchangeRate()
  startCountdown()
  ratePollingInterval.value = setInterval(() => {
    fetchExchangeRate()
    startCountdown()
  }, 15000)
}

// Stop rate polling
const stopRatePolling = () => {
  if (ratePollingInterval.value) {
    clearInterval(ratePollingInterval.value)
    ratePollingInterval.value = null
  }
  isRatePolling.value = false
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
  countdown.value = 0
}

// Update receive amount based on exchange rate
const updateReceiveAmount = () => {
  if (!exchangeRate.value || !exchangeRate.value.cryptoDetail) {
    receiveAmount.value = 0
    return
  }

  const cryptoAmount = parseFloat(exchangeRate.value.cryptoDetail.cryptoAmount) || 0
  receiveAmount.value = cryptoAmount
  console.log('Receive amount updated with real rate:', {
    withdrawAmount: props.withdrawAmount,
    appliedRewardPoints: props.appliedRewardPoints,
    receiveAmount: receiveAmount.value,
    rate: exchangeRate.value
  })
}

// Fetch payment methods from API
const fetchPaymentMethods = async () => {
  loading.value = true
  try {
    console.log('Fetching payment methods for withdrawal...')

    const response = await OrderAPI.getPaymentMethods({
      orderType: 'OUT'
    })

    loading.value = false
    if (response.success && response.model && response.model.payTypes) {
      paymentMethods.value = response.model.payTypes
      console.log('Payment methods loaded:', response.model.payTypes)
      if (response.model.payTypes.length > 0) {
        selectedPayType.value = response.model.payTypes[0]
        console.log('Auto-selected payment method:', response.model.payTypes[0].name)

        if (response.model.payTypes[0].cryptoNetworks && response.model.payTypes[0].cryptoNetworks.length > 0) {
          selectedCrypto.value = response.model.payTypes[0].cryptoNetworks[0]
          selectedToken.value = response.model.payTypes[0].cryptoNetworks[0].crypto.name
          selectedNetwork.value = response.model.payTypes[0].cryptoNetworks[0].network.name || response.model.payTypes[0].cryptoNetworks[0].network.fullName
          console.log('Auto-selected crypto network:', response.model.payTypes[0].cryptoNetworks[0].crypto.name)

          // Note: rate polling will do the first fetch immediately; avoid duplicate fetch on init
        } else {
          console.log('No crypto networks available for selected payment method')
        }
      } else {
        console.log('No payment methods available')
      }
    } else {
      console.warn('No payment methods returned from API')
      throw new Error(response.msg || 'No payment methods available')
    }
  } catch (error) {
    loading.value = false
    console.error('Error fetching payment methods:', error)
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: (error as any)?.message || 'Failed to load payment methods, using defaults',
      life: 3000
    })

    paymentMethods.value = tokens.map(token => ({
      name: token,
      img: null,
      cryptoNetworks: []
    }))

    if (tokens.length > 0) {
      selectedPayType.value = paymentMethods.value[0]
      selectedToken.value = paymentMethods.value[0].name
      console.log('Fallback token initialized:', paymentMethods.value[0].name)
    }
  } finally {
    loading.value = false
  }
}

// Initialize on mount
onMounted(async () => {
  console.log('CryptoWithdrawal mounted, starting initialization...')

  selectedCurrency.value = props.cardInfo.cardCurrency
  minimumBalance.value = 1.00

  if (cardStore.cardList.length === 0) {
    await cardStore.fetchCardList({ silent: true })
  }

  await fetchPaymentMethods()
  if (selectedCrypto.value) {
    startRatePolling()
  }
})

// Clean up
onUnmounted(() => {
  stopRatePolling()
})
</script>

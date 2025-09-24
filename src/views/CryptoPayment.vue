<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Unified Header -->
    <AppHeader title="Crypto Payment" :show-title="true" />

    <!-- Main Content -->
    <div
      class="w-full max-w-2xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <!-- Desktop Layout -->
      <div class="hidden md:block">
        <div class="space-y-8">
          <!-- Left Column: Order Information -->
          <div class="space-y-6">
            <!-- Order Information -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Order Number -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Order NO.</div>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-mono text-gray-900 dark:text-white">{{ orderNumber }}</span>
                    <button @click="copyToClipboard(orderNumber)"
                      class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Copy order number">
                      <i class="pi pi-copy text-gray-500 text-xs"></i>
                    </button>
                  </div>
                </div>

                <!-- Order Amount -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Order amount</div>
                  <div class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(orderAmount) }}</div>
                </div>

                <!-- You need to pay -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">You need to pay</div>
                  <div class="flex items-center space-x-2">
                    <span class="text-lg font-bold text-gray-900 dark:text-white">{{ cryptoAmount }} {{ selectedCrypto
                    }}</span>
                    <div class="w-6 h-6 rounded-full flex items-center justify-center"
                      :class="getCryptoIconBg(selectedCrypto)">
                      <span class="text-white font-bold text-xs">{{ getCryptoIcon(selectedCrypto) }}</span>
                    </div>
                    <button @click="copyToClipboard(cryptoAmount)"
                      class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Copy amount">
                      <i class="pi pi-copy text-gray-500 text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Network Fee Warning -->
            <div
              class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <div class="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="pi pi-exclamation-triangle text-white text-xs"></i>
                </div>
                <div class="text-sm text-orange-800 dark:text-orange-200">
                  <span class="font-semibold">DON'T forget to add the Network Fee</span> when transferring, so as not to
                  fail
                  due to insufficient transfer amount.
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Payment Information -->
          <div class="space-y-6">
            <!-- Payment Information Section -->
            <div v-if="isOrderPending"
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="space-y-6">
                <!-- Section Header -->
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Payment Information</h3>
                  <div class="flex items-center space-x-2">
                    <i class="pi pi-clock text-sm"></i>
                    <div class="flex items-center space-x-1">
                      <div class="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-1">
                        <span class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ formatTime(countdown).split(':')[0] }}</span>
                      </div>
                      <span class="text-gray-600 dark:text-gray-400 font-bold">:</span>
                      <div class="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-1">
                        <span class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ formatTime(countdown).split(':')[1] }}</span>
                      </div>
                      <span class="text-gray-600 dark:text-gray-400 font-bold">:</span>
                      <div class="bg-gray-100 dark:bg-gray-600 rounded-lg px-3 py-1">
                        <span class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ formatTime(countdown).split(':')[2] }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Network Type -->
                  <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Network Type</div>
                    <div class="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      {{ selectedCrypto }}({{ selectedNetwork }}) only
                    </div>
                  </div>

                  <!-- Payment Address -->
                  <div class="space-y-2">
                    <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Address:</div>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
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
                </div>

                <!-- QR Code -->
                <!-- <div class="flex justify-center">
                  <div class="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div class="w-48 h-48 flex items-center justify-center">
                      <img v-if="cardStore.currentOrder?.qrcodeLink" :src="cardStore.currentOrder.qrcodeLink"
                        alt="Payment QR Code" class="w-full h-full object-contain rounded"
                        @error="qrCodeError = true" />
                      <div v-else
                        class="w-full h-full bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                        <div class="text-center">
                          <div class="text-4xl mb-2">📱</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">QR Code</div>
                          <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ walletAddress.slice(0, 8) }}...
                          </div>
                        </div>
                      </div>
                      <div v-if="qrCodeError"
                        class="w-full h-full bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                        <div class="text-center text-red-500">
                          <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
                          <div class="text-sm">Failed to load QR Code</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>

            <!-- Success Status Content -->
            <div v-else-if="isOrderSuccess"
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="space-y-6">
                <div class="text-center">
                  <div
                    class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="pi pi-check text-green-600 dark:text-green-400 text-2xl"></i>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Your payment of {{ cryptoAmount }} {{ selectedCrypto }} has been confirmed.
                  </p>
                </div>
                <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div class="text-sm text-green-800 dark:text-green-200">
                    <div class="font-medium mb-3">Transaction Details:</div>
                    <div class="grid grid-cols-2 gap-4 text-xs">
                      <div>Amount: {{ formatCurrency(orderAmount) }}</div>
                      <div>Currency: {{ selectedCrypto }}</div>
                      <div>Network: {{ selectedNetwork }}</div>
                      <div>Order: {{ orderNumber }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Failed Status Content -->
            <div v-else-if="isOrderFailed"
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="space-y-6">
                <div class="text-center">
                  <div
                    class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="pi pi-times text-red-600 dark:text-red-400 text-2xl"></i>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Payment Failed</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Your payment could not be processed. Please try again.
                  </p>
                </div>
                <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <div class="text-sm text-red-800 dark:text-red-200">
                    <div class="font-medium mb-3">Order Details:</div>
                    <div class="grid grid-cols-2 gap-4 text-xs">
                      <div>Amount: {{ formatCurrency(orderAmount) }}</div>
                      <div>Currency: {{ selectedCrypto }}</div>
                      <div>Order: {{ orderNumber }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cancelled Status Content -->
            <div v-else-if="isOrderCancelled"
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="space-y-6">
                <div class="text-center">
                  <div
                    class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="pi pi-ban text-gray-600 dark:text-gray-400 text-2xl"></i>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Payment Cancelled</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    This payment has been cancelled.
                  </p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div class="text-sm text-gray-800 dark:text-gray-200">
                    <div class="font-medium mb-3">Order Details:</div>
                    <div class="grid grid-cols-2 gap-4 text-xs">
                      <div>Amount: {{ formatCurrency(orderAmount) }}</div>
                      <div>Currency: {{ selectedCrypto }}</div>
                      <div>Order: {{ orderNumber }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Status - Desktop (Legacy) -->
        <div v-if="paymentStatus && !orderDetail" class="mt-6">
          <div
            class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-md mx-auto">
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
      </div>

      <!-- Mobile Layout -->
      <div class="md:hidden space-y-6">
        <!-- Order Information -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
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
        <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <div class="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <i class="pi pi-exclamation-triangle text-white text-xs"></i>
            </div>
            <div class="text-sm text-orange-800 dark:text-orange-200">
              <span class="font-semibold">DON'T forget to add the Network Fee</span> when transferring, so as not to
              fail
              due to insufficient transfer amount.
            </div>
          </div>
        </div>

        <!-- Payment Information Section -->
        <div v-if="isOrderPending"
          class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="space-y-4">
            <!-- Section Header -->
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Payment Information</h3>
              <div class="flex items-center space-x-2">
                <i class="pi pi-clock text-sm"></i>
                <div class="flex items-center space-x-1">
                  <div class="bg-gray-100 dark:bg-gray-600 rounded-lg px-2 py-1">
                    <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ formatTime(countdown).split(':')[0] }}</span>
                  </div>
                  <span class="text-gray-600 dark:text-gray-400 font-bold text-sm">:</span>
                  <div class="bg-gray-100 dark:bg-gray-600 rounded-lg px-2 py-1">
                    <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ formatTime(countdown).split(':')[1] }}</span>
                  </div>
                  <span class="text-gray-600 dark:text-gray-400 font-bold text-sm">:</span>
                  <div class="bg-gray-100 dark:bg-gray-600 rounded-lg px-2 py-1">
                    <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ formatTime(countdown).split(':')[2] }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Network Type -->
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
                {{ selectedCrypto }}({{ selectedNetwork }}) only
              </div>
            </div>

            <!-- Payment Address -->
            <div class="space-y-2">
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Address:</div>
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
            <!-- <div class="flex justify-center">
              <div class="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <div class="w-48 h-48 flex items-center justify-center">
                  <img v-if="cardStore.currentOrder?.qrcodeLink" :src="cardStore.currentOrder.qrcodeLink"
                    alt="Payment QR Code" class="w-full h-full object-contain rounded" @error="qrCodeError = true" />
                  <div v-else
                    class="w-full h-full bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-4xl mb-2">📱</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">QR Code</div>
                      <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ walletAddress.slice(0, 8) }}...
                      </div>
                    </div>
                  </div>
                  <div v-if="qrCodeError"
                    class="w-full h-full bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                    <div class="text-center text-red-500">
                      <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
                      <div class="text-sm">Failed to load QR Code</div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </div>

        <!-- Success Status Content - Mobile -->
        <div v-else-if="isOrderSuccess"
          class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="text-center space-y-4">
            <div
              class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <i class="pi pi-check text-green-600 dark:text-green-400 text-2xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Your payment of {{ cryptoAmount }} {{ selectedCrypto }} has been confirmed.
              </p>
            </div>
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div class="text-sm text-green-800 dark:text-green-200">
                <div class="font-medium mb-1">Transaction Details:</div>
                <div class="space-y-1 text-xs">
                  <div>Amount: {{ formatCurrency(orderAmount) }}</div>
                  <div>Currency: {{ selectedCrypto }}</div>
                  <div>Network: {{ selectedNetwork }}</div>
                  <div>Order: {{ orderNumber }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Failed Status Content - Mobile -->
        <div v-else-if="isOrderFailed"
          class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <i class="pi pi-times text-red-600 dark:text-red-400 text-2xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Payment Failed</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Your payment could not be processed. Please try again.
              </p>
            </div>
            <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div class="text-sm text-red-800 dark:text-red-200">
                <div class="font-medium mb-1">Order Details:</div>
                <div class="space-y-1 text-xs">
                  <div>Amount: {{ formatCurrency(orderAmount) }}</div>
                  <div>Currency: {{ selectedCrypto }}</div>
                  <div>Order: {{ orderNumber }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cancelled Status Content - Mobile -->
        <div v-else-if="isOrderCancelled"
          class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
              <i class="pi pi-ban text-gray-600 dark:text-gray-400 text-2xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Payment Cancelled</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                This payment has been cancelled.
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="text-sm text-gray-800 dark:text-gray-200">
                <div class="font-medium mb-1">Order Details:</div>
                <div class="space-y-1 text-xs">
                  <div>Amount: {{ formatCurrency(orderAmount) }}</div>
                  <div>Currency: {{ selectedCrypto }}</div>
                  <div>Order: {{ orderNumber }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Payment Status (Legacy) -->
        <div v-if="paymentStatus && !orderDetail">
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
      </div>

      <!-- Action Buttons -->
      <div class="bottom-buttons-container">
        <!-- Back Button -->
        <button @click="goBack" class="bottom-button-dual bottom-button-dual-secondary">
          <i class="pi pi-arrow-left"></i>
          Back
        </button>

        <!-- Refresh Button -->
        <button @click="refreshPayment" :disabled="refreshing"
          class="bottom-button-dual bottom-button-dual-primary flex items-center justify-center space-x-2">
          <i v-if="refreshing" class="pi pi-spin pi-spinner text-sm"></i>
          <i v-else class="pi pi-refresh text-sm"></i>
          <span>{{ refreshing ? 'Refreshing...' : 'Refresh' }}</span>
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
import { useCardStore } from '@/stores/card'
import { OrderAPI, type DepositOrderDetailItem } from '@/api/order'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()

// Payment data
const orderNumber = ref('76782112321321047696')
const orderAmount = ref(1000.00)
const selectedCrypto = ref('ETH')
const selectedNetwork = ref('ERC20')
const cryptoAmount = ref('0.263')
const walletAddress = ref('0xe688b84b23f322a994A53dbF8E15FA82CDB71127')

// Order status and polling
const orderDetail = ref<DepositOrderDetailItem | null>(null)
const orderStatus = ref<string>('INIT') // INIT, PENDING, SUCCESS, FAIL, CANCEL
const pollingInterval = ref<NodeJS.Timeout | null>(null)
const pollingEnabled = ref(true)
const pollingCount = ref(0)

// Component mount status
const isMounted = ref(false)

// UI state
const countdown = ref(1461) // 24:21 in seconds
const qrCodeError = ref(false)
const paymentStatus = ref(false)
const refreshing = ref(false)

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

// Order status computed properties
const isOrderPending = computed(() => orderStatus.value === 'INIT' || orderStatus.value === 'PENDING')
const isOrderSuccess = computed(() => orderStatus.value === 'SUCCESS')
const isOrderFailed = computed(() => orderStatus.value === 'FAIL')
const isOrderCancelled = computed(() => orderStatus.value === 'CANCEL')

// Order status display
const orderStatusText = computed(() => {
  switch (orderStatus.value) {
    case 'INIT': return 'Waiting for Payment'
    case 'PENDING': return 'Processing'
    case 'SUCCESS': return 'Payment Success'
    case 'FAIL': return 'Payment Failed'
    case 'CANCEL': return 'Cancelled'
    default: return 'Unknown Status'
  }
})

const orderStatusColor = computed(() => {
  switch (orderStatus.value) {
    case 'INIT': return 'text-yellow-600'
    case 'PENDING': return 'text-blue-600'
    case 'SUCCESS': return 'text-green-600'
    case 'FAIL': return 'text-red-600'
    case 'CANCEL': return 'text-gray-600'
    default: return 'text-gray-600'
  }
})

const orderStatusBg = computed(() => {
  switch (orderStatus.value) {
    case 'INIT': return 'bg-yellow-50 border-yellow-200'
    case 'PENDING': return 'bg-blue-50 border-blue-200'
    case 'SUCCESS': return 'bg-green-50 border-green-200'
    case 'FAIL': return 'bg-red-50 border-red-200'
    case 'CANCEL': return 'bg-gray-50 border-gray-200'
    default: return 'bg-gray-50 border-gray-200'
  }
})

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


// Start countdown timer
const startCountdown = () => {
  // Clear existing timer if any
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }

  countdownInterval = setInterval(() => {
    // Check if component is still mounted
    if (!isMounted.value) {
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
      return
    }

    if (countdown.value > 0) {
      countdown.value--
    } else {
      // Time expired
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
      // Only show toast if component is still mounted
      if (isMounted.value && toast) {
        toast.add({
          severity: 'warn',
          summary: 'Payment Expired',
          detail: 'Payment time has expired. Please refresh to get a new payment address.',
          life: 5000
        })
      }
    }
  }, 1000)
}

// Connect wallet
const connectWallet = () => {
  // 使用相同的自动打开支付地址逻辑
  autoOpenPaymentAddress()
}

// Go back
const goBack = () => {
  router.back()
}

// Fetch order detail
const fetchOrderDetail = async (isInitialLoad = false) => {
  // Use order number from route query if available, otherwise use current orderNumber
  const orderNum = (route.query.orderNum as string) || orderNumber.value
  if (!orderNum) return

  try {
    const response = await OrderAPI.getDepositOrderDetail({ num: orderNum })
    if (response.success && response.model) {
      const detail = response.model
      orderDetail.value = detail

      // Update order number if it's different from route
      if (orderNumber.value !== orderNum) {
        orderNumber.value = orderNum
      }

      // Update store currentOrder with latest data from API
      if (cardStore.currentOrder) {
        const updatedOrder = {
          ...cardStore.currentOrder,
          orderNum: orderNum,
          webUrl: detail.webUrl,
          // Note: qrcodeLink is not available in getDepositOrderDetail response
          // Keep the existing qrcodeLink from createDepositOrder if available
        }
        cardStore.setCurrentOrder(updatedOrder)
      }

      // Only update order status, don't update other fields to avoid data inconsistency
      const previousStatus = orderStatus.value
      orderStatus.value = detail.status
      // Handle status changes if status actually changed OR if this is initial load
      if (previousStatus !== detail.status || isInitialLoad) {
        handleOrderStatusChange(detail.status)
      }
    }
  } catch (error) {
    console.error('Error fetching order detail:', error)
  }
}

// Handle order status change
const handleOrderStatusChange = (status: string) => {
  // Only handle status changes if component is still mounted
  if (!isMounted.value) return

  // Check if status is one of the final states that should redirect to payment result page
  if (['SUCCESS', 'FAIL', 'CANCEL', 'PENDING'].includes(status)) {
    stopPolling()

    // Navigate to payment result page with the current status
    setTimeout(() => {
      if (isMounted.value) {
        router.push({
          name: 'PaymentResult',
          query: {
            orderNum: orderNumber.value,
            status: status,
            amount: orderAmount.value.toString(),
            currency: selectedCrypto.value,
            network: selectedNetwork.value,
            cryptoAmount: cryptoAmount.value,
            paymentMethod: cardStore.currentOrder?.payType || 'Crypto Payment'
          }
        })
      }
    }, 1000) // Short delay to show the status change
  }
}

// Start polling order detail
const startPolling = () => {
  if (pollingInterval.value) return

  pollingInterval.value = setInterval(async () => {
    // Check if component is still mounted
    if (!isMounted.value) {
      stopPolling()
      return
    }

    if (!pollingEnabled.value) {
      stopPolling()
      return
    }

    pollingCount.value++
    await fetchOrderDetail()

    // Stop polling if order is in final state
    if (['SUCCESS', 'FAIL', 'CANCEL', 'PENDING'].includes(orderStatus.value)) {
      stopPolling()
    }
  }, 5000) // Poll every 5 seconds
}

// Stop polling
const stopPolling = () => {
  pollingEnabled.value = false
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

// Refresh payment
const refreshPayment = async () => {
  refreshing.value = true

  try {
    // Stop and reset polling
    stopPolling()
    pollingCount.value = 0
    pollingEnabled.value = true

    // Stop and reset countdown timer
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
    countdown.value = 1461

    // Reset QR code error state
    qrCodeError.value = false

    // Fetch latest order detail
    await fetchOrderDetail()

    // Restart countdown timer
    startCountdown()

    // Restart polling
    startPolling()

    toast.add({
      severity: 'success',
      summary: 'Payment Refreshed',
      detail: 'Payment details have been refreshed',
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

// Auto open payment address
const autoOpenPaymentAddress = () => {
  if (!cardStore.currentOrder) {
    console.log('No current order in store, skipping auto open')
    return
  }

  const order = cardStore.currentOrder
  const isMobile = window.innerWidth < 768


  // 移动端：优先使用 deeplink，没有则使用 webUrl
  if (isMobile) {
    if (order.deeplink) {
      console.log('Opening deeplink on mobile:', order.deeplink)
      window.open(order.deeplink, '_blank')
      return
    } else if (order.webUrl) {
      console.log('No deeplink available, opening webUrl on mobile:', order.webUrl)
      window.open(order.webUrl, '_blank')
      return
    }
  } else {
    // 桌面端：直接使用 webUrl
    if (order.webUrl) {
      console.log('Opening webUrl on desktop:', order.webUrl)
      window.open(order.webUrl, '_blank')
      return
    }
  }

  console.log('No payment address available for auto open')
}

// Initialize data from Pinia store
onMounted(async () => {
  isMounted.value = true

  // Get payment data from Pinia store
  if (cardStore.currentOrder) {
    const order = cardStore.currentOrder
    // Use order number from route query if available, otherwise use store
    orderNumber.value = (route.query.orderNum as string) || order.orderNum || '76782112321321047696'
    orderAmount.value = parseFloat(order.amount) || 1000.00
    selectedCrypto.value = order.currency || 'ETH'
    selectedNetwork.value = order.network || 'ERC20'
    cryptoAmount.value = order.cryptoAmount || '0.263'
    walletAddress.value = order.address || order.webUrl || '0xe688b84b23f322a994A53dbF8E15FA82CDB71127'
  } else {
    // Fallback to route params if no order in store
    const orderNum = route.query.orderNum as string
    if (orderNum) {
      orderNumber.value = orderNum
    }

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
  }

  autoOpenPaymentAddress()
  // Start countdown
  startCountdown()

  // Fetch initial order detail
  await fetchOrderDetail(true)

  // Start polling order detail
  startPolling()
})

// Cleanup on unmount
onUnmounted(() => {
  isMounted.value = false

  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  stopPolling()
})
</script>

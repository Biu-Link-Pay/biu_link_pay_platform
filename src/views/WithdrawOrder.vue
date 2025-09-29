<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Unified Header -->
    <AppHeader title="Withdraw" :show-title="true" />

    <!-- Main Content -->
    <div class="w-full max-w-2xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <!-- Desktop Layout -->
      <div class="hidden md:block">
        <div class="max-w-4xl xl:max-w-5xl mx-auto space-y-8">
          <!-- Withdraw Summary -->
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-white shadow-xl">
            <div class="absolute -top-16 -right-20 w-56 h-56 bg-white/15 blur-3xl rounded-full"></div>
            <div class="absolute -bottom-20 -left-10 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
            <div class="relative px-10 py-12 text-center flex flex-col items-center space-y-4">
              <span class="text-sm uppercase tracking-widest text-white/80">Withdraw Amount</span>
              <div v-if="!cardDetail" class="text-5xl font-extrabold tracking-tight">
                <i class="pi pi-spin pi-spinner mr-2"></i>Loading...
              </div>
              <div v-else class="text-5xl font-extrabold tracking-tight">{{ formatCurrency(withdrawAmount) }}</div>
              <div class="text-sm text-white/80">
                From card ending in {{ cardInfo.cardNo ? cardInfo.cardNo.slice(-4) : '****' }}
              </div>
              <div class="mt-6 inline-flex items-center px-4 py-2 rounded-full text-sm text-white/90 bg-white/15 backdrop-blur-sm">
                <i class="pi pi-shield mr-2 text-white/90"></i>
                Secure withdrawal to {{ selectedToken }} network
              </div>
            </div>
          </div>

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
                  <i class="pi pi-info-circle text-gray-400 text-sm"></i>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="flex-1">
                    <InputText
                      type="number"
                      placeholder="0.00"
                      class="w-full text-lg"
                      :class="{ 'p-invalid': errors.withdrawAmount }"
                      :model-value="withdrawAmount.toString()"
                      @update:model-value="(value: string | undefined) => withdrawAmount = parseFloat(value || '0') || 0"
                    />
                  </div>
                  <Button
                    label="Max"
                    size="small"
                    severity="secondary"
                    @click="setMaxAmount"
                  />
                  <Button
                    :label="selectedCurrency"
                    icon="pi pi-dollar"
                    size="small"
                    severity="secondary"
                    @click="showCurrencySelector = true"
                  />
                </div>
                <small v-if="errors.withdrawAmount" class="text-red-500">{{ errors.withdrawAmount }}</small>
                
                <!-- Balance Info -->
                <div class="mt-3 space-y-2">
                  <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Available: {{ formatCurrency(balance) }}</span>
                    <span>Min: {{ formatCurrency(minimumBalance) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Max withdraw: {{ formatCurrency(getMaxWithdrawAmount()) }}</span>
                    <span v-if="cardInfo.maxOnDaily > 0" class="text-xs">Daily limit: {{ formatCurrency(cardInfo.maxOnDaily) }}</span>
                  </div>
                </div>
              </div>

              <!-- Receive Amount Section -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <div class="flex items-center space-x-2 mb-4">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Receive amount</label>
                  <i class="pi pi-info-circle text-gray-400 text-sm"></i>
                </div>
                
                <!-- Loading State -->
                <div v-if="loading" class="flex flex-col items-center justify-center gap-3 py-8 text-center">
                  <i class="pi pi-spin pi-spinner text-2xl text-blue-600 dark:text-blue-400"></i>
                  <span class="text-gray-600 dark:text-gray-400">Loading payment methods...</span>
                </div>

                <!-- Payment Methods Grid -->
                <div v-else class="space-y-4">
                  <div
                    v-for="payType in paymentMethods"
                    :key="payType.name"
                    class="border border-gray-200 dark:border-gray-600 rounded-xl p-5 cursor-pointer transition-all duration-200"
                    :class="selectedPayType?.name === payType.name 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 shadow-md ring-2 ring-blue-100 dark:ring-blue-800/60' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-sm'"
                    @click="selectPayType(payType)"
                  >
                    <div class="flex flex-col gap-4">
                      <div class="flex items-center space-x-4">
                        <div class="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-600">
                          <img
                            v-if="payType.img"
                            :src="payType.img"
                            :alt="payType.name"
                            class="w-full h-full object-cover"
                          />
                          <div v-else class="w-full h-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center">
                            <span class="text-white font-bold text-lg">{{ payType.name }}</span>
                          </div>
                        </div>
                        <div>
                          <div class="font-semibold text-gray-900 dark:text-white text-lg">{{ payType.name }}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">{{ payType.cryptoNetworks?.length || 0 }} crypto networks</div>
                        </div>
                      </div>

                      <div v-if="selectedPayType?.name === payType.name" class="flex items-center gap-3 text-blue-600 self-start">
                        <span class="text-sm font-medium">Currently selected</span>
                        <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                          <i class="pi pi-check text-white text-xs"></i>
                        </div>
                      </div>
                    </div>

                    <!-- Network Selection (Second Level) - matching PaymentMethodSelection.vue structure -->
                    <div
                      v-if="selectedPayType?.name === payType.name"
                      class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                    >
                      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
                        <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Available Networks</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">Selected: {{ selectedCrypto ? selectedCrypto.crypto.name + '-' + selectedCrypto.network.name : 'None' }}</span>
                      </div>
                      <div class="grid grid-cols-1 gap-3">
                        <div
                          v-for="crypto in payType.cryptoNetworks"
                          :key="crypto.crypto.name + '-' + crypto.network.name"
                          class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 border border-transparent"
                          :class="[
                            selectedCrypto && selectedCrypto.crypto.name === crypto.crypto.name && selectedCrypto.network.name === crypto.network.name ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          ]"
                          @click.stop="selectCrypto(crypto)"
                        >
                          <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-600">
                              <img
                                v-if="crypto.crypto.logoUrl"
                                :src="crypto.crypto.logoUrl"
                                :alt="crypto.crypto.name"
                                class="w-full h-full object-cover"
                              />
                              <div v-else class="w-full h-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center">
                                <span class="text-white font-bold text-sm">{{ crypto.crypto.name.charAt(0) }}</span>
                              </div>
                            </div>
                            <div>
                              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ crypto.crypto.fullName }}</div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">{{ crypto.network.fullName }}</div>
                              <div class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                Limit: ${{ crypto.minLimit }} - ${{ crypto.maxLimit }}
                              </div>
                            </div>
                          </div>

                          <div
                            v-if="selectedCrypto && selectedCrypto.crypto.name === crypto.crypto.name && selectedCrypto.network.name === crypto.network.name"
                            class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center"
                          >
                            <i class="pi pi-check text-white text-xs"></i>
                          </div>
                          <div v-else class="w-7 h-7 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Receive Amount Display -->
                <div class="mt-4 flex items-center space-x-3">
                  <div class="flex-1">
                    <InputText
                      type="number"
                      placeholder="0.00"
                      readonly
                      class="w-full text-lg bg-white dark:bg-gray-800"
                      :model-value="receiveAmount.toString()"
                    />
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ selectedToken }}
                  </div>
                </div>
              </div>

              <!-- Exchange Rate Info -->
              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-medium text-blue-800 dark:text-blue-200">Exchange Summary</span>
                  <div class="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
                    <i class="pi pi-clock"></i>
                    <span>Rate expires in 15s</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-blue-700 dark:text-blue-300">You will receive</span>
                    <span class="font-semibold text-blue-900 dark:text-blue-100">{{ receiveAmount }} {{ selectedToken }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-blue-700 dark:text-blue-300">From</span>
                    <span class="font-semibold text-blue-900 dark:text-blue-100">{{ formatCurrency(withdrawAmount) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-blue-700 dark:text-blue-300">Network fee</span>
                    <span class="font-semibold text-blue-900 dark:text-blue-100">{{ networkFee }} {{ selectedToken }}</span>
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
                <InputText
                  v-model="recipientAddress"
                  :placeholder="selectedCrypto ? `Enter ${selectedCrypto.network.fullName || selectedCrypto.network.name} address` : 'Enter recipient wallet address'"
                  class="w-full"
                  :class="{ 'p-invalid': errors.recipientAddress }"
                />
                <small v-if="errors.recipientAddress" class="text-red-500">{{ errors.recipientAddress }}</small>
                <small v-else-if="selectedCrypto && selectedCrypto.network && selectedCrypto.network.addressRegex" class="text-gray-500 text-xs mt-1 block">
                  Address must match {{ selectedCrypto.network.fullName || selectedCrypto.network.name }} format
                </small>
              </div>

              <!-- Network Selection -->
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Network</label>
                <div class="flex items-center space-x-3">
                  <div class="flex-1">
                    <InputText
                      v-model="selectedNetwork"
                      readonly
                      class="w-full"
                    />
                  </div>
                  <Button
                    icon="pi pi-chevron-down"
                    size="small"
                    severity="secondary"
                    @click="showNetworkSelector = true"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Withdraw Button -->
          <Button
            label="Withdraw"
            icon="pi pi-send"
            class="w-full"
            size="large"
            :disabled="!isFormValid"
            :loading="isSubmitting"
            @click="handleWithdraw"
          />
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="md:hidden space-y-4 pb-32">
        <!-- Balance Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <i class="pi pi-credit-card text-blue-600 dark:text-blue-400"></i>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Balance</div>
                <div v-if="!cardDetail" class="text-lg font-bold text-gray-900 dark:text-white">
                  <i class="pi pi-spin pi-spinner mr-2"></i>Loading...
                </div>
                <div v-else class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(balance) }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ cardInfo.cardNo ? cardInfo.cardNo.slice(-4) : '**** 3683' }}</div>
            </div>
          </div>
        </div>

        <!-- Minimum Balance Notice -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div class="flex items-start space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <i class="pi pi-info text-white text-xs"></i>
            </div>
            <div class="text-xs text-blue-800 dark:text-blue-200">
              The balance in the card must be at least {{ formatCurrency(minimumBalance) }}
            </div>
          </div>
        </div>

        <!-- Withdraw Amount -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-2 mb-3">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Withdraw amount</label>
            <i class="pi pi-info-circle text-gray-400 text-xs"></i>
          </div>
          <div class="flex items-center space-x-2">
            <div class="flex-1">
              <InputText
                type="number"
                placeholder="0.00"
                class="w-full"
                :class="{ 'p-invalid': errors.withdrawAmount }"
                :model-value="withdrawAmount.toString()"
                @update:model-value="(value: string | undefined) => withdrawAmount = parseFloat(value || '0') || 0"
              />
            </div>
            <Button
              label="Max"
              size="small"
              severity="secondary"
              @click="setMaxAmount"
            />
            <Button
              :label="selectedCurrency"
              icon="pi pi-dollar"
              size="small"
              severity="secondary"
              @click="showCurrencySelector = true"
            />
          </div>
          <small v-if="errors.withdrawAmount" class="text-red-500 text-xs">{{ errors.withdrawAmount }}</small>
        </div>

        <!-- Receive Amount -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Receive amount</label>
          <div class="flex items-center space-x-2">
            <div class="flex-1">
              <InputText
                type="number"
                placeholder="0.00"
                readonly
                class="w-full"
                :model-value="receiveAmount.toString()"
              />
            </div>
            <Button
              :label="selectedToken"
              :icon="getTokenIcon(selectedToken)"
              size="small"
              severity="secondary"
              @click="showTokenSelector = true"
            />
          </div>
          
          <!-- Mobile Network Selection -->
          <div v-if="selectedPayType && selectedPayType.cryptoNetworks && selectedPayType.cryptoNetworks.length > 0" class="mt-3">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">Network</label>
            <div class="flex flex-wrap gap-2">
              <Button
                v-for="crypto in selectedPayType.cryptoNetworks"
                :key="crypto.crypto.name + '-' + crypto.network.name"
                :label="crypto.crypto.name + '-' + crypto.network.name"
                size="small"
                :severity="selectedCrypto && selectedCrypto.crypto.name === crypto.crypto.name && selectedCrypto.network.name === crypto.network.name ? 'primary' : 'secondary'"
                @click="selectCrypto(crypto)"
              />
            </div>
          </div>
        </div>

        <!-- Exchange Rate Info -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-600 dark:text-gray-400">
              You will receive <span class="font-semibold">{{ receiveAmount }} {{ selectedToken }}</span> from <span class="font-semibold">{{ formatCurrency(withdrawAmount) }}</span>
            </span>
            <div class="flex items-center space-x-1 text-xs text-gray-500">
              <i class="pi pi-clock"></i>
              <span>15s</span>
            </div>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-600 dark:text-gray-400">Network fee</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ networkFee }} {{ selectedToken }}</span>
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
          <InputText
            v-model="recipientAddress"
            :placeholder="selectedCrypto ? `Enter ${selectedCrypto.network.fullName || selectedCrypto.network.name} address` : 'Address required'"
            class="w-full"
            :class="{ 'p-invalid': errors.recipientAddress }"
          />
          <small v-if="errors.recipientAddress" class="text-red-500 text-xs">{{ errors.recipientAddress }}</small>
          <small v-else-if="selectedCrypto && selectedCrypto.network && selectedCrypto.network.addressRegex" class="text-gray-500 text-xs mt-1 block">
            Address must match {{ selectedCrypto.network.fullName || selectedCrypto.network.name }} format
          </small>
        </div>

        <!-- Network Selection -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Network</label>
          <div class="flex items-center space-x-2">
            <div class="flex-1">
              <InputText
                v-model="selectedNetwork"
                readonly
                class="w-full"
              />
            </div>
            <Button
              icon="pi pi-chevron-down"
              size="small"
              severity="secondary"
              @click="showNetworkSelector = true"
            />
          </div>
        </div>

        <!-- Withdraw Button -->
        <Button
          label="Withdraw"
          icon="pi pi-send"
          class="w-full"
          size="large"
          :disabled="!isFormValid"
          :loading="isSubmitting"
          @click="handleWithdraw"
        />
      </div>
    </div>

    <!-- Currency Selector Dialog -->
    <Dialog v-model:visible="showCurrencySelector" modal header="Select Currency" class="w-96">
      <div class="space-y-2">
        <div
          v-for="currency in currencies"
          :key="currency"
          class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': selectedCurrency === currency }"
          @click="selectCurrency(currency)"
        >
          <span class="font-medium">{{ currency }}</span>
          <i v-if="selectedCurrency === currency" class="pi pi-check text-blue-600"></i>
        </div>
      </div>
    </Dialog>

    <!-- Token Selector Dialog -->
    <Dialog v-model:visible="showTokenSelector" modal header="Select Token" class="w-96">
      <div class="space-y-2">
        <div
          v-for="token in tokens"
          :key="token"
          class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': selectedToken === token }"
          @click="selectToken(token)"
        >
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="getTokenBg(token)">
              <span class="text-white font-bold text-sm">{{ getTokenIcon(token) }}</span>
            </div>
            <span class="font-medium">{{ token }}</span>
          </div>
          <i v-if="selectedToken === token" class="pi pi-check text-blue-600"></i>
        </div>
      </div>
    </Dialog>

    <!-- Network Selector Dialog -->
    <Dialog v-model:visible="showNetworkSelector" modal header="Select Network" class="w-96">
      <div class="space-y-2">
        <div
          v-for="network in networks"
          :key="network"
          class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': selectedNetwork === network }"
          @click="selectNetwork(network)"
        >
          <span class="font-medium">{{ network }}</span>
          <i v-if="selectedNetwork === network" class="pi pi-check text-blue-600"></i>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import AppHeader from '@/components/AppHeader.vue'
import { OrderAPI } from '@/api/order'
import { useCardStore } from '@/stores/card'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cardStore = useCardStore()

// Card information from route query
const cardInfo = ref({
  cardId: '',
  cardNo: '',
  cardCurrency: 'USD',
  maxOnDaily: 0,
  maxOnMonthly: 0,
  maxOnPercent: 0
})

// Payment methods from API
const paymentMethods = ref<any[]>([])
const loading = ref(false)

// Form data
const balance = ref(0.00)
const minimumBalance = ref(1.00)
const withdrawAmount = ref(0)
const receiveAmount = ref(0)
const recipientAddress = ref('')
const selectedCurrency = ref('USD')
const selectedToken = ref('TPT')
const selectedNetwork = ref('BNB Chain (BEP20)')
const networkFee = ref(12)

// Two-level selection for payment methods (matching PaymentMethodSelection.vue structure)
const selectedPayType = ref<any>(null)
const selectedCrypto = ref<any>(null)

// Debug: Watch payment selection changes
watch([selectedPayType, selectedCrypto], ([newPayType, newCrypto], [oldPayType, oldCrypto]) => {
  console.log('Payment selection changed:', {
    payType: { from: oldPayType?.name, to: newPayType?.name },
    crypto: { from: oldCrypto?.crypto?.name, to: newCrypto?.crypto?.name }
  })
})

// Debug: Watch loading state changes
watch(loading, (newValue, oldValue) => {
  console.log('Loading state changed:', { from: oldValue, to: newValue })
})

// Watch for address changes to validate in real-time
watch([recipientAddress, selectedCrypto], ([newAddress, newCrypto], [oldAddress, oldCrypto]) => {
  if (newAddress && newCrypto && newCrypto.network && newCrypto.network.addressRegex) {
    // 清除之前的错误
    if (errors.value.recipientAddress && errors.value.recipientAddress.includes('Invalid address format')) {
      errors.value.recipientAddress = ''
    }
    
    // 实时验证地址格式
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

// Card detail from cache
const cardDetail = ref<any>(null)

// UI state
const showCurrencySelector = ref(false)
const showTokenSelector = ref(false)
const showNetworkSelector = ref(false)
const isSubmitting = ref(false)

// Form validation
const errors = ref({
  withdrawAmount: '',
  recipientAddress: ''
})

// Options
const currencies = ['USD', 'EUR', 'GBP', 'CNY']
const tokens = ['TPT', 'USDT', 'USDC', 'BNB', 'ETH']
const networks = ['BNB Chain (BEP20)', 'Ethereum (ERC20)', 'Polygon (MATIC)', 'Arbitrum']

// Computed properties
const isFormValid = computed(() => {
  return withdrawAmount.value > 0 && 
         recipientAddress.value.length > 0 && 
         withdrawAmount.value >= minimumBalance.value &&
         withdrawAmount.value <= balance.value &&
         withdrawAmount.value <= getMaxWithdrawAmount() &&
         selectedPayType.value !== null &&
         selectedCrypto.value !== null
})

// Calculate maximum withdraw amount based on card balance
const getMaxWithdrawAmount = () => {
  if (!cardDetail.value) return balance.value
  
  // 最大提现金额应该等于卡片余额
  const cardBalance = (cardDetail.value as any).cardBalance || 0
  const availableBalance = parseFloat(cardBalance.toString()) || 0
  
  // 考虑日限额和单笔限额，但最大不超过卡片余额
  const maxDaily = cardInfo.value.maxOnDaily || availableBalance
  const maxPercent = cardInfo.value.maxOnPercent || availableBalance
  
  // 返回可用余额、日限额、单笔限额中的最小值，但不超过卡片余额
  return Math.min(availableBalance, maxDaily, maxPercent)
}

// Methods
const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const setMaxAmount = () => {
  withdrawAmount.value = getMaxWithdrawAmount()
}

const selectCurrency = (currency: string) => {
  selectedCurrency.value = currency
  showCurrencySelector.value = false
}

// Select payment method (matching PaymentMethodSelection.vue)
const selectPayType = (payType: any) => {
  selectedPayType.value = payType
  selectedToken.value = payType.name
  
  // Auto-select first crypto network if available
  if (payType.cryptoNetworks && payType.cryptoNetworks.length > 0) {
    selectedCrypto.value = payType.cryptoNetworks[0]
    selectedNetwork.value = payType.cryptoNetworks[0].network.name || payType.cryptoNetworks[0].network.fullName
  } else {
    selectedCrypto.value = null
    selectedNetwork.value = ''
  }
  
  showTokenSelector.value = false
}

// Select crypto currency (matching PaymentMethodSelection.vue)
const selectCrypto = (crypto: any) => {
  selectedCrypto.value = crypto
  selectedNetwork.value = crypto.network.name || crypto.network.fullName
  showNetworkSelector.value = false
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

const getTokenIcon = (token: string) => {
  switch (token) {
    case 'TPT': return 'T'
    case 'USDT': return 'T'
    case 'USDC': return 'C'
    case 'BNB': return 'B'
    case 'ETH': return 'Ξ'
    default: return '$'
  }
}

const getTokenBg = (token: string) => {
  switch (token) {
    case 'TPT': return 'bg-blue-500'
    case 'USDT': return 'bg-green-500'
    case 'USDC': return 'bg-blue-400'
    case 'BNB': return 'bg-yellow-500'
    case 'ETH': return 'bg-blue-600'
    default: return 'bg-gray-500'
  }
}

const validateForm = () => {
  errors.value = {
    withdrawAmount: '',
    recipientAddress: ''
  }

  if (withdrawAmount.value <= 0) {
    errors.value.withdrawAmount = 'Amount must be greater than 0'
  } else if (withdrawAmount.value < minimumBalance.value) {
    errors.value.withdrawAmount = `Amount must be at least ${formatCurrency(minimumBalance.value)}`
  } else if (withdrawAmount.value > balance.value) {
    errors.value.withdrawAmount = 'Amount exceeds available balance'
  } else if (withdrawAmount.value > getMaxWithdrawAmount()) {
    errors.value.withdrawAmount = `Amount exceeds maximum withdraw limit of ${formatCurrency(getMaxWithdrawAmount())}`
  } else if (cardInfo.value.maxOnDaily && withdrawAmount.value > cardInfo.value.maxOnDaily) {
    errors.value.withdrawAmount = `Amount exceeds daily limit of ${formatCurrency(cardInfo.value.maxOnDaily)}`
  } else if (cardInfo.value.maxOnPercent && withdrawAmount.value > cardInfo.value.maxOnPercent) {
    errors.value.withdrawAmount = `Amount exceeds single transaction limit of ${formatCurrency(cardInfo.value.maxOnPercent)}`
  }

  if (!recipientAddress.value) {
    errors.value.recipientAddress = 'Recipient address is required'
  } else {
    // 使用 network.addressRegex 进行地址格式验证
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
      // 如果没有正则表达式，使用基本的长度验证
      errors.value.recipientAddress = 'Invalid address format'
    }
  }
}

const handleWithdraw = async () => {
  validateForm()
  
  if (!isFormValid.value) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please check the form and try again',
      life: 3000
    })
    return
  }

  if (!cardInfo.value.cardId) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Card information is missing. Please go back and try again.',
      life: 3000
    })
    return
  }

  // Validate two-level selection
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

  // Validate address format using network regex before submission
  if (!recipientAddress.value) {
    toast.add({
      severity: 'error',
      summary: 'Address Required',
      detail: 'Please enter a recipient address.',
      life: 3000
    })
    return
  }

  // Address regex validation for submission control
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
    console.log('Address validation passed on submission:', {
      address: recipientAddress.value,
      network: selectedCrypto.value.network.fullName || selectedCrypto.value.network.name,
      regex: selectedCrypto.value.network.addressRegex,
      isValid: true
    })
  } else {
    // Fallback validation if no regex is available
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
    // Create withdraw order using OrderAPI with two-level selection data
    const response = await OrderAPI.createWithdrawOrder({
      cardPattern: '1', // 1:虚拟卡 2:实体卡 - assuming virtual card
      type: '1', // 1:提现 2:退款
      cardId: cardInfo.value.cardId,
      token: selectedCrypto.value.crypto.name, // token
      network: selectedCrypto.value.network.name, // Network
      address: recipientAddress.value
    })
    
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Withdraw Order Created',
        detail: `Order #${response.model} has been submitted successfully`,
        life: 3000
      })
      
      // Navigate back to cards page
      router.push('/my-cards')
    } else {
      throw new Error(response.msg || 'Failed to create withdraw order')
    }
  } catch (error) {
    console.error('Withdraw error:', error)
    toast.add({
      severity: 'error',
      summary: 'Withdraw Failed',
      detail: error instanceof Error ? error.message : 'Failed to create withdraw order. Please try again.',
      life: 3000
    })
  } finally {
    isSubmitting.value = false
  }
}

// Initialize card information from route query
const initializeCardInfo = () => {
  if (route.query.cardId) {
    cardInfo.value = {
      cardId: route.query.cardId as string,
      cardNo: route.query.cardNo as string || '',
      cardCurrency: route.query.cardCurrency as string || 'USD',
      maxOnDaily: parseFloat(route.query.maxOnDaily as string) || 0,
      maxOnMonthly: parseFloat(route.query.maxOnMonthly as string) || 0,
      maxOnPercent: parseFloat(route.query.maxOnPercent as string) || 0
    }
    
    // Set currency based on card currency
    selectedCurrency.value = cardInfo.value.cardCurrency
    minimumBalance.value = 1.00
  }
}

// Validate and get card details from Pinia store
const validateAndLoadCardDetails = () => {
  // 从 Pinia store 获取缓存的当前卡片详情
  const cachedCardDetail = cardStore.getCachedCurrentCardDetail()
  
  if (!cachedCardDetail) {
    console.warn('No cached card detail found, redirecting to MyCards')
    toast.add({
      severity: 'error',
      summary: '验证失败',
      detail: '未经过安全验证，请返回重新操作',
      life: 3000
    })
    router.push('/my-cards')
    return false
  }
  
  // 验证路由参数中的卡号是否与缓存的卡片详情匹配
  const routeCardNo = route.query.cardNo as string
  const cachedCardNo = cachedCardDetail.cardNo
  
  if (!routeCardNo || !cachedCardNo || routeCardNo !== cachedCardNo) {
    console.warn('Card number mismatch:', { routeCardNo, cachedCardNo })
    toast.add({
      severity: 'error',
      summary: '验证失败',
      detail: '卡片信息不匹配，请返回重新操作',
      life: 3000
    })
    router.push('/my-cards')
    return false
  }
  
  // 验证卡片 ID 是否匹配
  const routeCardId = route.query.cardId as string
  const cachedCardId = cachedCardDetail.cardId
  
  if (!routeCardId || !cachedCardId || routeCardId !== cachedCardId) {
    console.warn('Card ID mismatch:', { routeCardId, cachedCardId })
    toast.add({
      severity: 'error',
      summary: '验证失败',
      detail: '卡片信息不匹配，请返回重新操作',
      life: 3000
    })
    router.push('/my-cards')
    return false
  }
  
  // 验证通过，设置卡片详情
  cardDetail.value = cachedCardDetail
  
  // 从缓存的卡片详情中提取余额信息 (使用 cardBalance 字段)
  const cardBalance = (cachedCardDetail as any).cardBalance || 0
  balance.value = parseFloat(cardBalance.toString()) || 0
  
  // 更新卡片信息为缓存中的详细信息
  cardInfo.value = {
    cardId: cachedCardDetail.cardId,
    cardNo: cachedCardDetail.cardNo,
    cardCurrency: cachedCardDetail.cardCurrency,
    maxOnDaily: cardInfo.value.maxOnDaily, // 保留路由中的限制信息
    maxOnMonthly: cardInfo.value.maxOnMonthly,
    maxOnPercent: cardInfo.value.maxOnPercent
  }
  
  // 设置货币
  selectedCurrency.value = cachedCardDetail.cardCurrency
  
  console.log('Card details loaded from cache:', {
    cardId: cachedCardDetail.cardId,
    cardNo: cachedCardDetail.cardNo,
    cardBalance: cardBalance,
    balance: balance.value,
    currency: cachedCardDetail.cardCurrency,
    maxWithdrawAmount: getMaxWithdrawAmount()
  })
  
  return true
}

// Watch for form changes to update receive amount
watch([withdrawAmount, selectedToken], () => {
  // TODO: Implement actual exchange rate calculation
  const rate = 101.4 // Mock exchange rate
  receiveAmount.value = Math.floor(withdrawAmount.value * rate)
})

// Fetch payment methods from API
const fetchPaymentMethods = async () => {
  loading.value = true
  try {
    console.log('Fetching payment methods for withdrawal...')
    
    // 调用 OrderAPI 获取提现支付方式 (orderType: 'OUT' 表示提现)
    const response = await OrderAPI.getPaymentMethods({
      orderType: 'OUT'
    })
    
    loading.value = false
    if (response.success && response.model && response.model.payTypes) {
      paymentMethods.value = response.model.payTypes
      console.log('Payment methods loaded:', response.model.payTypes)
      // Auto-select first payment method if available (matching PaymentMethodSelection.vue)
      if (response.model.payTypes.length > 0) {
        selectedPayType.value = response.model.payTypes[0]
        console.log('Auto-selected payment method:', response.model.payTypes[0].name)
        
        // Auto-select first crypto network of the first payment method
        if (response.model.payTypes[0].cryptoNetworks && response.model.payTypes[0].cryptoNetworks.length > 0) {
          selectedCrypto.value = response.model.payTypes[0].cryptoNetworks[0]
          selectedToken.value = response.model.payTypes[0].cryptoNetworks[0].crypto.name
          selectedNetwork.value = response.model.payTypes[0].cryptoNetworks[0].network.name || response.model.payTypes[0].cryptoNetworks[0].network.fullName
          console.log('Auto-selected crypto network:', response.model.payTypes[0].cryptoNetworks[0].crypto.name)
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
      detail: 'Failed to load payment methods, using defaults',
      life: 3000
    })
    
    // Fallback to default tokens if API fails
    paymentMethods.value = tokens.map(token => ({
      name: token,
      img: null,
      cryptoNetworks: []
    }))
    
    // Initialize with first fallback token
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
  console.log('WithdrawOrder mounted, starting initialization...')
  
  initializeCardInfo()
  
  // 验证并加载卡片详情（从 Pinia store）
  const isValid = validateAndLoadCardDetails()
  console.log('Card validation result:', isValid)
  
  // 只有验证通过才继续加载其他数据
  if (isValid) {
    console.log('Card validation passed, fetching payment methods...')
    await fetchPaymentMethods()
  } else {
    console.log('Card validation failed, skipping payment methods fetch')
    // 确保loading状态被正确重置
    loading.value = false
  }
})
</script>
